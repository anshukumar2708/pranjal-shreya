import WeddingImage from "@/components/ui/WeddingImage";
import type { Venue } from "@/types/wedding";
import FlowerCorner from "@/components/decorations/FlowerCorner";
import FloralDivider from "@/components/decorations/FloralDivider";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface VenueSectionProps {
  venue: Venue;
}

export default function VenueSection({ venue }: VenueSectionProps) {
  const details = [
    { icon: "📍", label: "Address", value: `${venue.address}, ${venue.city}` },
    { icon: "📅", label: "Wedding Dates", value: venue.date },
    { icon: "🕕", label: "Event Time", value: venue.time },
  ];

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
        title="Wedding Venue"
        subtitle="Both the Barat and the Reception are held at the same address, so you only need one set of directions."
      />

      <Reveal variant="scale" className="mx-auto mt-12 w-full max-w-6xl">
        <div className="glass-card relative overflow-hidden rounded-[2rem] lg:grid lg:grid-cols-2">
          <FlowerCorner position="tl" className="absolute top-1 left-1 z-10 h-16 w-16 opacity-70 sm:h-20 sm:w-20" />

          {/* Photograph */}
          <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[26rem]">
            <WeddingImage
              src={venue.image}
              alt={venue.alt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-maroon-900/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-cream-100/40"
            />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-maroon-800/85 px-4 py-2 font-serif-alt text-[0.62rem] tracking-[0.2em] text-cream-100 uppercase backdrop-blur-sm lg:hidden">
              <span aria-hidden="true">🏛️</span>
              {venue.city}
            </span>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-9 lg:p-11">
            <p className="eyebrow">Venue</p>
            <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{venue.name}</h3>

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

            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-royal mt-8 w-full sm:w-auto"
            >
              <span aria-hidden="true">🧭</span>
              Get Directions
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
