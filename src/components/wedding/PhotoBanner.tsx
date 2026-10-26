"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import type { BannerSlide } from "@/types/wedding";

/** How long each photograph holds before crossfading to the next. */
const SLIDE_MS = 6000;

interface PhotoBannerProps {
  slides: BannerSlide[];
  groomName: string;
  brideName: string;
  tagline?: string;
}

/**
 * Full-screen photo banner with the couple's names set over its lower third.
 * The faces sit in the upper-middle of each photo, so the title lives below
 * them on a maroon scrim instead of across them. Several slides crossfade on a
 * timer, each with a slow push-in; with reduced motion only the first shows.
 */
export default function PhotoBanner({
  slides,
  groomName,
  brideName,
  tagline = "Together Forever",
}: PhotoBannerProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Re-armed on every change, so picking a slide by hand restarts its full hold.
    const timer = window.setTimeout(
      () => setActive((active + 1) % slides.length),
      SLIDE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, slides.length]);

  return (
    <section
      id="home"
      aria-labelledby="banner-heading"
      className="relative isolate flex h-[100svh] min-h-[32rem] w-full items-end justify-center overflow-hidden bg-maroon-900"
    >
      {slides.map((slide, index) => {
        const isActive = index === active;
        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt={isActive ? slide.alt : ""}
            aria-hidden={!isActive}
            fill
            priority={index === 0}
            sizes="100vw"
            style={{ objectPosition: slide.focus }}
            className={`-z-20 object-cover transition-[opacity,transform] ease-out motion-reduce:transition-none ${
              isActive
                ? "scale-100 opacity-100 duration-[1500ms,9000ms]"
                : "scale-110 opacity-0 duration-[1500ms,1500ms]"
            }`}
          />
        );
      })}

      {slides.length > 1 && (
        <div className="absolute top-1/2 right-4 z-10 flex -translate-y-1/2 flex-col gap-2.5 sm:right-6">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1} of ${slides.length}`}
              aria-current={index === active}
              className={`w-1.5 rounded-full bg-cream-100 transition-all duration-500 ${
                index === active ? "h-7 opacity-100" : "h-1.5 opacity-50 hover:opacity-80"
              }`}
            />
          ))}
        </div>
      )}

      {/* The scrim carries the title. Maroon rather than black so the shade
          matches the theme and the groom's sherwani. */}
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
