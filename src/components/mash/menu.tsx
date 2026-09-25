import { useMemo, useState, type ReactNode } from "react";
import { Bookmark, Filter, Mic, Plus, Search, Settings, X } from "lucide-react";
import { submitDraft } from "@/lib/mash/send";
import { useMash, type Chat } from "@/lib/mash/store";

const TOOLS = [
  { id: "gmail", mark: "M", tint: "#ea4335", name: "Gmail", copy: "Draft and rewrite email in chat" },
  { id: "drive", mark: "D", tint: "#1a73e8", name: "Google Drive", copy: "Turn notes into a doc outline" },
  { id: "desktop", mark: "DC", tint: "#202124", name: "Remote Desktop Commander", copy: "Write commands you can run" },
  { id: "github", mark: "GH", tint: "#24292f", name: "GitHub", copy: "Draft issues, PRs, and commits" },
  { id: "outlook", mark: "O", tint: "#0f6cbd", name: "Outlook Email", copy: "Draft an Outlook-style email" },
] as const;

const STARTERS: Record<string, string> = {
  gmail: "Draft an email. Ask me who it is for and what it should say.",
  drive: "Turn the notes I paste into a clean document outline.",
  desktop: "Help me automate a task. Ask what I want done, then write the commands.",
  github: "Draft a GitHub issue from the bug I describe.",
  outlook: "Draft an Outlook email. Ask me the recipient and the point.",
};

function MenuMark() {
  return (
    <svg width="17" height="11" viewBox="0 0 22 14" aria-hidden="true">
      <path d="M1 1.5h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M1 12.5h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Head({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="safe-top flex items-center gap-1 px-2 pb-1">
      <button
        type="button"
        aria-label="Open menu"
        className="grid size-10 shrink-0 place-items-center"
        onClick={() => useMash.getState().setSidebar(true)}
      >
        <MenuMark />
      </button>
      {title ? <h1 className="min-w-0 flex-1 truncate text-[1.65rem] font-semibold tracking-tight">{title}</h1> : <span className="flex-1" />}
      {children}
    </div>
  );
}

function listen(apply: (text: string) => void) {
  const w = window as Window & {
    SpeechRecognition?: new () => { start: () => void; lang: string; onresult: ((event: Event) => void) | null };
    webkitSpeechRecognition?: new () => { start: () => void; lang: string; onresult: ((event: Event) => void) | null };
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) {
    useMash.getState().setNotice("This browser has no speech recognition.");
    return;
  }
  const rec = new Ctor();
  rec.lang = "en-US";
  rec.onresult = (event: Event) => {
    const results = (event as unknown as { results: ArrayLike<ArrayLike<{ transcript: string }>> }).results;
    const said = results[0]?.[0]?.transcript?.trim() ?? "";
    if (said) apply(said);
  };
  try {
    rec.start();
  } catch {
    useMash.getState().setNotice("Mic didn’t start.");
  }
}

function nextAt(days: number, hour: number) {
  const when = new Date();
  when.setDate(when.getDate() + days);
  when.setHours(hour, 0, 0, 0);
  if (when.getTime() <= Date.now()) when.setDate(when.getDate() + 1);
  return when.getTime();
}

export function MenuScreens() {
  const screen = useMash((s) => s.screen);
  if (screen === "images") return <ImagesScreen />;
  if (screen === "library") return <LibraryScreen />;
  if (screen === "scheduled") return <ScheduledScreen />;
  if (screen === "plugins") return <PluginsScreen />;
  if (screen === "projects") return <ProjectsScreen />;
  if (screen === "code") return <CodeScreen />;
  return null;
}

const PICKS = [
  ["sketch", "Sketch", "#f4f4f4", "#111111", "#f0b429"],
  ["stickers", "Stickers", "#fff7e8", "#111111", "#f76707"],
  ["portrait", "Portrait", "#c4a48a", "#2c241c", "#e8d5c4"],
  ["city", "Night city", "#0b1020", "#7ec8e3", "#f4a3b5"],
  ["ocean", "Ocean", "#083344", "#67e8f9", "#f8fafc"],
  ["food", "Food", "#fff1e6", "#e8590c", "#2f9e44"],
  ["cat", "Cat", "#fff4d6", "#111111", "#ffe14a"],
  ["plant", "Plant", "#e7f5e7", "#2f9e44", "#f4f4f4"],
  ["logo", "Logo", "#111111", "#e8ff47", "#ffffff"],
  ["poster", "Poster", "#1a1a1a", "#ff4d6d", "#ffffff"],
  ["watch", "Product", "#ececec", "#111111", "#c0c0c0"],
  ["flower", "Floral", "#fff0f6", "#e64980", "#2f9e44"],
  ["car", "Car", "#e7f5ff", "#1c7ed6", "#111111"],
  ["abstract", "Abstract", "#f3f0ff", "#7048e8", "#ff922b"],
  ["icon", "App icon", "#edf2ff", "#2457d6", "#ffffff"],
  ["wall", "Wallpaper", "#0b1020", "#1d3b2a", "#f8fafc"],
] as const;

export function GalleryArt({ id, className }: { id: string; className?: string }) {
  const pick = PICKS.find((item) => item[0] === id) ?? PICKS[0];
  const [, , bg, ink, accent] = pick;
  return (
    <svg viewBox="0 0 160 160" className={className ?? "aspect-square w-full rounded-[1.3rem]"} aria-hidden="true">
      <rect width="160" height="160" fill={bg} />
      {id === "sketch" || id === "flower" ? (
        <>
          <circle cx="80" cy="78" r="18" fill={accent} />
          <circle cx="80" cy="48" r="16" fill="none" stroke={ink} strokeWidth="3" />
          <circle cx="110" cy="68" r="16" fill="none" stroke={ink} strokeWidth="3" />
          <circle cx="100" cy="102" r="16" fill="none" stroke={ink} strokeWidth="3" />
          <circle cx="60" cy="102" r="16" fill="none" stroke={ink} strokeWidth="3" />
          <circle cx="50" cy="68" r="16" fill="none" stroke={ink} strokeWidth="3" />
          <path d="M80 96v40" stroke="#2f9e44" strokeWidth="4" />
        </>
      ) : id === "stickers" || id === "cat" ? (
        <>
          <circle cx="58" cy="62" r="28" fill={accent} />
          <circle cx="108" cy="58" r="22" fill="#2f9e44" />
          <rect x="48" y="96" width="64" height="40" rx="16" fill="#f76707" />
        </>
      ) : id === "portrait" ? (
        <>
          <circle cx="80" cy="62" r="28" fill={accent} />
          <path d="M36 150c8-36 28-52 44-52s36 16 44 52" fill={ink} />
        </>
      ) : id === "city" ? (
        <>
          <rect x="18" y="70" width="28" height="90" fill={ink} />
          <rect x="54" y="40" width="34" height="120" fill="#16325c" />
          <rect x="98" y="78" width="40" height="82" fill={ink} />
          <circle cx="124" cy="36" r="10" fill={accent} />
        </>
      ) : id === "ocean" ? (
        <>
          <path d="M0 90h160v70H0z" fill={bg} />
          <path d="M0 100c20-16 30 10 50 0s30-16 50 0 30 16 60 0v60H0z" fill={ink} />
          <circle cx="120" cy="42" r="14" fill={accent} />
        </>
      ) : id === "food" ? (
        <>
          <ellipse cx="80" cy="96" rx="48" ry="22" fill={ink} />
          <circle cx="62" cy="78" r="14" fill={accent} />
          <circle cx="96" cy="74" r="16" fill="#2f9e44" />
        </>
      ) : id === "plant" ? (
        <>
          <rect x="62" y="96" width="36" height="34" rx="6" fill={ink} />
          <ellipse cx="80" cy="78" rx="18" ry="28" fill={accent} />
          <ellipse cx="58" cy="86" rx="16" ry="22" fill="#1b6b32" />
          <ellipse cx="104" cy="86" rx="16" ry="22" fill="#1b6b32" />
        </>
      ) : id === "logo" || id === "icon" ? (
        <text x="80" y="98" textAnchor="middle" fontSize="64" fontFamily="sans-serif" fontWeight="700" fill={id === "logo" ? accent : ink}>
          M
        </text>
      ) : id === "poster" ? (
        <>
          <rect x="28" y="24" width="104" height="112" fill={ink} />
          <text x="80" y="90" textAnchor="middle" fontSize="28" fontFamily="sans-serif" fontWeight="700" fill={accent}>
            LIVE
          </text>
        </>
      ) : id === "watch" ? (
        <>
          <rect x="70" y="28" width="20" height="18" rx="4" fill={ink} />
          <circle cx="80" cy="92" r="36" fill={accent} stroke={ink} strokeWidth="8" />
        </>
      ) : id === "car" ? (
        <>
          <path d="M24 100h112l-12-28H48z" fill={ink} />
          <circle cx="52" cy="112" r="12" fill={accent} />
          <circle cx="112" cy="112" r="12" fill={accent} />
        </>
      ) : (
        <>
          <circle cx="58" cy="70" r="34" fill={ink} />
          <circle cx="108" cy="96" r="28" fill={accent} />
        </>
      )}
    </svg>
  );
}

function ImagesScreen() {
  const chats = useMash((s) => s.chats);
  const sending = useMash((s) => s.sending);
  const [prompt, setPrompt] = useState("");
  const [chip, setChip] = useState(true);
  const [tab, setTab] = useState<"trending" | "templates">("trending");
  const shots = useMemo(
    () =>
      chats.flatMap((chat) =>
        (chat.messages ?? []).flatMap((message) => {
          const rows: { id: string; url: string; chatId: string }[] = [];
          if (message.imageUrl) rows.push({ id: message.id, url: message.imageUrl, chatId: chat.id });
          return rows;
        }),
      ),
    [chats],
  );
  const [pick, setPick] = useState<string | null>(null);
  const shown = tab === "trending" ? PICKS.slice(0, 8) : PICKS.slice(8);

  function go(text: string) {
    const line = text.trim();
    if (!line || sending) return;
    useMash.getState().setMode(chip ? "imagine" : "chat");
    void submitDraft({ text: line, stay: chip });
    setPrompt("");
  }

  function take(id: string, label: string) {
    const chatId = crypto.randomUUID();
    useMash.setState((s) => ({
      activeId: chatId,
      screen: "main",
      sidebar: false,
      chats: [
        {
          id: chatId,
          title: label,
          updated: Date.now(),
          messages: [{ id: crypto.randomUUID(), role: "assistant" as const, content: label, imageUrl: `gallery:${id}` }],
        },
        ...s.chats,
      ].slice(0, 40),
    }));
  }

  const chosen = PICKS.find((item) => item[0] === pick);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Head title="Images" />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        <div className="rounded-[1.6rem] bg-track px-4 pt-4 pb-3">
          <textarea
            value={prompt}
            rows={2}
            placeholder="Describe a new image"
            className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="mt-2 flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-full bg-chip text-lg">+</span>
            {chip ? (
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-sm font-medium text-on-accent"
                onClick={() => setChip(false)}
              >
                <span aria-hidden="true">▣</span>
                Image
                <X className="size-3.5" />
              </button>
            ) : (
              <button type="button" className="rounded-full bg-chip px-3 py-2 text-sm" onClick={() => setChip(true)}>
                Image
              </button>
            )}
            <button type="button" aria-label="Voice" className="ml-auto grid size-10 place-items-center rounded-full bg-chip" onClick={() => listen(setPrompt)}>
              <Mic className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Create image"
              disabled={!prompt.trim() || sending}
              className="grid size-10 place-items-center rounded-full bg-accent text-on-accent disabled:opacity-40"
              onClick={() => go(prompt)}
            >
              ↑
            </button>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          {(["trending", "templates"] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium ${tab === id ? "bg-chip" : "text-muted"}`}
              onClick={() => setTab(id)}
            >
              {id === "trending" ? "Trending" : "Templates"}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {shown.map(([id, label]) => (
            <button key={id} type="button" className="text-left" onClick={() => setPick(id)}>
              <GalleryArt id={id} />
              <span className="mt-2 block px-1 text-sm">{label}</span>
            </button>
          ))}
        </div>
        {sending ? <p className="mt-4 text-sm text-muted">Making it… it stays here if you leave this page.</p> : null}
        {shots.length ? (
          <>
            <p className="mt-6 text-sm text-muted">Yours</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {shots.map((shot) => (
                <button key={shot.id} type="button" className="overflow-hidden rounded-2xl bg-track" onClick={() => useMash.getState().openChat(shot.chatId)}>
                  {shot.url.startsWith("gallery:") ? (
                    <GalleryArt id={shot.url.slice(8)} />
                  ) : (
                    <img src={shot.url} alt="" className="aspect-square w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
      {chosen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg">
          <div className="safe-top flex items-center gap-2 px-3 py-2">
            <button type="button" className="text-sm text-muted" onClick={() => setPick(null)}>
              Back
            </button>
            <h1 className="text-base font-semibold">{chosen[1]}</h1>
          </div>
          <div className="min-h-0 flex-1 px-6 pt-4">
            <GalleryArt id={chosen[0]} className="mx-auto aspect-square w-full max-w-sm rounded-[1.6rem]" />
          </div>
          <div className="safe-bottom flex gap-2 px-4 pb-4">
            <button
              type="button"
              className="flex-1 rounded-full bg-track py-3 font-semibold"
              onClick={() => {
                setPrompt(`Make a polished ${chosen[1].toLowerCase()} image`);
                setPick(null);
              }}
            >
              Remix
            </button>
            <button type="button" className="flex-1 rounded-full bg-accent py-3 font-semibold text-on-accent" onClick={() => take(chosen[0], chosen[1])}>
              Use this
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LibraryScreen() {
  const chats = useMash((s) => s.chats);
  const projects = useMash((s) => s.projects);
  const [tab, setTab] = useState<"suggested" | "favorites" | "folders" | "images">("favorites");
  const [view, setView] = useState<"list" | "grid">("grid");
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const [folder, setFolder] = useState("");
  const query = q.trim().toLowerCase();
  const shown = chats.filter((chat) => !query || chat.title.toLowerCase().includes(query) || chatPreview(chat).toLowerCase().includes(query));
  const favs = shown.filter((chat) => chat.favorite);
  const shots = useMemo(
    () =>
      chats.flatMap((chat) =>
        (chat.messages ?? []).flatMap((message) =>
          message.imageUrl ? [{ id: message.id, url: message.imageUrl, chatId: chat.id, title: chat.title }] : [],
        ),
      ),
    [chats],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Head title="Library">
        <button type="button" className="rounded-full bg-inverse px-4 py-2 text-sm font-semibold text-inverse-fg" onClick={() => setMenu((v) => !v)}>
          New ▾
        </button>
        <button type="button" aria-label="Settings" className="grid size-10 place-items-center" onClick={() => useMash.getState().setScreen("more")}>
          <Settings className="size-5" />
        </button>
      </Head>
      {menu ? (
        <div className="mx-4 mb-2 rounded-2xl bg-track p-1">
          <button type="button" className="block w-full rounded-xl px-3 py-2 text-left text-sm" onClick={() => { setMenu(false); useMash.getState().newChat(); }}>
            New chat
          </button>
          <form
            className="flex gap-2 px-2 py-1"
            onSubmit={(e) => {
              e.preventDefault();
              if (!folder.trim()) return;
              useMash.getState().addProject(folder.trim());
              setFolder("");
              setMenu(false);
              setTab("folders");
            }}
          >
            <input value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="New folder" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" />
            <button type="submit" className="text-sm">Add</button>
          </form>
        </div>
      ) : null}
      <div className="flex items-center gap-2 px-4">
        <button type="button" aria-label="List" className={`grid size-9 place-items-center rounded-full ${view === "list" ? "bg-chip" : ""}`} onClick={() => setView("list")}>≡</button>
        <button type="button" aria-label="Grid" className={`grid size-9 place-items-center rounded-full ${view === "grid" ? "bg-chip" : ""}`} onClick={() => setView("grid")}>▦</button>
        <label className="ml-1 flex min-w-0 flex-1 items-center gap-2 rounded-full bg-track px-3 py-2">
          <Search className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search library" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" />
        </label>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto px-4">
        {(["suggested", "favorites", "folders", "images"] as const).map((id) => (
          <button key={id} type="button" className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${tab === id ? "bg-chip font-medium" : "text-muted"}`} onClick={() => setTab(id)}>
            {id[0].toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-6 pb-8">
        {tab === "favorites" && favs.length === 0 ? (
          <Empty mark={<Bookmark className="size-5" />} title="Save your favorites" copy="Items you add to Favorites will appear here." />
        ) : null}
        {tab === "favorites" ? <ChatList chats={favs} view={view} /> : null}
        {tab === "suggested" ? <ChatList chats={shown} view={view} /> : null}
        {tab === "folders" ? (
          projects.length === 0 ? (
            <Empty mark="▣" title="No folders yet" copy="Use New to make a folder, then add chats from Projects." />
          ) : (
            <ul className="space-y-2">
              {projects
                .filter((project) => !query || project.name.toLowerCase().includes(query))
                .map((project) => (
                  <li key={project.id}>
                    <button type="button" className="flex w-full items-center gap-3 rounded-2xl bg-track px-3 py-3 text-left" onClick={() => useMash.getState().setScreen("projects")}>
                      <span className="grid size-10 place-items-center rounded-xl bg-chip">▣</span>
                      <span>
                        <span className="block font-medium">{project.name}</span>
                        <span className="text-sm text-muted">{chats.filter((c) => c.projectId === project.id).length} chats</span>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          )
        ) : null}
        {tab === "images" ? (
          shots.length === 0 ? (
            <Empty mark="▣" title="No images yet" copy="Images you make show up here." />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {shots.map((shot) => (
                <button key={shot.id} type="button" className="overflow-hidden rounded-2xl" onClick={() => useMash.getState().openChat(shot.chatId)}>
                  {shot.url.startsWith("gallery:") ? (
                    <GalleryArt id={shot.url.slice(8)} />
                  ) : (
                    <img src={shot.url} alt={shot.title} className="aspect-square w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}

function ChatList({ chats, view }: { chats: Chat[]; view: "list" | "grid" }) {
  if (!chats.length) return null;
  if (view === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {chats.map((chat) => (
          <button key={chat.id} type="button" className="rounded-2xl bg-track p-3 text-left" onClick={() => useMash.getState().openChat(chat.id)}>
            <span className="block truncate font-medium">{chat.title}</span>
            <span className="mt-1 block truncate text-sm text-muted">{chatPreview(chat)}</span>
          </button>
        ))}
      </div>
    );
  }
  return (
    <ul>
      {chats.map((chat) => (
        <li key={chat.id} className="flex items-center gap-2 border-b border-line py-3">
          <button type="button" className="min-w-0 flex-1 text-left" onClick={() => useMash.getState().openChat(chat.id)}>
            <span className="block truncate font-medium">{chat.title}</span>
            <span className="block truncate text-sm text-muted">{chatPreview(chat)}</span>
          </button>
          <button type="button" aria-label="Favorite" className={chat.favorite ? "text-fg" : "text-muted"} onClick={() => useMash.getState().toggleFavorite(chat.id)}>
            <Bookmark className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function Empty({ mark, title, copy }: { mark: ReactNode; title: string; copy: string }) {
  return (
    <div className="grid place-items-center px-6 pt-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-chip text-muted">{mark}</span>
      <p className="mt-4 text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">{copy}</p>
    </div>
  );
}

function chatPreview(chat: Chat) {
  const last = [...(chat.messages ?? [])].reverse().find((m) => m.content?.trim());
  if (!last) return "Empty chat";
  return last.content.replace(/\s+/g, " ").slice(0, 80);
}

function ScheduledScreen() {
  const schedules = useMash((s) => s.schedules);
  const [task, setTask] = useState("");
  const [active, setActive] = useState(true);
  const rows = active ? schedules.filter((item) => !item.done) : schedules;
  const ideas = [
    ["Daily brief", "Personalized daily briefing with updates you care about", "Give me a short daily brief for Karachi: one useful idea and what I should remember.", nextAt(1, 8)],
    ["Weekend long read", "Every Saturday, find me an exceptional long read", "Find one exceptional long read for the weekend and say why it is worth the time.", nextAt(6, 9)],
    ["Sale monitor", "Watch my favorite stores or products", "Help me watch a product price. Ask what I want to track, then give me a checklist.", nextAt(1, 18)],
    ["Concert alerts", "Let me know when artists I like announce shows", "Ask which artists I follow, then make a weekly concert watchlist.", nextAt(1, 18)],
  ] as const;

  function add(prompt: string, at: number) {
    if (schedules.some((item) => item.prompt === prompt && !item.done)) {
      useMash.getState().setNotice("That task is already active.");
      return;
    }
    useMash.getState().addSchedule(prompt, at);
    useMash.getState().setNotice("Scheduled. Tap Run now when you want it.");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Head title="Scheduled" />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        <button type="button" className={`mt-2 flex items-center gap-2 rounded-full px-3 py-2 text-sm ${active ? "bg-chip" : "text-muted"}`} onClick={() => setActive((v) => !v)}>
          <Filter className="size-4" />
          {active ? "Active" : "All"}
        </button>
        <p className="mt-4 text-[15px] leading-relaxed">Ask mash to schedule tasks, set reminders, or check something later.</p>
        <form
          className="mt-4 rounded-[1.6rem] bg-track px-4 pt-4 pb-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!task.trim()) return;
            add(task.trim(), nextAt(1, 9));
            setTask("");
          }}
        >
          <textarea value={task} onChange={(e) => setTask(e.target.value)} rows={2} placeholder="Schedule a task" className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted" />
          <div className="mt-2 flex items-center">
            <span className="grid size-10 place-items-center rounded-full bg-chip"><Plus className="size-4" /></span>
            <button type="button" aria-label="Voice" className="ml-auto grid size-10 place-items-center rounded-full bg-chip" onClick={() => listen(setTask)}>
              <Mic className="size-4" />
            </button>
            <button type="submit" aria-label="Schedule" className="ml-2 grid size-10 place-items-center rounded-full bg-chip">↑</button>
          </div>
        </form>
        {rows.length ? (
          <ul className="mt-4 space-y-2">
            {rows.map((item) => (
              <li key={item.id} className="rounded-2xl bg-track px-4 py-3">
                <p className="text-sm">{item.prompt}</p>
                <p className="mt-1 text-xs text-muted">{new Date(item.at).toLocaleString()} {item.done ? "· ran" : ""}</p>
                <div className="mt-2 flex gap-3 text-sm">
                  {!item.done ? (
                    <button
                      type="button"
                      onClick={() => {
                        useMash.getState().markSchedule(item.id, true);
                        void submitDraft({ text: item.prompt });
                      }}
                    >
                      Run now
                    </button>
                  ) : null}
                  <button type="button" className="text-muted" onClick={() => useMash.getState().removeSchedule(item.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-6 text-sm text-muted">Recommended ▾</p>
        <ul className="mt-2">
          {ideas.map(([title, copy, prompt, at]) => (
            <li key={title} className="flex items-center gap-3 border-b border-line py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{title}</p>
                <p className="truncate text-sm text-muted">{copy}</p>
              </div>
              <button type="button" aria-label={`Add ${title}`} className="grid size-9 place-items-center" onClick={() => add(prompt, at)}>
                <Plus className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PluginsScreen() {
  const plugins = useMash((s) => s.plugins);
  const extra = useMash((s) => s.extraTools ?? []);
  const toggle = useMash((s) => s.togglePlugin);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const core = [
    ["imagine", "Imagine", "Generate images from a prompt"],
    ["voice", "Voice", "Talk with the voice assistant"],
    ["files", "Files", "Attach photos and files"],
    ["preview", "Preview", "Show a page under finished code"],
  ] as const;
  const popular = TOOLS.filter((tool) => !extra.includes(tool.id) && (!query || tool.name.toLowerCase().includes(query)));
  const installed = TOOLS.filter((tool) => extra.includes(tool.id));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Head title="" />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        <h1 className="text-[2rem] font-semibold tracking-tight">Plugins</h1>
        <p className="mt-1 text-[15px]">Work with mash across the tools you use.</p>
        <div className="mt-4 flex items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-track px-3 py-3">
            <Search className="size-4 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search plugins" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted" />
          </label>
          <span className="grid size-11 place-items-center rounded-full bg-chip"><Plus className="size-5" /></span>
        </div>
        <p className="mt-6 text-sm text-muted">Installed</p>
        <ul className="mt-2 space-y-2">
          {core
            .filter(([, name]) => !query || name.toLowerCase().includes(query))
            .map(([key, name, copy]) => (
              <li key={key} className="flex items-center gap-3 py-2">
                <span className="grid size-11 place-items-center rounded-2xl bg-chip text-sm font-semibold">{name.slice(0, 1)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{name}</span>
                  <span className="block text-sm text-muted">{copy}</span>
                </span>
                <button type="button" role="switch" aria-checked={plugins[key]} className={`h-7 w-12 rounded-full p-1 ${plugins[key] ? "bg-accent" : "bg-line"}`} onClick={() => toggle(key)}>
                  <span className={`block size-5 rounded-full bg-on-accent ${plugins[key] ? "ml-auto" : ""}`} />
                </button>
              </li>
            ))}
          {installed.map((tool) => (
            <li key={tool.id} className="flex items-center gap-3 py-2">
              <span className="grid size-11 place-items-center rounded-2xl text-sm font-semibold text-white" style={{ background: tool.tint }}>{tool.mark}</span>
              <button type="button" className="min-w-0 flex-1 text-left" onClick={() => openTool(tool.id)}>
                <span className="block font-medium">{tool.name}</span>
                <span className="block text-sm text-muted">{tool.copy}</span>
              </button>
              <button type="button" className="text-sm text-muted" onClick={() => useMash.getState().toggleTool(tool.id)}>Remove</button>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-medium">Popular</p>
        <ul className="mt-2">
          {popular.map((tool) => (
            <li key={tool.id} className="flex items-center gap-3 py-3">
              <span className="grid size-11 place-items-center rounded-2xl text-sm font-semibold text-white" style={{ background: tool.tint }}>{tool.mark}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{tool.name}</span>
                <span className="block text-sm text-muted">{tool.copy}</span>
              </span>
              <button type="button" aria-label={`Add ${tool.name}`} className="grid size-9 place-items-center" onClick={() => useMash.getState().toggleTool(tool.id)}>
                <Plus className="size-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function openTool(id: string) {
  const text = STARTERS[id];
  if (!text) return;
  useMash.getState().setMode("chat");
  useMash.getState().setDraft(text);
  useMash.getState().setScreen("main");
  useMash.getState().setSidebar(false);
}

function ProjectsScreen() {
  const projects = useMash((s) => s.projects);
  const chats = useMash((s) => s.chats);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "yours" | "shared">("all");
  const [making, setMaking] = useState(false);
  const [name, setName] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const query = q.trim().toLowerCase();
  const list = projects.filter((project) => !query || project.name.toLowerCase().includes(query));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Head title="Projects">
        <button type="button" className="rounded-full bg-inverse px-4 py-2 text-sm font-semibold text-inverse-fg" onClick={() => setMaking((v) => !v)}>
          New
        </button>
      </Head>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        {making ? (
          <form
            className="mb-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              useMash.getState().addProject(name.trim());
              setName("");
              setMaking(false);
            }}
          >
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="min-w-0 flex-1 rounded-full bg-track px-4 py-3 outline-none placeholder:text-muted" />
            <button type="submit" className="rounded-full bg-accent px-4 text-sm font-semibold text-on-accent">Add</button>
          </form>
        ) : null}
        <label className="flex items-center gap-2 rounded-full bg-track px-4 py-3">
          <Search className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted" />
        </label>
        <div className="mt-4 flex gap-3 text-sm">
          {(
            [
              ["all", "All"],
              ["yours", "Created by you"],
              ["shared", "Shared with you"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" className={`rounded-full px-3 py-1.5 ${tab === id ? "bg-chip font-medium" : "text-muted"}`} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>
        {tab === "shared" ? <Empty mark="▣" title="Nothing shared" copy="Projects on this phone stay with you." /> : null}
        {tab !== "shared" && list.length === 0 ? <Empty mark="▣" title="No projects yet" copy="Tap New to start one, then add chats into it." /> : null}
        {tab !== "shared" ? (
          <ul className="mt-4 space-y-3">
            {list.map((project) => {
              const inside = chats.filter((c) => c.projectId === project.id);
              const loose = chats.filter((c) => c.projectId !== project.id);
              return (
                <li key={project.id} className="rounded-2xl bg-track p-3">
                  <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setOpen(open === project.id ? null : project.id)}>
                    <span>
                      <span className="block font-medium">{project.name}</span>
                      <span className="text-sm text-muted">{inside.length} chats</span>
                    </span>
                    <span className="text-muted">{open === project.id ? "▾" : "›"}</span>
                  </button>
                  {open === project.id ? (
                    <div className="mt-2">
                      {inside.map((chat) => (
                        <div key={chat.id} className="flex items-center justify-between py-1">
                          <button type="button" className="truncate text-sm" onClick={() => useMash.getState().openChat(chat.id)}>{chat.title}</button>
                          <button type="button" className="text-xs text-muted" onClick={() => useMash.getState().assignChat(chat.id, null)}>Out</button>
                        </div>
                      ))}
                      {loose.slice(0, 6).map((chat) => (
                        <button key={chat.id} type="button" className="block w-full truncate py-1 text-left text-sm text-muted" onClick={() => useMash.getState().assignChat(chat.id, project.id)}>
                          Add {chat.title}
                        </button>
                      ))}
                      <button type="button" className="mt-2 text-sm text-muted" onClick={() => useMash.getState().removeProject(project.id)}>Remove project</button>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function CodeScreen() {
  const chats = useMash((s) => s.chats);
  const sending = useMash((s) => s.sending);
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const blocks = useMemo(() => {
    const found: { id: string; chat: string; chatId: string; lang: string; code: string }[] = [];
    for (const chat of chats) {
      for (const message of chat.messages ?? []) {
        if (typeof message.content !== "string") continue;
        const bits = message.content.split("```");
        for (let i = 1; i < bits.length; i += 2) {
          const nl = bits[i].indexOf("\n");
          const code = (nl === -1 ? "" : bits[i].slice(nl + 1)).trim();
          if (!code) continue;
          found.push({
            id: `${message.id}-${i}`,
            chat: chat.title,
            chatId: chat.id,
            lang: (nl === -1 ? bits[i] : bits[i].slice(0, nl)).trim() || "code",
            code,
          });
        }
      }
    }
    return found;
  }, [chats]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Head title="Code" />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        <form
          className="rounded-[1.6rem] bg-track px-4 pt-4 pb-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!prompt.trim() || sending) return;
            useMash.getState().setMode("code");
            void submitDraft({ text: prompt.trim() });
            setPrompt("");
          }}
        >
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2} placeholder="Describe what to build" className="w-full resize-none bg-transparent text-base outline-none placeholder:text-muted" />
          <div className="mt-2 flex justify-end">
            <button type="submit" disabled={!prompt.trim() || sending} className="grid size-10 place-items-center rounded-full bg-accent text-on-accent disabled:opacity-40">↑</button>
          </div>
        </form>
        {blocks.length === 0 ? (
          <Empty mark=">_ " title="No code yet" copy="Describe a page or a script. Finished code collects here, and you can copy it." />
        ) : (
          <ul className="mt-4 space-y-3">
            {blocks.map((block) => (
              <li key={block.id} className="rounded-2xl bg-track p-3">
                <p className="text-xs text-muted">{block.lang === "pdf" ? "Document" : block.lang} · {block.chat}</p>
                <pre className="mt-2 max-h-28 overflow-hidden text-sm leading-relaxed">{block.code}</pre>
                <div className="mt-2 flex gap-4 text-sm">
                  <button type="button" onClick={() => useMash.getState().openChat(block.chatId)}>Open chat</button>
                  <button
                    type="button"
                    className="text-muted"
                    onClick={() => {
                      void navigator.clipboard.writeText(block.code);
                      setCopied(block.id);
                    }}
                  >
                    {copied === block.id ? "Copied" : "Copy"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
