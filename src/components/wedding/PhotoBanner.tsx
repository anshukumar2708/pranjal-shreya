import Image from "next/image";

import Reveal from "@/components/ui/Reveal";

interface PhotoBannerProps {
  src: string;
  alt: string;
  groomName: string;
  brideName: string;
  tagline?: string;
}

/**
 * Full-screen photo banner with the couple's names set over its lower third.
 * The faces sit in the upper-middle of the photo, so the title lives below
 * them on a maroon scrim instead of across them.
 */
export default function PhotoBanner({
  src,
  alt,
  groomName,
  brideName,
  tagline = "Together Forever",
}: PhotoBannerProps) {
  return (
    <section
      id="home"
      aria-labelledby="banner-heading"
      className="relative isolate flex h-[100svh] min-h-[32rem] w-full items-end justify-center overflow-hidden bg-maroon-900"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[50%_35%] motion-safe:animate-[bannerZoom_9s_cubic-bezier(0.2,0.7,0.2,1)_both]"
      />

      {/* Top scrim keeps the navbar readable; the bottom one carries the title.
          Maroon rather than black so the shade matches the theme and the
          groom's sherwani. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/60 to-transparent sm:h-48"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] bg-gradient-to-t from-maroon-900/95 via-maroon-900/45 to-transparent"
      />

      <div className="w-full px-4 pb-[clamp(3rem,9svh,5.5rem)] text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
        <Reveal variant="up" delay={200}>
          <h1
            id="banner-heading"
            className="flex flex-wrap items-baseline justify-center gap-x-[0.3em] font-display text-[clamp(2.75rem,8vw,6rem)] leading-[1.05] font-semibold text-cream-100"
          >
            <span>{groomName}</span>
            <span className="gold-text font-script text-[0.8em] font-normal">
              &amp;
            </span>
            <span>{brideName}</span>
          </h1>
        </Reveal>

        <Reveal variant="fade" delay={650}>
          <div className="mt-[clamp(0.75rem,2svh,1.25rem)] flex items-center justify-center gap-3 sm:gap-5">
            <span
              aria-hidden="true"
              className="h-px w-[clamp(2.5rem,10vw,7rem)] bg-gradient-to-r from-transparent to-gold-400"
            />
            <p className="font-serif-alt text-xs tracking-[0.3em] whitespace-nowrap text-marigold-300 uppercase sm:text-sm">
              {tagline}
            </p>
            <span
              aria-hidden="true"
              className="h-px w-[clamp(2.5rem,10vw,7rem)] bg-gradient-to-l from-transparent to-gold-400"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
