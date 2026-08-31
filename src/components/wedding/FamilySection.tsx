import type { FamilyGroup } from "@/types/wedding";
import FamilyMemberCard from "@/components/wedding/FamilyMemberCard";
import FloralDivider from "@/components/decorations/FloralDivider";
import HangingFlowers from "@/components/decorations/HangingFlowers";
import Mandala from "@/components/decorations/Mandala";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

interface FamilySectionProps {
  family: FamilyGroup;
  /** Warm gold for the groom's side, rose for the bride's. */
  accent?: "warm" | "rose";
  /** Set on the first family section so the nav can target it. */
  id?: string;
  /** Alternating surface tint keeps the two family blocks distinct. */
  tone?: "light" | "tinted";
}

/**
 * A family block: the two parents in large portrait cards, followed by a grid of
 * siblings and relatives. Used once for each side of the wedding.
 */
export default function FamilySection({
  family,
  accent = "warm",
  id,
  tone = "light",
}: FamilySectionProps) {
  const headingId = `${family.title.toLowerCase().replace(/[^a-z]+/g, "-")}-heading`;

  const surface =
    tone === "tinted"
      ? "bg-gradient-to-b from-rose-pink-200/35 via-ivory to-cream-100"
      : "bg-gradient-to-b from-cream-100 via-ivory to-marigold-100/45";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24 ${surface}`}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="pattern-mandala absolute inset-0 opacity-45" />
        <Mandala
          className={`absolute h-[28rem] w-[28rem] ${
            accent === "warm" ? "-top-28 -left-32" : "-right-32 -bottom-28"
          }`}
          color={accent === "warm" ? "#c9a227" : "#e75480"}
          opacity={0.1}
        />
      </div>

      <HangingFlowers
        className="h-14 px-2 opacity-70 sm:h-16"
        strands={12}
        tone={accent === "warm" ? "warm" : "cool"}
      />

      <div className="pt-8">
        <SectionHeading
          id={headingId}
          eyebrow="With the blessings of"
          script="Our"
          title={family.title}
          subtitle={family.subtitle}
        />
      </div>

      {/* Parents */}
      <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2 sm:gap-8">
        {family.parents.map((parent, index) => (
          <Reveal key={parent.name} variant={index === 0 ? "left" : "right"} delay={index * 120}>
            <FamilyMemberCard person={parent} size="portrait" accent={accent} />
          </Reveal>
        ))}
      </div>

      {/* Siblings & relatives */}
      <Reveal className="mt-16 text-center">
        <h3 className="font-display text-2xl font-semibold sm:text-3xl">
          {family.title.replace("Family", "Siblings & Family")}
        </h3>
        <FloralDivider className="my-4" />
        <p className="mx-auto max-w-xl text-sm text-ink-soft sm:text-base">
          The people who will be handing out sweets, chasing children and making sure your
          plate is never empty.
        </p>
      </Reveal>

      <div className="mx-auto mt-9 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {family.members.map((member, index) => (
          <Reveal key={member.name} variant="scale" delay={index * 55} className="h-full">
            <FamilyMemberCard person={member} accent={accent} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
