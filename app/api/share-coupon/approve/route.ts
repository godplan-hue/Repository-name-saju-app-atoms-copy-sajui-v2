import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FREE";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function createUniqueCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const candidate = genCode();
    const snap = await db.ref(`promoCodes/${candidate}`).once("value");
    if (!snap.exists()) return candidate;
  }
  throw new Error("코드 생성 실패");
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: "전화번호 필요" }, { status: 400 });

    const cleanPhone = String(phone).replace(/\D/g, "");

    // 이미 승인됐는지 체크
    const approvedSnap = await db.ref(`share_coupons/${cleanPhone}`).once("value");
    if (approvedSnap.exists()) {
      return NextResponse.json({ error: "이미 발급된 번호입니다." }, { status: 400 });
    }

    // 쿠폰 10장 생성
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) codes.push(await createUniqueCode());

    for (const code of codes) {
      await db.ref(`promoCodes/${code}`).set({
        discountPercent: 100,
        maxAmount: 990,
        note: "SNS후기쿠폰(990원)",
        active: true,
        usageCount: 0,
        maxUses: 1,
      });
    }

    // 승인 완료 저장
    await db.ref(`share_coupons/${cleanPhone}`).set({
      phone: cleanPhone,
      codes,
      note: "SNS 후기 990원 × 10장",
      createdAt: Date.now(),
    });

    // 대기 상태 삭제
    await db.ref(`share_coupon_pending/${cleanPhone}`).remove();

    return NextResponse.json({ codes });

  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: "승인 실패" }, { status: 500 });
  }
}
