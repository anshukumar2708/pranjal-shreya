"use client";

import { useEffect } from "react";

import { BANNER_COMPLETE_EVENT } from "@/components/wedding/PhotoBanner";
import { INVITATION_OPEN_EVENT } from "@/components/wedding/WelcomeGate";
import { slowScrollTo } from "@/lib/slowScroll";

/** How long each section stays on screen before the page moves on. */
const HOLD_MS = 15000;

/** The stops, top to bottom: every section of the invitation, then the footer. */
const STOPS = "#main > section, footer";

/**
 * Events that mean the guest has taken over. Any one of them stops the
 * auto-scroll for the rest of the visit; the guest scrolls by hand from there.
 */
const TAKE_OVER = ["touchstart", "wheel", "pointerdown", "keydown"] as const;

/** The first stop still below the top of the screen, or null at the end. */
function nextStop(): HTMLElement | null {
  const stops = Array.from(document.querySelectorAll<HTMLElement>(STOPS));
  return stops.find((el) => el.getBoundingClientRect().top > 8) ?? null;
}

/**
 * Hands-free tour of the invitation. Once the banner has shown every photo
 * (`banner:complete`), the page glides down to the next section, then on to
 * each following one every 15 seconds, and stops at the last.
 *
 * The guest can always scroll themselves, and the first touch, click, wheel
 * turn or key press stops the tour so it never fights them. With reduced
 * motion the banner never advances on its own, so the tour never starts.
 */
export default function AutoScroll() {
  useEffect(() => {
    let timer: number | null = null;
    let stopped = false;
    let cancelGlide = () => {};

    const stop = () => {
      stopped = true;
      // A touch mid-glide stops the page right where it is.
      cancelGlide();
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      TAKE_OVER.forEach((e) => window.removeEventListener(e, stop));
    };

    const advance = () => {
      if (stopped) return;
      const target = nextStop();
      if (!target) return stop();
      // The 15 seconds start once the section has arrived, not as it sets off.
      cancelGlide = slowScrollTo(target, () => {
        if (!stopped) timer = window.setTimeout(advance, HOLD_MS);
      });
    };

    const onBannerComplete = () => {
      if (!stopped && timer === null) advance();
    };

    // Listen for a take-over only once the doors part, so the "Open
    // Invitation" tap itself never counts as one.
    const onOpen = () => {
      if (stopped) return;
      TAKE_OVER.forEach((e) => window.addEventListener(e, stop, { passive: true }));
    };

    window.addEventListener(INVITATION_OPEN_EVENT, onOpen);
    window.addEventListener(BANNER_COMPLETE_EVENT, onBannerComplete);
    return () => {
      window.removeEventListener(INVITATION_OPEN_EVENT, onOpen);
      window.removeEventListener(BANNER_COMPLETE_EVENT, onBannerComplete);
      stop();
    };
  }, []);

  return null;
}
