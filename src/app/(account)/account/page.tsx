export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireUser } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";

function fmt(ms: number) {
  try { return new Date(ms).toLocaleString(); } catch { return ""; }
}

export default async function AccountPage() {
  const user = await requireUser("/account");

  // Index-free approach: pull recent and filter in-memory (good for small/medium usage)
  const snap = await adminDb.collection("applications").orderBy("createdAt", "desc").limit(250).get();
  const items = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as any) }))
    .filter((x) => x.userId === user.uid);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Your Account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Your submitted applications appear here. Click any item for details.
      </p>

      <div className="mt-8 grid gap-4">
        {items.length === 0 ? (
          <div className="rounded-3xl border bg-white p-7 text-sm text-muted-foreground">
            No submissions yet. Go to <Link className="underline" href="/services">Services</Link> to apply.
          </div>
        ) : (
          items.map((it) => (
            <Link
              key={it.id}
              href={`/account/applications/${it.id}`}
              className="rounded-3xl border bg-white p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold capitalize">{it.type} application</div>
                <div className="text-xs rounded-full border px-3 py-1">{it.status}</div>
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
  );
}
