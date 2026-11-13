import { readFileSync } from 'node:fs';
import { tokens, type Theme, type ThemeName } from './tokens.ts';
import { fontFace, measure, type FontKey } from './fonts.ts';

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const n = (v: number) => String(Math.round(v * 100) / 100);

export type TextStyle = {
  size: number;
  weight?: 400 | 600;
  mono?: boolean;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
  tracking?: number;
  cls?: string;
  delay?: number;
  opacity?: number;
};
export type Span = { t: string; fill?: string; weight?: 400 | 600; mono?: boolean };

export const fontKey = (o: { mono?: boolean; weight?: number }): FontKey =>
  o.mono ? 'mono400' : o.weight === 600 ? 'sans600' : 'sans400';

/** Splits `rgba(r,g,b,a)` so it can be used on gradient stops, which need a separate opacity. */
function stop(offset: number, color: string): string {
  const m = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
  return m
    ? `<stop offset="${offset}" stop-color="rgb(${m[1]},${m[2]},${m[3]})" stop-opacity="${m[4]}"/>`
    : `<stop offset="${offset}" stop-color="${color}"/>`;
}

export class Card {
  readonly t: Theme;
  private defs = new Map<string, string>();
  private body: string[] = [];
  private css: string[] = [];
  private used: Record<FontKey, Set<string>> = { sans400: new Set(), sans600: new Set(), mono400: new Set() };
  private seq = 0;

  constructor(
    readonly width: number,
    readonly height: number,
    readonly theme: ThemeName,
    /** Accessible name, also used as the README alt text. */
    readonly label: string,
  ) {
    this.t = tokens.theme[theme];
  }

  uid(prefix: string) {
    return `${prefix}${this.seq++}`;
  }

  add(...markup: string[]) {
    this.body.push(...markup);
    return this;
  }

  def(id: string, markup: string) {
    if (!this.defs.has(id)) this.defs.set(id, markup);
  }

  style(rule: string) {
    if (!this.css.includes(rule)) this.css.push(rule);
  }

  /** Card surface: the bordered rounded rectangle every framed card sits on. */
  frame() {
    const i = tokens.card.inset;
    return this.add(
      `<rect x="${i + 0.5}" y="${i + 0.5}" width="${this.width - 2 * i - 1}" height="${this.height - 2 * i - 1}" rx="${tokens.radius.card}" fill="${this.t.bg}" stroke="${this.t.border}"/>`,
    );
  }

  /** Text markup. Registers the glyphs so the embedded font subset contains them. */
  text(x: number, y: number, content: string | Span[], o: TextStyle): string {
    const spans: Span[] = typeof content === 'string' ? [{ t: content }] : content;
    for (const s of spans) {
      const key = fontKey({ mono: s.mono ?? o.mono, weight: s.weight ?? o.weight });
      for (const ch of s.t) this.used[key].add(ch);
    }
    const attrs = [
      `x="${n(x)}"`,
      `y="${n(y)}"`,
      `font-size="${o.size}"`,
      o.mono ? 'class="m' + (o.cls ? ` ${o.cls}` : '') + '"' : o.cls ? `class="${o.cls}"` : '',
      o.weight === 600 ? 'font-weight="600"' : '',
      o.anchor && o.anchor !== 'start' ? `text-anchor="${o.anchor}"` : '',
      o.tracking ? `letter-spacing="${o.tracking}"` : '',
      `fill="${o.fill ?? this.t.text}"`,
      o.opacity !== undefined ? `opacity="${o.opacity}"` : '',
      o.delay !== undefined ? `style="animation-delay:${n(o.delay)}s"` : '',
    ].filter(Boolean);
    const inner =
      spans.length === 1 && !spans[0].fill && !spans[0].weight && spans[0].mono === undefined
        ? esc(spans[0].t)
        : spans
            .map((s) => {
              const a = [
                s.fill ? `fill="${s.fill}"` : '',
                s.weight === 600 ? 'font-weight="600"' : '',
                s.mono ? 'class="m"' : '',
              ].filter(Boolean);
              return `<tspan${a.length ? ' ' + a.join(' ') : ''}>${esc(s.t)}</tspan>`;
            })
            .join('');
    return `<text ${attrs.join(' ')} xml:space="preserve">${inner}</text>`;
  }

  put(x: number, y: number, content: string | Span[], o: TextStyle) {
    return this.add(this.text(x, y, content, o));
  }

  /** Several lines of the same style. Returns the y of the line after the last one. */
  lines(x: number, y: number, rows: string[], lineHeight: number, o: TextStyle): number {
    rows.forEach((row, i) => this.put(x, y + i * lineHeight, row, o));
    return y + rows.length * lineHeight;
  }

  /**
   * Blurred colour blobs clipped to the card. Glass panels sit on top of this:
   * an SVG shown through <img> cannot use backdrop-filter, so the light is blurred
   * once here and the translucent panels let it through.
   */
  lightField(blobs: { cx: number; cy: number; r: number; color: string; opacity: number }[], blur = 46) {
    const i = tokens.card.inset;
    this.def(
      'clip',
      `<clipPath id="clip"><rect x="${i + 1}" y="${i + 1}" width="${this.width - 2 * i - 2}" height="${this.height - 2 * i - 2}" rx="${tokens.radius.card - 1}"/></clipPath>`,
    );
    this.def(
      `blur${blur}`,
      `<filter id="blur${blur}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${blur}"/></filter>`,
    );
    const circles = blobs
      .map((b) => `<circle cx="${b.cx}" cy="${b.cy}" r="${b.r}" fill="${b.color}" opacity="${n(b.opacity)}"/>`)
      .join('');
    return this.add(`<g clip-path="url(#clip)"><g filter="url(#blur${blur})">${circles}</g></g>`);
  }

  /**
   * A picture from the repository, inlined as a data URI (an SVG shown through <img> cannot load files),
   * clipped to a rounded rectangle and outlined so light and dark pictures both keep an edge.
   */
  image(file: string, x: number, y: number, w: number, h: number, r: number) {
    const ext = file.split('.').pop()!.toLowerCase();
    const type = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : ext === 'jpg' ? 'image/jpeg' : 'image/webp';
    const b64 = readFileSync(new URL(`../${file}`, import.meta.url)).toString('base64');
    const id = this.uid('ic');
    this.def(id, `<clipPath id="${id}"><rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${r}"/></clipPath>`);
    return this.add(
      `<image x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" clip-path="url(#${id})" preserveAspectRatio="xMidYMid slice" href="data:${type};base64,${b64}"/>`,
      `<rect x="${n(x + 0.5)}" y="${n(y + 0.5)}" width="${n(w - 1)}" height="${n(h - 1)}" rx="${n(r - 0.5)}" fill="none" stroke="${this.t.border}"/>`,
    );
  }

  /** A logo or icon inlined at its own aspect ratio, fitted inside the box. */
  logo(file: string, x: number, y: number, w: number, h: number) {
    const b64 = readFileSync(new URL(`../${file}`, import.meta.url)).toString('base64');
    return this.add(`<image x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" preserveAspectRatio="xMidYMid meet" href="data:image/svg+xml;base64,${b64}"/>`);
  }

  /** Liquid Glass surface: soft shadow, translucent fill, and an edge that is brightest at the top. */
  glass(x: number, y: number, w: number, h: number, r: number, o: { cls?: string; delay?: number; shadow?: boolean } = {}) {
    const t = this.t;
    this.def('gf', `<linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">${stop(0, t.glassTop)}${stop(1, t.glassBottom)}</linearGradient>`);
    this.def('ge', `<linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">${stop(0, t.edgeTop)}${stop(0.4, t.edgeMid)}${stop(1, t.edgeBottom)}</linearGradient>`);
    const parts: string[] = [];
    if (o.shadow !== false) {
      this.def('gs', `<filter id="gs" x="-40%" y="-40%" width="180%" height="200%"><feGaussianBlur stdDeviation="${n(Math.min(16, h / 5))}"/></filter>`);
      parts.push(`<rect x="${n(x + 6)}" y="${n(y + Math.min(14, h / 3))}" width="${n(w - 12)}" height="${n(h - 4)}" rx="${r}" fill="${t.shadow}" filter="url(#gs)"/>`);
    }
    parts.push(
      `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${r}" fill="url(#gf)"/>`,
      `<rect x="${n(x + 0.5)}" y="${n(y + 0.5)}" width="${n(w - 1)}" height="${n(h - 1)}" rx="${n(r - 0.5)}" fill="none" stroke="url(#ge)"/>`,
    );
    const a = [o.cls ? `class="${o.cls}"` : '', o.delay !== undefined ? `style="animation-delay:${n(o.delay)}s"` : ''].filter(Boolean);
    return `<g${a.length ? ' ' + a.join(' ') : ''}>${parts.join('')}</g>`;
  }

  /** Glass pill with one line of mono text. Returns its width so callers can place the next one. */
  pill(x: number, y: number, content: string | Span[], o: { size?: number; height?: number; cls?: string; delay?: number; dot?: string } = {}) {
    const size = o.size ?? 12;
    const h = o.height ?? 28;
    const plain = typeof content === 'string' ? content : content.map((s) => s.t).join('');
    const dot = o.dot ? 14 : 0;
    const w = Math.ceil(measure(plain, 'mono400', size)) + 26 + dot;
    const a = [o.cls ? `class="${o.cls}"` : '', o.delay !== undefined ? `style="animation-delay:${n(o.delay)}s"` : ''].filter(Boolean);
    this.add(
      `<g${a.length ? ' ' + a.join(' ') : ''}>`,
      this.glass(x, y, w, h, h / 2, { shadow: false }),
      o.dot ? `<circle cx="${n(x + 16)}" cy="${n(y + h / 2)}" r="3.5" fill="${o.dot}"/>` : '',
      this.text(x + 13 + dot, y + h / 2 + size * 0.34, content, { size, mono: true, fill: this.t.text }),
      '</g>',
    );
    return w;
  }

  async render(): Promise<string> {
    const faces: string[] = [];
    for (const key of ['sans400', 'sans600', 'mono400'] as FontKey[]) {
      if (this.used[key].size) faces.push(await fontFace(key, this.used[key]));
    }
    const { sans, mono } = tokens.font;
    const style = [
      ...faces,
      `text{font-family:'${sans}',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif}`,
      `.m{font-family:'${mono}',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}`,
      ...this.css,
      this.css.length ? '@media (prefers-reduced-motion:reduce){*{animation:none!important}}' : '',
    ]
      .filter(Boolean)
      .join('\n');
    const defs = this.defs.size ? `<defs>${[...this.defs.values()].join('')}</defs>` : '';
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" role="img" aria-label="${esc(this.label)}">` +
      `<title>${esc(this.label)}</title><style>${style}</style>${defs}${this.body.join('')}</svg>\n`
    );
  }
}

/** Entrance animations. Only the hero uses them: one orchestrated moment per page. */
export function motionCss(card: Card) {
  const e = tokens.motion.ease;
  card.style(`.rise{animation:rise ${tokens.motion.rise}s ${e} both}`);
  card.style('@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}');
  card.style(`.fade{animation:fade ${tokens.motion.fade}s ease both}`);
  card.style('@keyframes fade{from{opacity:0}to{opacity:1}}');
  card.style(`.mat{transform-box:fill-box;transform-origin:center;animation:mat .9s ${e} both}`);
  card.style('@keyframes mat{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}');
}
