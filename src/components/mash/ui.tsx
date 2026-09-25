import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUp,
  AtSign,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  Ellipsis,
  Clock,
  Folder,
  Image as ImageIcon,
  Lock,
  Mic,
  MicOff,
  Monitor,
  Moon,
  Paperclip,
  Pin,
  Plus,
  Search,
  Share,
  SlidersHorizontal,
  Sparkles,
  Square,
  SquarePen,
  Sun,
  Terminal,
  X,
} from "lucide-react";
import { useMash, type Chat, type Mode, type PendingFile, type Screen } from "@/lib/mash/store";
import { MenuScreens, GalleryArt } from "@/components/mash/menu";
import { closeVoice, openVoiceAssistant, playSpeech, primeCallAudio, resumeJobs, stopMash, submitDraft, useLive, useVoiceUi } from "@/lib/mash/send";
import { LiveAnswer, ProductPage, markFresh } from "@/components/mash/markdown";
import { signOut } from "@/lib/auth/client";
import { hasGateSessionMarker } from "@/lib/auth/gate-session-marker";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

function MashLogo({ bar = false }: { bar?: boolean }) {
  return <span className={bar ? "mash-logo mash-logo-bar" : "mash-logo"}>mash</span>;
}

export function MenuMark() {
  return (
    <svg width="17" height="11" viewBox="0 0 22 14" aria-hidden="true">
      <path d="M1 1.5h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 12.5h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const MODES: { id: Mode; label: string }[] = [
  { id: "chat", label: "Chat" },
  { id: "imagine", label: "Imagine" },
  { id: "document", label: "Document" },
  { id: "code", label: "Code" },
  { id: "build", label: "Build" },
];

const subscribeGate = () => () => {};

function useThemeSync() {
  const theme = useMash((s) => s.theme);
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const dark =
        theme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
          : theme === "dark";
      root.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
}

async function attachFile(item: File) {
  if (item.size > 1_200_000) {
    useMash.getState().setNotice("That file is too big.");
    return;
  }
  let pending: PendingFile;
  if (item.type.startsWith("image/")) {
    const buf = await item.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    pending = { name: item.name, dataUrl: `data:${item.type};base64,${btoa(binary)}` };
  } else {
    const text = await item.text();
    pending = { name: item.name, text: text.slice(0, 12_000) };
  }
  useMash.getState().setPendingFiles([pending]);
}

function shrinkImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 768 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.68));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });
}

function ConversationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="8" width="3" height="8" rx="1.5" fill="currentColor" />
      <rect x="10.5" y="4" width="3" height="16" rx="1.5" fill="currentColor" />
      <rect x="17.5" y="9" width="3" height="6" rx="1.5" fill="currentColor" />
    </svg>
  );
}

export function MashApp() {
  const notice = useMash((s) => s.notice);
  const setNotice = useMash((s) => s.setNotice);
  const sidebar = useMash((s) => s.sidebar);
  const screen = useMash((s) => s.screen);

  useThemeSync();

  useEffect(() => {
    void Promise.resolve(useMash.persist.rehydrate()).then(() => resumeJobs());
    const back = () => {
      if (document.visibilityState === "visible") resumeJobs();
    };
    document.addEventListener("visibilitychange", back);
    window.addEventListener("pageshow", back);
    return () => {
      document.removeEventListener("visibilitychange", back);
      window.removeEventListener("pageshow", back);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(id);
  }, [notice, setNotice]);

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col bg-bg text-fg">
      {sidebar ? (
        <Sidebar />
      ) : screen === "pricing" ? (
        <Pricing />
      ) : screen === "main" ? (
        <Main />
      ) : (
        <Section />
      )}
      {notice ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <p className="rounded-full bg-inverse px-4 py-2 text-sm text-inverse-fg shadow-lg">
            {notice}
          </p>
        </div>
      ) : null}
      <LegalSheet />
      <ProductPage />
    </div>
  );
}

function TopBar({ thread }: { thread: boolean }) {
  const setSidebar = useMash((s) => s.setSidebar);
  const picker = useMash((s) => s.picker);
  const setPicker = useMash((s) => s.setPicker);
  const setScreen = useMash((s) => s.setScreen);
  const active = useMash((s) => s.chats.find((c) => c.id === s.activeId));
  const { user, isPending } = useCurrentUserState();

  async function share() {
    const text = (active?.messages ?? [])
      .map((m) => `${m.role === "user" ? "You" : "mash"}: ${m.content}`)
      .join("\n\n");
    if (!text) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: active?.title ?? "mash", text });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    await navigator.clipboard.writeText(text);
    useMash.getState().setNotice("Chat copied.");
  }

  return (
    <header className="safe-top relative z-20 flex items-center px-2 pb-2">
      <button
        type="button"
        aria-label="Open menu"
        className="grid size-10 shrink-0 place-items-center"
        onClick={() => setSidebar(true)}
      >
        <MenuMark />
      </button>
      <button
        type="button"
        className="flex min-w-0 items-center gap-0.5"
        aria-expanded={picker}
        onClick={() => setPicker(!picker)}
      >
        <MashLogo bar />
        <ChevronDown className={`size-4 shrink-0 text-muted ${picker ? "rotate-180" : ""}`} />
      </button>
      <div className="ml-auto flex shrink-0 items-center">
        <button
          type="button"
          className="flex items-center gap-1 px-1.5 py-2 text-sm font-semibold text-upgrade"
          onClick={() => setScreen("pricing")}
        >
          <Sparkles className="size-3.5" />
          Upgrade
        </button>
        {thread ? (
          <button type="button" aria-label="Share chat" className="grid size-10 place-items-center" onClick={() => void share()}>
            <Share className="size-5" />
          </button>
        ) : isPending ? (
          <span className="size-10" />
        ) : user ? null : (
          <Link
            to="/login"
            className="shrink-0 rounded-full bg-inverse px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap text-inverse-fg"
          >
            Log in
          </Link>
        )}
      </div>
      {picker ? <ModelMenu /> : null}
    </header>
  );
}

function ModelMenu() {
  const setPicker = useMash((s) => s.setPicker);
  const setScreen = useMash((s) => s.setScreen);
  return (
    <>
      <button
        type="button"
        aria-label="Close models"
        className="fixed inset-0 z-20 cursor-default"
        onClick={() => setPicker(false)}
      />
      <div className="absolute top-full left-4 z-30 w-[min(20rem,calc(100%-2rem))] rounded-card border border-line bg-menu p-1.5 shadow-2xl">
        <div className="flex items-start gap-3 rounded-xl px-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="font-semibold">mash</p>
            <p className="text-sm text-muted">Fast answers, images, and code.</p>
          </div>
          <Check className="mt-1 size-4 shrink-0" />
        </div>
        <button
          type="button"
          className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left"
          onClick={() => {
            setPicker(false);
            setScreen("pricing");
          }}
        >
          <div className="min-w-0 flex-1">
            <p className="font-semibold">mash Ultra</p>
            <p className="text-sm text-muted">Longer work. Requires Upgrade.</p>
          </div>
          <Lock className="mt-1 size-4 shrink-0 text-muted" />
        </button>
      </div>
    </>
  );
}

function Main() {
  const active = useMash((s) => s.chats.find((c) => c.id === s.activeId));
  const thread = (active?.messages.length ?? 0) > 0;
  return (
    <div className="relative isolate flex min-h-0 flex-1 flex-col">
      <div className="aurora" aria-hidden />
      <TopBar thread={thread} />
      {thread ? <Thread /> : <Hero />}
      <Composer threaded={thread} />
    </div>
  );
}

function Hero() {
  return (
    <div className="grid flex-1 place-items-center px-6">
      <h1 className="hero-title text-center">
        What do you want to
        <br />
        make?
      </h1>
    </div>
  );
}

function cleanUserText(content: string) {
  return content.replace(/\n*\[[^\]\n]*\.(?:jpe?g|png|webp|gif|heic)[^\]\n]*\]\s*$/i, "").trim();
}

function chatPreview(chat: Chat) {
  const last = [...chat.messages].reverse().find((m) => m.content.trim() || m.images?.length || m.imageUrl);
  if (!last) return "Empty chat";
  if (last.images?.length && !cleanUserText(last.content)) return `${last.images.length} photos`;
  if (last.imageUrl && !cleanUserText(last.content)) return "Image";
  const text = cleanUserText(last.content)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 80) || "Chat";
}

function timeAgo(ts: number) {
  const delta = Date.now() - ts;
  if (delta < 60_000) return "Just now";
  if (delta < 3_600_000) return `${Math.floor(delta / 60_000)}m ago`;
  if (delta < 86_400_000) return `${Math.floor(delta / 3_600_000)}h ago`;
  return new Date(ts).toLocaleDateString();
}

function Thread() {
  const messages = useMash((s) => s.chats.find((c) => c.id === s.activeId)?.messages ?? []);
  const sending = useMash((s) => s.sending);
  const live = useLive();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, live.text, sending]);

  return (
    <div ref={box} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-2">
      {messages.map((m) => {
        const text = m.id === live.id ? live.text : m.content;
        if (m.role === "user") {
          return (
            <div key={m.id} className="flex flex-col items-end gap-1">
              {m.images?.length ? (
                <div className="flex max-w-[80%] justify-end gap-1 overflow-x-auto">
                  {m.images.map((src, index) => (
                    <img key={index} src={src} alt="" className="size-16 rounded-lg object-cover" />
                  ))}
                </div>
              ) : null}
              {cleanUserText(m.content) ? (
                <p className="max-w-[80%] rounded-bubble bg-bubble px-4 py-2.5 text-left text-base leading-snug whitespace-pre-wrap">
                  {cleanUserText(m.content)}
                </p>
              ) : null}
            </div>
          );
        }
        const streaming = m.id === live.id && sending;
        const waiting = !text && sending && m.id === live.id;
        if (waiting) {
          return (
            <span key={m.id} className="flex h-7 items-center gap-1.5 px-1 text-fg" aria-label="mash is thinking">
              <i className="think-dot" />
              <i className="think-dot" />
              <i className="think-dot" />
            </span>
          );
        }
        return (
          <div key={m.id} className="max-w-[94%]">
            {m.imageUrl?.startsWith("gallery:") ? (
              <GalleryArt id={m.imageUrl.slice(8)} className="mb-2 aspect-square w-full max-w-xs rounded-xl" />
            ) : m.imageUrl ? (
              <img src={m.imageUrl} alt="" className="mb-2 max-h-80 w-full rounded-xl object-cover" />
            ) : null}
            {text ? <LiveAnswer id={m.id} text={text} live={streaming} /> : null}
          </div>
        );
      })}
    </div>
  );
}

function Composer({ threaded }: { threaded: boolean }) {
  const draft = useMash((s) => s.draft);
  const setDraft = useMash((s) => s.setDraft);
  const mode = useMash((s) => s.mode);
  const setMode = useMash((s) => s.setMode);
  const sending = useMash((s) => s.sending);
  const files = useMash((s) => s.pendingFiles);
  const setPendingFiles = useMash((s) => s.setPendingFiles);
  const voiceOn = useMash((s) => s.voiceOn);
  const [modesOpen, setModesOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [gallery, setGallery] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const ready = draft.trim().length > 0 || files.length > 0;
  const showPill = threaded || mode !== "chat";

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [draft, threaded]);

  useEffect(() => {
    const listen = () => dictate(true);
    window.addEventListener("mash-listen", listen);
    return () => window.removeEventListener("mash-listen", listen);
  }, []);

  useEffect(() => {
    if (!voiceOn) recognition?.stop();
  }, [voiceOn]);

  return (
    <div className="safe-bottom px-3">
      {files.length ? (
        <div className="mb-2 flex items-center justify-between rounded-full bg-track px-3 py-1.5 text-sm">
          <span className="truncate">
            {files.length === 1 ? files[0].name : `${files.length} photos`}
          </span>
          <button type="button" aria-label="Remove file" onClick={() => setPendingFiles([])}>
            <X className="size-4" />
          </button>
        </div>
      ) : null}
      <VoiceStage />
      {showPill ? (
        <div className="relative mb-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-line bg-composer px-4 py-2 text-sm font-medium"
            onClick={() => setModesOpen((v) => !v)}
          >
            {MODES.find((m) => m.id === mode)?.label}
            <ChevronDown className="size-4" />
          </button>
          {modesOpen ? (
            <div className="absolute bottom-12 left-0 z-30 w-40 rounded-card border border-line bg-menu p-1">
              {MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm"
                  onClick={() => {
                    setMode(item.id);
                    setModesOpen(false);
                  }}
                >
                  {item.label}
                  {mode === item.id ? <Check className="size-4" /> : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      <form
        className={
          threaded
            ? "flex items-end gap-2 rounded-composer border border-line bg-composer px-2 py-2"
            : "rounded-composer border border-line bg-composer px-3 pt-3 pb-2"
        }
        onSubmit={(e) => {
          e.preventDefault();
          void submitDraft();
        }}
      >
        {!threaded ? (
          <textarea
            ref={box}
            value={draft}
            rows={2}
            placeholder="Ask anything"
            className="mb-2 max-h-40 w-full resize-none bg-transparent text-base outline-none placeholder:text-muted"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submitDraft();
              }
            }}
          />
        ) : null}
        <div className={`flex items-center ${threaded ? "w-full gap-2" : "gap-2"}`}>
          {threaded ? (
            <IconButton label="Add photos" onClick={() => setGallery(true)}>
              <Paperclip className="size-5" />
            </IconButton>
          ) : (
            <div className="relative">
              <IconButton label="Add" onClick={() => setPlusOpen((v) => !v)}>
                <Plus className="size-5" />
              </IconButton>
              {plusOpen ? (
                <PlusMenu
                  onPhotos={() => setGallery(true)}
                  onFile={() => fileRef.current?.click()}
                  close={() => setPlusOpen(false)}
                />
              ) : null}
            </div>
          )}
          {threaded ? (
            <textarea
              ref={box}
              value={draft}
              rows={1}
              placeholder="Message mash"
              className="max-h-40 min-w-0 flex-1 resize-none bg-transparent py-2.5 text-left text-base outline-none placeholder:text-muted"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void submitDraft();
                }
              }}
            />
          ) : (
            <span className="flex-1" />
          )}
          <IconButton
            label="Conversation"
            onClick={() => {
              unlockTalk();
              primeCallAudio();
              openVoiceAssistant();
              beginVoiceListen();
            }}
          >
            <ConversationIcon />
          </IconButton>
          <IconButton label="Voice text" onClick={() => dictate(false)}>
            <Mic className="size-5" />
          </IconButton>
          <button
            type="submit"
            aria-label={sending ? "Stop" : "Send"}
            disabled={!ready && !sending}
            className={`grid size-11 place-items-center rounded-full text-on-accent ${
              ready || sending ? "bg-accent" : "bg-accent-dim"
            }`}
          >
            {sending ? <Square className="size-4 fill-current" /> : <ArrowUp className="size-5" />}
          </button>
        </div>
      </form>
      {threaded ? null : (
        <p className="mx-auto mt-3 max-w-sm text-center text-xs leading-5 text-muted">
          mash is AI. By using it, you agree to our{" "}
          <button type="button" className="underline underline-offset-2" onClick={() => useMash.getState().setLegal("terms")}>
            Terms
          </button>{" "}
          &{" "}
          <button type="button" className="underline underline-offset-2" onClick={() => useMash.getState().setLegal("privacy")}>
            Privacy Policy
          </button>
          .{" "}
          <button type="button" className="underline underline-offset-2" onClick={() => useMash.getState().setLegal("learn")}>
            Learn more
          </button>
        </p>
      )}
      <input
        ref={fileRef}
        type="file"
        hidden
        multiple
        accept="image/*,.txt,.md,.json,.csv,.ts,.tsx,.js,.py,.html,.css,.pdf,.doc,.docx"
        onChange={(e) => {
          const item = [...(e.target.files ?? [])].find((file) => !file.type.startsWith("image/"));
          if (item) void attachFile(item);
          e.target.value = "";
        }}
      />
      {gallery ? <GallerySheet onClose={() => setGallery(false)} /> : null}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 shrink-0 place-items-center rounded-full bg-chip text-fg"
    >
      {children}
    </button>
  );
}

function GallerySheet({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<{ url: string; file: File; on: boolean }[]>([]);
  const drag = useRef(false);
  const chosen = items.filter((item) => item.on).length;

  useEffect(() => {
    inputRef.current?.click();
  }, []);

  useEffect(() => {
    const stop = () => {
      drag.current = false;
    };
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, []);

  function add(list: FileList | null) {
    const files = [...(list ?? [])].filter((file) => file.type.startsWith("image/")).slice(0, 40);
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({ url: URL.createObjectURL(file), file, on: false })),
    ].slice(0, 40));
  }

  function selectAt(index: number) {
    setItems((prev) => {
      if (!prev[index] || prev[index].on) return prev;
      if (prev.filter((item) => item.on).length >= 20) {
        useMash.getState().setNotice("20 photos at a time.");
        return prev;
      }
      const next = prev.slice();
      next[index] = { ...next[index], on: true };
      return next;
    });
  }

  function slide(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const node = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-i]");
    if (!node) return;
    selectAt(Number(node.getAttribute("data-i")));
  }

  async function useSelected() {
    const picked = items.filter((item) => item.on).slice(0, 20);
    if (!picked.length) {
      useMash.getState().setNotice("Slide across the photos to select them.");
      return;
    }
    const pending: PendingFile[] = [];
    for (const item of picked) {
      try {
        pending.push({ name: item.file.name, dataUrl: await shrinkImage(item.file) });
      } catch {
        /* skip a photo that cannot be read */
      }
    }
    items.forEach((item) => URL.revokeObjectURL(item.url));
    useMash.getState().setPendingFiles(pending);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg text-fg">
      <div className="flex items-center justify-between px-4 py-3">
        <button type="button" className="text-sm" onClick={onClose}>
          Cancel
        </button>
        <p className="text-sm font-medium">{chosen}/20</p>
        <button type="button" className="text-sm font-semibold text-accent" onClick={() => void useSelected()}>
          Use
        </button>
      </div>
      <p className="px-4 pb-2 text-sm text-muted">Slide your finger across photos. Up to 20.</p>
      <div
        className="grid min-h-0 flex-1 grid-cols-4 content-start gap-1 overflow-y-auto px-2 touch-none"
        onPointerMove={slide}
      >
        {items.map((item, index) => (
          <button
            key={item.url}
            type="button"
            data-i={index}
            className={`relative aspect-square overflow-hidden rounded-lg ${item.on ? "ring-2 ring-accent" : ""}`}
            onPointerDown={() => {
              drag.current = true;
              selectAt(index);
            }}
          >
            <img src={item.url} alt="" className="pointer-events-none size-full object-cover" />
          </button>
        ))}
      </div>
      <div className="safe-bottom px-4 py-3">
        <button type="button" className="w-full rounded-full bg-chip py-3 text-sm" onClick={() => inputRef.current?.click()}>
          Open gallery
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept="image/*"
        onChange={(e) => {
          add(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function PlusMenu({
  onPhotos,
  onFile,
  close,
}: {
  onPhotos: () => void;
  onFile: () => void;
  close: () => void;
}) {
  const setMode = useMash((s) => s.setMode);
  const items: { label: string; run: () => void }[] = [
    { label: "Add photos", run: onPhotos },
    { label: "Add a file", run: onFile },
    { label: "Imagine", run: () => setMode("imagine") },
    { label: "Document", run: () => setMode("document") },
    { label: "Code", run: () => setMode("code") },
    { label: "Build", run: () => setMode("build") },
  ];
  return (
    <div className="absolute bottom-14 left-0 z-30 w-44 rounded-card border border-line bg-menu p-1">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className="block w-full rounded-xl px-3 py-2.5 text-left text-sm"
          onClick={() => {
            item.run();
            close();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function getRecognizer() {
  const w = window as Window & {
    SpeechRecognition?: new () => Recognizer;
    webkitSpeechRecognition?: new () => Recognizer;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

type Recognizer = {
  start: () => void;
  stop: () => void;
  onresult: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  lang: string;
  interimResults: boolean;
  continuous: boolean;
};

let recognition: Recognizer | null = null;
let heardTimer = 0;

function unlockTalk() {
  const synth = window.speechSynthesis;
  if (!synth) return;
  try {
    const utter = new SpeechSynthesisUtterance(" ");
    utter.volume = 0.01;
    synth.speak(utter);
  } catch {
    /* the phone blocked it */
  }
}

function beginVoiceListen() {
  if (!useVoiceUi.getState().open) return;
  const rec = getRecognizer();
  if (!rec) {
    useMash.getState().setNotice("This browser has no speech recognition.");
    return;
  }
  try {
    recognition?.stop();
  } catch {
    /* already stopped */
  }
  window.clearTimeout(heardTimer);
  recognition = rec;
  rec.lang = "en-US";
  rec.interimResults = true;
  rec.continuous = true;
  let latest = "";
  let sent = false;
  const send = (said: string) => {
    const line = said.trim();
    if (sent || !line || useMash.getState().sending || !useVoiceUi.getState().open) return;
    sent = true;
    window.clearTimeout(heardTimer);
    useVoiceUi.setState({ line, phase: "think" });
    try {
      rec.stop();
    } catch {
      /* already stopped */
    }
    void submitDraft({ text: line, fromVoice: true });
  };
  rec.onresult = (event: Event) => {
    const ev = event as unknown as {
      resultIndex?: number;
      results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }>;
    };
    let finalText = "";
    let interim = "";
    const start = ev.resultIndex ?? 0;
    for (let i = start; i < ev.results.length; i += 1) {
      const row = ev.results[i];
      const piece = row?.[0]?.transcript ?? "";
      if (row?.isFinal) finalText += piece;
      else interim += piece;
    }
    const shown = (finalText || interim).trim();
    if (shown) {
      latest = shown;
      useVoiceUi.setState({ line: shown });
    }
    window.clearTimeout(heardTimer);
    if (finalText.trim()) {
      send(finalText);
      return;
    }
    if (interim.trim()) heardTimer = window.setTimeout(() => send(latest), 700);
  };
  rec.onerror = (event: Event) => {
    const err = (event as { error?: string }).error;
    if (err === "not-allowed" || err === "service-not-allowed") {
      useMash.getState().setNotice("Tap the mic and allow it, then speak.");
    }
  };
  rec.onend = () => {
    if (!sent && latest.trim()) send(latest);
  };
  try {
    rec.start();
  } catch {
    useMash.getState().setNotice("Tap the mic and allow it, then speak.");
  }
}

function dictate(autoSend: boolean) {
  const rec = getRecognizer();
  if (!rec) {
    useMash.getState().setVoiceOn(false);
    useMash.getState().setNotice("This browser has no speech recognition.");
    return;
  }
  recognition?.stop();
  recognition = rec;
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.continuous = false;
  rec.onresult = (event: Event) => {
    const results = (event as unknown as { results: ArrayLike<ArrayLike<{ transcript: string }>> }).results;
    const said = results[0]?.[0]?.transcript?.trim() ?? "";
    if (!said) return;
    if (autoSend) void submitDraft({ text: said, fromVoice: true });
    else useMash.getState().setDraft(said);
  };
  rec.onerror = () => {
    useMash.getState().setVoiceOn(false);
    useMash.getState().setNotice("Mic didn’t start.");
  };
  rec.onend = null;
  try {
    rec.start();
  } catch {
    useMash.getState().setVoiceOn(false);
  }
}

function Sidebar() {
  const setSidebar = useMash((s) => s.setSidebar);
  const newChat = useMash((s) => s.newChat);
  const chats = useMash((s) => s.chats);
  const activeId = useMash((s) => s.activeId);
  const openChat = useMash((s) => s.openChat);
  const removeChat = useMash((s) => s.removeChat);
  const togglePin = useMash((s) => s.togglePin);
  const searching = useMash((s) => s.searching);
  const setSearching = useMash((s) => s.setSearching);
  const query = useMash((s) => s.query);
  const setQuery = useMash((s) => s.setQuery);
  const theme = useMash((s) => s.theme);
  const setTheme = useMash((s) => s.setTheme);
  const setScreen = useMash((s) => s.setScreen);
  const { user, isPending } = useCurrentUserState();
  const gate = useSyncExternalStore(subscribeGate, hasGateSessionMarker, () => false);
  const [prefs, setPrefs] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const q = query.trim().toLowerCase();
  const recent = chats
    .filter((c) => !q || c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content.toLowerCase().includes(q)))
    .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.updated - a.updated)
    .slice(0, 20);
  const label = user?.displayName || user?.primaryEmail || "Log in";

  const nav: { screen: Screen; label: string; icon: ReactNode; extra?: ReactNode }[] = [
    { screen: "images", label: "Images", icon: <ImageIcon className="size-5" /> },
    { screen: "library", label: "Library", icon: <BarChart3 className="size-5" /> },
    { screen: "scheduled", label: "Scheduled", icon: <Clock className="size-5" /> },
    { screen: "plugins", label: "Plugins", icon: <AtSign className="size-5" /> },
    {
      screen: "projects",
      label: "Projects",
      icon: <Folder className="size-5" />,
      extra: <Plus className="size-4" />,
    },
    {
      screen: "code",
      label: "Code",
      icon: <Terminal className="size-5" />,
      extra: <ChevronRight className="size-4" />,
    },
    { screen: "more", label: "More", icon: <span className="px-0.5 text-lg leading-none">···</span> },
  ];

  return (
    <div className="safe-top flex min-h-0 flex-1 flex-col px-2 pb-4">
      <div className="flex items-center pb-4">
        <button type="button" aria-label="Close menu" className="grid size-10 shrink-0 place-items-center" onClick={() => setSidebar(false)}>
          <X className="size-5" />
        </button>
        <MashLogo bar />
        <button type="button" aria-label="Search" className="ml-auto grid size-11 place-items-center" onClick={() => setSearching(!searching)}>
          <Search className="size-5" />
        </button>
      </div>
      {searching ? (
        <input
          autoFocus
          value={query}
          placeholder="Search chats"
          className="mb-3 w-full rounded-2xl bg-track px-4 py-3 text-base outline-none placeholder:text-muted"
          onChange={(e) => setQuery(e.target.value)}
        />
      ) : null}
      <button
        type="button"
        className="mb-2 flex items-center gap-3 rounded-2xl bg-track px-4 py-3 text-left text-[15px] font-medium"
        onClick={newChat}
      >
        <SquarePen className="size-5" />
        New chat
      </button>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <nav>
          {nav.map((item) => (
            <button
              key={item.screen}
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-[15px]"
              onClick={() => setScreen(item.screen)}
            >
              <span className="grid w-6 place-items-center">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.extra}
            </button>
          ))}
        </nav>
        <div className="mt-4 flex items-center px-2">
          <p className="text-xs font-medium text-muted">Recents</p>
        </div>
        {recent.map((chat) => (
          <div key={chat.id} className="relative">
            <button
              type="button"
              className={`flex w-full items-center rounded-xl py-2 pr-10 pl-4 text-left text-[15px] ${
                chat.id === activeId ? "bg-track" : ""
              }`}
              onClick={() => openChat(chat.id)}
            >
              <span className="flex min-w-0 items-center gap-2">
                {chat.pinned ? <Pin className="size-3.5 shrink-0 text-muted" /> : null}
                <span className="truncate">{chat.title}</span>
              </span>
            </button>
            <button
              type="button"
              aria-label="Chat options"
              className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center text-muted"
              onClick={() => {
                setConfirmId(null);
                setMenuId(menuId === chat.id ? null : chat.id);
              }}
            >
              <Ellipsis className="size-4" />
            </button>
            {menuId === chat.id ? (
              <div className="absolute top-9 right-1 z-20 w-36 rounded-xl border border-line bg-menu p-1 shadow-lg">
                {confirmId === chat.id ? (
                  <>
                    <p className="px-3 py-2 text-sm">Delete this chat?</p>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm"
                      onClick={() => {
                        removeChat(chat.id);
                        setMenuId(null);
                        setConfirmId(null);
                      }}
                    >
                      Yes
                    </button>
                    <button type="button" className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted" onClick={() => setConfirmId(null)}>
                      No
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm"
                      onClick={() => {
                        togglePin(chat.id);
                        setMenuId(null);
                      }}
                    >
                      {chat.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button type="button" className="block w-full rounded-lg px-3 py-2 text-left text-sm" onClick={() => setConfirmId(chat.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-2 flex w-full items-center gap-3 px-2 py-2.5 text-left text-[15px]"
        onClick={() => setPrefs((v) => !v)}
      >
        <SlidersHorizontal className="size-5" />
        <span className="flex-1">Preference</span>
        {prefs ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
      </button>
      {prefs ? (
        <div className="mb-3 grid grid-cols-3 gap-1 rounded-2xl bg-track p-1">
          {(
            [
              ["light", "Light", Sun],
              ["dark", "Dark", Moon],
              ["system", "System", Monitor],
            ] as const
          ).map(([id, name, Icon]) => (
            <button
              key={id}
              type="button"
              className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm ${
                theme === id ? "bg-track-on shadow-sm" : "text-muted"
              }`}
              onClick={() => setTheme(id)}
            >
              <Icon className="size-4" />
              {name}
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex items-center gap-3 pt-2">
        {isPending ? (
          <span className="size-11 animate-pulse rounded-full bg-track" />
        ) : user ? (
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-accent text-base font-semibold text-on-accent">
              {label.slice(0, 1).toUpperCase()}
            </span>
            <span className="truncate font-medium">{label}</span>
          </div>
        ) : (
          <Link to="/login" className="flex min-w-0 flex-1 items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-accent text-base font-semibold text-on-accent">
              M
            </span>
            <span className="truncate font-medium">Log in</span>
          </Link>
        )}
        {user && !user.isDevFallback && !gate ? (
          <button
            type="button"
            disabled={signingOut}
            className="rounded-full bg-track px-4 py-2.5 text-sm font-medium"
            onClick={() => {
              setSigningOut(true);
              void signOut().catch(() => setSigningOut(false));
            }}
          >
            {signingOut ? "…" : "Log out"}
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-track px-5 py-2.5 text-sm font-medium"
            onClick={() => setScreen("pricing")}
          >
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
}

function Pricing() {
  const setScreen = useMash((s) => s.setScreen);
  return (
    <div className="safe-top min-h-0 flex-1 overflow-y-auto px-5 pb-10">
      <button type="button" className="py-2 text-sm text-muted" onClick={() => setScreen("main")}>
        Back
      </button>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Plans and pricing</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        mash is included. mash Ultra is the longer model and stays locked until you upgrade.
      </p>
      <article className="mt-6 rounded-card border border-line p-5">
        <h2 className="text-xl font-semibold">Free</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Chat, voice, files, and image creation with a short pause after heavy use.
        </p>
        <p className="mt-4 text-3xl font-semibold">$0</p>
      </article>
      <article className="mt-4 rounded-card border border-line p-5">
        <h2 className="text-xl font-semibold">mash Ultra</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Longer answers, harder code, and bigger sheets. The arrow next to the logo shows it, and it
          stays locked on the free plan.
        </p>
        <p className="mt-5 text-2xl font-semibold">Coming later</p>
      </article>
    </div>
  );
}

function Section() {
  const screen = useMash((s) => s.screen);
  if (screen !== "more") return <MenuScreens />;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="safe-top flex items-center gap-1 px-2">
        <button type="button" aria-label="Open menu" className="grid size-10 place-items-center" onClick={() => useMash.getState().setSidebar(true)}>
          <MenuMark />
        </button>
        <h1 className="text-[1.65rem] font-semibold tracking-tight">More</h1>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        <MorePage />
      </div>
    </div>
  );
}


function MorePage() {
  const { user } = useCurrentUserState();
  const gate = useSyncExternalStore(subscribeGate, hasGateSessionMarker, () => false);
  const setLegal = useMash((s) => s.setLegal);
  const clearChats = useMash((s) => s.clearChats);
  const [armed, setArmed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  return (
    <div className="space-y-2">
      <p className="pb-2 text-sm leading-relaxed text-muted">
        Images keeps every picture. Library is the full chat list. Projects group related chats. Code keeps pages and PDFs mash already wrote. Scheduled waits until you tap Run now.
      </p>
      <Row label="Terms" onClick={() => setLegal("terms")} />
      <Row label="Privacy" onClick={() => setLegal("privacy")} />
      <Row label="Learn more" onClick={() => setLegal("learn")} />
      {user && !user.isDevFallback && !gate ? (
        <Row
          label={signingOut ? "Signing out…" : "Log out"}
          onClick={() => {
            setSigningOut(true);
            void signOut().catch(() => setSigningOut(false));
          }}
        />
      ) : null}
      <button
        type="button"
        className="flex w-full rounded-2xl bg-track px-4 py-3 text-left text-danger"
        onClick={() => {
          if (!armed) {
            setArmed(true);
            return;
          }
          clearChats();
          setArmed(false);
        }}
      >
        {armed ? "Tap again to clear every chat" : "Clear all chats"}
      </button>
      <button
        type="button"
        className="mt-4 flex items-center gap-2 text-sm text-muted"
        onClick={() => {
          const last = useMash.getState().chats[0]?.messages.filter((m) => m.role === "assistant").at(-1);
          if (last) void playSpeech(last.content);
        }}
      >
        Read the latest reply aloud
      </button>
    </div>
  );
}

function Row({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="flex w-full rounded-2xl bg-track px-4 py-3 text-left" onClick={onClick}>
      {label}
    </button>
  );
}

function LegalSheet() {
  const legal = useMash((s) => s.legal);
  const setLegal = useMash((s) => s.setLegal);
  if (!legal) return null;
  const title = legal === "terms" ? "Terms" : legal === "privacy" ? "Privacy" : "Learn more";
  const sections =
    legal === "terms"
      ? [
          ["Agreement", "These terms cover mash, the assistant for chat, code, images, voice, and small builds. By using mash you agree to them. If you do not agree, stop using it."],
          ["The service", "mash answers questions, writes code, generates images in Imagine, and speaks when you use voice. A free session can pause briefly after heavy use so the service stays available. mash Ultra, when it ships, is the longer model and stays locked until then."],
          ["Your account", "You can use mash without an account. If you sign in, you are responsible for the activity on that login. Keep your password to yourself. Tell us if you think someone else is using your account."],
          ["What you send", "You keep your rights in the text, files, and images you send. You give mash permission to process them only to produce the reply, image, or speech you asked for. Do not send material you do not have the right to use."],
          ["Acceptable use", "Do not use mash to break the law, harm people, or try to break the service. Do not ask it to create malware, scams, or sexual content involving minors. Do not overload it with automated traffic. We can refuse a request or pause access when a use breaks these rules."],
          ["Accuracy", "Replies, code, and images can be wrong, incomplete, or out of date. You check anything that matters before you rely on it, especially legal, medical, financial, or safety decisions. mash does not invent a relationship with you and does not replace a professional."],
          ["Code and previews", "Code is shown so you can read it, copy it, and preview a page when the result is HTML. A preview is a rough render in the browser, not a hosted product and not a promise that the code is bug-free."],
          ["Voice", "Voice text types what you say. The voice assistant listens, answers, and speaks back. Allow the microphone when the phone asks. Do not use voice where recording other people would be unlawful."],
          ["Ending use", "You can stop anytime. We can suspend access if these terms are broken or if the service needs to pause. Some requests may fail when the model is busy. That is not a guarantee of uptime."],
          ["Changes", "These terms can be updated as mash changes. The version you see in the app is the one that applies when you use it. Continued use after a change means you accept the update."],
        ]
      : legal === "privacy"
        ? [
            ["Overview", "mash is built to keep as much as it can on your device. This notice explains what is processed when you chat, sign in, generate an image, or use voice."],
            ["On this device", "Your chats, theme, and settings are stored in this browser. Clearing the site data removes them from the phone. Signing out ends the session in this browser. We do not use that local store as a public profile."],
            ["What you send", "When you send a message, the text and a short recent history are sent so mash can answer. If you attach a file or a photo, that file is sent with the request. Do not attach secrets, passwords, or private documents you would not want processed."],
            ["Voice", "Voice text uses the microphone to turn speech into text on the device, then sends that text like a typed message. The voice assistant does the same, then requests spoken audio of the reply. Allow the mic only if you want that."],
            ["Images", "Imagine sends your description to generate a picture and returns the image to the chat. The prompt is handled like any other message."],
            ["Account", "If you create an account, we store the email and sign-in method you use so you can come back. Passwords are stored only in hashed form. Sign-in with Google or X uses that service’s login and returns the basic profile needed to recognize you."],
            ["What we do not do", "We do not sell your chats. We do not use this screen to build a public advertising profile. We do not ask you to upload your contacts."],
            ["How long", "Chats stay in this browser until you delete them or clear site data. A request is kept only as long as needed to generate the reply, image, or speech. Server logs, if any, are for reliability and abuse prevention, not for reading your conversations back to you later."],
            ["Your choices", "You can use mash without an account, skip voice, and avoid sending files. You can start a new chat, which leaves the old one only in this browser. You can sign out from the menu."],
            ["Children", "mash is not directed at children under 13. Do not use it to create or share sexual content involving minors."],
            ["Contact", "Questions about these practices can be sent through the account email you used to sign in. If you are not signed in, the choices above are the controls available in the app."],
          ]
        : [
            ["mash", "The home model is for fast answers, code, images, and voice. Type what you want, or hold a conversation with the voice assistant."],
            ["Voice", "The microphone types what you say into the box. The round assistant mark opens a conversation: you talk, mash replies out loud."],
            ["Code", "Switch to Code or Build when you want something made. Finished HTML gets a copy button and a preview of the page under the code."],
            ["Ultra", "The arrow beside the logo opens the model list. mash Ultra stays locked until it ships."],
          ];
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-overlay" onClick={() => setLegal(null)} />
      <div className="safe-bottom relative z-10 flex max-h-dvh w-full max-w-md flex-col rounded-t-3xl bg-menu px-5 pt-5">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="mt-3 min-h-0 flex-1 space-y-4 overflow-y-auto pb-3">
          {sections.map(([head, copy]) => (
            <section key={head}>
              <h3 className="text-base font-semibold">{head}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{copy}</p>
            </section>
          ))}
        </div>
        <button type="button" className="mt-2 mb-2 w-full shrink-0 rounded-full bg-inverse py-3 font-semibold text-inverse-fg" onClick={() => setLegal(null)}>
          Done
        </button>
      </div>
    </div>
  );
}

function VoiceStage() {
  const open = useVoiceUi((s) => s.open);
  const phase = useVoiceUi((s) => s.phase);
  const line = useVoiceUi((s) => s.line);
  const sending = useMash((s) => s.sending);
  const live = useLive();
  const messages = useMash((s) => s.chats.find((c) => c.id === s.activeId)?.messages);
  let reply = "";
  let replyId = "";
  const msgs = messages ?? [];
  for (let i = msgs.length - 1; i >= 0; i -= 1) {
    const msg = msgs[i];
    if (msg.role === "assistant") {
      reply = msg.content;
      replyId = msg.id;
      break;
    }
  }
  const spoken = replyId && replyId === live.id ? live.text : reply;
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!open) setMuted(false);
  }, [open]);

  useEffect(() => {
    const again = () => {
      if (!useVoiceUi.getState().open || useVoiceUi.getState().phase !== "listen") return;
      beginVoiceListen();
    };
    window.addEventListener("mash-voice", again);
    return () => window.removeEventListener("mash-voice", again);
  }, []);

  useEffect(() => {
    if (open && !muted && phase === "listen" && !sending) return;
    try {
      recognition?.stop();
    } catch {
      /* already stopped */
    }
  }, [open, muted, phase, sending]);

  if (!open) return null;
  const caption =
    phase === "speak"
      ? spoken || "Speaking"
      : phase === "think" || sending
        ? line || "Thinking"
        : muted
          ? "Muted"
          : line || "Listening";

  return (
    <div className="mb-2 flex justify-center">
      <div className="flex max-w-full items-center gap-2 rounded-full border border-line bg-menu py-1.5 pr-1.5 pl-2">
        <div className="voice-orb voice-orb-sm shrink-0" data-phase={muted ? "think" : phase} aria-hidden="true">
          <span className="voice-orb-glow" />
          <span className="voice-orb-glow-b" />
        </div>
        <p className="max-w-44 truncate text-sm">{caption}</p>
        <button
          type="button"
          aria-label={muted ? "Unmute microphone" : "Mute microphone"}
          className="grid size-10 shrink-0 place-items-center rounded-full bg-chip"
          onClick={() => {
            if (muted) {
              setMuted(false);
              beginVoiceListen();
              return;
            }
            setMuted(true);
          }}
        >
          {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </button>
        <button
          type="button"
          aria-label="Close voice assistant"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-chip"
          onClick={() => closeVoice()}
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
}
