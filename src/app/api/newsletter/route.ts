import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubs } from "@/db/schema";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { email?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  await db
    .insert(newsletterSubs)
    .values({ email })
    .onConflictDoNothing({ target: newsletterSubs.email });
  return NextResponse.json({ ok: true });
}
