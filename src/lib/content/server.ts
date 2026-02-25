import { unstable_noStore as noStore } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { defaultAbout, defaultHome, defaultServices, defaultSettings } from "@/lib/content/defaults";
import type { SiteSectionKey, SiteSettings } from "@/types/site";

function mergeServices(data: any) {
  const base = defaultServices;
  const incoming = data || {};

  const baseItems = Array.isArray(base.items) ? base.items : [];
  const inItems = Array.isArray(incoming.items) ? incoming.items : [];

  const map = new Map<string, any>();
  for (const it of baseItems) map.set(it.slug, { ...it });

  for (const it of inItems) {
    if (!it?.slug) continue;
    if (String(it.slug).toLowerCase() === "estate") continue; // remove estate
    const prev = map.get(it.slug);
    map.set(it.slug, prev ? { ...prev, ...it } : { ...it });
  }

  // Keep extras (except estate) — optional
  const extras = inItems.filter(
    (it: any) =>
      it?.slug &&
      String(it.slug).toLowerCase() !== "estate" &&
      !baseItems.some((b) => b.slug === it.slug)
  );

  return {
    ...base,
    ...incoming,
    items: Array.from(map.values()).concat(extras),
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  noStore();
  const snap = await adminDb.collection("siteSettings").doc("global").get();
  const data = snap.exists ? (snap.data() as Partial<SiteSettings>) : {};
  return { ...defaultSettings, ...data };
}

export async function getSiteContent(key: SiteSectionKey): Promise<any> {
  noStore();
  const snap = await adminDb.collection("siteContent").doc(key).get();
  const data = snap.exists ? (snap.data() as any) : {};

  if (key === "home") return { ...defaultHome, ...data };
  if (key === "about") return { ...defaultAbout, ...data };
  if (key === "services") return mergeServices(data);

  return data;
}
