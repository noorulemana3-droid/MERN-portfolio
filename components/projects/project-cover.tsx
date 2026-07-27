"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProjectCoverProps = {
  title: string;
  image: string;
  href?: string;
  variant?: "desktop" | "mobile";
  className?: string;
  priority?: boolean;
};

export function ProjectCover({
  title,
  image,
  href,
  variant = "desktop",
  className,
  priority = false,
}: ProjectCoverProps) {
  const isMobile = variant === "mobile";

  const frame = (
    <div
      className={cn(
        "relative overflow-hidden bg-[#0B1120]",
        isMobile ? "aspect-[9/16] max-h-full" : "aspect-[16/9] min-h-[280px] sm:min-h-[320px] lg:min-h-[380px]",
        className,
      )}
    >
      {!isMobile ? (
        <div className="relative z-10 flex items-center gap-2 border-b border-white/10 bg-[#111827] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-2 flex-1 truncate rounded-md bg-white/5 px-3 py-1 font-mono text-[10px] text-white/45">
            {title}
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex items-center justify-center border-b border-white/10 bg-[#111827] py-2">
          <div className="h-1.5 w-16 rounded-full bg-white/20" />
        </div>
      )}

      <div
        className={cn(
          "relative w-full",
          isMobile ? "h-[calc(100%-1.75rem)]" : "h-[calc(100%-2.25rem)]",
        )}
      >
        <Image
          src={image}
          alt={`${title} product screen`}
          fill
          priority={priority}
          sizes={
            isMobile
              ? "(max-width:768px) 50vw, 240px"
              : "(max-width:1024px) 100vw, 50vw"
          }
          className="object-cover object-top"
        />
      </div>

      {href ? (
        <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/55 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-background/80 px-3 py-1.5 text-sm font-semibold text-foreground backdrop-blur-md">
            View details
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      ) : null}
    </div>
  );

  if (!href) return frame;

  return (
    <Link
      href={href}
      className="block rounded-[inherit] focus-ring"
      aria-label={`Open ${title}`}
    >
      {frame}
    </Link>
  );
}
