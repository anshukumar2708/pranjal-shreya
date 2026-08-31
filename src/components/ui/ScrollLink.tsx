"use client";

import type { ReactNode } from "react";

interface ScrollLinkProps {
  href: `#${string}`;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * Anchor that smooth-scrolls to an in-page section.
 * Falls back to the browser's native jump if the target is missing, and stays a
 * real `<a>` so it remains keyboard focusable and right-clickable.
 */
export default function ScrollLink({ href, children, className = "", ariaLabel }: ScrollLinkProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
