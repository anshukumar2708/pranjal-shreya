import WeddingImage from "@/components/ui/WeddingImage";
import type { Person } from "@/types/wedding";
import FlowerCorner from "@/components/decorations/FlowerCorner";

interface FamilyMemberCardProps {
  person: Person;
  /** `portrait` is the larger parent card; `compact` is the sibling/relative grid card. */
  size?: "portrait" | "compact";
  accent?: "warm" | "rose";
}

/**
 * Reusable framed family portrait, used for parents, siblings and relatives alike.
 */
export default function FamilyMemberCard({
  person,
  size = "compact",
  accent = "warm",
}: FamilyMemberCardProps) {
  const portrait = size === "portrait";

  const ring =
    accent === "warm"
      ? "from-marigold-300 via-marigold-500 to-royal-500"
      : "from-rose-pink-200 via-rose-pink-500 to-maroon-600";

  return (
    <article
      className={`group glass-card relative flex flex-col items-center overflow-hidden rounded-[1.5rem] text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_34px_70px_-40px_rgba(107,15,26,0.8)] ${
        portrait ? "px-5 py-8 sm:px-7 sm:py-10" : "px-3 py-6 sm:px-4"
      }`}
    >
      {portrait ? (
        <>
          <FlowerCorner position="tl" className="absolute top-1 left-1 h-14 w-14 opacity-70" />
          <FlowerCorner position="br" className="absolute right-1 bottom-1 h-14 w-14 opacity-70" />
        </>
      ) : null}

      <div className="relative">
        <span
          aria-hidden="true"
          className={`absolute -inset-1.5 rounded-full bg-gradient-to-br ${ring} opacity-80`}
        />
        <span aria-hidden="true" className="absolute -inset-px rounded-full bg-cream-100" />

        <div
          className={`relative aspect-square overflow-hidden rounded-full border-2 border-cream-100 shadow-petal ${
            portrait ? "w-32 sm:w-40 lg:w-44" : "w-20 sm:w-24"
          }`}
        >
          <WeddingImage
            src={person.image}
            alt={person.alt}
            fill
            loading="lazy"
            sizes={portrait ? "(max-width: 640px) 128px, 176px" : "(max-width: 640px) 80px, 96px"}
            style={{ objectPosition: person.focus }}
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
          />
        </div>
      </div>

      <h4
        className={`mt-4 font-display font-semibold text-maroon-800 ${
          portrait ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
        }`}
      >
        {person.name}
      </h4>

      <p
        className={`mt-1 font-serif-alt tracking-[0.16em] text-marigold-600 uppercase ${
          portrait ? "text-[0.65rem]" : "text-[0.55rem]"
        }`}
      >
        {person.role}
      </p>

      {person.note && portrait ? (
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">{person.note}</p>
      ) : null}

      <span
        aria-hidden="true"
        className="mt-3 block h-px w-10 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
      />
    </article>
  );
}
