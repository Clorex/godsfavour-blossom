import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/about`, priority: 0.8 },
    { url: `${base}/services`, priority: 0.9 },
    { url: `${base}/services/loan`, priority: 0.9 },
    { url: `${base}/services/overdraft`, priority: 0.9 },
    { url: `${base}/services/jobs`, priority: 0.8 },
    { url: `${base}/auth/login`, priority: 0.2 },
    { url: `${base}/auth/register`, priority: 0.2 },
  ];
}
