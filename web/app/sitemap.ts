import type { MetadataRoute } from "next";
import { SITE, SERVICES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/quote", "/services", "/tools", "/tools/recurring-lane-calculator", "/tools/capacity-distance-calculator", "/tools/is-a-3pl-right-for-you", "/why-supplynow", "/support"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : p === "/quote" ? 0.9 : 0.7 })),
    ...SERVICES.map((s) => ({ url: `${SITE.url}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
