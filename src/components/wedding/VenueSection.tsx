import DirectionsButton from "@/components/ui/DirectionsButton";
import type { Venue } from "@/types/wedding";
import VenueGallery from "@/components/wedding/VenueGallery";
import FlowerCorner from "@/components/decorations/FlowerCorner";
import FloralDivider from "@/components/decorations/FloralDivider";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface VenueSectionProps {
  /** Shown side by side, in order — e.g. the wedding, then the reception. */
  venues: Venue[];
}

function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const details = [
    { icon: "📍", label: "Address", value: venue.address },
    { icon: "📅", label: "Date", value: venue.date },
    { icon: "🕕", label: "Time", value: venue.time },
  ];

  return (
    <Reveal variant={index % 2 === 0 ? "left" : "right"} delay={index * 100} className="h-full">
      <article
        aria-labelledby={`venue-${index}-name`}
        className="glass-card group relative flex h-full flex-col overflow-hidden rounded-[2rem]"
      >
        {/* Real photos of the venue: cover, thumbnails, full-screen viewer. */}
        <VenueGallery
          photos={venue.photos}
          name={venue.name}
          badge={`${venue.icon} ${venue.label} Venue`}
        />

        {/* Venue name as a full-width band across the card. The min-height
            keeps both bands the same size when one name wraps to two lines,
            so the details below still line up across the pair. */}
        <div className="flex min-h-[5.5rem] items-center justify-center border-y border-gold-500/50 bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-800 px-5 py-4 text-center sm:min-h-[6.5rem] sm:px-8">
          <h3
            id={`venue-${index}-name`}
            className="w-full font-display text-xl leading-snug font-semibold text-balance break-words text-cream-100 sm:text-2xl lg:text-[1.75rem]"
          >
            {venue.name}
          </h3>
        </div>

        {/* Details — flex-1 plus the button's mt-auto keeps both cards'
            buttons on one line when the descriptions differ in length. */}
        <div className="relative flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
          <FlowerCorner
            position={index % 2 === 0 ? "br" : "bl"}
            className={`pointer-events-none absolute bottom-1 h-16 w-16 opacity-60 sm:h-20 sm:w-20 ${
              index % 2 === 0 ? "right-1" : "left-1"
            }`}
          />

          <p className="eyebrow">{venue.city}</p>

          <FloralDivider className="my-5 !justify-start" />

          <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
            {venue.description}
          </p>

          <dl className="mt-7 space-y-4">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-marigold-100 text-base"
                >
                  {detail.icon}
                </span>
                <div className="min-w-0">
                  <dt className="font-serif-alt text-[0.6rem] tracking-[0.2em] text-marigold-600 uppercase">
                    {detail.label}
                  </dt>
                  <dd className="mt-0.5 font-display text-base font-semibold break-words text-maroon-800 sm:text-lg">
                    {detail.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-auto pt-8">
            <DirectionsButton
              destination={`${venue.name}, ${venue.address}`}
              srLabel={`to the ${venue.label.toLowerCase()} venue`}
              className="btn-royal w-full sm:w-auto"
            />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function VenueSection({ venues }: VenueSectionProps) {
  return (
    <section
      id="venue"
      aria-labelledby="venue-heading"
      className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-ivory to-marigold-100/50 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-diamond absolute inset-0 opacity-40" />
        <Mandala className="absolute -top-28 -left-32 h-[26rem] w-[26rem]" opacity={0.09} />
      </div>

      <SectionHeading
        id="venue-heading"
        eyebrow="Where it all happens"
        script="The"
        title="Wedding & Reception Venues"
        subtitle="The wedding and the reception are held at two different places — tap “Get Directions” on each for a route from wherever you are."
      />

      {/* One column on phones, two side by side from tablets up. */}
      <div className="mx-auto mt-12 grid w-full max-w-6xl gap-7 md:grid-cols-2 lg:gap-8">
        {venues.map((venue, index) => (
          <VenueCard key={venue.name} venue={venue} index={index} />
        ))}
      </div>
    </section>
  );
}
