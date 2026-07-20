import { clsx } from "clsx";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  heading,
  subheading,
  align = "left",
  invert = false,
}: {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
  /** For use on dark (navy/steel) section backgrounds instead of the light default. */
  invert?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p
          className={clsx(
            "mb-2 text-label font-semibold uppercase tracking-wide",
            invert ? "text-orange-on-dark" : "text-orange",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Reveal
        as="h2"
        variant="left"
        className={clsx(
          "font-heading text-h2 font-bold",
          invert ? "text-white" : "text-navy",
        )}
      >
        {heading}
      </Reveal>
      {subheading && (
        <p className={clsx("mt-2 max-w-2xl", invert ? "text-white/75" : "text-muted")}>
          {subheading}
        </p>
      )}
    </div>
  );
}
