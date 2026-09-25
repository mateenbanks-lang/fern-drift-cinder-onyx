import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mode = "chat" | "imagine" | "document" | "code" | "build";
export type ThemeMode = "light" | "dark" | "system";
export type Screen =
  | "main"
  | "pricing"
  | "images"
  | "library"
  | "scheduled"
  | "plugins"
  | "projects"
  | "code"
  | "more";

export type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  images?: string[];
  jobId?: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Msg[];
  updated: number;
  projectId?: string;
  favorite?: boolean;
  pinned?: boolean;
};

export type Project = { id: string; name: string };

export type Schedule = {
  id: string;
  prompt: string;
  at: number;
  done: boolean;
};

export type PendingFile = {
  name: string;
  text?: string;
  dataUrl?: string;
};

type Plugins = {
  imagine: boolean;
  voice: boolean;
  files: boolean;
  preview: boolean;
};

type MashState = {
  theme: ThemeMode;
  mode: Mode;
  screen: Screen;
  sidebar: boolean;
  picker: boolean;
  searching: boolean;
  query: string;
  draft: string;
  chats: Chat[];
  activeId: string | null;
  projects: Project[];
  schedules: Schedule[];
  user: { name: string } | null;
  plugins: Plugins;
  extraTools: string[];
  loginOpen: boolean;
  legal: null | "terms" | "privacy" | "learn";
  notice: string | null;
  sending: boolean;
  pauseUntil: number;
  pendingFiles: PendingFile[];
  voiceOn: boolean;
  setTheme: (theme: ThemeMode) => void;
  setMode: (mode: Mode) => void;
  setScreen: (screen: Screen) => void;
  setSidebar: (sidebar: boolean) => void;
  setPicker: (picker: boolean) => void;
  setSearching: (searching: boolean) => void;
  setQuery: (query: string) => void;
  setDraft: (draft: string) => void;
  setLoginOpen: (loginOpen: boolean) => void;
  setLegal: (legal: MashState["legal"]) => void;
  setNotice: (notice: string | null) => void;
  setSending: (sending: boolean) => void;
  setPauseUntil: (pauseUntil: number) => void;
  setPendingFiles: (pendingFiles: PendingFile[]) => void;
  setVoiceOn: (voiceOn: boolean) => void;
  setUser: (user: { name: string } | null) => void;
  togglePlugin: (key: keyof Plugins) => void;
  toggleTool: (id: string) => void;
  toggleFavorite: (id: string) => void;
  togglePin: (id: string) => void;
  openChat: (id: string) => void;
  newChat: () => void;
  patchChat: (id: string, recipe: (chat: Chat) => Chat) => void;
  removeChat: (id: string) => void;
  clearChats: () => void;
  addProject: (name: string) => void;
  removeProject: (id: string) => void;
  assignChat: (id: string, projectId: string | null) => void;
  addSchedule: (prompt: string, at: number) => void;
  markSchedule: (id: string, done: boolean) => void;
  removeSchedule: (id: string) => void;
};

const emptyPlugins: Plugins = {
  imagine: true,
  voice: true,
  files: true,
  preview: true,
};

export const useMash = create<MashState>()(
  persist(
    (set) => ({
      theme: "dark",
      mode: "chat",
      screen: "main",
      sidebar: false,
      picker: false,
      searching: false,
      query: "",
      draft: "",
      chats: [],
      activeId: null,
      projects: [],
      schedules: [],
      user: null,
      plugins: emptyPlugins,
      extraTools: [],
      loginOpen: false,
      legal: null,
      notice: null,
      sending: false,
      pauseUntil: 0,
      pendingFiles: [],
      voiceOn: false,
      setTheme: (theme) => set({ theme }),
      setMode: (mode) => set({ mode, picker: false }),
      setScreen: (screen) => set({ screen, sidebar: false, picker: false }),
      setSidebar: (sidebar) =>
        set(
          sidebar
            ? { sidebar: true, picker: false }
            : { sidebar: false, picker: false, searching: false, query: "" },
        ),
      setPicker: (picker) => set({ picker }),
      setSearching: (searching) =>
        set(searching ? { searching: true } : { searching: false, query: "" }),
      setQuery: (query) => set({ query }),
      setDraft: (draft) => set({ draft }),
      setLoginOpen: (loginOpen) => set({ loginOpen }),
      setLegal: (legal) => set({ legal }),
      setNotice: (notice) => set({ notice }),
      setSending: (sending) => set({ sending }),
      setPauseUntil: (pauseUntil) => set({ pauseUntil }),
      setPendingFiles: (pendingFiles) => set({ pendingFiles }),
      setVoiceOn: (voiceOn) => set({ voiceOn }),
      setUser: (user) => set({ user, loginOpen: false }),
      togglePlugin: (key) =>
        set((s) => ({ plugins: { ...s.plugins, [key]: !s.plugins[key] } })),
      toggleTool: (id) =>
        set((s) => ({
          extraTools: (s.extraTools ?? []).includes(id)
            ? s.extraTools.filter((item) => item !== id)
            : [...(s.extraTools ?? []), id],
        })),
      toggleFavorite: (id) =>
        set((s) => ({
          chats: s.chats.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c)),
        })),
      togglePin: (id) =>
        set((s) => ({
          chats: s.chats.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)),
        })),
      openChat: (id) =>
        set({ activeId: id, sidebar: false, screen: "main", picker: false }),
      newChat: () =>
        set({
          activeId: null,
          sidebar: false,
          screen: "main",
          draft: "",
          mode: "chat",
          pendingFiles: [],
          picker: false,
        }),
      patchChat: (id, recipe) =>
        set((s) => ({
          chats: s.chats.map((c) => (c.id === id ? recipe(c) : c)),
        })),
      removeChat: (id) =>
        set((s) => ({
          chats: s.chats.filter((c) => c.id !== id),
          activeId: s.activeId === id ? null : s.activeId,
        })),
      clearChats: () => set({ chats: [], activeId: null, screen: "main" }),
      addProject: (name) =>
        set((s) => ({
          projects: [...s.projects, { id: crypto.randomUUID(), name }],
        })),
      removeProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          chats: s.chats.map((c) =>
            c.projectId === id ? { ...c, projectId: undefined } : c,
          ),
        })),
      assignChat: (id, projectId) =>
        set((s) => ({
          chats: s.chats.map((c) =>
            c.id === id ? { ...c, projectId: projectId ?? undefined } : c,
          ),
        })),
      addSchedule: (prompt, at) =>
        set((s) => ({
          schedules: [
            { id: crypto.randomUUID(), prompt, at, done: false },
            ...s.schedules,
          ],
        })),
      markSchedule: (id, done) =>
        set((s) => ({
          schedules: s.schedules.map((item) =>
            item.id === id ? { ...item, done } : item,
          ),
        })),
      removeSchedule: (id) =>
        set((s) => ({ schedules: s.schedules.filter((item) => item.id !== id) })),
    }),
    {
      name: "mash-v1",
      skipHydration: true,
      partialize: (s) => ({
        theme: s.theme,
        mode: s.mode,
        chats: s.chats.slice(0, 40).map((c) => ({
          ...c,
          messages: c.messages.slice(-60).map((m) => ({
            ...m,
            imageUrl: m.imageUrl?.startsWith("data:") ? undefined : m.imageUrl,
            images: undefined,
          })),
        })),
        activeId: s.activeId,
        projects: s.projects,
        schedules: s.schedules,
        user: s.user,
        plugins: s.plugins,
        extraTools: s.extraTools ?? [],
      }),
    },
  ),
);

export function activeChat(): Chat | null {
  const { chats, activeId } = useMash.getState();
  return chats.find((c) => c.id === activeId) ?? null;
}
