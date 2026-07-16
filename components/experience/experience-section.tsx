"use client";

import { motion } from "framer-motion";
import { EXPERIENCES } from "@/data/portfolio";
import { Section, SectionHeading } from "@/components/ui/section";

export function ExperienceSection() {
  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Experience"
        title="Professional journey"
        description="Internship work across backend, frontend, APIs, and collaborative delivery."
      />

      <div className="mx-auto max-w-3xl space-y-6">
        {EXPERIENCES.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="glass rounded-2xl p-6 shadow-xl shadow-black/5 md:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
              <span>
                {item.startDate} – {item.endDate}
              </span>
              <span>{item.location}</span>
            </div>
            <h3 className="mt-3 font-display text-xl font-bold text-foreground">
              {item.role}
            </h3>
            <p className="mt-1 text-sm font-medium text-muted">
              {item.company}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {item.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex gap-2 text-sm leading-relaxed text-muted"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {highlight}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
