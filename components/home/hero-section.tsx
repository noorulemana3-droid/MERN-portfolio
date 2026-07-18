"use client";

import { motion } from "framer-motion";
import { Download, FolderGit2, Mail } from "lucide-react";
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
      deleting ? 40 : text.length === current.length ? 1400 : 70,
    );

    return () => window.clearTimeout(timeout);
  }, [text, deleting, roleIndex]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-24 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-16 top-40 h-[26rem] w-[26rem] rounded-full bg-accent-secondary/10 blur-3xl" />
        <div className="animate-float-soft absolute bottom-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container-narrow relative z-10 grid items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow eyebrow-line"
          >
            {SITE.subtitle}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.55 }}
            className="font-display text-5xl font-bold text-foreground sm:text-6xl md:text-7xl lg:text-[5.25rem] lg:leading-[0.95]"
          >
            {SITE.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 text-xl font-medium text-muted sm:text-2xl"
          >
            I&apos;m a{" "}
            <span aria-live="polite">
              <span className="gradient-text font-semibold">{text}</span>
              <span className="ml-0.5 inline-block h-[1.05em] w-[2px] animate-pulse bg-accent align-middle" />
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold gradient-btn transition duration-300"
            >
              <FolderGit2 className="h-4 w-4" />
              View Projects
            </a>
            <a
              href={SITE.resumePath}
              download
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-5 py-3 text-sm font-semibold text-foreground transition duration-300 hover:border-accent/45 hover:text-accent"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
            <a
              href="#contact"
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted transition duration-300 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-9"
          >
            <SocialIcons links={SOCIAL_LINKS} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.65 }}
          className="relative"
        >
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/15 via-transparent to-accent-secondary/15 blur-xl" />
          <div className="glass relative overflow-hidden rounded-[1.75rem] p-8 md:p-10">
            <div className="absolute right-0 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
            <p className="relative font-display text-2xl font-bold leading-snug text-foreground md:text-[1.7rem]">
              {SITE.panelTitle}
            </p>
            <p className="relative mt-4 text-sm leading-relaxed text-muted md:text-[0.95rem]">
              {SITE.panelBody}
            </p>
            <div className="relative mt-10 grid grid-cols-3 gap-4 border-t border-border/80 pt-8">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted sm:text-xs">
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
