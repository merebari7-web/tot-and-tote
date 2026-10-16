"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Lock, PackageOpen, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { cn, formatPrice, shippingFor } from "@/lib/utils";
import { useCart } from "@/components/cart-context";

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "Other"];

const STEPS = ["Bag", "Details", "Done"];

export function CheckoutView() {
  const router = useRouter();
  const { lines, subtotalCents, ready, refresh } = useCart();
  const [fields, setFields] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { shippingCents, free } = shippingFor(subtotalCents);
  const total = subtotalCents + shippingCents;

  const set = (key: keyof typeof fields) => (e: { target: { value: string } }) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Checkout failed — please try again");
        setSubmitting(false);
        return;
      }
      await refresh();
      router.push(`/order/confirmation?n=${encodeURIComponent(data.orderNumber)}`);
    } catch {
      setError("Network error — please try again");
      setSubmitting(false);
    }
  };

  if (ready && lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-sand">
          <PackageOpen className="size-9 text-mute" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold">Nothing to wrap up yet</h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          Your bag is empty. Wander the shelves, find something lovely, then come back
          and we&apos;ll pack it with care.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-bold text-cream transition hover:bg-clay-deep"
        >
          Browse the shop <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-mute transition hover:text-clay"
      >
        <ArrowLeft className="size-3.5" /> Keep shopping
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Almost <span className="italic text-clay">yours</span>
        </h1>
        <div className="flex items-center gap-2">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold",
                  i === 1 ? "bg-ink text-cream" : "border border-line bg-paper text-mute",
                )}
              >
                {i < 1 && <Check className="size-3 text-sage" />}
                {step}
              </span>
              {i < STEPS.length - 1 && <span className="h-px w-5 bg-line" />}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={submit} className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr,410px]">
        <div className="space-y-8">
          {/* contact */}
          <section className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
              <span className="grid size-8 place-items-center rounded-full bg-clay text-sm text-cream">1</span>
              Who&apos;s it for?
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cocoa">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={fields.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className="field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cocoa">
                  First name
                </label>
                <input required value={fields.firstName} onChange={set("firstName")} placeholder="Jordan" className="field" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cocoa">
                  Last name
                </label>
                <input required value={fields.lastName} onChange={set("lastName")} placeholder="Rivera" className="field" />
              </div>
            </div>
          </section>

          {/* shipping */}
          <section className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
              <span className="grid size-8 place-items-center rounded-full bg-clay text-sm text-cream">2</span>
              Where&apos;s it going?
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cocoa">
                  Street address
                </label>
                <input required value={fields.address} onChange={set("address")} placeholder="14 Rowan Lane, Apt 2" className="field" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cocoa">
                  City
                </label>
                <input required value={fields.city} onChange={set("city")} placeholder="Portland" className="field" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cocoa">
                  ZIP / Postcode
                </label>
                <input required value={fields.zip} onChange={set("zip")} placeholder="97205" className="field" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cocoa">
                  Country
                </label>
                <select value={fields.country} onChange={set("country")} className="field">
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-cocoa">
                  Phone <span className="font-medium normal-case text-mute">(optional)</span>
                </label>
                <input value={fields.phone} onChange={set("phone")} placeholder="+1 555 000 1234" className="field" />
              </div>
            </div>
          </section>

          {/* payment (demo) */}
          <section className="rounded-3xl border border-dashed border-clay/40 bg-clay/5 p-6 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold">
              <span className="grid size-8 place-items-center rounded-full bg-clay text-sm text-cream">3</span>
              Payment
            </h2>
            <div className="mt-5 flex items-start gap-3.5 rounded-2xl bg-paper p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sage/15 text-sage">
                <Lock className="size-4" />
              </span>
              <p className="text-sm leading-relaxed text-cocoa">
                This demo storefront keeps things simple — no card details needed.
                Placing your order creates a real order in the shop&apos;s database and
                adjusts shelf stock instantly.
              </p>
            </div>
          </section>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl bg-clay/10 px-5 py-4 text-sm font-semibold text-clay"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* summary */}
        <aside className="sticky top-24 rounded-3xl border border-line bg-paper p-6">
          <h2 className="font-display text-2xl font-semibold">The bag, at a glance</h2>
          <ul className="mt-5 space-y-4">
            {lines.map((line) => (
              <li key={line.id} className="flex items-center gap-3.5">
                <span className="relative block h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                  <img src={line.image} alt={line.name} className="h-full w-full object-cover" />
                  <span className="absolute -right-0 -top-0 grid size-5 place-items-center rounded-bl-xl bg-ink text-[10px] font-bold text-cream">
                    {line.qty}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{line.name}</span>
                  <span className="block text-xs text-mute">
                    {[line.color, line.size && `Size ${line.size}`].filter(Boolean).join(" · ") || "One size"}
                  </span>
                </span>
                <span className="text-sm font-semibold">
                  {formatPrice(line.priceCents * line.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-cocoa">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5 text-cocoa">
                <Truck className="size-3.5" /> Shipping
              </span>
              {free ? (
                <span className="font-bold text-sage">Free</span>
              ) : (
                <span className="font-semibold">{formatPrice(shippingCents)}</span>
              )}
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <span className="font-bold">Total</span>
              <span className="font-display text-3xl font-semibold">{formatPrice(total)}</span>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={submitting || !ready || lines.length === 0}
            whileTap={{ scale: 0.98 }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-clay py-4 text-sm font-bold text-cream shadow-[0_16px_36px_-12px_rgba(217,89,43,0.65)] transition hover:bg-clay-deep disabled:opacity-60"
          >
            {submitting ? (
              <>
                <motion.span
                  className="size-4 rounded-full border-2 border-cream/40 border-t-cream"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                />
                Placing your order…
              </>
            ) : (
              <>
                Place order · {formatPrice(total)} <ArrowRight className="size-4" />
              </>
            )}
          </motion.button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-mute">
            <Lock className="size-3" /> Encrypted &amp; PCI-friendly demo checkout
          </p>
        </aside>
      </form>
    </div>
  );
}
