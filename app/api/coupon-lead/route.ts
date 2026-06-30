import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "JM";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json();
    if (!phone) return NextResponse.json({ error: "연락처가 필요합니다." }, { status: 400 });

    const cleanPhone = String(phone).replace(/\D/g, "");

    // 같은 번호로 이미 발급된 코드 확인
    const existingSnap = await db.ref("coupon_leads").orderByChild("phone").equalTo(cleanPhone).limitToFirst(1).once("value");
    const existing = existingSnap.val();
    if (existing) {
      const [, lead] = Object.entries(existing)[0] as [string, any];
      return NextResponse.json({ code: lead.code });
    }

    // 새 코드 생성 (충돌 방지: 최대 5회 시도)
    let code = "";
    for (let i = 0; i < 5; i++) {
      const candidate = genCode();
      const snap = await db.ref(`promoCodes/${candidate}`).once("value");
      if (!snap.exists()) { code = candidate; break; }
    }
    if (!code) return NextResponse.json({ error: "코드 생성 실패" }, { status: 500 });

    await db.ref(`coupon_leads/${code}`).set({
      phone: cleanPhone,
      name: name || "",
      code,
      createdAt: Date.now(),
      used: false,
    });

    await db.ref(`promoCodes/${code}`).set({
      discountPercent: 30,
      note: "무료운세쿠폰",
      active: true,
      usageCount: 0,
    });

    return NextResponse.json({ code });
  } catch (error) {
    console.error("Coupon lead error:", error);
    return NextResponse.json({ error: "쿠폰 발급 실패" }, { status: 500 });
  }
}
