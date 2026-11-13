import { Card, motionCss, n, type Span } from '../svg.ts';
import { balance, charStops } from '../fonts.ts';
import { PAD, W, type ThemeName } from '../tokens.ts';
import { alt, formatDate, profile, type Lang } from '../content.ts';
import type { GithubData } from '../data.ts';

const STEP = 0.085; // seconds per typed character

/** A line that types itself in, one character at a time, followed by a caret. */
function typedLine(card: Card, x: number, y: number, text: string, size: number, tracking: number, start: number, last: boolean) {
  const chars = [...text];
  const stops = charStops(text, 'sans600', size, tracking);
  const end = start + chars.length * STEP;
  const spans = chars
    .map((ch, i) => `<tspan class="ch" style="animation-delay:${n(start + (i + 1) * STEP)}s">${ch}</tspan>`)
    .join('');
  for (const ch of chars) card.text(0, 0, ch, { size, weight: 600 }); // registers glyphs only
  card.add(
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="600" letter-spacing="${tracking}" fill="${card.t.text}">${spans}</text>`,
  );

  const id = card.uid('caret');
  const frames = [0, ...stops]
    .map((s, i) => `${n((i / chars.length) * 100)}%{transform:translateX(${n(s)}px)}`)
    .join('');
  card.style(`@keyframes ${id}{${frames}}`);
  const move = `${id} ${n(chars.length * STEP)}s steps(1,end) ${n(start)}s both`;
  const show = `on .01s linear ${n(start)}s both`;
  const after = last ? `blink 1.1s steps(1,end) ${n(end)}s infinite` : `off .01s linear ${n(end)}s both`;
  card.add(
    `<rect x="${x + 4}" y="${n(y - size * 0.76)}" width="4" height="${n(size * 0.84)}" rx="1" fill="${card.t.accent}" opacity="0" style="animation:${show},${move},${after}"/>`,
  );
  return end;
}

/** Colours one JSON value: strings in the main text colour, numbers in the accent, punctuation muted. */
function jsonValue(card: Card, value: string): Span[] {
  return value
    .split(/("[^"]*")/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('"')
        ? { t: part, fill: card.t.text }
        : /^\d+$/.test(part.trim())
          ? { t: part, fill: card.t.accent }
          : { t: part, fill: card.t.text3 },
    );
}

export function hero(lang: Lang, theme: ThemeName, data: GithubData): Card {
  const H = 336;
  const card = new Card(W, H, theme, alt.hero[lang]);
  const t = card.t;
  motionCss(card);
  card.style('.ch{animation:on .01s linear both}');
  card.style('@keyframes on{from{opacity:0}to{opacity:1}}');
  card.style('@keyframes off{from{opacity:1}to{opacity:0}}');
  card.style('@keyframes blink{0%{opacity:1}50%{opacity:0}}');

  card.frame();
  const g = t.glowStrength;
  card.lightField([
    { cx: 716, cy: 54, r: 210, color: t.glowA, opacity: g },
    { cx: 880, cy: 312, r: 170, color: t.glowB, opacity: g * 0.6 },
    { cx: 520, cy: 356, r: 120, color: t.glowA, opacity: g * 0.35 },
  ]);

  // Left column: where, who, what.
  card.pill(PAD, 38, profile.location, { cls: 'fade', delay: 0.05 });
  const [first, second] = profile.name;
  const afterFirst = typedLine(card, PAD, 138, first, 58, -2.2, 0.3, false);
  const afterName = typedLine(card, PAD, 198, second, 58, -2.2, afterFirst + 0.12, true);

  card.put(PAD, 240, [{ t: `${profile.role[lang]} · `, fill: t.text2 }, { t: profile.company, fill: t.accent }], {
    size: 16,
    cls: 'rise',
    delay: afterName + 0.1,
  });
  const panelX = 500;
  const tagline = balance(profile.tagline[lang], panelX - PAD - 28, 'sans400', 17);
  tagline.forEach((line, i) =>
    card.put(PAD, 274 + i * 26, line, { size: 17, fill: t.text2, cls: 'rise', delay: afterName + 0.22 + i * 0.06 }),
  );

  // Right column: a floating glass panel showing the developer as an API response.
  const px = panelX;
  const py = 48;
  const pw = W - PAD - panelX;
  const ph = 232;
  const base = 0.55;
  card.add(card.glass(px, py, pw, ph, 18, { cls: 'mat', delay: base }));
  const cx = px + 22;
  card.put(cx, py + 33, [{ t: 'GET ', fill: t.accent }, { t: profile.api.path, fill: t.text }], {
    size: 12.5,
    mono: true,
    cls: 'fade',
    delay: base + 0.25,
  });
  const fields = profile.api.fields[lang];
  const done = base + 0.5 + (fields.length + 2) * 0.11;
  card.add(
    `<g class="fade" style="animation-delay:${n(done)}s"><circle cx="${px + pw - 76}" cy="${py + 29}" r="3.5" fill="${t.ok}"/>`,
    card.text(px + pw - 22, py + 33, '200 OK', { size: 12.5, mono: true, fill: t.ok, anchor: 'end' }),
    '</g>',
  );
  card.add(`<rect x="${px + 1}" y="${py + 50}" width="${pw - 2}" height="1" fill="${t.hairline}" class="fade" style="animation-delay:${n(base + 0.25)}s"/>`);

  const rows: Span[][] = [
    [{ t: '{', fill: t.text3 }],
    ...fields.map(([key, value], i): Span[] => [
      { t: `  "${key}"`, fill: t.text2 },
      { t: ': ', fill: t.text3 },
      ...jsonValue(card, value),
      ...(i < fields.length - 1 ? [{ t: ',', fill: t.text3 }] : []),
    ]),
    [{ t: '}', fill: t.text3 }],
  ];
  rows.forEach((spans, i) =>
    card.put(cx, py + 82 + i * 23, spans, { size: 12, mono: true, cls: 'rise', delay: base + 0.5 + i * 0.11 }),
  );

  const { publicRepos, privateRepos } = data.user;
  const updated = lang === 'en' ? `updated ${formatDate(data.fetchedAt, lang)}` : `atualizado em ${formatDate(data.fetchedAt, lang)}`;
  const repos =
    privateRepos != null
      ? lang === 'en'
        ? `${publicRepos + privateRepos} repositories, ${privateRepos} private`
        : `${publicRepos + privateRepos} repositórios, ${privateRepos} privados`
      : lang === 'en'
        ? `${publicRepos} public repositories`
        : `${publicRepos} repositórios públicos`;
  const meta = `${repos} · ${updated}`;
  card.put(W - PAD, H - 26, meta, { size: 11, mono: true, fill: t.text3, anchor: 'end', cls: 'fade', delay: done + 0.1 });
  return card;
}
