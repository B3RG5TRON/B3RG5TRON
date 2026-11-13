import { readFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync(new URL('../design/tokens.json', import.meta.url), 'utf8'));

export type ThemeName = 'dark' | 'light';
export type Theme = {
  bg: string; text: string; text2: string; text3: string; text4: string;
  accent: string; ok: string; info: string;
  border: string; hairline: string; pill: string; track: string;
  glassTop: string; glassBottom: string; edgeTop: string; edgeMid: string; edgeBottom: string;
  shadow: string; glowA: string; glowB: string; glowStrength: number;
};

export const tokens = raw as {
  font: { sans: string; mono: string };
  radius: { card: number; panel: number };
  card: { width: number; inset: number; padding: number };
  motion: { ease: string; rise: number; fade: number };
  theme: Record<ThemeName, Theme>;
  language: Record<string, string>;
};

export const W = tokens.card.width;
export const PAD = tokens.card.padding;
