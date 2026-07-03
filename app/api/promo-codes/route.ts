import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

// 일반 고객용 할인코드 — 파트너와 무관하게, 관리자가 원하는 사람에게만
// 원하는 할인율(20/30/50/70/100% 등 자유)을 줄 수 있는 프로모션 코드.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    const snap = await db.ref(`promoCodes/${code.trim().toUpperCase()}`).once("value");
    const found = snap.val();
    if (!found || !found.active) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
    return NextResponse.json({ found: true, ...found, code: code.trim().toUpperCase() });
  }

  const snap = await db.ref("promoCodes").once("value");
  const all = snap.val() || {};
  const list = Object.entries(all).map(([key, value]) => ({ code: key, ...(value as object) }));
  return NextResponse.json({ codes: list });
}

export async function POST(request: NextRequest) {
  try {
    const { code, discountPercent, note, maxUses } = await request.json();
    if (!code || discountPercent === undefined || discountPercent === null) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }
    const key = String(code).trim().toUpperCase();
    // maxUses: -1 = 무제한, 1+ = N회 사용 후 비활성화
    await db.ref(`promoCodes/${key}`).set({ discountPercent, note: note || "", active: true, usageCount: 0, maxUses: maxUses ?? 1 });
    return NextResponse.json({ success: true, code: key });
  } catch (error) {
    console.error("Promo code create error:", error);
    return NextResponse.json({ error: "할인코드 생성 실패" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) return NextResponse.json({ error: "코드가 필요합니다." }, { status: 400 });
    const key = String(code).trim().toUpperCase();
    await db.ref(`promoCodes/${key}`).remove();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Promo code delete error:", error);
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 });
  }
}

// 결제 시점에 호출 — 사용 횟수 증가 + 최종 검증
export async function PATCH(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return NextResponse.json({ error: "코드가 필요합니다." }, { status: 400 });
    const key = String(code).trim().toUpperCase();
    const ref = db.ref(`promoCodes/${key}`);
    const snap = await ref.once("value");
    const found = snap.val();
    if (!found || !found.active) {
      return NextResponse.json({ error: "유효하지 않은 코드입니다." }, { status: 404 });
    }
    const newUsageCount = (found.usageCount || 0) + 1;
    const maxUses = found.maxUses ?? 1;
    // maxUses === -1: 무제한 (비활성화 안 함), 그 외: N회 사용 시 비활성화
    const shouldDeactivate = maxUses !== -1 && newUsageCount >= maxUses;
    await ref.update({ usageCount: newUsageCount, ...(shouldDeactivate ? { active: false } : {}) });
    return NextResponse.json({ success: true, discountPercent: found.discountPercent });
  } catch (error) {
    console.error("Promo code use error:", error);
    return NextResponse.json({ error: "코드 사용 처리 실패" }, { status: 500 });
  }
}
