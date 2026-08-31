type Corner = "tl" | "tr" | "bl" | "br";

interface FlowerCornerProps {
  position?: Corner;
  /** Tailwind size classes; keep corners small on mobile so text stays clear. */
  className?: string;
  tone?: "dark" | "light";
}

const ROTATION: Record<Corner, string> = {
  tl: "rotate-0",
  tr: "rotate-90",
  br: "rotate-180",
  bl: "-rotate-90",
};

const PLACEMENT: Record<Corner, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0",
  br: "bottom-0 right-0",
  bl: "bottom-0 left-0",
};

/**
 * Ornamental corner spray of vines and blossoms.
 * Absolutely positioned and pointer-events-none so it never blocks content.
 */
export default function FlowerCorner({
  position = "tl",
  className = "h-20 w-20 sm:h-28 sm:w-28",
  tone = "dark",
}: FlowerCornerProps) {
  const vine = tone === "light" ? "#93c9a8" : "#2e6b4f";
  const bloom = tone === "light" ? "#ffc45c" : "#c1121f";
  const accent = tone === "light" ? "#e6be8a" : "#c9a227";

  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none absolute select-none ${PLACEMENT[position]} ${ROTATION[position]} ${className}`}
      fill="none"
    >
      {/* Vine */}
      <path
        d="M2 2c0 34 10 58 34 76 18 13 40 18 62 20"
        stroke={vine}
        strokeWidth="1.6"
        opacity="0.55"
        strokeLinecap="round"
      />
      <path
        d="M2 2c4 26 16 44 38 56"
        stroke={accent}
        strokeWidth="1"
        opacity="0.5"
        strokeLinecap="round"
      />

      {/* Leaves along the vine */}
      {[
        { x: 16, y: 26, r: -30 },
        { x: 30, y: 52, r: -10 },
        { x: 52, y: 74, r: 20 },
        { x: 78, y: 90, r: 40 },
      ].map((leaf, i) => (
        <path
          key={i}
          d="M0 0c8-8 18-8 24 0-8 8-18 8-24 0Z"
          fill={vine}
          opacity="0.6"
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r}) scale(0.9)`}
        />
      ))}

      {/* Blossoms */}
      {[
        { x: 10, y: 12, s: 1 },
        { x: 44, y: 62, s: 0.75 },
        { x: 88, y: 96, s: 0.6 },
      ].map((flower, i) => (
        <g key={i} transform={`translate(${flower.x} ${flower.y}) scale(${flower.s})`}>
          {Array.from({ length: 6 }).map((_, p) => (
            <ellipse
              key={p}
              rx="3.2"
              ry="7"
              fill={bloom}
              opacity="0.8"
              transform={`rotate(${p * 60}) translate(0 -5)`}
            />
          ))}
          <circle r="3" fill={accent} />
        </g>
      ))}
    </svg>
  );
}
