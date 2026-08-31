"use client";

import { useCountdown } from "@/hooks/useCountdown";
import FloralDivider from "@/components/decorations/FloralDivider";
import Mandala from "@/components/decorations/Mandala";
import MarigoldBorder from "@/components/decorations/MarigoldBorder";
import Reveal from "@/components/ui/Reveal";

interface CountdownProps {
  /** ISO timestamp of the wedding moment. */
  target: string;
  /** Human-readable date shown under the heading. */
  targetLabel: string;
  coupleName: string;
}

function Unit({ value, label, ready }: { value: number; label: string; ready: boolean }) {
  return (
    <div className="glass-card-dark relative flex min-w-0 flex-col items-center justify-center rounded-2xl px-2 py-4 sm:rounded-3xl sm:px-4 sm:py-6">
      <span
        aria-hidden="true"
        className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-marigold-400 shadow-[0_0_12px_rgba(249,166,32,0.8)]"
      />
      <span
        className="gold-text font-display text-3xl leading-none font-semibold tabular-nums sm:text-5xl lg:text-6xl"
        // Announce the whole block at once rather than every ticking digit.
        aria-hidden="true"
      >
        {ready ? String(value).padStart(2, "0") : "--"}
      </span>
      <span className="mt-2 font-serif-alt text-[0.6rem] tracking-[0.22em] text-cream-200/80 uppercase sm:text-xs">
        {label}
      </span>
    </div>
  );
}

/**
 * Live countdown to the wedding. Renders placeholder dashes until the first
 * client tick so server and client markup match, and switches to a celebration
 * message once the date arrives instead of counting negative.
 */
export default function Countdown({ target, targetLabel, coupleName }: CountdownProps) {
  const { days, hours, minutes, seconds, isComplete, isReady } = useCountdown(target);

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  return (
    <section
      aria-labelledby="countdown-heading"
      className="relative overflow-hidden bg-gradient-to-br from-maroon-800 via-maroon-700 to-maroon-900 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-mandala absolute inset-0 opacity-40" />
        <Mandala
          className="absolute -top-24 -right-24 h-[28rem] w-[28rem]"
          color="#e6be8a"
          opacity={0.14}
        />
        <Mandala
          className="absolute -bottom-32 -left-24 h-[26rem] w-[26rem]"
          color="#ffc45c"
          opacity={0.12}
        />
        {/* Twinkling diyas */}
        {[
          { top: "18%", left: "8%" },
          { top: "30%", left: "88%" },
          { top: "72%", left: "16%" },
          { top: "62%", left: "80%" },
          { top: "12%", left: "62%" },
        ].map((star, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-marigold-300 motion-safe:animate-[twinkle_4s_ease-in-out_infinite]"
            style={{ ...star, animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </div>

      <MarigoldBorder edge="top" />

      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="eyebrow text-gold-300">Counting every moment</p>
        <h2
          id="countdown-heading"
          className="mt-3 font-display text-3xl font-semibold text-cream-100 sm:text-4xl lg:text-5xl"
        >
          {isComplete ? "The Day Is Here" : "The Wedding Begins In"}
        </h2>

        <FloralDivider tone="light" className="my-6" />

        {isComplete ? (
          <div className="glass-card-dark mx-auto max-w-2xl rounded-3xl px-6 py-10 sm:px-10">
            <p aria-hidden="true" className="text-4xl">
              🎉
            </p>
            <p className="mt-4 font-script text-3xl text-marigold-300 sm:text-4xl">
              {coupleName} are married!
            </p>
            <p className="mt-4 text-cream-200/85">
              Thank you for celebrating with us. The shehnai has played, the pheras are
              complete, and our hearts are full.
            </p>
          </div>
        ) : (
          <>
            {/* One polite announcement covers the whole timer. */}
            <p className="sr-only" role="status" aria-live="polite">
              {isReady
                ? `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds until the wedding.`
                : "Loading countdown."}
            </p>

            <div className="mx-auto grid max-w-3xl grid-cols-4 gap-2 sm:gap-4">
              {units.map((unit) => (
                <Unit key={unit.label} {...unit} ready={isReady} />
              ))}
            </div>

            <p className="mt-8 font-serif-alt text-sm tracking-[0.2em] text-gold-300 uppercase">
              {targetLabel}
            </p>
          </>
        )}
      </Reveal>

      <MarigoldBorder edge="bottom" />
    </section>
  );
}
