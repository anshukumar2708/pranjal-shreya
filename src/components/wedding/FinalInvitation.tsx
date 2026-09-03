import type { WeddingData } from "@/types/wedding";
import FloatingPetals from "@/components/decorations/FloatingPetals";
import FloralDivider from "@/components/decorations/FloralDivider";
import FlowerCorner from "@/components/decorations/FlowerCorner";
import HangingFlowers from "@/components/decorations/HangingFlowers";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import ScrollLink from "@/components/ui/ScrollLink";

interface FinalInvitationProps {
  data: WeddingData;
}

/**
 * The closing invitation — the emotional full stop before the footer, echoing
 * the printed card at the top of the page in the darker royal palette.
 */
export default function FinalInvitation({ data }: FinalInvitationProps) {
  const { groom, bride, dateRange, finalInvitationMessage, venue, hashtag } = data;

  return (
    <section
      aria-labelledby="final-invitation-heading"
      className="relative overflow-hidden bg-gradient-to-b from-maroon-700 via-maroon-800 to-maroon-900 px-4 py-24 sm:px-6 sm:py-28"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-mandala absolute inset-0 opacity-35" />
        <Mandala
          className="absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2"
          color="#e6be8a"
          opacity={0.14}
        />
      </div>

      <HangingFlowers className="h-20 px-2 sm:h-24" strands={16} tone="cool" />
      <FloatingPetals count={12} />

      <Reveal variant="scale" className="relative mx-auto mt-10 w-full max-w-3xl">
        <div className="gold-frame relative rounded-[2rem] bg-maroon-900/45 px-6 py-12 text-center backdrop-blur-sm sm:rounded-[2.5rem] sm:px-12 sm:py-16">
          <FlowerCorner position="tl" tone="light" className="absolute top-2 left-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24" />
          <FlowerCorner position="tr" tone="light" className="absolute top-2 right-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24" />
          <FlowerCorner position="bl" tone="light" className="absolute bottom-2 left-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24" />
          <FlowerCorner position="br" tone="light" className="absolute right-2 bottom-2 h-16 w-16 opacity-80 sm:h-24 sm:w-24" />

          <p aria-hidden="true" className="text-3xl">
            🪔
          </p>

          <p className="eyebrow mt-4 text-gold-300">An invitation from our hearts</p>

          <p className="mx-auto mt-7 max-w-xl font-display text-lg leading-relaxed text-cream-100 italic sm:text-xl lg:text-2xl">
            &ldquo;{finalInvitationMessage}&rdquo;
          </p>

          <FloralDivider tone="light" className="my-8" />

          <h2
            id="final-invitation-heading"
            className="gold-text font-script text-5xl leading-tight sm:text-6xl lg:text-7xl"
          >
            {groom.shortName} &amp; {bride.shortName}
          </h2>

          <p className="mt-6 font-serif-alt text-sm tracking-[0.2em] text-cream-100 uppercase sm:text-base">
            {dateRange}
          </p>
          <p className="mt-2 text-sm text-cream-200/75">
            {venue.name} · {venue.city}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ScrollLink
              href="#events"
              className="btn-royal w-full !bg-none !bg-marigold-500 !text-maroon-900 sm:w-auto"
            >
              Wedding Events
            </ScrollLink>
            <ScrollLink
              href="#venue"
              className="btn-outline-gold w-full !border-gold-300/60 !bg-transparent !text-cream-100 hover:!bg-cream-100 hover:!text-maroon-800 sm:w-auto"
            >
              Venue Details
            </ScrollLink>
          </div>

          <p className="mt-8 font-serif-alt text-[0.65rem] tracking-[0.3em] text-gold-300 uppercase">
            {hashtag}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
