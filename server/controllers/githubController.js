import Profile from '../models/Profile.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
let cache = { key: null, at: 0, data: null };

async function resolveUsername() {
  if (process.env.GITHUB_USERNAME) return process.env.GITHUB_USERNAME;
  const profile = await Profile.findOne();
  const url = profile?.socials?.github || '';
  const match = url.match(/github\.com\/([^/?#]+)/i);
  return match?.[1] || 'tofeeuqSoft';
}

async function ghFetch(path) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-app' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

export const getGithubSummary = asyncHandler(async (req, res) => {
  const username = await resolveUsername();

  if (cache.data && cache.key === username && Date.now() - cache.at < CACHE_TTL) {
    return res.json({ success: true, data: cache.data, meta: { cached: true } });
  }

  const [user, repos] = await Promise.all([
    ghFetch(`/users/${username}`),
    ghFetch(`/users/${username}/repos?sort=updated&per_page=10`),
  ]);

  const data = {
    username,
    name: user.name,
    avatarUrl: user.avatar_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    profileUrl: user.html_url,
    recentRepos: repos.map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      stars: r.stargazers_count,
      language: r.language,
      updatedAt: r.updated_at,
    })),
  };

  cache = { key: username, at: Date.now(), data };
  res.json({ success: true, data, meta: { cached: false } });
});
