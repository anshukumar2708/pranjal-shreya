"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import PhoneIcon from "@/components/ui/PhoneIcon";
import { TypedText, useTypewriter } from "@/components/ui/Typewriter";

const HEADING = "Designed & Developed by";
const NAME = "Anshu Singh";
const PHONE = "+91 97706 01469";
const PHONE_HREF = "tel:+919770601469";

/** The three lines, typed in this order. */
const LINES = [HEADING, NAME, PHONE];

/**
 * The footer's "Designed & Developed by" credit. Every time it scrolls into
 * view the heading, the name and the phone number type themselves in, one
 * letter at a time, with a blinking cursor that stays on the last line once
 * done.
 *
 * Screen readers and search engines get the full text at once (the typed
 * letters are decoration), and with reduced motion it simply appears whole.
 */
export default function DeveloperCredit() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const { shown, caretLine, restart } = useTypewriter(LINES, started, {
    letterMs: 130,
    linePauseMs: 600,
  });

  // Type it in whenever the credit is mostly on screen; once it has fully
  // left the screen, clear it so the next visit types it in afresh.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.6) {
          setStarted(true);
        } else if (!entry.isIntersecting) {
          setStarted(false);
          restart();
        }
      },
      { threshold: [0, 0.6] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [restart]);

  const phoneStarted = shown[2] > 0;

  return (
    <div ref={rootRef} data-autoscroll-stop className="mt-8 border-t border-gold-500/20 pt-6">
      {/* Its own glowing panel, so the credit reads apart from the footer
          around it: saffron heading, gold name, cream number. Full width on
          phones; on wider screens it wraps snugly around the text. */}
      <div className="block w-full rounded-2xl sm:inline-block sm:w-auto border border-gold-400/45 bg-gradient-to-br from-maroon-700/50 via-maroon-900/70 to-maroon-700/50 px-6 py-5 shadow-[0_0_28px_-6px_rgba(232,180,60,0.45),inset_0_1px_0_rgba(246,227,161,0.18)] sm:px-10 lg:px-16 lg:py-10">
        <p className="font-serif-alt text-xs tracking-[0.24em] text-marigold-300 uppercase sm:text-sm">
          <TypedText text={HEADING} shown={shown[0]} caret={caretLine === 0} />
        </p>
        <p className="mt-3 flex flex-col items-center justify-center gap-x-4 gap-y-1 sm:flex-row lg:mt-5">
          <span className="font-display text-2xl font-semibold text-gold-300 drop-shadow-[0_0_10px_rgba(232,197,96,0.45)] sm:text-3xl">
            <TypedText text={NAME} shown={shown[1]} caret={caretLine === 1} />
          </span>
          <span
            aria-hidden="true"
            className={`hidden text-2xl text-marigold-400 transition-opacity duration-500 sm:inline ${
              phoneStarted ? "opacity-100" : "opacity-0"
            }`}
          >
            ·
          </span>
          <Link
            href={PHONE_HREF}
            aria-label={`Call ${NAME}, ${PHONE}`}
            className="group inline-flex items-center gap-2.5 font-display text-xl text-cream-100 transition-colors hover:text-marigold-300 sm:text-2xl"
          >
            {/* The call button pops in just as the number starts typing. */}
            <span
              aria-hidden="true"
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-marigold-400 to-gold-500 text-maroon-900 shadow-[0_6px_16px_-6px_rgba(249,166,32,0.8)] transition duration-500 group-hover:scale-110 group-active:scale-95 ${
                phoneStarted ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              <PhoneIcon className="h-4 w-4" />
            </span>
            <TypedText text={PHONE} shown={shown[2]} caret={caretLine === 2} />
          </Link>
        </p>
      </div>
    </div>
  );
}
