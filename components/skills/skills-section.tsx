"use client";

import { motion } from "framer-motion";
import { SKILL_GROUPS } from "@/data/portfolio";
import { Section, SectionHeading } from "@/components/ui/section";

export function SkillsSection() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Skills"
        title="A toolkit built for shipping"
        description="Organized by focus areas — from MERN fundamentals to systems coursework."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {SKILL_GROUPS.map((group, index) => (
          <motion.article
            key={group.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="glass rounded-2xl p-6 md:p-7"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {group.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{group.description}</p>
              </div>
              <span className="shrink-0 rounded-md border border-border px-2.5 py-1 text-xs text-muted">
                {group.skills.length} skills
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-border bg-background/50 px-3 py-1.5 text-xs font-medium text-foreground/90"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
