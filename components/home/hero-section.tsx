"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, FolderGit2, Mail, Sparkles } from "lucide-react";
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
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden pt-20"
    >
      <div className="container-narrow relative z-10 grid items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:px-8 lg:py-24">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent-soft px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {SITE.subtitle}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 }}
            className="text-sm font-medium text-muted sm:text-base"
          >
            Hi, I&apos;m
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-1 font-display text-5xl font-bold text-foreground sm:text-6xl md:text-7xl lg:text-[5.75rem] lg:leading-[0.9]"
          >
            <span className="gradient-text">{SITE.name}</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.32, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 h-[3px] w-28 origin-left rounded-full bg-gradient-to-r from-accent via-accent-secondary to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-7 text-xl font-medium text-muted sm:text-2xl"
          >
            I&apos;m a{" "}
            <span aria-live="polite">
              <span className="font-semibold text-foreground">{text}</span>
              <span className="animate-caret ml-0.5 inline-block h-[1.05em] w-[2.5px] bg-accent align-middle" />
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
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
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-5 py-3.5 text-sm font-semibold text-foreground backdrop-blur-md transition duration-300 hover:border-accent/50 hover:bg-accent-soft hover:text-accent"
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
            transition={{ delay: 0.34 }}
            className="mt-10"
          >
            <SocialIcons links={SOCIAL_LINKS} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-accent/25 via-accent-secondary/10 to-transparent blur-3xl" />
          <div className="glass glass-lift relative overflow-hidden rounded-[1.85rem] p-8 md:p-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-accent-secondary/15 blur-3xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
              Featured focus
            </p>
            <p className="relative mt-3 font-display text-2xl font-bold leading-snug text-foreground md:text-[1.85rem]">
              {SITE.panelTitle}
            </p>
            <p className="relative mt-4 text-sm leading-relaxed text-muted md:text-[0.95rem]">
              {SITE.panelBody}
            </p>

            <div className="relative mt-10 grid grid-cols-3 gap-2.5 border-t border-border/70 pt-8 sm:gap-3">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/60 bg-background/40 px-2 py-3.5 text-center backdrop-blur-sm sm:px-3"
                >
                  <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
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
