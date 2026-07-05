import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "KAKAO";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: "전화번호를 입력해주세요." }, { status: 400 });

    const cleanPhone = String(phone).replace(/\D/g, "");

    // 중복 발급 방지 — 전화번호를 키로 직접 읽기 (쿼리보다 안전)
    const existingSnap = await db.ref(`kakao_share_coupons/${cleanPhone}`).once("value");
    if (existingSnap.exists()) {
      return NextResponse.json({ code: existingSnap.val().code });
    }

    // 고유 코드 생성
    let code = "";
    for (let i = 0; i < 5; i++) {
      const candidate = genCode();
      const snap = await db.ref(`promoCodes/${candidate}`).once("value");
      if (!snap.exists()) { code = candidate; break; }
    }
    if (!code) return NextResponse.json({ error: "코드 생성 실패" }, { status: 500 });

    await db.ref(`promoCodes/${code}`).set({
      discountPercent: 100,
      maxAmount: 990,
      note: "카카오공유무료쿠폰",
      active: true,
      usageCount: 0,
    });

    // 전화번호를 키로 저장 — 같은 번호로 중복 발급 원천 차단
    await db.ref(`kakao_share_coupons/${cleanPhone}`).set({
      phone: cleanPhone,
      code,
      createdAt: Date.now(),
    });

    return NextResponse.json({ code });
  } catch (err) {
    console.error("Kakao coupon error:", err);
    return NextResponse.json({ error: "쿠폰 발급 실패" }, { status: 500 });
  }
}
