import { SITE } from "@/data/portfolio";
import type { GithubRepo, GithubStats } from "@/types";

export async function fetchGithubDashboard(username = SITE.githubUsername) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "nextgen-developer-portfolio",
  };

  const [profileRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 300 },
    }),
    fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
      {
        headers,
        next: { revalidate: 300 },
      },
    ),
  ]);

  if (!profileRes.ok) {
    throw new Error("GitHub profile unavailable");
  }

  const profileJson = await profileRes.json();
  const reposJson = reposRes.ok ? await reposRes.json() : [];

  const profile: GithubStats = {
    publicRepos: profileJson.public_repos ?? 0,
    followers: profileJson.followers ?? 0,
    following: profileJson.following ?? 0,
    avatarUrl: profileJson.avatar_url ?? "",
    bio: profileJson.bio ?? null,
    name: profileJson.name ?? null,
    htmlUrl: profileJson.html_url ?? `https://github.com/${username}`,
  };

  const repos: GithubRepo[] = (reposJson as GithubRepo[]).map((repo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    updated_at: repo.updated_at,
  }));

  const languages: Record<string, number> = {};
  for (const repo of repos) {
    if (!repo.language) continue;
    languages[repo.language] = (languages[repo.language] || 0) + 1;
  }

  return { profile, repos, languages };
}
