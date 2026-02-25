import fs from "fs";
import path from "path";

/**
 * Returns the first existing asset for a baseName in /public.
 * Supports: webp, png, jpg, jpeg (in that order).
 * If not found, returns fallback (if provided) or `${baseName}.png`.
 */
export function publicAsset(baseName: string, fallbackBaseName?: string) {
  const exts = ["webp", "png", "jpg", "jpeg"];

  // If caller already provided an extension, just return it:
  if (baseName.includes(".")) return `/${baseName}`;

  for (const ext of exts) {
    const abs = path.join(process.cwd(), "public", `${baseName}.${ext}`);
    try {
      if (fs.existsSync(abs)) {
        const st = fs.statSync(abs);
        if (st.size > 0) return `/${baseName}.${ext}`;
      }
    } catch {}
  }

  if (fallbackBaseName) return publicAsset(fallbackBaseName);
  return `/${baseName}.png`;
}
