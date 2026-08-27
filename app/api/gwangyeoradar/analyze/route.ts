import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { isFakePhone } from "@/lib/fakePhone";

// ─────────────────────────────────────────────────────────
// 연락기록통계 점운 (연락통신) — 분석 엔진
// 실시간 AI 호출 없음. 입력값 → 점수화 규칙 → 템플릿 문구 매핑만 사용.
// ─────────────────────────────────────────────────────────

type RelationType = "썸" | "연인" | "전연인" | "친구" | "직장동료" | "가족" | "기타";
type ContactChange = "많아짐" | "비슷" | "조금줄음" | "많이줄음" | "거의없음" | "모르겠음";
type ContactInitiative = "거의상대방" | "상대방조금많음" | "비슷" | "내가조금많음" | "거의나" | "연락자체거의없음";
type ResponseChange = "빨라짐" | "비슷" | "조금느려짐" | "많이느려짐" | "짧아짐" | "모르겠음";
type MeetingChange = "상대방이먼저제안" | "비슷" | "내가더제안" | "약속자주미룸" | "거의안만남" | "해당없음";
type RelationFeeling = "더가까워진느낌" | "그대로" | "조금멀어진느낌" | "많이멀어진느낌" | "나만노력하는느낌" | "상대방마음모르겠다";
type MainQuestion = "관심줄었을까" | "내가너무먼저다가가나" | "멀어지고있나" | "다시가까워질수있나" | "먼저연락해도될까" | "유지해야할까";

type Item = { no: number; key: string; title: string; score: number | null; state: string; why: string; action: string };

const CONTACT_CHANGE_PTS: Record<ContactChange, number> = {
  많아짐: 15, 비슷: 0, 조금줄음: -10, 많이줄음: -20, 거의없음: -30, 모르겠음: 0,
};
const CONTACT_INITIATIVE_PTS: Record<ContactInitiative, number> = {
  거의상대방: 20, 상대방조금많음: 10, 비슷: 0, 내가조금많음: -10, 거의나: -20, 연락자체거의없음: -5,
};
const RESPONSE_CHANGE_PTS: Record<ResponseChange, number> = {
  빨라짐: 15, 비슷: 0, 조금느려짐: -10, 많이느려짐: -20, 짧아짐: -15, 모르겠음: 0,
};
const MEETING_CHANGE_PTS: Record<MeetingChange, number> = {
  상대방이먼저제안: 20, 비슷: 0, 내가더제안: -10, 약속자주미룸: -20, 거의안만남: -25, 해당없음: 0,
};
const RELATION_FEELING_PTS: Record<RelationFeeling, number> = {
  더가까워진느낌: 20, 그대로: 0, 조금멀어진느낌: -10, 많이멀어진느낌: -20, 나만노력하는느낌: -25, 상대방마음모르겠다: 0,
};

const CONTACT_CHANGE_LABEL: Record<ContactChange, string> = {
  많아짐: "예전보다 연락 빈도가 늘어난 패턴", 비슷: "연락 빈도가 예전과 비슷한 패턴",
  조금줄음: "연락 빈도가 조금 줄어든 패턴", 많이줄음: "연락 빈도가 많이 줄어든 패턴",
  거의없음: "요즘 연락이 거의 없는 패턴", 모르겠음: "연락 빈도 변화가 뚜렷이 체감되지 않는 상태",
};
const RESPONSE_CHANGE_LABEL: Record<ResponseChange, string> = {
  빨라짐: "답장 속도가 예전보다 빨라진 패턴", 비슷: "답장 속도가 예전과 비슷한 패턴",
  조금느려짐: "답장 속도가 조금 느려진 패턴", 많이느려짐: "답장 속도가 많이 느려진 패턴",
  짧아짐: "답장 속도는 비슷해도 내용이 짧아진 패턴", 모르겠음: "답장 속도 변화가 뚜렷이 체감되지 않는 상태",
};
const MEETING_CHANGE_LABEL: Record<MeetingChange, string> = {
  상대방이먼저제안: "상대방이 먼저 만남을 제안하는 패턴", 비슷: "만남 빈도가 예전과 비슷한 패턴",
  내가더제안: "사용자가 만남을 더 자주 제안하는 패턴", 약속자주미룸: "약속이 자주 미뤄지는 패턴",
  거의안만남: "최근 거의 만나지 못한 상태", 해당없음: "만남 빈도 자체가 판단 대상이 아닌 관계",
};
const RELATION_FEELING_LABEL: Record<RelationFeeling, string> = {
  더가까워진느낌: "체감상 더 가까워졌다고 느끼는 상태", 그대로: "체감상 큰 변화가 없다고 느끼는 상태",
  조금멀어진느낌: "체감상 조금 멀어졌다고 느끼는 상태", 많이멀어진느낌: "체감상 많이 멀어졌다고 느끼는 상태",
  나만노력하는느낌: "관계 유지 노력이 사용자 쪽에 더 쏠려 있다고 느끼는 상태", 상대방마음모르겠다: "상대방의 마음을 가늠하기 어렵다고 느끼는 상태",
};
const INITIATIVE_MINE_PCT: Record<ContactInitiative, number> = {
  거의상대방: 15, 상대방조금많음: 35, 비슷: 50, 내가조금많음: 65, 거의나: 85, 연락자체거의없음: 50,
};
const INITIATIVE_LABEL: Record<ContactInitiative, string> = {
  거의상대방: "상대방이 거의 먼저 연락하는 패턴", 상대방조금많음: "상대방이 조금 더 자주 먼저 연락하는 패턴",
  비슷: "두 사람이 비슷한 비율로 먼저 연락하는 패턴", 내가조금많음: "사용자가 조금 더 자주 먼저 연락하는 패턴",
  거의나: "사용자가 거의 먼저 연락하는 패턴", 연락자체거의없음: "먼저 연락하는 빈도 자체가 매우 낮은 상태",
};

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, Math.round(n))); }

function tierOf(score: number): "hi" | "midhi" | "mid" | "midlo" | "lo" {
  if (score >= 80) return "hi";
  if (score >= 65) return "midhi";
  if (score >= 50) return "mid";
  if (score >= 35) return "midlo";
  return "lo";
}

const TEMP_STATE: Record<string, string> = {
  hi: "여러 지표에서 안정적인 신호가 함께 나타나는 상태예요.",
  midhi: "전반적으로 무난한 흐름을 유지하고 있는 상태예요.",
  mid: "약간의 거리감 신호가 부분적으로 감지되는 상태예요.",
  midlo: "거리감 신호가 다소 뚜렷하게 나타나는 상태예요.",
  lo: "여러 지표에서 동시에 거리감 신호가 감지되는 상태예요.",
};
const TEMP_ACTION: Record<string, string> = {
  hi: "지금의 연락 리듬과 태도를 그대로 유지하는 것을 추천해요. 굳이 확인하려는 말이나 행동을 늘리지 않아도 괜찮아요.",
  midhi: "특별한 조치가 필요한 단계는 아니에요. 평소 하던 대로 자연스럽게 관계를 이어가면서 지켜보세요.",
  mid: "한 가지 신호만으로 판단하지 말고, 앞으로 1~2주 정도 연락·만남 패턴을 더 지켜보는 걸 추천해요.",
  midlo: "부담을 주지 않는 선에서 가볍게 안부를 묻거나 짧은 만남을 제안해보며 반응을 살펴보는 것이 좋아요.",
  lo: "지금 당장 큰 결정을 내리기보다, 아래 27개 항목의 세부 신호를 먼저 확인한 뒤 행동을 정하는 것을 추천해요.",
};

function relationTypeContext(rt: RelationType): string {
  const m: Record<RelationType, string> = {
    썸: "아직 관계가 정의되지 않은 썸 단계라 신호 하나하나의 의미가 더 크게 느껴질 수 있어요.",
    연인: "이미 연인 관계이기 때문에 변화가 생기면 더 예민하게 느껴질 수 있어요.",
    전연인: "헤어진 관계에서의 연락이라 신호를 해석할 때 평소보다 더 신중하게 볼 필요가 있어요.",
    친구: "친구 관계는 연인 관계보다 연락 빈도의 기복이 자연스러운 편이에요.",
    직장동료: "직장동료 관계는 업무 사정에 따라 연락 패턴이 크게 좌우될 수 있다는 점을 함께 고려해야 해요.",
    가족: "가족 관계는 감정 기복보다 생활 패턴 변화가 연락에 더 큰 영향을 줄 수 있어요.",
    기타: "관계 유형이 명확히 분류되지 않아, 아래 지표들을 조금 더 폭넓게 참고하는 것을 추천해요.",
  };
  return m[rt] || m["기타"];
}

function computeCore(input: {
  contactChange: ContactChange; contactInitiative: ContactInitiative; responseChange: ResponseChange;
  meetingChange: MeetingChange; relationFeeling: RelationFeeling;
}) {
  const cPts = CONTACT_CHANGE_PTS[input.contactChange] ?? 0;
  const iPts = CONTACT_INITIATIVE_PTS[input.contactInitiative] ?? 0;
  const rPts = RESPONSE_CHANGE_PTS[input.responseChange] ?? 0;
  const mPts = MEETING_CHANGE_PTS[input.meetingChange] ?? 0;
  const fPts = RELATION_FEELING_PTS[input.relationFeeling] ?? 0;
  const sum = cPts + iPts + rPts + mPts + fPts;
  const temperature = clamp(50 + sum * 0.5, 5, 96);
  return { cPts, iPts, rPts, mPts, fPts, sum, temperature };
}

function buildFreeResult(input: any, core: ReturnType<typeof computeCore>) {
  const tier = tierOf(core.temperature);
  const pct = INITIATIVE_MINE_PCT[input.contactInitiative as ContactInitiative] ?? 50;
  const topSignal = pickTopSignal(input, core);
  return {
    temperature: core.temperature,
    relationType: input.relationType,
    statusText: TEMP_STATE[tier],
    initiativeLabel: INITIATIVE_LABEL[input.contactInitiative as ContactInitiative] || "",
    initiativePercentMine: pct,
    topSignalTitle: topSignal.title,
    topSignalDesc: topSignal.desc,
    simpleAdvice: TEMP_ACTION[tier],
  };
}

function pickTopSignal(input: any, core: ReturnType<typeof computeCore>) {
  const candidates = [
    { key: "contact", pts: core.cPts, title: "연락 빈도 변화", desc: CONTACT_CHANGE_LABEL[input.contactChange as ContactChange] || "" },
    { key: "initiative", pts: core.iPts, title: "연락 주도권", desc: INITIATIVE_LABEL[input.contactInitiative as ContactInitiative] || "" },
    { key: "response", pts: core.rPts, title: "답장 속도 변화", desc: RESPONSE_CHANGE_LABEL[input.responseChange as ResponseChange] || "" },
    { key: "meeting", pts: core.mPts, title: "만남 변화", desc: MEETING_CHANGE_LABEL[input.meetingChange as MeetingChange] || "" },
    { key: "feeling", pts: core.fPts, title: "체감 관계 변화", desc: RELATION_FEELING_LABEL[input.relationFeeling as RelationFeeling] || "" },
  ];
  candidates.sort((a, b) => a.pts - b.pts);
  const mostNegative = candidates[0];
  const mostPositive = candidates[candidates.length - 1];
  // 부정 신호가 있으면 가장 강한 부정 신호를, 전부 중립/긍정이면 가장 강한 긍정 신호를 대표 신호로
  return mostNegative.pts < 0 ? mostNegative : mostPositive;
}

function buildPaidResult(input: any, core: ReturnType<typeof computeCore>): Item[] {
  const { cPts, iPts, rPts, mPts, fPts, temperature } = core;
  const items: Item[] = [];
  const push = (no: number, key: string, title: string, score: number | null, state: string, why: string, action: string) => {
    items.push({ no, key, title, score, state, why, action });
  };

  const tier = tierOf(temperature);
  const pctMine = INITIATIVE_MINE_PCT[input.contactInitiative as ContactInitiative] ?? 50;
  const rtCtx = relationTypeContext(input.relationType);

  // 1. 관계온도
  push(1, "temperature", "관계온도", temperature,
    temperature >= 80 ? "매우 안정적" : temperature >= 65 ? "안정적" : temperature >= 50 ? "보통" : temperature >= 35 ? "주의 필요" : "거리감 뚜렷",
    `연락 빈도·주도권·답장 속도·만남 변화·체감 변화 5가지 지표를 종합해 산출한 점수예요. ${rtCtx}`,
    TEMP_ACTION[tier]);

  // 2. 관계변화율
  const changeRaw = (cPts + rPts + mPts + fPts) / 4;
  const changePercent = clamp(changeRaw * 2, -50, 50);
  push(2, "changeRate", "관계변화율", changePercent,
    changePercent > 8 ? "강화되는 흐름" : changePercent < -8 ? "느슨해지는 흐름" : "큰 변화 없음",
    `연락·답장·만남·체감 변화 4가지를 기준으로 계산한 변화 폭이에요. 부호가 (+)면 가까워지는 방향, (−)면 멀어지는 방향의 신호가 조금 더 많다는 뜻이에요.`,
    changePercent < -8 ? "변화가 왜 시작됐는지 되짚어보고, 최근 1~2주 사이 계기가 될 만한 일이 있었는지 확인해보세요." : "지금 흐름을 유지하면서 자연스럽게 관계를 이어가면 돼요.");

  // 3. 연락주도권
  push(3, "initiative", "연락주도권", pctMine,
    INITIATIVE_LABEL[input.contactInitiative as ContactInitiative] || "",
    `입력하신 연락 주도권 항목을 기준으로, 전체 연락에서 사용자가 먼저 시작하는 비중을 약 ${pctMine}%로 추정했어요.`,
    pctMine >= 70 ? "한동안은 사용자가 먼저 연락하는 빈도를 살짝 줄이고, 상대방이 먼저 다가오는지 지켜보는 것도 방법이에요." : pctMine <= 30 ? "상대방이 주도권을 쥔 편이니, 부담 없는 선에서 가볍게 먼저 연락해보는 것도 관계에 도움이 될 수 있어요." : "주도권이 비교적 균형 잡혀 있는 편이니 지금처럼 자연스럽게 이어가세요.");

  // 4. 연락빈도변화
  push(4, "contactFreq", "연락빈도변화", clamp(50 + cPts * 1.6, 5, 95),
    CONTACT_CHANGE_LABEL[input.contactChange as ContactChange] || "",
    "최근 연락 빈도가 예전과 비교해 어떻게 달라졌는지를 기준으로 산출했어요.",
    cPts < -10 ? "빈도가 줄어든 것은 하나의 신호일 뿐, 바쁜 시기와 겹쳤을 가능성도 함께 고려해보세요." : "지금의 연락 빈도를 특별히 걱정할 단계는 아니에요.");

  // 5. 답장속도변화
  push(5, "responseSpeed", "답장속도변화", clamp(50 + rPts * 1.6, 5, 95),
    RESPONSE_CHANGE_LABEL[input.responseChange as ResponseChange] || "",
    "답장이 오는 데 걸리는 시간이 예전과 비교해 어떻게 바뀌었는지를 기준으로 분석했어요.",
    rPts < -10 ? "답장 속도만으로 관심도를 단정하기는 어려워요. 상대방의 요즘 일정이나 상황도 함께 고려해보세요." : "답장 속도는 안정적인 편이에요.");

  // 6. 답장길이변화
  {
    const lengthSignal = input.responseChange === "짧아짐" ? "짧아진 편" : (cPts <= -20 || rPts <= -20) ? "함께 짧아졌을 가능성이 있는 편" : "크게 달라지지 않은 편";
    push(6, "responseLength", "답장길이변화", null, lengthSignal,
      "직접 입력받은 항목은 아니지만, 답장 속도·연락 빈도 변화 패턴을 근거로 함께 유추한 지표예요.",
      lengthSignal.includes("짧아") ? "답장이 짧아진 게 느껴진다면, 요즘 어떻게 지내는지 가볍게 물어보는 대화로 분위기를 확인해보세요." : "지금처럼 편하게 대화를 이어가면 돼요.");
  }

  // 7. 대화지속성
  {
    const persistScore = clamp(50 + (mPts + cPts + fPts) / 3 * 1.4, 5, 95);
    push(7, "conversationPersistence", "대화지속성", persistScore,
      persistScore >= 60 ? "대화가 비교적 오래 이어지는 편" : persistScore >= 40 ? "보통 수준" : "대화가 빨리 끊기는 편",
      "연락 빈도·만남 변화·체감 변화를 종합해 대화가 얼마나 이어지는 경향인지 추정했어요.",
      persistScore < 40 ? "대화 주제를 상대방이 관심 있어 할 만한 내용으로 바꿔보는 것도 방법이에요." : "지금의 대화 방식을 유지해도 좋아요.");
  }

  // 8. 먼저연락할가능성 (미래예측 아님, 현재 패턴 지표)
  {
    const proactiveSignal = clamp(100 - pctMine + (fPts > 0 ? 8 : fPts < -10 ? -8 : 0), 5, 95);
    push(8, "proactiveContactSignal", "먼저연락할가능성", proactiveSignal,
      "현재 패턴에서의 선제연락 신호 지표",
      `이 항목은 미래를 예측하는 지표가 아니라, 지금까지의 주도권 패턴을 바탕으로 '상대방이 먼저 연락할 가능성 신호'를 수치화한 거예요.`,
      proactiveSignal < 35 ? "당분간은 사용자가 먼저 연락하는 흐름이 이어질 가능성이 있어요. 그래도 괜찮다면 유지하고, 부담스럽다면 조금 텀을 둬보세요." : "상대방 쪽에서도 먼저 연락할 여지가 있는 패턴이에요.");
  }

  // 9. 만남적극성
  push(9, "meetingProactiveness", "만남적극성", clamp(50 + mPts * 1.8, 5, 95),
    MEETING_CHANGE_LABEL[input.meetingChange as MeetingChange] || "",
    "만남을 제안하는 빈도와 방향(누가 더 자주 제안하는지)을 기준으로 분석했어요.",
    mPts < -10 ? "만남이 줄었다면 온라인 연락과는 별개로, 짧고 부담 없는 만남을 한 번 제안해보는 것도 좋아요." : "만남 빈도는 안정적인 편이에요.");

  // 10. 약속회피신호
  {
    const avoid = (input.meetingChange === "약속자주미룸" || input.meetingChange === "거의안만남") ? clamp(60 + Math.abs(mPts), 60, 95) : clamp(20 + Math.max(0, -mPts), 10, 45);
    push(10, "avoidanceSignal", "약속회피신호", avoid,
      avoid >= 70 ? "높음" : avoid >= 45 ? "주의" : "낮음",
      "약속이 미뤄지거나 만남이 성사되지 않는 빈도를 기준으로 산출했어요. 다만 이는 회피 '가능성'이지 확정된 사실은 아니에요.",
      avoid >= 70 ? "약속을 다시 잡을 땐 구체적인 날짜와 시간을 먼저 제안해보는 것이 도움이 될 수 있어요." : "특별히 조치할 필요는 없어요.");
  }

  // 11. 관계균형
  {
    const imbalance = Math.abs(pctMine - 50) * 2;
    const balance = clamp(100 - imbalance, 5, 95);
    push(11, "relationBalance", "관계균형", balance,
      balance >= 70 ? "균형 잡힌 편" : balance >= 45 ? "약간 한쪽으로 치우친 편" : "한쪽으로 많이 치우친 편",
      "연락 주도권이 두 사람 사이에 얼마나 고르게 분산되어 있는지를 기준으로 계산했어요.",
      balance < 45 ? "누가 먼저 연락하느냐에 너무 신경 쓰지 말고, 대화 내용 자체의 만족도에 더 집중해보세요." : "지금의 균형을 유지하면 좋아요.");
  }

  // 12. 관심신호
  {
    const interest = clamp(50 + (cPts + rPts + mPts + fPts) / 4 * 1.4, 5, 95);
    push(12, "interestSignal", "관심신호", interest,
      interest >= 65 ? "관심 신호가 뚜렷한 편" : interest >= 45 ? "관심 신호가 보통 수준" : "관심 신호가 약해진 편",
      "연락·답장·만남·체감 변화 전반에서 나타나는 긍정적 신호의 총합으로 계산했어요.",
      interest < 45 ? "관심이 줄었다고 단정하기보다, 최근 상대방의 생활 변화(이직, 시험, 바쁜 일정 등)가 있었는지 먼저 확인해보세요." : "지금처럼 편하게 관계를 이어가면 돼요.");
  }

  // 13. 거리감
  {
    const distance = clamp(50 - (cPts + fPts) / 2 * 1.3, 5, 95);
    push(13, "distanceSignal", "거리감", distance,
      distance >= 65 ? "거리감이 뚜렷한 편" : distance >= 45 ? "약간의 거리감" : "거리감이 적은 편",
      "연락 빈도와 체감 관계 변화를 중심으로 물리적·심리적 거리감을 추정했어요.",
      distance >= 65 ? "거리감이 느껴진다면, 부담스럽지 않은 선에서 가벼운 일상 공유부터 다시 시작해보세요." : "지금의 거리감은 크게 걱정할 수준이 아니에요.");
  }

  // 14. 관계안정도
  {
    const pts = [cPts, iPts, rPts, mPts, fPts];
    const avg = pts.reduce((a, b) => a + b, 0) / pts.length;
    const variance = pts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / pts.length;
    const stability = clamp(90 - Math.sqrt(variance) * 2.2, 10, 95);
    push(14, "stability", "관계안정도", stability,
      stability >= 65 ? "지표들이 대체로 일관된 편" : stability >= 45 ? "지표별 편차가 있는 편" : "지표별로 신호가 엇갈리는 편",
      "5개 지표(연락·주도권·답장·만남·체감)가 서로 얼마나 일관된 방향을 가리키는지로 계산했어요.",
      stability < 45 ? "신호가 엇갈릴 땐 한두 개 지표만 보고 결론 내리지 말고 시간을 두고 종합적으로 지켜보세요." : "여러 지표가 비슷한 방향을 가리키고 있어 판단의 신뢰도가 높은 편이에요.");
  }

  // 15. 감정교류균형
  {
    const emoBalance = clamp(60 - Math.abs(iPts) * 0.8 + (fPts >= 0 ? 10 : -10), 5, 95);
    push(15, "emotionalExchangeBalance", "감정교류균형", emoBalance,
      emoBalance >= 60 ? "감정 교류가 비교적 균형 잡힌 편" : "감정 교류가 한쪽으로 쏠린 편",
      "연락 주도권과 체감 관계 변화를 함께 고려해 감정적 에너지가 얼마나 균형 있게 오가는지 추정했어요.",
      emoBalance < 45 ? "감정 표현을 아꼈다면 이번 기회에 솔직한 마음을 짧게라도 전해보는 것도 방법이에요." : "지금의 감정 교류 방식이 잘 맞고 있는 것 같아요.");
  }

  // 16. 대화친밀도
  push(16, "conversationIntimacy", "대화친밀도", clamp(50 + (rPts + cPts) / 2 * 1.5, 5, 95),
    (rPts + cPts) >= 0 ? "친밀도가 유지되는 편" : "친밀도가 다소 낮아진 편",
    "답장 속도와 연락 빈도 변화를 함께 고려해 대화의 친밀한 정도를 추정했어요.",
    (rPts + cPts) < -15 ? "가벼운 농담이나 일상 공유처럼 부담 없는 화제로 대화를 다시 데워보는 것도 좋아요." : "지금의 대화 온도를 유지하면 돼요.");

  // 17. 관계피로도
  {
    const fatigue = clamp(40 + (iPts <= -15 ? 25 : 0) + (input.relationFeeling === "나만노력하는느낌" ? 25 : 0) + (fPts < -10 ? 10 : 0), 10, 95);
    push(17, "relationFatigue", "관계피로도", fatigue,
      fatigue >= 65 ? "피로도가 쌓인 편" : fatigue >= 40 ? "약간의 피로 신호" : "피로도가 낮은 편",
      "관계 유지 노력이 한쪽에 집중되어 있을수록, 그리고 그 상태가 오래될수록 피로도가 높게 산출돼요.",
      fatigue >= 65 ? "지치는 게 느껴진다면 잠시 연락 빈도를 사용자 스스로 조절해보며 페이스를 되찾는 것도 필요해요." : "아직 크게 지칠 단계는 아니에요.");
  }

  // 18. 일방적노력가능성
  {
    const oneSided = clamp(35 + (input.contactInitiative === "거의나" ? 30 : input.contactInitiative === "내가조금많음" ? 15 : 0) + (input.relationFeeling === "나만노력하는느낌" ? 25 : 0), 5, 95);
    push(18, "oneSidedEffortLikelihood", "일방적노력가능성", oneSided,
      oneSided >= 65 ? "일방적 노력 가능성이 높은 편" : oneSided >= 40 ? "약간의 일방적 노력 신호" : "노력이 고르게 분산된 편",
      "연락 주도권과 체감 관계 변화(특히 '나만 노력하는 느낌')를 함께 반영해 계산했어요.",
      oneSided >= 65 ? "혼자만 애쓰고 있다는 느낌이 든다면, 다음 연락은 상대방이 먼저 하도록 잠시 기다려보는 실험을 해보세요." : "지금 정도의 노력 분배는 크게 걱정할 수준이 아니에요.");
  }

  // 19. 오해가능성
  {
    const ambiguousCount = [input.contactChange === "모르겠음", input.responseChange === "모르겠음", input.meetingChange === "해당없음", input.relationFeeling === "상대방마음모르겠다"].filter(Boolean).length;
    const misunderstanding = clamp(30 + ambiguousCount * 15, 15, 90);
    push(19, "misunderstandingRisk", "오해가능성", misunderstanding,
      misunderstanding >= 60 ? "오해 가능성이 있는 편" : "오해 가능성은 낮은 편",
      "연락이 줄었다는 사실 하나만으로 관계가 멀어졌다고 단정할 수는 없어요. 답변에 '모르겠다'는 항목이 많을수록 실제 상황과 사용자의 체감 사이에 오해가 낄 여지가 커져요.",
      misunderstanding >= 60 ? "짐작만으로 결론짓기보다, 편한 타이밍에 직접 물어보는 것이 오해를 줄이는 가장 확실한 방법이에요." : "지금까지의 정보만으로도 비교적 명확한 판단이 가능한 상태예요.");
  }

  // 20. 관계위험신호 (등급)
  {
    const riskGrade = temperature >= 70 ? "낮음" : temperature >= 55 ? "보통" : temperature >= 40 ? "주의" : "높음";
    push(20, "riskLevel", "관계위험신호", null, riskGrade,
      "관계온도와 주요 부정 신호의 개수를 함께 반영해 4단계(낮음/보통/주의/높음)로 분류했어요.",
      riskGrade === "높음" ? "여러 신호가 동시에 감지된 상태이니, 감정적으로 대응하기보다 아래 '최종 행동처방'부터 차근히 확인해보세요." : riskGrade === "주의" ? "아직 결론 낼 단계는 아니지만, 한동안 신호를 조금 더 유심히 지켜보는 게 좋아요." : "지금 당장 걱정할 단계는 아니에요.");
  }

  // 21. 관계회복가능성 (개선 여지 지표, 단정 금지)
  {
    const wantsRecovery = (input.mainQuestions || []).includes("다시가까워질수있나");
    const recovery = clamp(100 - temperature + (wantsRecovery ? 5 : 0), 10, 90);
    push(21, "recoveryPotential", "관계회복가능성", recovery,
      "개선 여지 지표 (단정적 예측 아님)",
      "이 지표는 관계가 반드시 회복된다는 뜻이 아니라, 현재 신호들을 기준으로 '개선의 여지가 남아있는 정도'를 참고용으로 보여주는 지표예요.",
      "회복 여부는 결국 이후의 행동에 달려 있어요. 아래 '지금 먼저 해야 할 행동'을 참고해보세요.");
  }

  // 22. 지금먼저해야할행동
  {
    const actions: string[] = [];
    if (cPts < -10) actions.push("부담 없는 주제로 짧게 안부를 물어보기");
    if (mPts < -10) actions.push("구체적인 날짜를 제안해 가벼운 만남 잡아보기");
    if (input.contactInitiative === "거의나") actions.push("하루 이틀 정도는 먼저 연락하지 않고 지켜보기");
    if (fPts < -10) actions.push("솔직한 감정을 짧게라도 표현해보기");
    if (actions.length === 0) actions.push("지금의 연락·만남 패턴을 그대로 유지하기");
    push(22, "recommendedActions", "지금먼저해야할행동", null, "행동 가이드",
      "위에서 감지된 신호들을 기준으로, 지금 시도해볼 수 있는 행동을 우선순위로 정리했어요.",
      actions.map((a, i) => `${i + 1}) ${a}`).join("\n"));
  }

  // 23. 지금피해야할행동
  {
    const avoidActions: string[] = [];
    if (input.contactInitiative === "거의나" || input.relationFeeling === "나만노력하는느낌") avoidActions.push("답장이 늦다고 연달아 메시지를 보내는 것");
    if (mPts < -10) avoidActions.push("왜 안 만나주냐고 다그치듯 묻는 것");
    avoidActions.push("추측만으로 상대방의 마음을 단정 짓고 화내거나 서운함을 크게 표현하는 것");
    push(23, "avoidActions", "지금피해야할행동", null, "행동 가이드",
      "감지된 신호를 감정적으로 오해할 때 흔히 하게 되는 행동들을 정리했어요.",
      avoidActions.map((a, i) => `${i + 1}) ${a}`).join("\n"));
  }

  // 24. 연락추천타이밍 (예측 아닌 행동 가이드)
  {
    let timing = "평소 답장이 잘 오던 시간대에 가볍게 연락해보는 것을 추천해요.";
    if (input.responseChange === "많이느려짐" || input.responseChange === "조금느려짐") timing = "즉각적인 반응을 기대하기보다, 여유 있는 시간대(저녁 시간 등)에 부담 없이 연락해보는 것을 추천해요.";
    if (input.meetingChange === "약속자주미룸" || input.meetingChange === "거의안만남") timing = "만남을 재촉하기보다, 먼저 짧은 텍스트 연락으로 리듬을 회복한 뒤 만남을 제안하는 순서를 추천해요.";
    push(24, "recommendedTiming", "연락추천타이밍", null, "행동 가이드 (예측 아님)",
      "이 항목은 '언제 연락이 올 것이다'를 예측하는 게 아니라, 지금 상황에서 사용자가 연락하기에 무난한 타이밍을 안내하는 행동 가이드예요.",
      timing);
  }

  // 25. 가장중요한신호
  {
    const top = pickTopSignal(input, core);
    push(25, "mostImportantSignal", "가장중요한신호", null, top.title,
      `27개 항목 중 현재 상태에 가장 큰 영향을 주고 있는 신호로 '${top.title}'을 선정했어요. (${top.desc})`,
      "이 신호를 중심으로 다른 항목들을 함께 참고하면 전체 상황을 더 균형 있게 파악할 수 있어요.");
  }

  // 26. 사용자가놓치고있는부분
  {
    let overlooked = "";
    if ((input.contactChange === "많이줄음" || input.contactChange === "거의없음") && (input.relationFeeling === "그대로" || input.relationFeeling === "상대방마음모르겠다")) {
      overlooked = "연락은 확실히 줄었지만, 감정적으로는 아직 정리되지 않으셨을 수 있어요. 이 온도 차이가 나중에 서운함으로 쌓일 수 있으니, 마음속 감정을 미리 점검해보는 게 좋아요.";
    } else if ((input.contactInitiative === "거의나" || input.contactInitiative === "내가조금많음") && input.relationFeeling === "나만노력하는느낌") {
      overlooked = "이미 스스로도 느끼고 계신 것처럼, 연락의 상당 부분을 사용자 쪽에서 이끌고 있는 패턴이 데이터로도 함께 확인돼요. 다만 이것이 상대방의 무관심을 의미하는 것은 아닐 수 있어요.";
    } else if (input.meetingChange === "거의안만남" && (input.contactChange === "많아짐" || input.contactChange === "비슷")) {
      overlooked = "연락은 유지되고 있지만 실제 만남으로는 잘 이어지지 않는 패턴이 보여요. 온라인 소통과 오프라인 관계 사이에 생긴 거리를 한 번 짚어볼 필요가 있어요.";
    } else if (input.responseChange === "짧아짐" && cPts >= 0) {
      overlooked = "연락 빈도 자체는 유지되고 있지만 답장 내용이 짧아진 점은 놓치기 쉬운 신호예요. 빈도보다 대화의 밀도 변화에 조금 더 주목해보세요.";
    } else {
      overlooked = "현재 입력하신 답변 안에서는 뚜렷한 모순 신호가 발견되지 않았어요. 다만 지표 하나만 보고 결론 내리기보다, 여러 항목을 함께 고려하는 것이 가장 정확한 판단에 가까워요.";
    }
    push(26, "overlookedPoint", "사용자가놓치고있는부분", null, "교차 분석",
      overlooked,
      "놓치고 있을 수 있는 부분을 인지한 것만으로도 다음 판단이 훨씬 정확해져요.");
  }

  // 27. 최종행동처방
  {
    const first = mPts < -10 ? "가벼운 만남을 구체적인 날짜와 함께 제안해보기" : cPts < -10 ? "부담 없는 안부 연락으로 리듬 회복하기" : "지금의 연락 패턴을 그대로 유지하기";
    const second = input.contactInitiative === "거의나" ? "다음 한 번은 먼저 연락하지 않고 기다려보기" : fPts < -10 ? "솔직한 마음을 짧게 표현해보기" : "평소보다 조금 더 여유 있는 태도로 대하기";
    const avoid = "연락 속도나 만남 여부만으로 상대방의 마음을 단정 짓고 서운함을 크게 표출하는 것";
    const watch = "다음 연락에서 먼저 다가오는 쪽이 누구인지, 답장 속도와 내용이 평소와 다른지";
    push(27, "finalPrescription", "최종행동처방", null, "1순위 · 2순위 · 관찰 포인트",
      `1순위: ${first}\n2순위: ${second}\n피해야 할 행동: ${avoid}\n관찰할 신호: ${watch}`,
      "관계는 하나의 신호만으로 결정되지 않습니다. 위 처방은 참고용 가이드이며, 최종 판단과 행동은 사용자 본인의 몫이에요.");
  }

  return items;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      relationType, targetNickname,
      contactChange, contactInitiative, responseChange, meetingChange, relationFeeling,
      mainQuestions, name, phone,
    } = body;

    if (!relationType || !contactChange || !contactInitiative || !responseChange || !meetingChange || !relationFeeling) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요" }, { status: 400 });
    }

    const cleanPhone = String(phone || "").replace(/\D/g, "");
    const cleanQuestions: MainQuestion[] = Array.isArray(mainQuestions) ? mainQuestions.slice(0, 2) : [];

    const input = { relationType, targetNickname: targetNickname || "그 사람", contactChange, contactInitiative, responseChange, meetingChange, relationFeeling, mainQuestions: cleanQuestions };
    const core = computeCore(input as any);
    const freeResult = buildFreeResult(input, core);
    const paidResult = buildPaidResult(input, core);

    const record = {
      relationType, targetNickname: targetNickname || "",
      contactChange, contactInitiative, responseChange, meetingChange, relationFeeling,
      mainQuestions: cleanQuestions,
      name: name || "", phone: cleanPhone,
      freeScore: core.temperature,
      freeResult,
      paidResult,
      createdAt: Date.now(),
      paid: false,
      paidAt: null as number | null,
    };

    const ref = isFakePhone(cleanPhone) ? null : await db.ref("gwangyeoradar_analyses").push(record);
    return NextResponse.json({ id: ref ? ref.key : null, result: record });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "분석 중 오류가 발생했습니다" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id 없음" }, { status: 400 });
    const snap = await db.ref(`gwangyeoradar_analyses/${id}`).once("value");
    if (!snap.exists()) return NextResponse.json({ error: "결과 없음" }, { status: 404 });
    return NextResponse.json({ result: snap.val() });
  } catch (e) {
    return NextResponse.json({ error: "오류" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ ok: false, error: "id 없음" }, { status: 400 });
    await db.ref(`gwangyeoradar_analyses/${id}`).update({ paid: true, paidAt: Date.now() });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
