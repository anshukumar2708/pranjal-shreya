import WeddingImage from "@/components/ui/WeddingImage";
import type { StoryMoment } from "@/types/wedding";
import FloatingPetals from "@/components/decorations/FloatingPetals";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface StorySectionProps {
  moments: StoryMoment[];
}

/**
 * A romantic zig-zag timeline. On desktop the cards alternate around a central
 * rail; below `lg` everything collapses to a single left-aligned column.
 */
export default function StorySection({ moments }: StorySectionProps) {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="relative overflow-hidden bg-gradient-to-b from-rose-pink-200/40 via-ivory to-cream-100 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-diamond absolute inset-0 opacity-40" />
        <Mandala
          className="absolute -top-24 -right-28 h-[26rem] w-[26rem]"
          color="#e75480"
          opacity={0.12}
        />
      </div>

      <FloatingPetals count={10} />

      <SectionHeading
        id="story-heading"
        eyebrow="How we got here"
        script="Our"
        title="Love Story"
        subtitle="It started with a disagreement about buildings and ended with a wedding invitation. Here is everything in between."
      />

      <ol className="relative mx-auto mt-14 max-w-4xl pl-14 lg:pl-0">
        {/* Rail — left on mobile, centred on desktop */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[1.65rem] w-0.5 rounded-full bg-gradient-to-b from-rose-pink-400 via-marigold-400 to-maroon-600 opacity-70 lg:left-1/2 lg:-translate-x-1/2"
        />

        {moments.map((moment, index) => {
          const isRight = index % 2 === 1;

          return (
            <Reveal
              key={moment.id}
              variant={isRight ? "right" : "left"}
              delay={index * 70}
            >
              <li className="relative pb-10 last:pb-0 lg:flex lg:items-center lg:pb-14">
                {/* Node */}
                <span
                  aria-hidden="true"
                  className="absolute top-1 -left-14 z-10 flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/50 bg-cream-100 shadow-[0_10px_26px_-14px_rgba(107,15,26,0.8)] lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
                >
                  <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#f2789f,#f9a620,#c1121f,#f2789f)] opacity-40 blur-[2px]" />
                  <span className="relative text-xl">{moment.icon}</span>
                </span>

                {/* Card — alternates sides on desktop */}
                <div
                  className={`lg:w-[calc(50%-3rem)] ${
                    isRight ? "lg:ml-auto lg:pl-4" : "lg:mr-auto lg:pr-4 lg:text-right"
                  }`}
                >
                  <div className="glass-card group relative overflow-hidden rounded-2xl transition-transform duration-500 hover:-translate-y-1">
                    {moment.image ? (
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <WeddingImage
                          src={moment.image}
                          alt={moment.alt ?? ""}
                          fill
                          loading="lazy"
                          sizes="(max-width: 1024px) 92vw, 420px"
                          style={{ objectPosition: moment.focus }}
                          className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                        />
                        {/* Warm wash at the foot of the photo, so the date below
                            it never sits against a bright patch of sky. */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-maroon-900/30 via-transparent to-transparent"
                        />
                      </div>
                    ) : null}

                    <div className="px-5 py-5 sm:px-7 sm:py-6">
                      <p className="font-serif-alt text-[0.62rem] tracking-[0.24em] text-marigold-600 uppercase">
                        {moment.date}
                      </p>
                      <h3 className="mt-2 font-display text-xl font-semibold sm:text-2xl">
                        {moment.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                        {moment.description}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
