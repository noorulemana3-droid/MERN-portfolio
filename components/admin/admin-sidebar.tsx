"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/actions/auth";
import { SITE } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/contacts", label: "Contacts", icon: Mail },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition focus-ring",
              active
                ? "bg-accent text-white dark:text-[#071018]"
                : "text-muted hover:bg-accent-soft hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:hidden">
        <p className="font-display text-sm font-bold text-foreground">
          {SITE.shortName} Admin
        </p>
        <button
          type="button"
          className="rounded-xl border border-border p-2 focus-ring"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open ? (
        <div className="border-b border-border lg:hidden">
          {nav}
          <div className="space-y-2 border-t border-border p-3">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground focus-ring"
            >
              <ExternalLink className="h-4 w-4" />
              View site
            </Link>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="secondary"
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </form>
          </div>
        </div>
      ) : null}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
        <div className="border-b border-border px-5 py-5">
          <p className="font-display text-lg font-bold text-foreground">
            {SITE.shortName}
            <span className="gradient-text">.</span> Admin
          </p>
          <p className="mt-1 truncate text-xs text-muted">{adminName}</p>
        </div>
        {nav}
        <div className="mt-auto space-y-2 border-t border-border p-3">
          <Link
            href="/"
            className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-accent-soft hover:text-foreground focus-ring"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="secondary"
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
