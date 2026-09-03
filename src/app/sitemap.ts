import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

/** One page, so the sitemap is a single entry — enough for crawlers to index it. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
