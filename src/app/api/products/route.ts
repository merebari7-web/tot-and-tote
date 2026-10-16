import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/data";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const products = await getProducts({
    q: sp.get("q") ?? undefined,
    category: sp.get("category") ?? undefined,
    sort: sp.get("sort") ?? undefined,
    limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
  });
  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      tagline: p.tagline,
      priceCents: p.priceCents,
      image: p.image,
      rating: p.rating,
    })),
  });
}
