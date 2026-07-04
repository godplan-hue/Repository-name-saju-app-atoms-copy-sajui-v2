import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, date, name, phone, amount, package: pkg, categories, plan, discountCode, discountPercent, originalAmount } = body;
    if (!id || !name || !amount) return NextResponse.json({ ok: false });
    await db.ref(`v2_direct_payments/${id}`).set({
      id, date, name,
      phone: phone || "",
      amount: Number(amount),
      package: pkg || "",
      categories: categories || [],
      plan: plan || "",
      discountCode: discountCode || "",
      discountPercent: discountPercent || 0,
      originalAmount: originalAmount || Number(amount),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
