import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
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
    <html
      lang="sr-ME"
      className={`${barlowCondensed.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-warehouse text-ink">
        <CartProvider>
          <FavoritesProvider>
            <AppShell>{children}</AppShell>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
