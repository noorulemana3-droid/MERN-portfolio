import Link from "next/link";
import { SITE, SOCIAL_LINKS, NAV_ITEMS } from "@/data/portfolio";
import { SocialIcons } from "@/components/common/social-icons";

export function Footer() {
  return (
    <footer className="relative border-t border-border pb-28 pt-12 sm:pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
      <div className="container-narrow flex flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-display text-lg font-bold text-foreground">
            {SITE.shortName}
            <span className="gradient-text">.</span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {SITE.role} · Building clean, scalable web products.
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span>© {new Date().getFullYear()} {SITE.name}</span>
            <span aria-hidden className="text-border">
              ·
            </span>
            <Link
              href="/login"
              className="transition hover:text-accent"
            >
              Admin
            </Link>
          </p>
        </div>

        <div className="flex flex-col items-start gap-5 lg:items-end">
          <div className="flex flex-wrap items-center gap-4">
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted transition hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <SocialIcons links={SOCIAL_LINKS} />
        </div>
      </div>
    </footer>
  );
}
