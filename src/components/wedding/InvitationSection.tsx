import type { WeddingData } from "@/types/wedding";
import FlowerCorner from "@/components/decorations/FlowerCorner";
import FloralDivider from "@/components/decorations/FloralDivider";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";

interface InvitationSectionProps {
  data: WeddingData;
}

/**
 * The formal invitation panel — styled like a printed card, naming both sets of
 * parents the way a traditional Indian invitation does.
 */
export default function InvitationSection({ data }: InvitationSectionProps) {
  const { groom, bride, dateRange, invitationMessage, venue } = data;

  return (
    <section
      id="invitation"
      aria-labelledby="invitation-heading"
      className="relative overflow-hidden bg-ivory px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-diamond absolute inset-0 opacity-60" />
        <Mandala
          className="absolute top-1/2 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2"
          opacity={0.09}
        />
      </div>

      <Reveal variant="scale" className="mx-auto w-full max-w-3xl">
        <div className="gold-frame relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-cream-100 via-white to-marigold-100/70 px-6 py-12 text-center shadow-[0_30px_80px_-40px_rgba(107,15,26,0.55)] sm:rounded-[2.5rem] sm:px-12 sm:py-16">
          <FlowerCorner position="tl" className="absolute top-2 left-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24" />
          <FlowerCorner position="tr" className="absolute top-2 right-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24" />
          <FlowerCorner position="bl" className="absolute bottom-2 left-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24" />
          <FlowerCorner position="br" className="absolute right-2 bottom-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24" />

          <p aria-hidden="true" className="text-3xl">
            🕉️
          </p>
          <p className="eyebrow mt-4">You are cordially invited</p>

          <h2
            id="invitation-heading"
            className="mt-5 font-script text-4xl leading-tight text-maroon-700 sm:text-5xl lg:text-6xl"
          >
            {groom.shortName} <span className="gold-text">&amp;</span> {bride.shortName}
          </h2>

          <FloralDivider className="my-6" />

          <p className="mx-auto max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {invitationMessage}
          </p>

          {/* Parents — the traditional "with the blessings of" block */}
          <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-6">
            {[
              { partner: groom, side: "Groom", relation: "Son of" },
              { partner: bride, side: "Bride", relation: "Daughter of" },
            ].map(({ partner, side, relation }) => (
              <div key={side} className="px-2">
                <p className="eyebrow text-[0.6rem] text-marigold-600">{relation}</p>
                <p className="mt-2 font-display text-lg font-semibold text-maroon-800 sm:text-xl">
                  {partner.father}
                </p>
                <p className="font-display text-lg font-semibold text-maroon-800 sm:text-xl">
                  {partner.mother}
                </p>
                <p className="mt-1 font-serif-alt text-[0.7rem] tracking-[0.2em] text-ink-soft uppercase">
                  Parents of the {side.toLowerCase()}
                </p>
              </div>
            ))}
          </div>

          <FloralDivider className="my-7" />

          <p className="font-serif-alt text-sm tracking-[0.18em] text-maroon-700 uppercase sm:text-base">
            {dateRange}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {venue.name}, {venue.city}
          </p>

          <p aria-hidden="true" className="mt-8 text-2xl">
            🌺
          </p>
        </div>
      </Reveal>
    </section>
  );
}
