export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdminTrustedDevice } from "@/lib/auth/server";
import { adminDb } from "@/lib/firebase/admin";

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="text-xs rounded-full border px-3 py-1">{children}</span>;
}

export default async function AdminDashboardPage() {
  await requireAdminTrustedDevice("/admin");

  const snap = await adminDb.collection("applications").orderBy("createdAt", "desc").limit(120).get();
  const apps = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  const total = apps.length;
  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  for (const a of apps) {
    byType[a.type] = (byType[a.type] || 0) + 1;
    byStatus[a.status] = (byStatus[a.status] || 0) + 1;
  }

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage website content, applications, and messages here.
          </p>
        </div>
        <Pill>Recent items: {total}</Pill>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Link className="rounded-3xl border p-5 hover:bg-slate-50 transition" href="/admin/content">
          <div className="font-semibold">Edit Website</div>
          <div className="mt-2 text-sm text-muted-foreground">Change text + image links.</div>
        </Link>
        <Link className="rounded-3xl border p-5 hover:bg-slate-50 transition" href="/admin/applications">
          <div className="font-semibold">Applications</div>
          <div className="mt-2 text-sm text-muted-foreground">Approve / reject + notes.</div>
        </Link>
        <Link className="rounded-3xl border p-5 hover:bg-slate-50 transition" href="/admin/messages">
          <div className="font-semibold">Messages</div>
          <div className="mt-2 text-sm text-muted-foreground">Send bulk emails.</div>
        </Link>
        <Link className="rounded-3xl border p-5 hover:bg-slate-50 transition" href="/admin/settings">
          <div className="font-semibold">Settings</div>
          <div className="mt-2 text-sm text-muted-foreground">Contacts + addresses.</div>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border p-6">
          <div className="font-semibold">By status (recent)</div>
          <div className="mt-4 grid gap-2 text-sm">
            {Object.keys(byStatus).length === 0 ? (
              <div className="text-muted-foreground">No applications yet.</div>
            ) : (
              Object.entries(byStatus).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-2xl border px-4 py-3">
                  <div className="capitalize">{k.replaceAll("_", " ")}</div>
                  <Pill>{v}</Pill>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border p-6">
          <div className="font-semibold">By type (recent)</div>
          <div className="mt-4 grid gap-2 text-sm">
            {Object.keys(byType).length === 0 ? (
              <div className="text-muted-foreground">No applications yet.</div>
            ) : (
              Object.entries(byType).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-2xl border px-4 py-3">
                  <div className="capitalize">{k}</div>
                  <Pill>{v}</Pill>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border p-6">
        <div className="font-semibold">Recent submissions</div>
        <div className="mt-4 grid gap-3">
          {apps.slice(0, 8).map((a) => (
            <Link
              key={a.id}
              href="/admin/applications"
              className="rounded-2xl border px-4 py-3 hover:bg-slate-50 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold capitalize">{a.type}</div>
                <Pill>{a.status}</Pill>
              </div>
              <div className="mt-1 text-xs text-muted-foreground font-mono">{a.id}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
