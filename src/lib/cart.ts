import { cookies } from "next/headers";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, carts, products } from "@/db/schema";
import { formatPrice } from "@/lib/utils";

export const CART_COOKIE = "tt_cart";

export type CartLine = {
  id: number;
  qty: number;
  size: string | null;
  color: string | null;
  slug: string;
  name: string;
  image: string;
  priceCents: number;
  category: string;
  stock: number;
};

export type CartPayload = {
  cartId: string | null;
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  subtotalFormatted: string;
};

export async function readCartId(): Promise<string | null> {
  const store = await cookies();
  const id = store.get(CART_COOKIE)?.value;
  if (!id) return null;
  const rows = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.id, id))
    .limit(1);
  return rows[0]?.id ?? null;
}

export async function createCart(): Promise<string> {
  const store = await cookies();
  const [row] = await db.insert(carts).values({}).returning();
  store.set(CART_COOKIE, row.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return row.id;
}

export async function getCartPayload(cartId: string | null): Promise<CartPayload> {
  if (!cartId) {
    return {
      cartId: null,
      lines: [],
      count: 0,
      subtotalCents: 0,
      subtotalFormatted: formatPrice(0),
    };
  }
  const rows = await db
    .select({
      id: cartItems.id,
      qty: cartItems.qty,
      size: cartItems.size,
      color: cartItems.color,
      slug: products.slug,
      name: products.name,
      image: products.image,
      priceCents: products.priceCents,
      category: products.category,
      stock: products.stock,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId));

  const lines: CartLine[] = rows.map((r) => ({ ...r }));
  const subtotalCents = lines.reduce((s, l) => s + l.priceCents * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return {
    cartId,
    lines,
    count,
    subtotalCents,
    subtotalFormatted: formatPrice(subtotalCents),
  };
}

/** Idempotent add-or-increment for a cart line. */
export async function upsertCartLine(
  cartId: string,
  productId: number,
  size: string | null,
  color: string | null,
  qty: number,
) {
  const sizeCond = size ? eq(cartItems.size, size) : isNull(cartItems.size);
  const colorCond = color ? eq(cartItems.color, color) : isNull(cartItems.color);

  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productId, productId),
        sizeCond,
        colorCond,
      ),
    )
    .limit(1);

  if (existing[0]) {
    await db
      .update(cartItems)
      .set({ qty: existing[0].qty + qty })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({ cartId, productId, size, color, qty });
  }
}
