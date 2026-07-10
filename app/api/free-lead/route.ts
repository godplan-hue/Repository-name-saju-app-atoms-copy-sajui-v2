import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

function genCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FREE";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

const TEASERS: Record<string, string> = {
  "목": "올해는 새로운 시작과 성장의 기운이 강해요.\n새로운 수입원이 생기거나 기존 수입이 늘어날 가능성이 보여요.\n서두르지 않고 탄탄하게 준비하는 것이 중요해요.",
  "화": "적극적으로 움직일수록 재물이 따르는 시기예요.\n인맥을 통한 기회가 특히 많고, 투자보다 직접 활동으로 버는 것이 유리해요.\n지금 움직이는 사람이 가져갑니다.",
  "토": "안정적이고 꾸준한 재물운이 흐르는 시기예요.\n큰 수익보다 작지만 확실한 수입이 쌓이는 흐름이에요.\n저축과 절약이 가장 큰 재물운이에요.",
  "금": "결단력 있게 움직이면 재물이 따르는 시기예요.\n지나친 욕심은 오히려 손해를 부를 수 있어요.\n선택과 집중이 핵심이에요.",
  "수": "여러 곳에서 조금씩 들어오는 재물 흐름이에요.\n정보와 지식을 통해 수익을 올리기 좋은 시기예요.\n지출 관리가 가장 중요해요.",
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
    const { name, phone, email } = await request.json();
    if (!phone || !name) return NextResponse.json({ error: "이름과 전화번호가 필요합니다." }, { status: 400 });

    const cleanPhone = String(phone).replace(/\D/g, "");

    // 동일 전번 중복 신청 차단
    const existing = await db.ref(`free_leads/${cleanPhone}`).once("value");
    if (existing.exists()) {
      return NextResponse.json({ duplicate: true });
    }

    // 쿠폰코드 생성 (최대 5회 충돌 방지)
    let code = "";
    for (let i = 0; i < 5; i++) {
      const candidate = genCode();
      const snap = await db.ref(`promoCodes/${candidate}`).once("value");
      if (!snap.exists()) { code = candidate; break; }
    }
    if (!code) code = genCode();

    await db.ref(`free_leads/${cleanPhone}`).set({
      phone: cleanPhone,
      name,
      email: email || "",
      source: "free",
      code,
      used: false,
      createdAt: Date.now(),
    });

    // promoCodes에 등록해야 결제 시 실제 사용 가능
    await db.ref(`promoCodes/${code}`).set({
      discountPercent: 30,
      note: "무료재물운쿠폰",
      active: true,
      usageCount: 0,
      maxUses: 1,
    });

    return NextResponse.json({ ok: true, code });
  } catch (error) {
    console.error("Free lead error:", error);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
