import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const MOOD_INFO: Record<number, { label: string; emoji: string; oh: string }> = {
  5: { label: "최고!", emoji: "😄", oh: "화" },
  4: { label: "좋음",  emoji: "🙂", oh: "목" },
  3: { label: "보통",  emoji: "😐", oh: "토" },
  2: { label: "나쁨",  emoji: "😔", oh: "수" },
  1: { label: "끔찍함",emoji: "😢", oh: "금" },
};

const OH_CONTENT: Record<string, {
  emoji: string; keyword: string; bg: string;
  messages: string[]; tips: string[];
}> = {
  화: {
    emoji: "🔥",
    keyword: "기쁨 · 열정 · 빛남",
    bg: "linear-gradient(135deg,#78350f,#f59e0b)",
    messages: [
      "오늘 당신의 에너지는 화(火) — 활활 타오르는 불꽃처럼 빛나고 있어요.",
      "이 기쁨과 열정의 에너지는 주변 사람들에게도 온기를 전달해요.",
      "화(火)의 날에는 감정을 나누는 것이 가장 큰 선물이에요.",
    ],
    tips: [
      "이 좋은 에너지를 소중한 사람과 나눠보세요",
      "기분 좋을 때 미뤄두었던 중요한 일에 도전하기 딱 좋아요",
      "오늘의 감사한 것 3가지를 떠올려 기분을 더 오래 유지해보세요",
    ],
  },
  목: {
    emoji: "🌱",
    keyword: "성장 · 희망 · 앞으로",
    bg: "linear-gradient(135deg,#14532d,#4ade80)",
    messages: [
      "목(木) 에너지가 싹트는 날이에요. 꾸준히 나아가는 힘이 지금 당신 안에 있어요.",
      "좋은 에너지는 씨앗처럼 — 지금 심는 것이 나중에 크게 자라요.",
    ],
    tips: [
      "지금 이 좋은 흐름으로 새로운 계획을 세워보세요",
      "작은 목표 하나를 이루는 하루로 만들어보세요",
      "몸과 마음이 자라는 활동 — 산책, 스트레칭을 추천해요",
    ],
  },
  토: {
    emoji: "🌍",
    keyword: "균형 · 안정 · 평온",
    bg: "linear-gradient(135deg,#3f2a00,#d97706)",
    messages: [
      "토(土)의 고요한 하루예요. 흥분도 침체도 아닌 — 이 균형 자체가 내 힘이에요.",
      "보통의 하루도 차곡차곡 쌓이면 단단한 대지가 돼요.",
    ],
    tips: [
      "차분하게 정리하기 딱 좋은 때예요. 방·마음·계획 모두",
      "평범한 오늘에 감사한 것 한 가지를 찾아보세요",
      "보통인 날은 재충전의 날 — 무리하지 말고 편히 쉬세요",
    ],
  },
  수: {
    emoji: "💧",
    keyword: "감성 · 성찰 · 흐름",
    bg: "linear-gradient(135deg,#1e3a5f,#60a5fa)",
    messages: [
      "수(水)의 감성이 깊어지는 날이에요. 흐르는 물처럼 지금의 감정도 흘러가게 두세요.",
      "힘든 감정을 억지로 바꾸려 하지 마세요 — 느끼는 것이 치유의 시작이에요.",
    ],
    tips: [
      "지금 느끼는 감정을 억지로 바꾸려 하지 마세요",
      "따뜻한 차 한 잔, 좋아하는 음악 한 곡으로 스스로를 돌봐주세요",
      "이 감정의 원인을 종이에 적어보면 조금 더 가벼워져요",
    ],
  },
  금: {
    emoji: "⚡",
    keyword: "단련 · 내공 · 회복",
    bg: "linear-gradient(135deg,#1f1f3a,#a78bfa)",
    messages: [
      "금(金)이 단련되는 시간이에요. 가장 힘든 순간이 가장 강해지는 순간이기도 해요.",
      "지금 버티는 것 자체가 대단한 용기예요. 오늘 하루만 잘 마무리해보세요.",
    ],
    tips: [
      "지금 이 순간, 버티는 것 자체가 대단한 용기예요",
      "믿을 수 있는 사람에게 털어놓는 것만으로도 절반은 가벼워져요",
      "내일은 달라질 수 있어요 — 오늘 먼저 잘 마무리해보세요",
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, moodScore, activities, memo } = body;

    const cleanPhone = String(phone || "").replace(/\D/g, "");
    if (cleanPhone.length < 10) return NextResponse.json({ error: "전화번호를 입력해주세요" }, { status: 400 });

    const score = Number(moodScore) || 3;
    const moodInfo = MOOD_INFO[score] || MOOD_INFO[3];
    const ohContent = OH_CONTENT[moodInfo.oh];

    const result = {
      name: name || "",
      phone: cleanPhone,
      email: email || "",
      moodScore: score,
      moodLabel: moodInfo.label,
      moodEmoji: moodInfo.emoji,
      activities: activities || [],
      memo: memo || "",
      oh: moodInfo.oh,
      ohEmoji: ohContent.emoji,
      ohKeyword: ohContent.keyword,
      ohBg: ohContent.bg,
      ohMessages: ohContent.messages,
      ohTips: ohContent.tips,
      createdAt: Date.now(),
    };

    const ref = db.ref("gamjung_analyses").push();
    await ref.set(result);
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
    const snap = await db.ref(`gamjung_analyses/${id}`).once("value");
    if (!snap.exists()) return NextResponse.json({ error: "결과 없음" }, { status: 404 });
    return NextResponse.json({ result: snap.val() });
  } catch {
    return NextResponse.json({ error: "오류" }, { status: 500 });
  }
}
