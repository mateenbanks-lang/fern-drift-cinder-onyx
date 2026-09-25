import { useEffect, useRef, useState, type ReactNode } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { create } from "zustand";
import { downloadDoc, downloadPdf, parsePdfDoc } from "@/lib/mash/pdf";
import { useMash } from "@/lib/mash/store";

type Block =
  | { kind: "code"; lang: string; code: string }
  | { kind: "text"; text: string };

function blocksOf(source: string): Block[] {
  const parts = source.split("```");
  const blocks: Block[] = [];
  parts.forEach((part, index) => {
    if (index % 2 === 0) {
      if (part.trim()) blocks.push({ kind: "text", text: part });
      return;
    }
    const nl = part.indexOf("\n");
    const lang = (nl === -1 ? part : part.slice(0, nl)).trim();
    const code = nl === -1 ? "" : part.slice(nl + 1).replace(/\n$/, "");
    blocks.push({ kind: "code", lang, code });
  });
  return blocks;
}

function renderTex(source: string, display: boolean) {
  try {
    return katex.renderToString(source.trim(), {
      displayMode: display,
      throwOnError: false,
      strict: "ignore",
      output: "html",
    });
  } catch {
    return "";
  }
}

function looksLikeMath(body: string) {
  if (/\\/.test(body)) return true;
  if (/[=^_]/.test(body)) return true;
  return /[a-z]/i.test(body) && body.length < 48 && /^[a-z0-9+\-*/().,\s]+$/i.test(body);
}

function inline(text: string) {
  const bits = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\)|\\\([\s\S]+?\\\)|\$[^$\n]+?\$)/g);
  return bits.map((bit, i) => {
    if (bit.startsWith("**") && bit.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {bit.slice(2, -2)}
        </strong>
      );
    }
    if (bit.startsWith("`") && bit.endsWith("`")) {
      return (
        <code key={i} className="rounded-md bg-code px-1 py-0.5">
          {bit.slice(1, -1)}
        </code>
      );
    }
    const wrapped = bit.match(/^\\\(([\s\S]+)\\\)$/);
    const dollar = bit.match(/^\$([^$\n]+)\$$/);
    const tex = wrapped?.[1] ?? (dollar && looksLikeMath(dollar[1]) ? dollar[1] : "");
    if (tex) {
      const html = renderTex(tex, false);
      if (html) return <span key={i} className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    const link = bit.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          {link[1]}
        </a>
      );
    }
    return <span key={i}>{bit}</span>;
  });
}

function Lines({ text }: { text: string }) {
  const lines = text.replace(/\n{3,}/g, "\n\n").split("\n");
  const out: ReactNode[] = [];
  let list: string[] = [];
  let ordered = false;

  const flush = (key: string) => {
    if (!list.length) return;
    const items = list;
    list = [];
    const Tag = ordered ? "ol" : "ul";
    out.push(
      <Tag key={key} className={ordered ? "list-decimal pl-5" : "list-disc pl-5"}>
        {items.map((item, i) => (
          <li key={i} className="my-0.5">
            {inline(item)}
          </li>
        ))}
      </Tag>,
    );
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^\s*[-*]\s+(.*)/);
    const num = line.match(/^\s*\d+\.\s+(.*)/);
    if (bullet || num) {
      const nextOrdered = Boolean(num);
      if (list.length && nextOrdered !== ordered) flush(`pre-${i}`);
      ordered = nextOrdered;
      list.push((bullet ?? num)![1]);
      return;
    }
    flush(`l-${i}`);
    if (!line.trim()) {
      out.push(<div key={`s-${i}`} className="h-2" />);
      return;
    }
    if (line.startsWith("### ")) {
      out.push(
        <h3 key={i} className="mt-3 text-base font-semibold">
          {inline(line.slice(4))}
        </h3>,
      );
      return;
    }
    if (line.startsWith("## ")) {
      out.push(
        <h2 key={i} className="mt-3 text-lg font-semibold">
          {inline(line.slice(3))}
        </h2>,
      );
      return;
    }
    out.push(
      <p key={i} className="text-pretty">
        {inline(line)}
      </p>,
    );
  });
  flush("end");
  return <>{out}</>;
}

function TextBlock({ text }: { text: string }) {
  const parts = text.split(/(\\\[[\s\S]+?\\\]|\$\$[\s\S]+?\$\$)/g);
  return (
    <div className="space-y-1">
      {parts.map((part, i) => {
        const display = part.match(/^\\\[([\s\S]+)\\\]$/) ?? part.match(/^\$\$([\s\S]+)\$\$$/);
        if (display) {
          const html = renderTex(display[1], true);
          if (!html) return <p key={i}>{part}</p>;
          return <div key={i} className="math-display" dangerouslySetInnerHTML={{ __html: html }} />;
        }
        if (!part.trim()) return null;
        return <Lines key={i} text={part} />;
      })}
    </div>
  );
}

function previewDoc(lang: string, code: string): string | null {
  const kind = lang.trim().toLowerCase();
  const body = code.replace(/\n$/, "").trim();
  if (body.length < 40) return null;
  const htmlish = /html|svg/.test(kind) || /<!doctype|<html[\s>]|<svg[\s>]/i.test(body);
  if (!htmlish) return null;
  if (/<!doctype|<html[\s>]|<svg[\s>]/i.test(body)) return body;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${body}</body></html>`;
}

export const useProduct = create<{ html: string | null }>(() => ({ html: null }));

export function openProduct(html: string) {
  useProduct.setState({ html });
}

function pdfAsHtml(source: string) {
  const doc = parsePdfDoc(source);
  const esc = (value: string) =>
    value.replaceAll("&", "&" + "amp;").replaceAll("<", "&" + "lt;").replaceAll(">", "&" + "gt;");
  const inner = doc.blocks
    .map((block) => {
      if (block.kind === "table") {
        const rows = block.rows
          .map(
            (row, index) =>
              `<tr>${row
                .map((cell) => `<${index === 0 ? "th" : "td"}>${esc(cell)}</${index === 0 ? "th" : "td"}>`)
                .join("")}</tr>`,
          )
          .join("");
        return `<table>${rows}</table>`;
      }
      return block.kind === "h1"
        ? `<h1>${esc(block.text)}</h1>`
        : block.kind === "h2"
          ? `<h2>${esc(block.text)}</h2>`
          : block.kind === "li"
            ? `<li>${esc(block.text)}</li>`
            : block.kind === "quote"
              ? `<blockquote>${esc(block.text)}</blockquote>`
              : `<p>${esc(block.text)}</p>`;
    })
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Georgia,serif;margin:0;background:#fff;color:#161616;padding:32px}h1{font-size:28px;color:#2457d6;margin:0 0 12px}h2{font-size:18px;margin:22px 0 6px}p{line-height:1.5;margin:0 0 10px}</style></head><body>${inner}</body></html>`;
}

export function ProductPage() {
  const html = useProduct((s) => s.html);
  if (!html) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <div className="safe-top flex items-center gap-2 border-b border-line px-3 py-2">
        <button type="button" className="text-sm text-muted" onClick={() => useProduct.setState({ html: null })}>
          Back
        </button>
        <h1 className="text-base font-semibold">Preview</h1>
      </div>
      <iframe title="Product preview" sandbox="allow-scripts" srcDoc={html} className="min-h-0 w-full flex-1 bg-white" />
    </div>
  );
}

function Fence({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const previewOn = useMash((s) => s.plugins.preview);
  const pdf = /^pdf\b/i.test(lang.trim());
  const doc = pdf ? null : previewDoc(lang, code);
  const fileName = `${(parsePdfDoc(code).title || "mash").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mash"}.pdf`;
  const product = doc || (pdf ? pdfAsHtml(code) : null);

  return (
    <div className="my-2 overflow-hidden rounded-xl bg-code">
      <pre className="max-h-72 overflow-auto px-3 py-3 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
      <div className="flex items-center justify-end gap-4 border-t border-line px-3 py-2 text-sm">
        {pdf ? (
          <button type="button" className="text-fg" onClick={() => downloadPdf(code, fileName)}>
            Download PDF
          </button>
        ) : null}
        {pdf ? (
          <button type="button" className="text-fg" onClick={() => downloadDoc(code, fileName.replace(/\.pdf$/, ".doc"))}>
            Download DOC
          </button>
        ) : null}
        {product && previewOn ? (
          <button type="button" className="text-fg" onClick={() => openProduct(product)}>
            Preview
          </button>
        ) : null}
        <button
          type="button"
          className="text-fg"
          onClick={() => {
            void navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

const freshIds = new Set<string>();

export function markFresh(id: string) {
  freshIds.add(id);
}

function paintLines(host: HTMLDivElement, shown: string) {
  const lines = shown.split("\n");
  while (host.childElementCount < lines.length) {
    const line = document.createElement("p");
    line.className = "stream-fall min-h-[1.25em]";
    host.appendChild(line);
  }
  while (host.childElementCount > lines.length) {
    host.lastElementChild?.remove();
  }
  lines.forEach((line, index) => {
    const el = host.children[index];
    if (el.textContent !== line) el.textContent = line;
  });
  const scroller = host.closest(".overflow-y-auto");
  if (scroller instanceof HTMLElement) scroller.scrollTop = scroller.scrollHeight;
}

export function LiveAnswer({ id, text, live }: { id: string; text: string; live: boolean }) {
  const reduce = useRef(false);
  if (typeof window !== "undefined" && !reduce.current) {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  const math = /\\\[|\\\(|\$\$/.test(text);
  const animate = !reduce.current && !math && (live || freshIds.has(id));
  const [settled, setSettled] = useState(!animate);
  const host = useRef<HTMLDivElement>(null);
  const goal = useRef(text);
  const liveRef = useRef(live);
  goal.current = text;
  liveRef.current = live;

  useEffect(() => {
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

  if (settled) return <Rich text={text} />;
  return <div ref={host} className="space-y-1 text-base leading-relaxed whitespace-pre-wrap" />;
}

export function Rich({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-base leading-relaxed">
      {blocksOf(text).map((block, i) =>
        block.kind === "code" ? (
          <Fence key={i} lang={block.lang} code={block.code} />
        ) : (
          <TextBlock key={i} text={block.text} />
        ),
      )}
    </div>
  );
}
