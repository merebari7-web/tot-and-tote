import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Quote } from "lucide-react";
import { CATEGORIES, getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductCard, RatingStars } from "@/components/product-card";
import { ProductDetail } from "@/components/product-detail";
import { ProductGallery } from "@/components/product-gallery";
import { Reveal } from "@/components/reveal";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return { title: product.name, description: product.tagline };
}

const REVIEW_SNIPPETS = [
  {
    quote: "Ordered Tuesday, on the shoulder by Friday. Quality exceeded the photos.",
    name: "Verified buyer",
  },
  {
    quote: "Third purchase from this shop and the bar never drops. Packaging is a whole moment.",
    name: "Verified buyer",
  },
];

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const category = CATEGORIES.find((c) => c.slug === product.category);
  const images = Array.from(new Set([product.image, ...product.gallery]));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-mute">
        <Link href="/" className="transition hover:text-clay">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/shop" className="transition hover:text-clay">
          Shop
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={`/shop?category=${product.category}`}
          className="transition hover:text-clay"
        >
          {category?.name ?? product.category}
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.05fr,1fr] lg:gap-16">
        <ProductGallery images={images} name={product.name} badge={product.badge} />
        <ProductDetail product={product} categoryName={category?.name ?? "Shop"} />
      </div>

      {/* review band */}
      <Reveal className="mt-24">
        <div className="rounded-[2rem] border border-line bg-sand/60 px-6 py-10 sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">
                From the doorstep
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">
                {product.reviewsCount} reviews · {product.rating.toFixed(1)} average
              </h2>
            </div>
            <RatingStars rating={product.rating} size="size-5" />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {REVIEW_SNIPPETS.map((r) => (
              <figure key={r.quote} className="rounded-2xl bg-paper p-6">
                <Quote className="size-5 text-clay" />
                <blockquote className="mt-3 text-sm leading-relaxed text-ink">
                  {r.quote}
                </blockquote>
                <figcaption className="mt-3 text-xs font-bold text-mute">
                  — {r.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </Reveal>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-24">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-clay">
                Keep wandering
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight">
                Pairs beautifully <span className="italic text-clay">with</span>
              </h2>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-bold transition hover:border-ink hover:bg-ink hover:text-cream"
            >
              More {category?.name?.toLowerCase() ?? "pieces"}
            </Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
