import Image from "next/image";
import { LayoutDashboard, Mail, ShieldCheck, Sun } from "lucide-react";
import { SITE } from "@/data/portfolio";

const FEATURES = [
  { icon: Mail, label: "Contact inbox" },
  { icon: LayoutDashboard, label: "Live dashboard" },
  { icon: ShieldCheck, label: "Secure 2FA" },
];

export function LoginShowcase() {
  return (
    <aside className="relative hidden min-h-[36rem] overflow-hidden rounded-3xl border border-accent/20 lg:block">
      <Image
        src="/images/login-sunny.png"
        alt=""
        fill
        priority
        sizes="(min-width:1024px) 55vw, 100vw"
        className="object-cover object-center"
      />

      {/* Warm sunny overlays matching Ember orange theme */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#1a0c05]/92 via-[#c2410c]/25 to-[#fbbf24]/15"
      />
      <div
        aria-hidden
        className="login-sun-rays absolute inset-0 opacity-60"
      />
      <div
        aria-hidden
        className="absolute -right-12 top-8 h-72 w-72 rounded-full bg-amber-300/35 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -left-10 bottom-10 h-56 w-56 rounded-full bg-orange-500/30 blur-3xl"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-8 xl:p-10">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-100 backdrop-blur-md">
            <Sun className="h-3.5 w-3.5 text-amber-300" />
            Portfolio command center
          </p>
          <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-white xl:text-[2.6rem] xl:leading-[1.1]">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-100 bg-clip-text text-transparent">
              {SITE.shortName}
            </span>
            &apos;s admin space.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-orange-50/80 xl:text-base">
            Sign in to manage contact queries, update statuses, and keep your
            portfolio conversations organized.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/20 bg-black/25 p-5 shadow-2xl shadow-orange-950/40 backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200/90">
            What you can do
          </p>
          <ul className="mt-4 grid gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-2.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/50 to-amber-400/40 text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-white/95">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-xs text-orange-100/55">
          Protected access · reCAPTCHA · rate limited
        </p>
      </div>
    </aside>
  );
}
