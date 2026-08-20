"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";

type PetPersonality = { title: string; desc: string; trait: string; care: string; play: string; emotion: string };
type OhFood = { best: string[]; good: string[]; desc: string };
type CompatDesc = { grade: string; summary: string; detail: string };
type Result = {
  petName: string; petBirthYear: string; petBirthMonth: string; petBirthDay: string; petSpecies: string;
  ownerName: string; ownerBirthYear: string | null;
  petOh: string; ownerOh: string | null;
  petPersonality: PetPersonality;
  ohFood: OhFood;
  compatScore: number | null;
  compatDesc: CompatDesc | null;
  phone?: string;
};

// ── 음식 안전도 DB ─────────────────────────────
const FOOD_DB: { name: string; level: "danger" | "caution" | "safe"; reason: string }[] = [
  // 위험
  { name: "초콜릿", level: "danger", reason: "테오브로민 성분이 심장·신경계에 독성을 줘요. 절대 금지!" },
  { name: "포도", level: "danger", reason: "신장 손상을 유발해요. 건포도도 포함, 소량도 위험해요." },
  { name: "건포도", level: "danger", reason: "신장 손상을 유발해요. 소량도 매우 위험해요." },
  { name: "양파", level: "danger", reason: "적혈구를 파괴해 빈혈을 유발해요. 익혀도 위험해요." },
  { name: "마늘", level: "danger", reason: "양파와 같은 성분으로 적혈구를 파괴해요. 양보다 소량도 위험해요." },
  { name: "파", level: "danger", reason: "양파·마늘과 같은 파속 식물, 독성 있어요." },
  { name: "부추", level: "danger", reason: "파속 식물로 적혈구를 파괴할 수 있어요." },
  { name: "자일리톨", level: "danger", reason: "껌·캔디에 많아요. 혈당 급강하와 간 손상을 유발해요." },
  { name: "아보카도", level: "danger", reason: "퍼신 성분이 구토·설사를 유발해요." },
  { name: "커피", level: "danger", reason: "카페인이 심박 이상·경련을 유발해요." },
  { name: "녹차", level: "danger", reason: "카페인 함유. 강아지에게 독성이에요." },
  { name: "술", level: "danger", reason: "알코올이 간·뇌 손상을 유발해요. 소량도 위험해요." },
  { name: "마카다미아", level: "danger", reason: "구토·고열·근육 마비를 유발해요." },
  { name: "생 돼지고기", level: "danger", reason: "기생충 감염 위험이 있어요. 반드시 완전히 익혀주세요." },
  { name: "자두", level: "danger", reason: "씨앗에 청산가리 성분이 있어요. 씨앗은 절대 금지!" },
  { name: "복숭아", level: "danger", reason: "씨앗에 독성 성분 있어요. 과육은 소량 가능하나 씨앗은 금지!" },
  { name: "살구", level: "danger", reason: "씨앗에 독성 성분 있어요." },
  { name: "체리", level: "danger", reason: "씨앗과 잎에 청산가리 성분이 있어요." },
  { name: "생 계란 흰자", level: "danger", reason: "아비딘이 비오틴 흡수를 방해해요." },
  { name: "날고기 뼈", level: "danger", reason: "조각나면 내장을 찌를 수 있어요. 익힌 뼈도 위험해요." },
  { name: "익힌 뼈", level: "danger", reason: "쉽게 부서져 식도·장을 찌를 수 있어요." },
  { name: "고추", level: "danger", reason: "캡사이신이 소화 기관을 자극해요." },
  { name: "고추장", level: "danger", reason: "소금·고추 성분이 모두 위험해요." },
  { name: "된장", level: "danger", reason: "나트륨 과다. 신장에 부담을 줘요." },
  { name: "간장", level: "danger", reason: "나트륨 과다. 신장에 매우 나빠요." },
  { name: "소금", level: "danger", reason: "나트륨 과다 시 구토·경련·신장 손상을 유발해요." },
  { name: "설탕", level: "danger", reason: "비만·충치·당뇨 유발. 특히 자일리톨 함유 제품 주의!" },
  { name: "버터", level: "danger", reason: "지방이 너무 많아 췌장염 위험이 있어요." },
  { name: "아이스크림", level: "danger", reason: "유당불내증+설탕+자일리톨 위험. 먹이지 마세요." },
  { name: "우유", level: "caution", reason: "유당불내증 있는 강아지가 많아 설사를 유발할 수 있어요. 소량 시험 후 반응 확인해요." },
  // 주의
  { name: "사과", level: "caution", reason: "씨앗 제거 후 소량만! 씨앗에 청산가리 성분 있어요." },
  { name: "수박", level: "caution", reason: "씨앗 제거 후 소량만! 당분이 높아 너무 많이 주면 안 돼요." },
  { name: "배", level: "caution", reason: "씨앗 제거 후 소량. 당분 주의." },
  { name: "바나나", level: "caution", reason: "당분이 높아 소량만 주세요. 비만견은 특히 주의!" },
  { name: "귤", level: "caution", reason: "소량은 괜찮지만 산도가 높아 많이 주면 배탈 날 수 있어요." },
  { name: "오렌지", level: "caution", reason: "소량은 가능하나 산도 주의." },
  { name: "고구마", level: "caution", reason: "익혀서 소량 가능. 너무 많으면 칼로리 과다예요." },
  { name: "호박", level: "caution", reason: "익혀서 소량 가능. 소화에 좋지만 과다는 금물." },
  { name: "달걀", level: "caution", reason: "완전히 익혀서 주세요. 날달걀 흰자는 위험해요." },
  { name: "치즈", level: "caution", reason: "유당 함량 낮아 소량 가능. 나트륨 주의, 자주 주면 안 돼요." },
  { name: "땅콩버터", level: "caution", reason: "자일리톨 없는 무염 제품만! 자일리톨 함유 제품은 독성!" },
  { name: "오트밀", level: "caution", reason: "익혀서 소량 가능. 당뇨·비만견은 주의해요." },
  { name: "현미", level: "caution", reason: "소량 가능. 소화력 약한 강아지는 주의." },
  { name: "두부", level: "caution", reason: "소량은 가능하지만 단백질 급원으로 자주 주면 소화 문제." },
  { name: "버섯", level: "caution", reason: "마트용 식용 버섯 소량은 가능. 야생 버섯은 절대 금지!" },
  { name: "옥수수", level: "caution", reason: "알갱이 소량 가능. 옥수수 속대는 질식 위험이 있어요." },
  { name: "파인애플", level: "caution", reason: "소량 가능. 당분·산도 높아 너무 많이 주면 안 돼요." },
  { name: "코코넛", level: "caution", reason: "소량은 가능하지만 지방이 많아 자주 주면 췌장 문제." },
  { name: "새우", level: "caution", reason: "완전히 익히고 껍질·머리 제거 후 소량 가능." },
  // 안전
  { name: "닭고기", level: "safe", reason: "완전히 익혀서 주세요. 뼈 없이! 단백질 최고의 공급원이에요." },
  { name: "삶은 닭고기", level: "safe", reason: "강아지에게 최고의 단백질 공급원! 뼈 제거 필수." },
  { name: "소고기", level: "safe", reason: "익혀서 주세요. 철분·단백질이 풍부해요." },
  { name: "연어", level: "safe", reason: "완전히 익혀서 주세요. 오메가3가 풍부해 피부·털에 좋아요." },
  { name: "고등어", level: "safe", reason: "완전히 익혀서, 뼈 제거 후. 오메가3 풍부해요." },
  { name: "당근", level: "safe", reason: "생으로 줘도 안전! 칼로리 낮고 베타카로틴이 풍부해요." },
  { name: "브로콜리", level: "safe", reason: "소량은 안전해요. 너무 많으면 소화 문제 가능." },
  { name: "블루베리", level: "safe", reason: "항산화 성분이 풍부한 최고의 간식이에요." },
  { name: "딸기", level: "safe", reason: "소량 안전. 비타민C가 풍부해요." },
  { name: "수박(씨없는)", level: "safe", reason: "씨앗 제거 후 안전. 여름 수분 보충에 좋아요." },
  { name: "오이", level: "safe", reason: "칼로리 낮고 수분 많아 다이어트 간식으로 좋아요." },
  { name: "완두콩", level: "safe", reason: "단백질·섬유소 풍부. 소량씩 주세요." },
  { name: "껍질콩", level: "safe", reason: "섬유질 풍부하고 안전한 채소예요." },
  { name: "시금치", level: "safe", reason: "소량 안전. 너무 많으면 신장 결석 가능." },
  { name: "쌀밥", level: "safe", reason: "소화에 좋아요. 설사 시 도움이 돼요." },
  { name: "코티지치즈", level: "safe", reason: "유당 낮고 단백질 높아 소량 안전해요." },
  { name: "삶은 달걀", level: "safe", reason: "완전히 익히면 안전한 단백질 공급원이에요." },
  { name: "참외", level: "caution", reason: "씨앗 제거 후 소량 가능. 당분 주의." },
];

// ── 오행별 콘텐츠 ─────────────────────────────
function getHealthInfo(oh: string) {
  const m: Record<string, { energy: number; longLive: string[]; avoid: string[]; symptoms: string[] }> = {
    목: { energy: 88, longLive: ["매일 30분 이상 산책 필수", "퍼즐 장난감으로 지루함 방지", "후각 자극 놀이로 두뇌 활성화", "다양한 환경 탐험으로 스트레스 해소", "체중 관리 (관절 건강 위해)"], avoid: ["장시간 집에 가두기", "운동 부족", "반복적인 단조로운 일상", "과식 방치", "너무 격렬한 놀이 후 충분한 쉬는 시간 없애기"], symptoms: ["운동 부족 시 파괴적 행동", "관절 문제 주의", "사료 외 음식 욕심이 많을 수 있음"] },
    화: { energy: 92, longLive: ["충분한 스킨십과 관심", "과도한 흥분 방지 (심장 건강)", "규칙적인 운동으로 에너지 방출", "스트레스 없는 환경", "여름철 체온 관리 특히 중요"], avoid: ["혼자 오래 두기", "관심 부족", "과도한 흥분 상태 방치", "더위에 오래 노출", "무시하거나 차갑게 대하기"], symptoms: ["분리불안 주의", "피부 트러블 가능성", "과도한 짖음은 관심 요구 신호"] },
    토: { energy: 85, longLive: ["규칙적인 식사·산책 루틴 유지", "안정적인 가정 환경", "스트레스 없는 일상", "정기 건강검진", "소화기 건강 관리"], avoid: ["갑작스러운 이사·환경 변화", "불규칙한 식사 시간", "가족 갈등 노출", "낯선 사람 강요 접촉", "사료 변경 시 급격한 변환"], symptoms: ["소화기 예민 가능성", "스트레스 시 식욕 변화", "환경 변화 후 무기력 주의"] },
    금: { energy: 82, longLive: ["자기만의 공간(쉼터) 마련", "조용하고 안정적인 환경", "강요 없는 스킨십", "지적 자극 (퍼즐 게임)", "관절 건강 관리"], avoid: ["무리하게 안기 시도", "시끄럽고 혼잡한 환경", "독립 공간 침해", "강압적 훈련", "과도한 사회화 강요"], symptoms: ["스트레스 시 공격성 가능", "혼자 있고 싶을 때 신호 파악 중요", "불안 시 숨는 행동"] },
    수: { energy: 90, longLive: ["충분한 정신적 자극 (훈련·퍼즐)", "안정적인 감정 환경", "규칙적인 생활 리듬", "충분한 수면 보장", "뇌 건강 음식 (오메가3)"], avoid: ["집안 갈등·큰 소리", "단조롭고 자극 없는 환경", "불안정한 루틴", "감정적으로 불안정한 환경", "강아지 신호 무시"], symptoms: ["보호자 감정 변화에 민감", "스트레스 시 과도한 핥기", "불안 시 특이한 행동 패턴"] },
  };
  return m[oh] || m["목"];
}

function getBehaviorExplanation(oh: string) {
  const m: Record<string, { title: string; behaviors: { action: string; reason: string }[] }> = {
    목: { title: "모험가 기질의 행동 패턴", behaviors: [
      { action: "물건을 계속 씹어요", reason: "탐험 본능과 지루함 표현이에요. 충분한 운동과 씹을 수 있는 장난감을 제공하세요." },
      { action: "냄새를 계속 맡으며 당겨요", reason: "세상 탐험 본능이에요! 후각이 발달한 목오행의 특성, 탐험할 시간을 충분히 주세요." },
      { action: "집에서도 뛰어다녀요", reason: "에너지가 넘쳐서예요. 하루 운동량이 부족하다는 신호예요." },
      { action: "훈련을 금방 배워요", reason: "목오행의 빠른 학습 능력이에요! 칭찬 보상 훈련이 잘 먹혀요." },
    ]},
    화: { title: "애교쟁이 기질의 행동 패턴", behaviors: [
      { action: "과도하게 짖어요", reason: "관심이 부족해서예요. 더 많은 스킨십과 놀이 시간이 필요해요." },
      { action: "보호자를 항상 따라다녀요", reason: "화오행 강아지의 강한 유대감 본능이에요. 건강한 범위에서는 정상이에요." },
      { action: "낯선 사람에게도 먼저 다가가요", reason: "사교적인 화오행 본성이에요! 다양한 사람과 긍정적 경험이 중요해요." },
      { action: "혼났을 때 오래 풀이 죽어요", reason: "감수성이 예민한 화오행 특성이에요. 단호하되 금방 화해해주세요." },
    ]},
    토: { title: "충성파 기질의 행동 패턴", behaviors: [
      { action: "낯선 사람에게 짖어요", reason: "가족 보호 본능이에요. 낯선 사람과 긍정적 경험을 천천히 쌓아주세요." },
      { action: "이사 후 무기력해요", reason: "안정을 중요시하는 토오행 특성이에요. 새 환경에서도 루틴을 유지해주세요." },
      { action: "식사 시간을 정확히 알아요", reason: "규칙적인 루틴을 사랑하는 토오행 본성이에요! 정해진 시간에 주는 게 중요해요." },
      { action: "보호자 옆에 항상 있어요", reason: "깊은 충성심의 표현이에요. 이 아이는 당신을 온 마음으로 사랑해요." },
    ]},
    금: { title: "독립파 기질의 행동 패턴", behaviors: [
      { action: "안으려 하면 피해요", reason: "자기 공간을 존중받고 싶은 금오행 본성이에요. 강아지가 먼저 다가올 때 반응해주세요." },
      { action: "혼자 있는 시간을 즐겨요", reason: "독립적인 금오행 특성이에요. 정상 행동이니 걱정하지 마세요." },
      { action: "낯선 환경에서 경계해요", reason: "신중한 금오행 본성이에요. 새 환경에 천천히 적응할 시간을 주세요." },
      { action: "특정 물건에 집착해요", reason: "자기 물건 인식이 강한 금오행 특성이에요. 자기만의 장난감을 갖게 해주세요." },
    ]},
    수: { title: "천재 기질의 행동 패턴", behaviors: [
      { action: "보호자 기분 변화를 금방 알아요", reason: "수오행의 강한 직관력이에요. 보호자 감정을 체감하는 공감 능력이 높아요." },
      { action: "지루하면 말썽을 피워요", reason: "영리한 수오행이 자극이 부족할 때 스스로 자극을 찾아요. 퍼즐 장난감을 주세요!" },
      { action: "훈련을 매우 빨리 배워요", reason: "수오행의 뛰어난 지능이에요! 고급 훈련도 도전해볼 만해요." },
      { action: "스트레스 시 과도하게 핥아요", reason: "감수성이 높은 수오행의 불안 표현이에요. 안정적인 환경이 중요해요." },
    ]},
  };
  return m[oh] || m["목"];
}

function getFavorites(oh: string): { rank: number; item: string; reason: string }[] {
  const m: Record<string, { rank: number; item: string; reason: string }[]> = {
    목: [
      { rank: 1, item: "🌳 새로운 곳 산책", reason: "탐험 본능이 강해 새로운 냄새와 환경을 가장 좋아해요" },
      { rank: 2, item: "🎾 공 던지기 놀이", reason: "달리고 탐험하는 행동 본능이 충족돼요" },
      { rank: 3, item: "🔍 냄새 찾기 게임", reason: "후각 자극 놀이가 두뇌를 만족시켜요" },
      { rank: 4, item: "🦴 새로운 간식 도전", reason: "새로운 것을 탐험하는 본능이 음식에도 나타나요" },
      { rank: 5, item: "👫 함께 달리기", reason: "보호자와 함께 움직이는 것을 최고로 좋아해요" },
    ],
    화: [
      { rank: 1, item: "💝 스킨십·안아주기", reason: "관심받는 것을 가장 좋아하는 화오행 본성이에요" },
      { rank: 2, item: "🎉 새로운 사람 만나기", reason: "사교적인 화오행은 낯선 사람도 반겨요" },
      { rank: 3, item: "🧸 터그 줄 놀이", reason: "열정적인 놀이가 에너지를 방출해줘요" },
      { rank: 4, item: "🐾 놀이터 방문", reason: "다른 강아지와 뛰어노는 것을 좋아해요" },
      { rank: 5, item: "😴 보호자 옆에서 낮잠", reason: "보호자 곁에 있는 것 자체가 행복이에요" },
    ],
    토: [
      { rank: 1, item: "🏡 가족과 함께 소파", reason: "가족과 함께하는 평범한 일상이 가장 행복이에요" },
      { rank: 2, item: "⏰ 정해진 시간 산책", reason: "예측 가능한 루틴이 안정감을 줘요" },
      { rank: 3, item: "🦴 씹을 수 있는 껌·장난감", reason: "혼자 조용히 씹는 활동을 좋아해요" },
      { rank: 4, item: "🛋️ 자기 자리·침대", reason: "정해진 자기 공간이 있을 때 가장 편안해해요" },
      { rank: 5, item: "🌿 느린 동네 산책", reason: "빠른 운동보다 여유로운 탐험을 좋아해요" },
    ],
    금: [
      { rank: 1, item: "🧩 혼자 노는 퍼즐 장난감", reason: "독립적으로 문제를 해결하는 것을 즐겨요" },
      { rank: 2, item: "🛏️ 자기만의 쉼터", reason: "자기 공간에서 혼자 쉬는 것을 가장 좋아해요" },
      { rank: 3, item: "🌬️ 창문 밖 구경", reason: "조용히 세상을 관찰하는 것을 즐겨요" },
      { rank: 4, item: "🐾 선택적 산책", reason: "자기가 원할 때 하는 산책을 가장 즐겨요" },
      { rank: 5, item: "🤫 조용한 집 시간", reason: "시끄럽지 않은 평화로운 환경을 사랑해요" },
    ],
    수: [
      { rank: 1, item: "🎓 새로운 훈련 배우기", reason: "영리한 수오행은 배우는 것 자체를 즐겨요" },
      { rank: 2, item: "🧩 고난도 퍼즐 게임", reason: "두뇌를 쓰는 활동이 최고의 만족감을 줘요" },
      { rank: 3, item: "🌊 물놀이", reason: "수오행 에너지와 공명하는 물 활동을 좋아해요" },
      { rank: 4, item: "🔭 조용한 탐험", reason: "주변을 천천히 관찰하고 분석하는 것을 즐겨요" },
      { rank: 5, item: "💤 보호자 옆 조용한 시간", reason: "함께 있되 조용히 있는 것을 선호해요" },
    ],
  };
  return m[oh] || m["목"];
}

const PET_CARDS = [
  { name: "🌟 행운의 산책", meaning: "오늘은 새로운 길로 산책을 나가보세요. 좋은 냄새와 만남이 기다리고 있어요!" },
  { name: "💝 특별한 간식 데이", meaning: "오늘만큼은 특별한 간식을 선물해주세요. 우리 아이의 눈이 반짝일 거예요." },
  { name: "🛁 목욕 & 그루밍", meaning: "오늘 목욕을 시켜주면 몸도 마음도 상쾌해져요. 드라이 후 칭찬을 듬뿍 해주세요!" },
  { name: "🧸 새 장난감의 기운", meaning: "새로운 장난감 에너지가 들어오는 날이에요. 탐험 본능을 자극해줄 선물 어떨까요?" },
  { name: "☀️ 햇살 낮잠 에너지", meaning: "햇살 아래 함께 낮잠 자는 최고의 날이에요. 보호자와 함께 쉬는 것이 오늘 최고의 선물이에요." },
  { name: "🏃 에너지 발산 데이", meaning: "오늘은 에너지가 넘치는 날! 마음껏 뛰어놀 공간을 만들어주세요." },
  { name: "💬 소통의 기운", meaning: "오늘은 우리 아이가 뭔가 말하고 싶어해요. 표정과 행동에 집중해서 들어주세요." },
  { name: "🌈 치유의 에너지", meaning: "몸도 마음도 회복되는 날이에요. 조용하고 편안한 환경을 만들어 주세요." },
  { name: "🎉 축제 에너지", meaning: "오늘은 우리 아이에게 특별한 날이에요. 평소보다 더 많이 칭찬하고 놀아주세요!" },
  { name: "🔮 직감의 날", meaning: "우리 아이의 직감이 예리한 날이에요. 이상한 행동을 하면 주변을 한번 살펴보세요." },
  { name: "💤 휴식의 기운", meaning: "오늘은 푹 쉬어야 하는 날이에요. 조용한 공간에서 충분히 쉬게 해주세요." },
  { name: "🌿 자연 탐험 에너지", meaning: "풀냄새, 흙냄새 맡을 수 있는 자연으로 나가보세요. 최고의 힐링이 될 거예요!" },
  { name: "❤️ 사랑 넘치는 날", meaning: "오늘은 보호자와 유대가 깊어지는 날이에요. 눈을 마주치며 천천히 쓰다듬어 주세요." },
  { name: "🎓 학습 에너지", meaning: "오늘은 훈련이 잘 들어가는 날! 새로운 것을 가르쳐보거나 칭찬 훈련을 해보세요." },
  { name: "🌙 달빛 산책", meaning: "저녁 산책이 특별히 좋은 날이에요. 시원한 바람과 함께 여유롭게 걸어보세요." },
];

function getOhColor(oh: string) {
  return ({ 목: "#4ade80", 화: "#f87171", 토: "#fbbf24", 금: "#94a3b8", 수: "#60a5fa" })[oh] || "#a78bfa";
}
function getOhEmoji(oh: string) {
  return ({ 목: "🌳", 화: "🔥", 토: "🪨", 금: "⚡", 수: "🌊" })[oh] || "✨";
}

export default function PetunResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [foodQuery, setFoodQuery] = useState("");
  const [foodResult, setFoodResult] = useState<typeof FOOD_DB[0] | null | "none">(null);
  const [activeTab, setActiveTab] = useState<"personality"|"health"|"food"|"behavior"|"fav">("personality");
  const [petCard, setPetCard] = useState<typeof PET_CARDS[0] | null>(null);
  const [petCardFlipped, setPetCardFlipped] = useState(false);
  const [petCardUsed, setPetCardUsed] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockRemain, setUnlockRemain] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/petun/analyze?id=${id}`)
      .then(r => r.json())
      .then(data => { if (data.result) setResult(data.result); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    const update = () => {
      const u = localStorage.getItem("petun_unlock_until");
      if (!u) { setIsUnlocked(false); setUnlockRemain(""); return; }
      const ms = Number(u) - Date.now();
      if (ms <= 0) { localStorage.removeItem("petun_unlock_until"); setIsUnlocked(false); setUnlockRemain(""); return; }
      const _up = localStorage.getItem("petun_unlock_phone")||""; const _rp=(result?.phone||"").replace(/\D/g,"");
      if(!_up || !_rp || _up !== _rp){setIsUnlocked(false);setUnlockRemain("");return;}
      setIsUnlocked(true);
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setUnlockRemain(h > 0 ? `${h}시간 ${m}분 남음` : `${m}분 ${s}초 남음`);
    };
    update();
    timerId = setInterval(update, 1000);
    return () => clearInterval(timerId);
  }, [result]);

  const searchFood = () => {
    const q = foodQuery.trim().toLowerCase();
    if (!q) return;
    const found = FOOD_DB.find(f => f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase()));
    setFoodResult(found || "none");
  };

  const share = () => {
    if (!result) return;
    const url = `https://jeomun.com/petun/result/${id}`;
    const kakao = (window as any).Kakao;
    if (kakao?.isInitialized() && kakao?.Share) {
      try {
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `🐾 ${result.petName}(${result.petOh}오행) ${result.petPersonality.title}`,
            description: `${result.petSpecies} 사주 분석! 점운 펫운에서 확인해봐!`,
            imageUrl: "https://i.pinimg.com/1200x/0f/8e/e2/0f8ee29760fa339bfdf211369cf2d100.jpg",
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [
            { title: `${result.petName} 결과 보기 🐾`, link: { mobileWebUrl: url, webUrl: url } },
            { title: "나도 해보기 →", link: { mobileWebUrl: "https://jeomun.com/petun", webUrl: "https://jeomun.com/petun" } },
          ],
        });
        return;
      } catch {}
    }
    navigator.clipboard?.writeText(url);
    alert("링크 복사됐어요! 🐾");
  };

  const S = {
    wrap: { minHeight: "100vh", background: "#05000f", color: "#F5F5F5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" },
    inner: { maxWidth: 440, margin: "0 auto", padding: "0 16px 80px" },
    card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "18px 16px", marginBottom: 14 },
    secTitle: { fontSize: 12, fontWeight: 900, color: "#06b6d4", margin: "0 0 10px", letterSpacing: "0.08em", textTransform: "uppercase" as const },
    body: { fontSize: 14, color: "#d1d5db", lineHeight: 1.8, margin: 0 },
    tabBtn: (active: boolean) => ({
      flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
      background: active ? "rgba(6,182,212,0.25)" : "transparent",
      color: active ? "#06b6d4" : "#6b7280", fontSize: 11, fontWeight: active ? 900 : 400, cursor: "pointer",
    }),
  };

  if (loading) {
    return (
      <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
          <p style={{ color: "#06b6d4" }}>사주 분석 중...</p>
        </div>
      </div>
    );
  }
  if (!result) {
    return (
      <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p style={{ color: "#9ca3af", marginBottom: 16 }}>결과를 찾을 수 없어요</p>
          <Link href="/petun" style={{ color: "#06b6d4" }}>새로 분석하기</Link>
        </div>
      </div>
    );
  }

  const ohColor = getOhColor(result.petOh);
  const health = getHealthInfo(result.petOh);
  const behavior = getBehaviorExplanation(result.petOh);
  const favorites = getFavorites(result.petOh);

  return (
    <div style={S.wrap}>
      <div style={S.inner}>
        {/* 헤더 */}
        <div style={{ paddingTop: 32, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/petun" style={{ color: "#06b6d4", fontSize: 13, textDecoration: "none" }}>← 다시 분석하기</Link>
          <button onClick={share} style={{ background: "rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.4)", borderRadius: 20, padding: "6px 14px", color: "#a5f3fc", fontSize: 12, cursor: "pointer" }}>
            공유하기 🐾
          </button>
        </div>

        {/* 메인 카드 */}
        <div style={{ background: `linear-gradient(135deg,${ohColor}15,rgba(0,0,0,0))`, border: `2px solid ${ohColor}44`, borderRadius: 24, padding: "24px 18px", marginBottom: 16, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${ohColor}22`, border: `2px solid ${ohColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 14px" }}>
            {getOhEmoji(result.petOh)}
          </div>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px", letterSpacing: "0.1em" }}>
            {result.petSpecies} · {result.petOh}오행 · {result.petBirthYear}년생
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "white", margin: "0 0 6px" }}>
            {result.petName}
          </h2>
          {isUnlocked ? (
            <>
              <div style={{ display: "inline-block", background: `${ohColor}22`, border: `1px solid ${ohColor}55`, borderRadius: 20, padding: "6px 18px", marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: ohColor }}>{result.petPersonality.title}</span>
              </div>
              <p style={S.body}>{result.petPersonality.desc}</p>
            </>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1.5px dashed rgba(255,255,255,0.2)", borderRadius: 14, padding: "12px 14px", marginBottom: 4 }}>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>🔒 {result.petName}의 성격 유형은 잠금 해제 후 확인할 수 있어요</p>
            </div>
          )}

          {/* 생명력 에너지 */}
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 6px" }}>생명력 에너지</p>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 6 }}>
              <div style={{ width: `${health.energy}%`, height: "100%", background: `linear-gradient(90deg,${ohColor}88,${ohColor})`, borderRadius: 99 }} />
            </div>
            <p style={{ fontSize: 18, fontWeight: 900, color: ohColor, margin: 0 }}>{health.energy}점</p>
          </div>
        </div>

        {/* 공유 버튼 */}
        <button onClick={share} style={{ width: "100%", background: "rgba(6,182,212,0.15)", border: "2px solid rgba(6,182,212,0.4)", borderRadius: 14, padding: "12px", fontSize: 13, fontWeight: 700, color: "#a5f3fc", cursor: "pointer", marginBottom: 16 }}>
          🐾 우리 {result.petName} 사주 — 친구에게 공유하기
        </button>

        {/* 오늘 강아지 운세 뽑기 */}
        {isUnlocked ? (
          <div style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.12),rgba(124,58,237,0.08))", border: "1px solid rgba(6,182,212,0.35)", borderRadius: 20, padding: "18px 16px", marginBottom: 14 }}>
            <p style={{ fontSize: 12, fontWeight: 900, color: "#06b6d4", margin: "0 0 6px", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>🎴 오늘 강아지 운세 뽑기</p>
            <p style={{ fontSize: 13, color: "#a5f3fc", margin: "0 0 14px", lineHeight: 1.6 }}>
              오늘 {result.petName}에게 어떤 에너지가 필요한지 카드로 확인해보세요
            </p>
            {!petCardUsed ? (
              <button
                onClick={() => {
                  const card = PET_CARDS[Math.floor(Math.random() * PET_CARDS.length)];
                  setPetCard(card);
                  setPetCardUsed(true);
                  setTimeout(() => setPetCardFlipped(true), 50);
                }}
                style={{ width: "100%", background: "linear-gradient(135deg,#0e4e6a,#1e3a5f)", border: "2px solid rgba(6,182,212,0.5)", borderRadius: 16, padding: "20px", cursor: "pointer", color: "white" }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎴</div>
                <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px" }}>오늘의 카드 뽑기</p>
                <p style={{ fontSize: 11, color: "#a5f3fc", margin: 0 }}>탭해서 {result.petName}의 오늘 운세 확인하기</p>
              </button>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ background: "linear-gradient(135deg,#0e4e6a,#1a3a5f)", border: "2px solid #06b6d4", borderRadius: 16, padding: "22px 18px", opacity: petCardFlipped ? 1 : 0, transform: petCardFlipped ? "scale(1)" : "scale(0.92)", transition: "all 0.4s ease" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>✨</div>
                  <p style={{ fontSize: 16, fontWeight: 900, color: "#a5f3fc", margin: "0 0 10px" }}>{petCard?.name}</p>
                  <p style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.7, margin: 0 }}>{petCard?.meaning}</p>
                </div>
                <button
                  onClick={() => { setPetCardFlipped(false); setTimeout(() => { setPetCard(null); setPetCardUsed(false); }, 300); }}
                  style={{ marginTop: 10, background: "none", border: "1px solid rgba(6,182,212,0.4)", borderRadius: 12, padding: "7px 18px", color: "#06b6d4", fontSize: 12, cursor: "pointer" }}
                >
                  ↺ 다시 뽑기
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: "rgba(6,182,212,0.06)", border: "1.5px dashed rgba(6,182,212,0.35)", borderRadius: 20, padding: "18px 16px", marginBottom: 14, textAlign: "center" }}>
            <p style={{ fontSize: 24, margin: "0 0 8px" }}>🎴</p>
            <p style={{ fontSize: 14, fontWeight: 900, color: "#06b6d4", margin: "0 0 4px" }}>오늘 {result.petName}의 운세 카드</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 14px" }}>잠금 해제 후 오늘의 운세 카드를 뽑을 수 있어요</p>
            <a href={`/petun/pay?id=${id}`} style={{ display: "inline-block", background: "linear-gradient(135deg,#0891b2,#06b6d4)", borderRadius: 14, padding: "10px 22px", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 900 }}>🔓 지금 열어보기 →</a>
          </div>
        )}

        {/* 오행 기질 특징 */}
        {isUnlocked && (
          <div style={S.card}>
            <p style={S.secTitle}>🧬 기질 특징</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {result.petPersonality.trait.split("·").map(t => (
                <span key={t} style={{ background: `${ohColor}18`, border: `1px solid ${ohColor}44`, borderRadius: 20, padding: "4px 12px", fontSize: 12, color: ohColor }}>{t.trim()}</span>
              ))}
            </div>
          </div>
        )}

        {/* 탭 메뉴 */}
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "6px", display: "flex", gap: 4, marginBottom: 14 }}>
          {[
            { key: "personality", label: "케어법" },
            { key: "health", label: "건강운" },
            { key: "fav", label: "좋아하는것" },
            { key: "behavior", label: "행동이유" },
            { key: "food", label: "음식체크" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
              style={S.tabBtn(activeTab === tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 케어법 탭 */}
        {activeTab === "personality" && !isUnlocked && (
          <div style={{ background: "rgba(6,182,212,0.06)", border: "1.5px dashed rgba(6,182,212,0.35)", borderRadius: 18, padding: "28px 18px", marginBottom: 14, textAlign: "center" }}>
            <p style={{ fontSize: 28, margin: "0 0 10px" }}>💝</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#06b6d4", margin: "0 0 6px" }}>케어법 심층 분석</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 6px", lineHeight: 1.6 }}>케어 방법 · 좋아하는 놀이 · 감정 특성<br/>잠금 해제 후 확인하세요</p>
            <a href={`/petun/pay?id=${id}`} style={{ display: "inline-block", background: "linear-gradient(135deg,#0891b2,#06b6d4)", borderRadius: 14, padding: "10px 22px", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 900 }}>🔓 지금 열어보기 →</a>
          </div>
        )}
        {activeTab === "personality" && isUnlocked && (
          <>
            <div style={S.card}>
              <p style={S.secTitle}>💝 케어 방법</p>
              <p style={S.body}>{result.petPersonality.care}</p>
            </div>
            <div style={S.card}>
              <p style={S.secTitle}>🎮 좋아하는 놀이</p>
              <p style={S.body}>{result.petPersonality.play}</p>
            </div>
            <div style={S.card}>
              <p style={S.secTitle}>💬 감정 특성</p>
              <p style={S.body}>{result.petPersonality.emotion}</p>
            </div>
          </>
        )}

        {/* 건강운 탭 */}
        {activeTab === "health" && !isUnlocked && (
          <div style={{ background: "rgba(6,182,212,0.06)", border: "1.5px dashed rgba(6,182,212,0.35)", borderRadius: 18, padding: "28px 18px", marginBottom: 14, textAlign: "center" }}>
            <p style={{ fontSize: 28, margin: "0 0 10px" }}>🏥</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#06b6d4", margin: "0 0 6px" }}>건강운 심층 분석</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 6px", lineHeight: 1.6 }}>오래 사는 법 · 절대 금지 행동 · 건강 주의사항<br/>오행별 추천 음식 — 잠금 해제 후 확인하세요</p>
            <a href={`/petun/pay?id=${id}`} style={{ display: "inline-block", background: "linear-gradient(135deg,#0891b2,#06b6d4)", borderRadius: 14, padding: "10px 22px", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 900 }}>🔓 지금 열어보기 →</a>
          </div>
        )}
        {activeTab === "health" && isUnlocked && (
          <>
            <div style={S.card}>
              <p style={S.secTitle}>✅ 오래 사는 법</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {health.longLive.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#4ade80", fontSize: 14, flexShrink: 0 }}>✓</span>
                    <p style={{ fontSize: 13, color: "#d1d5db", margin: 0, lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.card}>
              <p style={S.secTitle}>⛔ 절대 하면 안 되는 것</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {health.avoid.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#f87171", fontSize: 14, flexShrink: 0 }}>✗</span>
                    <p style={{ fontSize: 13, color: "#d1d5db", margin: 0, lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.card}>
              <p style={S.secTitle}>⚠️ 건강 주의 사항</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {health.symptoms.map((item, i) => (
                  <p key={i} style={{ fontSize: 13, color: "#fbbf24", margin: 0, lineHeight: 1.6 }}>• {item}</p>
                ))}
              </div>
            </div>
            {/* 오행별 추천 음식 */}
            <div style={S.card}>
              <p style={S.secTitle}>🍗 오행별 추천 음식</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 10px" }}>{result.ohFood.desc}</p>
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, margin: "0 0 6px" }}>💚 특히 좋은 음식</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.ohFood.best.map(f => (
                    <span key={f} style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#4ade80" }}>{f}</span>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700, margin: "0 0 6px" }}>💜 도움이 되는 음식</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.ohFood.good.map(f => (
                    <span key={f} style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#c4b5fd" }}>{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* 좋아하는 것 탭 */}
        {activeTab === "fav" && !isUnlocked && (
          <div style={{ background: "rgba(6,182,212,0.06)", border: "1.5px dashed rgba(6,182,212,0.35)", borderRadius: 18, padding: "28px 18px", marginBottom: 14, textAlign: "center" }}>
            <p style={{ fontSize: 28, margin: "0 0 10px" }}>🏆</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#06b6d4", margin: "0 0 6px" }}>{result.petName}이 좋아하는 것 TOP 5</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 6px", lineHeight: 1.6 }}>잠금 해제 후 순위와 이유를 확인하세요</p>
            <a href={`/petun/pay?id=${id}`} style={{ display: "inline-block", background: "linear-gradient(135deg,#0891b2,#06b6d4)", borderRadius: 14, padding: "10px 22px", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 900 }}>🔓 지금 열어보기 →</a>
          </div>
        )}
        {activeTab === "fav" && isUnlocked && (
          <div style={S.card}>
            <p style={S.secTitle}>🏆 {result.petName}이 좋아하는 것 TOP 5</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {favorites.map(f => (
                <div key={f.rank} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: f.rank < 5 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: f.rank === 1 ? "rgba(251,191,36,0.3)" : f.rank === 2 ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: f.rank === 1 ? "#fbbf24" : f.rank === 2 ? "#c4b5fd" : "#9ca3af", flexShrink: 0 }}>
                    {f.rank}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "white", margin: "0 0 3px" }}>{f.item}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>{f.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 행동 이유 탭 */}
        {activeTab === "behavior" && !isUnlocked && (
          <div style={{ background: "rgba(6,182,212,0.06)", border: "1.5px dashed rgba(6,182,212,0.35)", borderRadius: 18, padding: "28px 18px", marginBottom: 14, textAlign: "center" }}>
            <p style={{ fontSize: 28, margin: "0 0 10px" }}>🐾</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#06b6d4", margin: "0 0 6px" }}>{behavior.title}</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 6px", lineHeight: 1.6 }}>보호자라면 꼭 알아야 할 행동 신호예요<br/>잠금 해제 후 확인하세요</p>
            <a href={`/petun/pay?id=${id}`} style={{ display: "inline-block", background: "linear-gradient(135deg,#0891b2,#06b6d4)", borderRadius: 14, padding: "10px 22px", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 900 }}>🔓 지금 열어보기 →</a>
          </div>
        )}
        {activeTab === "behavior" && isUnlocked && (
          <div style={S.card}>
            <p style={S.secTitle}>🐾 {behavior.title}</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 14px" }}>보호자라면 꼭 알아야 할 행동 신호예요</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {behavior.behaviors.map((b, i) => (
                <div key={i} style={{ padding: "14px 0", borderBottom: i < behavior.behaviors.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#06b6d4", margin: "0 0 6px" }}>"{b.action}"</p>
                  <p style={{ fontSize: 13, color: "#d1d5db", margin: 0, lineHeight: 1.6 }}>→ {b.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 음식 안전도 탭 */}
        {activeTab === "food" && (
          <>
            <div style={S.card}>
              <p style={S.secTitle}>🔍 음식 안전도 체크</p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 12px" }}>음식 이름을 입력하면 안전 여부를 알려드려요 (100+종)</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input style={{ ...S.card, flex: 1, margin: 0, padding: "10px 12px", fontSize: 14 }}
                  placeholder="예) 초콜릿, 닭고기, 사과..."
                  value={foodQuery} onChange={e => setFoodQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && searchFood()} />
                <button onClick={searchFood}
                  style={{ background: "rgba(6,182,212,0.3)", border: "1px solid rgba(6,182,212,0.5)", borderRadius: 12, padding: "10px 16px", color: "#06b6d4", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  확인
                </button>
              </div>
              {foodResult === "none" && (
                <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px", textAlign: "center" }}>
                  <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>검색 결과가 없어요. 수의사에게 직접 확인해보세요.</p>
                </div>
              )}
              {foodResult && foodResult !== "none" && (
                <div style={{ background: foodResult.level === "danger" ? "rgba(248,113,113,0.1)" : foodResult.level === "caution" ? "rgba(251,191,36,0.1)" : "rgba(74,222,128,0.1)", border: `1px solid ${foodResult.level === "danger" ? "rgba(248,113,113,0.4)" : foodResult.level === "caution" ? "rgba(251,191,36,0.4)" : "rgba(74,222,128,0.4)"}`, borderRadius: 12, padding: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{foodResult.level === "danger" ? "🚫" : foodResult.level === "caution" ? "⚠️" : "✅"}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: foodResult.level === "danger" ? "#f87171" : foodResult.level === "caution" ? "#fbbf24" : "#4ade80" }}>
                      {foodResult.name} — {foodResult.level === "danger" ? "절대 금지" : foodResult.level === "caution" ? "주의 필요" : "안전"}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#d1d5db", margin: 0, lineHeight: 1.6 }}>{foodResult.reason}</p>
                </div>
              )}
            </div>

            {/* 절대 금지 목록 */}
            <div style={S.card}>
              <p style={S.secTitle}>🚫 절대 금지 음식 TOP 10</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {FOOD_DB.filter(f => f.level === "danger").slice(0, 10).map(f => (
                  <div key={f.name} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "#f87171", fontSize: 12, flexShrink: 0, marginTop: 2 }}>✗</span>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5" }}>{f.name}</span>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}> — {f.reason.slice(0, 35)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 보호자-강아지 궁합 */}
        {isUnlocked ? (
          result.compatScore && result.compatDesc ? (
            <div style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 18, padding: "18px 16px", marginBottom: 14 }}>
              {unlockRemain && (
                <div style={{ display: "inline-block", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 99, padding: "4px 12px", fontSize: 11, color: "#4ade80", fontWeight: 700, marginBottom: 10 }}>
                  ✅ 잠금해제 · {unlockRemain}
                </div>
              )}
              <p style={{ ...S.secTitle, color: "#a78bfa" }}>💜 보호자-반려동물 궁합</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 2px" }}>{result.ownerName}</p>
                  <p style={{ fontSize: 12, color: "#a78bfa", margin: 0 }}>{result.ownerOh}오행</p>
                </div>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <p style={{ fontSize: 40, fontWeight: 900, color: "#a78bfa", margin: 0 }}>{result.compatScore}</p>
                  <p style={{ fontSize: 12, color: "#c4b5fd", margin: "2px 0 0" }}>점</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 2px" }}>{result.petName}</p>
                  <p style={{ fontSize: 12, color: ohColor, margin: 0 }}>{result.petOh}오행</p>
                </div>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#c4b5fd", margin: "0 0 6px" }}>{result.compatDesc.grade}</p>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 6px" }}>{result.compatDesc.summary}</p>
              <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.7, margin: 0 }}>{result.compatDesc.detail}</p>
            </div>
          ) : null
        ) : (
          <div style={{ background: "rgba(124,58,237,0.08)", border: "1.5px dashed rgba(124,58,237,0.4)", borderRadius: 18, padding: "24px 18px", marginBottom: 14, textAlign: "center" }}>
            <p style={{ fontSize: 26, margin: "0 0 8px" }}>💜</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: "#a78bfa", margin: "0 0 6px" }}>보호자-{result.petName} 궁합</p>
            <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 14px", lineHeight: 1.6 }}>두 사람의 오행 궁합 점수와 케어 조언<br/>잠금 해제 후 바로 확인할 수 있어요</p>
            <a href={`/petun/pay?id=${id}`} style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", borderRadius: 14, padding: "10px 22px", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 900 }}>🔓 지금 열어보기 →</a>
          </div>
        )}

        {/* 나도 해보기 */}
        <Link href="/petun" style={{ display: "block", textAlign: "center" as const, background: "rgba(6,182,212,0.08)", border: "1.5px solid rgba(6,182,212,0.35)", borderRadius: 16, padding: "14px", color: "#22d3ee", textDecoration: "none", fontSize: 14, fontWeight: 900, marginBottom: 12 }}>
          나도 펫운 해보기 →
        </Link>

        {/* 사주 연결 CTA */}
        <div style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.15),rgba(14,165,233,0.08))", border: "1px solid rgba(6,182,212,0.35)", borderRadius: 18, padding: "20px 18px", marginBottom: 14 }}>
          <p style={{ fontSize: 14, fontWeight: 900, margin: "0 0 6px", color: "#a5f3fc" }}>🌿 반려동물이 마음에 걸린다면?</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 16px", lineHeight: 1.6 }}>보호자 사주로 재물운·건강운을 확인하면<br />가족 전체 운의 흐름이 보여요.</p>
          <Link href="/main-v2" style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#0891b2,#06b6d4)", borderRadius: 14, padding: "13px", color: "white", textDecoration: "none", fontSize: 15, fontWeight: 900, boxShadow: "0 4px 16px rgba(6,182,212,0.4)" }}>
            보호자 사주 지금 확인하기 →
          </Link>
          <p style={{ fontSize: 11, color: "rgba(103,232,249,0.5)", margin: "8px 0 0", textAlign: "center" }}>990원 · 단 1회 결제 · 반복청구 없음</p>
        </div>

        <button onClick={share}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px", color: "#a5f3fc", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          🐾 {result.petName} 결과 공유하기
        </button>
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
