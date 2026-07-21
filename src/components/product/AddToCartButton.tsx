"use client";

import type { Product } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "../ui/Button";

/** Client leaf for the product detail page (a Server Component) — isolates the useCart() hook to one small island. */
export function AddToCartButton({
  product,
  label,
  addedLabel,
}: {
  product: Product;
  label: string;
  addedLabel: string;
}) {
  const { add } = useCart();

  return (
    <Button variant="accent" size="lg" onClick={() => add(product, addedLabel)}>
      {label}
    </Button>
  );
}
