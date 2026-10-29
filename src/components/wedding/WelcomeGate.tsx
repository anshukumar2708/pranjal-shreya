"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import Mandala from "@/components/decorations/Mandala";

/** Fired on `window` as the invitation's inner doors open onto the page. */
export const INVITATION_OPEN_EVENT = "invitation:open";
/**
 * Fired on `window` the instant "Open Invitation" is tapped — synchronously,
 * still inside the tap, so the background music may start from it.
 */
export const INVITATION_OPENING_EVENT = "invitation:opening";

/** The cover's own tune, played only while the cover is up. */
const WELCOME_MUSIC_SRC = "/music/welcome-music.mp4";
const WELCOME_VOLUME = 0.5;
/** How long the welcome tune takes to fade away once the card is opened. */
const WELCOME_FADE_OUT_MS = 900;

/** Events that count as a user gesture for the autoplay policy. */
const GESTURES = ["pointerdown", "pointerup", "click", "touchend", "keydown"] as const;

/**
 * The opening, step by step (ms from the tap):
 * the card's words fade, the top and bottom flaps fold away, then the inner
 * doors swing open left and right onto the page.
 */
const FADE_MS = 350;
const FLAPS_AT = 250;
const FLAPS_MS = 900;
const DOORS_AT = FLAPS_AT + FLAPS_MS - 100;
const DOORS_MS = 1100;
const DONE_AT = DOORS_AT + DOORS_MS;

/** The cover's backdrop, drawn once and sliced across the flaps and doors. */
const BACKDROP =
  "radial-gradient(ellipse at center, #8a1224 0%, #4a0d14 60%, #3d0710 100%)";

type Stage = "closed" | "opening" | "open";

interface WelcomeGateProps {
  groomName: string;
  brideName: string;
  dateLabel: string;
}

/** One slice of the backdrop, sized so the slices line up seamlessly. */
function slice(position: string, size: string): CSSProperties {
  return { backgroundImage: BACKDROP, backgroundSize: size, backgroundPosition: position };
}

/**
 * Full-screen welcome cover shown on every visit and every refresh, opened
 * like a folded invitation card: top and bottom flaps first, then two inner
 * doors sealed with the couple's monogram.
 *
 * While the cover is up it plays its own welcome tune, tried as soon as the
 * page loads or is refreshed. Browsers refuse sound before the visitor has
 * interacted with the page, so if that is refused the tune starts on the
 * guest's first tap, click or key press on the cover instead.
 *
 * Tapping "Open Invitation" fades the welcome tune out and announces
 * `invitation:opening`, from which the background music starts — inside the
 * tap, as browsers require. As the doors part it announces `invitation:open`, which the page's
 * party poppers wait for. The invitation is fully rendered behind the cover,
 * so search engines and link previews still read every word of it.
 */
export default function WelcomeGate({ groomName, brideName, dateLabel }: WelcomeGateProps) {
  const [stage, setStage] = useState<Stage>("closed");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timers = useRef<number[]>([]);
  const muteRef = useRef<HTMLButtonElement>(null);
  const fadeRef = useRef<number | null>(null);
  /** Set once the card is tapped open, so the welcome tune never restarts. */
  const openedRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || openedRef.current || !audio.paused) return;
    audio.volume = WELCOME_VOLUME;
    audio.play().catch(() => {
      // Refused by the autoplay policy (or no file) — the gestures below retry.
    });
  }, []);

  // Play the welcome tune on load and on every refresh; if the browser refuses
  // sound before an interaction, start it on the guest's first gesture instead.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onGesture = (event: Event) => {
      // "Open Invitation" hands over to the background music, and the mute
      // button handles its own taps.
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || muteRef.current?.contains(target)) return;
      play();
    };

    play();
    audio.addEventListener("canplay", play);
    GESTURES.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    return () => {
      audio.removeEventListener("canplay", play);
      GESTURES.forEach((e) => window.removeEventListener(e, onGesture));
    };
  }, [play]);

  /** Mute or unmute the welcome tune; unmuting also starts it if it was blocked. */
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = playing ? !audio.muted : false;
    audio.muted = next;
    setMuted(next);
    if (!next) play();
  };

  useEffect(
    () => () => {
      if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
      audioRef.current?.pause();
    },
    [],
  );

  /** Ease the welcome tune down to silence, then stop it. */
  const fadeOutWelcome = () => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    const step = 50;
    const decrement = audio.volume / (WELCOME_FADE_OUT_MS / step);
    fadeRef.current = window.setInterval(() => {
      const next = Math.max(0, audio.volume - decrement);
      audio.volume = next;
      if (next <= 0) {
        audio.pause();
        if (fadeRef.current !== null) window.clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, step);
  };

  // Hold the page still behind the cover, and put focus on the one action.
  useEffect(() => {
    if (stage === "open") return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    if (stage === "closed") buttonRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [stage]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const open = () => {
    if (stage !== "closed") return;
    openedRef.current = true;
    fadeOutWelcome();
    // Synchronous, so the background music starts inside this very tap.
    window.dispatchEvent(new Event(INVITATION_OPENING_EVENT));
    // A reload remembers its scroll position; the invitation should begin at the top.
    window.scrollTo({ top: 0 });

    // With reduced motion there is nothing to watch, so open straight away.
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStage("opening");
    timers.current.push(
      window.setTimeout(
        () => window.dispatchEvent(new Event(INVITATION_OPEN_EVENT)),
        instant ? 0 : DOORS_AT,
      ),
      window.setTimeout(() => setStage("open"), instant ? 0 : DONE_AT),
    );
  };

  if (stage === "open") return null;

  const opening = stage === "opening";
  const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
  const flapTransition = `transform ${FLAPS_MS}ms ${ease} ${FLAPS_AT}ms, opacity ${FLAPS_MS}ms ease-in ${FLAPS_AT}ms`;
  const doorTransition = `transform ${DOORS_MS}ms ${ease} ${DOORS_AT}ms, opacity ${DOORS_MS}ms ease-in ${DOORS_AT}ms`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-heading"
      onKeyDown={(event) => event.key === "Escape" && open()}
      className={`fixed inset-0 z-[70] overflow-hidden ${opening ? "pointer-events-none" : ""}`}
      style={{ perspective: "1600px" }}
    >
      <audio
        ref={audioRef}
        src={WELCOME_MUSIC_SRC}
        loop
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Stage 2 — the inner doors, sealed in the middle with a monogram. */}
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          aria-hidden="true"
          className={`absolute inset-y-0 w-1/2 overflow-hidden [backface-visibility:hidden] ${
            side === "left" ? "left-0 origin-left" : "right-0 origin-right"
          }`}
          style={{
            ...slice(side === "left" ? "left center" : "right center", "200% 100%"),
            transition: doorTransition,
            transform: opening
              ? `rotateY(${side === "left" ? 100 : -100}deg)`
              : "rotateY(0deg)",
            opacity: opening ? 0 : 1,
          }}
        >
          {/* Gold edge where the two doors meet. */}
          <span
            className={`absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-gold-400 to-transparent ${
              side === "left" ? "right-0" : "left-0"
            }`}
          />
          {/* Each door carries half of the round seal, so it splits as they part. */}
          <span
            className={`absolute top-1/2 flex h-24 w-24 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold-300 bg-[radial-gradient(circle_at_35%_30%,#f6e3a1,#c9a227_55%,#9c7b16)] font-script text-3xl text-maroon-800 shadow-[0_6px_18px_rgba(0,0,0,0.45)] ${
              side === "left" ? "-right-12" : "-left-12"
            }`}
          >
            {groomName[0]}
            <span className="mx-0.5 text-lg">♥</span>
            {brideName[0]}
          </span>
        </div>
      ))}

      {/* Stage 1 — the outer card: top and bottom flaps fold away first. */}
      {(["top", "bottom"] as const).map((side) => (
        <div
          key={side}
          aria-hidden="true"
          className={`absolute inset-x-0 h-1/2 overflow-hidden [backface-visibility:hidden] ${
            side === "top" ? "top-0 origin-top" : "bottom-0 origin-bottom"
          }`}
          style={{
            ...slice(side === "top" ? "center top" : "center bottom", "100% 200%"),
            transition: flapTransition,
            transform: opening
              ? `rotateX(${side === "top" ? -105 : 105}deg)`
              : "rotateX(0deg)",
            opacity: opening ? 0 : 1,
          }}
        >
          {/* The fold line along the middle of the card. */}
          <span
            className={`absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent ${
              side === "top" ? "bottom-0" : "top-0"
            }`}
          />
        </div>
      ))}

      {/* The card's face — fades first, before anything moves. */}
      <div
        className="absolute inset-0 flex items-center justify-center px-6 text-center"
        style={{
          transition: `opacity ${FADE_MS}ms ease-out`,
          opacity: opening ? 0 : 1,
        }}
      >
        <Mandala
          className="pointer-events-none absolute top-1/2 left-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 motion-safe:animate-spin-slow"
          opacity={0.12}
        />
        {/* Thin gold frame, like the border of a printed card. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 rounded-[1.75rem] border border-gold-400/40 sm:inset-8"
        />

        <div className="relative flex max-w-md flex-col items-center">
          <p lang="hi" className="font-body text-lg font-medium text-marigold-300 sm:text-xl">
            ॥ श्री गणेशाय नमः ॥
          </p>
          <p className="mt-6 font-serif-alt text-xs tracking-[0.3em] text-cream-200/85 uppercase sm:text-sm">
            You are invited to the wedding of
          </p>

          <h2
            id="welcome-heading"
            className="gold-text mt-4 flex flex-col items-center pb-2 font-script text-6xl leading-tight sm:text-7xl"
          >
            <span>{groomName}</span>
            <span className="text-4xl sm:text-5xl">&amp;</span>
            <span>{brideName}</span>
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent to-gold-400 sm:w-16" />
            <p className="font-serif-alt text-sm tracking-[0.25em] text-cream-100 uppercase sm:text-base">
              {dateLabel}
            </p>
            <span aria-hidden="true" className="h-px w-10 bg-gradient-to-l from-transparent to-gold-400 sm:w-16" />
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={open}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-marigold-400 via-gold-400 to-marigold-400 px-8 py-4 font-serif-alt text-sm font-semibold tracking-[0.2em] text-maroon-900 uppercase transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream-100 active:scale-95 motion-safe:animate-[gatePulse_2.2s_ease-out_infinite] sm:text-base"
          >
            <span aria-hidden="true">💌</span>
            Open Invitation
          </button>
          <p className="mt-4 font-body text-xs text-cream-200/70">Tap to open · music will play</p>
        </div>
      </div>

      {/* Mute / unmute for the welcome tune — where the page's music button sits. */}
      <div
        className="absolute bottom-7 left-6 flex items-center gap-2.5 sm:bottom-12 sm:left-12"
        style={{ transition: `opacity ${FADE_MS}ms ease-out`, opacity: opening ? 0 : 1 }}
      >
        <button
          ref={muteRef}
          type="button"
          onClick={toggleMute}
          aria-pressed={playing && !muted}
          aria-label={playing && !muted ? "Mute welcome music" : "Unmute welcome music"}
          title={playing && !muted ? "Mute music" : "Play music"}
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/70 bg-maroon-900/60 text-cream-100 backdrop-blur-sm transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream-100 active:scale-95 sm:h-14 sm:w-14"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
            {playing && !muted ? (
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
        <span
          role="status"
          aria-live="polite"
          className="font-serif-alt text-[0.62rem] tracking-[0.16em] text-cream-200/80 uppercase"
        >
          {playing && !muted ? "Music on" : muted ? "Music muted" : "Tap for music"}
        </span>
      </div>
    </div>
  );
}
