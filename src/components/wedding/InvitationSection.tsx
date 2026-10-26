import Link from "next/link";
import type { Partner, WeddingData } from "@/types/wedding";
import FlowerCorner from "@/components/decorations/FlowerCorner";
import FloralDivider from "@/components/decorations/FloralDivider";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";

interface InvitationSectionProps {
  data: WeddingData;
}

/** Thin gold rule with a centred ornament, drawn above and below each family block. */
function GoldRule() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400 sm:w-28" />
      <span className="text-[0.55rem] text-gold-500">◆</span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400 sm:w-28" />
    </div>
  );
}

/**
 * One side of the card, laid out like the printed invitation: honorific and
 * name, then grandparents and parents, each relation on its own line above
 * the names ("सुपौत्र", "सुपुत्र" on the card), framed by gold rules.
 */
function FamilyBlock({
  partner,
  honorific,
  grandLabel,
  childLabel,
  variant,
  delay,
}: {
  partner: Partner;
  /** चि. for the groom, सौ.कां. for the bride, as the printed card has them. */
  honorific: string;
  grandLabel: string;
  childLabel: string;
  variant: "left" | "right";
  delay: number;
}) {
  const rows = [
    partner.grandparents && { label: grandLabel, names: partner.grandparents },
    { label: childLabel, names: `Smt. ${partner.mother} & Shri ${partner.father}` },
  ].filter((row): row is { label: string; names: string } => Boolean(row));

  return (
    <div className="mx-auto mt-8 max-w-xl">
      <Reveal variant="fade" delay={delay}>
        <GoldRule />
      </Reveal>

      <Reveal variant={variant} delay={delay + 100}>
        <p className="mt-4 flex items-baseline justify-center gap-2 text-maroon-700">
          <span className="font-body text-base text-maroon-600 sm:text-lg">{honorific}</span>
          <span className="font-script text-5xl leading-tight sm:text-6xl lg:text-7xl">
            {partner.name}
          </span>
        </p>
      </Reveal>

      <Reveal variant="fade" delay={delay + 200}>
        {/* Each relation on its own line, with the names on the line below it. */}
        <dl className="mt-3 space-y-3 text-sm leading-relaxed sm:text-base">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="font-serif-alt text-xs tracking-[0.18em] text-marigold-600 uppercase sm:text-sm">
                {row.label}
              </dt>
              <dd className="mt-1 font-display text-lg font-semibold text-maroon-800 sm:text-2xl">
                {row.names}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal variant="fade" delay={delay + 250}>
        <div className="mt-5">
          <GoldRule />
        </div>
      </Reveal>
    </div>
  );
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

            {/* Maroon → rose → saffron, the card's own colours, so the
                invitation line stands out without leaving the palette. */}
            <p className="mt-4 w-full bg-gradient-to-r from-maroon-600 via-rose-pink-600 to-marigold-600 bg-clip-text font-display text-xl leading-snug font-semibold whitespace-pre-line text-transparent italic sm:text-2xl">
              {invitationMessage}
            </p>
          </Reveal>

          <h2 id="invitation-heading" className="sr-only">
            The wedding of {groom.name} and {bride.name}
          </h2>

          <FamilyBlock
            partner={groom}
            honorific="चि."
            grandLabel="Grandson of"
            childLabel="Son of"
            variant="left"
            delay={450}
          />

          {/* "संग" on the printed card. */}
          <Reveal variant="scale" delay={650}>
            <div
              aria-hidden="true"
              className="my-5 flex items-center justify-center gap-3 font-serif-alt text-xs tracking-[0.35em] text-marigold-600 uppercase sm:text-sm"
            >
              <span className="h-px w-10 bg-gold-400/70 sm:w-16" />
              <span className="text-[0.6rem] text-rose-pink-500">♥</span>
              with
              <span className="text-[0.6rem] text-rose-pink-500">♥</span>
              <span className="h-px w-10 bg-gold-400/70 sm:w-16" />
            </div>
          </Reveal>

          <FamilyBlock
            partner={bride}
            honorific="सौ.कां."
            grandLabel="Granddaughter of"
            childLabel="Daughter of"
            variant="right"
            delay={750}
          />

          <Reveal delay={950}>
            <FloralDivider className="my-7" />

            <p className="font-serif-alt text-lg tracking-[0.18em] text-maroon-700 uppercase sm:text-2xl">
              {dateRange}
            </p>
            {/* Tapping the address opens the venue in Google Maps. */}
            <Link
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex items-start justify-center gap-1.5 text-base text-ink-soft transition-colors hover:text-maroon-700 sm:text-lg"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-[0.2em] h-[1.1em] w-[1.1em] shrink-0 fill-rose-pink-600 transition-transform group-hover:-translate-y-0.5"
              >
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
              </svg>
              <span>
                {venue.name}, {venue.city}
                <span className="sr-only"> (opens in Google Maps)</span>
              </span>
            </Link>
          </Reveal>

          <Reveal delay={1050}>
            <p className="mx-auto mt-8 max-w-xl font-display text-xl text-maroon-700 italic sm:text-2xl">
              Your gracious presence and blessings will make this occasion
              complete.
            </p>
            <p className="mt-4 eyebrow text-xs text-marigold-600 sm:text-sm">
              With warm regards
            </p>
            <p className="mt-1 font-script text-3xl text-maroon-700 sm:text-4xl">
              {groom.father.split(" ").at(-1)} Family
            </p>
          </Reveal>

          <p aria-hidden="true" className="mt-6 text-3xl">
            🌺
          </p>
        </div>
      </Reveal>
    </section>
  );
}
