import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border bg-white p-6">
        <div className="text-sm font-semibold text-[rgb(var(--g2))]">404</div>
        <h1 className="mt-2 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you’re looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
