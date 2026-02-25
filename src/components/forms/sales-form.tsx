"use client";

import { Field, Input, Select, Textarea, useApplicationSubmit } from "@/components/forms/form-kit";

export default function SalesForm() {
  const { submit, loading, ref, error } = useApplicationSubmit();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", "sales");
    await submit(fd);
  }

  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="font-semibold text-slate-900">Request to Buy (Save & Buy)</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us what you want to buy and how you want to save towards it.
      </p>

      {ref ? (
        <div className="mt-4 rounded-2xl border p-4 bg-slate-50">
          <div className="font-semibold">Submitted successfully</div>
          <div className="text-sm text-muted-foreground mt-1">
            Reference: <span className="font-mono">{ref}</span>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 p-4 bg-red-50 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name"><Input name="fullName" required /></Field>
          <Field label="Phone number"><Input name="phone" required /></Field>
        </div>

        <Field label="Address"><Textarea name="address" rows={3} required /></Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="What do you want to buy?"><Input name="itemName" placeholder="e.g. AC, Car, Phone" required /></Field>
          <Field label="Target amount"><Input name="targetAmount" placeholder="e.g. 300000" required /></Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Savings type">
            <Select name="savingsType" required>
              <option value="">Select</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </Field>

          <Field label="How much will you save?">
            <Input name="amount" placeholder="e.g. 1000" required />
          </Field>
        </div>

        <Field label="Any note (optional)">
          <Textarea name="note" rows={3} placeholder="Optional" />
        </Field>

        <button
          disabled={loading}
          className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
