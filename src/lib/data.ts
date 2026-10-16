import { db } from "@/db";
import {
  orderItems,
  orders,
  products,
  type Product,
} from "@/db/schema";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  ilike,
  lte,
  ne,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

export const CATEGORIES = [
  {
    slug: "schoolbags",
    name: "Schoolbags",
    label: "For little scholars",
    blurb:
      "Ergonomic, splash-proof and playground-proof packs sized for growing shoulders.",
    image:
      "https://images.pexels.com/photos/8423937/pexels-photo-8423937.jpeg?auto=compress&cs=tinysrgb&w=1000",
    accent: "#D9592B",
  },
  {
    slug: "handbags",
    name: "Handbags",
    label: "For her everyday",
    blurb:
      "Vegetable-tanned totes, satchels and hobos that carry work, errands and evenings out.",
    image:
      "https://images.pexels.com/photos/29793778/pexels-photo-29793778.jpeg?auto=compress&cs=tinysrgb&w=1000",
    accent: "#A96F3D",
  },
  {
    slug: "shoes",
    name: "Little Shoes",
    label: "For first miles",
    blurb:
      "Flexible soles, breathable uppers and easy-on closures for feet that never stop.",
    image:
      "https://images.pexels.com/photos/8101683/pexels-photo-8101683.jpeg?auto=compress&cs=tinysrgb&w=1000",
    accent: "#6F97BF",
  },
] as const;

export type ProductFilters = {
  category?: string;
  q?: string;
  sort?: string;
  inStock?: boolean;
  size?: string;
  minPrice?: number; // cents
  maxPrice?: number; // cents
  featured?: boolean;
  limit?: number;
};

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  const conds: SQL[] = [];

  if (filters.category) {
    conds.push(eq(products.category, filters.category));
  }
  if (filters.q) {
    const term = `%${filters.q.trim()}%`;
    conds.push(
      or(
        ilike(products.name, term),
        ilike(products.tagline, term),
        ilike(products.description, term),
        ilike(products.category, term),
      )!,
    );
  }
  if (filters.inStock) conds.push(gt(products.stock, 0));
  if (filters.featured) conds.push(eq(products.featured, true));
  if (typeof filters.minPrice === "number")
    conds.push(gte(products.priceCents, filters.minPrice));
  if (typeof filters.maxPrice === "number")
    conds.push(lte(products.priceCents, filters.maxPrice));
  if (filters.size) {
    conds.push(
      sql`${products.sizes} @> ${JSON.stringify([filters.size])}::jsonb`,
    );
  }

  let orderBy: SQL | ReturnType<typeof asc> | ReturnType<typeof desc>;
  switch (filters.sort) {
    case "price-asc":
      orderBy = asc(products.priceCents);
      break;
    case "price-desc":
      orderBy = desc(products.priceCents);
      break;
    case "rating":
      orderBy = desc(products.rating);
      break;
    case "newest":
      orderBy = desc(products.createdAt);
      break;
    default:
      orderBy = desc(products.featured);
  }

  const base = db
    .select()
    .from(products)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(orderBy, desc(products.rating));

  return filters.limit ? base.limit(filters.limit) : base;
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return rows[0];
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .where(
      and(
        eq(products.category, product.category),
        ne(products.id, product.id),
        gt(products.stock, 0),
      ),
    )
    .orderBy(desc(products.rating))
    .limit(limit);
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const rows = await db
    .select({ category: products.category, count: sql<number>`count(*)` })
    .from(products)
    .groupBy(products.category);
  return Object.fromEntries(
    rows.map((r) => [r.category, Number(r.count)]),
  ) as Record<string, number>;
}

export async function getOrderByNumber(orderNumber: string) {
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  const order = orderRows[0];
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export type AdminOverview = {
  revenueCents: number;
  ordersCount: number;
  avgOrderCents: number;
  unitsSold: number;
  productsCount: number;
  lowStock: Product[];
  recentOrders: (typeof orders.$inferSelect)[];
  revenueByDay: { day: string; total: number }[];
};

export async function getAdminOverview(): Promise<AdminOverview> {
  const [totals] = await db
    .select({
      revenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)`,
      count: sql<number>`count(*)`,
    })
    .from(orders);

  const [units] = await db
    .select({ units: sql<number>`coalesce(sum(${orderItems.qty}), 0)` })
    .from(orderItems);

  const [prodCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);

  const lowStock = await db
    .select()
    .from(products)
    .where(lte(products.stock, 20))
    .orderBy(asc(products.stock))
    .limit(6);

  const recentOrders = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(10);

  const dayTrunc = sql`date_trunc('day', ${orders.createdAt})`;
  const revenueByDay = await db
    .select({
      day: sql<string>`to_char(${dayTrunc}, 'Mon DD')`,
      total: sql<number>`coalesce(sum(${orders.totalCents}), 0)`,
    })
    .from(orders)
    .groupBy(dayTrunc)
    .orderBy(dayTrunc);

  const revenueCents = Number(totals.revenue);
  const ordersCount = Number(totals.count);

  return {
    revenueCents,
    ordersCount,
    avgOrderCents: ordersCount > 0 ? Math.round(revenueCents / ordersCount) : 0,
    unitsSold: Number(units.units),
    productsCount: Number(prodCount.count),
    lowStock,
    recentOrders,
    revenueByDay: revenueByDay.map((r) => ({
      day: r.day,
      total: Number(r.total),
    })),
  };
}
