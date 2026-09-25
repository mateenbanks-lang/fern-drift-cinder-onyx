type Tok =
  | { t: "n"; v: number }
  | { t: "id"; v: string }
  | { t: "op"; v: string }
  | { t: "lp" }
  | { t: "rp" }
  | { t: "comma" };

function tokenize(source: string): Tok[] {
  const out: Tok[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch === " " || ch === "\t") {
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
      out.push({ t: "op", v: ch });
      i += 1;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i + 1;
      while (j < source.length && /[0-9.]/.test(source[j])) j += 1;
      const v = Number(source.slice(i, j));
      if (!Number.isFinite(v)) throw new Error("bad number");
      out.push({ t: "n", v });
      i = j;
      continue;
    }
    if (/[a-z]/i.test(ch)) {
      let j = i + 1;
      while (j < source.length && /[a-z]/i.test(source[j])) j += 1;
      out.push({ t: "id", v: source.slice(i, j).toLowerCase() });
      i = j;
      continue;
    }
    throw new Error("bad");
  }
  return out;
}

function evaluate(source: string) {
  const tokens = tokenize(source);
  let i = 0;
  const peek = () => tokens[i];
  const eat = () => tokens[i++];

  function expr(): number {
    return add();
  }
  function add(): number {
    let v = mul();
    while (peek()?.t === "op" && (peek() as { v: string }).v === "+" || peek()?.t === "op" && (peek() as { v: string }).v === "-") {
      const op = (eat() as { v: string }).v;
      const r = mul();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }
  function mul(): number {
    let v = pow();
    while (peek()?.t === "op" && ((peek() as { v: string }).v === "*" || (peek() as { v: string }).v === "/")) {
      const op = (eat() as { v: string }).v;
      const r = pow();
      v = op === "*" ? v * r : v / r;
    }
    return v;
  }
  function pow(): number {
    const v = unary();
    if (peek()?.t === "op" && (peek() as { v: string }).v === "^") {
      eat();
      return v ** pow();
    }
    return v;
  }
  function unary(): number {
    if (peek()?.t === "op" && ((peek() as { v: string }).v === "-" || (peek() as { v: string }).v === "+")) {
      const op = (eat() as { v: string }).v;
      const v = unary();
      return op === "-" ? -v : v;
    }
    return primary();
  }
  function primary(): number {
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

function call(name: string, args: number[]) {
  const [a, b] = args;
  const deg = (n: number) => (n * Math.PI) / 180;
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

function factorial(n: number) {
  if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error("fact");
  let v = 1;
  for (let i = 2; i <= n; i += 1) v *= i;
  return v;
}

function ncr(n: number, k: number) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) throw new Error("ncr");
  return npr(n, k) / factorial(k);
}

function npr(n: number, k: number) {
  if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) throw new Error("npr");
  let v = 1;
  for (let i = 0; i < k; i += 1) v *= n - i;
  return v;
}

function format(n: number) {
  if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
  return String(Number(n.toPrecision(8)));
}

function calcAnswer(input: string) {
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

function numberAfter(text: string, label: RegExp) {
  const hit = text.match(label);
  if (!hit) return null;
  const n = Number(hit[1]);
  return Number.isFinite(n) ? n : null;
}

function quantAnswer(input: string) {
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
    `Full Kelly would risk ${format(kelly * 100)}% of the bank. Use a quarter of that, and only if the win rate is measured, not guessed.`,
  ].join(" ");
}

export function answerNow(input: string) {
  return quantAnswer(input) ?? calcAnswer(input);
}
