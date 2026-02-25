"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex items-center justify-center p-6 bg-white text-slate-900">
        <div className="max-w-md w-full rounded-3xl border bg-white p-6">
          <div className="text-sm font-semibold text-[rgb(var(--g2))]">Something went wrong</div>
          <h1 className="mt-2 text-xl font-semibold">Please try again</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            If this keeps happening, contact support.
          </p>
          <button
            onClick={reset}
            className="mt-5 w-full rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold"
          >
            Reload
          </button>
          <div className="mt-3 text-[11px] text-muted-foreground break-all">
            {error?.digest ? `Digest: ${error.digest}` : ""}
          </div>
        </div>
      </body>
    </html>
  );
}
