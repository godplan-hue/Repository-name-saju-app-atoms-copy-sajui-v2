import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(req: NextRequest) {
  try {
    const adminId = req.headers.get("x-admin-id");
    if (!adminId) return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    const snap = await db.ref("v2_direct_payments").once("value");
    const data = snap.val() || {};
    const payments = (Object.values(data) as any[]).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const yyyymm = new Date().toISOString().slice(0, 7);
    const monthlyRevenue = payments
      .filter(p => (p.date || "").startsWith(yyyymm))
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    return NextResponse.json({ payments, totalRevenue, monthlyRevenue, count: payments.length });
  } catch {
    return NextResponse.json({ payments: [], totalRevenue: 0, monthlyRevenue: 0, count: 0 });
  }
}
