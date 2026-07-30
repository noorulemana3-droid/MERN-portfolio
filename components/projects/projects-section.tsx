"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
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
        description="Desktop product screens with description, tech stack, and links — built for recruiter review."
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

      <div className="flex flex-col gap-8 md:gap-12">
        {filtered.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.24) }}
            className="group overflow-hidden rounded-[1.25rem] glass glass-lift"
          >
            <div className="grid items-stretch lg:grid-cols-[1.45fr_0.55fr]">
              {/* Full product screenshot — larger left media column */}
              <div className="relative min-h-[300px] bg-[#0B1120] sm:min-h-[360px] lg:min-h-full">
                <ProjectCover
                  title={project.title}
                  image={project.image}
                  href={`/projects/${project.id}`}
                  variant="desktop"
                  className="h-full w-full rounded-none"
                  priority={index < 2}
                />
              </div>

              {/* Always details on the right */}
              <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-foreground transition group-hover:text-accent md:text-[1.65rem]">
                    {project.title}
                  </h3>
                  <span className="shrink-0 rounded-md border border-border bg-background/40 px-2 py-0.5 text-[11px] font-medium text-muted">
                    {project.year}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted md:text-[0.95rem]">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-background/45 px-2.5 py-1 text-[11px] text-muted transition group-hover:border-accent/25"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold gradient-btn focus-ring"
                  >
                    Full details
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/70 px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-accent/40 hover:text-accent focus-ring"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live Demo
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/70 px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-accent/40 hover:text-accent focus-ring"
                    >
                      <FaGithub className="h-3.5 w-3.5" />
                      GitHub
                    </a>
                  ) : null}
                </div>
              </div>
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
