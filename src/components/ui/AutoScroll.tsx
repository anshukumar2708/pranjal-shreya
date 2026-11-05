"use client";

import { useEffect } from "react";

import { BANNER_COMPLETE_EVENT } from "@/components/wedding/PhotoBanner";
import { slowScrollTo } from "@/lib/slowScroll";

/** How long each section stays on screen before the page moves on. */
const HOLD_MS = 10000;

/** The stops, top to bottom: every section of the invitation, the footer,
    then the "Designed & Developed by" credit at the very bottom. */
const STOPS = "#main > section, footer, [data-autoscroll-stop]";

/**
 * The guest's own input never ends the tour — it only pauses it, so it never
 * fights a finger. A press holds it for as long as the finger stays down; a
 * release, wheel turn or key press restarts the 10 seconds from there.
 */
const PRESS = ["touchstart", "pointerdown"] as const;
const RELEASE = ["touchend", "touchcancel", "pointerup", "pointercancel"] as const;
const NUDGE = ["wheel", "keydown"] as const;

/** The first stop still below the top of the screen, or null at the end. */
function nextStop(): HTMLElement | null {
  const stops = Array.from(document.querySelectorAll<HTMLElement>(STOPS));
  return stops.find((el) => el.getBoundingClientRect().top > 8) ?? null;
}

/** True while the guest is typing in a field, e.g. writing a blessing. */
function typing(): boolean {
  const el = document.activeElement;
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement;
}

/**
 * Hands-free tour of the invitation. Once the banner has shown every photo
 * (`banner:complete`), the page glides down to the next section, then on to
 * each following one every 10 seconds, all the way down to the "Designed & Developed by" credit.
 *
 * The tour runs whether or not the guest touches the screen. While a finger
 * is down it pauses (a glide in progress halts where it is); once the finger
 * leaves the screen, the 10 seconds start over from wherever the guest has
 * scrolled to, and the tour carries on to the next section below. A wheel turn
 * or key press does the same. It also pauses while the guest is typing or has
 * switched to another tab or app, resuming when they return. With reduced
 * motion the banner never advances on its own, so the tour never starts.
 */
export default function AutoScroll() {
  useEffect(() => {
    let timer: number | null = null;
    let started = false;
    let pressed = false;
    let cancelGlide = () => {};

    const pause = () => {
      cancelGlide();
      cancelGlide = () => {};
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
    };

    const hold = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(advance, HOLD_MS);
    };

    const advance = () => {
      timer = null;
      // A release or return from another tab re-arms the tour.
      if (pressed || document.hidden) return;
      if (typing()) return hold();
      const target = nextStop();
      // At the credit: nothing below. A guest scrolling back up re-arms it.
      if (!target) return;
      // The 10 seconds start once the section has arrived, not as it sets off.
      cancelGlide = slowScrollTo(target, hold);
    };

    const onPress = () => {
      pressed = true;
      if (started) pause();
    };

    const onRelease = () => {
      pressed = false;
      if (started) hold();
    };

    const onNudge = () => {
      if (!started) return;
      pause();
      hold();
    };

    const onVisibility = () => {
      if (!started) return;
      if (document.hidden) pause();
      else hold();
    };

    const onBannerComplete = () => {
      if (started) return;
      started = true;
      advance();
    };

    const listen = [
      ...PRESS.map((e) => [e, onPress] as const),
      ...RELEASE.map((e) => [e, onRelease] as const),
      ...NUDGE.map((e) => [e, onNudge] as const),
    ];

    window.addEventListener(BANNER_COMPLETE_EVENT, onBannerComplete);
    document.addEventListener("visibilitychange", onVisibility);
    listen.forEach(([e, fn]) => window.addEventListener(e, fn, { passive: true }));
    return () => {
      window.removeEventListener(BANNER_COMPLETE_EVENT, onBannerComplete);
      document.removeEventListener("visibilitychange", onVisibility);
      listen.forEach(([e, fn]) => window.removeEventListener(e, fn));
      pause();
    };
  }, []);

  return null;
}
