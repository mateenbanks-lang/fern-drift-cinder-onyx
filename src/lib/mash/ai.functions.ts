import { createServerFn } from "@tanstack/react-start";

const imageHits: number[] = [];

function limited(bucket: number[], max: number, windowMs: number) {
  const now = Date.now();
  while (bucket.length && now - bucket[0] > windowMs) bucket.shift();
  if (bucket.length >= max) return true;
  bucket.push(now);
  return false;
}

async function generateImage(apiKey: string, model: string, prompt: string) {
  const res = await fetch("https://api.x.ai/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      response_format: "url",
    }),
  });
  if (!res.ok) return { ok: false as const, status: res.status };
  return readImage(res);
}

async function readImage(res: Response) {
  const body = (await res.json()) as {
    data?: { url?: string; b64_json?: string }[];
  };
  const first = body.data?.[0];
  const url = first?.url ? first.url : first?.b64_json ? `data:image/png;base64,${first.b64_json}` : "";
  if (!url) return { ok: false as const, status: 502 };
  return { ok: true as const, url };
}

export const imagineImage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const prompt =
      input && typeof input === "object" && "prompt" in input
        ? String((input as { prompt: unknown }).prompt).trim().slice(0, 1600)
        : "";
    if (prompt.length < 2) throw new Error("Describe the image first.");
    return { prompt };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not available right now." };
    if (limited(imageHits, 6, 60_000)) {
      return { ok: false as const, error: "Short pause after heavy use." };
    }
    try {
      let result = await generateImage(apiKey, "grok-imagine-image-2.0", data.prompt);
      if (!result.ok && result.status !== 401 && result.status !== 429) {
        result = await generateImage(apiKey, "grok-imagine-image", data.prompt);
      }
      if (!result.ok) {
        return {
          ok: false as const,
          error: result.status === 403 ? "Grok is out of credits, so the image cannot be made yet." : `Image failed (${result.status}).`,
        };
      }
      return { ok: true as const, url: result.url };
    } catch {
      return { ok: false as const, error: "Image failed. Try again." };
    }
  });

export const editImage = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const raw = input && typeof input === "object" ? (input as { prompt?: unknown; image?: unknown }) : {};
    const prompt = String(raw.prompt ?? "").trim().slice(0, 1600);
    const image = String(raw.image ?? "");
    if (prompt.length < 2) throw new Error("Say what to change.");
    if (!image.startsWith("data:image/") || image.length > 500_000) throw new Error("Attach the photo to edit.");
    return { prompt, image };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not available right now." };
    if (limited(imageHits, 6, 60_000)) return { ok: false as const, error: "Short pause after heavy use." };
    try {
      const res = await fetch("https://api.x.ai/v1/images/edits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-imagine-image",
          prompt: data.prompt,
          image: { url: data.image },
          response_format: "url",
        }),
      });
      if (!res.ok) return { ok: false as const, error: `Edit failed (${res.status}).` };
      const result = await readImage(res);
      if (!result.ok) return { ok: false as const, error: "Edit failed. Try again." };
      return { ok: true as const, url: result.url };
    } catch {
      return { ok: false as const, error: "Edit failed. Try again." };
    }
  });

export const speakText = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const text =
      input && typeof input === "object" && "text" in input
        ? String((input as { text: unknown }).text).trim().slice(0, 600)
        : "";
    if (!text) throw new Error("Nothing to read.");
    return { text };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Voice is not available right now." };
    try {
      for (const voiceId of ["ara", "eve"]) {
        const res = await fetch("https://api.x.ai/v1/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            text: data.text,
            voice_id: voiceId,
            language: "en",
          }),
        });
        if (!res.ok) continue;
        const mime = res.headers.get("content-type") || "audio/mpeg";
        const audio = Buffer.from(await res.arrayBuffer()).toString("base64");
        if (!audio) continue;
        return { ok: true as const, audio, mime };
      }
      return { ok: false as const, error: "Voice failed. Try again." };
    } catch {
      return { ok: false as const, error: "Voice failed. Try again." };
    }
  });
