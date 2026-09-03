import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Marcellus, Great_Vibes, Mukta } from "next/font/google";
import weddingData from "@/data/wedding";
import { siteUrl } from "@/lib/site";
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

const { groom, bride, dateRange, venue, hashtag } = weddingData;

const title = `${groom.shortName} & ${bride.shortName} — Wedding Invitation`;
const description = `${groom.name} weds ${bride.name}. ${dateRange} at ${venue.name}, ${venue.city}. Together with our families, you are invited to the Haldi, Mehendi, Barat, Wedding and Reception.`;

/**
 * The share card: both portraits side by side under the couple's names, so a
 * pasted link previews as the invitation itself rather than a bare URL.
 * Regenerate `public/og-image.jpg` at 1200x630 if the portraits ever change.
 */
const shareImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${groom.name} and ${bride.name} — wedding invitation for ${dateRange}`,
  type: "image/jpeg",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${groom.shortName} & ${bride.shortName}`,
  },
  description,
  applicationName: `${groom.shortName} & ${bride.shortName} Wedding`,
  authors: [{ name: groom.name }, { name: bride.name }],
  creator: groom.name,
  publisher: `${groom.name} & ${bride.name}`,
  category: "Wedding",
  keywords: [
    "wedding invitation",
    `${groom.name} weds ${bride.name}`,
    `${groom.shortName} and ${bride.shortName}`,
    hashtag.replace("#", ""),
    "Indian wedding",
    "Hindu wedding",
    "shubh vivah",
    "haldi",
    "mehendi",
    "barat",
    "reception",
    venue.name,
    venue.city,
    dateRange,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${groom.shortName} & ${bride.shortName} — Wedding Invitation`,
    title,
    description,
    locale: "en_IN",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: shareImage.url, alt: shareImage.alt }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
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
