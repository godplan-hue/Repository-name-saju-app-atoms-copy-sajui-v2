import { MetadataRoute } from "next";
import { getAllKeywords } from "@/lib/haemong/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://jeomun.com";
  const keywords = getAllKeywords();

  const keywordPages = keywords.map(kw => ({
    url: `${base}/haemong/${encodeURIComponent(kw)}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${base}/haemong`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...keywordPages,
  ];
}
