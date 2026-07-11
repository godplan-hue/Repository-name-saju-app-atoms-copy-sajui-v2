import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const STEMS = ["경","신","임","계","갑","을","병","정","무","기"];
const OH_MAP: Record<string,string> = {
  "갑":"목","을":"목","병":"화","정":"화","무":"토","기":"토","경":"금","신":"금","임":"수","계":"수"
};
function getOh(year: number): string {
  return OH_MAP[STEMS[year % 10]] || "목";
}

// 생월일 → 별자리
function getZodiac(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "양자리";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "황소자리";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "쌍둥이자리";
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "게자리";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "사자자리";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "처녀자리";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "천칭자리";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 22)) return "전갈자리";
  if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "사수자리";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "염소자리";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "물병자리";
  return "물고기자리";
}

// 별자리별 원소 (서양 4원소)
const ZODIAC_ELEMENT: Record<string,string> = {
  "양자리":"불","사자자리":"불","사수자리":"불",
  "황소자리":"흙","처녀자리":"흙","염소자리":"흙",
  "쌍둥이자리":"바람","천칭자리":"바람","물병자리":"바람",
  "게자리":"물","전갈자리":"물","물고기자리":"물",
};

// 오행×별자리 교차 키워드
function getCrossKey(oh: string, zodiac: string): string {
  const elem = ZODIAC_ELEMENT[zodiac] || "불";
  const map: Record<string,Record<string,string>> = {
    목: { 불:"성장의 불꽃", 흙:"뿌리깊은 대지", 바람:"봄바람의 변화", 물:"생명의 원천" },
    화: { 불:"열정의 이중불꽃", 흙:"따뜻한 대지", 바람:"열풍의 기운", 물:"끓어오르는 에너지" },
    토: { 불:"단단한 중심", 흙:"대지의 안정", 바람:"무거운 바람", 물:"깊은 호수" },
    금: { 불:"단련된 금속", 흙:"광물의 보고", 바람:"날카로운 바람", 물:"맑은 흐름" },
    수: { 불:"증기의 지혜", 흙:"깊은 땅속 물", 바람:"구름의 흐름", 물:"심해의 직관" },
  };
  return map[oh]?.[elem] || "우주의 에너지";
}

// 날짜 기반 점수 (시드: 별자리+오늘날짜)
function getScore(zodiac: string, category: string): number {
  const today = new Date();
  const seed = zodiac.charCodeAt(0) + zodiac.charCodeAt(1) + today.getDate() * 7 + today.getMonth() * 31 + category.charCodeAt(0);
  return 55 + (seed % 40); // 55~94
}

// 행운 아이템
const LUCKY_COLOR: Record<string,string[]> = {
  "양자리":["빨강","흰색"],"황소자리":["초록","분홍"],"쌍둥이자리":["노랑","연하늘"],
  "게자리":["은색","흰색"],"사자자리":["금색","주황"],"처녀자리":["연두","베이지"],
  "천칭자리":["분홍","하늘"],"전갈자리":["검정","자주"],"사수자리":["보라","파랑"],
  "염소자리":["회색","갈색"],"물병자리":["하늘","보라"],"물고기자리":["라벤더","민트"],
};
const LUCKY_NUMBER: Record<string,number[]> = {
  "양자리":[1,9],"황소자리":[2,6],"쌍둥이자리":[3,5],"게자리":[2,7],
  "사자자리":[1,4],"처녀자리":[5,6],"천칭자리":[6,9],"전갈자리":[8,9],
  "사수자리":[3,7],"염소자리":[8,10],"물병자리":[4,7],"물고기자리":[3,9],
};
const LUCKY_DIRECTION: Record<string,string> = {
  "양자리":"동쪽","황소자리":"남쪽","쌍둥이자리":"서쪽","게자리":"북쪽",
  "사자자리":"동남쪽","처녀자리":"남서쪽","천칭자리":"서쪽","전갈자리":"북쪽",
  "사수자리":"동쪽","염소자리":"남쪽","물병자리":"동북쪽","물고기자리":"북서쪽",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, birthYear, birthMonth, birthDay, zodiacDirect } = body;

    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (cleanPhone.length < 10) return NextResponse.json({ error: "전화번호를 입력해주세요" }, { status: 400 });

    const month = Number(birthMonth) || 0;
    const day = Number(birthDay) || 0;
    const year = Number(birthYear) || 0;

    const zodiac = zodiacDirect || (month && day ? getZodiac(month, day) : "양자리");
    const oh = year ? getOh(year) : "";
    const crossKey = oh ? getCrossKey(oh, zodiac) : "";

    const loveScore = getScore(zodiac, "love");
    const workScore = getScore(zodiac, "work");
    const healthScore = getScore(zodiac, "health");
    const totalScore = Math.round((loveScore + workScore + healthScore) / 3);

    const result = {
      name: name || "",
      phone: cleanPhone,
      email: email || "",
      birthYear: year,
      birthMonth: month,
      birthDay: day,
      zodiac,
      oh,
      crossKey,
      loveScore,
      workScore,
      healthScore,
      totalScore,
      luckyColors: LUCKY_COLOR[zodiac] || ["흰색"],
      luckyNumbers: LUCKY_NUMBER[zodiac] || [7],
      luckyDirection: LUCKY_DIRECTION[zodiac] || "동쪽",
      createdAt: Date.now(),
    };

    const ref = await db.ref("zodiac_analyses").push(result);
    return NextResponse.json({ id: ref.key, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "분석 중 오류" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id 없음" }, { status: 400 });
    const snap = await db.ref(`zodiac_analyses/${id}`).once("value");
    if (!snap.exists()) return NextResponse.json({ error: "결과 없음" }, { status: 404 });
    return NextResponse.json({ result: snap.val() });
  } catch {
    return NextResponse.json({ error: "오류" }, { status: 500 });
  }
}
