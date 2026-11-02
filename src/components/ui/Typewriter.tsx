"use client";

import { useCallback, useEffect, useState } from "react";

interface TypewriterOptions {
  /** Time per letter. */
  letterMs?: number;
  /** Breath taken at the end of each line before the next begins. */
  linePauseMs?: number;
  /** Keep the cursor blinking on the last line once everything is typed. */
  keepCaret?: boolean;
}

/**
 * Types `lines` in, one letter at a time and one line after another, once
 * `started` turns true. Returns how many letters of each line are showing and
 * which line the cursor sits on (-1 for none). With reduced motion everything
 * shows at once.
 */
export function useTypewriter(
  lines: string[],
  started: boolean,
  { letterMs = 70, linePauseMs = 450, keepCaret = true }: TypewriterOptions = {},
) {
  const [typed, setTyped] = useState(0);

  const offsets = lines.map((_, i) => lines.slice(0, i).reduce((sum, line) => sum + line.length, 0));
  const total = lines.reduce((sum, line) => sum + line.length, 0);
  const lineEnd = offsets.slice(1).includes(typed);

  useEffect(() => {
    if (!started || typed >= total) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(
      () => setTyped((n) => (reduce ? total : n + 1)),
      reduce ? 0 : lineEnd ? linePauseMs : letterMs,
    );
    return () => window.clearTimeout(timer);
  }, [started, typed, total, lineEnd, letterMs, linePauseMs]);

  const shown = lines.map((line, i) => Math.min(line.length, Math.max(0, typed - offsets[i])));
  const done = typed >= total;
  const caretLine = !started
    ? -1
    : done
      ? keepCaret
        ? lines.length - 1
        : -1
      : lines.findIndex((line, i) => typed < offsets[i] + line.length);

  /** Clear everything typed, ready to type it all in again. */
  const restart = useCallback(() => setTyped(0), []);

  return { shown, caretLine, done, restart };
}

/** Gold typing cursor. Zero-width, so it never nudges the text around it. */
function Caret() {
  return (
    <span aria-hidden="true" className="relative inline-block w-0">
      <span className="absolute -top-[0.85em] left-[0.06em] h-[1em] w-[2px] bg-marigold-300 animate-[caretBlink_1s_steps(1)_infinite]" />
    </span>
  );
}

/**
 * A line of text that types itself in. The letters not yet typed are already
 * there, only transparent, so the line keeps its exact size and position, and
 * screen readers and search engines always read it whole.
 */
export function TypedText({ text, shown, caret }: { text: string; shown: number; caret: boolean }) {
  return (
    <>
      {text.slice(0, shown)}
      {caret ? <Caret /> : null}
      {shown < text.length ? <span className="opacity-0">{text.slice(shown)}</span> : null}
    </>
  );
}
