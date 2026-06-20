import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getTierIndex, calculateUpgradeFee, getPartnerTier } from "@/lib/partnerTiers";

// 등급 업그레이드 — 새 등급 연회비에서 기존 연회비를 뺀 차액만 결제(시뮬레이션)하면
// 바로 적용. 이번 달 이미 쓴 분석 생성 건수는 그대로 유지되고, 새 등급의
// (더 큰) 한도 안에서 남은 횟수만큼 계속 쓸 수 있음.
export async function POST(request: NextRequest) {
  try {
    const { partnerId, newTier, paidAmount } = await request.json();
    if (!partnerId || !newTier) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    const partnerSnap = await db.ref(`partners/${partnerId}`).once("value");
    const partner = partnerSnap.val();
    if (!partner) {
      return NextResponse.json({ error: "파트너 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    const currentTier = partner.tier || "free";
    if (getTierIndex(newTier) <= getTierIndex(currentTier)) {
      return NextResponse.json({ error: "현재보다 높은 등급으로만 업그레이드할 수 있습니다." }, { status: 400 });
    }

    const upgradeFee = calculateUpgradeFee(currentTier, newTier);

    // 이번 달 이미 사용한 건수(업그레이드 후에도 그대로 누적 유지)
    const archiveSnap = await db.ref(`partnerArchive/${partnerId}`).once("value");
    const entries = Object.values(archiveSnap.val() || {}) as Array<{ createdAt: string }>;
    const now = new Date();
    const usedThisMonth = entries.filter(e => {
      const d = new Date(e.createdAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;

    await db.ref(`partners/${partnerId}`).update({ tier: newTier });

    // 가입비와 동일하게, 업그레이드 결제내역도 기록(실제 결제 연동 전 시뮬레이션 단계)
    await db.ref(`partners/${partnerId}/payments`).push({
      type: "upgrade", tier: newTier, amount: paidAmount ?? upgradeFee, paidAt: new Date().toISOString(),
    });

    const newTierInfo = getPartnerTier(newTier);
    const remaining = newTierInfo.monthlyLimit === null ? null : Math.max(0, newTierInfo.monthlyLimit - usedThisMonth);

    return NextResponse.json({
      success: true, upgradeFee, newTier, usedThisMonth, remainingThisMonth: remaining,
    });
  } catch (error) {
    console.error("Partner upgrade error:", error);
    return NextResponse.json({ error: "업그레이드 처리 실패" }, { status: 500 });
  }
}
