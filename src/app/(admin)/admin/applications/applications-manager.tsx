"use client";

import { useEffect, useMemo, useState } from "react";

type AppItem = {
  id: string;
  type: string;
  status: string;
  createdAt: number;
  applicantEmail?: string;
  applicantData?: any;
  uploads?: any;
  adminNotes?: any[];
};

function fmtDate(ms: number) {
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return "";
  }
}

export default function ApplicationsManager() {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AppItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<AppItem | null>(null);

  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [noteToApplicant, setNoteToApplicant] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return items.find((x) => x.id === selectedId) || null;
  }, [items, selectedId]);

  async function loadList() {
    setLoading(true);
    setMsg(null);
    try {
      const sp = new URLSearchParams();
      if (type) sp.set("type", type);
      if (status) sp.set("status", status);
      if (q) sp.set("q", q);

      const res = await fetch(`/api/admin/applications?${sp.toString()}`);
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.message || "Failed");
      setItems(j.items || []);
      if (!selectedId && (j.items || []).length) setSelectedId(j.items[0].id);
    } catch (e: any) {
      setMsg(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id: string) {
    setDetailLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.message || "Failed to load detail");
      setDetail(j.item);
      setNewStatus(j.item.status || "");
    } catch (e: any) {
      setMsg(e.message || "Failed");
    } finally {
      setDetailLoading(false);
    }
  }

  async function saveUpdate() {
    if (!detail) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/applications/${detail.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNote: adminNote || "",
          noteToApplicant: noteToApplicant || "",
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.message || "Failed to save");

      setAdminNote("");
      setNoteToApplicant("");
      setMsg("Saved.");

      await loadList();
      await loadDetail(detail.id);
    } catch (e: any) {
      setMsg(e.message || "Failed");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedId) loadDetail(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      {/* LEFT: list */}
      <div className="rounded-3xl border bg-white p-4">
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <select className="rounded-2xl border px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All types</option>
              <option value="loan">Loan</option>
              <option value="overdraft">Overdraft</option>
              <option value="job">Job</option>
              <option value="membership">Membership</option>
              <option value="savings">Savings</option>
              <option value="osusu">Osusu</option>
              <option value="sales">Sales</option>
            </select>

            <select className="rounded-2xl border px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All status</option>
              <option value="submitted">Submitted</option>
              <option value="in_review">In review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={loadList}
              className="rounded-2xl bg-[rgb(var(--g1))] text-white px-4 py-2 text-sm font-semibold"
              disabled={loading}
            >
              {loading ? "Loading..." : "Filter"}
            </button>
          </div>

          <input
            className="rounded-2xl border px-3 py-2 text-sm"
            placeholder="Search name/phone/email/ref..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") loadList(); }}
          />

          {msg ? <div className="text-sm text-slate-600">{msg}</div> : null}
        </div>

        <div className="mt-4 divide-y">
          {items.length === 0 ? (
            <div className="py-6 text-sm text-muted-foreground">No applications found.</div>
          ) : (
            items.map((it) => (
              <button
                key={it.id}
                onClick={() => setSelectedId(it.id)}
                className={`w-full text-left py-3 px-2 rounded-2xl mt-2 hover:bg-slate-50 ${
                  selectedId === it.id ? "bg-slate-50" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm capitalize">{it.type}</div>
                  <div className="text-[11px] rounded-full border px-2 py-0.5">{it.status}</div>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {(it.applicantData?.fullName || "Unknown")} • {fmtDate(it.createdAt)}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground font-mono">{it.id}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: details */}
      <div className="rounded-3xl border bg-white p-5">
        {!selectedId ? (
          <div className="text-sm text-muted-foreground">Select an application to view details.</div>
        ) : detailLoading ? (
          <div className="text-sm text-muted-foreground">Loading details...</div>
        ) : !detail ? (
          <div className="text-sm text-muted-foreground">No detail found.</div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-[rgb(var(--g2))] uppercase">Application</div>
              <div className="mt-1 text-lg font-semibold capitalize">{detail.type}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Ref: <span className="font-mono">{detail.id}</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">Submitted: {fmtDate(detail.createdAt)}</div>
            </div>

            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="font-semibold text-sm">Applicant</div>
              <div className="mt-2 text-sm grid gap-1">
                <div><b>Name:</b> {detail.applicantData?.fullName || "-"}</div>
                <div><b>Phone:</b> {detail.applicantData?.phone || "-"}</div>
                <div><b>Email:</b> {detail.applicantEmail || detail.applicantData?.email || "-"}</div>
                <div><b>Address:</b> {detail.applicantData?.address || "-"}</div>
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="font-semibold text-sm">Uploads</div>
              <div className="mt-2 grid gap-2 text-sm">
                {detail.uploads?.passport ? <a className="underline" target="_blank" href={detail.uploads.passport}>Passport image</a> : <div className="text-muted-foreground">Passport: -</div>}
                {detail.uploads?.idCard ? <a className="underline" target="_blank" href={detail.uploads.idCard}>ID card image</a> : null}
                {detail.uploads?.proofOfAddress ? <a className="underline" target="_blank" href={detail.uploads.proofOfAddress}>Proof of address image</a> : null}
                {detail.uploads?.savingsCard ? <a className="underline" target="_blank" href={detail.uploads.savingsCard}>Savings card image</a> : null}
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="font-semibold text-sm">Update status & notes</div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <div className="text-sm font-semibold">Status</div>
                  <select className="w-full rounded-2xl border px-3 py-2 text-sm" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="submitted">submitted</option>
                    <option value="in_review">in_review</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm font-semibold">Quick actions</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setNewStatus("approved")}
                      className="rounded-2xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setNewStatus("rejected")}
                      className="rounded-2xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setNewStatus("in_review")}
                      className="rounded-2xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                    >
                      In review
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="space-y-1.5">
                  <div className="text-sm font-semibold">Internal admin note (not sent)</div>
                  <textarea
                    className="w-full rounded-2xl border px-3 py-2 text-sm"
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Write internal note..."
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm font-semibold">Note to applicant (optional: will be emailed)</div>
                  <textarea
                    className="w-full rounded-2xl border px-3 py-2 text-sm"
                    rows={3}
                    value={noteToApplicant}
                    onChange={(e) => setNoteToApplicant(e.target.value)}
                    placeholder="Write a message that the applicant will receive..."
                  />
                </div>

                <button
                  onClick={saveUpdate}
                  disabled={saving}
                  className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save update"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border p-4 bg-slate-50">
              <div className="font-semibold text-sm">Notes history</div>
              <div className="mt-2 space-y-2 text-sm">
                {(detail.adminNotes || []).length === 0 ? (
                  <div className="text-muted-foreground">No notes yet.</div>
                ) : (
                  (detail.adminNotes || []).slice().reverse().map((n: any, idx: number) => (
                    <div key={idx} className="rounded-xl border bg-white p-3">
                      <div className="text-[11px] text-muted-foreground">
                        {n.kind || "note"} • {n.at ? fmtDate(n.at) : ""}
                      </div>
                      <div className="mt-1">{n.note}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

