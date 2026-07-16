import Link from "next/link";
import { SITE, SOCIAL_LINKS, NAV_ITEMS } from "@/data/portfolio";
import { SocialIcons } from "@/components/common/social-icons";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container-narrow flex flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-display text-lg font-bold text-foreground">
            {SITE.shortName}
            <span className="gradient-text">.</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            © {new Date().getFullYear()} {SITE.name}. Built with Next.js.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {NAV_ITEMS.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <SocialIcons links={SOCIAL_LINKS} />
        </div>
      </div>
    </footer>
  );
}
