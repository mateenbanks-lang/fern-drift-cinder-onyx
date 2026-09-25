import {
  CHAT_FALLBACK,
  CHAT_MODEL,
  VISION_MODEL,
  OPENROUTER_BASE,
  openRouterError,
  openRouterHeaders,
  openRouterKey,
} from "./openrouter";

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

function hasVision(messages: Start["messages"]) {
  return messages.some((m) => Array.isArray(m.content));
}

async function fill(id: string, input: Start) {
  const job = bucket().get(id);
  if (!job) return;
  const apiKey = openRouterKey();
  if (!apiKey) {
    job.error = "AI is not available right now.";
    job.done = true;
    return;
  }
  const vision = hasVision(input.messages);
  const model = vision ? VISION_MODEL : CHAT_MODEL;
  const models = vision ? [VISION_MODEL, CHAT_FALLBACK] : [CHAT_MODEL, CHAT_FALLBACK];
  const maxTokens = input.voice ? 80 : input.mode === "chat" ? 1200 : 4000;
  try {
    const upstream = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: openRouterHeaders(apiKey),
      body: JSON.stringify({
        model,
        models,
        stream: true,
        temperature: input.voice ? 0.3 : input.mode === "chat" ? 0.4 : 0.2,
        max_tokens: maxTokens,
        messages: input.messages,
      }),
    });
    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => "");
      job.error = openRouterError(detail, upstream.status);
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
            error?: { message?: string };
            choices?: {
              delta?: { content?: string | null; reasoning?: string | null };
              finish_reason?: string | null;
            }[];
          };
          if (json.error?.message && !job.text) job.error = json.error.message;
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
