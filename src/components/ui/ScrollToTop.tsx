"use client";

import { useEffect, useState } from "react";

/** How far down the page (px) before the button appears. */
const SHOW_AFTER = 500;
/** Radius of the progress ring, in the 56-unit SVG box. */
const RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Floating "back to top" button, bottom-right. It rises in once the guest has
 * scrolled past the banner, and a gold ring around it fills with how far down
 * the page they are. Clicking glides back to the top (instantly for anyone
 * who has asked their device for reduced motion).
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(window.scrollY > SHOW_AFTER);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    // One update per animation frame, however fast scroll events arrive.
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Scroll back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`group fixed right-4 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-maroon-700 to-maroon-900 text-cream-100 shadow-[0_12px_30px_-10px_rgba(107,15,26,0.8)] transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_36px_-10px_rgba(107,15,26,0.9)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-marigold-300/60 active:scale-95 sm:right-6 sm:bottom-7 sm:h-16 sm:w-16 ${
        visible
          ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-6 scale-75 opacity-0"
      }`}
    >
      {/* Scroll-progress ring */}
      <svg aria-hidden="true" viewBox="0 0 56 56" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="rgba(255,247,236,0.18)" strokeWidth="2.5" />
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="url(#scroll-top-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          className="transition-[stroke-dashoffset] duration-150 ease-out"
        />
        <defs>
          <linearGradient id="scroll-top-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffc45c" />
            <stop offset="1" stopColor="#d9b64a" />
          </linearGradient>
        </defs>
      </svg>

      {/* Soft halo that breathes while the button is shown */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-marigold-400/50 motion-safe:animate-[scrollTopHalo_2.4s_ease-out_infinite]"
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 motion-safe:group-hover:animate-[floatY_1.2s_ease-in-out_infinite] sm:h-6 sm:w-6"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
