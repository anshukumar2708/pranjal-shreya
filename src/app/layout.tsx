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

// Full names lead the title: they are what guests type into a search box.
const title = `${groom.name} & ${bride.name} Wedding Invitation · ${dateRange}`;
const description = `${groom.name} weds ${bride.name} — wedding (shaadi) invitation for ${dateRange} at ${venue.name}, ${venue.city}. Together with our families, you are invited to the Mehendi, Haldi, Sangeet, Wedding and Reception.`;

/**
 * Search Console ownership tags, read from the environment so no code change
 * is needed once the site is live. Unset ones are simply left out.
 */
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

/**
 * The share card: the homepage banner photo with the couple's names, date and
 * place over a maroon fade, so a pasted link previews as the invitation itself.
 * `public/og-image.jpg` is 1200x630, saved as a baseline (not progressive) JPEG
 * under 300 KB - the format every chat app previews reliably. When it changes,
 * bump `?v=` here and in page.tsx - WhatsApp,
 * Facebook and others cache previews by image URL.
 */
const SHARE_IMAGE_PATH = "/og-image.jpg?v=3";

const shareImage = {
  url: SHARE_IMAGE_PATH,
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
    groom.name,
    bride.name,
    `${groom.name} weds ${bride.name}`,
    `${groom.name} ${bride.name} wedding`,
    `${groom.name} ${bride.name} marriage`,
    `${groom.shortName} and ${bride.shortName}`,
    `${groom.shortName} ${bride.shortName} wedding`,
    `${groom.shortName} weds ${bride.shortName}`,
    hashtag.replace("#", ""),
    "wedding invitation",
    "marriage invitation",
    "wedding card",
    "online wedding invitation",
    "digital wedding invitation",
    "e-invite",
    "shaadi card",
    "shaadi invitation",
    "vivah nimantran",
    "Indian wedding",
    "Hindu wedding",
    "Rajput wedding",
    "shubh vivah",
    "mehendi",
    "haldi",
    "sangeet",
    "barat",
    "reception",
    "प्रांजल सिंह",
    "श्रिया सिंह",
    "शादी का निमंत्रण",
    "विवाह निमंत्रण",
    "शुभ विवाह",
    venue.name,
    venue.city,
    `wedding in ${venue.city}`,
    dateRange,
  ],
  alternates: { canonical: "/" },
  // Where the wedding is, for "wedding in Raipur"-style local searches.
  other: { "geo.region": "IN-CT", "geo.placename": venue.city.split(",")[0] },
  ...(googleVerification || bingVerification
    ? {
        verification: {
          ...(googleVerification ? { google: googleVerification } : {}),
          ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
        },
      }
    : {}),
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
  appleWebApp: {
    capable: true,
    title: `${groom.shortName} & ${bride.shortName}`,
    statusBarStyle: "black-translucent",
  },
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
