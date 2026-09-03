import type { WeddingData } from "@/types/wedding";
import FloralDivider from "@/components/decorations/FloralDivider";
import MarigoldBorder from "@/components/decorations/MarigoldBorder";
import Reveal from "@/components/ui/Reveal";
import ScrollLink from "@/components/ui/ScrollLink";

interface FooterProps {
  data: WeddingData;
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
          <ul className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-7">
            {contact.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group inline-flex flex-col items-center text-center transition-colors"
                >
                  <span className="font-serif-alt text-[0.6rem] tracking-[0.2em] text-cream-200/60 uppercase">
                    {item.label}
                  </span>
                  <span className="mt-0.5 font-display text-base text-cream-100 group-hover:text-marigold-300 sm:text-lg">
                    {item.value}
                  </span>
                </a>
              </li>
            ))}
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
          <p className="font-serif-alt text-[0.55rem] tracking-[0.24em] text-cream-200/45 uppercase">
            Designed &amp; Developed by
          </p>
          <p className="mt-2 flex flex-col items-center justify-center gap-x-3 gap-y-1 sm:flex-row">
            <span className="font-display text-sm text-cream-100/90 sm:text-base">
              Anshu Singh
            </span>
            <span aria-hidden="true" className="hidden text-gold-500/40 sm:inline">
              ·
            </span>
            <a
              href="tel:+919770601469"
              className="font-display text-sm text-cream-200/70 transition-colors hover:text-marigold-300 sm:text-base"
            >
              +91 97706 01469
            </a>
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
