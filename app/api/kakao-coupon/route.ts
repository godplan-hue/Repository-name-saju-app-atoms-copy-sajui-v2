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

    // 중복 발급 방지
    const existingSnap = await db
      .ref("kakao_share_coupons")
      .orderByChild("phone")
      .equalTo(cleanPhone)
      .limitToFirst(1)
      .once("value");
    const existing = existingSnap.val();
    if (existing) {
      const [, lead] = Object.entries(existing)[0] as [string, any];
      return NextResponse.json({ code: lead.code });
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

    await db.ref(`kakao_share_coupons/${code}`).set({
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
