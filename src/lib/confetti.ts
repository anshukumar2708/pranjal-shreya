/**
 * A small party-popper confetti burst, with no dependency.
 *
 * Bursts share one transparent full-screen canvas that sits above the page
 * and ignores the pointer. It is created on the first burst and removed once
 * the last piece has fallen, so it costs nothing while idle. Visitors who ask
 * for reduced motion get no confetti at all.
 */

/** The site's own festive palette: marigold, gold, rose, crimson, cream, leaf. */
const COLORS = ["#f9a620", "#d9b64a", "#f6e3a1", "#e75480", "#c2185b", "#a5162c", "#fff7ec", "#5a8f5a"];

type Shape = "strip" | "dot" | "heart";

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: Shape;
  angle: number;
  spin: number;
  /** Phase of the side-to-side flutter that makes paper look like paper. */
  wobble: number;
  life: number;
  ttl: number;
}

export interface BurstOptions {
  /** Where the popper fires from, in viewport px. */
  x: number;
  y: number;
  /** Number of pieces. */
  count?: number;
  /** Direction of fire in degrees: -90 is straight up. */
  angle?: number;
  /** Width of the cone the pieces spread across, in degrees. */
  spread?: number;
  /** Launch speed, in px per frame. */
  speed?: number;
}

const GRAVITY = 0.32;
const DRAG = 0.985;

let canvas: HTMLCanvasElement | null = null;
let pieces: Piece[] = [];
let frame = 0;

function ensureCanvas() {
  if (canvas) return canvas;
  canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "60",
  });
  document.body.appendChild(canvas);
  return canvas;
}

function resize(target: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.round(window.innerWidth * dpr);
  const height = Math.round(window.innerHeight * dpr);
  if (target.width !== width || target.height !== height) {
    target.width = width;
    target.height = height;
  }
  return dpr;
}

function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  const s = size / 2;
  ctx.beginPath();
  ctx.moveTo(0, s * 0.6);
  ctx.bezierCurveTo(-s * 1.2, -s * 0.2, -s * 0.5, -s * 1.1, 0, -s * 0.35);
  ctx.bezierCurveTo(s * 0.5, -s * 1.1, s * 1.2, -s * 0.2, 0, s * 0.6);
  ctx.fill();
}

function tick() {
  const target = canvas;
  const ctx = target?.getContext("2d");
  if (!target || !ctx) return;

  const dpr = resize(target);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  pieces = pieces.filter((p) => p.life < p.ttl && p.y < window.innerHeight + 40);
  for (const p of pieces) {
    p.vx *= DRAG;
    p.vy = p.vy * DRAG + GRAVITY;
    p.wobble += 0.12;
    p.x += p.vx + Math.sin(p.wobble) * 0.8;
    p.y += p.vy;
    p.angle += p.spin;
    p.life++;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    // Squashing one axis as it turns reads as a flat piece tumbling in 3D.
    ctx.scale(1, Math.cos(p.wobble));
    ctx.globalAlpha = Math.min(1, (p.ttl - p.life) / 25);
    ctx.fillStyle = p.color;
    if (p.shape === "strip") ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    else if (p.shape === "dot") {
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
      ctx.fill();
    } else drawHeart(ctx, p.size * 1.2);
    ctx.restore();
  }

  if (pieces.length) {
    frame = requestAnimationFrame(tick);
  } else {
    target.remove();
    canvas = null;
    frame = 0;
  }
}

/** Fires one party popper. Safe to call repeatedly; bursts share one canvas. */
export function burst({ x, y, count = 60, angle = -90, spread = 70, speed = 11 }: BurstOptions) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  ensureCanvas();
  const shapes: Shape[] = ["strip", "strip", "dot", "heart"];
  for (let i = 0; i < count; i++) {
    const direction = ((angle + (Math.random() - 0.5) * spread) * Math.PI) / 180;
    const velocity = speed * (0.55 + Math.random() * 0.6);
    pieces.push({
      x,
      y,
      vx: Math.cos(direction) * velocity,
      vy: Math.sin(direction) * velocity,
      size: 7 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
      wobble: Math.random() * Math.PI * 2,
      life: 0,
      ttl: 140 + Math.random() * 60,
    });
  }
  if (!frame) frame = requestAnimationFrame(tick);
}

/** Fires a burst from the centre of an element, e.g. a revealed heart. */
export function burstFrom(element: Element, options: Omit<BurstOptions, "x" | "y"> = {}) {
  const box = element.getBoundingClientRect();
  burst({ x: box.left + box.width / 2, y: box.top + box.height / 2, ...options });
}

/** Two poppers firing inward from the bottom corners of the screen. */
export function sidePoppers({ count = 160, speed = 20 }: { count?: number; speed?: number } = {}) {
  if (typeof window === "undefined") return;
  const bottom = window.innerHeight;
  burst({ x: 0, y: bottom, angle: -60, spread: 40, speed, count });
  burst({ x: window.innerWidth, y: bottom, angle: -120, spread: 40, speed, count });
}

/** The grand finale: the full-size pair of side poppers. */
export function celebrate() {
  sidePoppers();
}
