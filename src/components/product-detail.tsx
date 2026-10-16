"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Leaf,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Product } from "@/db/schema";
import { cn, formatPrice, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/utils";
import { useCart } from "@/components/cart-context";
import { RatingStars } from "@/components/product-card";

function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-bold"
      >
        {title}
        <ChevronDown
          className={cn("size-4 text-mute transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-cocoa">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductDetail({ product, categoryName }: { product: Product; categoryName: string }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0]?.name ?? null);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSizes = !!product.sizes && product.sizes.length > 0;
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 20;
  const freeShip = product.priceCents * qty >= FREE_SHIPPING_THRESHOLD_CENTS;

  const handleAdd = async () => {
    setError(null);
    if (hasSizes && !size) {
      setError("Pick a size first — little feet are particular.");
      return;
    }
    setAdding(true);
    const res = await add({
      slug: product.slug,
      size: hasSizes ? size : null,
      color,
      qty,
    });
    setAdding(false);
    if (!res.ok) {
      setError(res.error ?? "Could not add to bag");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const savings = product.compareAtCents ? product.compareAtCents - product.priceCents : 0;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">{categoryName}</p>
      <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl">
        {product.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <RatingStars rating={product.rating} size="size-4" />
        <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
        <span className="h-1 w-1 rounded-full bg-mute" />
        <span className="text-sm text-mute">{product.reviewsCount} doorstep reviews</span>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-display text-3xl font-semibold">
          {formatPrice(product.priceCents)}
        </span>
        {product.compareAtCents && (
          <>
            <span className="text-lg text-mute line-through">
              {formatPrice(product.compareAtCents)}
            </span>
            <span className="rounded-full bg-clay/10 px-2.5 py-1 text-xs font-bold text-clay">
              Save {formatPrice(savings)}
            </span>
          </>
        )}
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-cocoa">{product.description}</p>

      {/* colors */}
      {product.colors.length > 0 && (
        <div className="mt-7">
          <p className="text-sm font-bold">
            Colour{" "}
            <span className="ml-1 font-medium text-mute">
              — {color ?? "choose one"}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                title={c.name}
                aria-label={`Colour ${c.name}`}
                aria-pressed={color === c.name}
                className={cn(
                  "size-9 rounded-full border border-ink/15 transition-all",
                  color === c.name
                    ? "scale-110 ring-2 ring-ink ring-offset-2 ring-offset-cream"
                    : "hover:scale-105",
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* sizes */}
      {hasSizes && (
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">
              Size <span className="ml-1 font-medium text-mute">(US kids)</span>
            </p>
            <span className="text-xs font-semibold text-clay">True to size</span>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-9">
            {product.sizes!.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setError(null);
                }}
                aria-pressed={size === s}
                className={cn(
                  "rounded-xl border px-2 py-2.5 text-[13px] font-bold transition-all active:scale-95",
                  size === s
                    ? "border-ink bg-ink text-cream shadow-md"
                    : "border-line bg-paper text-cocoa hover:border-ink/40",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* stock + qty + add */}
      <div className="mt-8">
        <div className="flex items-center gap-2 text-xs font-bold">
          {outOfStock ? (
            <span className="rounded-full bg-mute/15 px-3 py-1.5 text-mute">Sold out — back soon</span>
          ) : lowStock ? (
            <span className="rounded-full bg-clay/10 px-3 py-1.5 text-clay">
              Only {product.stock} left on the shelf
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-sage/15 px-3 py-1.5 text-sage">
              <span className="size-1.5 rounded-full bg-sage" /> In stock, ships tomorrow
            </span>
          )}
          {freeShip && !outOfStock && (
            <span className="rounded-full bg-butter/20 px-3 py-1.5 text-[#8a5a00]">
              Ships free
            </span>
          )}
        </div>

        <div className="mt-4 flex items-stretch gap-3">
          <div className="flex items-center rounded-full border border-line bg-paper">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid size-12 place-items-center rounded-full transition hover:bg-cream disabled:opacity-40"
              disabled={qty <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center font-display text-lg font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="grid size-12 place-items-center rounded-full transition hover:bg-cream"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <motion.button
            onClick={handleAdd}
            disabled={outOfStock || adding}
            whileTap={{ scale: 0.97 }}
            animate={error ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2.5 rounded-full text-sm font-bold transition-all disabled:cursor-not-allowed",
              added
                ? "bg-sage text-cream"
                : "bg-clay text-cream shadow-[0_16px_36px_-12px_rgba(217,89,43,0.65)] hover:bg-clay-deep",
              outOfStock && "bg-mute/30 shadow-none",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2"
                >
                  <Check className="size-4" /> In your bag!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="size-4" />
                  {adding ? "Adding…" : outOfStock ? "Sold out" : "Add to bag"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-sm font-semibold text-clay"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* trust row */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
          { icon: Truck, label: `Free over ${formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}` },
          { icon: RotateCcw, label: "30-day returns" },
          { icon: ShieldCheck, label: "2-year guarantee" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-paper px-2 py-3.5 text-center"
          >
            <Icon className="size-4 text-clay" />
            <span className="text-[11px] font-bold text-cocoa">{label}</span>
          </div>
        ))}
      </div>

      {/* accordions */}
      <div className="mt-8 border-t border-line">
        <Accordion title="Details & materials" defaultOpen>
          <ul className="space-y-1.5">
            {product.details.split("\n").map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <Leaf className="mt-0.5 size-3.5 shrink-0 text-sage" />
                {line}
              </li>
            ))}
          </ul>
        </Accordion>
        <Accordion title="Shipping & returns">
          Orders leave our Portland workshop within 1 business day. Standard delivery
          lands in 3–5 business days — free over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)},
          otherwise {formatPrice(695)} flat. Not the one? Send it back within 30 days
          for a full refund, no questions and no fees.
        </Accordion>
        <Accordion title="The Tot & Tote promise">
          Every piece is family-tested for three months before it earns a place on the
          shelf. Seams are covered by our 2-year stitch guarantee — if a thread lets
          go, we repair or replace it free. That&apos;s the deal.
        </Accordion>
      </div>
    </div>
  );
}
