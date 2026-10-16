"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Sparkles, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { FREE_SHIPPING_THRESHOLD_CENTS, cn, formatPrice } from "@/lib/utils";
import { useCart } from "./cart-context";

export function CartDrawer() {
  const { open, setOpen, lines, count, subtotalCents, updateQty, removeLine } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);
  const progress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-ink/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[101] flex w-[min(430px,94vw)] flex-col bg-paper shadow-[0_0_80px_-20px_rgba(34,26,19,0.45)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 330, damping: 34 }}
            role="dialog"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                Your bag{" "}
                <span className="align-middle text-sm font-sans font-semibold text-clay">
                  ({count})
                </span>
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-full border border-line transition hover:rotate-90 hover:border-ink"
                aria-label="Close bag"
              >
                <X className="size-4" />
              </button>
            </div>

            {lines.length > 0 && (
              <div className="border-b border-line bg-cream/70 px-6 py-3.5">
                {remaining > 0 ? (
                  <p className="text-xs font-medium text-cocoa">
                    You&apos;re{" "}
                    <span className="font-bold text-clay">{formatPrice(remaining)}</span> away
                    from free shipping
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-sage">
                    <Sparkles className="size-3.5" /> Free shipping unlocked
                  </p>
                )}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      remaining > 0 ? "bg-clay" : "bg-sage",
                    )}
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid size-16 place-items-center rounded-full bg-cream">
                    <ShoppingBag className="size-7 text-mute" />
                  </div>
                  <p className="mt-4 font-display text-2xl font-medium">
                    Your bag is feeling light
                  </p>
                  <p className="mt-1 max-w-[240px] text-sm text-mute">
                    Fill it with backpacks, totes and tiny shoes they&apos;ll outgrow too fast.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream transition hover:bg-clay"
                  >
                    Start browsing
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40, transition: { duration: 0.22 } }}
                        className="flex gap-4 py-5"
                      >
                        <Link
                          href={`/product/${line.slug}`}
                          onClick={() => setOpen(false)}
                          className="block h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-sand"
                        >
                          <img
                            src={line.image}
                            alt={line.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-ink">
                                {line.name}
                              </p>
                              <p className="mt-0.5 text-xs text-mute">
                                {[line.color, line.size && `Size ${line.size}`]
                                  .filter(Boolean)
                                  .join(" · ") || "One size"}
                              </p>
                            </div>
                            <p className="text-sm font-semibold">
                              {formatPrice(line.priceCents * line.qty)}
                            </p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-line">
                              <button
                                onClick={() => updateQty(line.id, line.qty - 1)}
                                className="grid size-8 place-items-center rounded-full transition hover:bg-cream"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-semibold">
                                {line.qty}
                              </span>
                              <button
                                onClick={() => updateQty(line.id, line.qty + 1)}
                                className="grid size-8 place-items-center rounded-full transition hover:bg-cream"
                                aria-label="Increase quantity"
                              >
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeLine(line.id)}
                              className="grid size-8 place-items-center rounded-full text-mute transition hover:bg-cream hover:text-clay"
                              aria-label="Remove item"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line bg-cream/60 px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cocoa">Subtotal</span>
                  <span className="font-display text-2xl font-semibold">
                    {formatPrice(subtotalCents)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-mute">
                  Shipping &amp; taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="mt-4 block rounded-full bg-ink py-3.5 text-center text-sm font-bold text-cream transition-all hover:bg-clay active:scale-[0.98]"
                >
                  Checkout securely
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-2 w-full py-2 text-center text-xs font-semibold text-cocoa underline-offset-4 hover:underline"
                >
                  or keep shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
