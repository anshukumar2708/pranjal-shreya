import weddingData from "@/data/wedding";

import Navbar from "@/components/wedding/Navbar";
import HeroSection from "@/components/wedding/HeroSection";
import InvitationSection from "@/components/wedding/InvitationSection";
import Countdown from "@/components/wedding/Countdown";
import CoupleSection from "@/components/wedding/CoupleSection";
import WeddingEvents from "@/components/wedding/WeddingEvents";
import WeddingTimeline from "@/components/wedding/WeddingTimeline";
import StorySection from "@/components/wedding/StorySection";
import FamilySection from "@/components/wedding/FamilySection";
import FamilyTree from "@/components/wedding/FamilyTree";
import CoupleShowcase from "@/components/wedding/CoupleShowcase";
import GallerySection from "@/components/wedding/GallerySection";
import VenueSection from "@/components/wedding/VenueSection";
import AddToCalendar from "@/components/wedding/AddToCalendar";
import FinalInvitation from "@/components/wedding/FinalInvitation";
import Footer from "@/components/wedding/Footer";
import MusicPlayer from "@/components/wedding/MusicPlayer";

/**
 * The complete one-page wedding invitation.
 * All content comes from `src/data/wedding.ts` — nothing is hardcoded here.
 */
export default function Home() {
  const {
    groom,
    bride,
    events,
    story,
    groomFamily,
    brideFamily,
    gallery,
    venue,
    nav,
    music,
    countdownTarget,
    dateRange,
  } = weddingData;

  const coupleShortName = `${groom.shortName} & ${bride.shortName}`;

  // Structured data, so search engines can show the wedding as a real event
  // (date, venue, address) rather than just a page title.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // schema.org wants ISO 8601. Our copy carries human dates ("23 November
  // 2026"), so convert — and drop the field rather than emit an invalid one.
  // Parsed AS UTC and read back in UTC: anchoring to a local zone instead would
  // shift every date a day earlier once it round-tripped through toISOString.
  const isoDate = (human: string) => {
    const parsed = new Date(`${human} UTC`);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
  };

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${groom.name} & ${bride.name} — Wedding`,
    description: `The wedding of ${groom.name} and ${bride.name}, ${dateRange}, at ${venue.name}.`,
    startDate: countdownTarget,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [`${siteUrl}/og-image.jpg`],
    location: {
      "@type": "Place",
      name: venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: venue.address,
        addressLocality: venue.city,
        addressCountry: "IN",
      },
      ...(venue.mapsUrl ? { hasMap: venue.mapsUrl } : {}),
    },
    organizer: {
      "@type": "Person",
      name: `${groom.name} & ${bride.name}`,
    },
    subEvent: events.map((event) => ({
      "@type": "Event",
      name: event.name,
      ...(isoDate(event.date) ? { startDate: isoDate(event.date) } : {}),
      description: event.description,
      location: {
        "@type": "Place",
        name: event.venue,
        address: { "@type": "PostalAddress", streetAddress: event.address },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // The payload is built here from our own data — never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <Navbar items={nav} coupleName={coupleShortName} />

      <main id="main">
        {/* 2 — Hero / couple banner */}
        <HeroSection data={weddingData} />

        {/* 3 — Invitation message */}
        <InvitationSection data={weddingData} />

        {/* 4 — Countdown */}
        <Countdown
          target={countdownTarget}
          targetLabel={dateRange}
          coupleName={coupleShortName}
        />

        {/* 5 — Bride & groom introduction */}
        <CoupleSection groom={groom} bride={bride} />

        {/* 6 — Wedding events */}
        <WeddingEvents events={events} />

        {/* 7 — Wedding timeline */}
        <WeddingTimeline events={events} />

        {/* 8 — Our story */}
        <StorySection moments={story} />

        {/* 9 & 11 — Groom's parents, siblings and family */}
        <FamilySection family={groomFamily} accent="warm" id="families" />

        {/* 10 & 12 — Bride's parents, siblings and family */}
        <FamilySection family={brideFamily} accent="rose" tone="tinted" />

        {/* Family tree joining both sides */}
        <FamilyTree
          groom={groom}
          bride={bride}
          groomFamily={groomFamily}
          brideFamily={brideFamily}
        />

        {/* 13 — Couple photo showcase */}
        <CoupleShowcase groom={groom} bride={bride} />

        {/* 14 — Wedding gallery */}
        <GallerySection images={gallery} />

        {/* 15 — Venue */}
        <VenueSection venue={venue} />

        {/* 16 — Add to calendar */}
        <AddToCalendar events={events} coupleName={coupleShortName} />

        {/* 17 — Final invitation */}
        <FinalInvitation data={weddingData} />
      </main>

      {/* 18 — Footer */}
      <Footer data={weddingData} />

      <MusicPlayer src={music.src} title={music.title} />
    </>
  );
}
