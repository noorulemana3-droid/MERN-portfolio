"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { PROJECTS } from "@/data/portfolio";
import { ProjectCover } from "@/components/projects/project-cover";
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

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium transition focus-ring",
              filter === item.id
                ? "border-transparent gradient-btn text-white"
                : "border-border bg-card/70 text-muted hover:border-accent/40 hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((project, index) => {
          const isMobile = project.filters.includes("mobile");
          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group overflow-hidden rounded-2xl glass glass-lift"
            >
              <div
                className={cn(
                  "relative bg-[#0b0a09]",
                  isMobile ? "flex justify-center px-10 py-6 sm:px-16" : "",
                )}
              >
                <ProjectCover
                  title={project.title}
                  image={project.image}
                  href={`/projects/${project.id}`}
                  variant={isMobile ? "mobile" : "desktop"}
                  className={cn(
                    "w-full",
                    isMobile && "max-w-[220px] rounded-[1.25rem] shadow-2xl shadow-black/40 ring-1 ring-white/10",
                  )}
                  priority={index < 2}
                />
              </div>
              <div className="relative p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-bold text-foreground transition group-hover:text-accent">
                    {project.title}
                  </h3>
                  <span className="shrink-0 rounded-md border border-border bg-background/40 px-2 py-0.5 text-[11px] font-medium text-muted">
                    {project.year}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-background/45 px-2.5 py-1 text-[11px] text-muted transition group-hover:border-accent/25"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="mt-5 inline-flex items-center gap-1 rounded text-sm font-semibold text-accent hover:underline focus-ring"
                >
                  Full details
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          No projects match this filter.
        </p>
      ) : null}
    </Section>
  );
}
