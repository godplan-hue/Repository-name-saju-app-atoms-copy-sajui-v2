import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const adminId = request.headers.get("x-admin-id");
    if (!adminId) {
      return NextResponse.json({ error: "인증되지 않았습니다" }, { status: 401 });
    }

    const [partnersSnap, archiveSnap] = await Promise.all([
      db.ref("partners").once("value"),
      db.ref("partnerArchive").once("value"),
    ]);
    const partners = partnersSnap.val() || {};
    const archive = archiveSnap.val() || {};

    const list = Object.entries(partners).map(([id, value]) => {
      const p = value as any;
      const entries = Object.values(archive[id] || {}) as Array<{ charge?: { totalCharge: number } }>;
      const analysisCount = entries.length;
      const revenue = entries.reduce((sum, e) => sum + (e.charge?.totalCharge || 0), 0);
      const payments = Object.values(p.payments || {}) as Array<{ amount?: number; paidAt?: string; couponCode?: string | null; discountPercent?: number }>;
      const totalPaid = payments.reduce((sum, pay) => sum + (pay.amount || 0), 0);
      const lastPaidAt = payments.length > 0
        ? payments.reduce((latest, pay) => (!latest || (pay.paidAt && pay.paidAt > latest) ? pay.paidAt! : latest), "")
        : null;
      const couponPayments = payments.filter(pay => (pay.discountPercent || 0) > 0);
      const usedCoupon = couponPayments.length > 0;
      const couponCodes = Array.from(new Set(couponPayments.map(pay => pay.couponCode).filter(Boolean))) as string[];
      return {
        id,
        name: p.name,
        email: p.email,
        businessName: p.businessName || "",
        tier: p.tier || "free",
        analysisCount,
        revenue,
        createdAt: p.createdAt,
        guideConfirmedAt: p.guideConfirmedAt || null,
        totalPaid,
        lastPaidAt,
        usedCoupon,
        couponCodes,
        // 무료 등급은 입금 자체가 없으므로 해당 없음(null), 유료 등급은 가입비를
        // 계좌이체로 받기로 해서 점운님이 직접 입금을 확인하기 전까지 false로 둠
        paymentConfirmed: (p.tier || "free") === "free" ? null : (p.paymentConfirmed !== false),
      };
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ partners: list });
  } catch (error) {
    console.error("Partners list error:", error);
    return NextResponse.json({ error: "파트너 목록 조회 중 오류가 발생했습니다" }, { status: 500 });
  }
}
