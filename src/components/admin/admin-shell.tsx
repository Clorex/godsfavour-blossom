import Link from "next/link";
import { adminNav } from "@/lib/nav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-50">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border bg-white p-4 h-fit lg:sticky lg:top-6">
            <div className="px-2 py-2">
              <div className="text-sm font-semibold">Admin Panel</div>
              <div className="text-xs text-muted-foreground mt-1">Godsfavour Blossom</div>
            </div>
            <div className="mt-3 space-y-1">
              {adminNav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="block rounded-2xl px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  {n.title}
                </Link>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border bg-slate-50 p-3 text-xs text-muted-foreground">
              Tip: Use <b>Content</b> to edit website text and image URLs any time.
            </div>
          </aside>

          <main className="rounded-3xl border bg-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
