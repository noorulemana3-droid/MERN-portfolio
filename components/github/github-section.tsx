"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitFork, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { SITE } from "@/data/portfolio";
import { Section, SectionHeading } from "@/components/ui/section";
import type { GithubRepo, GithubStats } from "@/types";

type GithubPayload = {
  profile: GithubStats | null;
  repos: GithubRepo[];
  languages: Record<string, number>;
  error?: string;
};

export function GithubSection() {
  const [data, setData] = useState<GithubPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/github")
      .then((res) => res.json())
      .then((payload: GithubPayload) => {
        if (mounted) setData(payload);
      })
      .catch(() => {
        if (mounted) {
          setData({
            profile: null,
            repos: [],
            languages: {},
            error: "Unable to load GitHub data right now.",
          });
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const languageEntries = Object.entries(data?.languages ?? {}).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <Section id="github">
      <SectionHeading
        eyebrow="GitHub Dashboard"
        title="Open-source signal at a glance"
        description={`Live snapshot for @${SITE.githubUsername} — profile stats, top languages, and recent repositories.`}
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl glass" />
          ))}
        </div>
      ) : (
        <>
          {data?.error ? (
            <p className="mb-6 rounded-2xl border border-border bg-accent-soft/40 px-4 py-3 text-sm text-muted">
              {data.error} Showing the dashboard shell — connect a public GitHub
              username in your env to load live stats.
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Public repos",
                value: data?.profile?.publicRepos ?? "—",
              },
              { label: "Followers", value: data?.profile?.followers ?? "—" },
              { label: "Following", value: data?.profile?.following ?? "—" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl glass p-5"
              >
                <p className="font-display text-3xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl glass p-6">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Top languages
              </h3>
              <div className="mt-5 space-y-3">
                {languageEntries.length > 0 ? (
                  languageEntries.slice(0, 6).map(([lang, count]) => (
                    <div key={lang}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span>{lang}</span>
                        <span className="text-muted">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-accent-soft">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{
                            width: `${Math.min(
                              100,
                              (count / (languageEntries[0]?.[1] || 1)) * 100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">
                    Language stats appear once repositories load.
                  </p>
                )}
              </div>
              {data?.profile?.htmlUrl ? (
                <a
                  href={data.profile.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                >
                  View GitHub profile <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Latest repositories
              </h3>
              {(data?.repos ?? []).slice(0, 5).map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl glass p-4 transition hover:border-accent/40 focus-ring"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{repo.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {repo.description || "No description provided."}
                      </p>
                    </div>
                    <span className="text-xs text-muted">
                      {repo.language || "—"}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-4 text-xs text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5" /> {repo.stargazers_count}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5" /> {repo.forks_count}
                    </span>
                  </div>
                </a>
              ))}
              {(data?.repos?.length ?? 0) === 0 ? (
                <p className="rounded-2xl glass p-4 text-sm text-muted">
                  No repositories loaded yet.
                </p>
              ) : null}
            </div>
          </div>
        </>
      )}
    </Section>
  );
}
