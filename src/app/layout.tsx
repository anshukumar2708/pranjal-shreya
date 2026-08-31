import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Marcellus, Great_Vibes, Mukta } from "next/font/google";
import weddingData from "@/data/wedding";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mukta",
  display: "swap",
});

const { groom, bride, dateRange, venue } = weddingData;
const title = `${groom.shortName} & ${bride.shortName} — Wedding Invitation`;
const description = `${groom.name} weds ${bride.name}. ${dateRange} at ${venue.name}, ${venue.city}. Together with our families, you are invited.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: ["wedding", "invitation", groom.name, bride.name, "Indian wedding", venue.city],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#6b0f1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${marcellus.variable} ${greatVibes.variable} ${mukta.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
