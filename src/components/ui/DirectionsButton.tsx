"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

interface DirectionsButtonProps {
  /** Place Google Maps should route to, e.g. "Hotel Alka Palace, Durg". */
  destination: string;
  className?: string;
  /** Screen-reader context, e.g. "to the Mehendi venue". */
  srLabel?: string;
  children?: ReactNode;
}

const MAPS_DIR = "https://www.google.com/maps/dir/?api=1";

function directionsUrl(destination: string, origin?: string) {
  const from = origin ? `&origin=${encodeURIComponent(origin)}` : "";
  return `${MAPS_DIR}${from}&destination=${encodeURIComponent(destination)}`;
}

/**
 * Opens Google Maps directions to the venue, starting from the viewer's
 * current location.
 *
 * The click itself is always a plain, synchronous link — never an async
 * `window.open`. An earlier version opened a blank tab and filled it in once
 * the position arrived, but the browser pauses geolocation for the page behind
 * the new tab, so the tab was left stuck on about:blank.
 *
 * - Location already allowed: the position is read in the background when the
 *   button mounts (and refreshed on hover/focus), so the click can put it in
 *   the link as `origin` with no waiting.
 * - Not allowed yet, denied, or on phones: the link goes out without an
 *   origin. Google Maps then starts from "Your location" itself — the Maps app
 *   uses the phone's GPS, and maps on the web asks for location on its own.
 */
export default function DirectionsButton({
  destination,
  className = "",
  srLabel,
  children,
}: DirectionsButtonProps) {
  const href = directionsUrl(destination);
  const origin = useRef<string | null>(null);
  const allowed = useRef(false);

  const refresh = () => {
    if (!allowed.current || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        origin.current = `${coords.latitude},${coords.longitude}`;
      },
      () => {},
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 },
    );
  };

  // Only read the position when the viewer has already allowed it — never
  // trigger a permission prompt just because the page loaded.
  useEffect(() => {
    let status: PermissionStatus | undefined;
    const sync = () => {
      allowed.current = status?.state === "granted";
      if (!allowed.current) origin.current = null;
      refresh();
    };

    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((result) => {
        status = result;
        sync();
        result.addEventListener("change", sync);
      })
      .catch(() => {});

    return () => status?.removeEventListener("change", sync);
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    // Rewrite the link in place, then let the browser follow it as normal.
    event.currentTarget.href =
      !isTouch && origin.current ? directionsUrl(destination, origin.current) : href;
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      onPointerEnter={refresh}
      onFocus={refresh}
      className={className}
    >
      {children ?? (
        <>
          <span aria-hidden="true">🧭</span>
          Get Directions
        </>
      )}
      <span className="sr-only">
        {srLabel ? ` ${srLabel}` : ""} (opens Google Maps in a new tab, from your current
        location)
      </span>
    </a>
  );
}
