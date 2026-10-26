"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import Reveal from "@/components/ui/Reveal";
import { sidePoppers } from "@/lib/confetti";
import type { BannerSlide } from "@/types/wedding";

/** How long each photograph holds before the next one opens over it. */
const SLIDE_MS = 6000;
/** Length of the iris reveal that brings each photograph in. */
const REVEAL_MS = 1600;
/** Horizontal travel, in px, that counts as a swipe on touch screens. */
const SWIPE_PX = 50;
/** Number of `bannerKenBurns*` keyframes in globals.css. */
const CAMERA_MOVES = 4;

/**
 * One slide's photograph, filling the screen on every device. The same photo
 * is cropped by `focus` on wide screens and by `focusMobile` on portrait ones
 * (phones), where only about the middle third of its width fits.
 */
function SlidePhoto({
  slide,
  alt,
  first,
  animation,
}: {
  slide: BannerSlide;
  alt: string;
  first: boolean;
  animation?: string;
}) {
  return (
    <Image
      src={slide.src}
      alt={alt}
      fill
      sizes="100vw"
      quality={90}
      // Every slide is fetched up front, so a reveal never opens onto a blank
      // frame; the first is also the page's largest paint, so it goes first.
      loading="eager"
      fetchPriority={first ? "high" : undefined}
      className="object-cover [object-position:var(--focus)] portrait:[object-position:var(--focus-mobile)]"
      style={{
        ["--focus" as string]: slide.focus ?? "50% 50%",
        ["--focus-mobile" as string]: slide.focusMobile ?? slide.focus ?? "50% 50%",
        animation,
      }}
    />
  );
}

interface PhotoBannerProps {
  slides: BannerSlide[];
  groomName: string;
  brideName: string;
  tagline?: string;
}

/**
 * Full-screen photo banner with the couple's names set over its lower third.
 * The faces sit in the upper-middle of each photo, so the title lives below
 * them on a maroon scrim instead of across them.
 *
 * Slides advance on a timer, by the dots, or by swiping. Each incoming photo
 * opens out of a soft iris over the outgoing one, which keeps its slow camera
 * move running underneath until it is fully covered, so nothing ever jumps.
 * With reduced motion the timer never starts and the animations collapse to
 * instant (see the global reduced-motion rule).
 */
export default function PhotoBanner({
  slides,
  groomName,
  brideName,
  tagline = "Together Forever",
}: PhotoBannerProps) {
  // `previous` stays painted beneath `active` while the reveal plays.
  const [{ active, previous }, setShown] = useState<{ active: number; previous: number | null }>(
    { active: 0, previous: null },
  );
  const touchStartX = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // A party popper with every new photo. The first photo's burst comes from
  // the page-wide opening celebration, so only later changes fire here — and
  // only while the banner is still mostly on screen, or the running slideshow
  // would keep showering confetti over sections further down.
  useEffect(() => {
    if (previous === null) return;
    const box = sectionRef.current?.getBoundingClientRect();
    if (!box || box.bottom < window.innerHeight * 0.5) return;
    sidePoppers({ count: 90, speed: 18 });
  }, [active, previous]);

  const show = (index: number) =>
    setShown((current) =>
      index === current.active ? current : { active: index, previous: current.active },
    );
  const step = (by: number) => show((active + by + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Re-armed on every change, so picking a slide by hand restarts its full hold.
    const timer = window.setTimeout(
      () =>
        setShown({ active: (active + 1) % slides.length, previous: active }),
      SLIDE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, slides.length]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="banner-heading"
      aria-roledescription="carousel"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null || slides.length < 2) return;
        const travel = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(travel) >= SWIPE_PX) step(travel < 0 ? 1 : -1);
      }}
      className="relative isolate flex h-[100svh] min-h-[32rem] w-full items-end justify-center overflow-hidden bg-maroon-900"
    >
      {slides.map((slide, index) => {
        const isActive = index === active;
        const isPrevious = index === previous;
        return (
          <div
            key={slide.src}
            aria-hidden={!isActive}
            className={`absolute inset-0 overflow-hidden ${
              isActive || isPrevious ? "" : "invisible"
            }`}
            style={{
              zIndex: isActive ? -20 : -21,
              animation: isActive
                ? `bannerReveal ${REVEAL_MS}ms cubic-bezier(0.65, 0, 0.35, 1) both`
                : undefined,
            }}
          >
            <SlidePhoto
              slide={slide}
              alt={isActive ? slide.alt : ""}
              first={index === 0}
              // Same value while active and while being covered, so the move
              // carries on uninterrupted through the next slide's reveal.
              animation={
                isActive || isPrevious
                  ? `bannerKenBurns${index % CAMERA_MOVES} ${SLIDE_MS + REVEAL_MS}ms ease-in-out both`
                  : undefined
              }
            />
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute top-1/2 right-4 z-10 flex -translate-y-1/2 flex-col items-center gap-2.5 sm:right-6">
          {slides.map((slide, index) => {
            const isActive = index === active;
            return (
              <button
                key={slide.src}
                type="button"
                onClick={() => show(index)}
                aria-label={`Show photo ${index + 1} of ${slides.length}`}
                aria-current={isActive}
                className={`relative w-1.5 overflow-hidden rounded-full transition-all duration-500 ${
                  isActive
                    ? "h-9 bg-cream-100/35"
                    : "h-1.5 bg-cream-100/50 hover:bg-cream-100/80"
                }`}
              >
                {/* Fills over the hold, showing how long until the next photo. */}
                {isActive && (
                  <span
                    key={active}
                    aria-hidden="true"
                    className="absolute inset-0 origin-top rounded-full bg-cream-100"
                    style={{ animation: `bannerProgress ${SLIDE_MS}ms linear both` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* The scrim carries the title. Maroon rather than black so the shade
          matches the theme and the groom's sherwani. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] bg-gradient-to-t from-maroon-900/95 via-maroon-900/45 to-transparent"
      />

      {/* Phones lift the title clear of the fixed music button in the bottom
          corner; wider screens have room beside it. */}
      <div className="w-full px-4 pb-[5.625rem] text-center sm:pb-[clamp(3rem,9svh,5.5rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
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
