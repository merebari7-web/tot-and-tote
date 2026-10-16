import { CATEGORIES, getCategoryCounts, getProductBySlug, getProducts } from "@/lib/data";
import {
  CategoryShowcase,
  FeaturedShelf,
  Hero,
  NewsletterCTA,
  Perks,
  Story,
  Testimonials,
  Ticker,
} from "@/components/home-sections";

export const revalidate = 60;

type HomeData = [
  Awaited<ReturnType<typeof getProducts>>,
  Awaited<ReturnType<typeof getProducts>>,
  Awaited<ReturnType<typeof getProducts>>,
  Awaited<ReturnType<typeof getCategoryCounts>>,
  Awaited<ReturnType<typeof getProductBySlug>>,
];

export default async function Home() {
  // Resilient fetch: if the database is not provisioned yet (e.g. a first
  // deploy before DATABASE_URL is set), the shell still renders and data
  // appears on the next ISR revalidation once the store is reachable.
  const [schoolbags, handbags, shoes, counts, sticker]: HomeData = await Promise.all([
    getProducts({ category: "schoolbags", sort: "rating", limit: 4 }),
    getProducts({ category: "handbags", sort: "rating", limit: 4 }),
    getProducts({ category: "shoes", sort: "rating", limit: 4 }),
    getCategoryCounts(),
    getProductBySlug("dino-roar-rucksack"),
  ]).catch((err): HomeData => {
    console.error("Home data fetch failed (is the database reachable?):", err);
    return [[], [], [], {}, undefined];
  });

  const featured = [...schoolbags, ...handbags, ...shoes];

  return (
    <>
      <Hero sticker={sticker ?? null} />
      <Ticker />
      <CategoryShowcase categories={CATEGORIES} counts={counts} />
      <FeaturedShelf products={featured} />
      <Perks />
      <Story />
      <Testimonials />
      <NewsletterCTA />
    </>
  );
}
