import {
  LayoutDashboard,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SITE } from "@/data/portfolio";

const HIGHLIGHTS = [
  {
    icon: Mail,
    title: "Contact inbox",
    body: "Every portfolio message lands here with status tracking.",
  },
  {
    icon: LayoutDashboard,
    title: "Live dashboard",
    body: "Pending, resolved, and recent queries at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Secured access",
    body: "reCAPTCHA, rate limits, and optional authenticator 2FA.",
  },
];

export function LoginShowcase() {
  return (
    <aside className="relative hidden min-h-[32rem] overflow-hidden rounded-3xl border border-border/60 lg:block">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,color-mix(in_oklab,var(--accent)_28%,transparent),transparent_55%),radial-gradient(ellipse_70%_50%_at_90%_80%,color-mix(in_oklab,var(--accent-secondary)_18%,transparent),transparent_50%),linear-gradient(160deg,#0c0907_0%,#16110d_45%,#0a0806_100%)]"
      />
      <div
        aria-hidden
        className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-10 bottom-8 h-52 w-52 rounded-full bg-accent-secondary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, white 12%, transparent) 0.6px, transparent 0.6px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Admin workspace
          </p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-foreground xl:text-4xl">
            Manage{" "}
            <span className="gradient-text">{SITE.shortName}</span>
            &apos;s portfolio contacts with clarity.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted xl:text-base">
            Review new queries, update status, and keep recruiter conversations
            organized — all from one secure dashboard.
          </p>
        </div>

        {/* Mini dashboard preview */}
        <div className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-4 shadow-2xl shadow-black/40 backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-white/40">
              dashboard preview
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total", value: "20+" },
              { label: "Pending", value: "—" },
              { label: "Resolved", value: "—" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/8 bg-white/5 px-2.5 py-3 text-center"
              >
                <p className="font-display text-lg font-bold text-accent">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/45">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {["New contact query", "Internship inquiry", "Collaboration ask"].map(
              (row) => (
                <div
                  key={row}
                  className="flex items-center justify-between rounded-lg border border-white/6 bg-white/[0.03] px-3 py-2"
                >
                  <span className="truncate text-xs text-white/70">{row}</span>
                  <span className="shrink-0 rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent">
                    Pending
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        <ul className="space-y-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
