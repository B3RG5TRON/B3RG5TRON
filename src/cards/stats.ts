import { Card, n } from '../svg.ts';
import { measure } from '../fonts.ts';
import { PAD, W, tokens, type ThemeName } from '../tokens.ts';
import { activity, alt, type Lang } from '../content.ts';
import type { Day, GithubData } from '../data.ts';

const fmt = (v: number, lang: Lang) => v.toLocaleString(lang === 'en' ? 'en-US' : 'pt-BR');
const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

/** Opacity of the accent for each contribution level, 1 to 4. Level 0 uses the track colour. */
const LEVEL = [0, 0.25, 0.45, 0.7, 1];

function levels(days: Day[]): (count: number) => number {
  const nonZero = days.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  if (!nonZero.length) return () => 0;
  const q = (p: number) => nonZero[Math.min(nonZero.length - 1, Math.floor(p * nonZero.length))];
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  return (c) => (c === 0 ? 0 : c <= q1 ? 1 : c <= q2 ? 2 : c <= q3 ? 3 : 4);
}

export function heatmapCard(lang: Lang, theme: ThemeName, data: GithubData): Card | null {
  const c = data.contributions;
  if (!c || !c.days.length) return null;
  const H = 262;
  const card = new Card(W, H, theme, `${alt.heatmap[lang]}: ${fmt(c.total, lang)}`);
  const t = card.t;
  card.frame();
  card.put(PAD, 62, activity.heatmapTitle[lang], { size: 22, weight: 600, tracking: -0.4 });
  card.put(W - PAD, 62, [{ t: fmt(c.total, lang), fill: t.text }, { t: ` ${activity.heatmapNote[lang]}`, fill: t.text3 }], {
    size: 12,
    mono: true,
    anchor: 'end',
  });

  const cell = 11.5;
  const pitch = (W - 2 * PAD - cell) / 52;
  const y0 = 112;
  const level = levels(c.days);
  const first = utc(c.days[0].date);
  const offset = first.getUTCDay();
  let lastMonth = -1;
  let lastLabelX = -100;
  const cells: string[] = [];
  c.days.forEach((d, i) => {
    const slot = i + offset;
    const col = Math.floor(slot / 7);
    const row = slot % 7;
    if (col > 52) return;
    const x = PAD + col * pitch;
    const y = y0 + row * pitch;
    const l = level(d.count);
    cells.push(
      l === 0
        ? `<rect x="${n(x)}" y="${n(y)}" width="${cell}" height="${cell}" rx="3" fill="${t.track}"/>`
        : `<rect x="${n(x)}" y="${n(y)}" width="${cell}" height="${cell}" rx="3" fill="${t.accent}" opacity="${LEVEL[l]}"/>`,
    );
    const month = utc(d.date).getUTCMonth();
    if (month !== lastMonth && row === 0 && x - lastLabelX > 34) {
      card.put(x, y0 - 10, activity.months[lang][month], { size: 10.5, mono: true, fill: t.text3 });
      lastLabelX = x;
      lastMonth = month;
    } else if (month !== lastMonth && row === 0) {
      lastMonth = month;
    }
  });
  card.add(cells.join(''));

  const ly = y0 + 7 * pitch + 14;
  const more = activity.more[lang];
  let x = W - PAD - measure(more, 'mono400', 10.5);
  card.put(x, ly + 9.5, more, { size: 10.5, mono: true, fill: t.text3 });
  for (let l = 4; l >= 0; l--) {
    x -= l === 4 ? 8 + cell : 3 + cell;
    card.add(
      l === 0
        ? `<rect x="${n(x)}" y="${n(ly)}" width="${cell}" height="${cell}" rx="3" fill="${t.track}"/>`
        : `<rect x="${n(x)}" y="${n(ly)}" width="${cell}" height="${cell}" rx="3" fill="${t.accent}" opacity="${LEVEL[l]}"/>`,
    );
  }
  card.put(x - 8, ly + 9.5, activity.less[lang], { size: 10.5, mono: true, fill: t.text3, anchor: 'end' });
  return card;
}

export function activityCard(lang: Lang, theme: ThemeName, data: GithubData): Card | null {
  const c = data.contributions;
  if (!c || !c.days.length) return null;
  const days = c.days;

  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++;
    else if (i === days.length - 1) continue; // today may still be empty
    else break;
  }
  const active = days.filter((d) => d.count > 0).length;
  const busiest = days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);

  const months: { key: string; month: number; total: number }[] = [];
  for (const d of days) {
    const key = d.date.slice(0, 7);
    const last = months[months.length - 1];
    if (last && last.key === key) last.total += d.count;
    else months.push({ key, month: utc(d.date).getUTCMonth(), total: d.count });
  }
  const shown = months.slice(-12);
  const max = Math.max(1, ...shown.map((m) => m.total));

  const H = 180;
  const card = new Card(W, H, theme, alt.activity[lang]);
  const t = card.t;
  card.frame();

  const bd = utc(busiest.date);
  const stats = [
    { label: activity.streak[lang], value: fmt(streak, lang), sub: streak === 1 ? activity.day[lang] : activity.days[lang] },
    { label: activity.activeDays[lang], value: fmt(active, lang), sub: activity.heatmapNote[lang] },
    {
      label: activity.busiest[lang],
      value: `${bd.getUTCDate()} ${activity.months[lang][bd.getUTCMonth()]}`,
      sub: `${fmt(busiest.count, lang)} ${activity.contributions[lang]}`,
    },
  ];
  stats.forEach((s, i) => {
    const x = PAD + i * 158;
    card.put(x, 56, s.label, { size: 11.5, mono: true, fill: t.text3 });
    card.put(x, 100, s.value, { size: 32, weight: 600, tracking: -1 });
    card.put(x, 126, s.sub, { size: 11.5, mono: true, fill: t.text2 });
  });

  const bx = 548;
  const bw = W - PAD - bx;
  const slot = bw / shown.length;
  const barW = Math.min(14, slot - 6);
  const base = 130;
  const maxH = 62;
  card.put(bx, 56, activity.perMonth[lang], { size: 11.5, mono: true, fill: t.text3 });
  shown.forEach((m, i) => {
    const h = Math.max(2, (m.total / max) * maxH);
    const x = bx + i * slot + (slot - barW) / 2;
    const peak = m.total === max;
    card.add(`<rect x="${n(x)}" y="${n(base - h)}" width="${n(barW)}" height="${n(h)}" rx="3" fill="${t.accent}" opacity="${peak ? 1 : 0.45}"/>`);
    card.put(x + barW / 2, base + 18, activity.months[lang][m.month].slice(0, 3), { size: 9.5, mono: true, fill: t.text3, anchor: 'middle' });
  });
  return card;
}

export function languagesCard(lang: Lang, theme: ThemeName, data: GithubData): Card | null {
  const list = data.languages;
  if (!list || !list.length) return null;
  const total = list.reduce((s, l) => s + l.bytes, 0);
  const sorted = [...list].sort((a, b) => b.bytes - a.bytes);
  const top = sorted.slice(0, 7);
  const rest = sorted.slice(7).reduce((s, l) => s + l.bytes, 0);
  const items = [
    ...top.map((l) => ({ name: l.name, color: l.color ?? tokens.language[l.name] ?? tokens.language.Other, share: l.bytes / total })),
    ...(rest > 0 ? [{ name: lang === 'en' ? 'Other' : 'Outras', color: tokens.language.Other, share: rest / total }] : []),
  ];
  const pct = (s: number) => `${(s * 100).toFixed(1)}%`;

  // Lay the legend out first so the card height fits its rows.
  const legend: { x: number; row: number; item: (typeof items)[number] }[] = [];
  let x = PAD;
  let row = 0;
  for (const item of items) {
    const w = 18 + measure(`${item.name} ${pct(item.share)}`, 'mono400', 12) + 26;
    if (x + w > W - PAD + 26 && x > PAD) {
      x = PAD;
      row++;
    }
    legend.push({ x, row, item });
    x += w;
  }
  const H = 146 + row * 24 + 30;
  const card = new Card(W, H, theme, `${alt.languages[lang]}: ${items.map((i) => `${i.name} ${pct(i.share)}`).join(', ')}`);
  const t = card.t;
  card.frame();
  card.put(PAD, 62, activity.languagesTitle[lang], { size: 22, weight: 600, tracking: -0.4 });
  card.put(W - PAD, 62, activity.languagesNote[lang], { size: 12, mono: true, fill: t.text3, anchor: 'end' });

  const bw = W - 2 * PAD;
  const id = card.uid('bar');
  card.def(id, `<clipPath id="${id}"><rect x="${PAD}" y="92" width="${bw}" height="10" rx="5"/></clipPath>`);
  let bx = PAD;
  const segs = items
    .map((item) => {
      const w = item.share * bw;
      const seg = `<rect x="${n(bx)}" y="92" width="${n(Math.max(0, w - 2))}" height="10" fill="${item.color}"/>`;
      bx += w;
      return seg;
    })
    .join('');
  card.add(`<g clip-path="url(#${id})">${segs}</g>`);

  for (const { x: lx, row: r, item } of legend) {
    const y = 138 + r * 24;
    card.add(`<circle cx="${n(lx + 5)}" cy="${y - 4}" r="5" fill="${item.color}"/>`);
    card.put(lx + 18, y, [{ t: `${item.name} `, fill: t.text }, { t: pct(item.share), fill: t.text3 }], { size: 12, mono: true });
  }
  return card;
}
