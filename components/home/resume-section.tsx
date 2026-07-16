"use client";

import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { SITE } from "@/data/portfolio";
import { Section, SectionHeading } from "@/components/ui/section";

export function ResumeSection() {
  return (
    <Section id="resume">
      <SectionHeading
        eyebrow="Resume"
        title="Credentials at a glance"
        description="Preview the PDF inline or download a copy for recruiting workflows."
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass mx-auto max-w-3xl rounded-2xl p-6 shadow-xl shadow-black/5 md:p-8"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                {SITE.name} — Resume
              </h3>
              <p className="mt-1 text-sm text-muted">
                Last updated: July 2026 · PDF
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={SITE.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent"
            >
              <FileText className="h-4 w-4" />
              View Resume
            </a>
            <a
              href={SITE.resumePath}
              download
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold gradient-btn shadow-lg shadow-accent/20"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
