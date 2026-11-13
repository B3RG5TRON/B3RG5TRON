import { Card, n } from '../svg.ts';
import { balance, clamp, measure, wrap } from '../fonts.ts';
import { PAD, W, tokens, type ThemeName } from '../tokens.ts';
import { about, contact, experience, footer, formatDate, posts, profile, projects, switcher, tiles, type Lang } from '../content.ts';
import type { GithubData, Repo } from '../data.ts';
import { readFileSync } from 'node:fs';

const THIRD = Math.round(W / 3); // three cards per README row
const HALF = W / 2;

export function aboutCard(lang: Lang, theme: ThemeName): Card {
  const leftW = 440;
  const rightX = 548;
  const rightW = W - PAD - rightX;
  const para = wrap(about.text[lang], leftW, 'sans400', 17);
  const facts = about.facts.map((f) => ({ label: f.label[lang], lines: wrap(f.value[lang], rightW, 'sans400', 14) }));
  const factsH = facts.reduce((h, f) => h + 30 + f.lines.length * 20 + 12, 0) - 12;
  const H = Math.max(106 + para.length * 28, 60 + factsH) + 30;

  const card = new Card(W, H, theme, `${about.title[lang]}: ${about.text[lang]}`);
  const t = card.t;
  card.frame();
  card.put(PAD, 62, about.title[lang], { size: 22, weight: 600, tracking: -0.4 });
  card.lines(PAD, 106, para, 28, { size: 17, fill: t.text2 });

  let y = 50;
  facts.forEach((f, i) => {
    if (i > 0) card.add(`<rect x="${rightX}" y="${n(y - 6)}" width="${rightW}" height="1" fill="${t.hairline}"/>`);
    card.put(rightX, y + 12, f.label, { size: 11.5, mono: true, fill: t.text3 });
    card.lines(rightX, y + 34, f.lines, 20, { size: 14, fill: t.text });
    y += 30 + f.lines.length * 20 + 12;
  });
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
  card.put(PAD, 62, experience.title[lang], { size: 22, weight: 600, tracking: -0.4 });

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

export function tileCard(lang: Lang, theme: ThemeName, id: string): Card {
  const tile = tiles.find((x) => x.id === id)!;
  const H = 124;
  const card = new Card(THIRD, H, theme, `${tile.label[lang]}: ${tile.title[lang]}, ${tile.sub[lang]}`);
  const t = card.t;
  card.frame();
  card.put(26, 40, tile.label[lang], { size: 11.5, mono: true, fill: t.accent });
  card.put(26, 72, clamp(tile.title[lang], THIRD - 52, 'sans600', 18, 1)[0], { size: 18, weight: 600, tracking: -0.2 });
  card.put(26, 98, tile.sub[lang], { size: 11.5, mono: true, fill: t.text2 });
  return card;
}

/** Frameless heading strip above a grid of cards. */
export function titleStrip(lang: Lang, theme: ThemeName, title: string, note: string): Card {
  const card = new Card(W, 72, theme, `${title}, ${note}`);
  card.put(tokens.card.inset + 6, 50, title, { size: 22, weight: 600, tracking: -0.4 });
  card.put(W - tokens.card.inset - 6, 50, note, { size: 12, mono: true, fill: card.t.text3, anchor: 'end' });
  return card;
}

export const projectsTitle = (lang: Lang, theme: ThemeName) => titleStrip(lang, theme, projects.title[lang], projects.note[lang]);
export const postsTitle = (lang: Lang, theme: ThemeName) => titleStrip(lang, theme, posts.title[lang], posts.note[lang]);

export function repoCard(lang: Lang, theme: ThemeName, repo: Repo): Card {
  const H = 184;
  const inner = THIRD - 52;
  const display = repo.name.replace(/_/g, ' ');
  const nameLines = clamp(display, inner, 'sans600', 15, 2);
  const desc = repo.description ? clamp(repo.description, inner, 'sans400', 12.5, 5 - nameLines.length) : [];
  const card = new Card(THIRD, H, theme, `${display}${repo.description ? `: ${repo.description}` : ''}`);
  const t = card.t;
  card.frame();
  let y = card.lines(26, 42, nameLines, 20, { size: 15, weight: 600 });
  card.lines(26, y + 6, desc, 18, { size: 12.5, fill: t.text2 });

  const by = H - 28;
  let x = 26;
  if (repo.language) {
    const color = repo.language.color ?? tokens.language[repo.language.name] ?? tokens.language.Other;
    card.add(`<circle cx="${x + 5}" cy="${by - 4}" r="5" fill="${color}"/>`);
    card.put(x + 17, by, repo.language.name, { size: 11.5, mono: true, fill: t.text2 });
    x += 17 + measure(repo.language.name, 'mono400', 11.5) + 16;
  }
  if (repo.stars > 0) {
    card.put(THIRD - 26, by, `${repo.stars} ${lang === 'en' ? (repo.stars === 1 ? 'star' : 'stars') : repo.stars === 1 ? 'estrela' : 'estrelas'}`, {
      size: 11.5,
      mono: true,
      fill: t.text3,
      anchor: 'end',
    });
  }
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
  const card = new Card(THIRD, H, theme, `${link.title[lang]}: ${link.sub}`);
  const t = card.t;
  card.frame();
  card.put(26, 38, link.title[lang], { size: 15, weight: 600 });
  card.put(26, 60, clamp(link.sub, THIRD - 52, 'mono400', 11.5, 1)[0], { size: 11.5, mono: true, fill: t.text2 });
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
