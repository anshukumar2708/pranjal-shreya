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
    // `suppressHydrationWarning` guards against browser extensions that stamp
    // their own attributes onto <html> and <body> before React hydrates —
    // QuillBot's `data-qb-installed`, Grammarly's `data-gr-ext-installed`, and
    // friends. The server can never have rendered those, so React reports a
    // hydration mismatch that no application change can fix. It only suppresses
    // warnings for these two elements' own attributes, one level deep, so real
    // mismatches inside the page are still reported.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${marcellus.variable} ${greatVibes.variable} ${mukta.variable}`}
    >
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  );
}
