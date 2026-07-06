import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FREE";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const TEASERS: Record<string, string> = {
  "목": "올해는 새로운 시작과 성장의 기운이 강해요. 새로운 수입원이 생기거나 기존 수입이 늘어날 가능성이 보여요. 서두르지 않고 탄탄하게 준비하는 것이 중요해요.",
  "화": "적극적으로 움직일수록 재물이 따르는 시기예요. 인맥을 통한 기회가 특히 많고, 투자보다 직접 활동으로 버는 것이 유리해요.",
  "토": "안정적이고 꾸준한 재물운이 흐르는 시기예요. 큰 수익보다 작지만 확실한 수입이 쌓이는 흐름이에요. 저축과 절약이 가장 큰 재물운이에요.",
  "금": "결단력 있게 움직이면 재물이 따르는 시기예요. 지나친 욕심은 오히려 손해를 부를 수 있어요. 선택과 집중이 핵심이에요.",
  "수": "여러 곳에서 조금씩 들어오는 재물 흐름이에요. 정보와 지식을 통해 수익을 올리기 좋은 시기예요. 지출 관리가 가장 중요해요.",
};

function getOhaeng(year: number): string {
  const r = year % 10;
  if (r === 4 || r === 5) return "목";
  if (r === 6 || r === 7) return "화";
  if (r === 8 || r === 9) return "토";
  if (r === 0 || r === 1) return "금";
  return "수";
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, birthYear } = await request.json();
    if (!phone || !name) return NextResponse.json({ error: "이름과 전화번호가 필요합니다." }, { status: 400 });

    const cleanPhone = String(phone).replace(/\D/g, "");

    // 중복 방지
    const existingSnap = await db.ref(`free_leads/${cleanPhone}`).once("value");
    if (existingSnap.exists()) {
      const existing = existingSnap.val();
      return NextResponse.json({ code: existing.code, teaser: existing.teaser, alreadyUsed: true });
    }

    let code = "";
    for (let i = 0; i < 5; i++) {
      const candidate = genCode();
      const snap = await db.ref(`promoCodes/${candidate}`).once("value");
      if (!snap.exists()) { code = candidate; break; }
    }
    if (!code) return NextResponse.json({ error: "코드 생성 실패" }, { status: 500 });

    const ohaeng = getOhaeng(Number(birthYear) || 1990);
    const teaser = TEASERS[ohaeng];

    await db.ref(`free_leads/${cleanPhone}`).set({
      phone: cleanPhone,
      name,
      birthYear: birthYear || "",
      code,
      teaser,
      createdAt: Date.now(),
      used: false,
    });

    await db.ref(`promoCodes/${code}`).set({
      discountPercent: 100,
      note: "무료재물운랜딩",
      active: true,
      usageCount: 0,
      maxUsage: 1,
    });

    return NextResponse.json({ code, teaser });
  } catch (error) {
    console.error("Free lead error:", error);
    return NextResponse.json({ error: "발급 실패" }, { status: 500 });
  }
}
