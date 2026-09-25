type Job = {
  text: string;
  done: boolean;
  error?: string;
};

type Start = {
  mode: string;
  voice: boolean;
  messages: { role: string; content: unknown }[];
};

function bucket() {
  const g = globalThis as typeof globalThis & { __mashJobs?: Map<string, Job> };
  g.__mashJobs ??= new Map();
  return g.__mashJobs;
}

export function readJob(id: string) {
  return bucket().get(id) ?? null;
}

export function startChatJob(input: Start & { id?: string }) {
  const id = input.id && /^[0-9a-f-]{16,}$/i.test(input.id) ? input.id : crypto.randomUUID();
  if (!bucket().has(id)) {
    bucket().set(id, { text: "", done: false });
    setTimeout(() => void fill(id, input), 0);
  }
  return id;
}

async function fill(id: string, input: Start) {
  const job = bucket().get(id);
  if (!job) return;
  const apiKey = process.env.HF_TOKEN;
  if (!apiKey) {
    job.error = "AI is not available right now.";
    job.done = true;
    return;
  }
  const maxTokens = input.voice ? 80 : input.mode === "chat" ? 1200 : 4000;
  try {
    const upstream = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:fastest",
        stream: true,
        temperature: input.voice ? 0.3 : input.mode === "chat" ? 0.4 : 0.2,
        max_tokens: maxTokens,
        messages: input.messages,
      }),
    });
    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => "");
      job.error = /spending-limit|out of credits/i.test(detail)
        ? "Grok is out of credits on this app, so it cannot answer yet. Add credits, then send it again."
        : `mash is busy (${upstream.status}). Try again.`;
      job.done = true;
      return;
    }
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    let cut = false;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const json = JSON.parse(data) as {
            choices?: { delta?: { content?: string }; finish_reason?: string | null }[];
          };
          const choice = json.choices?.[0];
          const token = choice?.delta?.content;
          if (typeof token === "string" && token) job.text += token;
          if (choice?.finish_reason === "length") cut = true;
        } catch {
          /* keepalive */
        }
      }
    }
    if (cut) job.text += "\n\nSay continue and I’ll finish the rest.";
  } catch {
    if (!job.text) job.error = "Could not reach mash.";
  } finally {
    job.done = true;
    setTimeout(() => bucket().delete(id), 20 * 60 * 1000);
  }
}
