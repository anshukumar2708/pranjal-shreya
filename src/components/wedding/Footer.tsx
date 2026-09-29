import type { WeddingData } from "@/types/wedding";
import FloralDivider from "@/components/decorations/FloralDivider";
import MarigoldBorder from "@/components/decorations/MarigoldBorder";
import Reveal from "@/components/ui/Reveal";
import ScrollLink from "@/components/ui/ScrollLink";

interface FooterProps {
  data: WeddingData;
}

/** Handset glyph for the call buttons. */
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  );
}

export default function Footer({ data }: FooterProps) {
  const { groom, bride, dateRange, contact, nav, hashtag } = data;
  const year = new Date(data.countdownTarget).getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-maroon-900 to-[#2a040c] px-4 pt-16 pb-24 sm:px-6 sm:pb-28">
      <MarigoldBorder edge="top" />

      <div aria-hidden="true" className="pattern-diamond absolute inset-0 opacity-25" />

      <Reveal className="relative mx-auto max-w-4xl text-center">
        <p aria-hidden="true" className="text-2xl">
          🌺
        </p>

        <p className="gold-text mt-4 font-script text-4xl leading-tight sm:text-5xl">
          {groom.shortName} &amp; {bride.shortName}
        </p>

        <p className="mt-3 font-serif-alt text-xs tracking-[0.28em] text-cream-200/80 uppercase sm:text-sm">
          {dateRange}
        </p>

        <FloralDivider tone="light" className="my-7" />

        <p className="mx-auto max-w-xl font-display text-lg text-cream-100 italic sm:text-xl">
          With love, laughter and the blessings of our families.
        </p>

        {/* Quick links */}
        <nav aria-label="Footer" className="mt-9">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <ScrollLink
                  href={item.href}
                  className="font-serif-alt text-[0.65rem] tracking-[0.2em] text-cream-200/70 uppercase transition-colors hover:text-marigold-300"
                >
                  {item.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="mt-9 border-t border-gold-500/25 pt-8">
          <p className="eyebrow text-gold-300">For any questions</p>
          <ul className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {contact.map((item) => {
              const isPhone = item.href.startsWith("tel:");
              return (
                <li key={item.href}>
                  {/* The whole row is one link, so the icon, name and number
                      all dial — and the tap target stays generous on phones. */}
                  <a
                    href={item.href}
                    aria-label={`${item.label}, ${item.value}`}
                    className="group flex items-center gap-4 rounded-full border border-gold-500/30 bg-maroon-900/30 py-2 pr-6 pl-2 text-left transition hover:border-gold-300/70 hover:bg-maroon-900/50 focus-visible:border-gold-300"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-marigold-400 to-gold-500 text-maroon-900 shadow-[0_6px_18px_-6px_rgba(249,166,32,0.8)] transition group-hover:scale-110 group-active:scale-95"
                    >
                      {isPhone ? (
                        <PhoneIcon className="h-5 w-5" />
                      ) : (
                        <span className="text-lg">✉</span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-serif-alt text-sm tracking-[0.08em] text-cream-200/85 sm:text-base">
                        {item.label.replace(/^Call\s+/i, "")}
                      </span>
                      <span className="mt-0.5 block font-display text-xl font-semibold tracking-wide whitespace-nowrap text-cream-100 group-hover:text-marigold-300 sm:text-2xl">
                        {item.value}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Floral sign-off */}
        <div aria-hidden="true" className="mt-10 flex items-center justify-center gap-2">
          {["🌼", "🌹", "🌸", "🌹", "🌼"].map((flower, i) => (
            <span
              key={i}
              className="text-lg motion-safe:animate-[floatY_6s_ease-in-out_infinite] sm:text-xl"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {flower}
            </span>
          ))}
        </div>

        <p className="mt-7 font-serif-alt text-[0.6rem] tracking-[0.3em] text-marigold-300 uppercase">
          {hashtag}
        </p>

        <p className="mt-4 text-[0.7rem] text-cream-200/45">
          © {year} {groom.name} &amp; {bride.name}. Made with love for our families and friends.
        </p>

        {/* Developer credit */}
        <div className="mt-8 border-t border-gold-500/20 pt-6">
          <p className="font-serif-alt text-xs tracking-[0.24em] text-cream-200/60 uppercase sm:text-sm">
            Designed &amp; Developed by
          </p>
          <p className="mt-3 flex flex-col items-center justify-center gap-x-4 gap-y-1 sm:flex-row">
            <span className="font-display text-xl font-semibold text-cream-100 sm:text-2xl">
              Anshu Singh
            </span>
            <span aria-hidden="true" className="hidden text-xl text-gold-500/60 sm:inline">
              ·
            </span>
            <a
              href="tel:+919770601469"
              aria-label="Call Anshu Singh, +91 97706 01469"
              className="group inline-flex items-center gap-2.5 font-display text-lg text-cream-200/85 transition-colors hover:text-marigold-300 sm:text-xl"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-marigold-400 to-gold-500 text-maroon-900 shadow-[0_6px_16px_-6px_rgba(249,166,32,0.8)] transition group-hover:scale-110 group-active:scale-95"
              >
                <PhoneIcon className="h-4 w-4" />
              </span>
              +91 97706 01469
            </a>
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
