import Reveal from "@/components/common/reveal";

export default function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <Reveal>
        {eyebrow ? (
          <div className="text-xs font-semibold tracking-wide text-[rgb(var(--g2))] uppercase">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </Reveal>

      <Reveal delayMs={80} className="mt-9">
        {children}
      </Reveal>
    </section>
  );
}
