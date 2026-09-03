import WeddingImage from "@/components/ui/WeddingImage";
import type { WeddingData } from "@/types/wedding";
import FloatingPetals from "@/components/decorations/FloatingPetals";
import FlowerCorner from "@/components/decorations/FlowerCorner";
import HangingFlowers from "@/components/decorations/HangingFlowers";
import Mandala from "@/components/decorations/Mandala";
import MarigoldBorder from "@/components/decorations/MarigoldBorder";
import Varmala from "@/components/decorations/Varmala";
import Reveal from "@/components/ui/Reveal";
import ScrollLink from "@/components/ui/ScrollLink";

interface HeroSectionProps {
  data: WeddingData;
}

/** Framed portrait used for both the groom and the bride. */
function CouplePortrait({
  src,
  alt,
  name,
  label,
  focus,
  priority,
}: {
  src: string;
  alt: string;
  name: string;
  label: string;
  /** CSS object-position, so the face stays centred inside the circle. */
  focus?: string;
  priority?: boolean;
}) {
  return (
    <figure className="group flex flex-col items-center">
      {/* Ring wrapper is its own square box, so the decorative rings can never
          stretch over the caption below. */}
      <div className="relative">
        {/* Rotating gold ring behind the portrait */}
        <span
          aria-hidden="true"
          className="absolute -inset-2 rounded-full bg-[conic-gradient(from_0deg,#c9a227,#ff7a00,#c1121f,#e75480,#c9a227)] opacity-80 blur-[1.5px] motion-safe:animate-[spin_18s_linear_infinite] sm:-inset-3"
        />
        <span aria-hidden="true" className="absolute -inset-0.5 rounded-full bg-cream-100" />

        <div className="relative aspect-square w-28 overflow-hidden rounded-full border-4 border-cream-100 shadow-[0_18px_50px_-18px_rgba(107,15,26,0.7)] min-[380px]:w-32 sm:w-52 md:w-60 lg:w-72">
          <WeddingImage
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 128px, (max-width: 1024px) 240px, 288px"
            style={{ objectPosition: focus }}
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-maroon-900/45 via-transparent to-transparent"
          />
        </div>
      </div>

      <figcaption className="mt-5 text-center">
        <span className="eyebrow block text-[0.6rem] text-marigold-600 sm:text-[0.65rem]">
          {label}
        </span>
        <span className="mt-1 block font-display text-xl font-semibold text-maroon-800 sm:text-2xl lg:text-3xl">
          {name}
        </span>
      </figcaption>
    </figure>
  );
}

export default function HeroSection({ data }: HeroSectionProps) {
  const { groom, bride, dateRange, invitationMessage, hashtag } = data;

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] w-full flex-col items-center overflow-hidden bg-gradient-to-b from-marigold-100 via-cream-100 to-peach-200/60 px-4 pt-28 pb-20 sm:px-6 sm:pt-32 lg:pt-36"
    >
      {/* Background ornament layers */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-mandala absolute inset-0 opacity-70" />
        <Mandala className="absolute -top-32 -left-32 h-[26rem] w-[26rem] sm:-top-40 sm:-left-24 sm:h-[34rem] sm:w-[34rem]" />
        <Mandala
          className="absolute -right-40 -bottom-24 h-[24rem] w-[24rem] sm:h-[32rem] sm:w-[32rem]"
          color="#c1121f"
          opacity={0.12}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ivory to-transparent" />
      </div>

      <HangingFlowers className="z-0 h-24 px-1 sm:h-32 sm:px-4" strands={18} />
      <FloatingPetals count={16} className="z-0" />

      <FlowerCorner position="tl" className="absolute top-16 left-0 h-24 w-24 opacity-70 sm:h-36 sm:w-36" />
      <FlowerCorner position="tr" className="absolute top-16 right-0 h-24 w-24 opacity-70 sm:h-36 sm:w-36" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <Reveal variant="fade">
          <p className="eyebrow">Shubh Vivah · शुभ विवाह</p>
          <p className="mt-3 font-script text-2xl text-rose-pink-500 sm:text-3xl">
            Together with our families
          </p>
        </Reveal>

        {/* Couple portraits with the varmala arcing above them.
            The garland sits behind the portraits (z-0) so any overlap tucks
            neatly under the frames rather than across the faces. */}
        <div className="relative mt-6 w-full sm:mt-8">
          <Varmala className="absolute -top-2 left-1/2 z-0 w-[132%] max-w-none -translate-x-1/2 opacity-95 sm:-top-4 sm:w-[116%] lg:-top-6 lg:w-[106%]" />

          <div className="relative z-10 flex items-start justify-center gap-2 pt-14 min-[380px]:gap-4 sm:gap-8 sm:pt-24 lg:gap-14 lg:pt-28">
            <Reveal variant="left" delay={100}>
              <CouplePortrait
                src={groom.image}
                alt={groom.alt}
                name={groom.name}
                label="The Groom"
                focus={groom.focus}
                priority
              />
            </Reveal>

            <Reveal variant="scale" delay={250} className="self-center">
              <span
                aria-hidden="true"
                className="gold-text block font-script text-5xl leading-none sm:text-7xl lg:text-8xl"
              >
                &amp;
              </span>
            </Reveal>

            <Reveal variant="right" delay={100}>
              <CouplePortrait
                src={bride.image}
                alt={bride.alt}
                name={bride.name}
                label="The Bride"
                focus={bride.focus}
                priority
              />
            </Reveal>
          </div>
        </div>

        <Reveal delay={150} className="mt-10 w-full sm:mt-12">
          <h1 id="hero-heading" className="sr-only">
            {groom.name} and {bride.name} are getting married · {dateRange}
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
            {invitationMessage}
          </p>

          {/* Date band */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-gold-500/45 bg-cream-100/80 px-6 py-3 backdrop-blur-sm sm:px-9 sm:py-4">
            <span aria-hidden="true" className="hidden text-marigold-500 min-[380px]:inline">
              ❖
            </span>
            <time
              dateTime="2026-11-25"
              className="font-serif-alt text-sm tracking-[0.16em] text-maroon-700 uppercase sm:text-base"
            >
              {dateRange}
            </time>
            <span aria-hidden="true" className="hidden text-marigold-500 min-[380px]:inline">
              ❖
            </span>
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <ScrollLink href="#events" className="btn-royal w-full sm:w-auto">
              View Wedding Details
            </ScrollLink>
            <ScrollLink href="#rsvp" className="btn-outline-gold w-full sm:w-auto">
              RSVP Now
            </ScrollLink>
          </div>

          <p className="mt-7 font-serif-alt text-xs tracking-[0.3em] text-rose-pink-600 uppercase">
            {hashtag}
          </p>
        </Reveal>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="relative z-10 mt-12 flex flex-col items-center gap-2 text-maroon-600/70"
      >
        <span className="font-serif-alt text-[0.62rem] tracking-[0.3em] uppercase">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-maroon-600/40 p-1">
          <span className="block h-2 w-1 rounded-full bg-marigold-500 motion-safe:animate-[floatY_2.2s_ease-in-out_infinite]" />
        </span>
      </div>

      <MarigoldBorder edge="bottom" />
    </section>
  );
}
