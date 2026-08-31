"use client";

import type { WeddingEvent } from "@/types/wedding";
import { downloadIcs, eventToCalendarInput, googleCalendarUrl } from "@/lib/calendar";
import FloralDivider from "@/components/decorations/FloralDivider";
import Mandala from "@/components/decorations/Mandala";
import MarigoldBorder from "@/components/decorations/MarigoldBorder";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface AddToCalendarProps {
  /** Only events flagged `calendar: true` get a card. */
  events: WeddingEvent[];
  coupleName: string;
}

export default function AddToCalendar({ events, coupleName }: AddToCalendarProps) {
  const calendarEvents = events.filter((event) => event.calendar);

  return (
    <section
      aria-labelledby="calendar-heading"
      className="relative overflow-hidden bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-mandala absolute inset-0 opacity-35" />
        <Mandala
          className="absolute -bottom-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2"
          color="#e6be8a"
          opacity={0.12}
        />
      </div>

      <MarigoldBorder edge="top" tone="cool" />

      <SectionHeading
        id="calendar-heading"
        eyebrow="So you do not miss a thing"
        script="Save the"
        title="Dates"
        subtitle="Add the ceremonies straight to your calendar — Google, Apple, Outlook, whatever you use."
        tone="light"
      />

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
        {calendarEvents.map((event, index) => {
          const calendarInput = eventToCalendarInput(event, coupleName);

          return (
            <Reveal key={event.id} variant="scale" delay={index * 120} className="h-full">
              <article className="glass-card-dark flex h-full flex-col items-center rounded-[1.75rem] px-6 py-9 text-center">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/40 bg-maroon-900/60 text-2xl"
                >
                  {event.icon}
                </span>

                <h3 className="mt-5 font-display text-2xl font-semibold text-cream-100 sm:text-3xl">
                  {event.name}
                </h3>

                <FloralDivider tone="light" className="my-4 w-40" />

                <p className="font-serif-alt text-sm tracking-[0.16em] text-gold-300 uppercase">
                  {event.date}
                </p>
                <p className="mt-2 text-sm text-cream-200/80">
                  {event.time} · {event.venue}
                </p>

                <div className="mt-7 flex w-full flex-col gap-3">
                  <a
                    href={googleCalendarUrl(calendarInput)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-royal w-full !bg-none !bg-marigold-500 !text-maroon-900"
                  >
                    <span aria-hidden="true">📅</span>
                    Google Calendar
                    <span className="sr-only">for {event.name} (opens in a new tab)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadIcs(calendarInput, `${event.id}-${coupleName}`)}
                    className="btn-outline-gold w-full !border-gold-300/60 !bg-transparent !text-cream-100 hover:!bg-cream-100 hover:!text-maroon-800"
                  >
                    <span aria-hidden="true">⬇</span>
                    Download .ics
                    <span className="sr-only">for {event.name}</span>
                  </button>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <MarigoldBorder edge="bottom" tone="cool" />
    </section>
  );
}
