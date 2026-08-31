"use client";

import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface FloatingPetalsProps {
  /** Petal count on larger screens. Trimmed automatically on phones. */
  count?: number;
  className?: string;
}

const PETAL_COLORS = ["#f2789f", "#ff9f45", "#f9a620", "#e75480", "#ffc45c", "#c1121f"];

/**
 * Deterministic pseudo-random in [0, 1).
 *
 * This is a client component, so every value here is computed twice — once on
 * the server for the HTML, once in the browser during hydration — and the two
 * must agree exactly or React reports a hydration mismatch.
 *
 * That rules out `Math.random()` (different every call) *and* `Math.sin()`,
 * whose precision is implementation-defined in ECMAScript: Node and the browser
 * disagree in the final bits. This uses only `Math.imul` and bitwise operators,
 * which ECMAScript specifies exactly, so the result is bit-identical everywhere.
 */
function scatter(index: number, salt: number): number {
  let hash = (Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca6b)) | 0;
  hash = Math.imul(hash ^ (hash >>> 15), 0x2c1b3c6d);
  hash = Math.imul(hash ^ (hash >>> 12), 0x297a2d39);
  hash ^= hash >>> 15;

  // `>>> 0` reinterprets as unsigned so the result is always positive.
  return (hash >>> 0) / 4294967296;
}

/**
 * Rounds to a fixed number of decimals.
 *
 * Long floats are a second hydration hazard: React serialises the full value
 * into the style attribute, the browser reparses it at CSS precision, and the
 * two no longer match. Short, fixed-precision numbers survive the round trip.
 */
function round(value: number, decimals = 2): number {
  return Number(value.toFixed(decimals));
}

/**
 * Rose and marigold petals drifting down the page.
 * Skipped entirely when the visitor prefers reduced motion.
 */
export default function FloatingPetals({ count = 14, className = "" }: FloatingPetalsProps) {
  const reducedMotion = usePrefersReducedMotion();
  const isSmall = useMediaQuery("(max-width: 640px)");

  if (reducedMotion) return null;

  const total = isSmall ? Math.min(count, 8) : count;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {Array.from({ length: total }, (_, id) => {
        const size = round(8 + scatter(id, 1) * 12);
        const rounded = id % 3 === 0;

        return (
          <span
            key={id}
            className="absolute top-0 block"
            style={
              {
                left: `${round(scatter(id, 0) * 100)}%`,
                width: `${size}px`,
                height: `${round(size * (rounded ? 1 : 1.5))}px`,
                background: `radial-gradient(circle at 30% 30%, #fff8, ${
                  PETAL_COLORS[id % PETAL_COLORS.length]
                })`,
                borderRadius: rounded ? "50%" : "50% 12% 50% 12%",
                animation: `petal-fall ${round(14 + scatter(id, 2) * 16)}s linear ${round(
                  scatter(id, 3) * -30,
                )}s infinite`,
                "--petal-drift": `${round((scatter(id, 4) - 0.5) * 220, 1)}px`,
                "--petal-opacity": `${round(0.35 + scatter(id, 5) * 0.4, 3)}`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
