export const dynamic = "force-dynamic";

import Section from "@/components/site/section";
import VisualCard from "@/components/site/visual-card";
import SalesForm from "@/components/forms/sales-form";
import { getSiteContent } from "@/lib/content/server";
import { publicAsset } from "@/lib/public-asset";

export default async function SalesPage() {
  const services = await getSiteContent("services");
  const s = (services.items || []).find((x: any) => x.slug === "sales");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <Section title={s?.title || "Sales of Goods & Services"} subtitle={s?.summary || ""}>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <div className="rounded-3xl border bg-white p-7 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {s?.body || ""}
            </div>
            <SalesForm />
          </div>

          <div className="lg:sticky lg:top-20">
            <VisualCard src={publicAsset("money4")} aspect="16/9" />
          </div>
        </div>
      </Section>
    </div>
  );
}
