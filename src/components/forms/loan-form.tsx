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
      <p className="mt-2 text-sm text-muted-foreground">
        Interest: 7.5% monthly. Charges: 3% insurance, 2% bank, 1% admin, 0.6% office (total 6.6%).
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
          <Field label="Client name"><Input name="fullName" required /></Field>
          <Field label="Computer number"><Input name="computerNumber" required /></Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone number"><Input name="phone" required /></Field>
          <Field label="Date of membership (optional)"><Input name="dateOfMembership" type="date" /></Field>
        </div>

        <Field label="Client address"><Textarea name="address" rows={3} required /></Field>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Sex (optional)">
            <Select name="sex">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </Field>
          <Field label="Age (optional)"><Input name="age" /></Field>
          <Field label="Business activities (optional)"><Input name="businessActivities" /></Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Amount requested"><Input name="amountRequested" required /></Field>
          <Field label="When was your last loan? (optional)"><Input name="lastLoan" placeholder="e.g. Jan 2025" /></Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Current loan date (optional)"><Input name="currentLoanDate" type="date" /></Field>
          <Field label="Completion date (optional)"><Input name="completionDate" type="date" /></Field>
        </div>

        <Field label="Collateral (2× to 3× the value of the loan)">
          <Textarea name="collateral" rows={3} placeholder="Describe collateral" required />
        </Field>

        <div className="rounded-2xl border p-4 bg-slate-50">
          <div className="font-semibold text-sm">Uploads</div>
          <div className="mt-3 grid gap-4 md:grid-cols-2 items-start">
            <Field label="Borrower passport"><Input name="passport" type="file" accept="image/*" required /></Field>
            <Field label="ID card"><Input name="idCard" type="file" accept="image/*" required /></Field>
            <Field label="Proof of address"><Input name="proofOfAddress" type="file" accept="image/*" required /></Field>
            <Field label="Guarantor 1 passport"><Input name="guarantorPassport1" type="file" accept="image/*" required /></Field>
            <Field label="Guarantor 2 passport"><Input name="guarantorPassport2" type="file" accept="image/*" required /></Field>
          </div>
        </div>

        <button disabled={loading} className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}


