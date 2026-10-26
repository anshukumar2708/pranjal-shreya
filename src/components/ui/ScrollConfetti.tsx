"use client";

import { useEffect } from "react";

import { celebrate, sidePoppers } from "@/lib/confetti";

/** Delay before the opening burst, so it lands as the banner photo opens up. */
const OPENING_DELAY_MS = 900;
/**
 * A section fires once its top climbs past this share of the screen height.
 * Watching a line rather than a share of the section means even sections many
 * screens tall (the ceremonies, the blessings wall on phones) still fire.
 */
const TRIGGER_LINE = 0.7;

/**
 * Party poppers for the whole page: a full celebration over the banner when
 * the invitation opens, then a pair as each later section scrolls into view.
 * A section re-arms once it has left the screen, so coming back to it — from
 * either direction — celebrates again. Renders nothing itself.
 */
export default function ScrollConfetti({ openingSectionId = "home" }: { openingSectionId?: string }) {
  useEffect(() => {
    const opening = window.setTimeout(celebrate, OPENING_DELAY_MS);

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id], footer"),
    ).filter((section) => section.id !== openingSectionId);

    // Sections currently inside the trigger band, so each fires on entry only.
    const inside = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !inside.has(entry.target)) {
            inside.add(entry.target);
            sidePoppers({ count: 70, speed: 16 });
          } else if (!entry.isIntersecting) {
            inside.delete(entry.target);
          }
        }
      },
      // The band runs from the top of the screen down to the trigger line.
      { rootMargin: `0px 0px -${Math.round((1 - TRIGGER_LINE) * 100)}% 0px`, threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.clearTimeout(opening);
      observer.disconnect();
    };
  }, [openingSectionId]);

  return null;
}
