import { BadgeCheck, Store, Truck, Wrench } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const icons = [BadgeCheck, Truck, Wrench, Store];

export function WhyCentrometal({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="bg-steel py-16 text-white sm:py-24">
      <Container>
        <SectionHeading heading={dict.why.heading} invert />
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {dict.why.points.map((point, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={point.title} delay={(i % 4) * 75} className="relative overflow-hidden">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 -left-1 select-none font-heading text-7xl font-bold text-white/10"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative">
                  <Icon className="size-8 text-teal" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-4 font-heading text-h3 font-semibold">{point.title}</h3>
                  <p className="mt-2 text-sm text-white/75">{point.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
