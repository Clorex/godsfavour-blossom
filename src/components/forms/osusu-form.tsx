"use client";

import { useState } from "react";
import { Field, Input, Select, Textarea, useApplicationSubmit } from "@/components/forms/form-kit";

type PackageOption = {
  id: string;
  title: string;
  subtitle: string;
  details: string;
  packageAmount: string;
  dailyAmount: string;
  duration: string;
  planType: "10months" | "5number";
};

const packages: PackageOption[] = [
  {
    id: "100k-10m",
    title: "₦100,000 Package",
    subtitle: "₦350 daily • 10 months",
    details: "Example: if you are number 5, you collect in the 5th month.",
    packageAmount: "100000",
    dailyAmount: "350",
    duration: "10 months",
    planType: "10months",
  },
  {
    id: "200k-10m",
    title: "₦200,000 Package",
    subtitle: "₦750 daily • 10 months",
    details: "You save small small daily as you work.",
    packageAmount: "200000",
    dailyAmount: "750",
    duration: "10 months",
    planType: "10months",
  },
  {
    id: "1m-10m",
    title: "₦1,000,000 Package",
    subtitle: "₦3,500 daily • 10 months",
    details: "You save small small daily as you work.",
    packageAmount: "1000000",
    dailyAmount: "3500",
    duration: "10 months",
    planType: "10months",
  },
  {
    id: "100k-5no",
    title: "5-Number Plan (₦100,000)",
    subtitle: "₦750 daily • 5 months",
    details: "Example: if you are number 3, you collect in the 3rd month.",
    packageAmount: "100000",
    dailyAmount: "750",
    duration: "5 months",
    planType: "5number",
  },
];

function PackageCard({
  opt,
  active,
  onClick,
}: {
  opt: PackageOption;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-3xl border p-5 bg-white transition-all hover:-translate-y-0.5 hover:shadow-sm ${
        active ? "border-[rgb(var(--g2))] ring-2 ring-[rgba(0,95,55,0.18)]" : ""
      }`}
    >
      <div className="font-semibold">{opt.title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{opt.subtitle}</div>
      <div className="mt-3 text-sm">{opt.details}</div>
    </button>
  );
}

export default function OsusuForm() {
  const { submit, loading, ref, error } = useApplicationSubmit();
  const [selected, setSelected] = useState<PackageOption>(packages[0]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("type", "osusu");

    // selected package values
    fd.set("packageId", selected.id);
    fd.set("packageAmount", selected.packageAmount);
    fd.set("dailyAmount", selected.dailyAmount);
    fd.set("duration", selected.duration);
    fd.set("planType", selected.planType);

    await submit(fd);
  }

  return (
    <div className="rounded-3xl border bg-white p-6">
      <div className="font-semibold text-slate-900">Osusu Application</div>
      <p className="mt-2 text-sm text-muted-foreground">
        Choose a package and submit. Other rules will be explained to you after you apply.
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

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {packages.map((p) => (
          <PackageCard key={p.id} opt={p} active={selected.id === p.id} onClick={() => setSelected(p)} />
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full name"><Input name="fullName" required /></Field>
          <Field label="Phone number"><Input name="phone" required /></Field>
        </div>

        <Field label="Address"><Textarea name="address" rows={3} required /></Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Group size">
            <Select name="groupSize" required>
              <option value="">Select</option>
              <option value="10">10 people</option>
              <option value="5">5 people</option>
              <option value="Other">Other</option>
            </Select>
          </Field>

          <Field label="If you are new, preferred number (optional)">
            <Input name="preferredNumber" placeholder="e.g. 5, 6, 7, 9, 10" />
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
