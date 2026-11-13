/**
 * Reads the profile data the cards need and writes data/github.json.
 * Pinned repositories and the contribution calendar only exist in the GraphQL API, so it needs a token.
 *
 * PROFILE_TOKEN (optional): a token of the profile owner that can read their private repositories.
 * With it, the repository count, the languages and the contributions also cover private work.
 * Only totals are saved: no private repository name, description or file ever reaches the cards.
 * Without it, or if it stops working, the built-in GITHUB_TOKEN is used and only public data is read.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { profile } from '../src/content.ts';
import type { GithubData } from '../src/data.ts';

const personal = process.env.PROFILE_TOKEN || undefined;
const fallback = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || undefined;
if (!personal && !fallback) {
  console.error('Set GITHUB_TOKEN (public data) or PROFILE_TOKEN (public and private data) and run again.');
  process.exit(1);
}

const query = /* GraphQL */ `
  query ($login: String!, $privacy: RepositoryPrivacy) {
    user(login: $login) {
      login
      followers { totalCount }
      publicRepos: repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
      privateRepos: repositories(privacy: PRIVATE, ownerAffiliations: OWNER) { totalCount }
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name description url homepageUrl isPrivate stargazerCount forkCount pushedAt
            primaryLanguage { name color }
            repositoryTopics(first: 6) { nodes { topic { name } } }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
      code: repositories(first: 100, privacy: $privacy, ownerAffiliations: OWNER, isFork: false) {
        nodes { languages(first: 12, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } } }
      }
    }
  }
`;

async function read(token: string, includePrivate: boolean) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'profile-cards' },
    // privacy null = every repository the token can see; PUBLIC keeps a broad token from adding private code.
    body: JSON.stringify({ query, variables: { login: profile.login, privacy: includePrivate ? null : 'PUBLIC' } }),
  });
  const json = (await res.json().catch(() => ({}))) as { data?: { user: any }; errors?: { message: string }[] };
  if (!res.ok || json.errors?.length || !json.data?.user) {
    throw new Error(`GitHub API request failed (${res.status}): ${json.errors?.map((e) => e.message).join('; ') ?? 'no user returned'}`);
  }
  return json.data.user;
}

let u: any;
let includesPrivate = false;
try {
  if (!personal) throw new Error('PROFILE_TOKEN is not set');
  u = await read(personal, true);
  includesPrivate = true;
} catch (error) {
  if (personal) console.warn(`PROFILE_TOKEN did not work, reading public data only. ${(error as Error).message}`);
  if (!fallback) process.exit(1);
  u = await read(fallback, false);
}

const bytes = new Map<string, { name: string; color: string | null; bytes: number }>();
for (const repo of u.code.nodes) {
  for (const edge of repo.languages.edges) {
    const entry = bytes.get(edge.node.name) ?? { name: edge.node.name, color: edge.node.color, bytes: 0 };
    entry.bytes += edge.size;
    bytes.set(edge.node.name, entry);
  }
}

const data: GithubData = {
  fetchedAt: new Date().toISOString(),
  user: {
    login: u.login,
    publicRepos: u.publicRepos.totalCount,
    privateRepos: includesPrivate ? u.privateRepos.totalCount : null,
    followers: u.followers.totalCount,
  },
  pinned: u.pinnedItems.nodes
    .filter((r: any) => r && r.name && !r.isPrivate)
    .map((r: any) => ({
      name: r.name,
      description: r.description || null,
      url: r.url,
      homepage: r.homepageUrl || null,
      language: r.primaryLanguage ? { name: r.primaryLanguage.name, color: r.primaryLanguage.color } : null,
      stars: r.stargazerCount,
      forks: r.forkCount,
      topics: r.repositoryTopics.nodes.map((t: any) => t.topic.name),
      pushedAt: r.pushedAt,
    })),
  contributions: {
    total: u.contributionsCollection.contributionCalendar.totalContributions,
    days: u.contributionsCollection.contributionCalendar.weeks.flatMap((w: any) =>
      w.contributionDays.map((d: any) => ({ date: d.date, count: d.contributionCount })),
    ),
  },
  languages: [...bytes.values()].sort((a, b) => b.bytes - a.bytes),
  includesPrivate,
};

mkdirSync(new URL('../data/', import.meta.url), { recursive: true });
writeFileSync(new URL('../data/github.json', import.meta.url), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Saved ${data.pinned.length} pinned repositories and ${data.contributions?.total} contributions (${includesPrivate ? 'public and private' : 'public only'}).`);
