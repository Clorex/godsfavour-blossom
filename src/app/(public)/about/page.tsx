export const dynamic = "force-dynamic";

import Section from "@/components/site/section";
import VisualCard from "@/components/site/visual-card";
import MembershipForm from "@/components/forms/membership-form";
import { getSiteContent, getSiteSettings } from "@/lib/content/server";
import { publicAsset } from "@/lib/public-asset";

function waLink(num: string) {
  const digits = (num || "").replace(/\D/g, "");
  if (!digits) return "";
  const normalized = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

export default async function AboutPage() {
  const about = await getSiteContent("about");
  const settings = await getSiteSettings();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <Section title={about.title}>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-6">
            <div className="rounded-3xl border bg-white p-7">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{about.body}</p>
            </div>

            <div className="rounded-3xl border bg-white p-7">
              <h3 className="font-semibold">{about.trustTitle}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{about.trustBody}</p>
            </div>

            <div className="rounded-3xl border bg-white p-7">
              <h3 className="font-semibold">Addresses</h3>
              <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Head Office:</span> {settings.headOfficeAddress}</p>
                <p><span className="font-medium text-foreground">Branch Office:</span> {settings.branchOfficeAddress}</p>
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-7">
              <h3 className="font-semibold">Contact</h3>
              <div className="mt-3 space-y-2 text-sm">
                <p><span className="font-medium">Email:</span> {settings.publicEmail}</p>
                <p><span className="font-medium">WhatsApp:</span> <a className="underline" href={waLink(settings.whatsapp)} target="_blank">{settings.whatsapp}</a></p>
                <p><span className="font-medium">Call line:</span> <a className="underline" href={`tel:${settings.call}`}>{settings.call}</a></p>
                {settings.callAlt ? (
                  <p><span className="font-medium">Another call line:</span> <a className="underline" href={`tel:${settings.callAlt}`}>{settings.callAlt}</a></p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <VisualCard src={publicAsset("admin")} aspect="1/1" />
          </div>
        </div>
      </Section>

      <Section eyebrow="Registration" title="CAC Certificate">
        <div className="rounded-3xl border bg-white p-4">
          <img
            src={publicAsset("cac")}
            alt="CAC Certificate"
            className="block w-full h-auto max-w-4xl mx-auto rounded-2xl border bg-white"
            loading="lazy"
            decoding="async"
          />
        </div>
      </Section>

      <Section eyebrow="Membership" title={about.bePartTitle} subtitle={about.bePartBody}>
        <div id="join" className="grid gap-8 lg:grid-cols-2 lg:items-start scroll-mt-24">
          <div className="space-y-5">
            <MembershipForm />
          </div>
          <div className="lg:sticky lg:top-20">
            <VisualCard src={publicAsset("membership-handshake")} aspect="16/9" />
          </div>
        </div>
      </Section>
    </div>
  );
}
