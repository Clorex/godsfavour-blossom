"use client";

import { useMemo, useState } from "react";
import { Field, Input, Select, Textarea, useApplicationSubmit } from "@/components/forms/form-kit";

type Plan = "10people" | "5people";
type Mode = "daily" | "weekly" | "monthly";

type Pkg = {
  id: string;
  plan: Plan;
  packageLabel: string;
  packageAmount: number;
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
};

const pkgs: Pkg[] = [
  // 10 people
  { id: "10-50k",  plan: "10people", packageLabel: "50K Package",  packageAmount: 50000,  daily: 0,    weekly: 0,     monthly: 0,      total: 0 },
  { id: "10-100k", plan: "10people", packageLabel: "100K Package", packageAmount: 100000, daily: 350,  weekly: 2450,  monthly: 10500,  total: 105000 },
  { id: "10-200k", plan: "10people", packageLabel: "200K Package", packageAmount: 200000, daily: 700,  weekly: 4900,  monthly: 21000,  total: 210000 },
  { id: "10-300k", plan: "10people", packageLabel: "300K Package", packageAmount: 300000, daily: 1050, weekly: 7350,  monthly: 31500,  total: 315000 },
  { id: "10-400k", plan: "10people", packageLabel: "400K Package", packageAmount: 400000, daily: 1400, weekly: 9800,  monthly: 42000,  total: 420000 },
  { id: "10-500k", plan: "10people", packageLabel: "500K Package", packageAmount: 500000, daily: 1750, weekly: 12250, monthly: 52500,  total: 525000 },
  { id: "10-1m",   plan: "10people", packageLabel: "1M Package",   packageAmount: 1000000, daily: 3500, weekly: 24500, monthly: 105000, total: 1050000 },
  { id: "10-2m",   plan: "10people", packageLabel: "2M Package",   packageAmount: 2000000, daily: 7000, weekly: 49000, monthly: 210000, total: 2100000 },

  // 5 people
  { id: "5-100k", plan: "5people", packageLabel: "100K Package", packageAmount: 100000, daily: 700,  weekly: 2900,  monthly: 21000,  total: 105000 },
  { id: "5-200k", plan: "5people", packageLabel: "200K Package", packageAmount: 200000, daily: 1400, weekly: 9800,  monthly: 42000,  total: 210000 },
  { id: "5-300k", plan: "5people", packageLabel: "300K Package", packageAmount: 300000, daily: 2100, weekly: 14700, monthly: 63000,  total: 315000 },
  { id: "5-400k", plan: "5people", packageLabel: "400K Package", packageAmount: 400000, daily: 2800, weekly: 19600, monthly: 84000,  total: 420000 },
  { id: "5-500k", plan: "5people", packageLabel: "500K Package", packageAmount: 500000, daily: 3500, weekly: 24500, monthly: 105000, total: 525000 },
  { id: "5-1m",   plan: "5people", packageLabel: "1M Package",   packageAmount: 1000000, daily: 7000, weekly: 49000, monthly: 210000, total: 1050000 },
];

function money(n: number) {
  if (!n) return "-";
  return `₦${n.toLocaleString()}`;
}

export default function OsusuForm() {
  const { submit, loading, ref, error } = useApplicationSubmit();
  const [plan, setPlan] = useState<Plan>("10people");
  const [mode, setMode] = useState<Mode>("daily");

  const options = useMemo(() => pkgs.filter(p => p.plan === plan && p.total > 0), [plan]);
  const [selectedId, setSelectedId] = useState<string>("10-100k");

  const selected = useMemo(() => pkgs.find(p => p.id === selectedId) || options[0], [selectedId, options]);

  const amountForMode = useMemo(() => {
    if (!selected) return 0;
    return mode === "daily" ? selected.daily : mode === "weekly" ? selected.weekly : selected.monthly;
  }, [selected, mode]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    fd.set("type", "osusu");
    fd.set("osusuPlan", plan);
    fd.set("paymentMode", mode);

    fd.set("packageId", selected.id);
    fd.set("packageLabel", selected.packageLabel);
    fd.set("packageAmount", String(selected.packageAmount));
    fd.set("dailyPayment", String(selected.daily));
    fd.set("weeklyPayment", String(selected.weekly));
    fd.set("monthlyPayment", String(selected.monthly));
    fd.set("totalPayment", String(selected.total));
    fd.set("amountPerMode", String(amountForMode));

    await submit(fd);
  }

  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="font-semibold text-slate-900">Osusu Application</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a package and payment mode. Other rules will be explained after you apply.
      </p>

      {ref ? (
        <div className="mt-4 rounded-2xl border p-4 bg-slate-50">
          <div className="font-semibold">Submitted successfully</div>
          <div className="text-sm text-muted-foreground mt-1">Reference: <span className="font-mono">{ref}</span></div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 p-4 bg-red-50 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border p-4">
          <div className="text-sm font-semibold">Plan</div>
          <div className="mt-3 grid gap-2">
            <button type="button" onClick={() => setPlan("10people")} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${plan==="10people" ? "bg-[rgb(var(--g1))] text-white" : "bg-white"}`}>
              Yearly Osusu (10 people)
            </button>
            <button type="button" onClick={() => setPlan("5people")} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${plan==="5people" ? "bg-[rgb(var(--g1))] text-white" : "bg-white"}`}>
              5 People Package
            </button>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Weekly osusu also exists (11 people, 1 number belongs to the cooperative). Rules will be explained after application.
          </div>
        </div>

        <div className="rounded-3xl border p-4">
          <div className="text-sm font-semibold">Payment mode</div>
          <div className="mt-3 grid gap-2">
            <button type="button" onClick={() => setMode("daily")} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${mode==="daily" ? "bg-[rgb(var(--g1))] text-white" : "bg-white"}`}>Daily</button>
            <button type="button" onClick={() => setMode("weekly")} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${mode==="weekly" ? "bg-[rgb(var(--g1))] text-white" : "bg-white"}`}>Weekly</button>
            <button type="button" onClick={() => setMode("monthly")} className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${mode==="monthly" ? "bg-[rgb(var(--g1))] text-white" : "bg-white"}`}>Monthly</button>
          </div>

          {selected ? (
            <div className="mt-4 rounded-2xl border p-4 bg-slate-50 text-sm">
              <div className="font-semibold">{selected.packageLabel}</div>
              <div className="mt-2 text-muted-foreground">
                {mode.toUpperCase()} payment: <b>{money(amountForMode)}</b>
              </div>
              <div className="mt-1 text-muted-foreground">
                Total payment: <b>{money(selected.total)}</b>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {options.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedId(p.id)}
            className={`text-left rounded-3xl border p-5 bg-white hover:shadow-sm transition-all ${
              selectedId === p.id ? "border-[rgb(var(--g2))] ring-2 ring-[rgba(0,95,55,0.18)]" : ""
            }`}
          >
            <div className="font-semibold">{p.packageLabel}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Daily: {money(p.daily)} • Weekly: {money(p.weekly)} • Monthly: {money(p.monthly)}
            </div>
            <div className="mt-2 text-sm">Total: <b>{money(p.total)}</b></div>
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name"><Input name="fullName" required /></Field>
          <Field label="Phone number"><Input name="phone" required /></Field>
        </div>

        <Field label="Address"><Textarea name="address" rows={3} required /></Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="If you are new, preferred number (optional)"><Input name="preferredNumber" placeholder="e.g. 5, 6, 7, 9, 10" /></Field>
          <Field label="Any note (optional)"><Input name="note" /></Field>
        </div>

        <div className="rounded-3xl border p-5 bg-slate-50 text-sm text-muted-foreground leading-relaxed">
          Rules & Regulations (summary): Failure to pay can push you to the last number. No refund (no stopping half way). Other rules will be explained after you apply.
        </div>

        <button disabled={loading} className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
