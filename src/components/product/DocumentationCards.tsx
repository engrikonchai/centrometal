import { ExternalLink, FileText } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";
import type { Product } from "@/lib/products";

/**
 * Handoff: "Dokumentacija" as a 2-column grid of icon cards, explicitly not a
 * settings-style link list.
 *
 * NOTE: no product in the current catalogue sets `specPdfUrl` or
 * `manufacturerUrl`, so this section renders for nothing today — it lights up
 * as soon as those fields are populated in Sanity.
 */
export function DocumentationCards({
  product,
  locale,
  layout = "grid",
}: {
  product: Product;
  locale: Locale;
  /**
   * "grid" is the mobile treatment (2-col stacked icon cards under an H2).
   * "inline" is the desktop one: a row of 46px pill links under a small
   * uppercase caption, sitting in the product's detail column.
   */
  layout?: "grid" | "inline";
}) {
  const dict = getDictionary(locale);

  const docs = [
    product.specPdfUrl && {
      href: product.specPdfUrl,
      label: dict.product.specSheetLabel,
      Icon: FileText,
    },
    product.manufacturerUrl && {
      href: product.manufacturerUrl,
      label: dict.product.manufacturerLinkLabel,
      Icon: ExternalLink,
    },
  ].filter((doc): doc is { href: string; label: string; Icon: typeof FileText } => Boolean(doc));

  if (docs.length === 0) return null;

  if (layout === "inline") {
    return (
      <section>
        <p className="mb-2.5 text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-muted">
          {dict.product.docsHeading}
        </p>
        <div className="flex flex-wrap gap-3">
          {docs.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[46px] items-center gap-2.5 rounded-xl bg-fill px-[18px] text-[0.90625rem] font-semibold text-ink transition hover:bg-[#eeeff1]"
            >
              <Icon className="size-[17px] shrink-0 text-teal" strokeWidth={1.9} aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-2.5 text-h2 font-bold">{dict.product.docsHeading}</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {docs.map(({ href, label, Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-3.5 rounded-button bg-surface p-3.5 text-ink shadow-card transition hover:shadow-[0_4px_12px_rgba(17,21,26,0.1)]"
          >
            <Icon className="size-5 text-teal-ink" strokeWidth={1.9} aria-hidden="true" />
            <span className="text-[0.90625rem] font-semibold leading-[1.3] tracking-[-0.015em]">
              {label}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
