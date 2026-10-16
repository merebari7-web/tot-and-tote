import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { getCartPayload, readCartId } from "@/lib/cart";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const cartId = await readCartId();
  if (!cartId) return NextResponse.json({ error: "No cart" }, { status: 404 });

  const { id } = await params;
  const lineId = Number(id);
  const body = (await req.json().catch(() => ({}))) as { qty?: number };
  const qty = Number(body.qty);

  if (!Number.isFinite(lineId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (!Number.isFinite(qty) || qty <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.id, lineId), eq(cartItems.cartId, cartId)));
  } else {
    await db
      .update(cartItems)
      .set({ qty: Math.min(qty, 10) })
      .where(and(eq(cartItems.id, lineId), eq(cartItems.cartId, cartId)));
  }
  return NextResponse.json(await getCartPayload(cartId));
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const cartId = await readCartId();
  if (!cartId) return NextResponse.json({ error: "No cart" }, { status: 404 });
  const { id } = await params;
  const lineId = Number(id);
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, lineId), eq(cartItems.cartId, cartId)));
  return NextResponse.json(await getCartPayload(cartId));
}
