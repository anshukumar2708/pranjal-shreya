import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The couple's photographs are served from /public and need no entry here.
    // Only the relatives' placeholder headshots are still remote.
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" }, // family portraits
    ],
    formats: ["image/avif", "image/webp"],
    // 75 is the default for small frames; 90 keeps the full-screen banner and
    // the large showcase frames crisp. Any other `quality` is coerced to these.
    qualities: [75, 90],
  },
};

export default nextConfig;
