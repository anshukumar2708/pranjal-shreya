interface MarigoldBorderProps {
  className?: string;
  /** Which edge the flowers sit on. */
  edge?: "top" | "bottom";
  tone?: "warm" | "cool";
}

const PALETTES = {
  warm: { a: "#ff7a00", b: "#f9a620", c: "#e8760a" },
  cool: { a: "#c1121f", b: "#e75480", c: "#a5162c" },
} as const;

/**
 * A dense marigold rope running along a section edge — the warm seam between two
 * colour bands.
 *
 * Drawn with layered radial gradients on a single element rather than ~60 spans,
 * which keeps the page's DOM light on phones.
 */
export default function MarigoldBorder({
  className = "",
  edge = "bottom",
  tone = "warm",
}: MarigoldBorderProps) {
  const { a, b, c } = PALETTES[tone];

  // Two offset rows of blooms plus a highlight row, giving a hand-strung look.
  const backgroundImage = [
    `radial-gradient(circle at 7px 11px, #fff4d6 1.5px, ${a} 6.5px, transparent 7px)`,
    `radial-gradient(circle at 18px 9px, #fff4d6 1.5px, ${b} 5.5px, transparent 6px)`,
    `radial-gradient(circle at 29px 12px, #fff4d6 1.5px, ${c} 6px, transparent 6.5px)`,
  ].join(", ");

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 h-6 overflow-hidden ${
        edge === "top" ? "top-0 -translate-y-1/2" : "bottom-0 translate-y-1/2"
      } ${className}`}
      style={{
        backgroundImage,
        backgroundSize: "38px 24px",
        backgroundRepeat: "repeat-x",
        filter: "drop-shadow(0 2px 3px rgba(107,15,26,0.28))",
      }}
    />
  );
}
