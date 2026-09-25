import { readJob, startChatJob } from "@/lib/mash/job-store";
import { createFileRoute } from "@tanstack/react-router";

const chatHits: number[] = [];

type InMsg = {
  role: "user" | "assistant";
  content: string;
  image?: string;
  images?: string[];
};

function limited() {
  const now = Date.now();
  while (chatHits.length && now - chatHits[0] > 60_000) chatHits.shift();
  if (chatHits.length >= 18) return true;
  chatHits.push(now);
  return false;
}

function systemPrompt(mode: string, voice: boolean) {
  if (voice) {
    return "You are Grok, speaking inside mash. One short spoken sentence. The answer first. No markdown.";
  }
  if (mode === "document") {
    return "You are Grok. Design the document they asked for. Inside one closed ```pdf fence, start with @theme navy or gold or forest or ink or rose or slate, then @kicker, a # title, ## sections, bullets, and a markdown table when there are figures. One sentence before the fence.";
  }
  if (mode === "code" || mode === "build") {
    return "You are Grok. Build the real page they asked for, complete and correct, not a sketch. End with one closed ```html fence that is a full document they can preview. No TODOs and no lorem. One sentence before the fence.";
  }
  return "You are Grok, answering inside mash. Reply the way you would to the person directly: correct, specific, and quick. Lead with the answer. Use \\[ \\] for an equation on its own line and \\( \\) for a symbol inside a sentence. If they want a website, end with one closed ```html document. If they want a designed PDF, end with one closed ```pdf fence. Match their language, including Roman Urdu. Do not invent citations.";
}

function contentOf(message: InMsg, withImage: boolean) {
  const text = message.content.slice(0, 8000);
  const pics = [...(message.images ?? []), ...(message.image ? [message.image] : [])]
    .filter((url) => url.startsWith("data:image/") || url.startsWith("http"))
    .slice(0, 20);
  if (!withImage || !pics.length) return text;
  return [
    { type: "text", text: text || "Look at these images." },
    ...pics.map((url) => ({ type: "image_url", image_url: { url: url.slice(0, 180_000) } })),
  ];
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.HF_TOKEN;
        if (!apiKey) {
          return Response.json({ error: "AI is not available right now." }, { status: 503 });
        }
        if (limited()) {
          return Response.json({ error: "Short pause after heavy use." }, { status: 429 });
        }

        let body: { id?: string; mode?: string; voice?: boolean; messages?: InMsg[] };
        try {
          body = (await request.json()) as { id?: string; mode?: string; voice?: boolean; messages?: InMsg[] };
        } catch {
          return Response.json({ error: "Bad request." }, { status: 400 });
        }

        const mode =
          body.mode === "code" || body.mode === "build" || body.mode === "document" ? body.mode : "chat";
        const voice = body.voice === true;
        const incoming = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
        const messages = incoming
          .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
          .map((m, index, arr) => ({
            role: m.role,
            content: contentOf(m, index === arr.length - 1 && m.role === "user"),
          }));

        if (!messages.length) {
          return Response.json({ error: "Say something first." }, { status: 400 });
        }

        const jobId = startChatJob({
          id: typeof body.id === "string" ? body.id : undefined,
          mode,
          voice,
          messages: [{ role: "system", content: systemPrompt(mode, voice) }, ...messages],
        });
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            const send = (payload: unknown) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
            };
            send({ id: jobId });
            for (let i = 0; i < 800; i += 1) {
              const job = readJob(jobId);
              if (!job) break;
              send({ text: job.text, done: job.done, error: job.error ?? null });
              if (job.done) break;
              await new Promise((resolve) => setTimeout(resolve, 40));
            }
            controller.close();
          },
        });
        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
