interface HangingFlowersProps {
  className?: string;
  /** Number of strands across the width. */
  strands?: number;
  tone?: "warm" | "cool";
}

const WARM = ["#ff7a00", "#f9a620", "#c1121f", "#ffc45c", "#e75480"];
const COOL = ["#e6be8a", "#ffc45c", "#f2789f", "#93c9a8", "#ff9f45"];

/**
 * Marigold strands hanging from the top edge of a section, the way garlands are
 * strung across a wedding entrance. Heights vary per strand for a hand-tied look.
 */
export default function HangingFlowers({
  className = "",
  strands = 16,
  tone = "warm",
}: HangingFlowersProps) {
  const palette = tone === "warm" ? WARM : COOL;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 flex justify-between overflow-hidden ${className}`}
    >
      {Array.from({ length: strands }).map((_, i) => {
        // Deterministic pseudo-variation keeps server and client markup identical.
        const length = 4 + ((i * 7) % 4);
        const delay = (i % 5) * 0.6;

        return (
          <span
            key={i}
            className="flex flex-col items-center motion-safe:animate-[floatY_7s_ease-in-out_infinite]"
            style={{ animationDelay: `${delay}s` }}
          >
            <span
              className="block w-px bg-gradient-to-b from-gold-500/70 to-gold-500/10"
              style={{ height: `${8 + (i % 4) * 6}px` }}
            />
            {Array.from({ length }).map((_, f) => (
              <span
                key={f}
                className="block rounded-full"
                style={{
                  width: `${11 - f * 0.7}px`,
                  height: `${11 - f * 0.7}px`,
                  marginTop: "-1px",
                  background: `radial-gradient(circle at 32% 30%, #fff3d0, ${
                    palette[(i + f) % palette.length]
                  })`,
                  boxShadow: "0 1px 2px rgba(107,15,26,0.25)",
                }}
              />
            ))}
          </span>
        );
      })}
    </div>
  );
}
