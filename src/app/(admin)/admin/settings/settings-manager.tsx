"use client";

import { useEffect, useState } from "react";

export default function SettingsManager() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [data, setData] = useState<any>(null);

  async function load() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings");
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.message || "Failed to load");
      setData(j.data);
    } catch (e: any) {
      setMsg(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.message || "Failed to save");
      setMsg("Saved.");
    } catch (e: any) {
      setMsg(e.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading || !data) {
    return <div className="rounded-3xl border bg-white p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="rounded-3xl border bg-white p-6 space-y-4">
      {msg ? <div className="text-sm text-slate-700">{msg}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <div className="text-sm font-semibold">Public email</div>
          <input className="w-full rounded-2xl border px-4 py-3 text-sm" value={data.publicEmail || ""} onChange={(e) => setData({ ...data, publicEmail: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <div className="text-sm font-semibold">WhatsApp</div>
          <input className="w-full rounded-2xl border px-4 py-3 text-sm" value={data.whatsapp || ""} onChange={(e) => setData({ ...data, whatsapp: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <div className="text-sm font-semibold">Call</div>
          <input className="w-full rounded-2xl border px-4 py-3 text-sm" value={data.call || ""} onChange={(e) => setData({ ...data, call: e.target.value })} />
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-1.5">
          <div className="text-sm font-semibold">Head office address</div>
          <textarea className="w-full rounded-2xl border px-4 py-3 text-sm" rows={3} value={data.headOfficeAddress || ""} onChange={(e) => setData({ ...data, headOfficeAddress: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <div className="text-sm font-semibold">Branch office address</div>
          <textarea className="w-full rounded-2xl border px-4 py-3 text-sm" rows={3} value={data.branchOfficeAddress || ""} onChange={(e) => setData({ ...data, branchOfficeAddress: e.target.value })} />
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save settings"}
      </button>
    </div>
  );
}
