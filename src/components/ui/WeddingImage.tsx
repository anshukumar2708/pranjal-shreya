"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";

/** Local, always-available fallback shown when a photo cannot be loaded. */
const PLACEHOLDER = "/images/placeholder.svg";

/**
 * Warm cream-to-blush wash shown while a photograph decodes, so pictures fade
 * up out of the page's own palette instead of popping in over a white hole.
 * Next.js blurs this itself, which is why a 2-stop gradient is enough.
 */
// Written out already-encoded: Next drops this straight into a CSS `url()`, so
// the SVG uses single quotes and `%23` for `#`, and needs no Buffer at runtime.
const BLUR_DATA_URL =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 10'>" +
  "<defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>" +
  "<stop offset='0' stop-color='%23fbe9d7'/><stop offset='1' stop-color='%23f0cdb8'/>" +
  "</linearGradient></defs><rect width='8' height='10' fill='url(%23g)'/></svg>";

/**
 * Drop-in replacement for `next/image` used for every wedding photo.
 *
 * Two jobs beyond `next/image`:
 *
 * 1. **Never leave a hole.** If the image errors — a bad path, a host that is
 *    down — this swaps in a local floral placeholder that keeps the layout and
 *    the alt text intact.
 * 2. **Fade in, don't pop in.** Photographs are large and the page is heavily
 *    animated; a blurred warm wash holds each frame until the real photo has
 *    decoded. Both can be overridden per call.
 */
export default function WeddingImage({ src, alt, placeholder, blurDataURL, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);

  // The placeholder SVG is its own artwork — blurring it up would only look
  // like a rendering fault.
  const blurProps = failed
    ? {}
    : {
        placeholder: placeholder ?? ("blur" as const),
        blurDataURL: blurDataURL ?? BLUR_DATA_URL,
      };

  return (
    <NextImage
      {...rest}
      {...blurProps}
      src={failed ? PLACEHOLDER : src}
      alt={alt}
      // The local SVG needs no optimization pass.
      unoptimized={failed || undefined}
      onError={() => setFailed(true)}
    />
  );
}
