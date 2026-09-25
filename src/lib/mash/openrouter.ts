export const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
export const OPENROUTER_SITE = "https://fern-drift-cinder-onyx.vercel.app";

export const CHAT_MODEL = "openai/gpt-oss-120b:nitro";
export const CHAT_FALLBACK = "openai/gpt-4o-mini";
export const VISION_MODEL = "google/gemini-2.5-flash";
export const IMAGE_MODEL = "google/gemini-2.5-flash-image";
export const IMAGE_FALLBACK = "black-forest-labs/flux.2-pro";
export const TTS_MODEL = "hexgrad/kokoro-82m";

export function openRouterKey() {
  return process.env.OPENROUTER_API_KEY?.trim();
}

export function openRouterHeaders(apiKey: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "HTTP-Referer": OPENROUTER_SITE,
    "X-Title": "Mash Ai",
  };
}

export function openRouterError(detail: string, status: number) {
  if (/402|spending-limit|out of credits|insufficient/i.test(detail) || status === 402) {
    return "OpenRouter credits are low on this app, so it cannot answer yet. Add credits, then send it again.";
  }
  if (status === 401) return "OpenRouter API key is missing or invalid.";
  if (status === 429) return "OpenRouter is rate-limited. Try again in a moment.";
  return `mash is busy (${status}). Try again.`;
}
