export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";

function fmt(ms: number) {
  try { return new Date(ms).toLocaleString(); } catch { return ""; }
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="text-xs rounded-full border px-3 py-1">{children}</span>;
}

export default async function AccountPage() {
  const user = await requireUser("/account");

  const snap = await adminDb.collection("applications").orderBy("createdAt", "desc").limit(250).get();
  const items = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as any) }))
    .filter((x) => x.userId === user.uid);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="rounded-3xl border bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your submissions show here.</p>
          </div>
          <Pill>{user.email}</Pill>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Link href="/services/loan" className="rounded-3xl border p-5 hover:bg-slate-50 transition">
            <div className="font-semibold">Loan</div>
            <div className="mt-2 text-sm text-muted-foreground">Apply for loan.</div>
          </Link>
          <Link href="/services/overdraft" className="rounded-3xl border p-5 hover:bg-slate-50 transition">
            <div className="font-semibold">Overdraft</div>
            <div className="mt-2 text-sm text-muted-foreground">Apply for overdraft.</div>
          </Link>
          <Link href="/services/savings" className="rounded-3xl border p-5 hover:bg-slate-50 transition">
            <div className="font-semibold">Savings</div>
            <div className="mt-2 text-sm text-muted-foreground">Start savings.</div>
          </Link>
          <Link href="/services/osusu" className="rounded-3xl border p-5 hover:bg-slate-50 transition">
            <div className="font-semibold">Osusu</div>
            <div className="mt-2 text-sm text-muted-foreground">Choose package.</div>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">My submissions</div>
            <div className="text-sm text-muted-foreground mt-1">Click any item for details.</div>
          </div>
          <Pill>{items.length}</Pill>
        </div>

        <div className="mt-5 grid gap-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border p-6 text-sm text-muted-foreground">
              No submissions yet. Go to <Link className="underline" href="/services">Services</Link>.
            </div>
          ) : (
            items.map((it) => (
              <Link key={it.id} href={`/account/applications/${it.id}`} className="rounded-3xl border p-6 hover:bg-slate-50 transition">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold capitalize">{it.type}</div>
                  <Pill>{it.status}</Pill>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Ref: <span className="font-mono">{it.id}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Submitted: {fmt(it.createdAt)}</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
