function aspectClass(aspect: "1/1" | "4/3" | "16/9" | "16/10" | "16/11") {
  if (aspect === "1/1") return "aspect-square";
  if (aspect === "4/3") return "aspect-[4/3]";
  if (aspect === "16/9") return "aspect-[16/9]";
  if (aspect === "16/10") return "aspect-[16/10]";
  return "aspect-[16/11]";
}

export default function VisualCard({
  src,
  label,
  note,
  aspect = "4/3",
}: {
  src: string;
  label?: string; // not rendered
  note?: string;  // not rendered
  aspect?: "1/1" | "4/3" | "16/9" | "16/10" | "16/11";
}) {
  const alt = label || "Image";

  return (
    <div className="group relative rounded-[28px] border bg-white p-3 overflow-hidden">
      <div className="absolute inset-0 bg-soft-grid opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={`relative overflow-hidden rounded-[22px] bg-muted ${aspectClass(aspect)}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="pointer-events-none absolute -top-24 -left-24 h-44 w-44 rounded-full bg-[rgba(0,95,55,0.18)] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
