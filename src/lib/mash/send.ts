import { editImage, imagineImage, speakText } from "@/lib/mash/ai.functions";
import { markFresh } from "@/components/mash/markdown";
import { answerNow } from "@/lib/mash/math";
import { useMash, type Mode, type Msg } from "@/lib/mash/store";
import { create } from "zustand";

export const useLive = create<{ id: string | null; text: string }>(() => ({
  id: null,
  text: "",
}));

let paint = 0;
let paintText = "";
let paintId: string | null = null;

function paintLive(id: string, text: string) {
  paintId = id;
  paintText = text;
  if (typeof requestAnimationFrame !== "function") {
    useLive.setState({ id, text });
    return;
  }
  if (paint) return;
  paint = requestAnimationFrame(() => {
    paint = 0;
    if (paintId) useLive.setState({ id: paintId, text: paintText });
  });
}

function clearLive() {
  if (paint) cancelAnimationFrame(paint);
  paint = 0;
  paintId = null;
  paintText = "";
  useLive.setState({ id: null, text: "" });
}

export const useVoiceUi = create<{
  open: boolean;
  phase: "listen" | "think" | "speak";
  line: string;
}>(() => ({ open: false, phase: "listen", line: "" }));

export function openVoiceAssistant() {
  if (!useMash.getState().plugins.voice) {
    useMash.getState().setNotice("Voice is off. Turn it on in Plugins.");
    return;
  }
  useMash.getState().setVoiceOn(true);
  useVoiceUi.setState({ open: true, phase: "listen", line: "" });
}

const burst: number[] = [];
let abort: AbortController | null = null;
let speaking: HTMLAudioElement | null = null;
let callAudio: HTMLAudioElement | null = null;
let turn = 0;
const watching = new Set<string>();
const dropped = new Set<string>();

export function primeCallAudio() {
  const audio = callAudio ?? new Audio();
  callAudio = audio;
  audio.setAttribute("playsinline", "true");
  audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
  void audio.play().catch(() => undefined);
}

export function closeVoice() {
  speaking?.pause();
  speaking = null;
  window.speechSynthesis?.cancel();
  useVoiceUi.setState({ open: false, phase: "listen", line: "" });
  useMash.getState().setVoiceOn(false);
}

function tooSoon() {
  const now = Date.now();
  while (burst.length && now - burst[0] > 90_000) burst.shift();
  burst.push(now);
  return burst.length > 8;
}

function asksForEdit(text: string) {
  return /\b(edit|recolor|recolour|brighter|darker|crop|remove the|change the|make the|turn the|replace the)\b/i.test(text);
}

function asksForImage(text: string) {
  if (/\?\s*$/.test(text) && !/\b(draw|sketch|paint|logo|poster|wallpaper|tasveer)\b/i.test(text)) {
    return false;
  }
  return /\b(draw|sketch|paint|illustrat\w*|picture|photo|image|logo|poster|wallpaper|icon|render|tasveer)\b/i.test(
    text,
  );
}

function compactPhotos(urls: string[]) {
  return Promise.all(urls.slice(0, 20).map(compactPhoto));
}

function compactPhoto(url: string) {
  return new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 420 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.42));
    };
    img.onerror = () => resolve(url.slice(0, 80_000));
    img.src = url;
  });
}

function titleFrom(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New chat";
  return clean.length > 32 ? `${clean.slice(0, 32)}…` : clean;
}

export function stopMash() {
  turn += 1;
  abort?.abort();
  abort = null;
  speaking?.pause();
  speaking = null;
  useVoiceUi.setState({ open: false, phase: "listen", line: "" });
  useMash.getState().setVoiceOn(false);
  useMash.getState().setSending(false);
}

export async function playSpeech(text: string) {
  const plugins = useMash.getState().plugins;
  if (!plugins.voice) {
    useMash.getState().setNotice("Voice is off. Turn it on in Plugins.");
    return;
  }
  const spoken = text.replace(/```[\s\S]*?```/g, " code block ").replace(/[#*_`>]/g, "").trim();
  if (!spoken) return;
  const stage = useVoiceUi.getState().open;
  if (stage) useVoiceUi.setState({ phase: "speak" });
  speaking?.pause();
  if (stage) {
    useVoiceUi.setState({ phase: "speak" });
    const line = spoken.slice(0, 160);
    const heard = await browserSpeak(line);
    if (!heard && useVoiceUi.getState().open) await playAi(line);
    if (useVoiceUi.getState().open) useVoiceUi.setState({ phase: "listen" });
    window.dispatchEvent(new Event("mash-voice"));
    return;
  }
  const result = await speakText({ data: { text: spoken.slice(0, 400) } });
  if (!result.ok) {
    if (stage) await browserSpeak(spoken);
    else useMash.getState().setNotice(result.error);
    if (stage && useVoiceUi.getState().open) useVoiceUi.setState({ phase: "listen" });
    window.dispatchEvent(new Event("mash-voice"));
    return;
  }
  const audio = new Audio(`data:${result.mime};base64,${result.audio}`);
  speaking = audio;
  const played = await audio.play().then(() => true).catch(() => false);
  if (!played) {
    if (stage) await browserSpeak(spoken);
    else useMash.getState().setNotice("Couldn’t play audio.");
    if (stage && useVoiceUi.getState().open) useVoiceUi.setState({ phase: "listen" });
    window.dispatchEvent(new Event("mash-voice"));
    return;
  }
  await new Promise<void>((resolve) => {
    audio.onended = () => resolve();
    audio.onpause = () => resolve();
    audio.onerror = () => resolve();
  });
  if (stage && useVoiceUi.getState().open) useVoiceUi.setState({ phase: "listen" });
  window.dispatchEvent(new Event("mash-voice"));
}

function playAi(text: string) {
  return speakText({ data: { text: text.slice(0, 280) } }).then(async (result) => {
    if (!result.ok) return false;
    const audio = callAudio ?? new Audio();
    callAudio = audio;
    speaking = audio;
    audio.setAttribute("playsinline", "true");
    audio.src = `data:${result.mime};base64,${result.audio}`;
    const played = await audio.play().then(() => true).catch(() => false);
    if (!played) return false;
    await new Promise<void>((resolve) => {
      audio.onended = () => resolve();
      audio.onpause = () => resolve();
      audio.onerror = () => resolve();
    });
    return true;
  });
}

export function resumeJobs() {
  for (const chat of useMash.getState().chats) {
    for (const message of chat.messages) {
      if (message.role === "assistant" && message.jobId) void followJob(chat.id, message.id, message.jobId, false);
    }
  }
}

async function readGrokStream(body: ReadableStream<Uint8Array>, chatId: string, msgId: string, jobId: string, voice: boolean) {
  if (dropped.has(jobId) || watching.has(jobId)) return;
  watching.add(jobId);
  useMash.getState().setSending(true);
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let voiced = false;
  let sawDone = false;
  try {
    while (!dropped.has(jobId)) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const chunks = buf.split("\n\n");
      buf = chunks.pop() ?? "";
      for (const chunk of chunks) {
        const line = chunk.split("\n").find((item) => item.startsWith("data:"));
        if (!line) continue;
        let data: { text?: string; done?: boolean; error?: string | null };
        try {
          data = JSON.parse(line.slice(5)) as { text?: string; done?: boolean; error?: string | null };
        } catch {
          continue;
        }
        const text = data.text ?? "";
        if (text) {
          paintLive(msgId, text);
          if (voice && !voiced && text.trim().length >= 4) {
            voiced = true;
            void playSpeech(text.trim().slice(0, 160));
          }
        }
        if (data.done) {
          sawDone = true;
          const finalText = text.trim() || data.error || "mash didn’t answer.";
          commit(chatId, msgId, finalText);
          if (voice && !voiced && useVoiceUi.getState().open) void playSpeech(finalText);
          return;
        }
      }
    }
  } catch {
    /* the line dropped; the job may still be running */
  } finally {
    watching.delete(jobId);
  }
  if (!sawDone && !dropped.has(jobId)) void followJob(chatId, msgId, jobId, voice);
}

async function followJob(chatId: string, msgId: string, jobId: string, voice: boolean) {
  if (dropped.has(jobId) || watching.has(jobId)) return;
  watching.add(jobId);
  useMash.getState().setSending(true);
  let voiced = false;
  let misses = 0;
  try {
    for (let i = 0; i < 500; i += 1) {
      if (dropped.has(jobId)) return;
      try {
        const res = await fetch(`/api/job?id=${encodeURIComponent(jobId)}`);
        if (res.status === 404) {
          misses += 1;
          if (misses > 40) {
            commit(chatId, msgId, "Could not reach mash. Try again.");
            return;
          }
          await wait(250);
          continue;
        }
        if (!res.ok) {
          await wait(400);
          continue;
        }
        misses = 0;
        const data = (await res.json()) as { text?: string; done?: boolean; error?: string | null };
        const text = data.text ?? "";
        if (text) {
          paintLive(msgId, text);
          if (i % 8 === 0) keepPartial(chatId, msgId, text, jobId);
          if (voice && !voiced && text.trim().length >= 4) {
            voiced = true;
            void playSpeech(text.trim().slice(0, 160));
          }
        }
        if (data.done) {
          const finalText = text.trim() || data.error || "mash didn’t answer.";
          commit(chatId, msgId, finalText);
          if (voice && !voiced && useVoiceUi.getState().open) void playSpeech(finalText);
          return;
        }
      } catch {
        await wait(400);
      }
      await wait(voice ? 70 : 120);
    }
  } finally {
    watching.delete(jobId);
    const still =
      !dropped.has(jobId) &&
      useMash.getState().chats.find((c) => c.id === chatId)?.messages.find((m) => m.id === msgId)?.jobId === jobId;
    if (still) {
      setTimeout(() => void followJob(chatId, msgId, jobId, voice), 200);
      return;
    }
    if (useLive.getState().id === msgId) clearLive();
    if (!watching.size) useMash.getState().setSending(false);
    if (useVoiceUi.getState().open && useVoiceUi.getState().phase === "think") {
      useVoiceUi.setState({ phase: "listen" });
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function keepPartial(chatId: string, msgId: string, content: string, jobId: string) {
  useMash.getState().patchChat(chatId, (c) => ({
    ...c,
    messages: c.messages.map((m) => (m.id === msgId ? { ...m, content, jobId } : m)),
  }));
}

function browserSpeak(text: string) {
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve(false);
  synth.getVoices();
  return new Promise<boolean>((resolve) => {
    const utter = new SpeechSynthesisUtterance(text.slice(0, 180));
    const female = synth
      .getVoices()
      .find((voice) => /female|samantha|victoria|karen|moira|zira|sara|susan|fiona/i.test(voice.name));
    if (female) utter.voice = female;
    utter.pitch = 1.15;
    utter.rate = 1.2;
    let started = false;
    let done = false;
    const end = (ok: boolean) => {
      if (done) return;
      done = true;
      window.clearTimeout(cap);
      resolve(ok);
    };
    const cap = window.setTimeout(() => end(started), 8000);
    const startWatch = window.setTimeout(() => {
      if (!started) end(false);
    }, 450);
    utter.onstart = () => {
      started = true;
      window.clearTimeout(startWatch);
    };
    utter.onend = () => end(true);
    utter.onerror = () => end(false);
    synth.cancel();
    synth.speak(utter);
  });
}

export async function submitDraft(opts?: { text?: string; fromVoice?: boolean; stay?: boolean }) {
  const state = useMash.getState();
  if (state.sending) {
    if (opts?.fromVoice) return;
    stopMash();
    return;
  }
  if (Date.now() < state.pauseUntil) {
    state.setNotice("Short pause after heavy use.");
    return;
  }

  const files = state.pendingFiles;
  const raw = (opts?.text ?? state.draft).trim();
  const text = raw || (files.length ? "Take a look at this." : "");
  if (!text) return;

  if (files.length && !state.plugins.files) {
    state.setNotice("Files are off. Turn them on in Plugins.");
    return;
  }

  let mode: Mode = state.mode;
  const picture = asksForImage(text) && !files.some((item) => item.dataUrl);
  if (mode === "imagine" && !picture) mode = "chat";
  else if ((mode === "chat" || mode === "imagine") && picture) mode = "imagine";
  if (mode === "chat" && /\b(pdf|docx?|document)\b/i.test(text)) mode = "document";
  if (mode === "imagine" && !state.plugins.imagine) {
    state.setNotice("Imagine is off. Turn it on in Plugins.");
    return;
  }

  if (tooSoon()) {
    const until = Date.now() + 7000;
    state.setPauseUntil(until);
    state.setNotice("Short pause after heavy use.");
    return;
  }

  const mine = ++turn;
  const onVoice = Boolean(opts?.fromVoice && useVoiceUi.getState().open);
  if (onVoice) useVoiceUi.setState({ open: true, phase: "think" });
  const shown = text;
  const userMsg: Msg = {
    id: crypto.randomUUID(),
    role: "user",
    content: shown,
    images: files.map((item) => item.dataUrl).filter((url): url is string => Boolean(url)).slice(0, 20),
  };
  const assistant: Msg = { id: crypto.randomUUID(), role: "assistant", content: "" };
  markFresh(assistant.id);
  useLive.setState({ id: assistant.id, text: "" });
  const now = Date.now();
  let chatId = state.activeId;
  const existing = state.chats.find((c) => c.id === chatId);

  if (!existing) {
    chatId = crypto.randomUUID();
    useMash.setState({
      activeId: chatId,
      chats: [
        {
          id: chatId,
          title: titleFrom(text),
          messages: [userMsg, assistant],
          updated: now,
        },
        ...useMash.getState().chats,
      ].slice(0, 40),
      draft: "",
      pendingFiles: [],
      sending: true,
      ...(opts?.stay || onVoice ? {} : { screen: "main" as const, sidebar: false }),
    });
  } else {
    useMash.getState().patchChat(existing.id, (c) => ({
      ...c,
      title: c.messages.length ? c.title : titleFrom(text),
      messages: [...c.messages, userMsg, assistant],
      updated: now,
    }));
    useMash.setState({
      draft: "",
      pendingFiles: [],
      sending: true,
      ...(opts?.stay || onVoice ? {} : { screen: "main" as const }),
    });
  }

  const id = chatId!;
  let handed = false;

  try {
    const solved = mode === "chat" && !files.length ? answerNow(text) : null;
    if (solved) {
      commit(id, assistant.id, solved);
      if (onVoice) void playSpeech(solved);
      return;
    }

    const photo = files.find((item) => item.dataUrl)?.dataUrl;
    if (photo && mode !== "document" && mode !== "code" && mode !== "build" && (mode === "imagine" || asksForEdit(text))) {
      const result = await editImage({ data: { prompt: text || "Improve this photo", image: photo } });
      const content = result.ok ? "Here’s the edit." : result.error;
      useMash.getState().patchChat(id, (c) => ({
        ...c,
        updated: Date.now(),
        messages: c.messages.map((m) => (m.id === assistant.id ? { ...m, content, imageUrl: result.ok ? result.url : undefined } : m)),
      }));
      clearLive();
      return;
    }

    if (mode === "imagine") {
      const result = await imagineImage({ data: { prompt: text } });
      const content = result.ok ? "Here’s the image." : result.error;
      useMash.getState().patchChat(id, (c) => ({
        ...c,
        updated: Date.now(),
        messages: c.messages.map((m) =>
          m.id === assistant.id
            ? { ...m, content, imageUrl: result.ok ? result.url : undefined }
            : m,
        ),
      }));
      clearLive();
      return;
    }

    const rows =
      useMash
        .getState()
        .chats.find((c) => c.id === id)
        ?.messages.filter((m) => m.id !== assistant.id)
        .slice(-10) ?? [];
    const note = files.find((item) => item.text)?.text;
    const history = [];
    for (let index = 0; index < rows.length; index += 1) {
      const m = rows[index];
      const last = index === rows.length - 1;
      const pics = last ? (m.images ?? []) : [];
      const content =
        last && note
          ? `${m.content}\n\n${note.slice(0, 8000)}`
          : pics.length
            ? `${m.content}\n\n${pics.length} photos are attached. Read every photo.`
            : m.content;
      history.push({
        role: m.role,
        content,
        images: pics.length ? await compactPhotos(pics) : undefined,
      });
    }

    const jobId = crypto.randomUUID();
    useMash.getState().patchChat(id, (c) => ({
      ...c,
      messages: c.messages.map((m) => (m.id === assistant.id ? { ...m, jobId } : m)),
    }));
    abort = new AbortController();
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: jobId, mode, voice: Boolean(opts?.fromVoice), messages: history }),
      signal: abort.signal,
    });

    if (!res.ok) {
      dropped.add(jobId);
      let error = "mash didn’t answer.";
      try {
        const json = (await res.json()) as { error?: string };
        if (json.error) error = json.error;
      } catch {
        /* keep default */
      }
      commit(id, assistant.id, error);
      if (res.status === 429) useMash.getState().setPauseUntil(Date.now() + 8000);
      return;
    }

    handed = true;
    if (res.body && (res.headers.get("content-type") ?? "").includes("text/event-stream")) {
      await readGrokStream(res.body, id, assistant.id, jobId, onVoice);
      return;
    }
    void followJob(id, assistant.id, jobId, onVoice);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      if (mine !== turn) {
        const pending = useMash.getState().chats.find((c) => c.id === id)?.messages.find((m) => m.id === assistant.id)?.jobId;
        if (pending) dropped.add(pending);
        const partial = useLive.getState().text.trim();
        commit(id, assistant.id, partial || "Stopped.");
        handed = false;
      }
      return;
    }
    const pending = useMash.getState().chats.find((c) => c.id === id)?.messages.find((m) => m.id === assistant.id)?.jobId;
    if (pending) {
      handed = true;
      return;
    }
    commit(id, assistant.id, "Could not reach mash. Try again.");
  } finally {
    abort = null;
    if (!handed && mine === turn) {
      useMash.getState().setSending(false);
      if (useVoiceUi.getState().open && useVoiceUi.getState().phase === "think") {
        useVoiceUi.setState({ phase: "listen" });
      }
      if (opts?.fromVoice && useMash.getState().voiceOn && !useVoiceUi.getState().open) {
        window.dispatchEvent(new Event("mash-listen"));
      }
    }
    if (!handed && useLive.getState().id === assistant.id) clearLive();
  }
}

function commit(chatId: string, msgId: string, content: string) {
  useMash.getState().patchChat(chatId, (c) => ({
    ...c,
    updated: Date.now(),
    messages: c.messages.map((m) => (m.id === msgId ? { ...m, content, jobId: undefined } : m)),
  }));
}
