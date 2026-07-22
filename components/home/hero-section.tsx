"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, FolderGit2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import {
  HERO_ROLES,
  HERO_STATS,
  SITE,
  SOCIAL_LINKS,
} from "@/data/portfolio";
import { SocialIcons } from "@/components/common/social-icons";

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = HERO_ROLES[roleIndex];
    const timeout = window.setTimeout(
      () => {
        if (!deleting && text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else if (!deleting && text.length === current.length) {
          setDeleting(true);
        } else if (deleting && text.length > 0) {
          setText(current.slice(0, text.length - 1));
        } else {
          setDeleting(false);
          setRoleIndex((i) => (i + 1) % HERO_ROLES.length);
        }
      },
      deleting ? 36 : text.length === current.length ? 1500 : 68,
    );

    return () => window.clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="animate-ember-pulse absolute -left-32 -top-8 h-[36rem] w-[36rem] rounded-full bg-[var(--orb-a)] blur-3xl" />
        <div className="animate-drift absolute -right-24 top-24 h-[30rem] w-[30rem] rounded-full bg-[var(--orb-b)] blur-3xl" />
        <div className="animate-float-soft absolute bottom-0 left-[38%] h-64 w-64 rounded-full bg-[var(--orb-c)] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="absolute inset-x-[12%] bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      </div>

      <div className="container-narrow relative z-10 grid items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow eyebrow-line"
          >
            {SITE.subtitle}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl font-bold text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[0.92]"
          >
            {SITE.name}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.28, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 h-[2px] w-24 origin-left rounded-full bg-gradient-to-r from-accent via-accent-secondary to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mt-6 text-xl font-medium text-muted sm:text-2xl"
          >
            I&apos;m a{" "}
            <span aria-live="polite">
              <span className="gradient-text font-semibold">{text}</span>
              <span className="animate-caret ml-0.5 inline-block h-[1.05em] w-[2.5px] bg-accent align-middle" />
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold gradient-btn"
            >
              <FolderGit2 className="h-4 w-4" />
              View Projects
            </a>
            <a
              href={SITE.resumePath}
              download
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-5 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition duration-300 hover:border-accent/50 hover:bg-accent-soft hover:text-accent"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
            <a
              href="#contact"
              className="focus-ring group relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-muted transition duration-300 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Contact
              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mt-10"
          >
            <SocialIcons links={SOCIAL_LINKS} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-accent/20 via-accent-secondary/10 to-transparent blur-2xl" />
          <div className="glass glass-lift relative overflow-hidden rounded-[1.75rem] p-8 md:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/15 blur-2xl" />
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
            <p className="relative font-display text-2xl font-bold leading-snug text-foreground md:text-[1.75rem]">
              {SITE.panelTitle}
            </p>
            <p className="relative mt-4 text-sm leading-relaxed text-muted md:text-[0.95rem]">
              {SITE.panelBody}
            </p>
            <div className="relative mt-10 grid grid-cols-3 gap-3 border-t border-border/70 pt-8 sm:gap-4">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-background/35 px-2 py-3 text-center sm:px-3"
                >
                  <p className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    <span className="gradient-text">{stat.value}</span>
                  </p>
                  <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted sm:text-[11px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
