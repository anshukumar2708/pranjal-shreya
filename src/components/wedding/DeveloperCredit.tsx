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
 * The footer's "Designed & Developed by" credit. When it scrolls into view the
 * heading, the name and the phone number type themselves in, one letter at a
 * time, with a blinking cursor that stays on the last line once done.
 *
 * Screen readers and search engines get the full text at once (the typed
 * letters are decoration), and with reduced motion it simply appears whole.
 */
export default function DeveloperCredit() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const { shown, caretLine } = useTypewriter(LINES, started);

  // Start typing the first time the credit is mostly on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setStarted(true);
      },
      { threshold: 0.6 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const phoneStarted = shown[2] > 0;

  return (
    <div ref={rootRef} className="mt-8 border-t border-gold-500/20 pt-6">
      <p
        className="font-serif-alt text-xs tracking-[0.24em] text-cream-200/60 uppercase sm:text-sm"
      >
        <TypedText text={HEADING} shown={shown[0]} caret={caretLine === 0} />
      </p>
      <p className="mt-3 flex flex-col items-center justify-center gap-x-4 gap-y-1 sm:flex-row">
        <span
          className="font-display text-xl font-semibold text-cream-100 sm:text-2xl"
        >
          <TypedText text={NAME} shown={shown[1]} caret={caretLine === 1} />
        </span>
        <span
          aria-hidden="true"
          className={`hidden text-xl text-gold-500/60 transition-opacity duration-500 sm:inline ${
            phoneStarted ? "opacity-100" : "opacity-0"
          }`}
        >
          ·
        </span>
        <Link
          href={PHONE_HREF}
          aria-label={`Call ${NAME}, ${PHONE}`}
          className="group inline-flex items-center gap-2.5 font-display text-lg text-cream-200/85 transition-colors hover:text-marigold-300 sm:text-xl"
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
  );
}
