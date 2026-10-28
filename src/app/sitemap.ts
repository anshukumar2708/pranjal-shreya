import type { MetadataRoute } from "next";

import weddingData from "@/data/wedding";
import { siteUrl } from "@/lib/site";

/**
 * One page, so the sitemap is a single entry. It also lists the photographs
 * shown on it (an image sitemap), so the couple's pictures can surface in
 * image search under their names. Only same-site files are listed — Google
 * ignores images hosted elsewhere unless that host is verified too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (src: string) => (src.startsWith("http") ? src : `${siteUrl}${src}`);
  const images = [
    "/og-image.jpg?v=3",
    ...weddingData.banner.map((slide) => slide.src),
  ]
    .filter((src) => src.startsWith("/"))
    .map(absolute);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [...new Set(images)],
    },
  ];
}
