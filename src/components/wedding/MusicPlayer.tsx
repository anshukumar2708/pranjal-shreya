"use client";

import { useRef, useState } from "react";

interface MusicPlayerProps {
  src: string;
  title: string;
}

/**
 * Floating background-music control.
 *
 * Playback is never started automatically — browsers block unprompted audio, and
 * a wedding site that blares music on load is worse than one that does not. The
 * guest presses play; the button then offers pause and mute.
 */
export default function MusicPlayer({ src, title }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      audio.volume = 0.35;
      await audio.play();
      setPlaying(true);
    } catch {
      // Autoplay policy, a missing file, or an unsupported format.
      setUnavailable(true);
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = !muted;
    audio.muted = next;
    setMuted(next);
  };

  return (
    <div className="fixed bottom-5 left-4 z-40 flex items-center gap-2 sm:bottom-7 sm:left-6">
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="none"
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
        {/* Pulsing ring while playing */}
        {playing && !muted ? (
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
        {unavailable ? "No music" : playing ? (muted ? "Muted" : "Now playing") : "Music"}
      </span>
    </div>
  );
}
