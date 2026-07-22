import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "eyebrow",
            align === "center" ? "justify-center" : "eyebrow-line",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.85rem] md:leading-[1.08]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
      <div
        className={cn(
          "mt-7 h-[2px] w-20 rounded-full bg-gradient-to-r from-accent via-accent-secondary to-transparent",
          align === "center" && "mx-auto",
        )}
      />
    </div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("section-pad scroll-mt-24", className)}>
      <div className="container-narrow">{children}</div>
    </section>
  );
}
