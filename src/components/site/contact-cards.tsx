import type { SiteSettings } from "@/types/site";

function waLink(num: string) {
  const digits = (num || "").replace(/\D/g, "");
  if (!digits) return "#";
  const normalized = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

function Card({
  label,
  value,
  href,
  theme = "dark",
}: {
  label: string;
  value: string;
  href: string;
  theme?: "dark" | "light";
}) {
  const box =
    theme === "dark"
      ? "rounded-2xl border border-white/20 bg-white/10 p-5"
      : "rounded-2xl border bg-white p-5";

  const number =
    theme === "dark"
      ? "text-[22px] font-semibold text-white"
      : "text-[22px] font-semibold text-slate-900";

  const sub =
    theme === "dark"
      ? "mt-1 text-xs text-white/80"
      : "mt-1 text-xs text-muted-foreground";

  return (
    <div className={box}>
      <a
        className="block underline-offset-4 hover:underline"
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        <div className={number}>{value}</div>
        <div className={sub}>{label}</div>
      </a>
    </div>
  );
}

export default function ContactCards({
  settings,
  theme = "dark",
}: {
  settings: SiteSettings;
  theme?: "dark" | "light";
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card label="WhatsApp" value={settings.whatsapp} href={waLink(settings.whatsapp)} theme={theme} />
      <Card label="Call line" value={settings.call} href={`tel:${settings.call}`} theme={theme} />
      {settings.callAlt ? (
        <Card label="Call line" value={settings.callAlt} href={`tel:${settings.callAlt}`} theme={theme} />
      ) : null}
    </div>
  );
}

