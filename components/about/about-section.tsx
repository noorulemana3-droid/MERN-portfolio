"use client";

import { motion } from "framer-motion";
import { ABOUT, ABOUT_PILLARS, SITE } from "@/data/portfolio";
import { Section, SectionHeading } from "@/components/ui/section";

export function AboutSection() {
  return (
    <Section id="about">
      <SectionHeading
        eyebrow={ABOUT.eyebrow}
        title={ABOUT.title}
        description={ABOUT.description}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-8 md:p-10"
        >
          <p className="text-lg leading-relaxed text-foreground/90">
            I&apos;m{" "}
            <span className="font-semibold text-accent">{SITE.name}</span>, a
            Full-Stack MERN Developer focused on building scalable, responsive
            web applications. I care about clean architecture, smooth user
            experiences, and backends that stay dependable under real usage.
          </p>
          <p className="mt-5 text-base leading-relaxed text-muted">
            {ABOUT.body}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {ABOUT_PILLARS.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="glass rounded-2xl p-5"
            >
              <h3 className="font-display text-lg font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
