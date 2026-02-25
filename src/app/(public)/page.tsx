export const dynamic = "force-dynamic";

import Hero from "@/components/site/hero";
import Section from "@/components/site/section";
import VisualCard from "@/components/site/visual-card";
import { getSiteContent, getSiteSettings } from "@/lib/content/server";
import { publicAsset } from "@/lib/public-asset";

function ApplyTile({ title, body, href }: { title: string; body: string; href: string }) {
  return (
    <a href={href} className="group rounded-3xl border bg-white p-6 hover:shadow-sm transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</div>
        </div>
        <div className="h-10 w-10 rounded-2xl border flex items-center justify-center text-white bg-[rgb(var(--g1))]">
          →
        </div>
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
          <ApplyTile title="Friendly Loan" body="Apply here. We will review and contact you." href="/services/loan" />
          <ApplyTile title="Overdraft" body="Apply here. We will review and contact you." href="/services/overdraft" />
          <ApplyTile title="Osusu / Asset Financing" body="See how it works and the rules." href="/services/osusu" />
        </div>
      </div>

      <Section title="Who we are">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="rounded-3xl border bg-white p-7">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {about.body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/services" className="rounded-2xl bg-[rgb(var(--g1))] text-white px-5 py-3 text-sm font-semibold">
                View services
              </a>
              <a href="/about" className="rounded-2xl border px-5 py-3 text-sm font-semibold bg-white hover:bg-slate-50 transition">
                About us
              </a>
            </div>
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

      <div className="bg-slate-50/60 border-y">
        <Section title="Registered (CAC)">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
            <div className="rounded-3xl border bg-white p-7">
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {home.trustBody}
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <img
                src={publicAsset("cac")}
                alt="CAC Certificate"
                className="block w-full h-auto rounded-2xl border"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </Section>
      </div>

      <div className="bg-[rgb(var(--g1))] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid gap-6 md:grid-cols-3 md:items-center">
            <div>
              <div className="text-sm font-semibold">Contact</div>
              <div className="mt-2 text-white/90 text-sm">WhatsApp or call us.</div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
              <div className="text-xs text-white/80">WhatsApp</div>
              <a className="mt-1 block font-semibold underline" href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank">
                {settings.whatsapp}
              </a>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
              <div className="text-xs text-white/80">Call</div>
              <a className="mt-1 block font-semibold underline" href={`tel:${settings.call}`}>
                {settings.call}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
