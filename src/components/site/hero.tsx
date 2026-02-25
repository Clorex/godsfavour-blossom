import Link from "next/link";
import { publicAsset } from "@/lib/public-asset";

type Cta = { label: string; href: string };

export default function Hero({
  badge,
  title,
  subtitle,
  steps,
  primaryCta,
  secondaryCta,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
  steps?: string[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
}) {
  const heroUrl = publicAsset("hero");

  return (
    <section className="relative overflow-hidden">
      <div
        className="relative text-white"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(0,55,35,0.88) 0%, rgba(0,85,55,0.84) 55%, rgba(0,120,75,0.78) 100%),
            url(${heroUrl})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {badge ? (
              <div className="inline-flex items-center rounded-full bg-black/25 px-3 py-1 text-xs font-semibold">
                {badge}
              </div>
            ) : null}

            <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-3 text-white/90 text-sm md:text-base leading-relaxed">
                {subtitle}
              </p>
            ) : null}

            {steps?.length ? (
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {steps.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm">
                    {s}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 justify-center">
              {primaryCta ? (
                <Link
                  href={primaryCta.href}
                  className="text-center rounded-2xl bg-white text-slate-900 px-6 py-3 text-sm font-semibold hover:opacity-95 transition"
                >
                  {primaryCta.label}
                </Link>
              ) : null}

              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className="text-center rounded-2xl border border-white/35 bg-transparent px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>

            <div className="mt-6 text-xs text-white/85">
              Registered • Your money is safe with us
            </div>
          </div>
        </div>
      </div>

      <div className="h-10 bg-white" />
    </section>
  );
}
