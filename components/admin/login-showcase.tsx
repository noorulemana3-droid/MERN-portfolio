import Image from "next/image";
import { LayoutDashboard, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { SITE } from "@/data/portfolio";

const FEATURES = [
  { icon: Mail, label: "Contact inbox" },
  { icon: LayoutDashboard, label: "Live dashboard" },
  { icon: ShieldCheck, label: "Secure 2FA" },
];

export function LoginShowcase() {
  return (
    <aside className="relative hidden min-h-[36rem] overflow-hidden rounded-3xl border border-white/10 lg:block">
      <Image
        src="/images/login-galaxy.png"
        alt=""
        fill
        priority
        sizes="(min-width:1024px) 55vw, 100vw"
        className="object-cover object-center"
      />

      {/* Cosmic overlays */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#05010f]/95 via-[#0b0620]/45 to-[#12082a]/25"
      />
      <div
        aria-hidden
        className="login-stars absolute inset-0 opacity-80"
      />
      <div
        aria-hidden
        className="absolute -left-10 top-1/4 h-56 w-56 rounded-full bg-violet-500/25 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-8 bottom-1/4 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-100 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Portfolio command center
          </p>
          <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white xl:text-[2.6rem] xl:leading-[1.1]">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
              {SITE.shortName}
            </span>
            &apos;s admin space.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-violet-100/75 xl:text-base">
            Sign in to manage contact queries, update statuses, and keep your
            portfolio conversations organized.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-violet-950/40 backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
            What you can do
          </p>
          <ul className="mt-4 grid gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/40 to-cyan-400/30 text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-white/90">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-xs text-violet-100/50">
          Protected access · reCAPTCHA · rate limited
        </p>
      </div>
    </aside>
  );
}
