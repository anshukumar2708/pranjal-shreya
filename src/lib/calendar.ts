import type { WeddingEvent } from "@/types/wedding";

/** 2026-11-25T18:00:00+05:30 -> 20261125T123000Z (UTC basic format). */
function toCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export interface CalendarEventInput {
  /** Stable id, used for the .ics UID so re-adding updates instead of duplicating. */
  id: string;
  title: string;
  description: string;
  location: string;
  start: string;
  end: string;
}

/**
 * Title every calendar entry "<Groom> weds <Bride> · <Ceremony>", so guests see
 * whose wedding it is at a glance in a busy week view.
 */
export function eventToCalendarInput(
  event: WeddingEvent,
  groomName: string,
  brideName: string,
  siteUrl?: string,
): CalendarEventInput {
  const place = event.mapQuery ?? `${event.venue}, ${event.address}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;

  return {
    id: event.id,
    title: `${groomName} weds ${brideName} · ${event.name}`,
    description: [
      event.description,
      "",
      `🕕 ${event.date}, ${event.time}`,
      `📍 ${event.venue}, ${event.address}`,
      `🧭 Directions: ${directions}`,
      ...(siteUrl ? [`💌 Invitation: ${siteUrl}`] : []),
    ].join("\n"),
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
    ctz: "Asia/Kolkata",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Prefilled Outlook.com / Microsoft 365 "new event" URL. */
export function outlookCalendarUrl(event: CalendarEventInput): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: new Date(event.start).toISOString(),
    enddt: new Date(event.end).toISOString(),
    body: event.description,
    location: event.location,
  });

  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}

/** RFC 5545 text escaping. */
const escape = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

/**
 * Fold a content line to at most 75 octets, as RFC 5545 requires. Counted in
 * UTF-8 bytes (the descriptions carry emoji), and never splitting a character.
 */
function fold(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;

  for (const char of line) {
    const size = encoder.encode(char).length;
    // Continuation lines start with a space, which counts toward their 75.
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);

  return parts.join("\r\n ");
}

/**
 * RFC 5545 calendar with one VEVENT per event — works with Apple Calendar,
 * Outlook and most other clients. Each event carries a reminder a day before.
 */
export function buildIcs(events: CalendarEventInput[]): string {
  const stamp = toCalendarStamp(new Date().toISOString());

  const vevents = events.flatMap((event) => [
    "BEGIN:VEVENT",
    `UID:${event.id}-${toCalendarStamp(event.start)}@pranjal-weds-shriya`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toCalendarStamp(event.start)}`,
    `DTEND:${toCalendarStamp(event.end)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(event.description)}`,
    `LOCATION:${escape(event.location)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escape(`Tomorrow: ${event.title}`)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
  ]);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pranjal weds Shriya//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...vevents,
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
}

/**
 * Hands the .ics to the device. On iPhone and Mac this opens the "Add to
 * Calendar" sheet; elsewhere it downloads a file the calendar app opens.
 * Client-side only.
 */
export function downloadIcs(events: CalendarEventInput[], filename: string): void {
  const blob = new Blob([buildIcs(events)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Give Safari a moment to start the download before the URL is released.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
