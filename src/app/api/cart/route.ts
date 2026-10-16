import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import {
  createCart,
  getCartPayload,
  readCartId,
  upsertCartLine,
} from "@/lib/cart";

export async function GET() {
  const cartId = await readCartId();
  return NextResponse.json(await getCartPayload(cartId));
}

export async function POST(req: NextRequest) {
  let body: {
    slug?: string;
    productId?: number;
    size?: string | null;
    color?: string | null;
    qty?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const qty = Math.max(1, Math.min(10, Number(body.qty ?? 1)));

  let productRows;
  if (body.productId) {
    productRows = await db
      .select()
      .from(products)
      .where(eq(products.id, body.productId))
      .limit(1);
  } else if (body.slug) {
    productRows = await db
      .select()
      .from(products)
      .where(eq(products.slug, body.slug))
      .limit(1);
  } else {
    return NextResponse.json({ error: "productId or slug required" }, { status: 400 });
  }

  const product = productRows[0];
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  if (product.stock <= 0) {
    return NextResponse.json({ error: "Out of stock" }, { status: 409 });
  }
  if (product.sizes && product.sizes.length > 0 && !body.size) {
    return NextResponse.json({ error: "Please choose a size" }, { status: 400 });
  }

  const cartId = (await readCartId()) ?? (await createCart());
  await upsertCartLine(cartId, product.id, body.size ?? null, body.color ?? null, qty);
  return NextResponse.json(await getCartPayload(cartId));
}
