interface VarmalaProps {
  className?: string;
  /** Number of blossoms threaded along the garland. */
  beads?: number;
}

interface Point {
  x: number;
  y: number;
}

const P0: Point = { x: 24, y: 36 };
const C1: Point = { x: 300, y: 250 };
const C2: Point = { x: 900, y: 250 };
const P3: Point = { x: 1176, y: 36 };

/** Cubic bezier evaluated at t — used to thread flowers evenly along the drape. */
function bezier(t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;

  return {
    x: a * P0.x + b * C1.x + c * C2.x + d * P3.x,
    y: a * P0.y + b * C1.y + c * C2.y + d * P3.y,
  };
}

const MARIGOLD = ["#ff7a00", "#f9a620", "#ffc45c", "#e8760a"];
const ROSE = ["#c1121f", "#e75480", "#a5162c"];

/**
 * The varmala — a marigold-and-rose garland that drapes across the couple.
 * Built entirely from SVG (no image payload) and scales with its container,
 * so it reads correctly from 320px phones up to wide desktops.
 */
export default function Varmala({ className = "", beads = 32 }: VarmalaProps) {
  const flowers = Array.from({ length: beads }, (_, i) => {
    const t = i / (beads - 1);
    const point = bezier(t);
    // Blooms grow toward the centre of the drape, where the garland hangs lowest.
    const weight = Math.sin(t * Math.PI);
    const isRose = i % 5 === 0;

    return {
      ...point,
      t,
      radius: 8 + weight * 7,
      color: isRose ? ROSE[i % ROSE.length] : MARIGOLD[i % MARIGOLD.length],
      isRose,
      petals: isRose ? 5 : 6,
      rotate: (i * 37) % 360,
    };
  });

  const centre = bezier(0.5);

  return (
    <svg
      viewBox="0 0 1200 300"
      aria-hidden="true"
      role="presentation"
      className={`pointer-events-none select-none ${className}`}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="varmala-bloom" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#fff6df" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="varmala-thread" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9a227" />
          <stop offset="50%" stopColor="#e6be8a" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
      </defs>

      <g className="origin-top motion-safe:animate-[sway_9s_ease-in-out_infinite]">
        {/* Thread */}
        <path
          d={`M${P0.x} ${P0.y} C${C1.x} ${C1.y} ${C2.x} ${C2.y} ${P3.x} ${P3.y}`}
          stroke="url(#varmala-thread)"
          strokeWidth="2.5"
          opacity="0.75"
        />

        {/* Leaves tucked behind the blooms */}
        {flowers
          .filter((_, i) => i % 2 === 0)
          .map((flower, i) => (
            <path
              key={`leaf-${i}`}
              d="M0 0c10-11 22-11 30 0-10 11-22 11-30 0Z"
              fill="#2e6b4f"
              opacity="0.55"
              transform={`translate(${flower.x} ${flower.y + 6}) rotate(${
                flower.rotate / 2
              }) scale(0.62)`}
            />
          ))}

        {/* Blossoms */}
        {flowers.map((flower, i) => (
          <g
            key={`bloom-${i}`}
            transform={`translate(${flower.x} ${flower.y}) rotate(${flower.rotate})`}
          >
            {Array.from({ length: flower.petals }).map((_, p) => (
              <ellipse
                key={p}
                rx={flower.radius * 0.38}
                ry={flower.radius * 0.78}
                fill={flower.color}
                opacity={flower.isRose ? 0.92 : 0.88}
                transform={`rotate(${(p * 360) / flower.petals}) translate(0 ${
                  -flower.radius * 0.42
                })`}
              />
            ))}
            <circle r={flower.radius * 0.34} fill={flower.isRose ? "#ffd8a8" : "#b8901f"} />
            <circle
              r={flower.radius * 0.8}
              fill="url(#varmala-bloom)"
              opacity="0.5"
            />
          </g>
        ))}

        {/* Centre pendant: a hanging cluster where the garland dips lowest */}
        <g transform={`translate(${centre.x} ${centre.y})`}>
          <path d="M0 0v20" stroke="url(#varmala-thread)" strokeWidth="2" />
          {[
            { y: 28, r: 13, c: "#c1121f" },
            { y: 46, r: 9, c: "#ff7a00" },
          ].map((bell, i) => (
            <g key={i} transform={`translate(0 ${bell.y})`}>
              {Array.from({ length: 6 }).map((_, p) => (
                <ellipse
                  key={p}
                  rx={bell.r * 0.36}
                  ry={bell.r * 0.8}
                  fill={bell.c}
                  opacity="0.9"
                  transform={`rotate(${p * 60}) translate(0 ${-bell.r * 0.4})`}
                />
              ))}
              <circle r={bell.r * 0.3} fill="#e6be8a" />
            </g>
          ))}
          <circle cy="58" r="2.5" fill="#c9a227" />
        </g>
      </g>
    </svg>
  );
}
