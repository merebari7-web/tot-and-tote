"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductBadge } from "./product-card";

export function ProductGallery({ images, name, badge }: { images: string[]; name: string; badge: string | null }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative overflow-hidden rounded-[2rem] bg-sand">
        <div className="absolute left-5 top-5 z-10">
          <ProductBadge badge={badge} />
        </div>
        <div className="aspect-[4/5] w-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[active]}
              src={images[active]}
              alt={`${name} — view ${active + 1}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
        <span className="absolute bottom-5 right-5 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-bold text-cream backdrop-blur">
          {active + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "aspect-[4/5] overflow-hidden rounded-2xl bg-sand transition-all",
                active === i
                  ? "ring-2 ring-clay ring-offset-2 ring-offset-cream"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
