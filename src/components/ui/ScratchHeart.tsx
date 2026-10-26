"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { burstFrom } from "@/lib/confetti";

/** Share of the cover that must be scratched off before the rest falls away. */
const REVEAL_AT = 0.45;
/** Width of the scratching stroke, as a share of the heart's width. */
const BRUSH_SHARE = 0.2;

/**
 * Heart outline, also used as the mask that cuts both layers to a heart.
 * The viewBox is trimmed to the shape so it fills its box edge to edge.
 */
const HEART_VIEWBOX = "2 3 20 18.35";
const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
const HEART_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${HEART_VIEWBOX}'><path d='${HEART_PATH}'/></svg>`,
)}")`;
const maskStyle = {
  maskImage: HEART_MASK,
  WebkitMaskImage: HEART_MASK,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
};

/** Fixed sparkle positions on the cover (share of width, share of height, size). */
const SPARKLES: [number, number, number][] = [
  [0.24, 0.3, 0.05],
  [0.76, 0.27, 0.04],
  [0.33, 0.62, 0.03],
  [0.68, 0.58, 0.035],
  [0.5, 0.78, 0.03],
];

interface ScratchHeartProps {
  /** What the heart hides, e.g. "24" or "November". */
  children: React.ReactNode;
  /** Small caption under the hidden text, e.g. "Day". */
  caption?: string;
  /** Short label for keyboard and screen-reader users, e.g. "the day". */
  label: string;
  onReveal?: () => void;
  /** Staggers the idle shimmer so the hearts don't flash in unison. */
  shimmerDelayMs?: number;
  /** Plays a small celebratory pop, e.g. once every heart is open. */
  celebrate?: boolean;
  className?: string;
}

/** Draws a four-point star, centred on (x, y). */
function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/**
 * A crimson heart, rimmed in gold, that guests scratch away — with a finger or
 * the mouse — to uncover what is written beneath it, like a scratch card. Once
 * enough is cleared the rest fades out on its own. Keyboard users press Enter
 * or Space.
 *
 * The hidden text is real text in the page throughout, so screen readers and
 * search engines always read it; only the painted cover is decorative.
 */
export default function ScratchHeart({
  children,
  caption,
  label,
  onReveal,
  shimmerDelayMs = 0,
  celebrate = false,
  className = "",
}: ScratchHeartProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratching = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const [revealed, setRevealed] = useState(false);
  // The text stays hidden until the cover is painted, so the date never
  // flashes through before the page's script has run.
  const [covered, setCovered] = useState(false);

  // Paint the cover, at the screen's pixel density so it stays crisp.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Layout size, not the on-screen box: an entrance animation may be
    // scaling the section while this runs.
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);

    // Deep crimson, lit from the top left — the card's own maroon family.
    const fill = ctx.createLinearGradient(0, 0, width * 0.6, height);
    fill.addColorStop(0, "#d42a3f");
    fill.addColorStop(0.5, "#a5162c");
    fill.addColorStop(1, "#6b0f1a");
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, width, height);

    // Glossy highlight on the upper-left lobe.
    const shine = ctx.createRadialGradient(
      width * 0.3, height * 0.26, 0,
      width * 0.3, height * 0.26, width * 0.32,
    );
    shine.addColorStop(0, "rgba(255, 220, 220, 0.42)");
    shine.addColorStop(1, "rgba(255, 220, 220, 0)");
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, width, height);

    // Gold sparkles, like foil flecks on a printed card.
    ctx.fillStyle = "rgba(246, 214, 130, 0.85)";
    for (const [x, y, size] of SPARKLES) star(ctx, width * x, height * y, width * size);

    // Gold lettering, in the site's serif (the canvas carries it via its class).
    const font = getComputedStyle(canvas).fontFamily;
    ctx.fillStyle = "#f3d27a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.max(10, Math.round(width * 0.095))}px ${font}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${Math.round(width * 0.02)}px`;
    ctx.fillText("SCRATCH", width / 2, height * 0.43);
    ctx.font = `italic ${Math.max(9, Math.round(width * 0.075))}px ${font}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
    ctx.fillStyle = "rgba(255, 244, 214, 0.8)";
    ctx.fillText("to reveal", width / 2, height * 0.55);

    setCovered(true);
  }, []);

  const reveal = () => {
    if (revealed) return;
    setRevealed(true);
    // A party popper goes off from the heart as its secret comes out.
    if (rootRef.current) burstFrom(rootRef.current, { count: 100, spread: 100, speed: 11 });
    onReveal?.();
  };

  /** Fraction of the cover already cleared, sampled on a coarse grid. */
  const clearedShare = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const step = 4 * 8; // every 8th pixel is plenty
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += step) {
      total++;
      if (data[i] < 128) clear++;
    }
    return clear / total;
  };

  const scratchTo = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Map the on-screen pointer back to layout pixels, in case it is scaled.
    const box = canvas.getBoundingClientRect();
    const point = {
      x: ((event.clientX - box.left) * canvas.offsetWidth) / box.width,
      y: ((event.clientY - box.top) * canvas.offsetHeight) / box.height,
    };
    const from = last.current ?? point;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = canvas.offsetWidth * BRUSH_SHARE;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    last.current = point;

    // Reading pixels back is the costly part, so only check now and then.
    if (++strokes.current % 6 === 0 && clearedShare(canvas, ctx) >= REVEAL_AT) reveal();
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    scratching.current = true;
    last.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratchTo(event);
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (scratching.current) scratchTo(event);
  };

  const onPointerUp = () => {
    scratching.current = false;
    last.current = null;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx && clearedShare(canvas, ctx) >= REVEAL_AT) reveal();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      reveal();
    }
  };

  return (
    <div
      ref={rootRef}
      role={revealed ? undefined : "button"}
      tabIndex={revealed ? undefined : 0}
      aria-label={revealed ? undefined : `Scratch to reveal ${label}`}
      onKeyDown={revealed ? undefined : onKeyDown}
      className={`group relative aspect-[20/18.35] rounded-[40%] drop-shadow-[0_14px_22px_rgba(20,0,4,0.55)] transition-transform duration-300 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-marigold-300 ${
        revealed ? "" : "hover:-translate-y-1 hover:scale-[1.03]"
      } ${celebrate ? "motion-safe:animate-[heartPop_0.9s_cubic-bezier(0.34,1.56,0.64,1)_both]" : ""} ${className}`}
    >
      <div className="absolute inset-0" style={maskStyle}>
        {/* What the heart hides: ivory-to-gold, with the text in maroon. */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-ivory via-cream-100 to-gold-300 pb-[16%] text-center text-maroon-700 transition-transform duration-700 ${
            revealed ? "scale-100" : "scale-90"
          } ${covered ? "" : "invisible"}`}
        >
          {children}
          {caption && (
            <span className="mt-0.5 font-serif-alt text-[0.55rem] tracking-[0.22em] text-gold-700 uppercase sm:text-[0.65rem]">
              {caption}
            </span>
          )}
        </div>

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          // `touch-action: none` lets a finger scratch instead of scrolling the page.
          className={`absolute inset-0 h-full w-full cursor-pointer touch-none font-serif-alt transition-opacity duration-700 ${
            revealed ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        />

        {/* A band of light sweeps across now and then, inviting a touch. */}
        {!revealed && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent motion-safe:animate-[heartShimmer_3.6s_ease-in-out_infinite]"
            style={{ animationDelay: `${shimmerDelayMs}ms` }}
          />
        )}
      </div>

      {/* Gold rim, drawn over both layers; it stays to frame the revealed date. */}
      <svg
        aria-hidden="true"
        viewBox={HEART_VIEWBOX}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="heart-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6e3a1" />
            <stop offset="0.5" stopColor="#d9b64a" />
            <stop offset="1" stopColor="#9c7b16" />
          </linearGradient>
        </defs>
        <path
          d={HEART_PATH}
          fill="none"
          stroke="url(#heart-rim)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
