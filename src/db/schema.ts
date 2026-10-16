import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  uuid,
  timestamp,
  jsonb,
  real,
  index,
} from "drizzle-orm/pg-core";

export type ProductCategory = "schoolbags" | "handbags" | "shoes";
export type ProductColor = { name: string; hex: string };

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull(), // schoolbags | handbags | shoes
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    details: text("details").notNull(), // newline separated bullets
    priceCents: integer("price_cents").notNull(),
    compareAtCents: integer("compare_at_cents"),
    image: text("image").notNull(),
    gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
    colors: jsonb("colors").$type<ProductColor[]>().notNull().default([]),
    sizes: jsonb("sizes").$type<string[] | null>(),
    badge: text("badge"), // new | bestseller | sale
    rating: real("rating").notNull().default(4.7),
    reviewsCount: integer("reviews_count").notNull().default(0),
    stock: integer("stock").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("products_category_idx").on(t.category)],
);

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: serial("id").primaryKey(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: text("size"),
    color: text("color"),
    qty: integer("qty").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("cart_items_cart_idx").on(t.cartId)],
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id").references(() => orders.id, {
      onDelete: "cascade",
    }),
    productId: integer("product_id").references(() => products.id),
    name: text("name").notNull(),
    image: text("image").notNull(),
    size: text("size"),
    color: text("color"),
    qty: integer("qty").notNull(),
    priceCents: integer("price_cents").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const newsletterSubs = pgTable("newsletter_subs", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
