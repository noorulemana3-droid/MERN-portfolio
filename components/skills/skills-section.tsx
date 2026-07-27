"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FEATURED_SKILLS, SKILL_GROUPS } from "@/data/portfolio";
import { Section, SectionHeading } from "@/components/ui/section";

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="font-mono text-xs text-muted">{level}%</span>
      </div>
      <div className="skill-progress-track">
        <motion.div
          className="skill-progress-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Skills"
        title="A toolkit built for shipping"
        description="Core stack proficiency with animated progress — plus the broader areas I work across."
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mb-8 rounded-[1.25rem] glass glass-lift p-6 md:p-8"
      >
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              Core proficiency
            </h3>
            <p className="mt-1 text-sm text-muted">
              Primary technologies for MERN and modern full-stack work.
            </p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURED_SKILLS.map((skill, index) => (
            <SkillBar
              key={skill.name}
              name={skill.name}
              level={skill.level}
              delay={index * 0.06}
            />
          ))}
        </div>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2">
        {SKILL_GROUPS.map((group, index) => (
          <motion.article
            key={group.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="rounded-[1.25rem] glass glass-lift p-6 md:p-7"
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
                <span key={skill} className="skill-chip">
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
