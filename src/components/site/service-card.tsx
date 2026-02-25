import Link from "next/link";

export default function ServiceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-3xl border bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-900">{title}</div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <div className="h-10 w-10 rounded-2xl border flex items-center justify-center text-white bg-[rgb(var(--g1))]">
          →
        </div>
      </div>
      <div className="mt-5 text-sm font-semibold text-[rgb(var(--g2))]">Learn more</div>
    </Link>
  );
}
