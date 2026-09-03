import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The couple's photographs are served from /public and need no entry here.
    // Only the relatives' placeholder headshots are still remote.
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" }, // family portraits
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
