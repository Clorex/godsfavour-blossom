export const dynamic = "force-dynamic";

import Section from "@/components/site/section";
import ServiceCard from "@/components/site/service-card";
import VisualCard from "@/components/site/visual-card";
import { getSiteContent } from "@/lib/content/server";
import { publicAsset } from "@/lib/public-asset";

export default async function ServicesPage() {
  const services = await getSiteContent("services");

  function hrefFor(slug: string) {
    if (slug === "loan") return "/services/loan";
    if (slug === "overdraft") return "/services/overdraft";
    if (slug === "savings") return "/services/savings";
    if (slug === "osusu") return "/services/osusu";
    if (slug === "sales") return "/services/sales";
    return `/services/${slug}`; // fallback
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <Section title={services.title} subtitle={services.subtitle}>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {services.items.map((s: any) => (
              <ServiceCard key={s.slug} title={s.title} description={s.summary} href={hrefFor(s.slug)} />
            ))}
          </div>

          <div className="lg:sticky lg:top-20">
            <VisualCard src={publicAsset("services")} aspect="16/9" />
          </div>
        </div>
      </Section>
    </div>
  );
}
