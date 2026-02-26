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
              {service?.body || ""}
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
