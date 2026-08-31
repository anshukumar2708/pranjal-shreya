import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hosts serving the dummy photos (see src/data/wedding.ts).
    // Add your own CDN here, or move the photos into /public and drop these.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" }, // wedding scenes
      { protocol: "https", hostname: "i.pravatar.cc" }, // family portraits
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
