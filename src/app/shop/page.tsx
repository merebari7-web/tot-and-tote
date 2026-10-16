import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { CATEGORIES, getCategoryCounts, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { ShopFilters } from "@/components/shop-filters";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full Tot & Tote shelf — schoolbags, handbags and little shoes.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;
  const size = typeof sp.size === "string" ? sp.size : undefined;
  const inStock = sp.inStock === "1";

  const [products, counts] = await Promise.all([
    getProducts({ category, q, sort, size, inStock }),
    getCategoryCounts(),
  ]);

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const categories = CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: counts[c.slug] ?? 0,
  }));
  const activeCategory = CATEGORIES.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      {/* header band */}
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-sand/70 px-6 py-10 sm:px-10">
        <div className="dotgrid pointer-events-none absolute right-6 top-4 h-40 w-40 opacity-60" />
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">
          {activeCategory ? activeCategory.label : "The whole shelf"}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          {activeCategory ? activeCategory.name : (
            <>Shop <span className="italic text-clay">everything</span></>
          )}
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-cocoa">
          {activeCategory
            ? activeCategory.blurb
            : "Every schoolbag, handbag and little shoe we make — tested by our own crew before it earned its place here."}
        </p>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-mute">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
          {q && (
            <>
              {" "}for “<span className="text-clay">{q}</span>”
            </>
          )}
        </p>
      </div>

      {/* filters */}
      <div className="sticky top-[72px] z-30 -mx-4 mt-8 bg-cream/90 px-4 py-4 backdrop-blur-lg sm:mx-0 sm:rounded-2xl sm:px-3">
        <ShopFilters categories={categories} totalCount={totalCount} />
      </div>

      {/* grid */}
      {products.length === 0 ? (
        <div className="mt-16 flex flex-col items-center py-16 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-sand">
            <PackageSearch className="size-9 text-mute" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-semibold">
            The shelf is empty here
          </h2>
          <p className="mt-2 max-w-sm text-sm text-mute">
            Nothing matches those filters. Try loosening one — or wander the full shop
            and let something find you.
          </p>
          <Link
            href="/shop"
            className="mt-7 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-cream transition hover:bg-clay"
          >
            Browse everything
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
