export const dynamic = "force-dynamic";

import Section from "@/components/site/section";
import VisualCard from "@/components/site/visual-card";
import OverdraftForm from "@/components/forms/overdraft-form";
import { getSiteContent } from "@/lib/content/server";
import { publicAsset } from "@/lib/public-asset";

export default async function OverdraftPage() {
  const services = await getSiteContent("services");
  const service = (services.items || []).find((x: any) => x.slug === "overdraft");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <Section title={service?.title || "Overdraft"} subtitle={service?.summary || ""}>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6">
            <div className="rounded-3xl border bg-white p-7 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              <div className="font-semibold text-slate-900">How our overdraft works</div>
              <ul className="list-disc pl-5 mt-3 space-y-2">
                <li>You must have been saving with us for at least <b>2 months</b>.</li>
                <li>Your overdraft is based on your saving pattern with us.</li>
                <li>
                  When paying back, you pay <b>33 numbers instead of 31</b> (we collect only 2 extra numbers).
                  <br />
                  Example: if you are paying <b>₦500 daily</b>, you will pay <b>₦16,500</b> instead of <b>₦15,500</b>.
                </li>
                <li>Aside that, we do not collect any other money. After you apply, we will explain everything clearly.</li>
              </ul>

              {service?.body ? <div className="mt-4">{service.body}</div> : null}

              <div className="mt-4 font-semibold text-slate-900">Uploads</div>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Passport photo</li>
                <li>ID card</li>
                <li>Proof of address</li>
              </ul>
            </div>

            <OverdraftForm />
          </div>

          <div className="lg:sticky lg:top-20">
            <VisualCard src={publicAsset("overdraft")} aspect="16/9" />
          </div>
        </div>
      </Section>
    </div>
  );
}
