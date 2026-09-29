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
          <FlowerCorner
            position="tl"
            className="absolute top-2 left-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24"
          />
          <FlowerCorner
            position="tr"
            className="absolute top-2 right-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24"
          />
          <FlowerCorner
            position="bl"
            className="absolute bottom-2 left-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24"
          />
          <FlowerCorner
            position="br"
            className="absolute right-2 bottom-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24"
          />

          {/* Lines appear in reading order, like a card being opened. */}
          <Reveal variant="fade" delay={150}>
            <p
              aria-hidden="true"
              className="text-3xl motion-safe:animate-[floatY_4s_ease-in-out_infinite]"
            >
              🕉️
            </p>
            <p className="eyebrow mt-4">With the blessings of our elders</p>
          </Reveal>

          {/* The groom's parents are the hosts — they invite the guests to
              their son's wedding, as a traditional groom's-side card reads. */}
          <Reveal delay={300}>
            <p className="mt-6 font-display text-xl font-semibold text-maroon-800 sm:text-2xl">
              Shri {groom.father} &amp; Smt. {groom.mother}
            </p>

            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {invitationMessage}
            </p>
          </Reveal>

          <h2
            id="invitation-heading"
            className="mt-6 flex flex-col items-center font-script leading-tight text-maroon-700"
          >
            <Reveal
              as="span"
              variant="left"
              delay={450}
              className="block text-5xl sm:text-6xl lg:text-7xl"
            >
              {groom.shortName}
            </Reveal>
            <Reveal
              as="span"
              variant="scale"
              delay={600}
              className="my-1 block font-serif-alt text-xs tracking-[0.35em] text-marigold-600 uppercase sm:text-sm"
            >
              with
            </Reveal>
            <Reveal
              as="span"
              variant="right"
              delay={750}
              className="block text-5xl sm:text-6xl lg:text-7xl"
            >
              {bride.shortName}
            </Reveal>
          </h2>

          <Reveal
            as="p"
            delay={850}
            className="mt-4 text-sm text-ink-soft sm:text-base"
          >
            <span className="font-serif-alt text-[0.7rem] tracking-[0.2em] text-marigold-600 uppercase sm:text-xs">
              Daughter of
            </span>
            <span className="mt-1 block font-display text-lg font-semibold text-maroon-800 sm:text-xl">
              Shri {bride.father} &amp; Smt. {bride.mother}
            </span>
          </Reveal>

          <Reveal delay={950}>
            <FloralDivider className="my-7" />

            <p className="font-serif-alt text-sm tracking-[0.18em] text-maroon-700 uppercase sm:text-base">
              {dateRange}
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              {venue.name}, {venue.city}
            </p>
          </Reveal>

          <Reveal delay={1050}>
            <p className="mx-auto mt-8 max-w-md font-display text-lg text-maroon-700 italic sm:text-xl">
              Your gracious presence and blessings will make this occasion
              complete.
            </p>
            <p className="mt-3 eyebrow text-[0.65rem] text-marigold-600">
              With warm regards
            </p>
            <p className="mt-1 font-script text-2xl text-maroon-700 sm:text-3xl">
              {groom.father.split(" ").at(-1)} Family
            </p>
          </Reveal>

          <p aria-hidden="true" className="mt-6 text-2xl">
            🌺
          </p>
        </div>
      </Reveal>
    </section>
  );
}
