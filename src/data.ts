import { existsSync, readFileSync } from 'node:fs';

export type Repo = {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: { name: string; color: string | null } | null;
  stars: number;
  forks: number;
  topics: string[];
  pushedAt: string | null;
};

export type Day = { date: string; count: number };

export type GithubData = {
  fetchedAt: string;
  user: { login: string; publicRepos: number; followers: number };
  pinned: Repo[];
  /** Null until the scheduled workflow has fetched it with a token. */
  contributions: { total: number; days: Day[] } | null;
  languages: { name: string; color: string | null; bytes: number }[] | null;
};

export function loadData(path = new URL('../data/github.json', import.meta.url)): GithubData {
  if (!existsSync(path)) throw new Error('data/github.json not found. Run "npm run fetch" first.');
  return JSON.parse(readFileSync(path, 'utf8')) as GithubData;
}
