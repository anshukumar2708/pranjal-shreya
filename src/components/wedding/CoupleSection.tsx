import WeddingImage from "@/components/ui/WeddingImage";
import type { Partner } from "@/types/wedding";
import FlowerCorner from "@/components/decorations/FlowerCorner";
import FloralDivider from "@/components/decorations/FloralDivider";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface CoupleSectionProps {
  groom: Partner;
  bride: Partner;
}

function PartnerCard({
  partner,
  icon,
  accent,
  variant,
}: {
  partner: Partner;
  icon: string;
  accent: "warm" | "rose";
  variant: "left" | "right";
}) {
  const ring =
    accent === "warm"
      ? "from-marigold-400 via-marigold-500 to-royal-500"
      : "from-rose-pink-400 via-rose-pink-500 to-maroon-600";

  return (
    <Reveal variant={variant} className="h-full">
      <article className="glass-card group relative flex h-full flex-col items-center overflow-hidden rounded-[2rem] px-5 py-10 text-center transition-shadow duration-500 hover:shadow-[0_36px_80px_-40px_rgba(107,15,26,0.75)] sm:px-8 sm:py-12">
        <FlowerCorner position="tl" className="absolute top-1 left-1 h-16 w-16 opacity-70 sm:h-20 sm:w-20" />
        <FlowerCorner position="br" className="absolute right-1 bottom-1 h-16 w-16 opacity-70 sm:h-20 sm:w-20" />

        <div className="relative">
          <span
            aria-hidden="true"
            className={`absolute -inset-2 rounded-full bg-gradient-to-br ${ring} opacity-80 blur-[1px]`}
          />
          <span aria-hidden="true" className="absolute -inset-0.5 rounded-full bg-cream-100" />

          <div className="relative aspect-square w-40 overflow-hidden rounded-full border-[3px] border-cream-100 shadow-petal sm:w-48 lg:w-56">
            <WeddingImage
              src={partner.image}
              alt={partner.alt}
              fill
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, 224px"
              loading="lazy"
              className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
            />
          </div>

          <span
            aria-hidden="true"
            className="absolute -right-1 -bottom-1 flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/50 bg-cream-100 text-lg shadow-md sm:h-12 sm:w-12 sm:text-xl"
          >
            {icon}
          </span>
        </div>

        <p className="eyebrow mt-6 text-[0.62rem]">{partner.title}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl lg:text-4xl">
          {partner.name}
        </h3>

        <FloralDivider className="my-4" />

        <p className="max-w-sm text-sm leading-relaxed text-ink-soft sm:text-base">
          {partner.bio}
        </p>

        <dl className="mt-7 grid w-full max-w-xs grid-cols-2 gap-3 border-t border-gold-500/30 pt-5">
          <div>
            <dt className="font-serif-alt text-[0.6rem] tracking-[0.2em] text-marigold-600 uppercase">
              Father
            </dt>
            <dd className="mt-1 font-display text-base font-semibold text-maroon-800 sm:text-lg">
              {partner.father}
            </dd>
          </div>
          <div>
            <dt className="font-serif-alt text-[0.6rem] tracking-[0.2em] text-marigold-600 uppercase">
              Mother
            </dt>
            <dd className="mt-1 font-display text-base font-semibold text-maroon-800 sm:text-lg">
              {partner.mother}
            </dd>
          </div>
        </dl>
      </article>
    </Reveal>
  );
}

export default function CoupleSection({ groom, bride }: CoupleSectionProps) {
  return (
    <section
      id="couple"
      aria-labelledby="couple-heading"
      className="relative overflow-hidden bg-gradient-to-b from-ivory via-cream-100 to-marigold-100/50 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Mandala className="absolute top-10 -left-32 h-[24rem] w-[24rem]" opacity={0.1} />
        <Mandala
          className="absolute -right-32 bottom-10 h-[24rem] w-[24rem]"
          color="#c1121f"
          opacity={0.09}
        />
      </div>

      <SectionHeading
        id="couple-heading"
        eyebrow="The Beginning"
        script="Meet the"
        title="Bride & Groom"
        subtitle="Two families, two stories, and one very long love of good food — here are the people this celebration belongs to."
      />

      <div className="mx-auto mt-12 grid max-w-6xl items-stretch gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <PartnerCard partner={groom} icon="🤵🏽" accent="warm" variant="left" />

        {/* Central ornament — becomes a horizontal divider on mobile */}
        <Reveal variant="scale" delay={150} className="flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <span
              aria-hidden="true"
              className="hidden w-px flex-1 bg-gradient-to-b from-transparent via-gold-500/60 to-transparent lg:block lg:h-32"
            />
            <span className="relative my-3 flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/50 bg-cream-100 shadow-gold sm:h-24 sm:w-24">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#c9a227,#ff7a00,#c1121f,#c9a227)] opacity-50 blur-[3px] motion-safe:animate-[spin_20s_linear_infinite]"
              />
              <span className="relative font-script text-4xl text-maroon-700 sm:text-5xl">&amp;</span>
            </span>
            <span
              aria-hidden="true"
              className="hidden w-px flex-1 bg-gradient-to-b from-transparent via-gold-500/60 to-transparent lg:block lg:h-32"
            />
            <FloralDivider className="w-48 lg:hidden" />
          </div>
        </Reveal>

        <PartnerCard partner={bride} icon="👰🏽" accent="rose" variant="right" />
      </div>
    </section>
  );
}
