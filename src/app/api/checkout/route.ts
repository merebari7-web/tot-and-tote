import { NextRequest, NextResponse } from "next/server";
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, orderItems, orders, products } from "@/db/schema";
import { readCartId } from "@/lib/cart";
import { orderNumberFrom, shippingFor } from "@/lib/utils";

type CheckoutBody = {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  phone?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as CheckoutBody;

  const required = ["email", "firstName", "lastName", "address", "city", "zip", "country"] as const;
  for (const key of required) {
    if (!body[key] || String(body[key]).trim().length === 0) {
      return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
    }
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email!)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const cartId = await readCartId();
  if (!cartId) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const lines = await db
    .select({
      id: cartItems.id,
      qty: cartItems.qty,
      size: cartItems.size,
      color: cartItems.color,
      productId: products.id,
      name: products.name,
      image: products.image,
      priceCents: products.priceCents,
      stock: products.stock,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.cartId, cartId));

  if (lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const subtotal = lines.reduce((s, l) => s + l.priceCents * l.qty, 0);
  const { shippingCents } = shippingFor(subtotal);

  try {
    const order = await db.transaction(async (tx) => {
      for (const line of lines) {
        const updated = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${line.qty}` })
          .where(and(eq(products.id, line.productId), gte(products.stock, line.qty)))
          .returning({ id: products.id });
        if (updated.length === 0) {
          throw new Error(`OUT_OF_STOCK:${line.name}`);
        }
      }

      const [draft] = await tx
        .insert(orders)
        .values({
          orderNumber: "PENDING",
          email: body.email!.trim(),
          firstName: body.firstName!.trim(),
          lastName: body.lastName!.trim(),
          address: body.address!.trim(),
          city: body.city!.trim(),
          zip: body.zip!.trim(),
          country: body.country!.trim(),
          phone: body.phone?.trim() || null,
          subtotalCents: subtotal,
          shippingCents,
          totalCents: subtotal + shippingCents,
          status: "confirmed",
        })
        .returning();

      const [finalOrder] = await tx
        .update(orders)
        .set({ orderNumber: orderNumberFrom(draft.id) })
        .where(eq(orders.id, draft.id))
        .returning();

      await tx.insert(orderItems).values(
        lines.map((l) => ({
          orderId: draft.id,
          productId: l.productId,
          name: l.name,
          image: l.image,
          size: l.size,
          color: l.color,
          qty: l.qty,
          priceCents: l.priceCents,
        })),
      );

      await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
      return finalOrder;
    });

    return NextResponse.json({ orderNumber: order.orderNumber });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("OUT_OF_STOCK:")) {
      return NextResponse.json(
        { error: `"${err.message.slice(13)}" just sold out. Please update your cart.` },
        { status: 409 },
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Checkout failed. Please try again." }, { status: 500 });
  }
}
