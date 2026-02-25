"use client";

import { useEffect, useState } from "react";

type Broadcast = {
  id: string;
  subject: string;
  audience: string;
  createdAt: number;
  sentAt?: number;
  sentCount?: number;
  recipientCount?: number;
  status?: string;
};

function fmt(ms?: number) {
  if (!ms) return "";
  try { return new Date(ms).toLocaleString(); } catch { return ""; }
}

export default function BroadcastManager() {
  const [subject, setSubject] = useState("");
  const [audience, setAudience] = useState("all_users");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [history, setHistory] = useState<Broadcast[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/admin/broadcasts");
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.message || "Failed");
      setHistory(j.items || []);
    } catch (e: any) {
      setMsg(e.message || "Failed");
    } finally {
      setLoadingHistory(false);
    }
  }

  async function send() {
    setSending(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, audience, message }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) throw new Error(j.message || "Failed to send");

      setMsg(`Sent ${j.sentCount}/${j.recipientCount} emails.`);
      setSubject("");
      setMessage("");
      await loadHistory();
    } catch (e: any) {
      setMsg(e.message || "Failed");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => { loadHistory(); }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <div className="rounded-3xl border bg-white p-6">
        <div className="font-semibold">Compose message</div>
        <div className="mt-4 grid gap-3">
          <div className="space-y-1.5">
            <div className="text-sm font-semibold">Audience</div>
            <select className="w-full rounded-2xl border px-3 py-2 text-sm" value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value="all_users">All registered users</option>
              <option value="all_applicants">All applicants</option>
              <option value="loan_applicants">Loan applicants</option>
              <option value="overdraft_applicants">Overdraft applicants</option>
              <option value="job_applicants">Job applicants</option>
              <option value="membership_applicants">Membership/shareholder applicants</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-semibold">Subject</div>
            <input className="w-full rounded-2xl border px-3 py-2 text-sm" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Happy New Year" />
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-semibold">Message</div>
            <textarea className="w-full rounded-2xl border px-3 py-2 text-sm" rows={8} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." />
            <div className="text-xs text-muted-foreground">New lines will be preserved in the email.</div>
          </div>

          {msg ? <div className="text-sm text-slate-700">{msg}</div> : null}

          <button
            onClick={send}
            disabled={sending}
            className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send bulk email"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold">Broadcast history</div>
          <button
            className="rounded-2xl border px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            onClick={loadHistory}
            disabled={loadingHistory}
          >
            {loadingHistory ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-sm text-muted-foreground">No broadcasts yet.</div>
          ) : (
            history.map((b) => (
              <div key={b.id} className="rounded-2xl border p-4">
                <div className="text-sm font-semibold">{b.subject}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Audience: {b.audience} • Status: {b.status || "-"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Created: {fmt(b.createdAt)} {b.sentAt ? `• Sent: ${fmt(b.sentAt)}` : ""}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Sent: {b.sentCount ?? 0} / {b.recipientCount ?? 0}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground font-mono">{b.id}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
