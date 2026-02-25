"use client";

import { Field, Input, Textarea, useApplicationSubmit } from "@/components/forms/form-kit";

export default function OverdraftForm() {
  const { submit, loading, ref, error } = useApplicationSubmit();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", "overdraft");
    await submit(fd);
  }

  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="font-semibold text-slate-900">Overdraft Application</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Fill your details and upload the required documents.
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

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name"><Input name="fullName" required /></Field>
          <Field label="Phone number"><Input name="phone" required /></Field>
        </div>

        <Field label="Home address"><Textarea name="address" rows={3} required /></Field>

        <div className="rounded-2xl border p-4 bg-slate-50">
          <div className="font-semibold text-sm">Uploads</div>
          <div className="mt-3 grid gap-4 md:grid-cols-2 items-start">
            <Field label="Passport photo"><Input name="passport" type="file" accept="image/*" required /></Field>
            <Field label="ID card"><Input name="idCard" type="file" accept="image/*" required /></Field>
            <Field label="Proof of address"><Input name="proofOfAddress" type="file" accept="image/*" required /></Field>
            <Field label="Savings card photo (for 2 months confirmation)">
              <Input name="savingsCard" type="file" accept="image/*" required />
            </Field>
          </div>
        </div>

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
