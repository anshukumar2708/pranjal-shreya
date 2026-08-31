"use client";

import { useCallback, useEffect, useState } from "react";
import type { NavItem } from "@/types/wedding";

interface NavbarProps {
  items: NavItem[];
  /** Shown as the wordmark, e.g. "Pranjal & Sherya". */
  coupleName: string;
}

/**
 * Floating navigation. On desktop it is a glass pill that gains a stronger
 * background once the page scrolls; on mobile it collapses to a hamburger that
 * opens a full-screen menu. The active link is tracked with an IntersectionObserver.
 */
export default function Navbar({ items, coupleName }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>(items[0]?.href ?? "");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight whichever section currently occupies the upper viewport.
  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  // Lock body scroll while the mobile menu is open, and close it on Escape.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleNav = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      setOpen(false);
      setActive(href);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Keep the URL shareable without the browser's own instant jump.
      window.history.replaceState(null, "", href);
    },
    [],
  );

  return (
    <>
      <a
        href="#invitation"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:rounded-full focus:bg-maroon-800 focus:px-5 focus:py-3 focus:text-cream-100"
      >
        Skip to invitation
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        {/* The centring wrapper owns the max width and the side gutters. Keeping
            them here (rather than as margins on the nav itself) stops a fixed
            `mx-*` from overriding `mx-auto` and pinning the bar to the left. */}
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-6">
          <nav
            aria-label="Primary"
            className={`flex items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
              scrolled
                ? "border border-gold-500/40 bg-cream-100/90 shadow-[0_10px_40px_-18px_rgba(107,15,26,0.55)] backdrop-blur-xl"
                : "border border-transparent bg-transparent"
            }`}
          >
            <a
              href="#home"
              onClick={(event) => handleNav(event, "#home")}
              className="flex shrink-0 items-center gap-2"
            >
              <span aria-hidden="true" className="text-lg">
                🪔
              </span>
              <span className="font-script text-xl leading-none text-maroon-700 sm:text-2xl">
                {coupleName}
              </span>
            </a>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {items.map((item) => {
                const isActive = active === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(event) => handleNav(event, item.href)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative rounded-full px-3.5 py-2 font-serif-alt text-[0.78rem] tracking-[0.14em] uppercase transition-colors duration-300 ${
                        isActive
                          ? "text-maroon-700"
                          : "text-ink-soft hover:text-maroon-600"
                      }`}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3 -bottom-0.5 h-px origin-center bg-gradient-to-r from-transparent via-marigold-500 to-transparent transition-transform duration-300 ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <a
              href="#rsvp"
              onClick={(event) => handleNav(event, "#rsvp")}
              className="btn-royal hidden !px-5 !py-2.5 !text-[0.7rem] lg:inline-flex"
            >
              RSVP
            </a>

            {/* Mobile trigger */}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/50 bg-cream-100/80 lg:hidden"
            >
              <span className="relative block h-4 w-5" aria-hidden="true">
                <span
                  className={`absolute inset-x-0 top-0 h-0.5 rounded bg-maroon-700 transition-transform duration-300 ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-[7px] h-0.5 rounded bg-maroon-700 transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-[14px] h-0.5 rounded bg-maroon-700 transition-transform duration-300 ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 px-4 lg:hidden"
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-maroon-900/70 backdrop-blur-sm"
        />

        <nav
          aria-label="Mobile"
          className="relative mx-auto mt-24 max-h-[72vh] max-w-md overflow-y-auto rounded-[2rem] border border-gold-500/40 bg-cream-100 p-6 shadow-2xl"
        >
          <p className="eyebrow text-center">Navigate</p>
          <ul className="mt-4 grid gap-1.5">
            {items.map((item, index) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) => handleNav(event, item.href)}
                  aria-current={active === item.href ? "true" : undefined}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-xl transition-colors ${
                    active === item.href
                      ? "bg-maroon-700 text-cream-100"
                      : "text-maroon-800 hover:bg-marigold-100"
                  }`}
                >
                  {item.label}
                  <span className="font-body text-xs opacity-60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#rsvp"
            onClick={(event) => handleNav(event, "#rsvp")}
            className="btn-royal mt-5 w-full"
          >
            Confirm Your Seat
          </a>
        </nav>
      </div>
    </>
  );
}
