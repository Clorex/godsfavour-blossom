export const dynamic = "force-dynamic";

import Section from "@/components/site/section";
import VisualCard from "@/components/site/visual-card";
import LoanForm from "@/components/forms/loan-form";
import { getSiteContent } from "@/lib/content/server";
import { publicAsset } from "@/lib/public-asset";

export default async function LoanPage() {
  const services = await getSiteContent("services");
  const service = (services.items || []).find((x: any) => x.slug === "loan");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <Section title={service?.title || "Friendly Loan"} subtitle={service?.summary || ""}>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <div className="rounded-3xl border bg-white p-7 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              <div className="font-semibold text-slate-900">How our loan works</div>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>You must have been saving with us for at least <b>3 months</b>.</li>
                <li>We give loan based on your saving history with us.</li>
                <li>Interest is <b>5% monthly</b>, calculated on the <b>outstanding balance</b> (as you pay, it reduces).</li>
                <li>After you apply, we will contact you and explain your breakdown clearly.</li>
              </ul>
              <div className="mt-4">
                {service?.body ? service.body : ""}
              </div>

              <div className="mt-4 font-semibold text-slate-900">Uploads</div>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Passport photo</li>
                <li>ID card</li>
                <li>Proof of address</li>
              </ul>
            </div>

            <LoanForm />
          </div>

          <div className="lg:sticky lg:top-20">
            <VisualCard src={publicAsset("loan")} aspect="16/9" />
          </div>
        </div>
      </Section>
    </div>
  );
}
