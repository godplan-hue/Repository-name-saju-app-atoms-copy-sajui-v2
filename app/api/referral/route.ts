import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function genCouponCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "REF";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// POST: 추천 성공 → 추천인에게 990원 무료 사주 쿠폰 지급
export async function POST(request: NextRequest) {
  try {
    const { refCode } = await request.json();
    if (!refCode || !refCode.startsWith("REF")) {
      return NextResponse.json({ ok: false });
    }

    // 쿠폰 코드 생성 (충돌 방지)
    let coupon = "";
    for (let i = 0; i < 5; i++) {
      const candidate = genCouponCode();
      const snap = await db.ref(`promoCodes/${candidate}`).once("value");
      if (!snap.exists()) { coupon = candidate; break; }
    }
    if (!coupon) return NextResponse.json({ ok: false, error: "코드 생성 실패" });

    // promoCodes에 저장
    await db.ref(`promoCodes/${coupon}`).set({
      discountPercent: 100,
      maxAmount: 990,
      note: "추천인보상_990원무료사주쿠폰",
      active: true,
      usageCount: 0,
    });

    // refCode별 적립 내역에도 저장
    await db.ref(`refRewards/${refCode}`).push({
      coupon,
      earnedAt: Date.now(),
    });

    return NextResponse.json({ ok: true, coupon });
  } catch (err) {
    console.error("Referral reward error:", err);
    return NextResponse.json({ ok: false });
  }
}

// GET: 내 추천 쿠폰 조회 (?refCode=REF...)
export async function GET(request: NextRequest) {
  try {
    const refCode = request.nextUrl.searchParams.get("refCode");
    if (!refCode) return NextResponse.json({ coupons: [] });

    const snap = await db.ref(`refRewards/${refCode}`).once("value");
    const data = snap.val();
    if (!data) return NextResponse.json({ coupons: [] });

    const coupons = Object.values(data) as { coupon: string; earnedAt: number }[];
    return NextResponse.json({ coupons });
  } catch {
    return NextResponse.json({ coupons: [] });
  }
}
