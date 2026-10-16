"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Command, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn, formatPrice } from "@/lib/utils";

type Hit = {
  id: number;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  priceCents: number;
  image: string;
};

const CATEGORY_LABEL: Record<string, string> = {
  schoolbags: "Schoolbags",
  handbags: "Handbags",
  shoes: "Little Shoes",
};

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHits([]);
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const t = setTimeout(async () => {
      if (!query.trim()) {
        setHits([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&limit=8`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setHits(data.products ?? []);
        setActive(0);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 240);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, hits.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && hits[active]) {
        router.push(`/product/${hits[active].slug}`);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hits, active, onClose, router]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] bg-ink/45 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_40px_120px_-20px_rgba(34,26,19,0.5)]"
            initial={{ opacity: 0, y: -18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search className="size-5 text-clay" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search backpacks, totes, tiny sneakers…"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-mute/70"
              />
              <button
                onClick={onClose}
                className="grid size-7 place-items-center rounded-full border border-line text-mute transition hover:text-ink"
                aria-label="Close search"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {!query.trim() && (
                <div className="px-4 py-8 text-center">
                  <Command className="mx-auto mb-3 size-6 text-mute" />
                  <p className="text-sm font-medium text-ink">Search the whole store</p>
                  <p className="mt-1 text-xs text-mute">
                    Try “dino”, “leather tote”, or “first steps”
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {["dino", "tote", "sneaker", "school"].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs font-medium text-cocoa transition hover:border-clay hover:text-clay"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && !loading && hits.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="font-display text-xl">No matches for “{query}”</p>
                  <p className="mt-1 text-sm text-mute">
                    Try another word — or browse the shop instead.
                  </p>
                </div>
              )}

              {hits.map((hit, i) => (
                <button
                  key={hit.id}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => {
                    router.push(`/product/${hit.slug}`);
                    onClose();
                  }}
                  className={cn(
                    "flex w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-left transition-colors",
                    active === i ? "bg-cream" : "bg-transparent",
                  )}
                >
                  <span className="block h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-sand">
                    <img src={hit.image} alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {hit.name}
                    </span>
                    <span className="block truncate text-xs text-mute">{hit.tagline}</span>
                  </span>
                  <span className="rounded-full border border-line bg-cream px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cocoa">
                    {CATEGORY_LABEL[hit.category] ?? hit.category}
                  </span>
                  <span className="text-sm font-semibold text-clay">
                    {formatPrice(hit.priceCents)}
                  </span>
                  {active === i && <ArrowUpRight className="size-4 text-mute" />}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-line bg-cream/60 px-5 py-2.5 text-[10.5px] text-mute">
              <span>↑↓ to move · ↵ to open · esc to close</span>
              <span className="font-semibold uppercase tracking-widest">Tot &amp; Tote</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
