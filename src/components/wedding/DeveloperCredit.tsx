"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import PhoneIcon from "@/components/ui/PhoneIcon";

const HEADING = "Designed & Developed by";
const NAME = "Anshu Singh";
const PHONE = "+91 97706 01469";
const PHONE_HREF = "tel:+919770601469";

/** The three lines, typed in this order. */
const LINES = [HEADING, NAME, PHONE];
const TOTAL = LINES.reduce((sum, line) => sum + line.length, 0);

/** Time per letter, and the breath taken at the end of each line. */
const LETTER_MS = 70;
const LINE_PAUSE_MS = 450;

/** Where each line starts in the one running letter count. */
const OFFSETS = LINES.map((_, i) => LINES.slice(0, i).reduce((sum, line) => sum + line.length, 0));

/** Gold typing cursor. */
function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-marigold-300 animate-[caretBlink_1s_steps(1)_infinite]"
    />
  );
}

/**
 * One line that types itself in. The full text sits invisibly underneath to
 * hold the space, so nothing around it shifts as the letters appear.
 */
function TypedLine({ text, shown, caret }: { text: string; shown: number; caret: boolean }) {
  return (
    <span className="relative inline-block whitespace-pre">
      <span className="invisible">{text}</span>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 whitespace-pre">
        {text.slice(0, shown)}
        {caret ? <Caret /> : null}
      </span>
    </span>
  );
}

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
  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(false);

  // Start typing the first time the credit is mostly on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) setTyped(TOTAL);
        setStarted(true);
      },
      { threshold: 0.6 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // One letter per tick, with a short pause at the end of each line.
  useEffect(() => {
    if (!started || typed >= TOTAL) return;
    const lineEnd = OFFSETS.slice(1).includes(typed);
    const timer = window.setTimeout(() => setTyped((n) => n + 1), lineEnd ? LINE_PAUSE_MS : LETTER_MS);
    return () => window.clearTimeout(timer);
  }, [started, typed]);

  const shown = LINES.map((line, i) => Math.min(line.length, Math.max(0, typed - OFFSETS[i])));
  // The cursor sits on the line being typed, and rests on the last when done.
  const caretLine = !started
    ? -1
    : typed >= TOTAL
      ? LINES.length - 1
      : LINES.findIndex((line, i) => typed < OFFSETS[i] + line.length);
  const phoneStarted = shown[2] > 0;

  return (
    <div ref={rootRef} className="mt-8 border-t border-gold-500/20 pt-6">
      <p
        aria-label={HEADING}
        className="font-serif-alt text-xs tracking-[0.24em] text-cream-200/60 uppercase sm:text-sm"
      >
        <TypedLine text={HEADING} shown={shown[0]} caret={caretLine === 0} />
      </p>
      <p className="mt-3 flex flex-col items-center justify-center gap-x-4 gap-y-1 sm:flex-row">
        <span
          aria-label={NAME}
          className="font-display text-xl font-semibold text-cream-100 sm:text-2xl"
        >
          <TypedLine text={NAME} shown={shown[1]} caret={caretLine === 1} />
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
          <TypedLine text={PHONE} shown={shown[2]} caret={caretLine === 2} />
        </Link>
      </p>
    </div>
  );
}
