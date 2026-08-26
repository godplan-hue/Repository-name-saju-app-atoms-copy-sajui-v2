import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { isFakePhone } from "@/lib/fakePhone";

const STEMS = ["경","신","임","계","갑","을","병","정","무","기"];
const OH_MAP: Record<string,string> = {
  "갑":"목","을":"목","병":"화","정":"화","무":"토","기":"토","경":"금","신":"금","임":"수","계":"수"
};
function getOh(year: number): string {
  return OH_MAP[STEMS[year % 10]] || "목";
}

// 오행 소울카드 (대아르카나 인덱스)
const SOUL_CARD: Record<string, number> = { 목: 21, 화: 19, 토: 3, 금: 11, 수: 2 };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, birthYear, birthMonth, birthDay, topic } = body;
    const marketing = body.marketing === true;

    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (cleanPhone.length < 10) return NextResponse.json({ error: "전화번호를 입력해주세요" }, { status: 400 });
    if (!birthYear || String(birthYear).length < 4) return NextResponse.json({ error: "생년을 입력해주세요" }, { status: 400 });

    const oh = getOh(Number(birthYear));
    const soulCardIdx = SOUL_CARD[oh] ?? 0;

    // 오늘 날짜 + 전화번호 끝 4자리 + 시간 기반 시드로 카드 선택
    const seed = (Number(birthYear) * 13 + Number(birthMonth || 1) * 7 + Number(birthDay || 1) * 3 + (Date.now() % 10000));
    let cardIdx = seed % 22;
    // 소울카드와 다른 카드가 나오도록
    if (cardIdx === soulCardIdx) cardIdx = (cardIdx + 11) % 22;

    const result = {
      name: name || "",
      phone: cleanPhone,
      email: email || "",
      marketing,
      birthYear: Number(birthYear),
      birthMonth: Number(birthMonth || 1),
      birthDay: Number(birthDay || 1),
      topic: topic || "today",
      oh,
      soulCardIdx,
      cardIdx,
      createdAt: Date.now(),
    };

    const ref = isFakePhone(cleanPhone) ? null : await db.ref("tarot_analyses").push(result);
    return NextResponse.json({ id: ref ? ref.key : null, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "분석 중 오류" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id 없음" }, { status: 400 });
    const snap = await db.ref(`tarot_analyses/${id}`).once("value");
    if (!snap.exists()) return NextResponse.json({ error: "결과 없음" }, { status: 404 });
    return NextResponse.json({ result: snap.val() });
  } catch {
    return NextResponse.json({ error: "오류" }, { status: 500 });
  }
}
