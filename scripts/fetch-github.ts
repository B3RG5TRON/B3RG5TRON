/**
 * Reads the public profile data the cards need and writes data/github.json.
 * Needs a token because pinned repositories and the contribution calendar
 * only exist in the GraphQL API. In GitHub Actions the built-in GITHUB_TOKEN is enough.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { profile } from '../src/content.ts';
import type { GithubData } from '../src/data.ts';

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN is not set. Export a token (no scopes needed for public data) and run again.');
  process.exit(1);
}

const query = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      login
      followers { totalCount }
      publicRepos: repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
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
      code: repositories(first: 100, privacy: PUBLIC, ownerAffiliations: OWNER, isFork: false) {
        nodes { languages(first: 12, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } } }
      }
    }
  }
`;

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'profile-cards' },
  body: JSON.stringify({ query, variables: { login: profile.login } }),
});
const json = (await res.json()) as { data?: { user: any }; errors?: { message: string }[] };
if (!res.ok || json.errors?.length || !json.data?.user) {
  console.error(`GitHub API request failed (${res.status}):`, json.errors?.map((e) => e.message).join('; ') ?? 'no user returned');
  process.exit(1);
}

const u = json.data.user;
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
  user: { login: u.login, publicRepos: u.publicRepos.totalCount, followers: u.followers.totalCount },
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
};

mkdirSync(new URL('../data/', import.meta.url), { recursive: true });
writeFileSync(new URL('../data/github.json', import.meta.url), `${JSON.stringify(data, null, 2)}\n`);
console.log(`Saved ${data.pinned.length} pinned repositories and ${data.contributions?.total} contributions.`);
