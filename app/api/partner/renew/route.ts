import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getPartnerTier } from "@/lib/partnerTiers";

// 같은 등급으로 연회비를 다시 내는 갱신(업그레이드처럼 등급을 올리는 게 아니라
// 그대로 유지) — 1년 카운트(feeRenewedAt)를 지금 시점으로 다시 초기화
export async function POST(request: NextRequest) {
  try {
    const { partnerId, paidAmount, discountCode, discountPercent } = await request.json();
    if (!partnerId) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const partnerSnap = await db.ref(`partners/${partnerId}`).once("value");
    const partner = partnerSnap.val();
    if (!partner) {
      return NextResponse.json({ error: "파트너 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    const tierId = partner.tier || "free";
    if (tierId === "free") {
      return NextResponse.json({ error: "무료 등급은 갱신이 필요 없습니다." }, { status: 400 });
    }

    const tier = getPartnerTier(tierId);
    const now = new Date().toISOString();
    await db.ref(`partners/${partnerId}`).update({ feeRenewedAt: now });

    await db.ref(`partners/${partnerId}/payments`).push({
      type: "renewal", tier: tierId, amount: paidAmount ?? tier.annualFee, paidAt: now,
      couponCode: discountPercent > 0 ? discountCode : null,
      discountPercent: discountPercent || 0,
    });

    return NextResponse.json({ success: true, tier: tierId });
  } catch (error) {
    console.error("Partner renew error:", error);
    return NextResponse.json({ error: "갱신 처리 실패" }, { status: 500 });
  }
}
