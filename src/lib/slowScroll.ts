/** Shortest and longest a glide may take, whatever the distance. */
const MIN_MS = 2200;
const MAX_MS = 4500;
/** Time spent per screen-height travelled, so longer trips glide longer. */
const MS_PER_SCREEN = 2000;

/** Starts gently, cruises, and settles gently — no jolt at either end. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/**
 * Glide the page so `target`'s top meets the top of the screen, slowly and
 * eased, far gentler than the browser's own smooth scroll. `onArrive` runs
 * once it lands. Returns a function that cancels the glide where it is.
 */
export function slowScrollTo(target: HTMLElement, onArrive?: () => void): () => void {
  const startY = window.scrollY;
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  const endY = Math.min(maxY, startY + target.getBoundingClientRect().top);
  const distance = endY - startY;
  if (Math.abs(distance) < 1) {
    onArrive?.();
    return () => {};
  }

  const duration = Math.min(
    MAX_MS,
    Math.max(MIN_MS, (Math.abs(distance) / window.innerHeight) * MS_PER_SCREEN),
  );

  let frame = 0;
  let startTime: number | null = null;

  const tick = (now: number) => {
    startTime ??= now;
    const progress = Math.min(1, (now - startTime) / duration);
    // "instant", or the page-wide `scroll-behavior: smooth` would animate
    // every frame's step on its own and fight this glide.
    window.scrollTo({ top: startY + distance * easeInOutCubic(progress), behavior: "instant" });
    if (progress < 1) frame = window.requestAnimationFrame(tick);
    else onArrive?.();
  };

  frame = window.requestAnimationFrame(tick);
  return () => window.cancelAnimationFrame(frame);
}
