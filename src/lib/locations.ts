import { SALES_PHONE, MOBILE_PHONE } from "./contact";

export interface Store {
  /** Short label used by the store segmented toggle. */
  shortName: string;
  name: string;
  address: string;
  phone: string;
}

export const stores: Store[] = [
  {
    shortName: "4 Jula",
    name: "Centrometal — 4 Jula",
    address: "4 Jula 68, Podgorica",
    phone: SALES_PHONE,
  },
  {
    shortName: "Cetinjski put",
    name: "Centrometal — Cetinjski put",
    address: "Cetinjski put bb, Podgorica",
    phone: MOBILE_PHONE,
  },
];

/**
 * Embedded map for a store. The handoff uses the keyless
 * `maps?q={address}&output=embed` form, which is what the repo already used
 * in LocationsSection — no Maps API key is configured, so this stays as-is.
 */
export function storeMapEmbedUrl(store: Store): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(store.address)}&output=embed`;
}

/** "Navigacija" — opens the address in the user's maps app. */
export function storeDirectionsUrl(store: Store): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;
}
