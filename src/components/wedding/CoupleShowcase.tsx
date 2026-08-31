import WeddingImage from "@/components/ui/WeddingImage";
import type { Partner } from "@/types/wedding";
import FloralDivider from "@/components/decorations/FloralDivider";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface CoupleShowcaseProps {
  groom: Partner;
  bride: Partner;
}

/**
 * Overlapping photo collage for each partner.
 *
 * Below `sm` the frames sit in normal flow — a hero photo with a tidy row of
 * thumbnails beneath it. From `sm` up the thumbnails become absolutely
 * positioned and step off the hero frame for the overlapping look.
 */
function ShowcaseStack({
  partner,
  accent,
  flip,
}: {
  partner: Partner;
  accent: "warm" | "rose";
  /** Mirrors the layout so the two collages lean toward each other. */
  flip?: boolean;
}) {
  const [hero, ...rest] = partner.gallery;
  const extras = rest.slice(0, 3);

  const glow =
    accent === "warm"
      ? "from-marigold-400/50 to-royal-500/40"
      : "from-rose-pink-400/50 to-maroon-600/40";

  // Thumbnails step down the *outer* edge of each collage, so the two stacks
  // lean away from the centre gap instead of colliding in it. Every offset stays
  // within the hero frame's own height, so nothing can spill onto the name below.
  const offsets = flip
    ? ["sm:top-[10%] sm:right-0", "sm:top-[40%] sm:right-6", "sm:top-[68%] sm:right-0"]
    : ["sm:top-[10%] sm:left-0", "sm:top-[40%] sm:left-6", "sm:top-[68%] sm:left-0"];

  return (
    <Reveal variant={flip ? "right" : "left"} className="w-full">
      <div className="flex flex-col items-center">
        <div
          className={`relative mx-auto w-full max-w-sm sm:max-w-md ${
            flip ? "sm:pr-16" : "sm:pl-16"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute inset-6 rounded-[2rem] bg-gradient-to-br ${glow} blur-2xl`}
          />

          {/* Hero frame */}
          <figure
            className={`group relative aspect-[3/4] w-full overflow-hidden rounded-[1.75rem] border-4 border-cream-100 shadow-[0_30px_70px_-35px_rgba(107,15,26,0.8)] ${
              flip ? "sm:-rotate-2" : "sm:rotate-2"
            }`}
          >
            <WeddingImage
              src={hero.src}
              alt={hero.alt}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 90vw, 28rem"
              className="object-cover transition-transform duration-[1400ms] group-hover:scale-110"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-maroon-900/55 via-transparent to-transparent"
            />
            {/* Caption sits opposite the thumbnail column so it is never covered. */}
            <figcaption
              className={`absolute inset-x-0 bottom-0 p-5 ${
                flip ? "text-left" : "text-right"
              }`}
            >
              <span className="font-script text-2xl text-cream-100 sm:text-3xl">
                {partner.shortName}
              </span>
              <span className="mt-0.5 block font-serif-alt text-[0.6rem] tracking-[0.24em] text-marigold-300 uppercase">
                {hero.caption}
              </span>
            </figcaption>
          </figure>

          {/* Thumbnails: a row on mobile, stepped frames from `sm` up */}
          <div className="mt-4 flex justify-center gap-3 sm:mt-0 sm:block">
            {extras.map((photo, index) => (
              <figure
                key={photo.src}
                className={`group relative aspect-[4/5] w-1/3 shrink-0 overflow-hidden rounded-2xl border-[3px] border-cream-100 shadow-[0_20px_45px_-25px_rgba(107,15,26,0.8)] transition-transform duration-500 hover:z-20 hover:scale-105 sm:absolute sm:mt-0 sm:w-24 lg:w-28 ${offsets[index]}`}
              >
                <WeddingImage
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 30vw, 128px"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-maroon-900/10 transition-opacity duration-500 group-hover:opacity-0"
                />
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center sm:mt-2">
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">{partner.name}</h3>
          <FloralDivider className="my-3 w-40" />
          <p className="font-serif-alt text-[0.62rem] tracking-[0.24em] text-marigold-600 uppercase">
            {partner.title}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function CoupleShowcase({ groom, bride }: CoupleShowcaseProps) {
  return (
    <section
      aria-labelledby="showcase-heading"
      className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-ivory to-marigold-100/40 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Mandala
          className="absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2"
          opacity={0.07}
        />
      </div>

      <SectionHeading
        id="showcase-heading"
        eyebrow="Through the lens"
        script="A closer look at"
        title="The Bride & Groom"
        subtitle="A handful of favourite frames from the months leading up to the wedding."
      />

      <div className="mx-auto mt-14 grid max-w-6xl gap-14 sm:gap-20 lg:grid-cols-2 lg:gap-10">
        <ShowcaseStack partner={groom} accent="warm" />
        <ShowcaseStack partner={bride} accent="rose" flip />
      </div>
    </section>
  );
}
