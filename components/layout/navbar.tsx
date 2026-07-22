"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_ITEMS, SITE } from "@/data/portfolio";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled || open
          ? "border-border/80 bg-[var(--nav)] shadow-[0_8px_30px_-20px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          : "border-transparent bg-transparent",
      )}
    >
      {scrolled ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        />
      ) : null}
      <nav
        className="container-narrow flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        <Link
          href="/#home"
          onClick={() => setOpen(false)}
          className="focus-ring relative z-10 font-display text-lg font-bold tracking-tight text-foreground transition hover:opacity-90"
        >
          {SITE.shortName}
          <span className="gradient-text">.</span>
        </Link>

        <ul className="relative z-10 hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="focus-ring group relative z-10 inline-flex rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-foreground"
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-3 -bottom-0.5 z-0 h-px origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-secondary transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/70 text-foreground lg:hidden focus-ring"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 border-t border-border bg-[var(--nav)] px-4 py-3 lg:hidden">
            <div className="grid gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition hover:bg-card focus-ring"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
