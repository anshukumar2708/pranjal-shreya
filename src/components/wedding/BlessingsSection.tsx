"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { BLESSING_MESSAGE_MAX, BLESSING_NAME_MAX } from "@/lib/blessings";

interface Blessing {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface BlessingsSectionProps {
  coupleName: string;
}

/** Give up on a request after this long, so the wall never loads forever. */
const REQUEST_TIMEOUT_MS = 15000;

/** Cards shown before "Show more". */
const PAGE = 12;

/** One-tap starters, appended to the message. */
const SUGGESTIONS = [
  "शुभ विवाह 🙏",
  "Congratulations! 🎉",
  "Wishing you a lifetime of love ❤️",
  "ढेर सारी शुभकामनाएं और आशीर्वाद 🌸",
];

/** Accent per card, cycled, so the wall reads festive rather than uniform. */
const ACCENTS = [
  {
    ring: "from-maroon-700 to-maroon-900",
    quote: "text-maroon-700/15",
    edge: "border-l-maroon-600",
  },
  {
    ring: "from-marigold-400 to-marigold-600",
    quote: "text-marigold-500/20",
    edge: "border-l-marigold-500",
  },
  {
    ring: "from-rose-pink-400 to-rose-pink-600",
    quote: "text-rose-pink-500/20",
    edge: "border-l-rose-pink-500",
  },
  {
    ring: "from-leaf-500 to-leaf-700",
    quote: "text-leaf-600/20",
    edge: "border-l-leaf-600",
  },
];

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function timeAgo(iso: string): string {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size)
      return relative.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

function initial(name: string) {
  return (Array.from(name.trim())[0] ?? "✿").toUpperCase();
}

/**
 * The Blessings Wall: guests leave their name and a wish, and every visitor
 * sees them. Blessings are stored on the server (`/api/blessings`), so they
 * stay after a refresh and appear on every device.
 */
export default function BlessingsSection({
  coupleName,
}: BlessingsSectionProps) {
  const [blessings, setBlessings] = useState<Blessing[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [shown, setShown] = useState(PAGE);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: "ok" | "error";
    text: string;
  } | null>(null);
  const [freshId, setFreshId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/blessings", {
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { blessings: Blessing[] };
      setBlessings(data.blessings);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    // Deferred a tick: the effect body must not set state synchronously.
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const addSuggestion = (text: string) => {
    setMessage((current) => {
      const next = current.trim() ? `${current.trim()} ${text}` : text;
      return Array.from(next).slice(0, BLESSING_MESSAGE_MAX).join("");
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;

    if (!name.trim()) {
      setFeedback({ kind: "error", text: "Please enter your name." });
      return;
    }
    if (Array.from(message.trim()).length < 2) {
      setFeedback({
        kind: "error",
        text: "Please write a blessing for the couple.",
      });
      return;
    }

    setSending(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/blessings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, website }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const data = (await res.json()) as {
        blessing?: Blessing;
        error?: string;
      };
      if (!res.ok || !data.blessing) {
        setFeedback({
          kind: "error",
          text: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }
      setBlessings((list) => [data.blessing!, ...list]);
      setFreshId(data.blessing.id);
      setStatus("ready");
      setMessage("");
      setFeedback({
        kind: "ok",
        text: `Thank you, ${data.blessing.name}! Your blessing is on the wall 🌸`,
      });
    } catch {
      setFeedback({
        kind: "error",
        text: "Could not reach the server. Please check your connection.",
      });
    } finally {
      setSending(false);
    }
  };

  const messageLength = Array.from(message).length;
  const visible = blessings.slice(0, shown);

  const field =
    "w-full rounded-2xl border border-gold-500/40 bg-white/80 px-4 py-3 text-base text-maroon-900 placeholder:text-ink-soft/60 shadow-inner transition outline-none focus:border-maroon-600 focus:bg-white focus:ring-4 focus:ring-marigold-300/35";

  return (
    <section
      id="blessings"
      aria-labelledby="blessings-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-cream-100 to-marigold-100/50 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-mandala absolute inset-0 opacity-40" />
        <Mandala
          className="absolute -top-32 -right-32 h-[28rem] w-[28rem]"
          opacity={0.08}
        />
        <Mandala
          className="absolute -bottom-40 -left-32 h-[26rem] w-[26rem]"
          color="#c1121f"
          opacity={0.06}
        />
      </div>

      <SectionHeading
        id="blessings-heading"
        eyebrow="✦ Blessings Wall ✦"
        script="Share your"
        title="Blessings"
        subtitle={`Leave your heartfelt wishes for ${coupleName}. Your blessings mean the world to us — in any language you like.`}
      />

      <div className="mx-auto mt-12 grid max-w-6xl items-start gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-10">
        {/* ---------------------------------------------------------- Form */}
        {/* Sticky lives on the Reveal wrapper: it is the grid item, so a
            sticky form inside it would have no room to stick. */}
        <Reveal variant="left" className="lg:sticky lg:top-24">
          <form
            onSubmit={submit}
            noValidate
            className="glass-card overflow-hidden rounded-[2rem]"
          >
            <div className="bg-gradient-to-r from-maroon-800 via-maroon-700 to-maroon-800 px-6 py-5 text-center">
              <p className="font-script text-3xl leading-none text-marigold-300">
                Write a Blessing
              </p>
              <p className="mt-2 font-serif-alt text-[0.62rem] tracking-[0.2em] text-cream-200/80 uppercase">
                For {coupleName}
              </p>
            </div>

            <div className="grid gap-4 p-6 sm:p-7">
              <label className="grid gap-1.5">
                <span className="font-serif-alt text-[0.65rem] tracking-[0.18em] text-marigold-600 uppercase">
                  Your name
                </span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={BLESSING_NAME_MAX}
                  autoComplete="name"
                  placeholder="e.g. Ananya Sharma"
                  className={field}
                />
              </label>

              <label className="grid gap-1.5">
                <span className="flex items-baseline justify-between font-serif-alt text-[0.65rem] tracking-[0.18em] text-marigold-600 uppercase">
                  Your blessing
                  <span
                    className={`tracking-normal normal-case ${
                      messageLength > BLESSING_MESSAGE_MAX - 40
                        ? "text-maroon-600"
                        : "text-ink-soft/70"
                    }`}
                  >
                    {messageLength}/{BLESSING_MESSAGE_MAX}
                  </span>
                </span>
                <textarea
                  name="message"
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      Array.from(e.target.value)
                        .slice(0, BLESSING_MESSAGE_MAX)
                        .join(""),
                    )
                  }
                  rows={5}
                  placeholder="Write your blessing for the couple…"
                  className={`${field} resize-none leading-relaxed`}
                />
              </label>

              {/* One-tap starters */}
              <div
                className="flex flex-wrap gap-2"
                aria-label="Quick blessings"
              >
                {SUGGESTIONS.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => addSuggestion(text)}
                    className="rounded-full border border-gold-500/45 bg-marigold-100/70 px-3 py-1.5 text-xs text-maroon-800 transition hover:border-maroon-600 hover:bg-maroon-700 hover:text-cream-100"
                  >
                    {text}
                  </button>
                ))}
              </div>

              {/* Honeypot — hidden from people and screen readers, filled by bots. */}
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px overflow-hidden"
              >
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-royal mt-1 w-full disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 animate-spin rounded-full border-2 border-cream-100/40 border-t-cream-100"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">💌</span>
                    Send Blessing
                  </>
                )}
              </button>

              <p
                role="status"
                aria-live="polite"
                className={`min-h-[1.25rem] text-center text-sm ${
                  feedback?.kind === "error"
                    ? "text-maroon-600"
                    : "text-leaf-700"
                }`}
              >
                {feedback?.text}
              </p>
            </div>
          </form>
        </Reveal>

        {/* ---------------------------------------------------------- Wall */}
        <Reveal variant="right" delay={150}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="font-display text-xl font-semibold text-maroon-800 sm:text-2xl">
              Wishes from our loved ones
            </p>
            {status === "ready" && blessings.length ? (
              <span className="shrink-0 rounded-full border border-gold-500/45 bg-cream-100/80 px-3 py-1 font-serif-alt text-[0.65rem] tracking-[0.14em] text-maroon-700 uppercase">
                {blessings.length}{" "}
                {blessings.length === 1 ? "blessing" : "blessings"}
              </span>
            ) : null}
          </div>

          {status === "loading" ? (
            <div
              className="columns-1 gap-5 sm:columns-2"
              aria-busy="true"
              aria-label="Loading blessings"
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="mb-5 break-inside-avoid rounded-3xl border border-gold-500/25 bg-cream-100/70 p-6"
                >
                  <div className="h-3 w-4/5 animate-pulse rounded bg-marigold-100" />
                  <div className="mt-2 h-3 w-3/5 animate-pulse rounded bg-marigold-100" />
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-10 w-10 animate-pulse rounded-full bg-marigold-100" />
                    <div className="h-3 w-24 animate-pulse rounded bg-marigold-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : status === "error" ? (
            <div className="rounded-3xl border border-gold-500/30 bg-cream-100/80 p-8 text-center">
              <p className="text-ink-soft">
                The blessings could not be loaded just now.
              </p>
              <button
                type="button"
                onClick={() => void load()}
                className="btn-outline-gold mt-4"
              >
                Try again
              </button>
            </div>
          ) : blessings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gold-500/50 bg-cream-100/70 p-10 text-center">
              <p aria-hidden="true" className="text-4xl">
                🌸
              </p>
              <p className="mt-3 font-display text-2xl font-semibold text-maroon-800">
                Be the first to bless the couple
              </p>
              <p className="mt-2 text-ink-soft">
                Your wishes will appear here for everyone to see.
              </p>
            </div>
          ) : (
            <>
              <ul className="columns-1 gap-5 sm:columns-2">
                {visible.map((blessing, index) => {
                  const accent = ACCENTS[index % ACCENTS.length];
                  const fresh = blessing.id === freshId;
                  return (
                    <Reveal
                      as="li"
                      key={blessing.id}
                      variant="up"
                      delay={(index % PAGE) * 70}
                      className={`relative mb-5 break-inside-avoid overflow-hidden rounded-3xl border border-l-4 border-gold-500/30 bg-gradient-to-br from-white/90 to-cream-100/90 p-6 shadow-[0_18px_40px_-28px_rgba(107,15,26,0.55)] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-26px_rgba(107,15,26,0.6)] ${accent.edge} ${
                        fresh
                          ? "ring-2 ring-marigold-400 motion-safe:animate-[fadeUp_0.6s_ease-out]"
                          : ""
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -top-3 right-4 font-display text-8xl leading-none ${accent.quote}`}
                      >
                        &rdquo;
                      </span>

                      <p className="relative font-body text-base leading-relaxed break-words whitespace-pre-line text-maroon-900/90">
                        {blessing.message}
                      </p>

                      <div className="mt-5 flex items-center gap-3 border-t border-gold-500/20 pt-4">
                        <span
                          aria-hidden="true"
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-body text-lg font-semibold text-cream-100 shadow-md ${accent.ring}`}
                        >
                          {initial(blessing.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-body text-base font-semibold text-maroon-800">
                            {blessing.name}
                          </p>
                          <p className="font-serif-alt text-[0.62rem] tracking-[0.14em] text-ink-soft/70 uppercase">
                            <time dateTime={blessing.createdAt}>
                              {timeAgo(blessing.createdAt)}
                            </time>
                          </p>
                        </div>
                        {fresh ? (
                          <span className="ml-auto shrink-0 rounded-full bg-marigold-100 px-2.5 py-1 font-serif-alt text-[0.58rem] tracking-[0.14em] text-maroon-700 uppercase">
                            New
                          </span>
                        ) : null}
                      </div>
                    </Reveal>
                  );
                })}
              </ul>

              {blessings.length > shown ? (
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setShown((n) => n + PAGE)}
                    className="btn-outline-gold"
                  >
                    Show more blessings ({blessings.length - shown})
                  </button>
                </div>
              ) : null}
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
