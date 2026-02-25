"use client";

import { Field, Input, Select, Textarea, useApplicationSubmit } from "@/components/forms/form-kit";

export default function LoanForm() {
  const { submit, loading, ref, error } = useApplicationSubmit();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", "loan");
    await submit(fd);
  }

  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="font-semibold text-slate-900">Loan Application</div>
      <p className="mt-2 text-sm text-muted-foreground">Fill your details and upload the required images.</p>

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
          <Field label="Date of birth"><Input name="dob" type="date" required /></Field>
          <Field label="Phone number"><Input name="phone" required /></Field>
          <Field label="Email"><Input name="email" type="email" placeholder="optional (uses your login email if empty)" /></Field>
        </div>

        <Field label="Home address"><Textarea name="address" rows={3} required /></Field>

        <div className="grid gap-4 md:grid-cols-3 items-start">
          <Field label="State of origin"><Input name="stateOfOrigin" required /></Field>
          <Field label="LGA"><Input name="lga" required /></Field>
          <Field label="State of residence"><Input name="stateOfResidence" required /></Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Occupation"><Input name="occupation" required /></Field>
          <Field label="Employer / Business name (optional)"><Input name="employerOrBusiness" /></Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Loan amount requested"><Input name="amountRequested" required /></Field>
          <Field label="Repayment preference / tenor">
            <Select name="tenor" required>
              <option value="">Select</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
            </Select>
          </Field>
        </div>

        <div className="rounded-2xl border p-4 bg-slate-50">
          <div className="font-semibold text-sm">Uploads</div>
          <div className="mt-3 grid gap-4 md:grid-cols-3 items-start">
            <Field label="Passport (required)"><Input name="passport" type="file" accept="image/*" required /></Field>
            <Field label="ID card (required)"><Input name="idCard" type="file" accept="image/*" required /></Field>
            <Field label="Proof of address (required)"><Input name="proofOfAddress" type="file" accept="image/*" required /></Field>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Tip: clear photo, readable text, good lighting.
          </div>
        </div>

        <button
          disabled={loading}
          className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Loan Application"}
        </button>
      </form>
    </div>
  );
}


