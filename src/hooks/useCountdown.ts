"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target moment has passed. */
  isComplete: boolean;
  /** False until the clock has been read on the client, so SSR and hydration agree. */
  isReady: boolean;
}

/** Stable reference used for the server render and the first client paint. */
const INITIAL: CountdownState = Object.freeze({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  isComplete: false,
  isReady: false,
});

interface ClockStore {
  snapshot: CountdownState;
  listeners: Set<() => void>;
  timer: ReturnType<typeof setInterval> | null;
}

function compute(target: number): CountdownState {
  const remaining = target - Date.now();

  if (remaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true, isReady: true };
  }

  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isComplete: false,
    isReady: true,
  };
}

function isSame(a: CountdownState, b: CountdownState): boolean {
  return (
    a.days === b.days &&
    a.hours === b.hours &&
    a.minutes === b.minutes &&
    a.seconds === b.seconds &&
    a.isComplete === b.isComplete &&
    a.isReady === b.isReady
  );
}

/** Recomputes the snapshot and notifies subscribers only when a displayed digit changes. */
function publish(store: ClockStore, target: number): void {
  const next = compute(target);
  if (isSame(next, store.snapshot)) return;

  store.snapshot = next;
  store.listeners.forEach((listener) => listener());
}

const getServerSnapshot = () => INITIAL;

/**
 * Ticks once a second toward an ISO date.
 *
 * Backed by `useSyncExternalStore`: the interval is the external source of truth,
 * so there is no setState-in-effect, no extra render on mount, and the server
 * renders a stable placeholder (`isReady: false`) that hydrates cleanly.
 * Never returns negative values — once the date passes, `isComplete` flips instead.
 */
export function useCountdown(targetIso: string): CountdownState {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const valid = !Number.isNaN(target);

  // Lazy initialiser gives every hook instance one stable store object.
  const [store] = useState<ClockStore>(() => ({
    snapshot: INITIAL,
    listeners: new Set(),
    timer: null,
  }));

  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!valid) return () => {};

      store.listeners.add(onChange);

      // Read the clock as soon as something subscribes; React re-checks the
      // snapshot immediately after `subscribe` returns and re-renders if it moved.
      publish(store, target);

      store.timer ??= setInterval(() => {
        publish(store, target);

        if (store.snapshot.isComplete && store.timer) {
          clearInterval(store.timer);
          store.timer = null;
        }
      }, 1000);

      return () => {
        store.listeners.delete(onChange);

        if (store.listeners.size === 0 && store.timer) {
          clearInterval(store.timer);
          store.timer = null;
        }
      };
    },
    [store, target, valid],
  );

  const getSnapshot = useCallback(() => store.snapshot, [store]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
