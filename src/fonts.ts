import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import opentype from 'opentype.js';
import subsetFont from 'subset-font';

const require = createRequire(import.meta.url);

export type FontKey = 'sans400' | 'sans600' | 'mono400';

const SOURCES: Record<FontKey, { pkg: string; family: string; weight: number }> = {
  sans400: { pkg: '@fontsource/inter/files/inter-latin-400-normal', family: 'Inter', weight: 400 },
  sans600: { pkg: '@fontsource/inter/files/inter-latin-600-normal', family: 'Inter', weight: 600 },
  mono400: { pkg: '@fontsource/geist-mono/files/geist-mono-latin-400-normal', family: 'Geist Mono', weight: 400 },
};

const parsed = new Map<FontKey, opentype.Font>();
const woff2 = new Map<FontKey, Buffer>();

function font(key: FontKey): opentype.Font {
  let f = parsed.get(key);
  if (!f) {
    const buf = readFileSync(require.resolve(`${SOURCES[key].pkg}.woff`));
    f = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    parsed.set(key, f);
  }
  return f;
}

/**
 * Width in px of `text` set in the given font, size and letter-spacing.
 * Advances and pair kerning are summed by hand: opentype.js cannot run every
 * substitution lookup in Inter, and none of them change the width of this text.
 */
export function measure(text: string, key: FontKey, size: number, tracking = 0): number {
  const f = font(key);
  const glyphs = [...text].map((ch) => f.charToGlyph(ch));
  let units = 0;
  glyphs.forEach((g, i) => {
    units += g.advanceWidth ?? 0;
    if (i > 0) units += f.getKerningValue(glyphs[i - 1], g);
  });
  return (units * size) / f.unitsPerEm + tracking * glyphs.length;
}

/** Cumulative widths after each character, used by the typing animation. */
export function charStops(text: string, key: FontKey, size: number, tracking = 0): number[] {
  const chars = [...text];
  return chars.map((_, i) => measure(chars.slice(0, i + 1).join(''), key, size, tracking));
}

/** Greedy word wrap to a pixel width. */
export function wrap(text: string, maxWidth: number, key: FontKey, size: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && measure(candidate, key, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Wrap, then narrow the measure as far as the line count allows, so no line ends with a lone word. */
export function balance(text: string, maxWidth: number, key: FontKey, size: number): string[] {
  const target = wrap(text, maxWidth, key, size).length;
  if (target < 2) return wrap(text, maxWidth, key, size);
  let lo = maxWidth / target;
  let hi = maxWidth;
  while (hi - lo > 2) {
    const mid = (lo + hi) / 2;
    if (wrap(text, mid, key, size).length > target) lo = mid;
    else hi = mid;
  }
  return wrap(text, hi, key, size);
}

/** Wrap and clamp to `maxLines`, ending the last kept line with an ellipsis when text was cut. */
export function clamp(text: string, maxWidth: number, key: FontKey, size: number, maxLines: number): string[] {
  const lines = wrap(text, maxWidth, key, size);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last && measure(`${last}…`, key, size) > maxWidth) last = last.slice(0, -1).trimEnd();
  kept[maxLines - 1] = `${last}…`;
  return kept;
}

/** @font-face rule holding only the glyphs in `chars`, as an inline woff2. */
export async function fontFace(key: FontKey, chars: Set<string>): Promise<string> {
  let source = woff2.get(key);
  if (!source) {
    source = readFileSync(require.resolve(`${SOURCES[key].pkg}.woff2`));
    woff2.set(key, source);
  }
  const text = [...chars].sort().join('');
  const subset = await subsetFont(source, text, { targetFormat: 'woff2' });
  const { family, weight } = SOURCES[key];
  return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${subset.toString('base64')}) format('woff2')}`;
}
