import { o as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getServerFnById, n as createServerFn, r as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { A as AtSign, C as Ellipsis, D as Check, E as ChevronDown, O as ChartColumn, S as Folder, T as ChevronRight, _ as Mic, a as Square, b as Image$1, c as SlidersHorizontal, d as Search, f as Plus, g as Monitor, h as Moon, i as Sun, j as ArrowUp, k as Bookmark, l as Share, m as Paperclip, o as SquarePen, p as Pin, r as Terminal, s as Sparkles, t as X, u as Settings, v as MicOff, w as Clock, x as Funnel, y as Lock } from "../_libs/lucide-react.mjs";
import { r as hasGateSessionMarker } from "./router-wTJ_phhm.mjs";
import { i as useCurrentUserState, r as signOut } from "./use-current-user-aGeK05Fx.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as katex } from "../_libs/katex.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-FlzEPilF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var emptyPlugins = {
	imagine: true,
	voice: true,
	files: true,
	preview: true
};
var useMash = create()(persist((set) => ({
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
	setMode: (mode) => set({
		mode,
		picker: false
	}),
	setScreen: (screen) => set({
		screen,
		sidebar: false,
		picker: false
	}),
	setSidebar: (sidebar) => set(sidebar ? {
		sidebar: true,
		picker: false
	} : {
		sidebar: false,
		picker: false,
		searching: false,
		query: ""
	}),
	setPicker: (picker) => set({ picker }),
	setSearching: (searching) => set(searching ? { searching: true } : {
		searching: false,
		query: ""
	}),
	setQuery: (query) => set({ query }),
	setDraft: (draft) => set({ draft }),
	setLoginOpen: (loginOpen) => set({ loginOpen }),
	setLegal: (legal) => set({ legal }),
	setNotice: (notice) => set({ notice }),
	setSending: (sending) => set({ sending }),
	setPauseUntil: (pauseUntil) => set({ pauseUntil }),
	setPendingFiles: (pendingFiles) => set({ pendingFiles }),
	setVoiceOn: (voiceOn) => set({ voiceOn }),
	setUser: (user) => set({
		user,
		loginOpen: false
	}),
	togglePlugin: (key) => set((s) => ({ plugins: {
		...s.plugins,
		[key]: !s.plugins[key]
	} })),
	toggleTool: (id) => set((s) => ({ extraTools: (s.extraTools ?? []).includes(id) ? s.extraTools.filter((item) => item !== id) : [...s.extraTools ?? [], id] })),
	toggleFavorite: (id) => set((s) => ({ chats: s.chats.map((c) => c.id === id ? {
		...c,
		favorite: !c.favorite
	} : c) })),
	togglePin: (id) => set((s) => ({ chats: s.chats.map((c) => c.id === id ? {
		...c,
		pinned: !c.pinned
	} : c) })),
	openChat: (id) => set({
		activeId: id,
		sidebar: false,
		screen: "main",
		picker: false
	}),
	newChat: () => set({
		activeId: null,
		sidebar: false,
		screen: "main",
		draft: "",
		mode: "chat",
		pendingFiles: [],
		picker: false
	}),
	patchChat: (id, recipe) => set((s) => ({ chats: s.chats.map((c) => c.id === id ? recipe(c) : c) })),
	removeChat: (id) => set((s) => ({
		chats: s.chats.filter((c) => c.id !== id),
		activeId: s.activeId === id ? null : s.activeId
	})),
	clearChats: () => set({
		chats: [],
		activeId: null,
		screen: "main"
	}),
	addProject: (name) => set((s) => ({ projects: [...s.projects, {
		id: crypto.randomUUID(),
		name
	}] })),
	removeProject: (id) => set((s) => ({
		projects: s.projects.filter((p) => p.id !== id),
		chats: s.chats.map((c) => c.projectId === id ? {
			...c,
			projectId: void 0
		} : c)
	})),
	assignChat: (id, projectId) => set((s) => ({ chats: s.chats.map((c) => c.id === id ? {
		...c,
		projectId: projectId ?? void 0
	} : c) })),
	addSchedule: (prompt, at) => set((s) => ({ schedules: [{
		id: crypto.randomUUID(),
		prompt,
		at,
		done: false
	}, ...s.schedules] })),
	markSchedule: (id, done) => set((s) => ({ schedules: s.schedules.map((item) => item.id === id ? {
		...item,
		done
	} : item) })),
	removeSchedule: (id) => set((s) => ({ schedules: s.schedules.filter((item) => item.id !== id) }))
}), {
	name: "mash-v1",
	skipHydration: true,
	partialize: (s) => ({
		theme: s.theme,
		mode: s.mode,
		chats: s.chats.slice(0, 40).map((c) => ({
			...c,
			messages: c.messages.slice(-60).map((m) => ({
				...m,
				imageUrl: m.imageUrl?.startsWith("data:") ? void 0 : m.imageUrl,
				images: void 0
			}))
		})),
		activeId: s.activeId,
		projects: s.projects,
		schedules: s.schedules,
		user: s.user,
		plugins: s.plugins,
		extraTools: s.extraTools ?? []
	})
}));
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var imagineImage = createServerFn({ method: "POST" }).validator((input) => {
	const prompt = input && typeof input === "object" && "prompt" in input ? String(input.prompt).trim().slice(0, 1600) : "";
	if (prompt.length < 2) throw new Error("Describe the image first.");
	return { prompt };
}).handler(createSsrRpc("de950e342c8eb442f49f2dd748d22b98acf97ba6f21b72ba559748b87e4dbf57"));
var editImage = createServerFn({ method: "POST" }).validator((input) => {
	const raw = input && typeof input === "object" ? input : {};
	const prompt = String(raw.prompt ?? "").trim().slice(0, 1600);
	const image = String(raw.image ?? "");
	if (prompt.length < 2) throw new Error("Say what to change.");
	if (!image.startsWith("data:image/") || image.length > 5e5) throw new Error("Attach the photo to edit.");
	return {
		prompt,
		image
	};
}).handler(createSsrRpc("b7429131bb7dbea3dfd244af6e5f6df136675bbe9ef2940052e81b46cedcb350"));
var speakText = createServerFn({ method: "POST" }).validator((input) => {
	const text = input && typeof input === "object" && "text" in input ? String(input.text).trim().slice(0, 600) : "";
	if (!text) throw new Error("Nothing to read.");
	return { text };
}).handler(createSsrRpc("e8fdd19ee3278ee72fd45c8a5f79793899ad20afd8c6e425b91c7966fe3b56bb"));
var THEMES = {
	navy: {
		bar: "0.08 0.16 0.38",
		accent: "0.16 0.33 0.75",
		ink: "0.10 0.12 0.16",
		muted: "0.35 0.38 0.45",
		paper: "0.97 0.97 0.98",
		soft: "0.91 0.94 0.98"
	},
	gold: {
		bar: "0.22 0.14 0.05",
		accent: "0.62 0.46 0.16",
		ink: "0.16 0.12 0.08",
		muted: "0.42 0.34 0.24",
		paper: "0.99 0.97 0.93",
		soft: "0.95 0.90 0.80"
	},
	forest: {
		bar: "0.08 0.24 0.14",
		accent: "0.13 0.42 0.26",
		ink: "0.10 0.14 0.12",
		muted: "0.32 0.40 0.34",
		paper: "0.96 0.98 0.96",
		soft: "0.88 0.94 0.89"
	},
	ink: {
		bar: "0.09 0.09 0.10",
		accent: "0.18 0.18 0.20",
		ink: "0.10 0.10 0.12",
		muted: "0.40 0.40 0.44",
		paper: "0.98 0.98 0.98",
		soft: "0.93 0.93 0.94"
	},
	rose: {
		bar: "0.42 0.12 0.22",
		accent: "0.70 0.24 0.36",
		ink: "0.18 0.10 0.12",
		muted: "0.45 0.32 0.36",
		paper: "0.99 0.96 0.97",
		soft: "0.97 0.90 0.92"
	},
	slate: {
		bar: "0.16 0.22 0.30",
		accent: "0.28 0.42 0.56",
		ink: "0.12 0.15 0.18",
		muted: "0.38 0.42 0.48",
		paper: "0.96 0.97 0.98",
		soft: "0.89 0.92 0.95"
	}
};
function ascii(value) {
	return value.replace(/[‘’]/g, "'").replace(/[“”]/g, "\"").replace(/[–—]/g, "-").replace(/…/g, "...").replace(/[^\x20-\x7E]/g, "").replace(/[\\()]/g, (ch) => `\\${ch}`);
}
function cells(line) {
	return line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}
function parsePdfDoc(source) {
	const blocks = [];
	let title = "Document";
	let theme = "navy";
	let kicker = "";
	let buf = [];
	const flush = () => {
		const text = buf.join(" ").replace(/\s+/g, " ").trim();
		buf = [];
		if (text) blocks.push({
			kind: "p",
			text
		});
	};
	const lines = source.replace(/\r/g, "").split("\n");
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i].trim();
		if (!line) {
			flush();
			continue;
		}
		const themeHit = line.match(/^@theme\s+(navy|gold|forest|ink|rose|slate)\s*$/i);
		if (themeHit) {
			flush();
			theme = themeHit[1].toLowerCase();
			continue;
		}
		const kickerHit = line.match(/^@kicker\s+(.{1,32})$/i);
		if (kickerHit) {
			flush();
			kicker = kickerHit[1].trim();
			continue;
		}
		if (line.startsWith("|") && line.includes("|", 1)) {
			flush();
			const rows = [];
			while (i < lines.length && lines[i].trim().startsWith("|")) {
				const row = cells(lines[i].trim());
				if (!row.every((cell) => /^:?-+:?$/.test(cell))) rows.push(row);
				i += 1;
			}
			i -= 1;
			if (rows.length) blocks.push({
				kind: "table",
				rows
			});
			continue;
		}
		if (line.startsWith("# ")) {
			flush();
			title = line.slice(2).trim();
			blocks.push({
				kind: "h1",
				text: title
			});
			continue;
		}
		if (line.startsWith("## ")) {
			flush();
			blocks.push({
				kind: "h2",
				text: line.slice(3).trim()
			});
			continue;
		}
		if (line.startsWith("- ") || line.startsWith("* ")) {
			flush();
			blocks.push({
				kind: "li",
				text: line.slice(2).trim()
			});
			continue;
		}
		if (line.startsWith("> ")) {
			flush();
			blocks.push({
				kind: "quote",
				text: line.slice(2).trim()
			});
			continue;
		}
		buf.push(line);
	}
	flush();
	if (!blocks.some((block) => block.kind === "h1")) blocks.unshift({
		kind: "h1",
		text: title
	});
	return {
		title,
		blocks,
		theme,
		kicker
	};
}
function wrap(text, width) {
	const words = ascii(text).split(/\s+/).filter(Boolean);
	const lines = [];
	let line = "";
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (next.length > width) {
			if (line) lines.push(line);
			line = word.slice(0, width);
		} else line = next;
	}
	if (line) lines.push(line);
	return lines.length ? lines : [""];
}
function paint$1(theme, blocks, kicker) {
	const pages = [];
	let cmds = [];
	let y = 730;
	let page = 0;
	const open = () => {
		page += 1;
		cmds = [
			`${theme.paper} rg`,
			"0 0 595 842 re f",
			`${theme.bar} rg`,
			"0 0 14 842 re f",
			`${theme.bar} rg`,
			"0 786 595 56 re f",
			"1 1 1 rg",
			`BT /F2 10 Tf 36 812 Td (${ascii(kicker || "MASH")}) Tj ET`,
			"0.75 0.78 0.84 rg",
			"BT /F1 9 Tf 470 812 Td (mash) Tj ET"
		];
		y = 750;
	};
	const close = () => {
		cmds.push(`${theme.muted} rg`, `BT /F1 9 Tf 36 32 Td (Page ${page}) Tj ET`);
		pages.push(cmds.join("\n"));
	};
	const need = (height) => {
		if (y - height < 58) {
			close();
			open();
		}
	};
	const write = (font, size, x, color, line) => {
		cmds.push(`${color} rg`, `BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${line}) Tj ET`);
	};
	open();
	for (const block of blocks) {
		if (block.kind === "h1") {
			const lines = wrap(block.text, 34);
			need(lines.length * 28 + 8);
			for (const line of lines) {
				write("F2", 22, 36, theme.ink, line);
				y -= 28;
			}
			cmds.push(`${theme.accent} rg`, `36 ${y + 10} 84 3 re f`);
			y -= 16;
			continue;
		}
		if (block.kind === "h2") {
			const lines = wrap(block.text, 52);
			need(lines.length * 18 + 10);
			y -= 6;
			for (const line of lines) {
				write("F2", 13, 36, theme.accent, line);
				y -= 18;
			}
			y -= 4;
			continue;
		}
		if (block.kind === "quote") {
			const lines = wrap(block.text, 70);
			need(lines.length * 15 + 8);
			cmds.push(`${theme.accent} rg`, `36 ${y - lines.length * 15 + 12} 3 ${lines.length * 15} re f`);
			for (const line of lines) {
				write("F1", 11, 48, theme.ink, line);
				y -= 15;
			}
			y -= 8;
			continue;
		}
		if (block.kind === "li") {
			const lines = wrap(block.text, 74);
			need(lines.length * 15 + 2);
			cmds.push(`${theme.accent} rg`, `38 ${y + 2} 5 5 re f`);
			lines.forEach((line, index) => {
				write("F1", 11, index === 0 ? 52 : 52, theme.ink, line);
				y -= 15;
			});
			continue;
		}
		if (block.kind === "table") {
			const cols = Math.max(...block.rows.map((row) => row.length), 1);
			const width = 520 / cols;
			const rowH = 18;
			for (let r = 0; r < block.rows.length; r += 1) {
				need(20);
				const bg = r === 0 ? theme.bar : r % 2 === 0 ? theme.soft : theme.paper;
				const color = r === 0 ? "1 1 1" : theme.ink;
				cmds.push(`${bg} rg`, `36 ${y - 4} 520 ${rowH} re f`);
				const row = block.rows[r];
				for (let c = 0; c < cols; c += 1) {
					const cell = wrap(row[c] ?? "", Math.max(8, Math.floor(width / 6)))[0];
					cmds.push(`${color} rg`, `BT /${r === 0 ? "F2" : "F1"} 9 Tf 1 0 0 1 ${40 + c * width} ${y} Tm (${cell}) Tj ET`);
				}
				y -= rowH;
			}
			y -= 10;
			continue;
		}
		const lines = wrap(block.text, 84);
		need(lines.length * 15 + 6);
		for (const line of lines) {
			write("F1", 11, 36, theme.ink, line);
			y -= 15;
		}
		y -= 8;
	}
	close();
	return pages;
}
function buildStyledPdf(source) {
	const { blocks, theme, kicker } = parsePdfDoc(source);
	const contents = paint$1(THEMES[theme] ?? THEMES.navy, blocks, kicker);
	const objects = [];
	const pageIds = [];
	let id = 3;
	const contentIds = [];
	for (const stream of contents) {
		contentIds.push(id);
		objects.push(`${id} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`);
		id += 1;
	}
	const font1 = id;
	objects.push(`${id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);
	id += 1;
	const font2 = id;
	objects.push(`${id} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);
	id += 1;
	for (let i = 0; i < contents.length; i += 1) {
		pageIds.push(id);
		objects.push(`${id} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentIds[i]} 0 R /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> >>\nendobj\n`);
		id += 1;
	}
	const kids = pageIds.map((page) => `${page} 0 R`).join(" ");
	const all = [...["1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n", `2 0 obj\n<< /Type /Pages /Count ${pageIds.length} /Kids [${kids}] >>\nendobj\n`], ...objects];
	let body = "%PDF-1.4\n";
	const offsets = [0];
	for (const obj of all) {
		offsets.push(body.length);
		body += obj;
	}
	const xref = body.length;
	let table = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
	for (let i = 1; i < offsets.length; i += 1) table += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
	body += `${table}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
	return new TextEncoder().encode(body);
}
function saveBlob(blob, name) {
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = name;
	link.click();
	URL.revokeObjectURL(url);
}
function downloadPdf(source, name = "mash.pdf") {
	saveBlob(new Blob([buildStyledPdf(source)], { type: "application/pdf" }), name);
}
function downloadDoc(source, name = "mash.doc") {
	const { blocks } = parsePdfDoc(source);
	const safe = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	const html = `<html><head><meta charset="utf-8"></head><body style="font-family:Calibri,sans-serif;color:#111">${blocks.map((block) => {
		if (block.kind === "table") return `<table>${block.rows.map((row, index) => `<tr>${row.map((cell) => `<${index === 0 ? "th" : "td"}>${safe(cell)}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</table>`;
		const text = safe(block.text);
		if (block.kind === "h1") return `<h1>${text}</h1>`;
		if (block.kind === "h2") return `<h2>${text}</h2>`;
		if (block.kind === "li") return `<li>${text}</li>`;
		if (block.kind === "quote") return `<blockquote>${text}</blockquote>`;
		return `<p>${text}</p>`;
	}).join("")}</body></html>`;
	saveBlob(new Blob([html], { type: "application/msword" }), name);
}
function blocksOf(source) {
	const parts = source.split("```");
	const blocks = [];
	parts.forEach((part, index) => {
		if (index % 2 === 0) {
			if (part.trim()) blocks.push({
				kind: "text",
				text: part
			});
			return;
		}
		const nl = part.indexOf("\n");
		const lang = (nl === -1 ? part : part.slice(0, nl)).trim();
		const code = nl === -1 ? "" : part.slice(nl + 1).replace(/\n$/, "");
		blocks.push({
			kind: "code",
			lang,
			code
		});
	});
	return blocks;
}
function renderTex(source, display) {
	try {
		return katex.renderToString(source.trim(), {
			displayMode: display,
			throwOnError: false,
			strict: "ignore",
			output: "html"
		});
	} catch {
		return "";
	}
}
function looksLikeMath(body) {
	if (/\\/.test(body)) return true;
	if (/[=^_]/.test(body)) return true;
	return /[a-z]/i.test(body) && body.length < 48 && /^[a-z0-9+\-*/().,\s]+$/i.test(body);
}
function inline(text) {
	return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\)|\\\([\s\S]+?\\\)|\$[^$\n]+?\$)/g).map((bit, i) => {
		if (bit.startsWith("**") && bit.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold",
			children: bit.slice(2, -2)
		}, i);
		if (bit.startsWith("`") && bit.endsWith("`")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-md bg-code px-1 py-0.5",
			children: bit.slice(1, -1)
		}, i);
		const wrapped = bit.match(/^\\\(([\s\S]+)\\\)$/);
		const dollar = bit.match(/^\$([^$\n]+)\$$/);
		const tex = wrapped?.[1] ?? (dollar && looksLikeMath(dollar[1]) ? dollar[1] : "");
		if (tex) {
			const html = renderTex(tex, false);
			if (html) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "math-inline",
				dangerouslySetInnerHTML: { __html: html }
			}, i);
		}
		const link = bit.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
		if (link) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: link[2],
			target: "_blank",
			rel: "noreferrer",
			className: "underline underline-offset-2",
			children: link[1]
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bit }, i);
	});
}
function Lines({ text }) {
	const lines = text.replace(/\n{3,}/g, "\n\n").split("\n");
	const out = [];
	let list = [];
	let ordered = false;
	const flush = (key) => {
		if (!list.length) return;
		const items = list;
		list = [];
		const Tag = ordered ? "ol" : "ul";
		out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
			className: ordered ? "list-decimal pl-5" : "list-disc pl-5",
			children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "my-0.5",
				children: inline(item)
			}, i))
		}, key));
	};
	lines.forEach((line, i) => {
		const bullet = line.match(/^\s*[-*]\s+(.*)/);
		const num = line.match(/^\s*\d+\.\s+(.*)/);
		if (bullet || num) {
			const nextOrdered = Boolean(num);
			if (list.length && nextOrdered !== ordered) flush(`pre-${i}`);
			ordered = nextOrdered;
			list.push((bullet ?? num)[1]);
			return;
		}
		flush(`l-${i}`);
		if (!line.trim()) {
			out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2" }, `s-${i}`));
			return;
		}
		if (line.startsWith("### ")) {
			out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 text-base font-semibold",
				children: inline(line.slice(4))
			}, i));
			return;
		}
		if (line.startsWith("## ")) {
			out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 text-lg font-semibold",
				children: inline(line.slice(3))
			}, i));
			return;
		}
		out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-pretty",
			children: inline(line)
		}, i));
	});
	flush("end");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: out });
}
function TextBlock({ text }) {
	const parts = text.split(/(\\\[[\s\S]+?\\\]|\$\$[\s\S]+?\$\$)/g);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1",
		children: parts.map((part, i) => {
			const display = part.match(/^\\\[([\s\S]+)\\\]$/) ?? part.match(/^\$\$([\s\S]+)\$\$$/);
			if (display) {
				const html = renderTex(display[1], true);
				if (!html) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: part }, i);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "math-display",
					dangerouslySetInnerHTML: { __html: html }
				}, i);
			}
			if (!part.trim()) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lines, { text: part }, i);
		})
	});
}
function previewDoc(lang, code) {
	const kind = lang.trim().toLowerCase();
	const body = code.replace(/\n$/, "").trim();
	if (body.length < 40) return null;
	if (!(/html|svg/.test(kind) || /<!doctype|<html[\s>]|<svg[\s>]/i.test(body))) return null;
	if (/<!doctype|<html[\s>]|<svg[\s>]/i.test(body)) return body;
	return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${body}</body></html>`;
}
var useProduct = create(() => ({ html: null }));
function openProduct(html) {
	useProduct.setState({ html });
}
function pdfAsHtml(source) {
	const doc = parsePdfDoc(source);
	const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Georgia,serif;margin:0;background:#fff;color:#161616;padding:32px}h1{font-size:28px;color:#2457d6;margin:0 0 12px}h2{font-size:18px;margin:22px 0 6px}p{line-height:1.5;margin:0 0 10px}</style></head><body>${doc.blocks.map((block) => {
		if (block.kind === "table") return `<table>${block.rows.map((row, index) => `<tr>${row.map((cell) => `<${index === 0 ? "th" : "td"}>${esc(cell)}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`).join("")}</table>`;
		return block.kind === "h1" ? `<h1>${esc(block.text)}</h1>` : block.kind === "h2" ? `<h2>${esc(block.text)}</h2>` : block.kind === "li" ? `<li>${esc(block.text)}</li>` : block.kind === "quote" ? `<blockquote>${esc(block.text)}</blockquote>` : `<p>${esc(block.text)}</p>`;
	}).join("")}</body></html>`;
}
function ProductPage() {
	const html = useProduct((s) => s.html);
	if (!html) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "safe-top flex items-center gap-2 border-b border-line px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-muted",
				onClick: () => useProduct.setState({ html: null }),
				children: "Back"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-base font-semibold",
				children: "Preview"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			title: "Product preview",
			sandbox: "allow-scripts",
			srcDoc: html,
			className: "min-h-0 w-full flex-1 bg-white"
		})]
	});
}
function Fence({ lang, code }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const previewOn = useMash((s) => s.plugins.preview);
	const pdf = /^pdf\b/i.test(lang.trim());
	const doc = pdf ? null : previewDoc(lang, code);
	const fileName = `${(parsePdfDoc(code).title || "mash").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mash"}.pdf`;
	const product = doc || (pdf ? pdfAsHtml(code) : null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "my-2 overflow-hidden rounded-xl bg-code",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "max-h-72 overflow-auto px-3 py-3 text-sm leading-relaxed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-end gap-4 border-t border-line px-3 py-2 text-sm",
			children: [
				pdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-fg",
					onClick: () => downloadPdf(code, fileName),
					children: "Download PDF"
				}) : null,
				pdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-fg",
					onClick: () => downloadDoc(code, fileName.replace(/\.pdf$/, ".doc")),
					children: "Download DOC"
				}) : null,
				product && previewOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-fg",
					onClick: () => openProduct(product),
					children: "Preview"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-fg",
					onClick: () => {
						navigator.clipboard.writeText(code);
						setCopied(true);
						window.setTimeout(() => setCopied(false), 1200);
					},
					children: copied ? "Copied" : "Copy"
				})
			]
		})]
	});
}
var freshIds = /* @__PURE__ */ new Set();
function markFresh(id) {
	freshIds.add(id);
}
function paintLines(host, shown) {
	const lines = shown.split("\n");
	while (host.childElementCount < lines.length) {
		const line = document.createElement("p");
		line.className = "stream-fall min-h-[1.25em]";
		host.appendChild(line);
	}
	while (host.childElementCount > lines.length) host.lastElementChild?.remove();
	lines.forEach((line, index) => {
		const el = host.children[index];
		if (el.textContent !== line) el.textContent = line;
	});
	const scroller = host.closest(".overflow-y-auto");
	if (scroller instanceof HTMLElement) scroller.scrollTop = scroller.scrollHeight;
}
function LiveAnswer({ id, text, live }) {
	const reduce = (0, import_react.useRef)(false);
	if (typeof window !== "undefined" && !reduce.current) reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const math = /\\\[|\\\(|\$\$/.test(text);
	const animate = !reduce.current && !math && (live || freshIds.has(id));
	const [settled, setSettled] = (0, import_react.useState)(!animate);
	const host = (0, import_react.useRef)(null);
	const goal = (0, import_react.useRef)(text);
	const liveRef = (0, import_react.useRef)(live);
	goal.current = text;
	liveRef.current = live;
	(0, import_react.useEffect)(() => {
		if (!animate) {
			freshIds.delete(id);
			setSettled(true);
			return;
		}
		let frame = 0;
		let shown = 0;
		const tick = () => {
			const full = goal.current;
			const behind = full.length - shown;
			if (behind > 0 && host.current) {
				const add = behind > 700 ? 10 : behind > 180 ? 4 : 2;
				shown = Math.min(full.length, shown + add);
				paintLines(host.current, full.slice(0, shown));
			}
			if (shown < goal.current.length || liveRef.current) {
				frame = requestAnimationFrame(tick);
				return;
			}
			freshIds.delete(id);
			setSettled(true);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [animate, id]);
	if (settled) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rich, { text });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: host,
		className: "space-y-1 text-base leading-relaxed whitespace-pre-wrap"
	});
}
function Rich({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2 text-base leading-relaxed",
		children: blocksOf(text).map((block, i) => block.kind === "code" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fence, {
			lang: block.lang,
			code: block.code
		}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextBlock, { text: block.text }, i))
	});
}
function tokenize(source) {
	const out = [];
	let i = 0;
	while (i < source.length) {
		const ch = source[i];
		if (ch === " " || ch === "	") {
			i += 1;
			continue;
		}
		if (ch === ",") {
			out.push({ t: "comma" });
			i += 1;
			continue;
		}
		if (ch === "(") {
			out.push({ t: "lp" });
			i += 1;
			continue;
		}
		if (ch === ")") {
			out.push({ t: "rp" });
			i += 1;
			continue;
		}
		if ("+-*/^".includes(ch)) {
			out.push({
				t: "op",
				v: ch
			});
			i += 1;
			continue;
		}
		if (/[0-9.]/.test(ch)) {
			let j = i + 1;
			while (j < source.length && /[0-9.]/.test(source[j])) j += 1;
			const v = Number(source.slice(i, j));
			if (!Number.isFinite(v)) throw new Error("bad number");
			out.push({
				t: "n",
				v
			});
			i = j;
			continue;
		}
		if (/[a-z]/i.test(ch)) {
			let j = i + 1;
			while (j < source.length && /[a-z]/i.test(source[j])) j += 1;
			out.push({
				t: "id",
				v: source.slice(i, j).toLowerCase()
			});
			i = j;
			continue;
		}
		throw new Error("bad");
	}
	return out;
}
function evaluate(source) {
	const tokens = tokenize(source);
	let i = 0;
	const peek = () => tokens[i];
	const eat = () => tokens[i++];
	function expr() {
		return add();
	}
	function add() {
		let v = mul();
		while (peek()?.t === "op" && peek().v === "+" || peek()?.t === "op" && peek().v === "-") {
			const op = eat().v;
			const r = mul();
			v = op === "+" ? v + r : v - r;
		}
		return v;
	}
	function mul() {
		let v = pow();
		while (peek()?.t === "op" && (peek().v === "*" || peek().v === "/")) {
			const op = eat().v;
			const r = pow();
			v = op === "*" ? v * r : v / r;
		}
		return v;
	}
	function pow() {
		const v = unary();
		if (peek()?.t === "op" && peek().v === "^") {
			eat();
			return v ** pow();
		}
		return v;
	}
	function unary() {
		if (peek()?.t === "op" && (peek().v === "-" || peek().v === "+")) {
			const op = eat().v;
			const v = unary();
			return op === "-" ? -v : v;
		}
		return primary();
	}
	function primary() {
		const tok = eat();
		if (!tok) throw new Error("end");
		if (tok.t === "n") return tok.v;
		if (tok.t === "id") {
			if (eat()?.t !== "lp") throw new Error("call");
			const args = [expr()];
			if (peek()?.t === "comma") {
				eat();
				args.push(expr());
			}
			if (eat()?.t !== "rp") throw new Error(")");
			return call(tok.v, args);
		}
		if (tok.t === "lp") {
			const v = expr();
			if (eat()?.t !== "rp") throw new Error(")");
			return v;
		}
		throw new Error("primary");
	}
	const value = expr();
	if (i !== tokens.length) throw new Error("tail");
	return value;
}
function call(name, args) {
	const [a, b] = args;
	const deg = (n) => n * Math.PI / 180;
	if (name === "sqrt" && args.length === 1) return Math.sqrt(a);
	if (name === "abs" && args.length === 1) return Math.abs(a);
	if (name === "sin" && args.length === 1) return Math.sin(deg(a));
	if (name === "cos" && args.length === 1) return Math.cos(deg(a));
	if (name === "tan" && args.length === 1) return Math.tan(deg(a));
	if (name === "log" && args.length === 1) return Math.log10(a);
	if (name === "ln" && args.length === 1) return Math.log(a);
	if (name === "fact" && args.length === 1) return factorial(a);
	if ((name === "ncr" || name === "npr") && args.length === 2) return name === "ncr" ? ncr(a, b) : npr(a, b);
	throw new Error("fn");
}
function factorial(n) {
	if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error("fact");
	let v = 1;
	for (let i = 2; i <= n; i += 1) v *= i;
	return v;
}
function ncr(n, k) {
	if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) throw new Error("ncr");
	return npr(n, k) / factorial(k);
}
function npr(n, k) {
	if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) throw new Error("npr");
	let v = 1;
	for (let i = 0; i < k; i += 1) v *= n - i;
	return v;
}
function format(n) {
	if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
	return String(Number(n.toPrecision(8)));
}
function calcAnswer(input) {
	let source = input.trim();
	if (!source || source.length > 180) return null;
	if (!/\d/.test(source)) return null;
	source = source.replace(/^(what is|what's|whats|calculate|compute|solve|find)\s+/i, "");
	source = source.replace(/[?!.]+$/g, "").trim();
	const shown = source;
	source = source.replace(/(\d+(?:\.\d+)?)\s*%\s*of\s+(\d+(?:\.\d+)?)/gi, "($1/100)*($2)");
	source = source.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
	if (!/[+\-*/^]|\b(sqrt|sin|cos|tan|log|ln|abs|fact|ncr|npr)\b/i.test(source)) return null;
	if (!/^[\d\s+\-*/^().,a-z]+$/i.test(source)) return null;
	try {
		const value = evaluate(source);
		if (!Number.isFinite(value)) return null;
		return `${shown} = ${format(value)}`;
	} catch {
		return null;
	}
}
function numberAfter(text, label) {
	const hit = text.match(label);
	if (!hit) return null;
	const n = Number(hit[1]);
	return Number.isFinite(n) ? n : null;
}
function quantAnswer(input) {
	if (!/\b(expectancy|expected value|kelly|win rate|payoff)\b/i.test(input)) return null;
	const rate = numberAfter(input, /(?:win\s*rate|probability|prob|p)\s*[:=]?\s*(\d+(?:\.\d+)?)\s*%?/i);
	const win = numberAfter(input, /(?:win|reward|profit|payoff)\s*[:=]?\s*(\d+(?:\.\d+)?)/i);
	const loss = numberAfter(input, /(?:loss|risk|lose)\s*[:=]?\s*(\d+(?:\.\d+)?)/i);
	if (rate == null || win == null || loss == null || loss === 0) return null;
	const p = rate > 1 ? rate / 100 : rate;
	if (p <= 0 || p >= 1) return null;
	const ev = p * win - (1 - p) * loss;
	const b = win / loss;
	const kelly = Math.max(0, (p * b - (1 - p)) / b);
	const edge = ev > 0 ? "This has a positive edge if those numbers hold." : "This has a negative edge. Skip it.";
	return [
		`Expectancy is ${format(ev)} per trade.`,
		`Win rate ${format(p * 100)}%, win ${format(win)}, loss ${format(loss)}.`,
		edge,
		`Full Kelly would risk ${format(kelly * 100)}% of the bank. Use a quarter of that, and only if the win rate is measured, not guessed.`
	].join(" ");
}
function answerNow(input) {
	return quantAnswer(input) ?? calcAnswer(input);
}
var useLive = create(() => ({
	id: null,
	text: ""
}));
var paint = 0;
var paintText = "";
var paintId = null;
function paintLive(id, text) {
	paintId = id;
	paintText = text;
	if (typeof requestAnimationFrame !== "function") {
		useLive.setState({
			id,
			text
		});
		return;
	}
	if (paint) return;
	paint = requestAnimationFrame(() => {
		paint = 0;
		if (paintId) useLive.setState({
			id: paintId,
			text: paintText
		});
	});
}
function clearLive() {
	if (paint) cancelAnimationFrame(paint);
	paint = 0;
	paintId = null;
	paintText = "";
	useLive.setState({
		id: null,
		text: ""
	});
}
var useVoiceUi = create(() => ({
	open: false,
	phase: "listen",
	line: ""
}));
function openVoiceAssistant() {
	if (!useMash.getState().plugins.voice) {
		useMash.getState().setNotice("Voice is off. Turn it on in Plugins.");
		return;
	}
	useMash.getState().setVoiceOn(true);
	useVoiceUi.setState({
		open: true,
		phase: "listen",
		line: ""
	});
}
var burst = [];
var abort = null;
var speaking = null;
var callAudio = null;
var turn = 0;
var watching = /* @__PURE__ */ new Set();
var dropped = /* @__PURE__ */ new Set();
function primeCallAudio() {
	const audio = callAudio ?? new Audio();
	callAudio = audio;
	audio.setAttribute("playsinline", "true");
	audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
	audio.play().catch(() => void 0);
}
function closeVoice() {
	speaking?.pause();
	speaking = null;
	window.speechSynthesis?.cancel();
	useVoiceUi.setState({
		open: false,
		phase: "listen",
		line: ""
	});
	useMash.getState().setVoiceOn(false);
}
function tooSoon() {
	const now = Date.now();
	while (burst.length && now - burst[0] > 9e4) burst.shift();
	burst.push(now);
	return burst.length > 8;
}
function asksForEdit(text) {
	return /\b(edit|recolor|recolour|brighter|darker|crop|remove the|change the|make the|turn the|replace the)\b/i.test(text);
}
function asksForImage(text) {
	if (/\?\s*$/.test(text) && !/\b(draw|sketch|paint|logo|poster|wallpaper|tasveer)\b/i.test(text)) return false;
	return /\b(draw|sketch|paint|illustrat\w*|picture|photo|image|logo|poster|wallpaper|icon|render|tasveer)\b/i.test(text);
}
function compactPhotos(urls) {
	return Promise.all(urls.slice(0, 20).map(compactPhoto));
}
function compactPhoto(url) {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, 420 / Math.max(img.width, img.height));
			const canvas = document.createElement("canvas");
			canvas.width = Math.max(1, Math.round(img.width * scale));
			canvas.height = Math.max(1, Math.round(img.height * scale));
			canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
			resolve(canvas.toDataURL("image/jpeg", .42));
		};
		img.onerror = () => resolve(url.slice(0, 8e4));
		img.src = url;
	});
}
function titleFrom(text) {
	const clean = text.replace(/\s+/g, " ").trim();
	if (!clean) return "New chat";
	return clean.length > 32 ? `${clean.slice(0, 32)}…` : clean;
}
function stopMash() {
	turn += 1;
	abort?.abort();
	abort = null;
	speaking?.pause();
	speaking = null;
	useVoiceUi.setState({
		open: false,
		phase: "listen",
		line: ""
	});
	useMash.getState().setVoiceOn(false);
	useMash.getState().setSending(false);
}
async function playSpeech(text) {
	if (!useMash.getState().plugins.voice) {
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
		if (!await browserSpeak(line) && useVoiceUi.getState().open) await playAi(line);
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
	if (!await audio.play().then(() => true).catch(() => false)) {
		if (stage) await browserSpeak(spoken);
		else useMash.getState().setNotice("Couldn’t play audio.");
		if (stage && useVoiceUi.getState().open) useVoiceUi.setState({ phase: "listen" });
		window.dispatchEvent(new Event("mash-voice"));
		return;
	}
	await new Promise((resolve) => {
		audio.onended = () => resolve();
		audio.onpause = () => resolve();
		audio.onerror = () => resolve();
	});
	if (stage && useVoiceUi.getState().open) useVoiceUi.setState({ phase: "listen" });
	window.dispatchEvent(new Event("mash-voice"));
}
function playAi(text) {
	return speakText({ data: { text: text.slice(0, 280) } }).then(async (result) => {
		if (!result.ok) return false;
		const audio = callAudio ?? new Audio();
		callAudio = audio;
		speaking = audio;
		audio.setAttribute("playsinline", "true");
		audio.src = `data:${result.mime};base64,${result.audio}`;
		if (!await audio.play().then(() => true).catch(() => false)) return false;
		await new Promise((resolve) => {
			audio.onended = () => resolve();
			audio.onpause = () => resolve();
			audio.onerror = () => resolve();
		});
		return true;
	});
}
function resumeJobs() {
	for (const chat of useMash.getState().chats) for (const message of chat.messages) if (message.role === "assistant" && message.jobId) followJob(chat.id, message.id, message.jobId, false);
}
async function followJob(chatId, msgId, jobId, voice) {
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
				const data = await res.json();
				const text = data.text ?? "";
				if (text) {
					paintLive(msgId, text);
					if (i % 8 === 0) keepPartial(chatId, msgId, text, jobId);
					if (voice && !voiced && text.trim().length >= 4) {
						voiced = true;
						playSpeech(text.trim().slice(0, 160));
					}
				}
				if (data.done) {
					const finalText = text.trim() || data.error || "mash didn’t answer.";
					commit(chatId, msgId, finalText);
					if (voice && !voiced && useVoiceUi.getState().open) playSpeech(finalText);
					return;
				}
			} catch {
				await wait(400);
			}
			await wait(voice ? 70 : 120);
		}
	} finally {
		watching.delete(jobId);
		if (!dropped.has(jobId) && useMash.getState().chats.find((c) => c.id === chatId)?.messages.find((m) => m.id === msgId)?.jobId === jobId) {
			setTimeout(() => void followJob(chatId, msgId, jobId, voice), 200);
			return;
		}
		if (useLive.getState().id === msgId) clearLive();
		if (!watching.size) useMash.getState().setSending(false);
		if (useVoiceUi.getState().open && useVoiceUi.getState().phase === "think") useVoiceUi.setState({ phase: "listen" });
	}
}
function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function keepPartial(chatId, msgId, content, jobId) {
	useMash.getState().patchChat(chatId, (c) => ({
		...c,
		messages: c.messages.map((m) => m.id === msgId ? {
			...m,
			content,
			jobId
		} : m)
	}));
}
function browserSpeak(text) {
	const synth = window.speechSynthesis;
	if (!synth) return Promise.resolve(false);
	synth.getVoices();
	return new Promise((resolve) => {
		const utter = new SpeechSynthesisUtterance(text.slice(0, 180));
		const female = synth.getVoices().find((voice) => /female|samantha|victoria|karen|moira|zira|sara|susan|fiona/i.test(voice.name));
		if (female) utter.voice = female;
		utter.pitch = 1.15;
		utter.rate = 1.2;
		let started = false;
		let done = false;
		const end = (ok) => {
			if (done) return;
			done = true;
			window.clearTimeout(cap);
			resolve(ok);
		};
		const cap = window.setTimeout(() => end(started), 8e3);
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
async function submitDraft(opts) {
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
	const text = (opts?.text ?? state.draft).trim() || (files.length ? "Take a look at this." : "");
	if (!text) return;
	if (files.length && !state.plugins.files) {
		state.setNotice("Files are off. Turn them on in Plugins.");
		return;
	}
	let mode = state.mode;
	const picture = asksForImage(text) && !files.some((item) => item.dataUrl);
	if (mode === "imagine" && !picture) mode = "chat";
	else if ((mode === "chat" || mode === "imagine") && picture) mode = "imagine";
	if (mode === "chat" && /\b(pdf|docx?|document)\b/i.test(text)) mode = "document";
	if (mode === "imagine" && !state.plugins.imagine) {
		state.setNotice("Imagine is off. Turn it on in Plugins.");
		return;
	}
	if (tooSoon()) {
		const until = Date.now() + 7e3;
		state.setPauseUntil(until);
		state.setNotice("Short pause after heavy use.");
		return;
	}
	const mine = ++turn;
	const onVoice = Boolean(opts?.fromVoice && useVoiceUi.getState().open);
	if (onVoice) useVoiceUi.setState({
		open: true,
		phase: "think"
	});
	const shown = text;
	const userMsg = {
		id: crypto.randomUUID(),
		role: "user",
		content: shown,
		images: files.map((item) => item.dataUrl).filter((url) => Boolean(url)).slice(0, 20)
	};
	const assistant = {
		id: crypto.randomUUID(),
		role: "assistant",
		content: ""
	};
	markFresh(assistant.id);
	useLive.setState({
		id: assistant.id,
		text: ""
	});
	const now = Date.now();
	let chatId = state.activeId;
	const existing = state.chats.find((c) => c.id === chatId);
	if (!existing) {
		chatId = crypto.randomUUID();
		useMash.setState({
			activeId: chatId,
			chats: [{
				id: chatId,
				title: titleFrom(text),
				messages: [userMsg, assistant],
				updated: now
			}, ...useMash.getState().chats].slice(0, 40),
			draft: "",
			pendingFiles: [],
			sending: true,
			...opts?.stay || onVoice ? {} : {
				screen: "main",
				sidebar: false
			}
		});
	} else {
		useMash.getState().patchChat(existing.id, (c) => ({
			...c,
			title: c.messages.length ? c.title : titleFrom(text),
			messages: [
				...c.messages,
				userMsg,
				assistant
			],
			updated: now
		}));
		useMash.setState({
			draft: "",
			pendingFiles: [],
			sending: true,
			...opts?.stay || onVoice ? {} : { screen: "main" }
		});
	}
	const id = chatId;
	let handed = false;
	try {
		const solved = mode === "chat" && !files.length ? answerNow(text) : null;
		if (solved) {
			commit(id, assistant.id, solved);
			if (onVoice) playSpeech(solved);
			return;
		}
		const photo = files.find((item) => item.dataUrl)?.dataUrl;
		if (photo && mode !== "document" && mode !== "code" && mode !== "build" && (mode === "imagine" || asksForEdit(text))) {
			const result = await editImage({ data: {
				prompt: text || "Improve this photo",
				image: photo
			} });
			const content = result.ok ? "Here’s the edit." : result.error;
			useMash.getState().patchChat(id, (c) => ({
				...c,
				updated: Date.now(),
				messages: c.messages.map((m) => m.id === assistant.id ? {
					...m,
					content,
					imageUrl: result.ok ? result.url : void 0
				} : m)
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
				messages: c.messages.map((m) => m.id === assistant.id ? {
					...m,
					content,
					imageUrl: result.ok ? result.url : void 0
				} : m)
			}));
			clearLive();
			return;
		}
		const rows = useMash.getState().chats.find((c) => c.id === id)?.messages.filter((m) => m.id !== assistant.id).slice(-10) ?? [];
		const note = files.find((item) => item.text)?.text;
		const history = [];
		for (let index = 0; index < rows.length; index += 1) {
			const m = rows[index];
			const last = index === rows.length - 1;
			const pics = last ? m.images ?? [] : [];
			const content = last && note ? `${m.content}\n\n${note.slice(0, 8e3)}` : pics.length ? `${m.content}\n\n${pics.length} photos are attached. Read every photo.` : m.content;
			history.push({
				role: m.role,
				content,
				images: pics.length ? await compactPhotos(pics) : void 0
			});
		}
		const jobId = crypto.randomUUID();
		useMash.getState().patchChat(id, (c) => ({
			...c,
			messages: c.messages.map((m) => m.id === assistant.id ? {
				...m,
				jobId
			} : m)
		}));
		handed = true;
		followJob(id, assistant.id, jobId, onVoice);
		abort = new AbortController();
		const res = await fetch("/api/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: jobId,
				mode,
				voice: Boolean(opts?.fromVoice),
				messages: history
			}),
			signal: abort.signal
		});
		if (!res.ok) {
			dropped.add(jobId);
			let error = "mash didn’t answer.";
			try {
				const json = await res.json();
				if (json.error) error = json.error;
			} catch {}
			commit(id, assistant.id, error);
			handed = false;
			if (res.status === 429) useMash.getState().setPauseUntil(Date.now() + 8e3);
			return;
		}
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
		if (useMash.getState().chats.find((c) => c.id === id)?.messages.find((m) => m.id === assistant.id)?.jobId) {
			handed = true;
			return;
		}
		commit(id, assistant.id, "Could not reach mash. Try again.");
	} finally {
		abort = null;
		if (!handed && mine === turn) {
			useMash.getState().setSending(false);
			if (useVoiceUi.getState().open && useVoiceUi.getState().phase === "think") useVoiceUi.setState({ phase: "listen" });
			if (opts?.fromVoice && useMash.getState().voiceOn && !useVoiceUi.getState().open) window.dispatchEvent(new Event("mash-listen"));
		}
		if (!handed && useLive.getState().id === assistant.id) clearLive();
	}
}
function commit(chatId, msgId, content) {
	useMash.getState().patchChat(chatId, (c) => ({
		...c,
		updated: Date.now(),
		messages: c.messages.map((m) => m.id === msgId ? {
			...m,
			content,
			jobId: void 0
		} : m)
	}));
}
var TOOLS = [
	{
		id: "gmail",
		mark: "M",
		tint: "#ea4335",
		name: "Gmail",
		copy: "Draft and rewrite email in chat"
	},
	{
		id: "drive",
		mark: "D",
		tint: "#1a73e8",
		name: "Google Drive",
		copy: "Turn notes into a doc outline"
	},
	{
		id: "desktop",
		mark: "DC",
		tint: "#202124",
		name: "Remote Desktop Commander",
		copy: "Write commands you can run"
	},
	{
		id: "github",
		mark: "GH",
		tint: "#24292f",
		name: "GitHub",
		copy: "Draft issues, PRs, and commits"
	},
	{
		id: "outlook",
		mark: "O",
		tint: "#0f6cbd",
		name: "Outlook Email",
		copy: "Draft an Outlook-style email"
	}
];
var STARTERS = {
	gmail: "Draft an email. Ask me who it is for and what it should say.",
	drive: "Turn the notes I paste into a clean document outline.",
	desktop: "Help me automate a task. Ask what I want done, then write the commands.",
	github: "Draft a GitHub issue from the bug I describe.",
	outlook: "Draft an Outlook email. Ask me the recipient and the point."
};
function MenuMark$1() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "17",
		height: "11",
		viewBox: "0 0 22 14",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M1 1.5h13",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M1 12.5h20",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round"
		})]
	});
}
function Head({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "safe-top flex items-center gap-1 px-2 pb-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Open menu",
				className: "grid size-10 shrink-0 place-items-center",
				onClick: () => useMash.getState().setSidebar(true),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuMark$1, {})
			}),
			title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "min-w-0 flex-1 truncate text-[1.65rem] font-semibold tracking-tight",
				children: title
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex-1" }),
			children
		]
	});
}
function listen(apply) {
	const w = window;
	const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
	if (!Ctor) {
		useMash.getState().setNotice("This browser has no speech recognition.");
		return;
	}
	const rec = new Ctor();
	rec.lang = "en-US";
	rec.onresult = (event) => {
		const said = event.results[0]?.[0]?.transcript?.trim() ?? "";
		if (said) apply(said);
	};
	try {
		rec.start();
	} catch {
		useMash.getState().setNotice("Mic didn’t start.");
	}
}
function nextAt(days, hour) {
	const when = /* @__PURE__ */ new Date();
	when.setDate(when.getDate() + days);
	when.setHours(hour, 0, 0, 0);
	if (when.getTime() <= Date.now()) when.setDate(when.getDate() + 1);
	return when.getTime();
}
function MenuScreens() {
	const screen = useMash((s) => s.screen);
	if (screen === "images") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagesScreen, {});
	if (screen === "library") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryScreen, {});
	if (screen === "scheduled") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduledScreen, {});
	if (screen === "plugins") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PluginsScreen, {});
	if (screen === "projects") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectsScreen, {});
	if (screen === "code") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeScreen, {});
	return null;
}
var PICKS = [
	[
		"sketch",
		"Sketch",
		"#f4f4f4",
		"#111111",
		"#f0b429"
	],
	[
		"stickers",
		"Stickers",
		"#fff7e8",
		"#111111",
		"#f76707"
	],
	[
		"portrait",
		"Portrait",
		"#c4a48a",
		"#2c241c",
		"#e8d5c4"
	],
	[
		"city",
		"Night city",
		"#0b1020",
		"#7ec8e3",
		"#f4a3b5"
	],
	[
		"ocean",
		"Ocean",
		"#083344",
		"#67e8f9",
		"#f8fafc"
	],
	[
		"food",
		"Food",
		"#fff1e6",
		"#e8590c",
		"#2f9e44"
	],
	[
		"cat",
		"Cat",
		"#fff4d6",
		"#111111",
		"#ffe14a"
	],
	[
		"plant",
		"Plant",
		"#e7f5e7",
		"#2f9e44",
		"#f4f4f4"
	],
	[
		"logo",
		"Logo",
		"#111111",
		"#e8ff47",
		"#ffffff"
	],
	[
		"poster",
		"Poster",
		"#1a1a1a",
		"#ff4d6d",
		"#ffffff"
	],
	[
		"watch",
		"Product",
		"#ececec",
		"#111111",
		"#c0c0c0"
	],
	[
		"flower",
		"Floral",
		"#fff0f6",
		"#e64980",
		"#2f9e44"
	],
	[
		"car",
		"Car",
		"#e7f5ff",
		"#1c7ed6",
		"#111111"
	],
	[
		"abstract",
		"Abstract",
		"#f3f0ff",
		"#7048e8",
		"#ff922b"
	],
	[
		"icon",
		"App icon",
		"#edf2ff",
		"#2457d6",
		"#ffffff"
	],
	[
		"wall",
		"Wallpaper",
		"#0b1020",
		"#1d3b2a",
		"#f8fafc"
	]
];
function GalleryArt({ id, className }) {
	const [, , bg, ink, accent] = PICKS.find((item) => item[0] === id) ?? PICKS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 160 160",
		className: className ?? "aspect-square w-full rounded-[1.3rem]",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "160",
			height: "160",
			fill: bg
		}), id === "sketch" || id === "flower" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "80",
				cy: "78",
				r: "18",
				fill: accent
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "80",
				cy: "48",
				r: "16",
				fill: "none",
				stroke: ink,
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "110",
				cy: "68",
				r: "16",
				fill: "none",
				stroke: ink,
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "102",
				r: "16",
				fill: "none",
				stroke: ink,
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "60",
				cy: "102",
				r: "16",
				fill: "none",
				stroke: ink,
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "68",
				r: "16",
				fill: "none",
				stroke: ink,
				strokeWidth: "3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M80 96v40",
				stroke: "#2f9e44",
				strokeWidth: "4"
			})
		] }) : id === "stickers" || id === "cat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "58",
				cy: "62",
				r: "28",
				fill: accent
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "108",
				cy: "58",
				r: "22",
				fill: "#2f9e44"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "48",
				y: "96",
				width: "64",
				height: "40",
				rx: "16",
				fill: "#f76707"
			})
		] }) : id === "portrait" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "80",
			cy: "62",
			r: "28",
			fill: accent
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M36 150c8-36 28-52 44-52s36 16 44 52",
			fill: ink
		})] }) : id === "city" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "18",
				y: "70",
				width: "28",
				height: "90",
				fill: ink
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "54",
				y: "40",
				width: "34",
				height: "120",
				fill: "#16325c"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "98",
				y: "78",
				width: "40",
				height: "82",
				fill: ink
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "124",
				cy: "36",
				r: "10",
				fill: accent
			})
		] }) : id === "ocean" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 90h160v70H0z",
				fill: bg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M0 100c20-16 30 10 50 0s30-16 50 0 30 16 60 0v60H0z",
				fill: ink
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "120",
				cy: "42",
				r: "14",
				fill: accent
			})
		] }) : id === "food" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "80",
				cy: "96",
				rx: "48",
				ry: "22",
				fill: ink
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "62",
				cy: "78",
				r: "14",
				fill: accent
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "96",
				cy: "74",
				r: "16",
				fill: "#2f9e44"
			})
		] }) : id === "plant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "62",
				y: "96",
				width: "36",
				height: "34",
				rx: "6",
				fill: ink
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "80",
				cy: "78",
				rx: "18",
				ry: "28",
				fill: accent
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "58",
				cy: "86",
				rx: "16",
				ry: "22",
				fill: "#1b6b32"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
				cx: "104",
				cy: "86",
				rx: "16",
				ry: "22",
				fill: "#1b6b32"
			})
		] }) : id === "logo" || id === "icon" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "80",
			y: "98",
			textAnchor: "middle",
			fontSize: "64",
			fontFamily: "sans-serif",
			fontWeight: "700",
			fill: id === "logo" ? accent : ink,
			children: "M"
		}) : id === "poster" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "28",
			y: "24",
			width: "104",
			height: "112",
			fill: ink
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "80",
			y: "90",
			textAnchor: "middle",
			fontSize: "28",
			fontFamily: "sans-serif",
			fontWeight: "700",
			fill: accent,
			children: "LIVE"
		})] }) : id === "watch" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "70",
			y: "28",
			width: "20",
			height: "18",
			rx: "4",
			fill: ink
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "80",
			cy: "92",
			r: "36",
			fill: accent,
			stroke: ink,
			strokeWidth: "8"
		})] }) : id === "car" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M24 100h112l-12-28H48z",
				fill: ink
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "52",
				cy: "112",
				r: "12",
				fill: accent
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "112",
				cy: "112",
				r: "12",
				fill: accent
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "58",
			cy: "70",
			r: "34",
			fill: ink
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "108",
			cy: "96",
			r: "28",
			fill: accent
		})] })]
	});
}
function ImagesScreen() {
	const chats = useMash((s) => s.chats);
	const sending = useMash((s) => s.sending);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [chip, setChip] = (0, import_react.useState)(true);
	const [tab, setTab] = (0, import_react.useState)("trending");
	const shots = (0, import_react.useMemo)(() => chats.flatMap((chat) => (chat.messages ?? []).flatMap((message) => {
		const rows = [];
		if (message.imageUrl) rows.push({
			id: message.id,
			url: message.imageUrl,
			chatId: chat.id
		});
		return rows;
	})), [chats]);
	const [pick, setPick] = (0, import_react.useState)(null);
	const shown = tab === "trending" ? PICKS.slice(0, 8) : PICKS.slice(8);
	function go(text) {
		const line = text.trim();
		if (!line || sending) return;
		useMash.getState().setMode(chip ? "imagine" : "chat");
		submitDraft({
			text: line,
			stay: chip
		});
		setPrompt("");
	}
	function take(id, label) {
		const chatId = crypto.randomUUID();
		useMash.setState((s) => ({
			activeId: chatId,
			screen: "main",
			sidebar: false,
			chats: [{
				id: chatId,
				title: label,
				updated: Date.now(),
				messages: [{
					id: crypto.randomUUID(),
					role: "assistant",
					content: label,
					imageUrl: `gallery:${id}`
				}]
			}, ...s.chats].slice(0, 40)
		}));
	}
	const chosen = PICKS.find((item) => item[0] === pick);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { title: "Images" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[1.6rem] bg-track px-4 pt-4 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: prompt,
							rows: 2,
							placeholder: "Describe a new image",
							className: "w-full resize-none bg-transparent text-base outline-none placeholder:text-muted",
							onChange: (e) => setPrompt(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-10 place-items-center rounded-full bg-chip text-lg",
									children: "+"
								}),
								chip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex items-center gap-1.5 rounded-full bg-accent px-3 py-2 text-sm font-medium text-on-accent",
									onClick: () => setChip(false),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: "▣"
										}),
										"Image",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "rounded-full bg-chip px-3 py-2 text-sm",
									onClick: () => setChip(true),
									children: "Image"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Voice",
									className: "ml-auto grid size-10 place-items-center rounded-full bg-chip",
									onClick: () => listen(setPrompt),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": "Create image",
									disabled: !prompt.trim() || sending,
									className: "grid size-10 place-items-center rounded-full bg-accent text-on-accent disabled:opacity-40",
									onClick: () => go(prompt),
									children: "↑"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex gap-2",
						children: ["trending", "templates"].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `rounded-full px-4 py-2 text-sm font-medium ${tab === id ? "bg-chip" : "text-muted"}`,
							onClick: () => setTab(id),
							children: id === "trending" ? "Trending" : "Templates"
						}, id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: shown.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "text-left",
							onClick: () => setPick(id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryArt, { id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block px-1 text-sm",
								children: label
							})]
						}, id))
					}),
					sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "Making it… it stays here if you leave this page."
					}) : null,
					shots.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-muted",
						children: "Yours"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid grid-cols-2 gap-2",
						children: shots.map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "overflow-hidden rounded-2xl bg-track",
							onClick: () => useMash.getState().openChat(shot.chatId),
							children: shot.url.startsWith("gallery:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryArt, { id: shot.url.slice(8) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: shot.url,
								alt: "",
								className: "aspect-square w-full object-cover"
							})
						}, shot.id))
					})] }) : null
				]
			}),
			chosen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex flex-col bg-bg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "safe-top flex items-center gap-2 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted",
							onClick: () => setPick(null),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-base font-semibold",
							children: chosen[1]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-h-0 flex-1 px-6 pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryArt, {
							id: chosen[0],
							className: "mx-auto aspect-square w-full max-w-sm rounded-[1.6rem]"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "safe-bottom flex gap-2 px-4 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex-1 rounded-full bg-track py-3 font-semibold",
							onClick: () => {
								setPrompt(`Make a polished ${chosen[1].toLowerCase()} image`);
								setPick(null);
							},
							children: "Remix"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "flex-1 rounded-full bg-accent py-3 font-semibold text-on-accent",
							onClick: () => take(chosen[0], chosen[1]),
							children: "Use this"
						})]
					})
				]
			}) : null
		]
	});
}
function LibraryScreen() {
	const chats = useMash((s) => s.chats);
	const projects = useMash((s) => s.projects);
	const [tab, setTab] = (0, import_react.useState)("favorites");
	const [view, setView] = (0, import_react.useState)("grid");
	const [q, setQ] = (0, import_react.useState)("");
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [folder, setFolder] = (0, import_react.useState)("");
	const query = q.trim().toLowerCase();
	const shown = chats.filter((chat) => !query || chat.title.toLowerCase().includes(query) || chatPreview(chat).toLowerCase().includes(query));
	const favs = shown.filter((chat) => chat.favorite);
	const shots = (0, import_react.useMemo)(() => chats.flatMap((chat) => (chat.messages ?? []).flatMap((message) => message.imageUrl ? [{
		id: message.id,
		url: message.imageUrl,
		chatId: chat.id,
		title: chat.title
	}] : [])), [chats]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Head, {
				title: "Library",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-full bg-inverse px-4 py-2 text-sm font-semibold text-inverse-fg",
					onClick: () => setMenu((v) => !v),
					children: "New ▾"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Settings",
					className: "grid size-10 place-items-center",
					onClick: () => useMash.getState().setScreen("more"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
				})]
			}),
			menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-4 mb-2 rounded-2xl bg-track p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "block w-full rounded-xl px-3 py-2 text-left text-sm",
					onClick: () => {
						setMenu(false);
						useMash.getState().newChat();
					},
					children: "New chat"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2 px-2 py-1",
					onSubmit: (e) => {
						e.preventDefault();
						if (!folder.trim()) return;
						useMash.getState().addProject(folder.trim());
						setFolder("");
						setMenu(false);
						setTab("folders");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: folder,
						onChange: (e) => setFolder(e.target.value),
						placeholder: "New folder",
						className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "text-sm",
						children: "Add"
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "List",
						className: `grid size-9 place-items-center rounded-full ${view === "list" ? "bg-chip" : ""}`,
						onClick: () => setView("list"),
						children: "≡"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Grid",
						className: `grid size-9 place-items-center rounded-full ${view === "grid" ? "bg-chip" : ""}`,
						onClick: () => setView("grid"),
						children: "▦"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "ml-1 flex min-w-0 flex-1 items-center gap-2 rounded-full bg-track px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search library",
							className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto px-4",
				children: [
					"suggested",
					"favorites",
					"folders",
					"images"
				].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `shrink-0 rounded-full px-3 py-1.5 text-sm ${tab === id ? "bg-chip font-medium" : "text-muted"}`,
					onClick: () => setTab(id),
					children: id[0].toUpperCase() + id.slice(1)
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 pt-6 pb-8",
				children: [
					tab === "favorites" && favs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						mark: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" }),
						title: "Save your favorites",
						copy: "Items you add to Favorites will appear here."
					}) : null,
					tab === "favorites" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatList, {
						chats: favs,
						view
					}) : null,
					tab === "suggested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatList, {
						chats: shown,
						view
					}) : null,
					tab === "folders" ? projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						mark: "▣",
						title: "No folders yet",
						copy: "Use New to make a folder, then add chats from Projects."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: projects.filter((project) => !query || project.name.toLowerCase().includes(query)).map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full items-center gap-3 rounded-2xl bg-track px-3 py-3 text-left",
							onClick: () => useMash.getState().setScreen("projects"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 place-items-center rounded-xl bg-chip",
								children: "▣"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: project.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted",
								children: [chats.filter((c) => c.projectId === project.id).length, " chats"]
							})] })]
						}) }, project.id))
					}) : null,
					tab === "images" ? shots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						mark: "▣",
						title: "No images yet",
						copy: "Images you make show up here."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: shots.map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "overflow-hidden rounded-2xl",
							onClick: () => useMash.getState().openChat(shot.chatId),
							children: shot.url.startsWith("gallery:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryArt, { id: shot.url.slice(8) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: shot.url,
								alt: shot.title,
								className: "aspect-square w-full object-cover"
							})
						}, shot.id))
					}) : null
				]
			})
		]
	});
}
function ChatList({ chats, view }) {
	if (!chats.length) return null;
	if (view === "grid") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 gap-2",
		children: chats.map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "rounded-2xl bg-track p-3 text-left",
			onClick: () => useMash.getState().openChat(chat.id),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate font-medium",
				children: chat.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block truncate text-sm text-muted",
				children: chatPreview(chat)
			})]
		}, chat.id))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: chats.map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-2 border-b border-line py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "min-w-0 flex-1 text-left",
			onClick: () => useMash.getState().openChat(chat.id),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate font-medium",
				children: chat.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-sm text-muted",
				children: chatPreview(chat)
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Favorite",
			className: chat.favorite ? "text-fg" : "text-muted",
			onClick: () => useMash.getState().toggleFavorite(chat.id),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" })
		})]
	}, chat.id)) });
}
function Empty({ mark, title, copy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid place-items-center px-6 pt-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-12 place-items-center rounded-2xl bg-chip text-muted",
				children: mark
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: copy
			})
		]
	});
}
function chatPreview(chat) {
	const last = [...chat.messages ?? []].reverse().find((m) => m.content?.trim());
	if (!last) return "Empty chat";
	return last.content.replace(/\s+/g, " ").slice(0, 80);
}
function ScheduledScreen() {
	const schedules = useMash((s) => s.schedules);
	const [task, setTask] = (0, import_react.useState)("");
	const [active, setActive] = (0, import_react.useState)(true);
	const rows = active ? schedules.filter((item) => !item.done) : schedules;
	const ideas = [
		[
			"Daily brief",
			"Personalized daily briefing with updates you care about",
			"Give me a short daily brief for Karachi: one useful idea and what I should remember.",
			nextAt(1, 8)
		],
		[
			"Weekend long read",
			"Every Saturday, find me an exceptional long read",
			"Find one exceptional long read for the weekend and say why it is worth the time.",
			nextAt(6, 9)
		],
		[
			"Sale monitor",
			"Watch my favorite stores or products",
			"Help me watch a product price. Ask what I want to track, then give me a checklist.",
			nextAt(1, 18)
		],
		[
			"Concert alerts",
			"Let me know when artists I like announce shows",
			"Ask which artists I follow, then make a weekly concert watchlist.",
			nextAt(1, 18)
		]
	];
	function add(prompt, at) {
		if (schedules.some((item) => item.prompt === prompt && !item.done)) {
			useMash.getState().setNotice("That task is already active.");
			return;
		}
		useMash.getState().addSchedule(prompt, at);
		useMash.getState().setNotice("Scheduled. Tap Run now when you want it.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { title: "Scheduled" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `mt-2 flex items-center gap-2 rounded-full px-3 py-2 text-sm ${active ? "bg-chip" : "text-muted"}`,
					onClick: () => setActive((v) => !v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4" }), active ? "Active" : "All"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[15px] leading-relaxed",
					children: "Ask mash to schedule tasks, set reminders, or check something later."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 rounded-[1.6rem] bg-track px-4 pt-4 pb-3",
					onSubmit: (e) => {
						e.preventDefault();
						if (!task.trim()) return;
						add(task.trim(), nextAt(1, 9));
						setTask("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: task,
						onChange: (e) => setTask(e.target.value),
						rows: 2,
						placeholder: "Schedule a task",
						className: "w-full resize-none bg-transparent text-base outline-none placeholder:text-muted"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 place-items-center rounded-full bg-chip",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Voice",
								className: "ml-auto grid size-10 place-items-center rounded-full bg-chip",
								onClick: () => listen(setTask),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								"aria-label": "Schedule",
								className: "ml-2 grid size-10 place-items-center rounded-full bg-chip",
								children: "↑"
							})
						]
					})]
				}),
				rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2",
					children: rows.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-track px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: item.prompt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									new Date(item.at).toLocaleString(),
									" ",
									item.done ? "· ran" : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-3 text-sm",
								children: [!item.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										useMash.getState().markSchedule(item.id, true);
										submitDraft({ text: item.prompt });
									},
									children: "Run now"
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-muted",
									onClick: () => useMash.getState().removeSchedule(item.id),
									children: "Delete"
								})]
							})
						]
					}, item.id))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: "Recommended ▾"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2",
					children: ideas.map(([title, copy, prompt, at]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 border-b border-line py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm text-muted",
								children: copy
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": `Add ${title}`,
							className: "grid size-9 place-items-center",
							onClick: () => add(prompt, at),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
						})]
					}, title))
				})
			]
		})]
	});
}
function PluginsScreen() {
	const plugins = useMash((s) => s.plugins);
	const extra = useMash((s) => s.extraTools ?? []);
	const toggle = useMash((s) => s.togglePlugin);
	const [q, setQ] = (0, import_react.useState)("");
	const query = q.trim().toLowerCase();
	const core = [
		[
			"imagine",
			"Imagine",
			"Generate images from a prompt"
		],
		[
			"voice",
			"Voice",
			"Talk with the voice assistant"
		],
		[
			"files",
			"Files",
			"Attach photos and files"
		],
		[
			"preview",
			"Preview",
			"Show a page under finished code"
		]
	];
	const popular = TOOLS.filter((tool) => !extra.includes(tool.id) && (!query || tool.name.toLowerCase().includes(query)));
	const installed = TOOLS.filter((tool) => extra.includes(tool.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { title: "" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-[2rem] font-semibold tracking-tight",
					children: "Plugins"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[15px]",
					children: "Work with mash across the tools you use."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-w-0 flex-1 items-center gap-2 rounded-full bg-track px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search plugins",
							className: "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-full bg-chip",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: "Installed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 space-y-2",
					children: [core.filter(([, name]) => !query || name.toLowerCase().includes(query)).map(([key, name, copy]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 place-items-center rounded-2xl bg-chip text-sm font-semibold",
								children: name.slice(0, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-medium",
									children: name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm text-muted",
									children: copy
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								role: "switch",
								"aria-checked": plugins[key],
								className: `h-7 w-12 rounded-full p-1 ${plugins[key] ? "bg-accent" : "bg-line"}`,
								onClick: () => toggle(key),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `block size-5 rounded-full bg-on-accent ${plugins[key] ? "ml-auto" : ""}` })
							})
						]
					}, key)), installed.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 place-items-center rounded-2xl text-sm font-semibold text-white",
								style: { background: tool.tint },
								children: tool.mark
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "min-w-0 flex-1 text-left",
								onClick: () => openTool(tool.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-medium",
									children: tool.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm text-muted",
									children: tool.copy
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-sm text-muted",
								onClick: () => useMash.getState().toggleTool(tool.id),
								children: "Remove"
							})
						]
					}, tool.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 font-medium",
					children: "Popular"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2",
					children: popular.map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 place-items-center rounded-2xl text-sm font-semibold text-white",
								style: { background: tool.tint },
								children: tool.mark
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-medium",
									children: tool.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm text-muted",
									children: tool.copy
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": `Add ${tool.name}`,
								className: "grid size-9 place-items-center",
								onClick: () => useMash.getState().toggleTool(tool.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
							})
						]
					}, tool.id))
				})
			]
		})]
	});
}
function openTool(id) {
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
	const [q, setQ] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("all");
	const [making, setMaking] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(null);
	const query = q.trim().toLowerCase();
	const list = projects.filter((project) => !query || project.name.toLowerCase().includes(query));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, {
			title: "Projects",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "rounded-full bg-inverse px-4 py-2 text-sm font-semibold text-inverse-fg",
				onClick: () => setMaking((v) => !v),
				children: "New"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-8",
			children: [
				making ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mb-3 flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						if (!name.trim()) return;
						useMash.getState().addProject(name.trim());
						setName("");
						setMaking(false);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Project name",
						className: "min-w-0 flex-1 rounded-full bg-track px-4 py-3 outline-none placeholder:text-muted"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "rounded-full bg-accent px-4 text-sm font-semibold text-on-accent",
						children: "Add"
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 rounded-full bg-track px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search projects",
						className: "min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex gap-3 text-sm",
					children: [
						["all", "All"],
						["yours", "Created by you"],
						["shared", "Shared with you"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `rounded-full px-3 py-1.5 ${tab === id ? "bg-chip font-medium" : "text-muted"}`,
						onClick: () => setTab(id),
						children: label
					}, id))
				}),
				tab === "shared" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					mark: "▣",
					title: "Nothing shared",
					copy: "Projects on this phone stay with you."
				}) : null,
				tab !== "shared" && list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					mark: "▣",
					title: "No projects yet",
					copy: "Tap New to start one, then add chats into it."
				}) : null,
				tab !== "shared" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: list.map((project) => {
						const inside = chats.filter((c) => c.projectId === project.id);
						const loose = chats.filter((c) => c.projectId !== project.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl bg-track p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full items-center justify-between text-left",
								onClick: () => setOpen(open === project.id ? null : project.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-medium",
									children: project.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-muted",
									children: [inside.length, " chats"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: open === project.id ? "▾" : "›"
								})]
							}), open === project.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2",
								children: [
									inside.map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between py-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "truncate text-sm",
											onClick: () => useMash.getState().openChat(chat.id),
											children: chat.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "text-xs text-muted",
											onClick: () => useMash.getState().assignChat(chat.id, null),
											children: "Out"
										})]
									}, chat.id)),
									loose.slice(0, 6).map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "block w-full truncate py-1 text-left text-sm text-muted",
										onClick: () => useMash.getState().assignChat(chat.id, project.id),
										children: ["Add ", chat.title]
									}, chat.id)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "mt-2 text-sm text-muted",
										onClick: () => useMash.getState().removeProject(project.id),
										children: "Remove project"
									})
								]
							}) : null]
						}, project.id);
					})
				}) : null
			]
		})]
	});
}
function CodeScreen() {
	const chats = useMash((s) => s.chats);
	const sending = useMash((s) => s.sending);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(null);
	const blocks = (0, import_react.useMemo)(() => {
		const found = [];
		for (const chat of chats) for (const message of chat.messages ?? []) {
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
					code
				});
			}
		}
		return found;
	}, [chats]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Head, { title: "Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "rounded-[1.6rem] bg-track px-4 pt-4 pb-3",
				onSubmit: (e) => {
					e.preventDefault();
					if (!prompt.trim() || sending) return;
					useMash.getState().setMode("code");
					submitDraft({ text: prompt.trim() });
					setPrompt("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: prompt,
					onChange: (e) => setPrompt(e.target.value),
					rows: 2,
					placeholder: "Describe what to build",
					className: "w-full resize-none bg-transparent text-base outline-none placeholder:text-muted"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !prompt.trim() || sending,
						className: "grid size-10 place-items-center rounded-full bg-accent text-on-accent disabled:opacity-40",
						children: "↑"
					})
				})]
			}), blocks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
				mark: ">_ ",
				title: "No code yet",
				copy: "Describe a page or a script. Finished code collects here, and you can copy it."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: blocks.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-track p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								block.lang === "pdf" ? "Document" : block.lang,
								" · ",
								block.chat
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-2 max-h-28 overflow-hidden text-sm leading-relaxed",
							children: block.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => useMash.getState().openChat(block.chatId),
								children: "Open chat"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-muted",
								onClick: () => {
									navigator.clipboard.writeText(block.code);
									setCopied(block.id);
								},
								children: copied === block.id ? "Copied" : "Copy"
							})]
						})
					]
				}, block.id))
			})]
		})]
	});
}
function MashLogo({ bar = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: bar ? "mash-logo mash-logo-bar" : "mash-logo",
		children: "mash"
	});
}
function MenuMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "17",
		height: "11",
		viewBox: "0 0 22 14",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M1 1.5h13",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M1 12.5h20",
			stroke: "currentColor",
			strokeWidth: "2",
			strokeLinecap: "round"
		})]
	});
}
var MODES = [
	{
		id: "chat",
		label: "Chat"
	},
	{
		id: "imagine",
		label: "Imagine"
	},
	{
		id: "document",
		label: "Document"
	},
	{
		id: "code",
		label: "Code"
	},
	{
		id: "build",
		label: "Build"
	}
];
var subscribeGate = () => () => {};
function useThemeSync() {
	const theme = useMash((s) => s.theme);
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		const apply = () => {
			const dark = theme === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches : theme === "dark";
			root.dataset.theme = dark ? "dark" : "light";
		};
		apply();
		if (theme !== "system") return;
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, [theme]);
}
async function attachFile(item) {
	if (item.size > 12e5) {
		useMash.getState().setNotice("That file is too big.");
		return;
	}
	let pending;
	if (item.type.startsWith("image/")) {
		const buf = await item.arrayBuffer();
		const bytes = new Uint8Array(buf);
		let binary = "";
		for (let i = 0; i < bytes.length; i += 32768) binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
		pending = {
			name: item.name,
			dataUrl: `data:${item.type};base64,${btoa(binary)}`
		};
	} else {
		const text = await item.text();
		pending = {
			name: item.name,
			text: text.slice(0, 12e3)
		};
	}
	useMash.getState().setPendingFiles([pending]);
}
function shrinkImage(file) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, 768 / Math.max(img.width, img.height));
			const canvas = document.createElement("canvas");
			canvas.width = Math.max(1, Math.round(img.width * scale));
			canvas.height = Math.max(1, Math.round(img.height * scale));
			canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", .68));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("image"));
		};
		img.src = url;
	});
}
function ConversationIcon() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3.5",
				y: "8",
				width: "3",
				height: "8",
				rx: "1.5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "10.5",
				y: "4",
				width: "3",
				height: "16",
				rx: "1.5",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "17.5",
				y: "9",
				width: "3",
				height: "6",
				rx: "1.5",
				fill: "currentColor"
			})
		]
	});
}
function MashApp() {
	const notice = useMash((s) => s.notice);
	const setNotice = useMash((s) => s.setNotice);
	const sidebar = useMash((s) => s.sidebar);
	const screen = useMash((s) => s.screen);
	useThemeSync();
	(0, import_react.useEffect)(() => {
		Promise.resolve(useMash.persist.rehydrate()).then(() => resumeJobs());
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
	(0, import_react.useEffect)(() => {
		if (!notice) return;
		const id = window.setTimeout(() => setNotice(null), 2800);
		return () => window.clearTimeout(id);
	}, [notice, setNotice]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-dvh w-full max-w-md flex-col bg-bg text-fg",
		children: [
			sidebar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}) : screen === "pricing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pricing, {}) : screen === "main" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Main, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {}),
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-full bg-inverse px-4 py-2 text-sm text-inverse-fg shadow-lg",
					children: notice
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalSheet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductPage, {})
		]
	});
}
function TopBar({ thread }) {
	const setSidebar = useMash((s) => s.setSidebar);
	const picker = useMash((s) => s.picker);
	const setPicker = useMash((s) => s.setPicker);
	const setScreen = useMash((s) => s.setScreen);
	const active = useMash((s) => s.chats.find((c) => c.id === s.activeId));
	const { user, isPending } = useCurrentUserState();
	async function share() {
		const text = (active?.messages ?? []).map((m) => `${m.role === "user" ? "You" : "mash"}: ${m.content}`).join("\n\n");
		if (!text) return;
		if (navigator.share) try {
			await navigator.share({
				title: active?.title ?? "mash",
				text
			});
			return;
		} catch {}
		await navigator.clipboard.writeText(text);
		useMash.getState().setNotice("Chat copied.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "safe-top relative z-20 flex items-center px-2 pb-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Open menu",
				className: "grid size-10 shrink-0 place-items-center",
				onClick: () => setSidebar(true),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuMark, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-w-0 items-center gap-0.5",
				"aria-expanded": picker,
				onClick: () => setPicker(!picker),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MashLogo, { bar: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `size-4 shrink-0 text-muted ${picker ? "rotate-180" : ""}` })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex shrink-0 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex items-center gap-1 px-1.5 py-2 text-sm font-semibold text-upgrade",
					onClick: () => setScreen("pricing"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), "Upgrade"]
				}), thread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Share chat",
					className: "grid size-10 place-items-center",
					onClick: () => void share(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share, { className: "size-5" })
				}) : isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-10" }) : user ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "shrink-0 rounded-full bg-inverse px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap text-inverse-fg",
					children: "Log in"
				})]
			}),
			picker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModelMenu, {}) : null
		]
	});
}
function ModelMenu() {
	const setPicker = useMash((s) => s.setPicker);
	const setScreen = useMash((s) => s.setScreen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": "Close models",
		className: "fixed inset-0 z-20 cursor-default",
		onClick: () => setPicker(false)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute top-full left-4 z-30 w-[min(20rem,calc(100%-2rem))] rounded-card border border-line bg-menu p-1.5 shadow-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3 rounded-xl px-3 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "mash"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Fast answers, images, and code."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-1 size-4 shrink-0" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left",
			onClick: () => {
				setPicker(false);
				setScreen("pricing");
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: "mash Ultra"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Longer work. Requires Upgrade."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mt-1 size-4 shrink-0 text-muted" })]
		})]
	})] });
}
function Main() {
	const thread = (useMash((s) => s.chats.find((c) => c.id === s.activeId))?.messages.length ?? 0) > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative isolate flex min-h-0 flex-1 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aurora",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { thread }),
			thread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thread, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, { threaded: thread })
		]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid flex-1 place-items-center px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "hero-title text-center",
			children: [
				"What do you want to",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
				"make?"
			]
		})
	});
}
function cleanUserText(content) {
	return content.replace(/\n*\[[^\]\n]*\.(?:jpe?g|png|webp|gif|heic)[^\]\n]*\]\s*$/i, "").trim();
}
function Thread() {
	const messages = useMash((s) => s.chats.find((c) => c.id === s.activeId)?.messages ?? []);
	const sending = useMash((s) => s.sending);
	const live = useLive();
	const box = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = box.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [
		messages,
		live.text,
		sending
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: box,
		className: "min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-2",
		children: messages.map((m) => {
			const text = m.id === live.id ? live.text : m.content;
			if (m.role === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-end gap-1",
				children: [m.images?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex max-w-[80%] justify-end gap-1 overflow-x-auto",
					children: m.images.map((src, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: "",
						className: "size-16 rounded-lg object-cover"
					}, index))
				}) : null, cleanUserText(m.content) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-[80%] rounded-bubble bg-bubble px-4 py-2.5 text-left text-base leading-snug whitespace-pre-wrap",
					children: cleanUserText(m.content)
				}) : null]
			}, m.id);
			const streaming = m.id === live.id && sending;
			if (!text && sending && m.id === live.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex h-7 items-center gap-1.5 px-1 text-fg",
				"aria-label": "mash is thinking",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "think-dot" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "think-dot" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "think-dot" })
				]
			}, m.id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-[94%]",
				children: [m.imageUrl?.startsWith("gallery:") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalleryArt, {
					id: m.imageUrl.slice(8),
					className: "mb-2 aspect-square w-full max-w-xs rounded-xl"
				}) : m.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: m.imageUrl,
					alt: "",
					className: "mb-2 max-h-80 w-full rounded-xl object-cover"
				}) : null, text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveAnswer, {
					id: m.id,
					text,
					live: streaming
				}) : null]
			}, m.id);
		})
	});
}
function Composer({ threaded }) {
	const draft = useMash((s) => s.draft);
	const setDraft = useMash((s) => s.setDraft);
	const mode = useMash((s) => s.mode);
	const setMode = useMash((s) => s.setMode);
	const sending = useMash((s) => s.sending);
	const files = useMash((s) => s.pendingFiles);
	const setPendingFiles = useMash((s) => s.setPendingFiles);
	const voiceOn = useMash((s) => s.voiceOn);
	const [modesOpen, setModesOpen] = (0, import_react.useState)(false);
	const [plusOpen, setPlusOpen] = (0, import_react.useState)(false);
	const [gallery, setGallery] = (0, import_react.useState)(false);
	const box = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const ready = draft.trim().length > 0 || files.length > 0;
	const showPill = threaded || mode !== "chat";
	(0, import_react.useEffect)(() => {
		const el = box.current;
		if (!el) return;
		el.style.height = "0px";
		el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
	}, [draft, threaded]);
	(0, import_react.useEffect)(() => {
		const listen = () => dictate(true);
		window.addEventListener("mash-listen", listen);
		return () => window.removeEventListener("mash-listen", listen);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!voiceOn) recognition?.stop();
	}, [voiceOn]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "safe-bottom px-3",
		children: [
			files.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between rounded-full bg-track px-3 py-1.5 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: files.length === 1 ? files[0].name : `${files.length} photos`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Remove file",
					onClick: () => setPendingFiles([]),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceStage, {}),
			showPill ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "flex items-center gap-2 rounded-full border border-line bg-composer px-4 py-2 text-sm font-medium",
					onClick: () => setModesOpen((v) => !v),
					children: [MODES.find((m) => m.id === mode)?.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })]
				}), modesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-12 left-0 z-30 w-40 rounded-card border border-line bg-menu p-1",
					children: MODES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm",
						onClick: () => {
							setMode(item.id);
							setModesOpen(false);
						},
						children: [item.label, mode === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : null]
					}, item.id))
				}) : null]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: threaded ? "flex items-end gap-2 rounded-composer border border-line bg-composer px-2 py-2" : "rounded-composer border border-line bg-composer px-3 pt-3 pb-2",
				onSubmit: (e) => {
					e.preventDefault();
					submitDraft();
				},
				children: [!threaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					ref: box,
					value: draft,
					rows: 2,
					placeholder: "Ask anything",
					className: "mb-2 max-h-40 w-full resize-none bg-transparent text-base outline-none placeholder:text-muted",
					onChange: (e) => setDraft(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							submitDraft();
						}
					}
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center ${threaded ? "w-full gap-2" : "gap-2"}`,
					children: [
						threaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Add photos",
							onClick: () => setGallery(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-5" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
								label: "Add",
								onClick: () => setPlusOpen((v) => !v),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
							}), plusOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlusMenu, {
								onPhotos: () => setGallery(true),
								onFile: () => fileRef.current?.click(),
								close: () => setPlusOpen(false)
							}) : null]
						}),
						threaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							ref: box,
							value: draft,
							rows: 1,
							placeholder: "Message mash",
							className: "max-h-40 min-w-0 flex-1 resize-none bg-transparent py-2.5 text-left text-base outline-none placeholder:text-muted",
							onChange: (e) => setDraft(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									submitDraft();
								}
							}
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Conversation",
							onClick: () => {
								unlockTalk();
								primeCallAudio();
								openVoiceAssistant();
								beginVoiceListen();
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationIcon, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
							label: "Voice text",
							onClick: () => dictate(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							"aria-label": sending ? "Stop" : "Send",
							disabled: !ready && !sending,
							className: `grid size-11 place-items-center rounded-full text-on-accent ${ready || sending ? "bg-accent" : "bg-accent-dim"}`,
							children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-5" })
						})
					]
				})]
			}),
			threaded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mx-auto mt-3 max-w-sm text-center text-xs leading-5 text-muted",
				children: [
					"mash is AI. By using it, you agree to our",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "underline underline-offset-2",
						onClick: () => useMash.getState().setLegal("terms"),
						children: "Terms"
					}),
					" ",
					"&",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "underline underline-offset-2",
						onClick: () => useMash.getState().setLegal("privacy"),
						children: "Privacy Policy"
					}),
					".",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "underline underline-offset-2",
						onClick: () => useMash.getState().setLegal("learn"),
						children: "Learn more"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				hidden: true,
				multiple: true,
				accept: "image/*,.txt,.md,.json,.csv,.ts,.tsx,.js,.py,.html,.css,.pdf,.doc,.docx",
				onChange: (e) => {
					const item = [...e.target.files ?? []].find((file) => !file.type.startsWith("image/"));
					if (item) attachFile(item);
					e.target.value = "";
				}
			}),
			gallery ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GallerySheet, { onClose: () => setGallery(false) }) : null
		]
	});
}
function IconButton({ label, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "grid size-11 shrink-0 place-items-center rounded-full bg-chip text-fg",
		children
	});
}
function GallerySheet({ onClose }) {
	const inputRef = (0, import_react.useRef)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const drag = (0, import_react.useRef)(false);
	const chosen = items.filter((item) => item.on).length;
	(0, import_react.useEffect)(() => {
		inputRef.current?.click();
	}, []);
	(0, import_react.useEffect)(() => {
		const stop = () => {
			drag.current = false;
		};
		window.addEventListener("pointerup", stop);
		return () => window.removeEventListener("pointerup", stop);
	}, []);
	function add(list) {
		const files = [...list ?? []].filter((file) => file.type.startsWith("image/")).slice(0, 40);
		setItems((prev) => [...prev, ...files.map((file) => ({
			url: URL.createObjectURL(file),
			file,
			on: false
		}))].slice(0, 40));
	}
	function selectAt(index) {
		setItems((prev) => {
			if (!prev[index] || prev[index].on) return prev;
			if (prev.filter((item) => item.on).length >= 20) {
				useMash.getState().setNotice("20 photos at a time.");
				return prev;
			}
			const next = prev.slice();
			next[index] = {
				...next[index],
				on: true
			};
			return next;
		});
	}
	function slide(event) {
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
		const pending = [];
		for (const item of picked) try {
			pending.push({
				name: item.file.name,
				dataUrl: await shrinkImage(item.file)
			});
		} catch {}
		items.forEach((item) => URL.revokeObjectURL(item.url));
		useMash.getState().setPendingFiles(pending);
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm",
						onClick: onClose,
						children: "Cancel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [chosen, "/20"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm font-semibold text-accent",
						onClick: () => void useSelected(),
						children: "Use"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pb-2 text-sm text-muted",
				children: "Slide your finger across photos. Up to 20."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid min-h-0 flex-1 grid-cols-4 content-start gap-1 overflow-y-auto px-2 touch-none",
				onPointerMove: slide,
				children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"data-i": index,
					className: `relative aspect-square overflow-hidden rounded-lg ${item.on ? "ring-2 ring-accent" : ""}`,
					onPointerDown: () => {
						drag.current = true;
						selectAt(index);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.url,
						alt: "",
						className: "pointer-events-none size-full object-cover"
					})
				}, item.url))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "safe-bottom px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "w-full rounded-full bg-chip py-3 text-sm",
					onClick: () => inputRef.current?.click(),
					children: "Open gallery"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				hidden: true,
				multiple: true,
				accept: "image/*",
				onChange: (e) => {
					add(e.target.files);
					e.target.value = "";
				}
			})
		]
	});
}
function PlusMenu({ onPhotos, onFile, close }) {
	const setMode = useMash((s) => s.setMode);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute bottom-14 left-0 z-30 w-44 rounded-card border border-line bg-menu p-1",
		children: [
			{
				label: "Add photos",
				run: onPhotos
			},
			{
				label: "Add a file",
				run: onFile
			},
			{
				label: "Imagine",
				run: () => setMode("imagine")
			},
			{
				label: "Document",
				run: () => setMode("document")
			},
			{
				label: "Code",
				run: () => setMode("code")
			},
			{
				label: "Build",
				run: () => setMode("build")
			}
		].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "block w-full rounded-xl px-3 py-2.5 text-left text-sm",
			onClick: () => {
				item.run();
				close();
			},
			children: item.label
		}, item.label))
	});
}
function getRecognizer() {
	const w = window;
	const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
	return Ctor ? new Ctor() : null;
}
var recognition = null;
var heardTimer = 0;
function unlockTalk() {
	const synth = window.speechSynthesis;
	if (!synth) return;
	try {
		const utter = new SpeechSynthesisUtterance(" ");
		utter.volume = .01;
		synth.speak(utter);
	} catch {}
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
	} catch {}
	window.clearTimeout(heardTimer);
	recognition = rec;
	rec.lang = "en-US";
	rec.interimResults = true;
	rec.continuous = true;
	let latest = "";
	let sent = false;
	const send = (said) => {
		const line = said.trim();
		if (sent || !line || useMash.getState().sending || !useVoiceUi.getState().open) return;
		sent = true;
		window.clearTimeout(heardTimer);
		useVoiceUi.setState({
			line,
			phase: "think"
		});
		try {
			rec.stop();
		} catch {}
		submitDraft({
			text: line,
			fromVoice: true
		});
	};
	rec.onresult = (event) => {
		const ev = event;
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
	rec.onerror = (event) => {
		const err = event.error;
		if (err === "not-allowed" || err === "service-not-allowed") useMash.getState().setNotice("Tap the mic and allow it, then speak.");
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
function dictate(autoSend) {
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
	rec.onresult = (event) => {
		const said = event.results[0]?.[0]?.transcript?.trim() ?? "";
		if (!said) return;
		if (autoSend) submitDraft({
			text: said,
			fromVoice: true
		});
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
	const gate = (0, import_react.useSyncExternalStore)(subscribeGate, hasGateSessionMarker, () => false);
	const [prefs, setPrefs] = (0, import_react.useState)(false);
	const [menuId, setMenuId] = (0, import_react.useState)(null);
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const q = query.trim().toLowerCase();
	const recent = chats.filter((c) => !q || c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content.toLowerCase().includes(q))).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.updated - a.updated).slice(0, 20);
	const label = user?.displayName || user?.primaryEmail || "Log in";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "safe-top flex min-h-0 flex-1 flex-col px-2 pb-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close menu",
						className: "grid size-10 shrink-0 place-items-center",
						onClick: () => setSidebar(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MashLogo, { bar: true }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Search",
						className: "ml-auto grid size-11 place-items-center",
						onClick: () => setSearching(!searching),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
					})
				]
			}),
			searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				autoFocus: true,
				value: query,
				placeholder: "Search chats",
				className: "mb-3 w-full rounded-2xl bg-track px-4 py-3 text-base outline-none placeholder:text-muted",
				onChange: (e) => setQuery(e.target.value)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "mb-2 flex items-center gap-3 rounded-2xl bg-track px-4 py-3 text-left text-[15px] font-medium",
				onClick: newChat,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-5" }), "New chat"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", { children: [
						{
							screen: "images",
							label: "Images",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, { className: "size-5" })
						},
						{
							screen: "library",
							label: "Library",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "size-5" })
						},
						{
							screen: "scheduled",
							label: "Scheduled",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-5" })
						},
						{
							screen: "plugins",
							label: "Plugins",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "size-5" })
						},
						{
							screen: "projects",
							label: "Projects",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "size-5" }),
							extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
						},
						{
							screen: "code",
							label: "Code",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { className: "size-5" }),
							extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						},
						{
							screen: "more",
							label: "More",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-0.5 text-lg leading-none",
								children: "···"
							})
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-[15px]",
						onClick: () => setScreen(item.screen),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid w-6 place-items-center",
								children: item.icon
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1",
								children: item.label
							}),
							item.extra
						]
					}, item.screen)) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex items-center px-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted",
							children: "Recents"
						})
					}),
					recent.map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: `flex w-full items-center rounded-xl py-2 pr-10 pl-4 text-left text-[15px] ${chat.id === activeId ? "bg-track" : ""}`,
								onClick: () => openChat(chat.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex min-w-0 items-center gap-2",
									children: [chat.pinned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3.5 shrink-0 text-muted" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: chat.title
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Chat options",
								className: "absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center text-muted",
								onClick: () => {
									setConfirmId(null);
									setMenuId(menuId === chat.id ? null : chat.id);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
							}),
							menuId === chat.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-9 right-1 z-20 w-36 rounded-xl border border-line bg-menu p-1 shadow-lg",
								children: confirmId === chat.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "px-3 py-2 text-sm",
										children: "Delete this chat?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "block w-full rounded-lg px-3 py-2 text-left text-sm",
										onClick: () => {
											removeChat(chat.id);
											setMenuId(null);
											setConfirmId(null);
										},
										children: "Yes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "block w-full rounded-lg px-3 py-2 text-left text-sm text-muted",
										onClick: () => setConfirmId(null),
										children: "No"
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "block w-full rounded-lg px-3 py-2 text-left text-sm",
									onClick: () => {
										togglePin(chat.id);
										setMenuId(null);
									},
									children: chat.pinned ? "Unpin" : "Pin"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "block w-full rounded-lg px-3 py-2 text-left text-sm",
									onClick: () => setConfirmId(chat.id),
									children: "Delete"
								})] })
							}) : null
						]
					}, chat.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "mt-2 flex w-full items-center gap-3 px-2 py-2.5 text-left text-[15px]",
				onClick: () => setPrefs((v) => !v),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: "Preference"
					}),
					prefs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				]
			}),
			prefs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 grid grid-cols-3 gap-1 rounded-2xl bg-track p-1",
				children: [
					[
						"light",
						"Light",
						Sun
					],
					[
						"dark",
						"Dark",
						Moon
					],
					[
						"system",
						"System",
						Monitor
					]
				].map(([id, name, Icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: `flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm ${theme === id ? "bg-track-on shadow-sm" : "text-muted"}`,
					onClick: () => setTheme(id),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), name]
				}, id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 pt-2",
				children: [isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-11 animate-pulse rounded-full bg-track" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-full bg-accent text-base font-semibold text-on-accent",
						children: label.slice(0, 1).toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-medium",
						children: label
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/login",
					className: "flex min-w-0 flex-1 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-11 place-items-center rounded-full bg-accent text-base font-semibold text-on-accent",
						children: "M"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-medium",
						children: "Log in"
					})]
				}), user && !user.isDevFallback && !gate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: signingOut,
					className: "rounded-full bg-track px-4 py-2.5 text-sm font-medium",
					onClick: () => {
						setSigningOut(true);
						signOut().catch(() => setSigningOut(false));
					},
					children: signingOut ? "…" : "Log out"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-full bg-track px-5 py-2.5 text-sm font-medium",
					onClick: () => setScreen("pricing"),
					children: "Upgrade"
				})]
			})
		]
	});
}
function Pricing() {
	const setScreen = useMash((s) => s.setScreen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "safe-top min-h-0 flex-1 overflow-y-auto px-5 pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "py-2 text-sm text-muted",
				onClick: () => setScreen("main"),
				children: "Back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-3xl font-semibold tracking-tight",
				children: "Plans and pricing"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: "mash is included. mash Ultra is the longer model and stays locked until you upgrade."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-6 rounded-card border border-line p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold",
						children: "Free"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "Chat, voice, files, and image creation with a short pause after heavy use."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-3xl font-semibold",
						children: "$0"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-4 rounded-card border border-line p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold",
						children: "mash Ultra"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "Longer answers, harder code, and bigger sheets. The arrow next to the logo shows it, and it stays locked on the free plan."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-2xl font-semibold",
						children: "Coming later"
					})
				]
			})
		]
	});
}
function Section() {
	if (useMash((s) => s.screen) !== "more") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuScreens, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "safe-top flex items-center gap-1 px-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Open menu",
				className: "grid size-10 place-items-center",
				onClick: () => useMash.getState().setSidebar(true),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuMark, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[1.65rem] font-semibold tracking-tight",
				children: "More"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-5 pb-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MorePage, {})
		})]
	});
}
function MorePage() {
	const { user } = useCurrentUserState();
	const gate = (0, import_react.useSyncExternalStore)(subscribeGate, hasGateSessionMarker, () => false);
	const setLegal = useMash((s) => s.setLegal);
	const clearChats = useMash((s) => s.clearChats);
	const [armed, setArmed] = (0, import_react.useState)(false);
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pb-2 text-sm leading-relaxed text-muted",
				children: "Images keeps every picture. Library is the full chat list. Projects group related chats. Code keeps pages and PDFs mash already wrote. Scheduled waits until you tap Run now."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Terms",
				onClick: () => setLegal("terms")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Privacy",
				onClick: () => setLegal("privacy")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: "Learn more",
				onClick: () => setLegal("learn")
			}),
			user && !user.isDevFallback && !gate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				label: signingOut ? "Signing out…" : "Log out",
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				}
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "flex w-full rounded-2xl bg-track px-4 py-3 text-left text-danger",
				onClick: () => {
					if (!armed) {
						setArmed(true);
						return;
					}
					clearChats();
					setArmed(false);
				},
				children: armed ? "Tap again to clear every chat" : "Clear all chats"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 flex items-center gap-2 text-sm text-muted",
				onClick: () => {
					const last = useMash.getState().chats[0]?.messages.filter((m) => m.role === "assistant").at(-1);
					if (last) playSpeech(last.content);
				},
				children: "Read the latest reply aloud"
			})
		]
	});
}
function Row({ label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "flex w-full rounded-2xl bg-track px-4 py-3 text-left",
		onClick,
		children: label
	});
}
function LegalSheet() {
	const legal = useMash((s) => s.legal);
	const setLegal = useMash((s) => s.setLegal);
	if (!legal) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Close",
			className: "absolute inset-0 bg-overlay",
			onClick: () => setLegal(null)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "safe-bottom relative z-10 flex max-h-dvh w-full max-w-md flex-col rounded-t-3xl bg-menu px-5 pt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-semibold",
					children: legal === "terms" ? "Terms" : legal === "privacy" ? "Privacy" : "Learn more"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 min-h-0 flex-1 space-y-4 overflow-y-auto pb-3",
					children: (legal === "terms" ? [
						["Agreement", "These terms cover mash, the assistant for chat, code, images, voice, and small builds. By using mash you agree to them. If you do not agree, stop using it."],
						["The service", "mash answers questions, writes code, generates images in Imagine, and speaks when you use voice. A free session can pause briefly after heavy use so the service stays available. mash Ultra, when it ships, is the longer model and stays locked until then."],
						["Your account", "You can use mash without an account. If you sign in, you are responsible for the activity on that login. Keep your password to yourself. Tell us if you think someone else is using your account."],
						["What you send", "You keep your rights in the text, files, and images you send. You give mash permission to process them only to produce the reply, image, or speech you asked for. Do not send material you do not have the right to use."],
						["Acceptable use", "Do not use mash to break the law, harm people, or try to break the service. Do not ask it to create malware, scams, or sexual content involving minors. Do not overload it with automated traffic. We can refuse a request or pause access when a use breaks these rules."],
						["Accuracy", "Replies, code, and images can be wrong, incomplete, or out of date. You check anything that matters before you rely on it, especially legal, medical, financial, or safety decisions. mash does not invent a relationship with you and does not replace a professional."],
						["Code and previews", "Code is shown so you can read it, copy it, and preview a page when the result is HTML. A preview is a rough render in the browser, not a hosted product and not a promise that the code is bug-free."],
						["Voice", "Voice text types what you say. The voice assistant listens, answers, and speaks back. Allow the microphone when the phone asks. Do not use voice where recording other people would be unlawful."],
						["Ending use", "You can stop anytime. We can suspend access if these terms are broken or if the service needs to pause. Some requests may fail when the model is busy. That is not a guarantee of uptime."],
						["Changes", "These terms can be updated as mash changes. The version you see in the app is the one that applies when you use it. Continued use after a change means you accept the update."]
					] : legal === "privacy" ? [
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
						["Contact", "Questions about these practices can be sent through the account email you used to sign in. If you are not signed in, the choices above are the controls available in the app."]
					] : [
						["mash", "The home model is for fast answers, code, images, and voice. Type what you want, or hold a conversation with the voice assistant."],
						["Voice", "The microphone types what you say into the box. The round assistant mark opens a conversation: you talk, mash replies out loud."],
						["Code", "Switch to Code or Build when you want something made. Finished HTML gets a copy button and a preview of the page under the code."],
						["Ultra", "The arrow beside the logo opens the model list. mash Ultra stays locked until it ships."]
					]).map(([head, copy]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: head
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted",
						children: copy
					})] }, head))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 mb-2 w-full shrink-0 rounded-full bg-inverse py-3 font-semibold text-inverse-fg",
					onClick: () => setLegal(null),
					children: "Done"
				})
			]
		})]
	});
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
	const [muted, setMuted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) setMuted(false);
	}, [open]);
	(0, import_react.useEffect)(() => {
		const again = () => {
			if (!useVoiceUi.getState().open || useVoiceUi.getState().phase !== "listen") return;
			beginVoiceListen();
		};
		window.addEventListener("mash-voice", again);
		return () => window.removeEventListener("mash-voice", again);
	}, []);
	(0, import_react.useEffect)(() => {
		if (open && !muted && phase === "listen" && !sending) return;
		try {
			recognition?.stop();
		} catch {}
	}, [
		open,
		muted,
		phase,
		sending
	]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-2 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-w-full items-center gap-2 rounded-full border border-line bg-menu py-1.5 pr-1.5 pl-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "voice-orb voice-orb-sm shrink-0",
					"data-phase": muted ? "think" : phase,
					"aria-hidden": "true",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "voice-orb-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "voice-orb-glow-b" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-44 truncate text-sm",
					children: phase === "speak" ? spoken || "Speaking" : phase === "think" || sending ? line || "Thinking" : muted ? "Muted" : line || "Listening"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": muted ? "Unmute microphone" : "Mute microphone",
					className: "grid size-10 shrink-0 place-items-center rounded-full bg-chip",
					onClick: () => {
						if (muted) {
							setMuted(false);
							beginVoiceListen();
							return;
						}
						setMuted(true);
					},
					children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close voice assistant",
					className: "grid size-10 shrink-0 place-items-center rounded-full bg-chip",
					onClick: () => closeVoice(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MashApp, {});
}
//#endregion
export { Home as component };
