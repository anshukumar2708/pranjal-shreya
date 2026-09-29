"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
  downloadIcs,
  googleCalendarUrl,
  outlookCalendarUrl,
  type CalendarEventInput,
} from "@/lib/calendar";

interface AddToCalendarButtonProps {
  /** One event for a ceremony card, or several for "add the whole wedding". */
  events: CalendarEventInput[];
  /** Short names for the per-ceremony chips, e.g. ["Mehendi", "Haldi", …]. */
  labels?: string[];
  /** File name for the .ics, without extension. */
  filename: string;
  /** "light" on cream cards, "dark" on maroon ones. */
  tone?: "light" | "dark";
  /** Which way the menu opens. */
  placement?: "top" | "bottom";
  label?: string;
  className?: string;
}

/**
 * "Add to Calendar" button with a small menu: Google Calendar, Outlook and an
 * .ics file for Apple Calendar and everything else.
 *
 * Google and Outlook links can only carry a single event, so with several
 * events their rows turn into one chip per ceremony, while the .ics row adds
 * every ceremony in one go.
 *
 * A disclosure, not an ARIA menu: the options are ordinary links and buttons
 * reached with Tab. Escape or a click outside closes it and returns focus.
 */
export default function AddToCalendarButton({
  events,
  labels,
  filename,
  tone = "light",
  placement = "bottom",
  label = "Add to Calendar",
  className = "",
}: AddToCalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const many = events.length > 1;

  useEffect(() => {
    if (!open) return;

    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerStyle =
    tone === "dark"
      ? "btn-outline-gold !border-gold-300/60 !bg-transparent !text-cream-100 hover:!bg-cream-100 hover:!text-maroon-800"
      : // The base hover turns the button maroon with cream text — keep it
        // whole; overriding only the background left cream text on cream.
        "btn-outline-gold";

  const providers = [
    { name: "Google Calendar", icon: "🗓️", url: googleCalendarUrl },
    { name: "Outlook", icon: "📧", url: outlookCalendarUrl },
  ];

  const chip =
    "rounded-full border border-gold-500/50 bg-white/70 px-3 py-1 font-serif-alt text-[0.62rem] tracking-[0.12em] text-maroon-700 uppercase transition hover:border-maroon-700 hover:bg-maroon-700 hover:text-cream-100";

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={menuId}
        className={`${triggerStyle} w-full`}
      >
        <span aria-hidden="true">📅</span>
        {label}
        <span
          aria-hidden="true"
          className={`text-[0.6rem] transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      <div
        id={menuId}
        hidden={!open}
        className={`absolute left-1/2 z-30 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-gold-500/40 bg-cream-100 p-2 text-left shadow-[0_24px_60px_-20px_rgba(107,15,26,0.6)] ${
          placement === "top" ? "bottom-full mb-3" : "top-full mt-3"
        }`}
      >
        <p className="px-3 pt-2 pb-1 font-serif-alt text-[0.6rem] tracking-[0.2em] text-marigold-600 uppercase">
          {many ? "Save the ceremonies to" : "Save to your calendar"}
        </p>

        <ul className="grid gap-1">
          {providers.map((provider) =>
            many ? (
              <li key={provider.name} className="rounded-xl px-3 py-2.5">
                <p className="flex items-center gap-2 font-display text-base font-semibold text-maroon-800">
                  <span aria-hidden="true">{provider.icon}</span>
                  {provider.name}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {events.map((event, i) => (
                    <a
                      key={event.id}
                      href={provider.url(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className={chip}
                    >
                      {labels?.[i] ?? event.title}
                      <span className="sr-only"> to {provider.name} (opens in a new tab)</span>
                    </a>
                  ))}
                </div>
              </li>
            ) : (
              <li key={provider.name}>
                <a
                  href={provider.url(events[0])}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-display text-base font-semibold text-maroon-800 transition hover:bg-marigold-100"
                >
                  <span aria-hidden="true">{provider.icon}</span>
                  {provider.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ),
          )}

          <li>
            <button
              type="button"
              onClick={() => {
                downloadIcs(events, filename);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-marigold-100"
            >
              <span aria-hidden="true">🍎</span>
              <span>
                <span className="block font-display text-base font-semibold text-maroon-800">
                  Apple &amp; other calendars
                </span>
                <span className="block text-xs text-ink-soft">
                  {many
                    ? `All ${events.length} ceremonies in one tap · iPhone, Mac, Outlook app`
                    : "iPhone, Mac, Outlook app and more"}
                </span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
