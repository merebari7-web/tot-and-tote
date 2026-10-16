"use client";

import { ArrowUpDown, RotateCcw, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type CategoryChip = { slug: string; name: string; count: number };

const SORTS = [
  { value: "featured", label: "Featured first" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

const SHOE_SIZES = ["8C", "9C", "10C", "11C", "12C", "13C", "1Y", "2Y", "3Y"];

export function ShopFilters({
  categories,
  totalCount,
}: {
  categories: CategoryChip[];
  totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const q = searchParams.get("q") ?? "";
  const inStock = searchParams.get("inStock") === "1";
  const size = searchParams.get("size") ?? "";

  const [query, setQuery] = useState(q);
  useEffect(() => setQuery(q), [q]);

  const pushWith = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const hasFilters = !!(category || q || inStock || size) || sort !== "featured";

  return (
    <div className="space-y-4">
      {/* category pills */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          onClick={() => pushWith({ category: null, size: null })}
          className={cn(
            "shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-95",
            !category
              ? "bg-ink text-cream shadow-md"
              : "border border-line bg-paper text-cocoa hover:border-ink/40",
          )}
        >
          All <span className="ml-1 text-xs opacity-60">{totalCount}</span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => pushWith({ category: cat.slug, size: null })}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-95",
              category === cat.slug
                ? "bg-clay text-cream shadow-md"
                : "border border-line bg-paper text-cocoa hover:border-clay/50 hover:text-clay",
            )}
          >
            {cat.name} <span className="ml-1 text-xs opacity-60">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* controls row */}
      <div className="flex flex-wrap items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            pushWith({ q: query || null });
          }}
          className="flex min-w-52 flex-1 items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 sm:max-w-xs"
        >
          <Search className="size-4 shrink-0 text-mute" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this shelf…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-mute/70"
          />
        </form>

        <label className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5">
          <ArrowUpDown className="size-4 text-mute" />
          <select
            value={sort}
            onChange={(e) => pushWith({ sort: e.target.value === "featured" ? null : e.target.value })}
            className="bg-transparent text-sm font-semibold outline-none"
            aria-label="Sort products"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        {category === "shoes" && (
          <select
            value={size}
            onChange={(e) => pushWith({ size: e.target.value || null })}
            className="rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-semibold outline-none"
            aria-label="Filter by shoe size"
          >
            <option value="">Any size</option>
            {SHOE_SIZES.map((s) => (
              <option key={s} value={s}>
                Size {s}
              </option>
            ))}
          </select>
        )}

        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-semibold">
          <input
            type="checkbox"
            className="fancy"
            checked={inStock}
            onChange={(e) => pushWith({ inStock: e.target.checked ? "1" : null })}
          />
          In stock only
        </label>

        {hasFilters && (
          <button
            onClick={() => {
              setQuery("");
              router.replace(pathname, { scroll: false });
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-clay transition hover:bg-clay/10"
          >
            <RotateCcw className="size-3.5" />
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
