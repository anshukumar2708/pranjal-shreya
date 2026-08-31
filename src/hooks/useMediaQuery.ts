"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Media queries never match during SSR, so the server always renders the "false" branch. */
const getServerSnapshot = () => false;

/**
 * Subscribes to a CSS media query.
 *
 * Uses `useSyncExternalStore` rather than an effect + state pair, so the value is
 * read during render, stays consistent across concurrent renders, and does not
 * trigger a second render pass on mount.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};

      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True when the visitor has asked the OS to reduce animation. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
