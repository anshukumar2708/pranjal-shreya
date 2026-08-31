interface MandalaProps {
  className?: string;
  /** Stroke colour; defaults to a soft gold. */
  color?: string;
  opacity?: number;
  /** Slowly rotates when motion is allowed. */
  spin?: boolean;
}

/**
 * A concentric mandala used as a large, faint backdrop ornament.
 * Generated from rings of petals rather than a bitmap, so it stays crisp at any size.
 */
export default function Mandala({
  className = "",
  color = "#c9a227",
  opacity = 0.16,
  spin = true,
}: MandalaProps) {
  // Kept deliberately sparse — these are faint background ornaments, and every
  // extra petal is a DOM node repeated across a dozen instances.
  const rings = [
    { count: 16, rx: 5, ry: 18, offset: 168, width: 1 },
    { count: 12, rx: 7, ry: 24, offset: 132, width: 1 },
    { count: 10, rx: 10, ry: 30, offset: 92, width: 1.2 },
    { count: 8, rx: 12, ry: 26, offset: 50, width: 1.4 },
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none select-none ${
        spin ? "motion-safe:animate-[spin_60s_linear_infinite]" : ""
      } ${className}`}
      fill="none"
      style={{ opacity }}
    >
      <g transform="translate(200 200)" stroke={color}>
        <circle r="190" strokeWidth="1" strokeDasharray="4 7" />
        <circle r="176" strokeWidth="1" />
        <circle r="30" strokeWidth="1.2" />
        <circle r="14" strokeWidth="1" fill={color} fillOpacity="0.25" />

        {rings.map((ring, r) =>
          Array.from({ length: ring.count }).map((_, i) => (
            <ellipse
              key={`${r}-${i}`}
              rx={ring.rx}
              ry={ring.ry}
              strokeWidth={ring.width}
              transform={`rotate(${(i * 360) / ring.count}) translate(0 ${-ring.offset})`}
            />
          )),
        )}

        {/* Radial spokes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`spoke-${i}`}
            y1="-34"
            y2="-66"
            strokeWidth="0.8"
            transform={`rotate(${i * 45})`}
          />
        ))}
      </g>
    </svg>
  );
}
