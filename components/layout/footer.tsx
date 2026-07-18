import Link from "next/link";
import { SITE, SOCIAL_LINKS, NAV_ITEMS } from "@/data/portfolio";
import { SocialIcons } from "@/components/common/social-icons";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background/80 pt-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" />

      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_auto] lg:items-start lg:gap-12">
          <div>
            <p className="font-display text-lg font-bold text-foreground">
              {SITE.shortName}
              <span className="gradient-text">.</span>
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              {SITE.role} · Building clean, scalable web products.
            </p>
            <p className="mt-3 text-xs text-muted">
              © {new Date().getFullYear()} {SITE.name}
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Explore
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {NAV_ITEMS.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Connect
            </p>
            <div className="mt-3">
              <SocialIcons links={SOCIAL_LINKS} />
            </div>
            <Link
              href="/admin"
              className="mt-4 inline-flex text-sm font-medium text-muted transition hover:text-accent focus-ring"
            >
              Admin
            </Link>
          </div>
        </div>

        {/* Clear space so Ask AI + back-to-top never cover footer content */}
        <div className="h-28 sm:h-24" aria-hidden="true" />
      </div>
    </footer>
  );
}
