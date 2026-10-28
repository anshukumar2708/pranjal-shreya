import type { MetadataRoute } from "next";

import weddingData from "@/data/wedding";

const { groom, bride, dateRange } = weddingData;

/**
 * Web app manifest: names the invitation properly when a guest adds it to
 * their home screen, and gives search engines one more consistent signal.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${groom.name} & ${bride.name} — Wedding Invitation`,
    short_name: `${groom.shortName} & ${bride.shortName}`,
    description: `${groom.name} weds ${bride.name} · ${dateRange}`,
    start_url: "/",
    display: "standalone",
    background_color: "#fdf6ee",
    theme_color: "#6b0f1a",
    lang: "en-IN",
    categories: ["lifestyle", "events"],
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
