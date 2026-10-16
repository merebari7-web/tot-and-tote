import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout-view";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Wrap up your Tot & Tote order.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
