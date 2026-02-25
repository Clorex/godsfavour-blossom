import Link from "next/link";
import { publicNav } from "@/lib/nav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/75 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight text-slate-900">
          Godsfavour Blossom
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {publicNav.map((n) => (
            <Link key={n.href} href={n.href} className="text-slate-700 hover:text-slate-900">
              {n.title}
            </Link>
          ))}

          <details className="relative">
            <summary className="list-none cursor-pointer select-none rounded-xl bg-[rgb(var(--g1))] text-white px-4 py-2 text-sm font-semibold hover:opacity-95 transition">
              Apply
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white shadow-sm p-2">
              <Link href="/services/loan" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Apply for Loan
              </Link>
              <Link href="/services/overdraft" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Apply for Overdraft
              </Link>
              <div className="my-2 h-px bg-slate-100" />
              <Link href="/about#join" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Membership / Shareholder
              </Link>
            </div>
          </details>
        </nav>

        <details className="md:hidden relative">
          <summary className="cursor-pointer select-none rounded-lg border px-3 py-1.5 text-sm bg-white">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-64 rounded-2xl border bg-white shadow-sm p-2">
            {publicNav.map((n) => (
              <Link key={n.href} href={n.href} className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                {n.title}
              </Link>
            ))}
            <div className="mt-2 rounded-xl border p-2">
              <div className="px-2 py-1 text-xs font-semibold text-slate-600">Apply</div>
              <Link href="/services/loan" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Apply for Loan
              </Link>
              <Link href="/services/overdraft" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Apply for Overdraft
              </Link>
              <Link href="/about#join" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Membership / Shareholder
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
