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

type GeoPermission = PermissionState | "unknown";

const MAPS_DIR = "https://www.google.com/maps/dir/?api=1";

function directionsUrl(destination: string, origin?: string) {
  const from = origin ? `&origin=${encodeURIComponent(origin)}` : "";
  return `${MAPS_DIR}${from}&destination=${encodeURIComponent(destination)}`;
}

function getPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }),
  );
}

/**
 * Opens Google Maps directions starting from the viewer's current location.
 *
 * - Phones: the plain link hands off to the Maps app, which routes from the
 *   device's GPS on its own, so the click is left alone.
 * - Desktop, location already allowed: a tab is opened synchronously (so popup
 *   blockers allow it) and pointed at the route once the position arrives.
 * - Desktop, not yet asked: the permission prompt must show in *this* tab, so
 *   the position is fetched first and the route opened afterwards; if the
 *   browser then blocks the popup, this tab navigates instead.
 * - Location denied or unavailable: the route opens without an origin and
 *   Google Maps asks for a starting point.
 * - Without JavaScript the href still works as a plain directions link.
 */
export default function DirectionsButton({
  destination,
  className = "",
  srLabel,
  children,
}: DirectionsButtonProps) {
  const href = directionsUrl(destination);
  const permission = useRef<GeoPermission>("unknown");

  // Read the permission ahead of the click: the answer decides whether the new
  // tab can be opened before the position is known.
  useEffect(() => {
    let status: PermissionStatus | undefined;
    const sync = () => {
      if (status) permission.current = status.state;
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

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch || !("geolocation" in navigator) || permission.current === "denied") return;

    event.preventDefault();

    if (permission.current === "granted") {
      const tab = window.open("", "_blank");
      if (tab) tab.opener = null;
      let url = href;
      try {
        const { coords } = await getPosition();
        url = directionsUrl(destination, `${coords.latitude},${coords.longitude}`);
      } catch {
        // Fall through with the origin-less route.
      }
      if (tab) tab.location.href = url;
      else window.location.href = url;
      return;
    }

    let url = href;
    try {
      const { coords } = await getPosition();
      url = directionsUrl(destination, `${coords.latitude},${coords.longitude}`);
    } catch {
      // Denied or timed out — open the route without an origin.
    }
    // No "noopener" feature here: it makes window.open return null even on
    // success, which would hide a blocked popup. The opener is cut by hand.
    const tab = window.open(url, "_blank");
    if (tab) tab.opener = null;
    else window.location.href = url;
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
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
