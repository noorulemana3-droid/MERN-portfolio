"use client";

import { motion } from "framer-motion";
import { EDUCATION } from "@/data/portfolio";
import { Section, SectionHeading } from "@/components/ui/section";

export function EducationSection() {
  return (
    <Section id="education">
      <SectionHeading
        eyebrow="Education"
        title="Academic foundation"
        description="Building engineering depth while shipping real software."
      />

      <div className="mx-auto max-w-3xl space-y-5">
        {EDUCATION.map((edu, index) => (
          <motion.article
            key={edu.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="glass rounded-2xl p-6 shadow-xl shadow-black/5 md:p-8"
          >
            <p className="text-sm text-muted">
              {edu.startDate} – {edu.endDate}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-foreground">
              {edu.institution}
            </h3>
            <p className="mt-1 text-base text-muted">{edu.degree}</p>
            {edu.gpa ? (
              <p className="mt-2 text-sm text-muted">GPA: {edu.gpa}</p>
            ) : null}
            <ul className="mt-4 space-y-2">
              {edu.highlights.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed text-muted"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
