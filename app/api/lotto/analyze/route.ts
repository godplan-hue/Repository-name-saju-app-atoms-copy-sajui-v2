import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const STEMS = ["경","신","임","계","갑","을","병","정","무","기"];
const OH_MAP: Record<string, string> = {
  "갑":"목","을":"목","병":"화","정":"화","무":"토","기":"토","경":"금","신":"금","임":"수","계":"수",
};

const OH_POOL: Record<string, number[]> = {
  목: [3,8,13,18,23,28,33,38,43],
  화: [2,7,12,17,22,27,32,37,42],
  토: [5,10,15,20,25,30,35,40,45],
  금: [4,9,14,19,24,29,34,39,44],
  수: [1,6,11,16,21,26,31,36,41],
};

const OH_DESC: Record<string, string> = {
  목: "성장과 시작의 기운 목오행. 3·8 계열 숫자에 행운 에너지가 집중됩니다.",
  화: "열정과 표현의 기운 화오행. 2·7 계열 불꽃 에너지가 행운을 이끕니다.",
  토: "안정과 신뢰의 기운 토오행. 5·10 계열 대지 에너지가 행운을 품습니다.",
  금: "결단과 집중의 기운 금오행. 4·9 계열 날카로운 에너지가 행운을 부릅니다.",
  수: "지혜와 직관의 기운 수오행. 1·6 계열 흐르는 에너지가 행운을 담습니다.",
};

const OH_TIP: Record<string, string> = {
  목: "목요일이나 봄(3~5월)에 구매하면 오행 기운이 더 강해져요.",
  화: "화요일이나 여름(6~8월)에 구매하면 불꽃 운이 오릅니다.",
  토: "토요일 이른 아침 구매가 대지 에너지와 가장 잘 맞아요.",
  금: "금요일에 구매하면 금오행 기운이 극대화됩니다.",
  수: "수요일이나 겨울(12~2월)에 구매하면 지혜 운이 깊어져요.",
};

function getOh(year: number): string {
  return OH_MAP[STEMS[year % 10]] || "토";
}

function generateNumbers(year: number, month: number, day: number, oh: string): { main: number[]; bonus: number } {
  let seed = year * 10000 + month * 100 + day;
  const lcg = (): number => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return seed >>> 0;
  };

  const ohPool = [...(OH_POOL[oh] || OH_POOL["토"])];
  const picked = new Set<number>();

  // 오행 풀 셔플 후 3개 선택
  for (let i = ohPool.length - 1; i > 0; i--) {
    const j = lcg() % (i + 1);
    [ohPool[i], ohPool[j]] = [ohPool[j], ohPool[i]];
  }
  for (let i = 0; i < 3; i++) picked.add(ohPool[i]);

  // 나머지 4개를 전체 풀에서 채움
  const remaining = Array.from({ length: 45 }, (_, i) => i + 1).filter(n => !picked.has(n));
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = lcg() % (i + 1);
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }
  for (let i = 0; picked.size < 7; i++) picked.add(remaining[i]);

  const sorted = Array.from(picked).sort((a, b) => a - b);
  const bonus = sorted.splice(Math.floor(sorted.length / 2), 1)[0];
  const main = sorted;

  return { main, bonus };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name?: string; phone?: string; email?: string; birthYear: number; birthMonth: number; birthDay: number; marketing?: boolean };
    const { name, phone, email, birthYear, birthMonth, birthDay } = body;
    const marketing = body.marketing === true;

    if (!birthYear || !birthMonth || !birthDay) {
      return NextResponse.json({ error: "생년월일 필요" }, { status: 400 });
    }

    const oh = getOh(Number(birthYear));
    const { main, bonus } = generateNumbers(Number(birthYear), Number(birthMonth), Number(birthDay), oh);

    const result = {
      name: name || "",
      phone: phone || "",
      email: email || "",
      marketing,
      birthYear: Number(birthYear),
      birthMonth: Number(birthMonth),
      birthDay: Number(birthDay),
      oh,
      ohDesc: OH_DESC[oh] || "",
      ohTip: OH_TIP[oh] || "",
      main,
      bonus,
      createdAt: Date.now(),
    };

    const ref = db.ref("lotto_analyses").push();
    await ref.set(result);
    return NextResponse.json({ id: ref.key, ...result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const snap = await db.ref(`lotto_analyses/${id}`).get();
    if (!snap.exists()) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ id, ...snap.val() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
