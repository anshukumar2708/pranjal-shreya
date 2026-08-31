import type { WeddingEvent } from "@/types/wedding";

/** 2026-11-25T18:00:00+05:30 -> 20261125T123000Z (UTC basic format). */
function toCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export interface CalendarEventInput {
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
}

export function eventToCalendarInput(
  event: WeddingEvent,
  coupleNames: string,
): CalendarEventInput {
  return {
    title: `${event.name} — ${coupleNames}`,
    description: event.description,
    location: `${event.venue}, ${event.address}`,
    start: event.start,
    end: event.end,
  };
}

/** Prefilled Google Calendar "add event" URL. */
export function googleCalendarUrl(event: CalendarEventInput): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarStamp(event.start)}/${toCalendarStamp(event.end)}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** RFC 5545 VEVENT body — works with Apple Calendar, Outlook and most clients. */
export function buildIcs(event: CalendarEventInput): string {
  const uid = `${toCalendarStamp(event.start)}-${event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}@wedding.invite`;

  // Long lines and commas must be escaped per the spec.
  const escape = (value: string) =>
    value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toCalendarStamp(new Date().toISOString())}`,
    `DTSTART:${toCalendarStamp(event.start)}`,
    `DTEND:${toCalendarStamp(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.description)}`,
    `LOCATION:${escape(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Triggers a browser download of the .ics file. Client-side only. */
export function downloadIcs(event: CalendarEventInput, filename: string): void {
  const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}
