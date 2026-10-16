import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(cents: number): string {
  return usd.format(cents / 100);
}

export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
export const FLAT_SHIPPING_CENTS = 695;

export function shippingFor(
  subtotalCents: number,
): { shippingCents: number; free: boolean } {
  if (subtotalCents <= 0) return { shippingCents: 0, free: true };
  const free = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  return { shippingCents: free ? 0 : FLAT_SHIPPING_CENTS, free };
}

export function orderNumberFrom(id: number): string {
  return `TT-${String(100000 + id)}`;
}
