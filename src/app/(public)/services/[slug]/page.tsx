export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { getSiteContent } from "@/lib/content/server";

export default async function ServiceSlugFallback({ params }: { params: { slug: string } }) {
  const slug = String(params.slug || "").toLowerCase();

  // Redirect to the real pages so these never 404
  if (slug === "savings") redirect("/services/savings");
  if (slug === "osusu") redirect("/services/osusu");
  if (slug === "sales") redirect("/services/sales");
  if (slug === "estate") redirect("/services");
  if (slug === "loan" || slug === "overdraft") notFound();

  // For any future custom service slugs (if you add later)
  const services = await getSiteContent("services");
  const item = (services.items || []).find((x: any) => String(x.slug || "").toLowerCase() === slug);
  if (!item) return notFound();

  // If it's in CMS but not one of the main pages, send to /services for now
  redirect("/services");
}
