import type { EventTheme, WeddingEvent } from "@/types/wedding";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface WeddingTimelineProps {
  events: WeddingEvent[];
}

const NODE_COLORS: Record<EventTheme, string> = {
  haldi: "from-marigold-300 to-marigold-600",
  mehendi: "from-leaf-300 to-leaf-700",
  barat: "from-rose-pink-400 to-royal-600",
  reception: "from-gold-300 to-gold-700",
};

/**
 * The ceremony journey at a glance: a horizontal ribbon on desktop that becomes
 * a vertical rail on small screens. Purely presentational — the detail lives in
 * the events section above.
 */
export default function WeddingTimeline({ events }: WeddingTimelineProps) {
  return (
    <section
      aria-labelledby="timeline-heading"
      className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-ivory to-cream-200 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Mandala
          className="absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2"
          opacity={0.07}
          color="#c1121f"
        />
      </div>

      <SectionHeading
        id="timeline-heading"
        eyebrow="From haldi to the last dance"
        script="The"
        title="Wedding Journey"
        subtitle="Four evenings, in order. Follow the garland from the first pinch of turmeric to the final toast."
      />

      {/* ---------- Desktop: horizontal ribbon ---------- */}
      <div className="mx-auto mt-16 hidden max-w-6xl lg:block">
        <div className="relative">
          {/* Connecting rail */}
          <div
            aria-hidden="true"
            className="absolute top-[4.5rem] right-[10%] left-[10%] h-0.5 rounded-full bg-gradient-to-r from-marigold-400 via-royal-500 to-gold-500 opacity-60"
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 40"
            preserveAspectRatio="none"
            className="absolute top-[3.6rem] right-[10%] left-[10%] h-10 w-[80%]"
            fill="none"
          >
            {/* Vine weaving over the rail */}
            <path
              d="M0 20C80 0 160 40 240 20s160-20 240 0 160 40 240 20 160-20 280 0"
              stroke="#2e6b4f"
              strokeWidth="1.4"
              opacity="0.5"
              strokeDasharray="1600"
              strokeDashoffset="1600"
              className="motion-safe:animate-[draw-line_2.6s_ease-out_forwards]"
            />
          </svg>

          <ol className="relative grid grid-cols-4 gap-4">
            {events.map((event, index) => (
              <Reveal key={event.id} delay={index * 140} className="h-full">
                <li className="group flex h-full flex-col items-center text-center">
                  <p className="font-serif-alt text-[0.65rem] tracking-[0.24em] text-marigold-600 uppercase">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>

                  {/* Node */}
                  <div className="relative mt-4 flex h-20 w-20 items-center justify-center">
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 rounded-full bg-gradient-to-br ${
                        NODE_COLORS[event.theme]
                      } opacity-90 shadow-[0_12px_30px_-12px_rgba(107,15,26,0.8)] transition-transform duration-500 group-hover:scale-110`}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-1.5 rounded-full bg-cream-100"
                    />
                    {/* Petal ring */}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span
                        key={i}
                        aria-hidden="true"
                        className="absolute h-2 w-2 rounded-full bg-marigold-400/70"
                        style={{
                          transform: `rotate(${i * 36}deg) translateY(-2.55rem)`,
                        }}
                      />
                    ))}
                    <span className="relative text-2xl" aria-hidden="true">
                      {event.icon}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-semibold">{event.name}</h3>
                  <p className="mt-1 font-serif-alt text-xs tracking-[0.16em] text-maroon-600 uppercase">
                    {event.date}
                  </p>
                  <p className="mt-3 max-w-[15rem] text-sm text-ink-soft">{event.time}</p>
                  <p className="mt-1 max-w-[15rem] text-xs text-ink-soft/80">{event.venue}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      {/* ---------- Mobile & tablet: vertical rail ---------- */}
      <ol className="relative mx-auto mt-12 max-w-xl pl-14 lg:hidden">
        <span
          aria-hidden="true"
          className="absolute top-3 bottom-3 left-[1.65rem] w-0.5 rounded-full bg-gradient-to-b from-marigold-400 via-royal-500 to-gold-500 opacity-70"
        />

        {events.map((event, index) => (
          <Reveal key={event.id} variant="left" delay={index * 100}>
            <li className="relative pb-9 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute top-1 -left-14 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${
                  NODE_COLORS[event.theme]
                } shadow-[0_10px_24px_-12px_rgba(107,15,26,0.8)]`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-100 text-xl">
                  {event.icon}
                </span>
              </span>

              <div className="glass-card rounded-2xl px-5 py-4">
                <p className="font-serif-alt text-[0.6rem] tracking-[0.22em] text-marigold-600 uppercase">
                  Step {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold">{event.name}</h3>
                <p className="mt-1 text-sm text-maroon-700">{event.date}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {event.time} · {event.venue}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
