import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const normalizePhone = (p: string) => p.replace(/\D/g, "");

export async function POST(req: NextRequest) {
  try {
    const { phone, unlocks } = await req.json();
    if (!phone || !unlocks) return NextResponse.json({ ok: false });
    const ph = normalizePhone(phone);
    if (ph.length < 10) return NextResponse.json({ ok: false });

    const snap = await db.ref(`phone_unlocks/${ph}`).get();
    const existing: Record<string, number> = snap.val() || {};
    const merged: Record<string, number> = {};
    for (const [k, v] of Object.entries(unlocks as Record<string, number>)) {
      merged[k] = Math.max(existing[k] || 0, v);
    }
    await db.ref(`phone_unlocks/${ph}`).update(merged);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) });
  }
}

export async function GET(req: NextRequest) {
  try {
    const phone = req.nextUrl.searchParams.get("phone");
    if (!phone) return NextResponse.json({ ok: false });
    const ph = normalizePhone(phone);
    const snap = await db.ref(`phone_unlocks/${ph}`).get();
    return NextResponse.json({ ok: true, unlocks: snap.val() || {} });
  } catch {
    return NextResponse.json({ ok: true, unlocks: {} });
  }
}
