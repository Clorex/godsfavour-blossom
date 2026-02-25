"use client";

import { Field, Input, Select, Textarea, useApplicationSubmit } from "@/components/forms/form-kit";

export default function JobForm() {
  const { submit, loading, ref, error } = useApplicationSubmit();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", "job");
    await submit(fd);
  }

  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="font-semibold text-slate-900">Job Application</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Fill the form and submit. Please upload a passport photo.
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><Input name="fullName" required /></Field>
          <Field label="Phone number"><Input name="phone" required /></Field>
          <Field label="Email (optional)"><Input name="email" type="email" /></Field>
          <Field label="Address / nearest bus stop"><Input name="address" required /></Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Role interested in">
            <Select name="roleInterested" required>
              <option value="">Select</option>
              <option value="Field staff">Field staff</option>
              <option value="Office assistant">Office assistant</option>
              <option value="Sales / marketer">Sales / marketer</option>
              <option value="Any available role">Any available role</option>
            </Select>
          </Field>
          <Field label="Availability">
            <Select name="availability" required>
              <option value="">Select</option>
              <option value="Full time">Full time</option>
              <option value="Part time">Part time</option>
              <option value="Weekends">Weekends</option>
            </Select>
          </Field>
          <Field label="Date of birth (optional)"><Input name="dob" type="date" /></Field>
        </div>

        <Field label="Work experience (optional)">
          <Textarea name="experience" rows={3} placeholder="Just explain small (if any)" />
        </Field>

        <div className="rounded-2xl border p-4 bg-slate-50">
          <Field label="Passport (required)">
            <Input name="passport" type="file" accept="image/*" required />
          </Field>
        </div>

        <button
          disabled={loading}
          className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Job Application"}
        </button>
      </form>
    </div>
  );
}


