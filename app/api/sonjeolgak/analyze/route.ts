import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { isFakePhone } from "@/lib/fakePhone";

const PART_LABELS: Record<string, string> = {
  friend: "친구",
  love: "연인",
  ex: "전애인",
  some: "썸·바람 상대",
  work: "직장 사람",
  family: "가족",
  travel: "여행 동행자",
};

type CatType = {
  name: string; emoji: string; color: string; min: number;
  tagline: string; desc: string; advice: string;
};

const TYPES: CatType[] = [
  { name: "칼단호 고양이", emoji: "🗡️", color: "#ef4444", min: 88, tagline: "정 없는 게 아니라 판단이 빠른 것", desc: "이미 마음속에서는 결론이 났어요. 미련이나 재고의 여지 없이 칼같이 정리하는 타입이에요.", advice: "가끔은 단호함이 관계를 지키는 힘이 되기도 하지만, 너무 성급하게 끊어내진 않았는지 한 번쯤 돌아보는 것도 좋아요." },
  { name: "쿨거리 고양이", emoji: "😎", color: "#f97316", min: 76, tagline: "감정 소모는 딱 질색, 쿨하게 거리두기", desc: "손절까지는 아니어도 스스로를 지키기 위해 자연스럽게 거리를 두는 스타일이에요. 티는 안 나지만 마음은 이미 반쯤 정리됐어요.", advice: "쿨한 거리두기도 좋지만, 정말 소중한 관계라면 한 번쯤은 솔직한 대화를 시도해보세요." },
  { name: "선긋기 고양이", emoji: "📏", color: "#eab308", min: 64, tagline: "관계에도 선이 필요하다는 걸 아는 사람", desc: "완전히 손절하진 않지만 넘지 말아야 할 선은 확실히 긋는 타입이에요. 균형 감각이 좋은 편이에요.", advice: "선을 긋는 것과 마음을 닫는 것은 다르다는 걸 기억하세요. 필요할 땐 선을 조금 넓혀줘도 괜찮아요." },
  { name: "눈치백단 고양이", emoji: "👀", color: "#84cc16", min: 52, tagline: "분위기부터 파악하고 움직이는 신중파", desc: "바로 정리하기보다 상황을 살피고 눈치껏 판단하는 스타일이에요. 성급한 결정보다 관찰을 먼저 해요.", advice: "너무 오래 눈치만 보다가 타이밍을 놓치지 않도록, 판단이 섰다면 행동으로 옮기는 연습도 필요해요." },
  { name: "우유부단 고양이", emoji: "🤔", color: "#22c55e", min: 40, tagline: "끊자니 아쉽고, 잡자니 애매한 마음", desc: "손절해야 하나 계속 고민만 하다가 결정을 못 내리는 타입이에요. 정을 쉽게 놓지 못해요.", advice: "결정을 미루는 동안 스스로 더 지칠 수 있어요. 마감 기한을 정해두고 결정해보는 것도 방법이에요." },
  { name: "정많은 고양이", emoji: "🥹", color: "#14b8a6", min: 28, tagline: "미운 정 고운 정 다 든 게 함정", desc: "서운한 일이 있어도 그동안 쌓인 정 때문에 쉽게 손절하지 못하는 타입이에요. 사람을 참 오래 품는 편이에요.", advice: "정도 소중하지만 나를 갉아먹는 관계라면 정 때문에 계속 참지 않아도 괜찮아요." },
  { name: "집착냥이", emoji: "😿", color: "#3b82f6", min: 15, tagline: "놓으면 큰일 날 것 같은 불안함", desc: "관계가 흔들려도 놓지 못하고 붙잡는 타입이에요. 손절은커녕 오히려 더 매달리게 돼요.", advice: "집착할수록 관계는 더 힘들어질 수 있어요. 나 자신을 먼저 돌보는 시간을 가져보세요." },
  { name: "올인집사 고양이", emoji: "💞", color: "#a855f7", min: 0, tagline: "이 관계에 내 모든 걸 걸었어요", desc: "상대가 어떻게 하든 끝까지 곁을 지키는 타입이에요. 손절이라는 단어 자체가 낯설게 느껴져요.", advice: "헌신은 아름답지만 일방적인 관계는 결국 지치게 만들어요. 나에게도 마음을 좀 나눠주세요." },
];

function getType(score: number): CatType {
  return TYPES.find(t => score >= t.min) || TYPES[TYPES.length - 1];
}

function getMatch(score: number) {
  const idx = TYPES.findIndex(t => score >= t.min);
  const i = idx < 0 ? TYPES.length - 1 : idx;
  const best = TYPES[(i + 3) % TYPES.length];
  const worst = TYPES[(TYPES.length - 1 - i + TYPES.length) % TYPES.length];
  return { best: best.name, bestEmoji: best.emoji, worst: worst.name, worstEmoji: worst.emoji };
}

function getRank(score: number): number {
  return Math.max(3, Math.round((110 - score) * 0.7));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, email, part, score } = body;
    const marketing = body.marketing === true;

    if (!part || !PART_LABELS[part] || typeof score !== "number") {
      return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
    }

    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    const type = getType(clamped);
    const match = getMatch(clamped);
    const rank = getRank(clamped);
    const relLabel = PART_LABELS[part];

    const result = {
      phone: phone || "",
      email: email || "",
      marketing,
      name: name || "익명",
      part,
      partLabel: relLabel,
      score: clamped,
      typeName: type.name,
      typeEmoji: type.emoji,
      typeColor: type.color,
      tagline: type.tagline,
      description: type.desc.replaceAll("관계", `${relLabel}와의 관계`),
      advice: type.advice,
      bestMatch: match.best,
      bestMatchEmoji: match.bestEmoji,
      worstMatch: match.worst,
      worstMatchEmoji: match.worstEmoji,
      rank,
      createdAt: Date.now(),
    };

    const ref = isFakePhone(phone) ? null : await db.ref("sonjeolgak_analyses").push(result);
    return NextResponse.json({ id: ref ? ref.key : null, result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id 없음" }, { status: 400 });
    const snap = await db.ref(`sonjeolgak_analyses/${id}`).once("value");
    if (!snap.exists()) return NextResponse.json({ error: "결과 없음" }, { status: 404 });
    return NextResponse.json({ result: snap.val() });
  } catch (e) {
    return NextResponse.json({ error: "오류" }, { status: 500 });
  }
}
