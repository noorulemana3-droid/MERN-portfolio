"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="section-shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h2 className="font-display text-3xl font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="mt-3 max-w-md text-sm text-muted">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white dark:text-[#07120e]"
      >
        Try again
      </button>
    </div>
  );
}
