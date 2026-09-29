"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";

import WeddingImage from "@/components/ui/WeddingImage";
import type { VenuePhoto } from "@/types/wedding";

interface VenueGalleryProps {
  photos: VenuePhoto[];
  /** Venue name, used in accessible labels and the viewer's heading. */
  name: string;
  /** Badge pinned to the cover, e.g. "🥂 Reception Venue". */
  badge: string;
}

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE = 40;

/**
 * Swipe left/right on touch screens. Returns handlers for the swipe surface
 * and `wasSwipe()`, which a click handler checks so the tap that ends a swipe
 * does not also count as a click.
 */
function useSwipe(onPrev: () => void, onNext: () => void) {
  const start = useRef<number | null>(null);
  const swiped = useRef(false);
  return {
    handlers: {
      onTouchStart: (event: TouchEvent) => {
        start.current = event.touches[0].clientX;
        swiped.current = false;
      },
      onTouchEnd: (event: TouchEvent) => {
        if (start.current === null) return;
        const dx = event.changedTouches[0].clientX - start.current;
        start.current = null;
        if (Math.abs(dx) < SWIPE) return;
        swiped.current = true;
        if (dx > 0) onPrev();
        else onNext();
      },
    },
    wasSwipe: () => {
      const value = swiped.current;
      swiped.current = false;
      return value;
    },
  };
}

function Arrow({
  dir,
  onClick,
  large,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={dir === "prev" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-cream-100/40 bg-maroon-900/45 leading-none text-cream-100 backdrop-blur-md transition hover:bg-maroon-900/75 focus-visible:bg-maroon-900/75 ${
        large ? "h-12 w-12 text-3xl" : "h-10 w-10 text-2xl"
      } ${
        dir === "prev"
          ? large
            ? "left-3 sm:left-6"
            : "left-3"
          : large
            ? "right-3 sm:right-6"
            : "right-3"
      }`}
    >
      <span aria-hidden="true" className="-mt-0.5">
        {dir === "prev" ? "‹" : "›"}
      </span>
    </button>
  );
}

/**
 * A venue's photographs as a cover image with a thumbnail strip, opening into a
 * full-screen viewer.
 *
 * - The cover crossfades between photos (all are stacked, only one opaque),
 *   so changing photo never shifts the layout.
 * - Arrows, thumbnails and swipes all move the same index; the viewer shares
 *   it too, so closing the viewer leaves the cover on the photo last seen.
 * - The viewer is a modal dialog: it locks page scroll, answers ← → and Esc,
 *   and returns focus to the cover when closed.
 */
export default function VenueGallery({
  photos,
  name,
  badge,
}: VenueGalleryProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const cover = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  const count = photos.length;
  const many = count > 1;
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + count) % count),
    [count],
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const coverSwipe = useSwipe(prev, next);
  const viewerSwipe = useSwipe(prev, next);

  const close = useCallback(() => {
    setOpen(false);
    cover.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowLeft") prev();
      else if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, prev, next]);

  const current = photos[index];

  return (
    <div>
      {/* Cover */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-maroon-900"
        {...coverSwipe.handlers}
      >
        <button
          ref={cover}
          type="button"
          onClick={() => {
            if (!coverSwipe.wasSwipe()) setOpen(true);
          }}
          aria-label={`View ${name} photos full screen`}
          className="absolute inset-0 block h-full w-full cursor-zoom-in"
        >
          {photos.map((photo, i) => (
            <WeddingImage
              key={photo.src}
              src={photo.src}
              alt={i === index ? photo.alt : ""}
              aria-hidden={i === index ? undefined : true}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectPosition: photo.focus }}
              className={`object-cover transition-[opacity,transform] duration-700 ease-out ${
                i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
              }`}
            />
          ))}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-maroon-900/75 via-transparent to-maroon-900/25"
          />
        </button>

        {many ? (
          <>
            <Arrow dir="prev" onClick={prev} />
            <Arrow dir="next" onClick={next} />
          </>
        ) : null}

        {/* Counter and "expand" hint */}
        <span className="pointer-events-none absolute top-3 right-3 z-10 inline-flex items-center gap-2 rounded-full bg-maroon-900/55 px-3 py-1.5 font-serif-alt text-[0.65rem] tracking-[0.16em] text-cream-100 backdrop-blur-md">
          <span aria-hidden="true">⤢</span>
          {index + 1} / {count}
        </span>

        {/* Badge and the current photo's caption */}
        <div className="pointer-events-none absolute right-4 bottom-4 left-4 z-10 flex items-end justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-maroon-800/85 px-4 py-2 font-serif-alt text-[0.62rem] tracking-[0.2em] text-cream-100 uppercase backdrop-blur-sm">
            {badge}
          </span>
          <span
            aria-live="polite"
            className="hidden truncate font-display text-base text-cream-100 italic drop-shadow sm:block"
          >
            {current.caption}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {many ? (
        <div
          className="grid gap-2 bg-maroon-900/5 p-2 sm:gap-2.5 sm:p-2.5"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        >
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}: ${photo.caption}`}
              aria-current={i === index ? "true" : undefined}
              // Fixed height, not an aspect ratio: cards with different photo
              // counts keep equal-height strips, so side-by-side cards align.
              className={`relative h-12 overflow-hidden rounded-lg sm:h-16 lg:h-20 transition duration-300 sm:rounded-xl ${
                i === index
                  ? "ring-2 ring-marigold-400 ring-offset-2 ring-offset-cream-100"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <WeddingImage
                src={photo.src}
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 768px) 25vw, 12vw"
                style={{ objectPosition: photo.focus }}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Full-screen viewer */}
      {/* Portalled to <body>: the card is transformed by its reveal animation
          and clips its overflow, either of which would trap a fixed overlay
          inside the card instead of covering the screen. */}
      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`${name} photos`}
              className="fixed inset-0 z-[80] flex flex-col bg-black/92 backdrop-blur-sm"
              onClick={close}
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3 text-cream-100 sm:px-6 sm:py-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-semibold sm:text-xl">
                    {name}
                  </p>
                  <p className="font-serif-alt text-[0.65rem] tracking-[0.2em] text-marigold-300 uppercase">
                    {current.caption} · {index + 1} / {count}
                  </p>
                </div>
                <button
                  ref={closeButton}
                  type="button"
                  onClick={close}
                  aria-label="Close photos"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream-100/30 text-2xl leading-none transition hover:bg-cream-100/10"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <div className="relative flex-1" {...viewerSwipe.handlers}>
                <div
                  className="absolute inset-3 sm:inset-x-20 sm:inset-y-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <WeddingImage
                    key={current.src}
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="100vw"
                    style={{ objectPosition: "center" }}
                    className="object-contain"
                  />
                </div>
                {many ? (
                  <>
                    <Arrow dir="prev" onClick={prev} large />
                    <Arrow dir="next" onClick={next} large />
                  </>
                ) : null}
              </div>

              {many ? (
                <div
                  className="flex justify-center gap-2 px-4 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {photos.map((photo, i) => (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show photo ${i + 1}: ${photo.caption}`}
                      aria-current={i === index ? "true" : undefined}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === index
                          ? "w-7 bg-marigold-300"
                          : "w-2 bg-cream-100/50 hover:bg-cream-100"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
