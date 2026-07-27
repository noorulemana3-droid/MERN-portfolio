import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section-shell flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white"
      >
        Back home
      </Link>
    </div>
  );
}
