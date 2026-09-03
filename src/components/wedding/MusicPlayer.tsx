"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  src: string;
  title: string;
}

/** Gentle background level — present, never loud enough to talk over. */
const TARGET_VOLUME = 0.3;
/** Milliseconds spent easing up to it, so the shehnai drifts in. */
const FADE_MS = 2600;

/**
 * Floating background-music control.
 *
 * The track is meant to greet a guest as the invitation opens, so playback is
 * attempted immediately on mount. Every browser blocks unprompted audio, so the
 * attempt is expected to fail — when it does, the same start is armed behind the
 * guest's first gesture (tap, key, scroll), which is the earliest moment the
 * policy allows sound. Either way it fades up from silence rather than starting
 * at full volume.
 *
 * A guest who presses pause is never restarted by a later gesture.
 */
export default function MusicPlayer({ src, title }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number | null>(null);
  /** Set once the track is running, so armed gestures stop trying. */
  const startedRef = useRef(false);
  /** Set when the guest pauses, so we never override that choice. */
  const optedOutRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  /** Not started and not broken means we are still waiting to be allowed. */
  const awaitingGesture = !playing && !unavailable;

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
    if (!audio || startedRef.current || optedOutRef.current) return false;

    try {
      audio.volume = 0;
      await audio.play();
      startedRef.current = true;
      setPlaying(true);
      fadeUp(audio);
      return true;
    } catch {
      // Two very different failures land here. `audio.error` is set only when
      // the media itself is missing or undecodable — a refusal by the autoplay
      // policy leaves it null. Reading it directly also covers the case where
      // the fetch failed before React attached `onError`, which would otherwise
      // leave the button inviting a tap that can never work.
      if (audio.error) setUnavailable(true);
      return false;
    }
  }, [fadeUp]);

  // Two ways in, because either can be the one that lands:
  //   - here on mount, which also covers the case where the media was already
  //     buffered and `canplay` fired before React attached its handler;
  //   - the guest's first gesture, the earliest moment the autoplay policy
  //     allows sound once the opening attempt has been refused.
  // `start` is a no-op once the track is running, so they cannot double up.
  useEffect(() => {
    // Deferred by a tick rather than called inline: the attempt sets state once
    // the browser answers, and an effect body must not do that synchronously.
    const opening = window.setTimeout(() => {
      void start();
    }, 0);

    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const onGesture = () => {
      void start();
    };

    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    return () => {
      window.clearTimeout(opening);
      events.forEach((e) => window.removeEventListener(e, onGesture));
      clearFade();
    };
  }, [start]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      clearFade();
      audio.pause();
      optedOutRef.current = true;
      startedRef.current = false;
      setPlaying(false);
      return;
    }

    optedOutRef.current = false;
    if (!(await start())) setUnavailable(true);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  const label = unavailable
    ? "No music"
    : playing
      ? muted
        ? "Muted"
        : "Now playing"
      : "Tap for music";

  return (
    <div className="fixed bottom-5 left-4 z-40 flex items-center gap-2 sm:bottom-7 sm:left-6">
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
        onEnded={() => setPlaying(false)}
        onError={() => setUnavailable(true)}
      >
        <track kind="captions" />
      </audio>

      {/* Play / pause */}
      <button
        type="button"
        onClick={togglePlayback}
        disabled={unavailable}
        aria-pressed={playing}
        aria-label={
          unavailable
            ? "Background music is unavailable"
            : playing
              ? `Pause background music: ${title}`
              : `Play background music: ${title}`
        }
        title={unavailable ? "Music unavailable" : title}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/50 bg-cream-100/90 shadow-[0_10px_28px_-12px_rgba(107,15,26,0.7)] backdrop-blur-sm transition-transform duration-300 hover:scale-105 disabled:opacity-50 sm:h-14 sm:w-14"
      >
        {/* Pulsing ring while playing, or a nudge while waiting on a gesture. */}
        {(playing && !muted) || awaitingGesture ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-marigold-500/60 motion-safe:animate-ping"
          />
        ) : null}

        <span aria-hidden="true" className="relative text-lg sm:text-xl">
          {unavailable ? "🔇" : playing ? "⏸" : "🎵"}
        </span>
      </button>

      {/* Mute — only useful once something is playing */}
      {playing ? (
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute background music" : "Mute background music"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/50 bg-cream-100/90 shadow-md backdrop-blur-sm transition-transform duration-300 hover:scale-105 sm:h-11 sm:w-11"
        >
          <span aria-hidden="true" className="text-base">
            {muted ? "🔇" : "🔊"}
          </span>
        </button>
      ) : null}

      {/* Status indicator */}
      <span
        className="hidden items-center gap-1.5 rounded-full border border-gold-500/40 bg-cream-100/85 px-3 py-1.5 font-serif-alt text-[0.6rem] tracking-[0.16em] text-maroon-700 uppercase backdrop-blur-sm sm:flex"
        role="status"
        aria-live="polite"
      >
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${
            unavailable
              ? "bg-ink-soft/40"
              : playing && !muted
                ? "bg-leaf-500 motion-safe:animate-pulse"
                : "bg-marigold-400"
          }`}
        />
        {label}
      </span>
    </div>
  );
}
