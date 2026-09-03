"use client";

import WeddingImage from "@/components/ui/WeddingImage";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/types/wedding";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface GallerySectionProps {
  images: GalleryImage[];
}

/** Minimum horizontal travel, in px, before a touch counts as a swipe. */
const SWIPE_THRESHOLD = 45;

export default function GallerySection({ images }: GallerySectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  // Restores focus to the thumbnail that opened the lightbox.
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const isOpen = openIndex !== null;

  const close = useCallback(() => {
    setOpenIndex(null);
    lastTriggerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  const open = (index: number, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setOpenIndex(index);
  };

  // Keyboard controls, scroll lock and a simple focus trap while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      } else if (event.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        );
        if (!focusables?.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close, step]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) step(delta < 0 ? 1 : -1);

    touchStartX.current = null;
  };

  const active = openIndex === null ? null : images[openIndex];

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative overflow-hidden bg-gradient-to-b from-marigold-100/40 via-ivory to-cream-100 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-mandala absolute inset-0 opacity-40" />
        <Mandala
          className="absolute -right-36 bottom-10 h-[28rem] w-[28rem]"
          color="#c1121f"
          opacity={0.08}
        />
      </div>

      <SectionHeading
        id="gallery-heading"
        eyebrow="Moments we kept"
        script="Our"
        title="Wedding Gallery"
        subtitle="Photographs from the ceremonies, the families and the many small moments in between. Tap any picture to see it larger."
      />

      {/* Masonry: 2 columns on mobile, 3 on tablet, 4 on desktop. */}
      <ul className="mx-auto mt-12 grid max-w-7xl auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[210px] lg:grid-cols-4">
        {images.map((image, index) => (
          <Reveal
            key={image.src}
            variant="scale"
            delay={(index % 8) * 60}
            as="li"
            className={image.tall ? "row-span-2" : "row-span-1"}
          >
            <button
              type="button"
              onClick={(event) => open(index, event.currentTarget)}
              aria-label={`Open photo: ${image.caption}`}
              className="group relative h-full w-full overflow-hidden rounded-2xl border-2 border-cream-100 shadow-petal transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(107,15,26,0.85)]"
            >
              <WeddingImage
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 31vw, 23vw"
                style={{ objectPosition: image.focus }}
                className="object-cover transition-transform duration-[1400ms] group-hover:scale-110"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-maroon-900/75 via-maroon-900/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95"
              />
              <span className="absolute inset-x-0 bottom-0 translate-y-1 p-3 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <span className="block font-display text-sm font-semibold text-cream-100 sm:text-base">
                  {image.caption}
                </span>
                <span className="mt-0.5 block font-serif-alt text-[0.55rem] tracking-[0.2em] text-marigold-300 uppercase">
                  View
                </span>
              </span>
              {/* Corner gold tick */}
              <span
                aria-hidden="true"
                className="absolute top-2 right-2 h-6 w-6 rounded-full border border-gold-300/70 bg-maroon-900/30 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100"
              />
            </button>
          </Reveal>
        ))}
      </ul>

      {/* ---------------------------- Lightbox ---------------------------- */}
      {isOpen && active ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${openIndex + 1} of ${images.length}: ${active.caption}`}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-maroon-900/94 p-3 backdrop-blur-md sm:p-6"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Click-away backdrop */}
          <button
            type="button"
            aria-label="Close gallery"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-zoom-out"
          />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold-300/50 bg-maroon-800/80 text-xl text-cream-100 transition-colors hover:bg-royal-600 sm:top-6 sm:right-6"
          >
            <span aria-hidden="true">✕</span>
          </button>

          <div className="relative z-10 flex w-full max-w-5xl items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-300/50 bg-maroon-800/80 text-xl text-cream-100 transition-colors hover:bg-royal-600 sm:h-14 sm:w-14"
            >
              <span aria-hidden="true">‹</span>
            </button>

            <figure className="relative min-w-0 flex-1">
              <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-2xl border-2 border-gold-500/40 bg-maroon-800 shadow-2xl sm:aspect-[3/2]">
                <WeddingImage
                  key={active.src}
                  src={active.src}
                  alt={active.alt}
                  fill
                  sizes="(max-width: 1024px) 92vw, 64rem"
                  className="object-contain"
                  priority
                />
              </div>
              <figcaption className="mt-3 text-center">
                <span className="font-display text-lg font-semibold text-cream-100 sm:text-xl">
                  {active.caption}
                </span>
                <span className="mt-1 block font-serif-alt text-[0.6rem] tracking-[0.22em] text-gold-300 uppercase">
                  {openIndex + 1} / {images.length}
                </span>
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-300/50 bg-maroon-800/80 text-xl text-cream-100 transition-colors hover:bg-royal-600 sm:h-14 sm:w-14"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>

          <p className="relative z-10 mt-4 text-center text-[0.7rem] text-cream-200/60">
            Use the arrow keys or swipe to browse · Esc to close
          </p>
        </div>
      ) : null}
    </section>
  );
}
