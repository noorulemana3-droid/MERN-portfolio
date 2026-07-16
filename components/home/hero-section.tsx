"use client";

import { motion } from "framer-motion";
import { Download, FileText, FolderGit2, Mail } from "lucide-react";
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
        <div className="absolute left-[8%] top-[18%] h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute right-[6%] top-[28%] h-72 w-72 rounded-full bg-accent-secondary/15 blur-3xl" />
        <div className="absolute bottom-[12%] left-[35%] h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container-narrow relative z-10 grid items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent"
          >
            {SITE.subtitle}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {SITE.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-xl font-medium text-muted sm:text-2xl"
          >
            I&apos;m a{" "}
            <span aria-live="polite">
              <span className="gradient-text">{text}</span>
              <span className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-accent align-middle" />
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="#projects"
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold gradient-btn shadow-lg shadow-accent/20 transition duration-300 hover:shadow-accent/30"
            >
              <FolderGit2 className="h-4 w-4" />
              View Projects
            </a>
            <a
              href="#resume"
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-5 py-2.5 text-sm font-semibold text-foreground transition duration-300 hover:border-accent/40 hover:text-accent"
            >
              <FileText className="h-4 w-4" />
              View Resume
            </a>
            <a
              href={SITE.resumePath}
              download
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-5 py-2.5 text-sm font-semibold text-foreground transition duration-300 hover:border-accent/40 hover:text-accent"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
            <a
              href="#contact"
              className="focus-ring relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-muted transition duration-300 hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              Contact Me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-8"
          >
            <SocialIcons links={SOCIAL_LINKS} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          <div className="glass relative overflow-hidden rounded-3xl p-8 shadow-xl shadow-black/5 md:p-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-accent-secondary/20 blur-3xl" />
            <p className="relative font-display text-2xl font-bold text-foreground">
              {SITE.panelTitle}
            </p>
            <p className="relative mt-4 text-sm leading-relaxed text-muted">
              {SITE.panelBody}
            </p>
            <div className="relative mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
