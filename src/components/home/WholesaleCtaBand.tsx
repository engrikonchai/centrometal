import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import { wholesalePath } from "@/lib/paths";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";

export function WholesaleCtaBand({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <section className="bg-navy py-16 text-white">
      <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-h2 font-bold">{dict.wholesaleCta.heading}</h2>
          <p className="mt-2 max-w-xl text-white/75">{dict.wholesaleCta.body}</p>
        </div>
        <Button href={wholesalePath(locale)} variant="primary" size="lg" className="shrink-0">
          {dict.wholesaleCta.cta}
        </Button>
      </Container>
    </section>
  );
}
