"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PROJECTS } from "@/data/portfolio";
import { Section, SectionHeading } from "@/components/ui/section";
import type { ProjectFilter } from "@/types";
import { cn } from "@/lib/utils";

const FILTERS: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "mern", label: "MERN" },
  { id: "java", label: "Java" },
  { id: "react", label: "React" },
  { id: "backend", label: "Backend" },
  { id: "mobile", label: "Mobile" },
];

export function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectFilter>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? PROJECTS
        : PROJECTS.filter((project) => project.filters.includes(filter)),
    [filter],
  );

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        description="Product-shaped builds across MERN, React, and Java — filter by focus area."
      />

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition focus-ring",
              filter === item.id
                ? "border-transparent gradient-btn text-white shadow-md shadow-accent/20"
                : "border-border bg-card/60 text-muted hover:border-accent/40 hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group overflow-hidden rounded-2xl glass shadow-xl shadow-black/5"
          >
            <div
              className="relative h-44"
              style={{
                backgroundImage: `linear-gradient(135deg, color-mix(in oklab, var(--accent) 35%, transparent), transparent), url(${project.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Link
                href={`/projects/${project.id}`}
                className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100"
              >
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                  View details
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {project.title}
                </h3>
                <span className="text-xs text-muted">{project.year}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link
                href={`/projects/${project.id}`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline focus-ring rounded"
              >
                Full details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          No projects match this filter.
        </p>
      ) : null}
    </Section>
  );
}
