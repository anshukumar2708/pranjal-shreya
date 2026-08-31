interface FloralDividerProps {
  tone?: "dark" | "light";
  className?: string;
}

/**
 * Symmetric leaf-and-blossom rule used between sections and under headings.
 * Purely decorative, so it is hidden from assistive technology.
 */
export default function FloralDivider({ tone = "dark", className = "" }: FloralDividerProps) {
  const line = tone === "light" ? "#e6be8a" : "#c9a227";
  const bloom = tone === "light" ? "#ffc45c" : "#c1121f";
  const leaf = tone === "light" ? "#93c9a8" : "#2e6b4f";

  return (
    <div className={`flex w-full justify-center ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 320 40"
        className="h-8 w-full max-w-[320px] sm:h-10"
        fill="none"
        role="presentation"
      >
        {/* Tapered rules on either side */}
        <path d="M4 20h96" stroke={line} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <path d="M220 20h96" stroke={line} strokeWidth="1" strokeLinecap="round" opacity="0.5" />

        {/* Left leaf pair */}
        <path
          d="M100 20c8-9 18-9 24 0-8 9-18 9-24 0Z"
          fill={leaf}
          opacity="0.7"
        />
        <path d="M124 20c6-6 13-6 17 0-6 6-13 6-17 0Z" fill={leaf} opacity="0.45" />

        {/* Right leaf pair */}
        <path
          d="M220 20c-8-9-18-9-24 0 8 9 18 9 24 0Z"
          fill={leaf}
          opacity="0.7"
        />
        <path d="M196 20c-6-6-13-6-17 0 6 6 13 6 17 0Z" fill={leaf} opacity="0.45" />

        {/* Centre marigold */}
        <g transform="translate(160 20)">
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={i}
              rx="3.4"
              ry="8"
              fill={bloom}
              opacity="0.85"
              transform={`rotate(${i * 45}) translate(0 -6)`}
            />
          ))}
          <circle r="4" fill={line} />
          <circle r="1.8" fill={tone === "light" ? "#4a0d14" : "#fff7ec"} />
        </g>

        {/* Small flanking buds */}
        <circle cx="146" cy="20" r="2.4" fill={line} opacity="0.8" />
        <circle cx="174" cy="20" r="2.4" fill={line} opacity="0.8" />
      </svg>
    </div>
  );
}
