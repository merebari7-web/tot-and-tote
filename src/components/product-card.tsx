"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/db/schema";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "./cart-context";

const BADGE_STYLES: Record<string, string> = {
  bestseller: "bg-ink text-cream -rotate-3",
  new: "bg-sage text-cream rotate-2",
  sale: "bg-clay text-cream -rotate-2",
};

const BADGE_LABEL: Record<string, string> = {
  bestseller: "Bestseller",
  new: "New in",
  sale: "On sale",
};

export function ProductBadge({ badge }: { badge: string | null }) {
  if (!badge) return null;
  return (
    <span
      className={cn(
        "z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-sm",
        BADGE_STYLES[badge] ?? "bg-paper text-ink",
      )}
    >
      {BADGE_LABEL[badge] ?? badge}
    </span>
  );
}

export function RatingStars({
  rating,
  className,
  size = "size-3.5",
}: {
  rating: number;
  className?: string;
  size?: string;
}) {
  return (
    <span className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            size,
            i < Math.round(rating) ? "fill-butter text-butter" : "fill-line text-line",
          )}
        />
      ))}
    </span>
  );
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add } = useCart();
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);
  const hasSizes = !!product.sizes && product.sizes.length > 0;
  const outOfStock = product.stock <= 0;

  const quickAdd = async () => {
    setAdding(true);
    await add({ slug: product.slug, color: product.colors[0]?.name ?? null });
    setAdding(false);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-3xl bg-sand">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={cn(
                "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]",
                outOfStock && "opacity-70 saturate-50",
              )}
            />
          </div>
        </Link>

        <div className="absolute left-3.5 top-3.5 flex flex-col gap-2">
          <ProductBadge badge={product.badge} />
          {outOfStock && (
            <span className="rounded-full bg-paper px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa">
              Sold out
            </span>
          )}
        </div>

        <button
          onClick={() => setWished((w) => !w)}
          aria-label="Add to wishlist"
          className={cn(
            "absolute right-3.5 top-3.5 z-10 grid size-9 place-items-center rounded-full bg-paper/90 shadow-sm backdrop-blur transition-all hover:scale-110 active:scale-95",
            wished ? "text-clay" : "text-cocoa opacity-0 group-hover:opacity-100",
          )}
        >
          <Heart className={cn("size-4", wished && "fill-clay")} />
        </button>

        {!outOfStock && (
          <div className="absolute inset-x-3.5 bottom-3.5 translate-y-[130%] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
            {hasSizes ? (
              <Link
                href={`/product/${product.slug}`}
                className="block rounded-full bg-paper/95 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-ink shadow-lg backdrop-blur transition hover:bg-ink hover:text-cream"
              >
                Choose a size
              </Link>
            ) : (
              <button
                onClick={quickAdd}
                disabled={adding}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-paper/95 py-2.5 text-xs font-bold uppercase tracking-wider text-ink shadow-lg backdrop-blur transition hover:bg-ink hover:text-cream disabled:opacity-60"
              >
                <ShoppingBag className="size-3.5" />
                {adding ? "Adding…" : "Quick add"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-1.5 pt-4">
        <div className="flex items-center justify-between gap-2">
          <RatingStars rating={product.rating} size="size-3" />
          <span className="text-[11px] font-medium text-mute">
            {product.rating.toFixed(1)} ({product.reviewsCount})
          </span>
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-clay">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "text-[15px] font-bold",
                product.compareAtCents ? "text-clay" : "text-ink",
              )}
            >
              {formatPrice(product.priceCents)}
            </span>
            {product.compareAtCents && (
              <span className="text-[13px] font-medium text-mute line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="size-3 rounded-full border border-ink/15"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
