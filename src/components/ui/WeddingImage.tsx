"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";

/** Local, always-available fallback shown when a photo cannot be loaded. */
const PLACEHOLDER = "/images/placeholder.svg";

/**
 * Drop-in replacement for `next/image` used for every wedding photo.
 *
 * Placeholder photos are served from third-party hosts, and a host being down
 * should never leave a blank hole in the invitation. If the image errors, this
 * swaps in a local floral placeholder that keeps the layout and the alt text
 * intact.
 */
export default function WeddingImage({ src, alt, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <NextImage
      {...rest}
      src={failed ? PLACEHOLDER : src}
      alt={alt}
      // The local SVG needs no optimization pass.
      unoptimized={failed || undefined}
      onError={() => setFailed(true)}
    />
  );
}
