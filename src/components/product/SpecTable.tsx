import type { Locale } from "@/lib/i18n";
import type { ProductSpec } from "@/lib/products";

export function SpecTable({ specs, locale }: { specs: ProductSpec[]; locale: Locale }) {
  return (
    <div className="overflow-hidden rounded-button border border-line">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, i) => (
            <tr key={spec.label[locale]} className={i > 0 ? "border-t border-line" : undefined}>
              <th
                scope="row"
                className="w-2/5 bg-warehouse px-4 py-2.5 text-left font-semibold text-navy"
              >
                {spec.label[locale]}
              </th>
              <td className="px-4 py-2.5 text-ink">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
