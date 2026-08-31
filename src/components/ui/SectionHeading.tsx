import FloralDivider from "@/components/decorations/FloralDivider";
import Reveal from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  /** Rendered in the script face above the main title. */
  script?: string;
  subtitle?: string;
  /** Light copy for use on the dark maroon sections. */
  tone?: "dark" | "light";
  id?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  script,
  subtitle,
  tone = "dark",
  id,
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <Reveal className="mx-auto max-w-3xl px-2 text-center">
      {eyebrow ? (
        <p className={`eyebrow mb-3 ${light ? "text-gold-300" : ""}`}>{eyebrow}</p>
      ) : null}

      {script ? (
        <p
          className={`font-script text-3xl leading-none sm:text-4xl ${
            light ? "text-marigold-300" : "text-rose-pink-500"
          }`}
        >
          {script}
        </p>
      ) : null}

      <h2
        id={id}
        className={`mt-2 text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl ${
          light ? "text-cream-100" : "festive-text"
        }`}
      >
        {title}
      </h2>

      <FloralDivider tone={light ? "light" : "dark"} className="my-5" />

      {subtitle ? (
        <p
          className={`mx-auto max-w-2xl text-base leading-relaxed sm:text-lg ${
            light ? "text-cream-200/85" : "text-ink-soft"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
