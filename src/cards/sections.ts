import { Card, n, type Span } from '../svg.ts';
import { balance, clamp, measure, wrap } from '../fonts.ts';
import { PAD, W, tokens, type ThemeName } from '../tokens.ts';
import { about, building, contact, experience, footer, formatDate, posts, profile, projects, stack, switcher, type Lang } from '../content.ts';
import type { GithubData, Repo } from '../data.ts';
import { readFileSync } from 'node:fs';

const THIRD = Math.round(W / 3); // three cards per README row
const HALF = W / 2;

/** Section number in the accent colour followed by the section title, as in the reference profile. */
function heading(card: Card, x: number, y: number, num: string, title: string) {
  card.put(x, y, [{ t: num, fill: card.t.accent, mono: true }, { t: '  ' }, { t: title, weight: 600 }], { size: 22, tracking: -0.4 });
}

function headingSpans(card: Card, num: string, title: string): Span[] {
  return [{ t: num + '  ', fill: card.t.accent, mono: true }, { t: title, weight: 600 }];
}

export function aboutCard(lang: Lang, theme: ThemeName): Card {
  const width = W - 2 * PAD;
  const para = wrap(about.text[lang], width, 'sans400', 17);
  const rowH = 44;
  const top = 104;
  const rowsY = top + para.length * 28 + 6;
  const H = rowsY + about.facts.length * rowH + 30;
  const facts = about.facts.map((f) => `${f.label[lang]}: ${f.value[lang]}`).join('; ');
  const card = new Card(W, H, theme, `${about.title[lang]}: ${about.text[lang]} ${facts}`);
  const t = card.t;
  card.frame();
  card.put(PAD, 62, headingSpans(card, about.num, about.title[lang]), { size: 21, tracking: -0.3 });
  card.lines(PAD, top, para, 28, { size: 17, fill: t.text2 });
  const valueX = PAD + 176;
  about.facts.forEach((f, i) => {
    const y = rowsY + i * rowH;
    card.add(`<rect x="${PAD}" y="${y}" width="${width}" height="1" fill="${t.hairline}"/>`);
    card.put(PAD, y + 27, `→ ${f.label[lang]}`, { size: 12.5, mono: true, fill: t.accent });
    card.put(valueX, y + 27.5, clamp(f.value[lang], width - (valueX - PAD), 'sans400', 15, 1)[0], { size: 15, fill: t.text });
  });
  card.add(`<rect x="${PAD}" y="${rowsY + about.facts.length * rowH}" width="${width}" height="1" fill="${t.hairline}"/>`);
  return card;
}

/** Tools grouped by area, each one in its own pill. The main ones carry the accent colour. */
export function stackCard(lang: Lang, theme: ThemeName): Card {
  const labelW = 176;
  const left = PAD + labelW;
  const right = W - PAD;
  const size = 13.5;
  const ph = 30;
  const gap = 8;
  const name = (item: string | Record<Lang, string>) => (typeof item === 'string' ? item : item[lang]);
  // Lay the pills out first so the card height follows the content.
  let y = 100;
  const placed: { x: number; y: number; w: number; text: string; main: boolean }[] = [];
  const labels: { y: number; text: string }[] = [];
  for (const group of stack.groups) {
    let x = left;
    labels.push({ y, text: group.label[lang] });
    for (const item of group.items) {
      const text = name(item);
      const w = Math.ceil(measure(text, 'sans400', size)) + 26;
      if (x + w > right) {
        x = left;
        y += ph + gap;
      }
      placed.push({ x, y, w, text, main: group.main?.includes(text) ?? false });
      x += w + gap;
    }
    y += ph + 14;
  }
  const H = y + 22;
  const all = stack.groups.map((g) => `${g.label[lang]}: ${g.items.map(name).join(', ')}`).join('; ');
  const card = new Card(W, H, theme, `${stack.title[lang]}. ${all}`);
  const t = card.t;
  card.frame();
  card.put(PAD, 62, headingSpans(card, stack.num, stack.title[lang]), { size: 21, tracking: -0.3 });
  for (const l of labels) card.put(PAD, l.y + ph / 2 + 4.5, l.text, { size: 12.5, mono: true, fill: t.text3 });
  for (const p of placed) {
    if (p.main) {
      card.add(`<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${ph}" rx="8" fill="${t.accent}" opacity=".14"/>`);
      card.add(`<rect x="${p.x + 0.5}" y="${p.y + 0.5}" width="${p.w - 1}" height="${ph - 1}" rx="7.5" fill="none" stroke="${t.accent}" opacity=".55"/>`);
    } else {
      card.add(`<rect x="${p.x + 0.5}" y="${p.y + 0.5}" width="${p.w - 1}" height="${ph - 1}" rx="7.5" fill="none" stroke="${t.pill}"/>`);
    }
    card.put(p.x + 13, p.y + ph / 2 + 4.7, p.text, { size, fill: p.main ? t.accent : t.text, weight: p.main ? 600 : 400 });
  }
  return card;
}

export function experienceCard(lang: Lang, theme: ThemeName): Card {
  const roleX = 236;
  const rows = experience.roles.map((r) => ({
    ...r,
    detailLines: r.detail ? wrap(r.detail[lang], W - PAD - roleX, 'sans400', 13.5) : [],
  }));
  const rowH = (r: (typeof rows)[number]) => 46 + r.detailLines.length * 20 + (r.detailLines.length ? 6 : 0);
  const H = 96 + rows.reduce((h, r) => h + rowH(r), 0) + 8;

  const label = `${experience.title[lang]}: ${rows.map((r) => `${r.role[lang]}, ${r.company}, ${r.period[lang]}`).join('; ')}`;
  const card = new Card(W, H, theme, label);
  const t = card.t;
  card.frame();
  card.put(PAD, 62, headingSpans(card, experience.num, experience.title[lang]), { size: 21, tracking: -0.3 });

  let y = 108;
  const dotX = PAD + 5;
  const firstY = y - 5;
  let lastY = firstY;
  for (const r of rows) {
    lastY = y - 5;
    y += rowH(r);
  }
  card.add(`<rect x="${dotX - 0.5}" y="${firstY}" width="1" height="${lastY - firstY}" fill="${t.pill}"/>`);

  y = 108;
  for (const r of rows) {
    const cy = y - 5;
    if (r.current) {
      card.add(`<circle cx="${dotX}" cy="${cy}" r="8" fill="${t.accent}" opacity=".22"/><circle cx="${dotX}" cy="${cy}" r="4" fill="${t.accent}"/>`);
    } else {
      card.add(`<circle cx="${dotX}" cy="${cy}" r="4" fill="${t.bg}" stroke="${t.text3}" stroke-width="1.5"/>`);
    }
    card.put(PAD + 24, y, r.period[lang], { size: 12, mono: true, fill: r.current ? t.text2 : t.text3 });
    card.put(roleX, y, r.role[lang], { size: 15.5, weight: 600 });
    card.put(W - PAD, y, r.company, { size: 14, fill: r.current ? t.accent : t.text2, anchor: 'end' });
    card.lines(roleX, y + 26, r.detailLines, 20, { size: 13.5, fill: t.text2 });
    y += rowH(r);
  }
  return card;
}

/** Frameless heading strip above a grid of cards: number, title, a hairline and an optional note. */
export function titleStrip(lang: Lang, theme: ThemeName, num: string, title: string, note?: string): Card {
  const card = new Card(W, 72, theme, note ? `${num} ${title}, ${note}` : `${num} ${title}`);
  const t = card.t;
  const x = tokens.card.inset + 6;
  const y = 48;
  card.put(x, y, headingSpans(card, num, title), { size: 21, tracking: -0.3 });
  const titleEnd = x + measure(num + '  ', 'mono400', 21) + measure(title, 'sans600', 21, -0.3) + 18;
  const noteW = note ? measure(note, 'mono400', 12) + 18 : 0;
  card.add(`<rect x="${n(titleEnd)}" y="${y - 7}" width="${n(W - x - noteW - titleEnd)}" height="1" fill="${t.hairline}"/>`);
  if (note) card.put(W - x, y - 3, note, { size: 12, mono: true, fill: t.text3, anchor: 'end' });
  return card;
}

export const buildingTitle = (lang: Lang, theme: ThemeName) => titleStrip(lang, theme, building.num, building.title[lang]);
export const projectsTitle = (lang: Lang, theme: ThemeName) => titleStrip(lang, theme, projects.num, projects.title[lang], projects.note[lang]);
export const postsTitle = (lang: Lang, theme: ThemeName) => titleStrip(lang, theme, posts.num, posts.title[lang], posts.note[lang]);

/** A project in progress: a wide card with the screenshot on the left and the pitch on the right. */
export function buildingCard(lang: Lang, theme: ThemeName, id: string): Card {
  const item = building.items.find((b) => b.id === id)!;
  const pad = 16;
  const iw = 452;
  const ih = Math.round((iw * 9) / 16);
  const H = ih + 2 * pad;
  const card = new Card(W, H, theme, `${item.name}, ${item.status[lang]}: ${item.text[lang]} ${item.stack.join(', ')}`);
  const t = card.t;
  card.frame();
  card.image(item.image[theme], pad, pad, iw, ih, 9);
  const x = pad + iw + 30;
  const right = W - 30;
  const width = right - x;
  card.put(x, 58, item.name, { size: 24, weight: 600, tracking: -0.5 });
  card.put(right, 56, item.year, { size: 12, mono: true, fill: t.text3, anchor: 'end' });
  const status = item.status[lang];
  const sw = Math.ceil(measure(status, 'mono400', 11.5)) + 34;
  card.add(`<rect x="${x + 0.5}" y="76.5" width="${sw}" height="24" rx="12" fill="${t.accent}" fill-opacity=".1" stroke="${t.accent}" stroke-opacity=".6"/>`);
  card.add(`<circle cx="${x + 13}" cy="88.5" r="3.5" fill="${t.accent}"/>`);
  card.put(x + 23, 92.5, status, { size: 11.5, mono: true, fill: t.accent });
  const text = wrap(item.text[lang], width, 'sans400', 14.5);
  card.lines(x, 132, text, 22.5, { size: 14.5, fill: t.text2 });
  const stackLines = wrap(item.stack.join(' · '), width, 'mono400', 11.5);
  card.lines(x, H - 30 - (stackLines.length - 1) * 18, stackLines, 18, { size: 11.5, mono: true, fill: t.text3 });
  return card;
}

const METHOD_COLOURS: Record<string, string> = { GET: '#4ade80', POST: '#a78bfa', PUT: '#60a5fa', PATCH: '#60a5fa', DELETE: '#f87171' };

/**
 * Cover for a project that has no screenshot, such as an API: the project logo over a dark scene,
 * with the endpoints it serves. Dark in both themes, like a screenshot would be.
 */
function drawnCover(card: Card, x: number, y: number, w: number, h: number, o: { title: string; logo?: string; endpoints?: string[]; language?: string }) {
  const id = card.uid('cv');
  card.def(
    id,
    `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#121018"/><stop offset="1" stop-color="#1c1530"/></linearGradient>` +
      `<clipPath id="${id}c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/></clipPath>` +
      `<filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="26"/></filter>`,
  );
  card.add(
    `<g clip-path="url(#${id}c)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`,
    `<circle cx="${x + w - 30}" cy="${y + 10}" r="70" fill="#a78bfa" opacity=".32" filter="url(#${id}b)"/>`,
    `<circle cx="${x + 20}" cy="${y + h}" r="60" fill="#60a5fa" opacity=".18" filter="url(#${id}b)"/></g>`,
  );
  // Logo row: a wide wordmark on its own, or a square icon followed by the title.
  let ratio = 0;
  if (o.logo) {
    const head = readFileSync(new URL(`../../${o.logo}`, import.meta.url), 'utf8').slice(0, 300);
    const m = head.match(/width="([\d.]+)"\s+height="([\d.]+)"/);
    ratio = m ? Number(m[1]) / Number(m[2]) : 1;
  }
  if (o.logo && ratio > 2.5) {
    const lh = 17;
    card.logo(o.logo, x + 16, y + 15, lh * ratio, lh);
    card.put(x + 16 + lh * ratio + 8, y + 29, 'API', { size: 10.5, mono: true, fill: '#a1a1aa' });
  } else {
    let tx = x + 16;
    if (o.logo) {
      card.logo(o.logo, x + 16, y + 13, 20, 22);
      tx += 28;
    }
    card.put(tx, y + 29, o.title, { size: 13.5, weight: 600, fill: '#f4f4f5' });
  }
  const px = x + 14;
  const py = y + 46;
  const pw = w - 28;
  const ph = h - 58;
  card.add(
    `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="8" fill="#ffffff" fill-opacity=".045"/>`,
    `<rect x="${px + 0.5}" y="${py + 0.5}" width="${pw - 1}" height="${ph - 1}" rx="7.5" fill="none" stroke="#ffffff" stroke-opacity=".1"/>`,
  );
  const lines = (o.endpoints ?? []).slice(0, 5);
  if (lines.length) {
    lines.forEach((e, i) => {
      const [method, ...rest] = e.split(' ');
      card.put(px + 12, py + 19 + i * 15.5, [{ t: method.padEnd(7), fill: METHOD_COLOURS[method] ?? '#a1a1aa' }, { t: rest.join(' '), fill: '#d4d4d8' }], {
        size: 10.5,
        mono: true,
      });
    });
  } else {
    card.put(px + pw / 2, py + ph / 2 + 4, o.language ?? o.title, { size: 12, mono: true, fill: '#a1a1aa', anchor: 'middle' });
  }
}

/** A finished project: picture on top, then name, year, one line of text and the stack. */
export function repoCard(lang: Lang, theme: ThemeName, repo: Repo): Card {
  const extra = projects.details[repo.name];
  const H = 292;
  const pad = 12;
  const iw = THIRD - 2 * pad;
  const ih = Math.round((iw * 9) / 16);
  const inner = THIRD - 2 * 20;
  const title = extra?.title ?? repo.name.replace(/_/g, ' ');
  const text = extra?.text[lang] ?? repo.description ?? '';
  const stackList = extra?.stack ?? (repo.language ? [repo.language.name] : []);
  const year = repo.pushedAt ? String(new Date(repo.pushedAt).getUTCFullYear()) : '';
  const card = new Card(THIRD, H, theme, `${title}${year ? ` (${year})` : ''}${text ? `: ${text}` : ''} ${stackList.join(', ')}`);
  const t = card.t;
  card.frame();
  if (extra?.image) card.image(extra.image, pad, pad, iw, ih, 9);
  else drawnCover(card, pad, pad, iw, ih, { title, logo: extra?.logo, endpoints: extra?.endpoints, language: repo.language?.name });

  const ty = pad + ih + 32;
  const yearW = year ? measure(year, 'mono400', 11.5) + 12 : 0;
  card.put(20, ty, clamp(title, inner - yearW, 'sans600', 16, 1)[0], { size: 16, weight: 600, tracking: -0.2 });
  if (year) card.put(THIRD - 20, ty - 1, year, { size: 11.5, mono: true, fill: t.text3, anchor: 'end' });
  card.lines(20, ty + 24, clamp(text, inner, 'sans400', 13, 2), 19, { size: 13, fill: t.text2 });
  card.put(20, H - 26, clamp(stackList.join(' · '), inner, 'mono400', 11, 1)[0], { size: 11, mono: true, fill: t.text3 });
  return card;
}

export function postCard(lang: Lang, theme: ThemeName, id: string): Card {
  const post = posts.items.find((p) => p.id === id)!;
  const H = 176;
  const inner = HALF - 56;
  const title = clamp(post.title[lang], inner, 'sans600', 16, 2);
  const text = clamp(post.text[lang], inner, 'sans400', 13, 4 - title.length);
  const card = new Card(HALF, H, theme, `${post.date[lang]}, ${post.title[lang]}. ${post.text[lang]}`);
  const t = card.t;
  card.frame();
  const kind = posts.kinds[post.kind][lang];
  const kw = Math.ceil(measure(kind, 'mono400', 11)) + 22;
  card.add(`<rect x="28.5" y="26.5" width="${kw}" height="23" rx="11.5" fill="none" stroke="${post.kind === 'project' ? t.accent : t.pill}"/>`);
  card.put(28.5 + 11, 42.5, kind, { size: 11, mono: true, fill: post.kind === 'project' ? t.accent : t.text2 });
  card.put(HALF - 28, 42.5, post.date[lang], { size: 11.5, mono: true, fill: t.text3, anchor: 'end' });
  const y = card.lines(28, 82, title, 22, { size: 16, weight: 600, tracking: -0.1 });
  card.lines(28, y + 4, text, 19, { size: 13, fill: t.text2 });
  return card;
}

/** One screenshot in a card frame. The image is inlined so the SVG works through <img>. */
export function screenCard(lang: Lang, theme: ThemeName, file: string, caption: string): Card {
  const pad = 14;
  const iw = THIRD - 2 * pad;
  const ih = Math.round((iw * 3) / 4);
  const H = pad + ih + 42;
  const card = new Card(THIRD, H, theme, caption);
  const t = card.t;
  card.frame();
  const b64 = readFileSync(new URL(`../../${file}`, import.meta.url)).toString('base64');
  const id = card.uid('img');
  card.def(id, `<clipPath id="${id}"><rect x="${pad}" y="${pad}" width="${iw}" height="${ih}" rx="7"/></clipPath>`);
  card.add(
    `<image x="${pad}" y="${pad}" width="${iw}" height="${ih}" clip-path="url(#${id})" preserveAspectRatio="xMidYMid slice" href="data:image/webp;base64,${b64}"/>`,
    `<rect x="${pad + 0.5}" y="${pad + 0.5}" width="${iw - 1}" height="${ih - 1}" rx="6.5" fill="none" stroke="${t.border}"/>`,
  );
  card.put(pad + 4, pad + ih + 25, caption, { size: 11.5, mono: true, fill: t.text2 });
  return card;
}

export function contactCard(lang: Lang, theme: ThemeName): Card {
  const H = 176;
  const card = new Card(W, H, theme, `${contact.title[lang]}. ${contact.text[lang]} ${profile.email}`);
  const t = card.t;
  card.frame();
  const g = t.glowStrength;
  card.lightField([
    { cx: 760, cy: 150, r: 150, color: t.glowA, opacity: g * 0.8 },
    { cx: 560, cy: 10, r: 110, color: t.glowB, opacity: g * 0.4 },
  ]);
  card.put(PAD, 78, contact.title[lang], { size: 30, weight: 600, tracking: -0.8 });
  card.lines(PAD, 114, balance(contact.text[lang], 500, 'sans400', 15.5), 24, { size: 15.5, fill: t.text2 });
  const size = 13;
  const w = Math.ceil(measure(profile.email, 'mono400', size)) + 44;
  const x = W - PAD - w;
  card.add(card.glass(x, 66, w, 44, 22));
  card.put(x + 22, 66 + 22 + size * 0.34, profile.email, { size, mono: true, fill: t.text });
  return card;
}

export function linkCard(lang: Lang, theme: ThemeName, id: string): Card {
  const link = contact.links.find((l) => l.id === id)!;
  const H = 84;
  const CW = Math.round(W / contact.links.length);
  const card = new Card(CW, H, theme, `${link.title[lang]}: ${link.sub}`);
  const t = card.t;
  card.frame();
  card.put(26, 38, link.title[lang], { size: 15, weight: 600 });
  card.put(26, 60, clamp(link.sub, CW - 52, 'mono400', 11.5, 1)[0], { size: 11.5, mono: true, fill: t.text2 });
  return card;
}

export function footerCard(lang: Lang, theme: ThemeName, data: GithubData): Card {
  const year = String(new Date(data.fetchedAt).getUTCFullYear());
  const left = footer.left[lang].replace('{year}', year);
  const right = footer.right[lang].replace('{date}', formatDate(data.fetchedAt, lang));
  const card = new Card(W, 56, theme, `${left}. ${right}`);
  card.put(tokens.card.inset + 6, 34, left, { size: 12, mono: true, fill: card.t.text3 });
  card.put(W - tokens.card.inset - 6, 34, right, { size: 12, mono: true, fill: card.t.text3, anchor: 'end' });
  return card;
}

/** One segment of the language switch at the top of the README. */
export function langPill(lang: Lang, theme: ThemeName, target: Lang): Card {
  const active = lang === target;
  const text = switcher[target];
  const w = Math.ceil(measure(text, 'sans600', 13)) + 40;
  const card = new Card(w + 8, 44, theme, active ? `${text} (${lang === 'en' ? 'current' : 'atual'})` : text);
  const t = card.t;
  if (active) {
    card.add(`<rect x="4" y="4" width="${w}" height="36" rx="18" fill="${t.accent}" opacity=".16"/>`);
    card.add(`<rect x="4.5" y="4.5" width="${w - 1}" height="35" rx="17.5" fill="none" stroke="${t.accent}" opacity=".7"/>`);
  } else {
    card.add(`<rect x="4.5" y="4.5" width="${w - 1}" height="35" rx="17.5" fill="none" stroke="${t.pill}"/>`);
  }
  card.put(4 + w / 2, 26.5, text, { size: 13, weight: 600, fill: active ? t.accent : t.text2, anchor: 'middle' });
  return card;
}
