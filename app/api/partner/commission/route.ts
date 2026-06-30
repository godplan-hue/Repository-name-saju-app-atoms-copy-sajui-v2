import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const COMMISSION_RATE = 0.2; // 20%

export async function POST(request: NextRequest) {
  try {
    const { partnerId, paidAmount } = await request.json();
    if (!partnerId || !paidAmount) {
      return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
    }

    // 파트너 존재 여부 확인
    const partnerSnap = await db.ref(`partners/${partnerId}`).once("value");
    if (!partnerSnap.exists()) {
      return NextResponse.json({ error: "파트너를 찾을 수 없습니다" }, { status: 404 });
    }

    const commission = Math.round(Number(paidAmount) * COMMISSION_RATE);
    const yyyymm = new Date().toISOString().slice(0, 7);

    const ref = await db.ref("referral_commissions").push({
      partnerId,
      paidAmount: Number(paidAmount),
      commission,
      createdAt: Date.now(),
      status: "pending",
    });

    // 파트너 통계 누적
    const statsRef = db.ref(`partnerStats/${partnerId}/referral`);
    const statsSnap = await statsRef.once("value");
    const stats = statsSnap.val() || {};
    await statsRef.set({
      total: { commission: (stats.total?.commission || 0) + commission, count: (stats.total?.count || 0) + 1 },
      [yyyymm]: {
        commission: (stats[yyyymm]?.commission || 0) + commission,
        count: (stats[yyyymm]?.count || 0) + 1,
      },
    });

    return NextResponse.json({ success: true, commissionId: ref.key, commission });
  } catch (error) {
    console.error("Commission record error:", error);
    return NextResponse.json({ error: "수수료 기록 실패" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const partnerId = request.nextUrl.searchParams.get("partnerId");
    if (!partnerId) return NextResponse.json({ error: "파트너 ID 필요" }, { status: 400 });

    const statsSnap = await db.ref(`partnerStats/${partnerId}/referral`).once("value");
    const stats = statsSnap.val() || {};

    const snap = await db.ref("referral_commissions")
      .orderByChild("partnerId").equalTo(partnerId).limitToLast(20).once("value");
    const raw = snap.val() || {};
    const list = Object.entries(raw)
      .map(([id, v]: [string, any]) => ({ id, ...v }))
      .sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ stats, list });
  } catch (error) {
    console.error("Commission fetch error:", error);
    return NextResponse.json({ error: "조회 실패" }, { status: 500 });
  }
}
