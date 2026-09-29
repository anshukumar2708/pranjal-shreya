"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  src: string;
  title: string;
}

/** Gentle background level — present, never loud enough to talk over. */
const TARGET_VOLUME = 0.35;
/** Milliseconds spent easing up to it, so the shehnai drifts in. */
const FADE_MS = 2600;
/** Remembers a guest who muted the music, so a reload does not blast it again. */
const MUTED_KEY = "wedding-music-muted";

/**
 * Events that count as a user gesture for the autoplay policy. Scrolling and
 * `touchstart` do NOT — a play() attempted from them is still refused — so the
 * list is limited to the ones browsers actually accept.
 */
const GESTURES = ["pointerdown", "pointerup", "click", "touchend", "keydown"] as const;

function readMutedPreference() {
  try {
    return window.localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMutedPreference(muted: boolean) {
  try {
    if (muted) window.localStorage.setItem(MUTED_KEY, "1");
    else window.localStorage.removeItem(MUTED_KEY);
  } catch {
    // Private mode or blocked storage — the preference just isn't remembered.
  }
}

/**
 * Floating background-music button: one control that mutes and unmutes.
 *
 * The shehnai should greet a guest as the invitation opens, so playback is
 * tried straight away. Browsers refuse sound before the visitor has interacted
 * with the page, so when that first attempt is refused the start is armed
 * behind the guest's first tap, click or key press — the earliest moment sound
 * is allowed — and the button pulses "Tap for music" meanwhile. Either way the
 * track fades up from silence and loops.
 *
 * Muting keeps the track running silently (so unmuting resumes in place) and
 * is remembered, so a guest who muted is not surprised by sound on reload.
 */
export default function MusicPlayer({ src, title }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<number | null>(null);
  /** Set once the track is running, so armed gestures stop trying. */
  const startedRef = useRef(false);
  /** Set while the guest has chosen silence, so gestures never override it. */
  const mutedRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const clearFade = () => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  };

  /** Ease the volume from wherever it is up to the background level. */
  const fadeUp = useCallback((audio: HTMLAudioElement) => {
    clearFade();
    const step = 60;
    const increment = TARGET_VOLUME / (FADE_MS / step);

    fadeRef.current = window.setInterval(() => {
      const next = Math.min(TARGET_VOLUME, audio.volume + increment);
      audio.volume = next;
      if (next >= TARGET_VOLUME) clearFade();
    }, step);
  }, []);

  const start = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || startedRef.current || mutedRef.current) return false;

    try {
      audio.muted = false;
      audio.volume = 0;
      await audio.play();
      startedRef.current = true;
      setPlaying(true);
      fadeUp(audio);
      return true;
    } catch {
      // `audio.error` is set only when the file itself is missing or
      // undecodable; a refusal by the autoplay policy leaves it null, and the
      // armed gestures will try again.
      if (audio.error) setUnavailable(true);
      return false;
    }
  }, [fadeUp]);

  useEffect(() => {
    // A guest who muted last time starts muted, and nothing auto-starts.
    const opening = window.setTimeout(() => {
      if (readMutedPreference()) {
        mutedRef.current = true;
        setMuted(true);
        return;
      }
      void start();
    }, 0);

    const onGesture = (event: Event) => {
      // Taps on the music button are the button's to handle: starting here too
      // would let its click, a moment later, see "playing" and mute again.
      if (rootRef.current?.contains(event.target as Node)) return;
      if (startedRef.current || mutedRef.current) return;
      void start();
    };

    GESTURES.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    return () => {
      window.clearTimeout(opening);
      GESTURES.forEach((e) => window.removeEventListener(e, onGesture));
      clearFade();
    };
  }, [start]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || unavailable) return;

    // Currently audible → mute.
    if (playing && !muted) {
      clearFade();
      audio.muted = true;
      mutedRef.current = true;
      setMuted(true);
      writeMutedPreference(true);
      return;
    }

    // Muted or not yet started → sound on.
    mutedRef.current = false;
    setMuted(false);
    writeMutedPreference(false);

    if (playing) {
      audio.muted = false;
      audio.volume = 0;
      fadeUp(audio);
    } else if (!(await start())) {
      if (audio.error) setUnavailable(true);
    }
  };

  const waiting = !playing && !muted && !unavailable;
  const audible = playing && !muted;

  const label = unavailable
    ? "No music"
    : audible
      ? "Music on"
      : muted
        ? "Music muted"
        : "Tap for music";

  return (
    <div ref={rootRef} className="fixed bottom-5 left-4 z-40 flex items-center gap-2.5 sm:bottom-7 sm:left-6">
      <audio
        ref={audioRef}
        src={src}
        loop
        // The track is meant to start on open, so it may not wait for a click
        // to begin buffering.
        preload="auto"
        onCanPlay={() => {
          void start();
        }}
        onError={() => setUnavailable(true)}
      >
        <track kind="captions" />
      </audio>

      <button
        type="button"
        onClick={toggle}
        disabled={unavailable}
        aria-pressed={audible}
        aria-label={
          unavailable
            ? "Background music is unavailable"
            : audible
              ? `Mute background music: ${title}`
              : `Unmute background music: ${title}`
        }
        title={unavailable ? "Music unavailable" : audible ? "Mute music" : "Play music"}
        className={`group relative flex h-14 w-14 items-center justify-center rounded-full border shadow-[0_10px_28px_-10px_rgba(107,15,26,0.75)] backdrop-blur-sm transition duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 sm:h-16 sm:w-16 ${
          audible
            ? "border-gold-300/70 bg-gradient-to-br from-maroon-700 to-maroon-900 text-cream-100"
            : "border-gold-500/60 bg-cream-100/95 text-maroon-700"
        }`}
      >
        {/* Pulsing ring while music plays, or a nudge while waiting for a tap. */}
        {audible || waiting ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-marigold-400/70 motion-safe:animate-ping"
          />
        ) : null}

        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-6 w-6 sm:h-7 sm:w-7"
        >
          <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
          {audible ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          ) : (
            <>
              <path d="m16 9 5 6" />
              <path d="m21 9-5 6" />
            </>
          )}
        </svg>
      </button>

      {/* Status — doubles as a hint while waiting for the first tap. */}
      <span
        role="status"
        aria-live="polite"
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-serif-alt text-[0.62rem] tracking-[0.16em] uppercase backdrop-blur-sm ${
          waiting
            ? "border-marigold-400/70 bg-marigold-100/95 text-maroon-800 motion-safe:animate-pulse"
            : "border-gold-500/40 bg-cream-100/90 text-maroon-700"
        }`}
      >
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${
            unavailable ? "bg-ink-soft/40" : audible ? "bg-leaf-500" : "bg-marigold-500"
          }`}
        />
        {label}
      </span>
    </div>
  );
}
