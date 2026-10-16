import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, CircleHelp, Mail, MapPin, Truck } from "lucide-react";
import { getOrderByNumber, getProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ConfettiCheck } from "@/components/order-success";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Thank you for your Tot & Tote order.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ConfirmationPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const orderNumber = typeof sp.n === "string" ? sp.n : null;
  if (!orderNumber) redirect("/shop");

  const data = await getOrderByNumber(orderNumber);
  if (!data) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-sand">
          <CircleHelp className="size-9 text-mute" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold">We can&apos;t find that order</h1>
        <p className="mt-3 text-sm text-mute">
          Double-check the link in your confirmation email — or head back to the shop.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream transition hover:bg-clay"
        >
          Back to the shop
        </Link>
      </div>
    );
  }

  const { order, items } = data;
  const suggestions = (await getProducts({ sort: "rating", limit: 8 }))
    .filter((p) => !items.some((i) => i.productId === p.id))
    .slice(0, 4);

  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
      <ConfettiCheck orderNumber={order.orderNumber} />

      <Reveal className="mt-14" delay={0.1}>
        <div className="overflow-hidden rounded-[2rem] border border-line bg-paper">
          {/* meta strip */}
          <div className="grid gap-4 border-b border-line bg-sand/60 px-6 py-5 sm:grid-cols-3 sm:px-8">
            <div className="flex items-center gap-3">
              <CalendarDays className="size-4 text-clay" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-mute">Ordered</p>
                <p className="text-sm font-semibold">{orderDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="size-4 text-clay" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-mute">Arrives</p>
                <p className="text-sm font-semibold">3–5 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-clay" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-mute">Updates to</p>
                <p className="truncate text-sm font-semibold">{order.email}</p>
              </div>
            </div>
          </div>

          {/* items */}
          <div className="px-6 py-6 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cocoa">
              {itemCount} {itemCount === 1 ? "item" : "items"} in the box
            </p>
            <ul className="mt-4 divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="block h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-mute">
                      {[item.color, item.size && `Size ${item.size}`].filter(Boolean).join(" · ") || "One size"}
                      {" · "}Qty {item.qty}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.priceCents * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <div className="flex justify-between text-cocoa">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-cocoa">
                <span>Shipping</span>
                <span>{order.shippingCents === 0 ? "Free" : formatPrice(order.shippingCents)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <span className="font-bold">Paid</span>
                <span className="font-display text-3xl font-semibold">
                  {formatPrice(order.totalCents)}
                </span>
              </div>
            </div>
          </div>

          {/* address */}
          <div className="flex items-start gap-3 border-t border-line bg-sand/40 px-6 py-5 sm:px-8">
            <MapPin className="mt-0.5 size-4 shrink-0 text-clay" />
            <p className="text-sm leading-relaxed text-cocoa">
              <span className="font-bold text-ink">
                {order.firstName} {order.lastName}
              </span>
              <br />
              {order.address}, {order.city} {order.zip}, {order.country}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.18} className="mt-10 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-bold text-cream transition hover:bg-clay"
        >
          Keep browsing the shelf <ArrowRight className="size-4" />
        </Link>
      </Reveal>

      {suggestions.length > 0 && (
        <div className="mt-20">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-semibold tracking-tight">
              While you&apos;re <span className="italic text-clay">here</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {suggestions.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
