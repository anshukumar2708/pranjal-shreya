import WeddingImage from "@/components/ui/WeddingImage";
import type { FamilyGroup, Partner } from "@/types/wedding";
import FloralDivider from "@/components/decorations/FloralDivider";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface FamilyTreeProps {
  groom: Partner;
  bride: Partner;
  groomFamily: FamilyGroup;
  brideFamily: FamilyGroup;
}

type Accent = "warm" | "rose";

const ACCENTS: Record<Accent, { ring: string; dot: string; label: string }> = {
  warm: {
    ring: "from-marigold-300 via-marigold-500 to-royal-500",
    dot: "bg-marigold-400",
    label: "text-marigold-600",
  },
  rose: {
    ring: "from-rose-pink-200 via-rose-pink-500 to-maroon-600",
    dot: "bg-rose-pink-400",
    label: "text-rose-pink-600",
  },
};

/** Circular portrait node used at every level of the tree. */
function TreeNode({
  src,
  alt,
  name,
  role,
  accent,
  size = "md",
  className = "w-24 sm:w-28",
}: {
  src: string;
  alt: string;
  name: string;
  role: string;
  accent: Accent;
  size?: "sm" | "md" | "lg";
  /** Width of the whole node, so it can fill a grid cell. */
  className?: string;
}) {
  const dimension = size === "lg" ? "w-28 sm:w-32" : size === "md" ? "w-20 sm:w-24" : "w-14 sm:w-16";
  const theme = ACCENTS[accent];

  return (
    <figure className={`flex flex-col items-center text-center ${className}`}>
      <div className="relative">
        <span
          aria-hidden="true"
          className={`absolute -inset-1 rounded-full bg-gradient-to-br ${theme.ring} opacity-85`}
        />
        <span aria-hidden="true" className="absolute -inset-px rounded-full bg-cream-100" />
        <div
          className={`relative aspect-square overflow-hidden rounded-full border-2 border-cream-100 shadow-petal ${dimension}`}
        >
          <WeddingImage
            src={src}
            alt={alt}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 112px, 128px"
            className="object-cover"
          />
        </div>
        {/* Tiny blossom tucked at the base of each node */}
        <span
          aria-hidden="true"
          className={`absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full ${theme.dot} ring-2 ring-cream-100`}
        />
      </div>

      <figcaption className="mt-2.5">
        <span className="block font-display text-sm leading-tight font-semibold text-maroon-800 sm:text-base">
          {name}
        </span>
        <span
          className={`mt-0.5 block font-serif-alt text-[0.5rem] tracking-[0.16em] uppercase sm:text-[0.55rem] ${theme.label}`}
        >
          {role}
        </span>
      </figcaption>
    </figure>
  );
}

/** Decorative vine that links one generation to the next. */
function Connector({ accent }: { accent: Accent }) {
  const stroke = accent === "warm" ? "#c9a227" : "#e75480";

  return (
    <svg
      aria-hidden="true"
      role="presentation"
      viewBox="0 0 120 60"
      className="h-10 w-24 sm:h-12 sm:w-28"
      fill="none"
    >
      <path
        d="M60 0v18M60 18c-18 0-24 8-24 20M60 18c18 0 24 8 24 20"
        stroke={stroke}
        strokeWidth="1.4"
        opacity="0.65"
        strokeLinecap="round"
      />
      <path d="M52 26c5-6 11-6 15 0-5 6-11 6-15 0Z" fill="#2e6b4f" opacity="0.6" />
      <circle cx="60" cy="14" r="3.5" fill={stroke} opacity="0.85" />
      <circle cx="36" cy="40" r="2.6" fill={stroke} opacity="0.7" />
      <circle cx="84" cy="40" r="2.6" fill={stroke} opacity="0.7" />
    </svg>
  );
}

function FamilyBranch({
  family,
  partner,
  accent,
}: {
  family: FamilyGroup;
  partner: Partner;
  accent: Accent;
}) {
  // Show the closest relatives; the full list lives in the family sections above.
  const relatives = family.members.slice(0, 4);

  return (
    <Reveal variant={accent === "warm" ? "left" : "right"} className="h-full">
      <div className="glass-card relative flex h-full flex-col items-center rounded-[2rem] px-4 py-9 sm:px-8 sm:py-11">
        <p className="eyebrow text-[0.6rem]">{family.title}</p>
        <FloralDivider className="mt-3 mb-6 w-40" />

        {/* Generation 1 — parents */}
        <div className="flex items-start justify-center gap-3 sm:gap-6">
          <TreeNode
            src={family.parents[0].image}
            alt={family.parents[0].alt}
            name={family.parents[0].name}
            role={family.parents[0].role}
            accent={accent}
            size="md"
          />
          <span
            aria-hidden="true"
            className="mt-8 font-script text-2xl text-maroon-600 sm:mt-9 sm:text-3xl"
          >
            &amp;
          </span>
          <TreeNode
            src={family.parents[1].image}
            alt={family.parents[1].alt}
            name={family.parents[1].name}
            role={family.parents[1].role}
            accent={accent}
            size="md"
          />
        </div>

        <Connector accent={accent} />

        {/* Generation 2 — the bride or groom */}
        <TreeNode
          src={partner.image}
          alt={partner.alt}
          name={partner.name}
          role={partner.title}
          accent={accent}
          size="lg"
        />

        <Connector accent={accent} />

        {/* Generation 3 — closest relatives */}
        <div className="grid w-full grid-cols-4 items-start gap-x-1 gap-y-4 sm:gap-x-2">
          {relatives.map((relative) => (
            <TreeNode
              key={relative.name}
              src={relative.image}
              alt={relative.alt}
              name={relative.name}
              role={relative.role}
              accent={accent}
              size="sm"
              className="w-full"
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/**
 * Both family lines shown side by side — parents, then the bride or groom, then
 * the closest relatives, linked by floral vines rather than org-chart boxes.
 */
export default function FamilyTree({
  groom,
  bride,
  groomFamily,
  brideFamily,
}: FamilyTreeProps) {
  return (
    <section
      aria-labelledby="family-tree-heading"
      className="relative overflow-hidden bg-gradient-to-b from-marigold-100/50 via-ivory to-rose-pink-200/30 px-4 py-20 sm:px-6 sm:py-24"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-diamond absolute inset-0 opacity-45" />
        <Mandala
          className="absolute top-1/2 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2"
          opacity={0.08}
        />
      </div>

      <SectionHeading
        id="family-tree-heading"
        eyebrow="Two roots, one garland"
        script="Our"
        title="Family Tree"
        subtitle="Every wedding is really two families deciding to become one. Here is how both sides connect."
      />

      <div className="mx-auto mt-12 grid max-w-6xl items-stretch gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <FamilyBranch family={groomFamily} partner={groom} accent="warm" />

        {/* Central knot joining the two branches */}
        <Reveal variant="scale" delay={120} className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <span
              aria-hidden="true"
              className="hidden h-24 w-px bg-gradient-to-b from-transparent to-gold-500/60 lg:block"
            />
            <span className="relative my-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/50 bg-cream-100 shadow-gold sm:h-20 sm:w-20">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#c9a227,#e75480,#ff7a00,#c9a227)] opacity-45 blur-[3px] motion-safe:animate-[spin_24s_linear_infinite]"
              />
              <span aria-hidden="true" className="relative text-2xl sm:text-3xl">
                🌸
              </span>
            </span>
            <span
              aria-hidden="true"
              className="hidden h-24 w-px bg-gradient-to-t from-transparent to-gold-500/60 lg:block"
            />
          </div>
        </Reveal>

        <FamilyBranch family={brideFamily} partner={bride} accent="rose" />
      </div>
    </section>
  );
}
