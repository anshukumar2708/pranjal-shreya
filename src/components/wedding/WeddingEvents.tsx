import WeddingImage from "@/components/ui/WeddingImage";
import type { EventTheme, WeddingEvent } from "@/types/wedding";
import FlowerCorner from "@/components/decorations/FlowerCorner";
import HangingFlowers from "@/components/decorations/HangingFlowers";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface WeddingEventsProps {
  events: WeddingEvent[];
}

interface ThemeStyle {
  /** Card surface. */
  surface: string;
  /** Ribbon / badge. */
  badge: string;
  /** Accent text. */
  accent: string;
  /** Decorative pattern overlay on the image. */
  overlay: string;
  /** Small decorative motif row rendered under the title. */
  motif: string;
}

const THEMES: Record<EventTheme, ThemeStyle> = {
  haldi: {
    surface:
      "bg-gradient-to-br from-marigold-100 via-cream-100 to-marigold-300/50 border-marigold-400/50",
    badge: "bg-gradient-to-r from-marigold-400 to-marigold-600 text-maroon-900",
    accent: "text-marigold-600",
    overlay: "from-marigold-500/45 via-marigold-400/10 to-transparent",
    motif: "🌼 ✦ 🌻 ✦ 🌼",
  },
  mehendi: {
    surface:
      "bg-gradient-to-br from-leaf-100 via-cream-100 to-leaf-300/40 border-leaf-500/45",
    badge: "bg-gradient-to-r from-leaf-500 to-leaf-700 text-cream-100",
    accent: "text-leaf-700",
    overlay: "from-leaf-700/45 via-leaf-500/10 to-transparent",
    motif: "🌿 ✦ 🍃 ✦ 🌿",
  },
  barat: {
    surface:
      "bg-gradient-to-br from-royal-500/15 via-cream-100 to-rose-pink-200/60 border-royal-500/45",
    badge: "bg-gradient-to-r from-royal-600 to-maroon-700 text-cream-100",
    accent: "text-royal-600",
    overlay: "from-maroon-800/55 via-royal-500/15 to-transparent",
    motif: "🥁 ✦ 🎺 ✦ 🐎",
  },
  reception: {
    surface:
      "bg-gradient-to-br from-maroon-800 via-maroon-700 to-maroon-900 border-gold-500/50",
    badge: "bg-gradient-to-r from-gold-500 to-gold-300 text-maroon-900",
    accent: "text-gold-300",
    overlay: "from-maroon-900/70 via-maroon-800/20 to-transparent",
    motif: "✨ ✦ 🥂 ✦ ✨",
  },
};

function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const theme = THEMES[event.theme];
  const dark = event.theme === "reception";
  const highlight = event.theme === "barat";

  return (
    <Reveal variant={index % 2 === 0 ? "left" : "right"} delay={index * 80} className="h-full">
      <article
        aria-labelledby={`event-${event.id}-title`}
        className={`group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border shadow-petal transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_40px_80px_-40px_rgba(107,15,26,0.8)] ${theme.surface}`}
      >
        {highlight ? (
          <span className="absolute top-4 -right-11 z-20 w-40 rotate-45 bg-gradient-to-r from-marigold-500 to-royal-500 py-1.5 text-center font-serif-alt text-[0.6rem] tracking-[0.16em] text-cream-100 uppercase shadow-md">
            The Big Day
          </span>
        ) : null}

        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <WeddingImage
            src={event.image}
            alt={event.alt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1400ms] group-hover:scale-110"
          />
          <span
            aria-hidden="true"
            className={`absolute inset-0 bg-gradient-to-t ${theme.overlay}`}
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-300 to-transparent"
          />

          <span
            className={`absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-serif-alt text-[0.68rem] tracking-[0.14em] uppercase shadow-md ${theme.badge}`}
          >
            <span aria-hidden="true">{event.icon}</span>
            Ceremony {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <h3
            id={`event-${event.id}-title`}
            className={`font-display text-2xl font-semibold sm:text-3xl ${
              dark ? "text-cream-100" : ""
            }`}
          >
            {event.name}
          </h3>

          <p
            aria-hidden="true"
            className={`mt-1.5 text-[0.7rem] tracking-[0.3em] ${theme.accent}`}
          >
            {theme.motif}
          </p>

          <p
            className={`mt-4 text-sm leading-relaxed ${
              dark ? "text-cream-200/85" : "text-ink-soft"
            }`}
          >
            {event.description}
          </p>

          <dl
            className={`mt-6 space-y-3 border-t pt-5 text-sm ${
              dark ? "border-gold-500/30" : "border-maroon-700/15"
            }`}
          >
            {[
              { icon: "📅", label: "Date", value: event.date },
              { icon: "🕕", label: "Time", value: event.time },
              { icon: "📍", label: "Venue", value: `${event.venue} · ${event.address}` },
            ].map((row) => (
              <div key={row.label} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-0.5 text-base leading-none">
                  {row.icon}
                </span>
                <div className="min-w-0">
                  <dt
                    className={`font-serif-alt text-[0.58rem] tracking-[0.2em] uppercase ${theme.accent}`}
                  >
                    {row.label}
                  </dt>
                  <dd
                    className={`mt-0.5 font-display text-base font-semibold break-words ${
                      dark ? "text-cream-100" : "text-maroon-800"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </Reveal>
  );
}

export default function WeddingEvents({ events }: WeddingEventsProps) {
  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      className="relative overflow-hidden bg-gradient-to-b from-marigold-100/50 via-ivory to-cream-100 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-mandala absolute inset-0 opacity-50" />
        <Mandala className="absolute top-1/3 -left-40 h-[30rem] w-[30rem]" opacity={0.08} />
        <Mandala
          className="absolute right-[-10rem] bottom-0 h-[26rem] w-[26rem]"
          color="#2e6b4f"
          opacity={0.08}
        />
      </div>

      <HangingFlowers className="h-16 px-2 opacity-80 sm:h-20" strands={14} tone="cool" />

      <div className="pt-10">
        <SectionHeading
          id="events-heading"
          eyebrow="Four days of celebration"
          script="Join us for the"
          title="Wedding Ceremonies"
          subtitle="Every ritual has its own colour, its own music and its own kind of chaos. Come for one, come for all four — we would love to have you at each."
        />
      </div>

      <FlowerCorner position="bl" className="absolute bottom-6 left-0 h-24 w-24 opacity-60 sm:h-32 sm:w-32" />

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-4">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </div>
    </section>
  );
}
