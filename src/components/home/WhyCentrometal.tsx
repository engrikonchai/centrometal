import { BadgeCheck, MapPin, Store, Wrench } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

// Ordered to match dict.why.points: distributor badge, wholesale/retail, service, locations.
const icons = [BadgeCheck, Store, Wrench, MapPin];

export function WhyCentrometal({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="workshop-texture bg-steel py-16 text-white sm:py-24">
      <Container>
        <SectionHeading heading={dict.why.heading} invert />
        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {dict.why.points.map((point, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={point.title} delay={(i % 4) * 75} className="h-full">
                <div className="flex h-full flex-col rounded-button border border-white/15 bg-white/[0.07] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-on-dark hover:bg-white/10 sm:border-white/10 sm:bg-white/5 sm:p-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-teal/20">
                    <Icon className="size-6 text-teal-on-dark" strokeWidth={1.75} aria-hidden="true" />
                  </span>
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
