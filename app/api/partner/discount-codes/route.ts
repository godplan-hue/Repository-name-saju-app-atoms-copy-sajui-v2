import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getPartnerTier } from "@/lib/partnerTiers";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const snap = await db.ref("discountCodes").once("value");
  const all = snap.val() || {};

  if (code) {
    const found = all[code.trim().toUpperCase()];
    if (!found || !found.active) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
    const tier = getPartnerTier(found.tierId);
    let limitReached = false;
    if (tier.monthlyLimit !== null) {
      const settlementsSnap = await db.ref("settlements").once("value");
      const settlements = Object.values(settlementsSnap.val() || {}) as Array<{ partnerName: string; date: string }>;
      const now = new Date();
      const usedThisMonth = settlements.filter(r => {
        const d = new Date(r.date);
        return r.partnerName === found.partnerName && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      }).length;
      limitReached = usedThisMonth >= tier.monthlyLimit;
    }
    return NextResponse.json({ found: true, limitReached, code: { ...found, code: code.trim().toUpperCase() } });
  }

  const list = Object.entries(all).map(([key, value]) => ({ code: key, ...(value as object) }));
  return NextResponse.json({ codes: list });
}

export async function POST(request: NextRequest) {
  try {
    const { code, discountPercent, partnerName, tierId } = await request.json();
    if (!code || !discountPercent || !partnerName || !tierId) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }
    const key = String(code).trim().toUpperCase();
    await db.ref(`discountCodes/${key}`).set({ discountPercent, partnerName, tierId, active: true });
    return NextResponse.json({ success: true, code: key });
  } catch (error) {
    console.error("Discount code create error:", error);
    return NextResponse.json({ error: "할인코드 생성 실패" }, { status: 500 });
  }
}
