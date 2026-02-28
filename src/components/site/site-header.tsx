import Link from "next/link";
import { publicNav } from "@/lib/nav";
import { getSessionUser } from "@/lib/auth/server";
import LogoutButton from "@/components/site/logout-button";

export default async function SiteHeader() {
  const user = await getSessionUser();
  const email = (user?.email || "").toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const isAdmin = Boolean(email && adminEmail && email === adminEmail);

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

          {/* Apply dropdown */}
          <details className="relative">
            <summary className="list-none cursor-pointer select-none rounded-xl bg-[rgb(var(--g1))] text-white px-4 py-2 text-sm font-semibold hover:opacity-95 transition">
              Apply
            </summary>
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border bg-white shadow-sm p-2">
              <Link href="/services/loan" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Apply for Loan
              </Link>
              <Link href="/services/overdraft" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Apply for Overdraft
              </Link>
              <Link href="/services/savings" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Start Savings
              </Link>
              <Link href="/services/osusu" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Osusu Packages
              </Link>
              <Link href="/services/sales" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Save & Buy (Goods/Services)
              </Link>
              <div className="my-2 h-px bg-slate-100" />
              <Link href="/about#join" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                Membership / Shareholder
              </Link>
            </div>
          </details>

          {/* Account dropdown */}
          <details className="relative">
            <summary className="list-none cursor-pointer select-none rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition">
              {user ? "Account" : "Login"}
            </summary>

            <div className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white shadow-sm p-2">
              {!user ? (
                <>
                  <Link href="/auth/login" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                    Login
                  </Link>
                  <Link href="/auth/register" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                    Create account
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin ? (
                    <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                      Admin dashboard
                    </Link>
                  ) : null}
                  <Link href="/account" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                    My account
                  </Link>
                  <div className="my-2 h-px bg-slate-100" />
                  <LogoutButton className="w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                    Logout
                  </LogoutButton>
                </>
              )}
            </div>
          </details>
        </nav>

        {/* Mobile menu */}
        <details className="md:hidden relative">
          <summary className="cursor-pointer select-none rounded-lg border px-3 py-1.5 text-sm bg-white">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-72 rounded-2xl border bg-white shadow-sm p-2">
            {publicNav.map((n) => (
              <Link key={n.href} href={n.href} className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">
                {n.title}
              </Link>
            ))}

            <div className="my-2 h-px bg-slate-100" />

            <div className="px-3 py-2 text-xs font-semibold text-slate-600">Apply</div>
            <Link href="/services/loan" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Apply for Loan</Link>
            <Link href="/services/overdraft" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Apply for Overdraft</Link>
            <Link href="/services/savings" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Start Savings</Link>
            <Link href="/services/osusu" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Osusu Packages</Link>
            <Link href="/services/sales" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Save & Buy</Link>
            <Link href="/about#join" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Membership / Shareholder</Link>

            <div className="my-2 h-px bg-slate-100" />

            <div className="px-3 py-2 text-xs font-semibold text-slate-600">{user ? "Account" : "Login"}</div>
            {!user ? (
              <>
                <Link href="/auth/login" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Login</Link>
                <Link href="/auth/register" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Create account</Link>
              </>
            ) : (
              <>
                {isAdmin ? <Link href="/admin" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Admin dashboard</Link> : null}
                <Link href="/account" className="block rounded-xl px-3 py-2 text-sm hover:bg-slate-50">My account</Link>
                <LogoutButton className="w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-slate-50">Logout</LogoutButton>
              </>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
