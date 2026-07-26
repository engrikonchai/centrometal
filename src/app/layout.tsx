import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

/**
 * The redesign uses one system stack for headings and body
 * (-apple-system / SF Pro Text first). Inter is loaded only as the webfont
 * fallback for non-Apple platforms — see --font-body in globals.css, where
 * it sits after the system faces. Barlow Condensed is gone with the old
 * display-heading treatment.
 *
 * Montenegrin needs latin-ext for č/ć/š/ž/đ. Weights match the handoff:
 * 400 body, 500 body emphasis, 600 UI labels/buttons, 700 headings.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Centrometal — Alati, mašine i oprema | Podgorica, Crna Gora",
    template: "%s | Centrometal",
  },
  description:
    "Centrometal D.O.O. — ovlašćeni distributer i prodavac alata, mašina i baštenske opreme u Podgorici. Bosch, Makita, Einhell, Telwin i preko 30 brendova.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr-ME" className={`${inter.variable} h-full antialiased`}>
      {/* Background/typography now come from the body rule in globals.css so
          the mobile (#f2f2f7) and desktop (white) tones can differ. */}
      <body className="flex min-h-full flex-col text-ink">
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
