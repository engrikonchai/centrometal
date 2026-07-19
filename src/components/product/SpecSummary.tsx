import type { Locale } from "@/lib/i18n";
import type { ProductSpec } from "@/lib/products";

/** Compact preview of the first few spec rows, shown near the top of the PDP info panel. */
export function SpecSummary({ specs, locale }: { specs: ProductSpec[]; locale: Locale }) {
  return (
    <div className="flex flex-wrap gap-2">
      {specs.slice(0, 3).map((spec) => (
        <span
          key={spec.label[locale]}
          className="inline-flex items-center rounded-full border border-line bg-warehouse px-3 py-1 text-xs font-medium text-ink"
        >
          <span className="text-muted">{spec.label[locale]}:</span>&nbsp;{spec.value}
        </span>
      ))}
    </div>
  );
}
