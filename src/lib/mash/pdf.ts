type Block =
  | { kind: "h1" | "h2" | "p" | "li" | "quote"; text: string }
  | { kind: "table"; rows: string[][] };

type Theme = {
  bar: string;
  accent: string;
  ink: string;
  muted: string;
  paper: string;
  soft: string;
};

const THEMES: Record<string, Theme> = {
  navy: { bar: "0.08 0.16 0.38", accent: "0.16 0.33 0.75", ink: "0.10 0.12 0.16", muted: "0.35 0.38 0.45", paper: "0.97 0.97 0.98", soft: "0.91 0.94 0.98" },
  gold: { bar: "0.22 0.14 0.05", accent: "0.62 0.46 0.16", ink: "0.16 0.12 0.08", muted: "0.42 0.34 0.24", paper: "0.99 0.97 0.93", soft: "0.95 0.90 0.80" },
  forest: { bar: "0.08 0.24 0.14", accent: "0.13 0.42 0.26", ink: "0.10 0.14 0.12", muted: "0.32 0.40 0.34", paper: "0.96 0.98 0.96", soft: "0.88 0.94 0.89" },
  ink: { bar: "0.09 0.09 0.10", accent: "0.18 0.18 0.20", ink: "0.10 0.10 0.12", muted: "0.40 0.40 0.44", paper: "0.98 0.98 0.98", soft: "0.93 0.93 0.94" },
  rose: { bar: "0.42 0.12 0.22", accent: "0.70 0.24 0.36", ink: "0.18 0.10 0.12", muted: "0.45 0.32 0.36", paper: "0.99 0.96 0.97", soft: "0.97 0.90 0.92" },
  slate: { bar: "0.16 0.22 0.30", accent: "0.28 0.42 0.56", ink: "0.12 0.15 0.18", muted: "0.38 0.42 0.48", paper: "0.96 0.97 0.98", soft: "0.89 0.92 0.95" },
};

function ascii(value: string) {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/[\\()]/g, (ch) => `\\${ch}`);
}

function cells(line: string) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function parsePdfDoc(source: string) {
  const blocks: Block[] = [];
  let title = "Document";
  let theme = "navy";
  let kicker = "";
  let buf: string[] = [];
  const flush = () => {
    const text = buf.join(" ").replace(/\s+/g, " ").trim();
    buf = [];
    if (text) blocks.push({ kind: "p", text });
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
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const row = cells(lines[i].trim());
        if (!row.every((cell) => /^:?-+:?$/.test(cell))) rows.push(row);
        i += 1;
      }
      i -= 1;
      if (rows.length) blocks.push({ kind: "table", rows });
      continue;
    }
    if (line.startsWith("# ")) {
      flush();
      title = line.slice(2).trim();
      blocks.push({ kind: "h1", text: title });
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ kind: "h2", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      flush();
      blocks.push({ kind: "li", text: line.slice(2).trim() });
      continue;
    }
    if (line.startsWith("> ")) {
      flush();
      blocks.push({ kind: "quote", text: line.slice(2).trim() });
      continue;
    }
    buf.push(line);
  }
  flush();
  if (!blocks.some((block) => block.kind === "h1")) blocks.unshift({ kind: "h1", text: title });
  return { title, blocks, theme, kicker };
}

function wrap(text: string, width: number) {
  const words = ascii(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width) {
      if (line) lines.push(line);
      line = word.slice(0, width);
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function paint(theme: Theme, blocks: Block[], kicker: string) {
  const pages: string[] = [];
  let cmds: string[] = [];
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
      "BT /F1 9 Tf 470 812 Td (mash) Tj ET",
    ];
    y = 750;
  };
  const close = () => {
    cmds.push(
      `${theme.muted} rg`,
      `BT /F1 9 Tf 36 32 Td (Page ${page}) Tj ET`,
    );
    pages.push(cmds.join("\n"));
  };
  const need = (height: number) => {
    if (y - height < 58) {
      close();
      open();
    }
  };
  const write = (font: string, size: number, x: number, color: string, line: string) => {
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
        need(rowH + 2);
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

export function buildStyledPdf(source: string) {
  const { blocks, theme, kicker } = parsePdfDoc(source);
  const contents = paint(THEMES[theme] ?? THEMES.navy, blocks, kicker);
  const objects: string[] = [];
  const pageIds: number[] = [];
  let id = 3;
  const contentIds: number[] = [];
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
    objects.push(
      `${id} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentIds[i]} 0 R /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> >>\nendobj\n`,
    );
    id += 1;
  }
  const kids = pageIds.map((page) => `${page} 0 R`).join(" ");
  const head = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    `2 0 obj\n<< /Type /Pages /Count ${pageIds.length} /Kids [${kids}] >>\nendobj\n`,
  ];
  const all = [...head, ...objects];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of all) {
    offsets.push(body.length);
    body += obj;
  }
  const xref = body.length;
  let table = `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i += 1) {
    table += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `${table}trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new TextEncoder().encode(body);
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadPdf(source: string, name = "mash.pdf") {
  saveBlob(new Blob([buildStyledPdf(source)], { type: "application/pdf" }), name);
}

export function downloadDoc(source: string, name = "mash.doc") {
  const { blocks } = parsePdfDoc(source);
  const safe = (value: string) => value.replace(/&/g, "&" + "amp;").replace(/</g, "&" + "lt;").replace(/>/g, "&" + "gt;");
  const body = blocks
    .map((block) => {
      if (block.kind === "table") {
        const rows = block.rows
          .map(
            (row, index) =>
              `<tr>${row.map((cell) => `<${index === 0 ? "th" : "td"}>${safe(cell)}</${index === 0 ? "th" : "td"}>`).join("")}</tr>`,
          )
          .join("");
        return `<table>${rows}</table>`;
      }
      const text = safe(block.text);
      if (block.kind === "h1") return `<h1>${text}</h1>`;
      if (block.kind === "h2") return `<h2>${text}</h2>`;
      if (block.kind === "li") return `<li>${text}</li>`;
      if (block.kind === "quote") return `<blockquote>${text}</blockquote>`;
      return `<p>${text}</p>`;
    })
    .join("");
  const html = `<html><head><meta charset="utf-8"></head><body style="font-family:Calibri,sans-serif;color:#111">${body}</body></html>`;
  saveBlob(new Blob([html], { type: "application/msword" }), name);
}
