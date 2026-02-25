export default function MoneyStrip() {
  const items = Array.from({ length: 15 }).map((_, i) => `/money${i + 1}.png`);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {items.map((src) => (
        <div key={src} className="min-w-[220px] sm:min-w-[260px] rounded-2xl border bg-white p-2">
          {/* no event handlers here; this is a Server Component-safe version */}
          <img src={src} alt={src} className="h-[140px] w-full object-cover rounded-xl bg-slate-100" />
          <div className="text-xs text-slate-500 mt-2">{src.replace("/", "")}</div>
        </div>
      ))}
    </div>
  );
}
