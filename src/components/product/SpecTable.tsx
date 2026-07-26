import type { Locale } from "@/lib/i18n";
import type { ProductSpec } from "@/lib/products";

/**
 * Handoff: full specification as hairline-divided label/value rows inside a
 * single soft card — the previous bordered <table> with a gray label column
 * is gone. Kept as a real table for semantics.
 */
export function SpecTable({ specs, locale }: { specs: ProductSpec[]; locale: Locale }) {
  return (
    <div className="overflow-hidden rounded-button bg-surface shadow-card lg:bg-fill lg:shadow-none">
      <table className="w-full">
        <tbody className="divide-hairline">
          {specs.map((spec) => (
            <tr
              key={spec.label[locale]}
              className="flex min-h-[46px] items-center justify-between gap-3 px-4 py-2"
            >
              <th
                scope="row"
                className="text-left text-[1.03125rem] font-normal tracking-[-0.015em] text-muted"
              >
                {spec.label[locale]}
              </th>
              <td className="text-[1.03125rem] font-medium tracking-[-0.015em]">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
