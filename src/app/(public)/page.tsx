export const dynamic = "force-dynamic";

import Hero from "@/components/site/hero";
import Section from "@/components/site/section";
import VisualCard from "@/components/site/visual-card";
import ContactCards from "@/components/site/contact-cards";
import { getSiteContent, getSiteSettings } from "@/lib/content/server";
import { publicAsset } from "@/lib/public-asset";

function ApplyTile({ title, href }: { title: string; href: string }) {
  return (
    <a href={href} className="group rounded-3xl border bg-white p-6 hover:shadow-sm transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">{title}</div>
        <div className="h-10 w-10 rounded-2xl border flex items-center justify-center text-white bg-[rgb(var(--g1))]">→</div>
      </div>
    </a>
  );
}

export default async function HomePage() {
  const home = await getSiteContent("home");
  const about = await getSiteContent("about");
  const settings = await getSiteSettings();

  return (
    <div>
      <Hero
        badge={home.heroBadge}
        title={home.heroTitle}
        subtitle={home.heroSubtitle}
        steps={home.steps}
        primaryCta={{ label: "Apply for Loan", href: "/services/loan" }}
        secondaryCta={{ label: "Apply for Overdraft", href: "/services/overdraft" }}
      />

      <div className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid gap-4 md:grid-cols-3">
          <ApplyTile title="Loan Application" href="/services/loan" />
          <ApplyTile title="Overdraft Application" href="/services/overdraft" />
          <ApplyTile title="Osusu Packages" href="/services/osusu" />
        </div>
      </div>

      <Section title="Who we are">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="rounded-3xl border bg-white p-7">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{about.body}</p>
          </div>

          <div className="space-y-4">
            <VisualCard src={publicAsset("services","money1")} aspect="16/9" />
            <div className="grid grid-cols-2 gap-4">
              <VisualCard src={publicAsset("money2")} aspect="16/10" />
              <VisualCard src={publicAsset("money3")} aspect="16/10" />
            </div>
          </div>
        </div>
      </Section>

      <div className="bg-[rgb(var(--g1))] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-6 text-sm font-semibold">Contact</div>
          <ContactCards settings={settings} theme="dark" />
        </div>
      </div>
    </div>
  );
}
