"use client";

import { Field, Input, Select, Textarea, useApplicationSubmit } from "@/components/forms/form-kit";

export default function MembershipForm() {
  const { submit, loading, ref, error } = useApplicationSubmit();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", "membership");
    await submit(fd);
  }

  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="font-semibold text-slate-900">Membership / Shareholder Application</div>
      <p className="mt-2 text-sm text-muted-foreground">Apply to become a member and/or shareholder.</p>

      {ref ? (
        <div className="mt-4 rounded-2xl border p-4 bg-slate-50">
          <div className="font-semibold">Submitted successfully</div>
          <div className="text-sm text-muted-foreground mt-1">Reference: <span className="font-mono">{ref}</span></div>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 p-4 bg-red-50 text-sm text-red-700">{error}</div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><Input name="fullName" required /></Field>
          <Field label="Phone number"><Input name="phone" required /></Field>
          <Field label="Email (optional)"><Input name="email" type="email" /></Field>
          <Field label="Address"><Input name="address" required /></Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="State of origin"><Input name="stateOfOrigin" /></Field>
          <Field label="LGA"><Input name="lga" /></Field>
          <Field label="Member type">
            <Select name="memberType" required>
              <option value="">Select</option>
              <option value="Member">Member</option>
              <option value="Shareholder">Shareholder</option>
              <option value="Both">Both</option>
            </Select>
          </Field>
        </div>

        <Field label="Note (optional)">
          <Textarea name="note" rows={3} placeholder="Any note you want to add" />
        </Field>

        <button
          disabled={loading}
          className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Membership Application"}
        </button>
      </form>
    </div>
  );
}
