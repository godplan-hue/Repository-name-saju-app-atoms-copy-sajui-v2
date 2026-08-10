"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

type TarotResult = {
  name: string;
  phone: string;
  birthYear: number;
  topic: string;
  oh: string;
  soulCardIdx: number;
  cardIdx: number;
};

const OH_COLOR: Record<string, string> = {
  목: "linear-gradient(135deg,#166534,#4ade80)",
  화: "linear-gradient(135deg,#7f1d1d,#f87171)",
  토: "linear-gradient(135deg,#78350f,#fbbf24)",
  금: "linear-gradient(135deg,#1e3a5f,#93c5fd)",
  수: "linear-gradient(135deg,#1e1b4b,#a78bfa)",
};
const OH_EMOJI: Record<string, string> = { 목: "🌿", 화: "🔥", 토: "🏔️", 금: "⚡", 수: "🌊" };
const OH_DESC: Record<string, string> = {
  목: "목오행 수호카드는 세계예요. 모든 것이 완성되는 에너지를 품었어요.",
  화: "화오행 수호카드는 태양이에요. 밝고 강한 생명력의 에너지예요.",
  토: "토오행 수호카드는 여황제예요. 풍요롭고 따뜻한 대지의 에너지예요.",
  금: "금오행 수호카드는 정의예요. 균형감 있고 단호한 에너지예요.",
  수: "수오행 수호카드는 여사제예요. 깊은 직관과 지혜의 에너지예요.",
};

// ─── Lucky numbers ───────────────────────────────────────────────────────────
function getLuckyNumbers(y: number, m: number, d: number): number[] {
  let s = y * 10000 + m * 100 + d;
  const nums = new Set<number>();
  while (nums.size < 6) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    nums.add((Math.abs(s) % 45) + 1);
  }
  return Array.from(nums).sort((a, b) => a - b);
}

// ─── Aura colors ─────────────────────────────────────────────────────────────
const AURA: Record<string, { color: string; name: string; desc: string }> = {
  목: { color: "#22c55e", name: "초록 오라", desc: "성장과 생명력의 에너지. 치유력이 강하고 주변에 안정감을 줍니다." },
  화: { color: "#ef4444", name: "빨강 오라", desc: "열정과 생동감의 에너지. 강한 리더십과 추진력을 상징합니다." },
  토: { color: "#f59e0b", name: "황금 오라", desc: "안정과 신뢰의 에너지. 대지처럼 든든하고 신뢰받는 존재입니다." },
  금: { color: "#94a3b8", name: "은빛 오라", desc: "명확함과 정밀함의 에너지. 논리적이고 탁월한 분석력을 가집니다." },
  수: { color: "#3b82f6", name: "파랑 오라", desc: "직감과 지혜의 에너지. 깊은 통찰력으로 숨겨진 진실을 봅니다." },
};

// ─── Past life (오행×띠 60조합) ───────────────────────────────────────────────
function getPastLife(oh: string, birthYear: number): { job: string; era: string; story: string } {
  const zodiac = ["원숭이","닭","개","돼지","쥐","소","호랑이","토끼","용","뱀","말","양"][(birthYear - 4) % 12];
  const data: Record<string, Record<string, { job: string; era: string; story: string }>> = {
    목: { 쥐:{job:"점술가",era:"고려시대",story:"별의 움직임으로 나라의 운명을 예언했던 국사였습니다."}, 소:{job:"농업 개혁가",era:"조선시대",story:"새로운 농법을 개발해 수많은 백성을 기아에서 구했습니다."}, 호랑이:{job:"선발대 장수",era:"삼국시대",story:"군대의 선봉에 서서 두려움 없이 전진했던 용맹한 장군이었습니다."}, 토끼:{job:"서예가",era:"신라시대",story:"아름다운 붓글씨로 왕실의 문서를 기록했습니다."}, 용:{job:"탐험가",era:"조선시대",story:"미지의 땅을 개척하고 새로운 교역로를 발견했습니다."}, 뱀:{job:"의학자",era:"고려시대",story:"약초를 연구하여 당시 불치병이던 질환의 치료법을 발견했습니다."}, 말:{job:"전령사",era:"삼국시대",story:"말을 타고 전국을 누비며 중요한 왕명을 전달했습니다."}, 양:{job:"목동 시인",era:"고구려",story:"양떼를 키우며 별을 바라보고 아름다운 시를 썼습니다."}, 원숭이:{job:"외교관",era:"조선시대",story:"외국 사신들을 맞이하고 평화로운 외교를 이끌었습니다."}, 닭:{job:"새벽 알리미",era:"신라시대",story:"새벽마다 마을을 깨워 하루를 시작하게 해주는 중요한 역할을 했습니다."}, 개:{job:"충직한 경호원",era:"고려시대",story:"왕을 평생 지킨 충신으로 역사에 기록되었습니다."}, 돼지:{job:"부유한 상인",era:"조선시대",story:"정직한 거래로 전국에 이름을 날린 대상인이었습니다."} },
    화: { 쥐:{job:"궁중 음악가",era:"조선시대",story:"왕 앞에서 연주하며 나라의 경사를 음악으로 기록했습니다."}, 소:{job:"대장장이",era:"삼국시대",story:"불을 다루며 나라 최고의 무기를 만들었던 장인이었습니다."}, 호랑이:{job:"혁명가",era:"근대",story:"새로운 세상을 꿈꾸며 시대의 변화를 이끌었습니다."}, 토끼:{job:"궁녀",era:"조선시대",story:"왕실의 비밀을 가슴에 품고 조용히 역사의 뒤편에서 살았습니다."}, 용:{job:"화가",era:"고려시대",story:"당대 최고의 그림을 그려 왕실에 헌납했습니다."}, 뱀:{job:"무당",era:"신라시대",story:"신과 인간을 연결하는 영적 중재자였습니다."}, 말:{job:"가수",era:"조선시대",story:"아름다운 목소리로 전국을 유랑하며 백성들의 마음을 달랬습니다."}, 양:{job:"난중일기 작가",era:"조선시대",story:"전쟁 속에서도 꾸준히 일기를 써 역사를 기록했습니다."}, 원숭이:{job:"광대",era:"고려시대",story:"왕 앞에서 재주를 부리며 웃음을 선사했던 예능인이었습니다."}, 닭:{job:"봉황 사육사",era:"신화시대",story:"신성한 새를 돌보며 왕실의 복을 기원했습니다."}, 개:{job:"의협인",era:"조선시대",story:"약자를 위해 싸운 의로운 협객으로 많은 이의 존경을 받았습니다."}, 돼지:{job:"연회 준비자",era:"고구려",story:"왕실 잔치를 기획하고 준비했던 행사 전문가였습니다."} },
    토: { 쥐:{job:"창고지기",era:"조선시대",story:"나라의 곡식을 관리하며 기근을 막는 중요한 역할을 했습니다."}, 소:{job:"촌장",era:"삼국시대",story:"마을 주민들을 이끌고 분쟁을 조정했던 신망받는 리더였습니다."}, 호랑이:{job:"무인",era:"고려시대",story:"강직하고 용맹한 무사로 나라의 기둥이 되었습니다."}, 토끼:{job:"산파",era:"조선시대",story:"수많은 아이의 탄생을 도운 따뜻한 조력자였습니다."}, 용:{job:"건축가",era:"신라시대",story:"불국사와 같은 웅장한 건물을 설계했습니다."}, 뱀:{job:"약재상",era:"고려시대",story:"전국의 약재를 수집하고 판매하며 의료에 기여했습니다."}, 말:{job:"역참 관리자",era:"조선시대",story:"전국의 역참을 관리하며 원활한 물류를 책임졌습니다."}, 양:{job:"목동",era:"신화시대",story:"드넓은 초원에서 양떼를 키우며 평화롭게 살았습니다."}, 원숭이:{job:"중개상인",era:"조선시대",story:"생산자와 소비자를 연결하며 경제 흐름을 만들었습니다."}, 닭:{job:"새벽 기도사",era:"고려시대",story:"매일 새벽 신에게 마을의 평안을 빌었던 경건한 분이었습니다."}, 개:{job:"경비대장",era:"삼국시대",story:"성문을 지키며 침략자로부터 백성을 보호했습니다."}, 돼지:{job:"재산관리인",era:"조선시대",story:"귀족의 재산을 믿음직스럽게 관리했던 충신이었습니다."} },
    금: { 쥐:{job:"야간 탐정",era:"근대",story:"밤을 누비며 범죄를 해결했던 날카로운 수사관이었습니다."}, 소:{job:"판관",era:"조선시대",story:"공정하고 엄격한 심판으로 억울한 백성의 원통함을 풀었습니다."}, 호랑이:{job:"전략가",era:"삼국시대",story:"뛰어난 전술로 적군을 물리쳤던 전략의 귀재였습니다."}, 토끼:{job:"수학자",era:"조선시대",story:"복잡한 계산으로 천문과 지리를 연구했습니다."}, 용:{job:"갑옷 제작자",era:"고려시대",story:"가장 단단하고 아름다운 갑옷을 만들었던 장인이었습니다."}, 뱀:{job:"암행어사",era:"조선시대",story:"비밀리에 전국을 누비며 부정부패를 척결했습니다."}, 말:{job:"검술사",era:"고려시대",story:"빠르고 정확한 검술로 이름을 떨쳤던 무사였습니다."}, 양:{job:"도자기 장인",era:"신라시대",story:"세상에서 가장 아름다운 도자기를 빚었습니다."}, 원숭이:{job:"정보 수집가",era:"조선시대",story:"민간에 숨어 중요한 정보를 수집해 왕에게 보고했습니다."}, 닭:{job:"시험관",era:"조선시대",story:"과거시험을 관리하며 인재를 선발했습니다."}, 개:{job:"법관",era:"고려시대",story:"법을 엄격히 집행하여 사회 질서를 유지했습니다."}, 돼지:{job:"금은방 주인",era:"조선시대",story:"귀금속을 다루며 부를 축적했습니다."} },
    수: { 쥐:{job:"점술가",era:"조선시대",story:"사람의 운명을 읽고 미래를 예언했던 신비로운 현인이었습니다."}, 소:{job:"서당 훈장",era:"조선시대",story:"아이들에게 지식을 전달하며 다음 세대를 키웠습니다."}, 호랑이:{job:"해적",era:"고려시대",story:"바다를 누비며 자유롭게 살았던 모험가였습니다."}, 토끼:{job:"시인",era:"신라시대",story:"달을 바라보며 아름다운 시를 써 많은 이의 마음을 울렸습니다."}, 용:{job:"철학자",era:"삼국시대",story:"삶과 죽음, 우주의 이치를 탐구했던 심오한 사상가였습니다."}, 뱀:{job:"독약 전문가",era:"고려시대",story:"독과 해독제를 연구하여 의학 발전에 기여했습니다."}, 말:{job:"뱃사공",era:"조선시대",story:"강과 바다를 오가며 사람과 물자를 실어 날랐습니다."}, 양:{job:"몽상가",era:"신화시대",story:"꿈속에서 신의 계시를 받아 예언을 전했습니다."}, 원숭이:{job:"첩자",era:"삼국시대",story:"적진에 숨어들어 중요한 비밀을 알아냈습니다."}, 닭:{job:"새벽 예언자",era:"고구려",story:"새벽닭의 소리를 듣고 그날의 운세를 예언했습니다."}, 개:{job:"탐정",era:"조선시대",story:"숨겨진 진실을 파헤치는 능력으로 수많은 사건을 해결했습니다."}, 돼지:{job:"해몽가",era:"고려시대",story:"꿈의 의미를 해석하여 왕실에 조언했던 신비로운 현자였습니다."} },
  };
  return data[oh]?.[zodiac] || { job:"신비로운 현자", era:"고대", story:"역사의 기록에는 없지만 많은 이의 마음속에 남아있는 전설적인 존재였습니다." };
}

// ─── Card advice ──────────────────────────────────────────────────────────────
const CARD_ADVICE: Record<number, string> = {
  0:"직감을 믿고 행동하세요. 완벽한 때를 기다리면 아무것도 시작할 수 없어요.",
  1:"가진 자원을 최대한 활용하세요. 당신에게 필요한 모든 것은 이미 손 안에 있습니다.",
  2:"서두르지 마세요. 모든 정보가 드러날 때까지 기다리는 것이 현명합니다.",
  3:"자연과 함께하고 몸의 감각을 살리세요. 풍요는 이미 당신 곁에 와 있습니다.",
  4:"구조와 계획을 중시하세요. 체계적인 접근이 목표를 이루는 최단 경로입니다.",
  5:"경험이 많은 분의 조언을 구해보세요. 전통적인 방법 안에 지혜가 담겨 있습니다.",
  6:"이분법적 사고를 버리세요. 진정한 사랑은 선택과 함께 책임도 요구합니다.",
  7:"집중력을 유지하고 목표에서 눈을 떼지 마세요. 승리는 당신의 것입니다.",
  8:"부드러운 힘이 강한 힘보다 오래갑니다. 인내심을 가지고 밀어붙이세요.",
  9:"내면의 빛을 따라가세요. 고독 속에서 진정한 지혜를 찾을 수 있습니다.",
  10:"흐름에 몸을 맡기세요. 당신이 통제할 수 없는 것들을 받아들이는 지혜가 필요합니다.",
  11:"솔직함과 공정함을 유지하세요. 지금 내린 결정이 오랜 영향을 미칩니다.",
  12:"희생이 결국 더 큰 것을 가져다줍니다. 지금의 기다림은 의미가 있습니다.",
  13:"과거를 놓아주어야 새것이 들어옵니다. 지금이 바로 그 전환점입니다.",
  14:"인내심을 가지세요. 서로 다른 요소들이 조화를 이룰 때 최고의 결과가 나옵니다.",
  15:"당신을 제한하는 것들을 직시하세요. 속박은 생각보다 훨씬 쉽게 벗어날 수 있습니다.",
  16:"무너지는 것들이 있다면 그것은 무너져야 할 것들입니다. 더 강한 것을 세울 기회입니다.",
  17:"꿈을 크게 품으세요. 우주는 당신의 소망에 귀 기울이고 있습니다.",
  18:"두려움과 불안을 정면으로 바라보세요. 알 수 없는 것들에 대한 공포가 가장 큰 걸림돌입니다.",
  19:"오늘 하루를 기쁨으로 채우세요. 당신의 빛이 주변 사람들도 밝혀줍니다.",
  20:"과거의 잘못을 용서하고 새롭게 시작할 준비가 되어 있나요? 지금이 그 순간입니다.",
  21:"성취를 충분히 즐기세요. 그리고 다음 여정을 위한 준비를 시작하세요.",
};

const TOPIC_LABEL: Record<string, string> = {
  today: "🌅 오늘 운세",
  love: "💞 연애·인연",
  work: "💼 직업·돈",
  choice: "🤔 선택·결정",
  heal: "🌿 마음 치유",
};

const CARDS: Array<{
  idx: number; emoji: string; name: string; keyword: string; bg: string;
  messages: Record<string, string>;
}> = [
  {
    idx: 0, emoji: "🌟", name: "바보", keyword: "새로운 시작", bg: "linear-gradient(135deg,#1e3a5f,#38bdf8)",
    messages: {
      today: "두려움 없이 새로운 하루를 시작하라는 신호예요. 계획이 완벽하지 않아도 괜찮아요, 첫 발을 내딛는 것만으로 충분한 날이에요.",
      love: "조건을 따지지 말고 마음이 이끄는 대로 가보세요. 순수하게 좋아하는 감정이 지금 가장 강한 힘이에요.",
      work: "새로운 프로젝트나 기회 앞에서 너무 계산하지 마세요. 일단 시도해보는 용기가 오늘의 핵심이에요.",
      choice: "완벽한 선택을 기다리지 말고 지금 느껴지는 감으로 결정하세요. 바보처럼 보여도 그 직관이 맞는 경우가 많아요.",
      heal: "어른스럽게 행동해야 한다는 부담을 내려놔도 돼요. 가볍게, 즐겁게, 아이처럼 지내도 되는 날이에요.",
    },
  },
  {
    idx: 1, emoji: "✨", name: "마법사", keyword: "실행력", bg: "linear-gradient(135deg,#7c2d12,#fb923c)",
    messages: {
      today: "머릿속에 있는 아이디어를 오늘 실제로 행동으로 옮길 때예요. 모든 도구가 이미 내 손에 있어요.",
      love: "상대에게 마음을 표현할 가장 좋은 타이밍이에요. 말하지 않으면 상대는 모를 수 있어요.",
      work: "능력을 발휘할 무대가 주어졌어요. 망설이지 말고 적극적으로 나서면 좋은 결과가 따라와요.",
      choice: "선택할 능력이 충분해요. 내가 가진 것들을 믿고 원하는 쪽으로 의도를 분명히 세우세요.",
      heal: "스스로를 무력하다고 느낀다면, 아직 쓰지 않은 힘이 많다는 신호예요. 작은 것부터 시작해보세요.",
    },
  },
  {
    idx: 2, emoji: "🌙", name: "여사제", keyword: "직관", bg: "linear-gradient(135deg,#1e1b4b,#818cf8)",
    messages: {
      today: "논리보다 직감을 따르는 날이에요. 조용히 내면의 소리를 들을 시간이 필요해요.",
      love: "말로 설명하지 못해도 느껴지는 감정이 있다면 그걸 믿으세요. 숨겨진 감정이 흐르는 관계예요.",
      work: "지금 드러나지 않은 정보가 있어요. 성급하게 행동하기보다 조금 더 관찰하는 편이 유리해요.",
      choice: "이성적 판단이 어렵다면, 몸이 반응하는 쪽을 선택하세요. 직관이 정답을 알고 있어요.",
      heal: "혼자 있는 시간이 치유예요. 누군가의 위로보다 스스로의 내면을 들여다보는 게 더 필요한 때예요.",
    },
  },
  {
    idx: 3, emoji: "👑", name: "여황제", keyword: "풍요", bg: "linear-gradient(135deg,#064e3b,#34d399)",
    messages: {
      today: "풍요롭고 안정된 에너지가 흐르는 날이에요. 좋아하는 음식, 자연, 편안함을 즐겨보세요.",
      love: "사랑을 주는 데 인색하지 마세요. 여유롭게 배려하고 표현할수록 관계가 더 깊어져요.",
      work: "씨앗을 뿌리는 시기예요. 창의적인 아이디어를 펼치면 서서히 결실을 맺을 거예요.",
      choice: "어느 쪽을 선택해도 풍요의 에너지가 함께해요. 스스로를 풍요롭게 만드는 쪽으로 가세요.",
      heal: "자신을 먹이고 돌봐주세요. 좋은 것을 먹고, 충분히 쉬고, 감각적인 즐거움을 허락하세요.",
    },
  },
  {
    idx: 4, emoji: "⚔️", name: "황제", keyword: "안정과 질서", bg: "linear-gradient(135deg,#7c2d12,#f97316)",
    messages: {
      today: "체계적으로 움직이는 날이에요. 계획을 세우고 순서대로 처리하면 훨씬 효율적이에요.",
      love: "감정보다 안정감이 중요한 시기예요. 상대에게 믿음직스러운 모습을 보여주세요.",
      work: "리더십을 발휘할 기회예요. 권위 있게 결정하고 흔들리지 않는 태도를 유지하세요.",
      choice: "장기적인 안정을 기준으로 선택하세요. 지금 편한 것보다 나중에 탄탄한 것이 정답이에요.",
      heal: "삶에 구조와 루틴을 만들어보세요. 작은 규칙이 하루를 안정시키고 마음을 잡아줄 거예요.",
    },
  },
  {
    idx: 5, emoji: "⛪", name: "교황", keyword: "지혜와 전통", bg: "linear-gradient(135deg,#1c1917,#78716c)",
    messages: {
      today: "믿을 수 있는 사람에게 조언을 구하면 도움이 되는 날이에요. 전통적인 방법이 효과적이에요.",
      love: "서로의 가치관이 맞는지 점검할 시간이에요. 겉모습보다 마음의 결이 중요한 관계예요.",
      work: "정석대로, 원칙대로 하세요. 지름길보다 검증된 방식이 지금은 더 안전해요.",
      choice: "혼자 결정하기 어렵다면 신뢰할 수 있는 멘토나 어른에게 물어보세요.",
      heal: "나를 이해해주는 사람과 이야기를 나누세요. 혼자 짊어지지 않아도 돼요.",
    },
  },
  {
    idx: 6, emoji: "💕", name: "연인", keyword: "사랑과 선택", bg: "linear-gradient(135deg,#831843,#f472b6)",
    messages: {
      today: "마음이 끌리는 것을 따라가세요. 오늘은 취향과 감정이 옳은 방향을 가리켜요.",
      love: "감정에 솔직해지세요. 좋아한다면 표현하고, 아니라면 정직하게 마주하는 게 더 깊은 사랑이에요.",
      work: "좋아하는 일과 해야 하는 일 사이에서 고민 중이라면, 즐거운 쪽을 택하세요.",
      choice: "두 가지 모두 매력적이라면, 마음이 조금 더 기우는 쪽이 정답이에요. 이성을 잠깐 내려놓으세요.",
      heal: "자신을 먼저 사랑하세요. 내가 나를 어떻게 대하는지가 관계의 시작이에요.",
    },
  },
  {
    idx: 7, emoji: "🏆", name: "전차", keyword: "승리와 의지", bg: "linear-gradient(135deg,#1e3a5f,#60a5fa)",
    messages: {
      today: "속도감 있게 움직이세요. 추진력이 있는 날이라 빠르게 실행하면 결과가 따라와요.",
      love: "마음에 드는 사람이 있다면 먼저 적극적으로 다가가세요. 기다리면 기회가 지나가요.",
      work: "경쟁이나 도전 앞에서 물러서지 마세요. 지금 이 순간 집중력이 가장 강해요.",
      choice: "빠르게 결정하고 바로 실행하세요. 우물쭈물할수록 타이밍을 놓쳐요.",
      heal: "지쳐 있더라도 다시 시작할 힘이 있어요. 작은 목표 하나를 정하고 향해 달려보세요.",
    },
  },
  {
    idx: 8, emoji: "🦁", name: "힘", keyword: "용기와 인내", bg: "linear-gradient(135deg,#7c2d12,#fbbf24)",
    messages: {
      today: "두려운 것과 맞서야 할 때예요. 용기를 내면 지금 막혀 있는 것이 풀려요.",
      love: "진심이 통하는 관계예요. 조용하지만 깊게, 인내심 있게 상대를 이해하는 것이 핵심이에요.",
      work: "힘들고 오래 걸리는 일이라도 포기하지 마세요. 지금이 고비이고, 버티면 돌파구가 열려요.",
      choice: "어려운 쪽을 선택하는 것이 맞아요. 편한 쪽은 지금의 나를 성장시키지 않아요.",
      heal: "나는 생각보다 강해요. 지금 느끼는 두려움은 실제 위험이 아닐 수 있어요. 한 걸음씩 가보세요.",
    },
  },
  {
    idx: 9, emoji: "🔦", name: "은둔자", keyword: "내면과 성찰", bg: "linear-gradient(135deg,#1c1917,#a8a29e)",
    messages: {
      today: "혼자만의 시간이 가장 필요한 날이에요. 사람들과 어울리기보다 조용히 나를 돌아보세요.",
      love: "관계에서 잠깐 거리를 두는 것이 오히려 도움이 돼요. 나부터 채워야 줄 수 있어요.",
      work: "성과보다 방향을 점검할 때예요. 지금 하고 있는 일이 진짜 내가 원하는 건지 확인하세요.",
      choice: "시간을 갖고 천천히 결정하세요. 외부의 소음을 끄고 내 마음의 소리를 들을 수 있을 때 답이 나와요.",
      heal: "혼자 있어도 외롭지 않아요. 자신과 함께 있는 시간이 가장 깊은 치유예요.",
    },
  },
  {
    idx: 10, emoji: "🎡", name: "운명의 수레바퀴", keyword: "전환점", bg: "linear-gradient(135deg,#312e81,#6366f1)",
    messages: {
      today: "흐름이 바뀌는 전환점이에요. 예상치 못한 일이 오더라도 흐름을 타세요.",
      love: "인연의 물결이 움직이고 있어요. 새로운 만남이나 기존 관계에 변화가 올 수 있어요.",
      work: "변화의 바람이 불어요. 적응하는 사람에게 기회가 찾아와요.",
      choice: "어느 쪽이든 결과가 달라질 시점이에요. 운이 함께하니 두려워하지 않아도 돼요.",
      heal: "지금 힘들다면 이것도 수레바퀴의 한 지점일 뿐이에요. 곧 흐름이 위로 올라가요.",
    },
  },
  {
    idx: 11, emoji: "⚖️", name: "정의", keyword: "균형과 공정", bg: "linear-gradient(135deg,#1e3a5f,#3b82f6)",
    messages: {
      today: "공정하게 판단하고 행동하세요. 감정보다 사실에 기반한 선택이 오늘은 옳아요.",
      love: "감정만으로 판단하지 말고 관계가 공평한지 돌아보세요. 한쪽만 희생하는 관계는 오래가지 않아요.",
      work: "노력에 맞는 보상을 요구해도 돼요. 공정한 평가를 받을 자격이 있어요.",
      choice: "장단점을 냉정하게 비교하세요. 감정을 빼고 객관적으로 보면 답이 보여요.",
      heal: "자신에게 너무 가혹하지 마세요. 나도 나에게 공정해야 해요.",
    },
  },
  {
    idx: 12, emoji: "🙃", name: "매달린 사람", keyword: "관점 전환", bg: "linear-gradient(135deg,#134e4a,#2dd4bf)",
    messages: {
      today: "지금 잠깐 멈추는 것이 가장 현명한 행동이에요. 서두르지 말고 다른 각도로 상황을 바라보세요.",
      love: "포기인지 기다림인지 헷갈린다면 잠깐 내려놓아보세요. 억지로 붙잡지 않아도 돼요.",
      work: "무조건 밀어붙이기보다 멈추고 전략을 바꿀 타이밍이에요.",
      choice: "아직 결정할 필요 없어요. 시간이 더 지나면 지금보다 훨씬 명확해질 거예요.",
      heal: "아무것도 하지 않는 것도 치유예요. 잠깐 버티지 말고 흘러가세요.",
    },
  },
  {
    idx: 13, emoji: "🌑", name: "변화", keyword: "끝과 새로운 시작", bg: "linear-gradient(135deg,#1c1917,#57534e)",
    messages: {
      today: "뭔가를 끝내야 새로운 것이 시작돼요. 미련을 내려놓을 준비를 하세요.",
      love: "이 관계의 한 챕터가 끝나가고 있어요. 두렵더라도 변화를 받아들이는 것이 더 나은 사랑으로 가는 길이에요.",
      work: "오래된 방식이나 프로젝트를 놓아줄 때예요. 새로운 방향이 더 큰 성장을 가져다줘요.",
      choice: "버려야 하는 것이 있다면 지금이에요. 변화는 무섭지만 필요한 과정이에요.",
      heal: "지금 끝나가는 것들을 슬퍼해도 돼요. 충분히 애도하면 새로운 에너지가 차오를 거예요.",
    },
  },
  {
    idx: 14, emoji: "🌈", name: "절제", keyword: "균형과 조화", bg: "linear-gradient(135deg,#0c4a6e,#38bdf8)",
    messages: {
      today: "급하게 가지 않아도 돼요. 느리더라도 균형 있게 흘러가는 것이 오늘의 리듬이에요.",
      love: "극단적인 감정보다 따뜻하고 안정적인 흐름이 관계를 더 깊게 해줘요.",
      work: "여러 가지를 조율하며 진행하세요. 한 가지에만 집중하기보다 균형 있게 섞으면 시너지가 나요.",
      choice: "두 가지를 합칠 수 있는 방법을 찾아보세요. 반드시 하나를 버릴 필요가 없어요.",
      heal: "과함도 부족함도 아닌 딱 맞는 것을 찾는 연습이 필요해요. 너무 많이도 너무 적게도 말고요.",
    },
  },
  {
    idx: 15, emoji: "⛓️", name: "악마", keyword: "집착과 해방", bg: "linear-gradient(135deg,#1c0533,#7c3aed)",
    messages: {
      today: "나를 묶고 있는 것이 뭔지 돌아보세요. 습관, 생각, 관계 중에 놓아줄 것이 있어요.",
      love: "집착과 사랑을 구분하세요. 상대를 통제하려는 마음이 있다면 거기서 자유로워져야 해요.",
      work: "두려움에서 비롯된 선택인지 욕망에서 비롯된 선택인지 구분하세요.",
      choice: "선택을 못 하는 이유가 뭔지 솔직하게 직면하세요. 억압된 욕구가 판단을 흐리고 있어요.",
      heal: "자신을 억압하는 생각을 하나씩 내려놓아보세요. 스스로 만든 감옥에서 나올 수 있어요.",
    },
  },
  {
    idx: 16, emoji: "⚡", name: "탑", keyword: "충격과 각성", bg: "linear-gradient(135deg,#7f1d1d,#ef4444)",
    messages: {
      today: "예상치 못한 일이 생겨도 무너지지 않아요. 오히려 불필요한 것들이 정리되는 과정이에요.",
      love: "충격적인 진실이 드러날 수 있어요. 흔들리는 건 당연하고, 그 후에 더 솔직한 관계가 될 수 있어요.",
      work: "기존의 계획이 흔들릴 수 있어요. 당황하지 말고 유연하게 대처하면 오히려 기회가 돼요.",
      choice: "갑작스러운 상황 변화 앞에서 빠르게 판단하세요. 망설일 시간이 없을 수 있어요.",
      heal: "무너지는 것들은 애초에 견고하지 않았던 거예요. 진짜 내 것은 사라지지 않아요.",
    },
  },
  {
    idx: 17, emoji: "⭐", name: "별", keyword: "희망과 치유", bg: "linear-gradient(135deg,#0c4a6e,#0ea5e9)",
    messages: {
      today: "희망을 가져도 되는 날이에요. 어두운 터널 끝에 빛이 보이기 시작해요.",
      love: "진심이 통하는 관계예요. 아직 시작되지 않았어도 반드시 올 인연이 있어요.",
      work: "지금 하는 일이 결국 빛을 발할 거예요. 믿고 꾸준히 가세요.",
      choice: "밝은 쪽을 선택하세요. 두 가지 중 더 희망적인 방향이 정답이에요.",
      heal: "상처가 치유되고 있어요. 시간이 걸리지만 반드시 낫는다고 믿어도 돼요.",
    },
  },
  {
    idx: 18, emoji: "🌛", name: "달", keyword: "불안과 직관", bg: "linear-gradient(135deg,#1e1b4b,#6d28d9)",
    messages: {
      today: "뭔가 불안하고 흐릿한 느낌이 드는 날이에요. 확실한 것이 없어도 괜찮아요, 직감을 따르세요.",
      love: "상대가 진심인지 모르겠다면, 느낌이 맞을 수 있어요. 서두르지 말고 조금 더 지켜보세요.",
      work: "명확하지 않은 상황이 계속될 수 있어요. 의심스러운 부분은 더 확인하고 나서 움직이세요.",
      choice: "아직 정보가 부족해요. 더 드러날 때까지 기다리는 것이 현명해요.",
      heal: "불안이 큰 것은 아직 내가 통제할 수 없는 것들에 집중하고 있어서예요. 지금 할 수 있는 것에만 집중하세요.",
    },
  },
  {
    idx: 19, emoji: "☀️", name: "태양", keyword: "기쁨과 성공", bg: "linear-gradient(135deg,#78350f,#fbbf24)",
    messages: {
      today: "정말 좋은 에너지의 날이에요. 밖으로 나가서 햇볕을 쬐고 사람들과 어울려보세요.",
      love: "밝고 건강한 사랑의 에너지예요. 함께 있을 때 즐겁고 에너지가 충전되는 관계예요.",
      work: "노력이 빛을 발하는 시기예요. 적극적으로 나서면 좋은 결과와 인정이 따라와요.",
      choice: "밝은 에너지가 함께하니 어느 쪽을 선택해도 잘 풀릴 거예요. 직관대로 가세요.",
      heal: "마음이 밝아지고 있어요. 좋아하는 것들을 하며 기쁨을 적극적으로 찾아보세요.",
    },
  },
  {
    idx: 20, emoji: "🔔", name: "심판", keyword: "각성과 재탄생", bg: "linear-gradient(135deg,#134e4a,#14b8a6)",
    messages: {
      today: "중요한 판단을 내릴 날이에요. 과거를 돌아보고 앞으로 나아갈 방향을 결정하세요.",
      love: "관계를 재평가할 시점이에요. 계속 갈 것인지 새로 시작할 것인지 명확하게 직면하세요.",
      work: "다음 단계로 나아갈 부름이 있어요. 익숙한 것에서 벗어나 새로운 챕터를 열 용기가 필요해요.",
      choice: "오래 미뤄온 결정을 이제 내려야 할 때예요. 더 이상 회피하지 마세요.",
      heal: "과거의 자신을 용서하는 것이 치유의 시작이에요. 심판은 나를 벌하는 것이 아니라 새로 깨어나는 거예요.",
    },
  },
  {
    idx: 21, emoji: "🌍", name: "세계", keyword: "완성과 성취", bg: "linear-gradient(135deg,#064e3b,#34d399)",
    messages: {
      today: "무엇을 시작해도 완성을 향해 가는 날이에요. 큰 그림을 보고 자신감 있게 움직이세요.",
      love: "완성된 사랑의 에너지예요. 함께이기 때문에 둘 다 더 완전해지는 관계예요.",
      work: "프로젝트나 목표가 완성 단계에 가까워요. 끝까지 마무리하세요.",
      choice: "어떤 선택도 좋은 방향으로 완성될 거예요. 두려움 없이 선택하세요.",
      heal: "충분히 왔어요. 지금 있는 자리에서 자신을 인정하세요. 완성된 나를 축하할 자격이 있어요.",
    },
  },
];

export default function TarotResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<TarotResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [soulFlipped, setSoulFlipped] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockRemain, setUnlockRemain] = useState("");

  useEffect(() => {
    const checkUnlock = () => {
      const u = localStorage.getItem("tarot_unlock_until");
      if (!u || Number(u) <= Date.now()) { setIsUnlocked(false); return; }
      const _up = localStorage.getItem("tarot_unlock_phone")||""; const _pp=(()=>{try{return(JSON.parse(localStorage.getItem("v2_saved_profile")||"{}").phone||"").replace(/\D/g,"");}catch{return "";}})();
      setIsUnlocked(!_up || !_pp || _up === _pp);
    };
    checkUnlock();
    let timerId: ReturnType<typeof setInterval>;
    const updateCountdown = () => {
      const u = localStorage.getItem("tarot_unlock_until");
      if (!u) { setIsUnlocked(false); setUnlockRemain(""); clearInterval(timerId); return; }
      const ms = Number(u) - Date.now();
      if (ms <= 0) { localStorage.removeItem("tarot_unlock_until"); setIsUnlocked(false); setUnlockRemain(""); clearInterval(timerId); return; }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setUnlockRemain(h > 0 ? `${h}시간 ${m}분 남음` : `${m}분 ${s}초 남음`);
    };
    timerId = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    fetch(`/api/tarot/analyze?id=${id}`)
      .then(r => r.json())
      .then(d => { if (d.result) setResult(d.result); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!loading && result) {
      const t1 = setTimeout(() => setSoulFlipped(true), 400);
      const t2 = setTimeout(() => setFlipped(true), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [loading, result]);

  const redraw = () => router.push("/tarot");

  const share = () => {
    const url = `https://jeomun.com/tarot/result/${id}`;
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "🃏 타로 카드가 나에게 보내는 메시지",
            description: "점운 타로에서 오늘 나에게 오는 메시지를 확인해봐!",
            imageUrl: "https://i.pinimg.com/1200x/4d/aa/bb/4daabb706b7a50f71fcfdc1e7ae03c7a.jpg",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: "타로 결과 보기 🃏", link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 뽑아보기 →", link: { mobileWebUrl: "https://jeomun.com/tarot", webUrl: "https://jeomun.com/tarot" } },
          ],
        });
        return;
      } catch {}
    }
    navigator.clipboard?.writeText(url);
    setSharing(true);
    setTimeout(() => setSharing(false), 2000);
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#0f0320", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    btn: { width: "100%", background: "linear-gradient(135deg,#7c3aed,#c084fc)", color: "white", border: "none", borderRadius: 22, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer" } as const,
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spinCard{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}`}</style>
        <div style={{ fontSize: 64, animation: "spinCard 1.5s linear infinite" }}>🃏</div>
        <p style={{ color: "#c084fc", marginTop: 20, fontWeight: 700 }}>카드를 뽑는 중...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ ...S.wrap, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <p style={{ color: "#9ca3af" }}>결과를 불러올 수 없어요.</p>
        <button onClick={redraw} style={{ ...S.btn, marginTop: 20, maxWidth: 200 }}>다시 뽑기</button>
      </div>
    );
  }

  const soulCard = CARDS[result.soulCardIdx] || CARDS[0];
  const drawnCard = CARDS[result.cardIdx] || CARDS[17];
  const topic = result.topic || "today";
  const reading = drawnCard.messages[topic] || drawnCard.messages.today;
  const displayName = result.name || "당신";

  return (
    <div style={S.wrap}>
      <style>{`
        @keyframes flipIn{0%{transform:rotateY(-90deg);opacity:0}100%{transform:rotateY(0deg);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        .card-enter{animation:flipIn 0.6s ease-out both}
      `}</style>

      <div style={S.inner}>
        <div style={{ paddingTop: 32, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/tarot" style={{ color: "#c084fc", fontSize: 13, textDecoration: "none" }}>← 다시 뽑기</Link>
          <span style={{ fontSize: 13, color: "#6b7280" }}>점운 타로</span>
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 28 }}>{TOPIC_LABEL[topic]}</p>

        {/* 오행 소울카드 배너 */}
        <div style={{ background: OH_COLOR[result.oh], borderRadius: 20, padding: "20px 18px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.15)", opacity: soulFlipped ? 1 : 0, transform: soulFlipped ? "none" : "translateY(10px)", transition: "all 0.6s ease" }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "0 0 4px", fontWeight: 700, letterSpacing: 1 }}>
            {OH_EMOJI[result.oh]} {result.oh}오행 · {displayName}의 수호카드
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 60, height: 88, background: "rgba(0,0,0,0.3)", borderRadius: 8, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.3)", flexShrink: 0 }}>
              <span style={{ fontSize: 28 }}>{soulCard.emoji}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.9)", fontWeight: 700, marginTop: 4 }}>{soulCard.name}</span>
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: 16, margin: "0 0 4px" }}>No.{soulCard.idx} {soulCard.name}</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 }}>{OH_DESC[result.oh]}</p>
            </div>
          </div>
        </div>

        {/* 오늘 뽑은 카드 */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px" }}>오늘 {displayName}에게 온 카드</p>
          <div style={{ perspective: "1000px", display: "inline-block" }}>
            <div style={{
              width: 140, height: 210, position: "relative", cursor: "pointer",
              transformStyle: "preserve-3d",
              transition: "transform 0.8s",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }} onClick={() => setFlipped(f => !f)}>
              {/* 카드 뒷면 (타로 카드 뒷면 패턴) */}
              <div style={{
                position: "absolute", width: "100%", height: "100%",
                backfaceVisibility: "hidden",
                background: "linear-gradient(135deg,#1e1b4b,#4c1d95)",
                borderRadius: 14, display: "flex", flexDirection: "column" as const,
                alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(192,132,252,0.5)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              }}>
                <span style={{ fontSize: 40, opacity: 0.7 }}>🃏</span>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>탭해서 열기</p>
              </div>
              {/* 카드 앞면 */}
              <div style={{
                position: "absolute", width: "100%", height: "100%",
                backfaceVisibility: "hidden",
                background: drawnCard.bg,
                borderRadius: 14, display: "flex", flexDirection: "column" as const,
                alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                transform: "rotateY(180deg)",
              }}>
                <span style={{ fontSize: 50 }}>{drawnCard.emoji}</span>
                <p style={{ fontWeight: 900, fontSize: 14, margin: "10px 0 2px" }}>{drawnCard.name}</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>No.{drawnCard.idx}</p>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>탭하면 카드가 뒤집혀요</p>
        </div>

        {/* 카드 리딩 */}
        <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 20, padding: "20px 18px", marginBottom: 20, opacity: flipped ? 1 : 0.4, transition: "opacity 0.6s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 66, background: drawnCard.bg, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)" }}>
              <span style={{ fontSize: 22 }}>{drawnCard.emoji}</span>
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: 17, margin: "0 0 2px" }}>{drawnCard.name}</p>
              <p style={{ fontSize: 11, color: "#c084fc", margin: 0 }}>키워드: {drawnCard.keyword}</p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#e9d5ff", lineHeight: 1.8, margin: 0 }}>{reading}</p>
        </div>

        {/* 오행 에너지 설명 */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 18px", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 8px", fontWeight: 700 }}>{OH_EMOJI[result.oh]} {result.oh}오행 에너지 해설</p>
          <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.7, margin: 0 }}>
            {result.oh === "목" && "목오행은 성장과 새로운 시작의 에너지예요. 직진하는 힘이 강하고, 창의적인 도전을 즐겨요. 오늘 받은 카드는 그 성장 에너지와 함께 당신에게 메시지를 전해요."}
            {result.oh === "화" && "화오행은 열정과 표현의 에너지예요. 감정이 풍부하고 사람들에게 빛을 주는 따뜻함이 있어요. 오늘 받은 카드는 그 열정과 함께 당신에게 메시지를 전해요."}
            {result.oh === "토" && "토오행은 안정과 포용의 에너지예요. 중심이 단단하고 모든 것을 품어주는 힘이 있어요. 오늘 받은 카드는 그 안정 에너지와 함께 당신에게 메시지를 전해요."}
            {result.oh === "금" && "금오행은 결단과 정의의 에너지예요. 원칙이 분명하고 한 번 정한 방향은 흔들리지 않아요. 오늘 받은 카드는 그 결단 에너지와 함께 당신에게 메시지를 전해요."}
            {result.oh === "수" && "수오행은 직관과 지혜의 에너지예요. 깊은 곳을 흐르는 물처럼 표면 아래를 꿰뚫어 봐요. 오늘 받은 카드는 그 직관 에너지와 함께 당신에게 메시지를 전해요."}
          </p>
        </div>

        {/* 다시 뽑기 / 공유 버튼 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button onClick={redraw} style={{ flex: 1, background: "rgba(255,255,255,0.06)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.4)", borderRadius: 22, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            🔄 다시 뽑기
          </button>
          <button onClick={share} style={{ flex: 1, background: "linear-gradient(135deg,#7c3aed,#c084fc)", color: "white", border: "none", borderRadius: 22, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            {sharing ? "✅ 복사됨!" : "📤 공유하기"}
          </button>
        </div>

        {/* 나도 해보기 */}
        <Link href="/tarot" style={{ display: "block", textAlign: "center" as const, background: "rgba(192,132,252,0.08)", border: "1.5px solid rgba(192,132,252,0.35)", borderRadius: 16, padding: "14px", color: "#c084fc", textDecoration: "none", fontSize: 14, fontWeight: 900, marginBottom: 16 }}>
          나도 타로 뽑기 (무료) →
        </Link>

        {/* 유료 잠금 or 심층 분석 */}
        {!isUnlocked ? (
          <div style={{ background:"linear-gradient(135deg,#1e1b4b,#0f0320)", border:"2px solid rgba(192,132,252,0.5)", borderRadius:20, padding:"24px 20px", marginBottom:16, textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🔒</div>
            <p style={{ fontSize:16, fontWeight:900, color:"white", margin:"0 0 8px" }}>심층 타로 분석</p>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.75, margin:"0 0 6px" }}>
              💡 오늘의 조언 · 🎱 오늘의 행운번호<br/>
              ✨ 오라 색깔 분석 · 🪬 전생 직업
            </p>
            <p style={{ fontSize:12, color:"#c084fc", margin:"0 0 18px" }}>결제 후 24시간 열람 가능합니다</p>
            <Link href={`/tarot/pay?id=${id}`} style={{ display:"inline-block", background:"linear-gradient(135deg,#7c3aed,#c084fc)", color:"white", borderRadius:22, padding:"13px 28px", fontSize:14, fontWeight:900, textDecoration:"none" }}>
              ₩990으로 전체 분석 보기 →
            </Link>
          </div>
        ) : (
          <>
            {unlockRemain && (
              <div style={{ background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.25)", borderRadius:10, padding:"8px 14px", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:14 }}>⏱️</span>
                <span style={{ fontSize:12, color:"#4ade80" }}>이용 가능: <b>{unlockRemain}</b></span>
              </div>
            )}

            {/* 오늘의 조언 */}
            <div style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.3)", borderRadius:16, padding:"20px 18px", marginBottom:14 }}>
              <p style={{ fontSize:13, fontWeight:900, color:"#c084fc", margin:"0 0 10px" }}>💡 오늘의 조언</p>
              <p style={{ fontSize:15, color:"#e9d5ff", lineHeight:1.8, margin:0 }}>
                {CARD_ADVICE[drawnCard.idx] || "오늘 하루도 자신을 믿고 나아가세요."}
              </p>
            </div>

            {/* 행운번호 */}
            {(() => {
              const today = new Date();
              const nums = getLuckyNumbers(result.birthYear || 1990, today.getMonth()+1, today.getDate());
              const numColors = ["#fbbf24","#60a5fa","#f97316","#9ca3af","#4ade80"];
              return (
                <div style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:16, padding:"20px 18px", marginBottom:14 }}>
                  <p style={{ fontSize:13, fontWeight:900, color:"#a5b4fc", margin:"0 0 14px" }}>🎱 오늘의 행운번호</p>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap" as const, justifyContent:"center" }}>
                    {nums.map((n, i) => (
                      <div key={i} style={{ width:46, height:46, borderRadius:"50%", background:numColors[Math.floor(n/9)%numColors.length], display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:16, color:"white", boxShadow:"0 2px 8px rgba(0,0,0,0.4)" }}>
                        {n}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize:11, color:"#6b7280", textAlign:"center" as const, marginTop:10, marginBottom:0 }}>오행 에너지로 계산된 오늘의 숫자</p>
                </div>
              );
            })()}

            {/* 오라 색깔 */}
            {(() => {
              const aura = AURA[result.oh];
              if (!aura) return null;
              return (
                <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"20px 18px", marginBottom:14 }}>
                  <p style={{ fontSize:13, fontWeight:900, color:aura.color, margin:"0 0 14px" }}>✨ {displayName}의 오라</p>
                  <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:12 }}>
                    <div style={{ width:56, height:56, borderRadius:"50%", background:aura.color, boxShadow:`0 0 24px ${aura.color}88`, flexShrink:0 }} />
                    <div>
                      <p style={{ fontSize:18, fontWeight:900, color:aura.color, margin:"0 0 2px" }}>{aura.name}</p>
                      <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>{result.oh}오행 에너지</p>
                    </div>
                  </div>
                  <p style={{ fontSize:14, color:"#d1d5db", lineHeight:1.8, margin:0 }}>{aura.desc}</p>
                </div>
              );
            })()}

            {/* 전생 직업 */}
            {(() => {
              const past = getPastLife(result.oh, result.birthYear || 1990);
              return (
                <div style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.12),rgba(192,132,252,0.06))", border:"1px solid rgba(192,132,252,0.25)", borderRadius:16, padding:"20px 18px", marginBottom:16 }}>
                  <p style={{ fontSize:13, fontWeight:900, color:"#c084fc", margin:"0 0 12px" }}>🪬 전생 직업</p>
                  <p style={{ fontSize:20, fontWeight:900, color:"white", margin:"0 0 4px" }}>{past.job}</p>
                  <p style={{ fontSize:12, color:"#9ca3af", margin:"0 0 10px" }}>{past.era}</p>
                  <p style={{ fontSize:14, color:"#d1d5db", lineHeight:1.8, margin:0 }}>{past.story}</p>
                </div>
              );
            })()}
          </>
        )}

        {/* 사주 연결 CTA */}
        <div style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.18),rgba(192,132,252,0.1))", border: "1px solid rgba(192,132,252,0.35)", borderRadius: 20, padding: "22px 18px" }}>
          <p style={{ fontWeight: 900, fontSize: 15, margin: "0 0 6px" }}>🔮 타로가 맞는다면 사주는 더 정확해요</p>
          <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, margin: "0 0 6px" }}>
            {displayName}의 {result.oh}오행 에너지를 사주 원국으로 분석하면<br />
            연애·직업·재물 흐름을 훨씬 정확하게 알 수 있어요.
          </p>

          <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg,#7c3aed,#c084fc)", color: "white", borderRadius: 22, padding: "14px", fontSize: 15, fontWeight: 900, textAlign: "center", textDecoration: "none", boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
            사주로 더 정확하게 확인하기 →
          </Link>
          <p style={{ fontSize: 11, color: "rgba(192,132,252,0.5)", margin: "8px 0 0", textAlign: "center" }}>990원 · 단 1회 결제 · 반복청구 없음</p>
        </div>
      </div>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          const k = (window as any).Kakao;
          if (k && !k.isInitialized()) k.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }}
      />
    </div>
  );
}
