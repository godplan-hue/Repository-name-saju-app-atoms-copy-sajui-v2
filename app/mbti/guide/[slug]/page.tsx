import type { Metadata } from "next";
import Link from "next/link";

type Entry = { slug: string; title: string; desc: string; h1: string; sub: string; emoji: string; };

const DATA: Entry[] = [
  { slug:"mbti-test-free", title:"MBTI 테스트 무료 | 점운 MBTI", desc:"무료 MBTI 테스트 — 16문항으로 나의 MBTI 유형과 사주 오행 기질을 무료로 즉시 확인하세요.", h1:"MBTI 테스트 무료 — 16문항으로 즉시 확인", sub:"16문항 완전 무료 MBTI+오행 기질 분석 서비스", emoji:"🧠" },
  { slug:"infp-mbti", title:"INFP 성격 유형 | 점운 MBTI", desc:"INFP 성격 분석 — 내향·직관·감정·인식 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"INFP 성격 — 이상적인 중재자의 오행 기질", sub:"INFP 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🌿" },
  { slug:"infj-mbti", title:"INFJ 성격 유형 | 점운 MBTI", desc:"INFJ 성격 분석 — 내향·직관·감정·판단 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"INFJ 성격 — 선의의 옹호자의 오행 기질", sub:"INFJ 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🌙" },
  { slug:"intj-mbti", title:"INTJ 성격 유형 | 점운 MBTI", desc:"INTJ 성격 분석 — 내향·직관·사고·판단 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"INTJ 성격 — 전략적 사색가의 오행 기질", sub:"INTJ 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"♟️" },
  { slug:"intp-mbti", title:"INTP 성격 유형 | 점운 MBTI", desc:"INTP 성격 분석 — 내향·직관·사고·인식 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"INTP 성격 — 논리적 사색가의 오행 기질", sub:"INTP 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🔬" },
  { slug:"enfp-mbti", title:"ENFP 성격 유형 | 점운 MBTI", desc:"ENFP 성격 분석 — 외향·직관·감정·인식 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ENFP 성격 — 활발한 활동가의 오행 기질", sub:"ENFP 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🌈" },
  { slug:"enfj-mbti", title:"ENFJ 성격 유형 | 점운 MBTI", desc:"ENFJ 성격 분석 — 외향·직관·감정·판단 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ENFJ 성격 — 정의로운 사회운동가의 오행 기질", sub:"ENFJ 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🌟" },
  { slug:"entp-mbti", title:"ENTP 성격 유형 | 점운 MBTI", desc:"ENTP 성격 분석 — 외향·직관·사고·인식 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ENTP 성격 — 논쟁을 즐기는 토론가의 오행 기질", sub:"ENTP 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"💡" },
  { slug:"entj-mbti", title:"ENTJ 성격 유형 | 점운 MBTI", desc:"ENTJ 성격 분석 — 외향·직관·사고·판단 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ENTJ 성격 — 대담한 통솔자의 오행 기질", sub:"ENTJ 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"👑" },
  { slug:"isfp-mbti", title:"ISFP 성격 유형 | 점운 MBTI", desc:"ISFP 성격 분석 — 내향·감각·감정·인식 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ISFP 성격 — 호기심 많은 예술가의 오행 기질", sub:"ISFP 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🎨" },
  { slug:"isfj-mbti", title:"ISFJ 성격 유형 | 점운 MBTI", desc:"ISFJ 성격 분석 — 내향·감각·감정·판단 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ISFJ 성격 — 용감한 수호자의 오행 기질", sub:"ISFJ 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🛡️" },
  { slug:"istj-mbti", title:"ISTJ 성격 유형 | 점운 MBTI", desc:"ISTJ 성격 분석 — 내향·감각·사고·판단 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ISTJ 성격 — 청렴한 논리주의자의 오행 기질", sub:"ISTJ 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"📋" },
  { slug:"istp-mbti", title:"ISTP 성격 유형 | 점운 MBTI", desc:"ISTP 성격 분석 — 내향·감각·사고·인식 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ISTP 성격 — 만능 재주꾼의 오행 기질", sub:"ISTP 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🔧" },
  { slug:"esfp-mbti", title:"ESFP 성격 유형 | 점운 MBTI", desc:"ESFP 성격 분석 — 외향·감각·감정·인식 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ESFP 성격 — 자유로운 연예인의 오행 기질", sub:"ESFP 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🎭" },
  { slug:"esfj-mbti", title:"ESFJ 성격 유형 | 점운 MBTI", desc:"ESFJ 성격 분석 — 외향·감각·감정·판단 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ESFJ 성격 — 사교적인 외교관의 오행 기질", sub:"ESFJ 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"🤝" },
  { slug:"estj-mbti", title:"ESTJ 성격 유형 | 점운 MBTI", desc:"ESTJ 성격 분석 — 외향·감각·사고·판단 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ESTJ 성격 — 엄격한 관리자의 오행 기질", sub:"ESTJ 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"📊" },
  { slug:"estp-mbti", title:"ESTP 성격 유형 | 점운 MBTI", desc:"ESTP 성격 분석 — 외향·감각·사고·인식 유형의 성격 특성, 직업, 연애 방식과 오행 기질을 분석합니다.", h1:"ESTP 성격 — 모험을 즐기는 사업가의 오행 기질", sub:"ESTP 성격 특성·직업·연애 방식과 오행 기질 분석", emoji:"⚡" },
  { slug:"mbti-ohaeng", title:"MBTI와 오행 관계 | 점운 MBTI", desc:"MBTI와 사주 오행의 관계 — MBTI 16유형과 목·화·토·금·수 오행 기질의 연결 관계를 분석합니다.", h1:"MBTI와 오행 기질의 연결 관계 분석", sub:"MBTI 16유형과 목·화·토·금·수 오행 기질 연결", emoji:"☯️" },
  { slug:"mbti-yeonae", title:"MBTI 연애 유형 | 점운 MBTI", desc:"MBTI 연애 유형 분석 — 각 MBTI 유형별 연애 스타일, 이상형, 갈등 패턴을 오행과 함께 분석합니다.", h1:"MBTI 연애 유형 — 내 연애 스타일 완전 분석", sub:"MBTI 유형별 연애 스타일·이상형·갈등 패턴 분석", emoji:"💕" },
  { slug:"mbti-jigeob", title:"MBTI 직업 추천 | 점운 MBTI", desc:"MBTI 직업 추천 — 내 MBTI 유형과 오행 기질에 맞는 직업과 커리어 방향을 분석합니다.", h1:"MBTI 직업 추천 — 내 유형에 맞는 직업 찾기", sub:"MBTI+오행 기질로 찾는 최적 직업과 커리어 방향", emoji:"💼" },
  { slug:"mbti-gunghap", title:"MBTI 궁합 | 점운 MBTI", desc:"MBTI 궁합 분석 — 두 MBTI 유형이 얼마나 잘 맞는지, 갈등 포인트는 무엇인지 오행과 함께 분석합니다.", h1:"MBTI 궁합 — 두 유형의 궁합 완전 분석", sub:"MBTI 유형별 궁합과 갈등 포인트 오행 분석", emoji:"💑" },
  { slug:"mbti-infp-infj", title:"INFP INFJ 궁합 | 점운 MBTI", desc:"INFP와 INFJ 궁합 분석 — 두 감수성 높은 유형의 관계 패턴과 궁합을 오행으로 분석합니다.", h1:"INFP·INFJ 궁합 — 두 감수성 유형의 만남", sub:"INFP와 INFJ의 관계 패턴과 오행 궁합 분석", emoji:"🌙" },
  { slug:"mbti-enfp-infj", title:"ENFP INFJ 궁합 | 점운 MBTI", desc:"ENFP와 INFJ 궁합 분석 — '황금 궁합'으로 불리는 두 유형의 관계를 오행으로 더 깊이 분석합니다.", h1:"ENFP·INFJ 황금 궁합 오행 분석", sub:"황금 궁합 ENFP·INFJ의 관계 오행 심층 분석", emoji:"✨" },
  { slug:"mbti-intj-enfp", title:"INTJ ENFP 궁합 | 점운 MBTI", desc:"INTJ와 ENFP 궁합 분석 — 전략가와 활동가의 만남, 두 유형의 관계 패턴을 오행으로 분석합니다.", h1:"INTJ·ENFP 궁합 — 전략가와 활동가의 만남", sub:"INTJ와 ENFP의 관계 패턴과 오행 궁합 분석", emoji:"⚡" },
  { slug:"mbti-saju", title:"MBTI 사주 연결 | 점운 MBTI", desc:"MBTI와 사주를 함께 보는 법 — 내 MBTI 유형과 사주 오행 기질을 결합해 더 정확한 자아 분석을 합니다.", h1:"MBTI+사주 연결 — 더 정확한 나 자신 분석", sub:"MBTI와 사주 오행을 결합한 통합 자아 분석법", emoji:"🔮" },
  { slug:"mbti-jingseong", title:"MBTI 진성 테스트 | 점운 MBTI", desc:"내 MBTI 진성 유형 확인 — 상황에 따라 바뀌는 가면 MBTI와 진짜 MBTI를 오행 기질로 확인합니다.", h1:"진성 MBTI 확인 — 가면 vs 진짜 내 유형", sub:"오행 기질로 확인하는 진짜 내 MBTI 유형", emoji:"🎭" },
  { slug:"mbti-i-vs-e", title:"I형 vs E형 차이 | 점운 MBTI", desc:"MBTI I형과 E형의 차이 — 내향형(I)과 외향형(E)의 오행 기질 차이와 상호 이해 방법을 분석합니다.", h1:"I형 vs E형 — 오행으로 보는 내향·외향 차이", sub:"내향형·외향형의 오행 기질 차이와 이해 방법", emoji:"🔄" },
  { slug:"mbti-n-vs-s", title:"N형 vs S형 차이 | 점운 MBTI", desc:"MBTI N형과 S형의 차이 — 직관형(N)과 감각형(S)의 오행 기질 차이와 소통 방법을 분석합니다.", h1:"N형 vs S형 — 오행으로 보는 직관·감각 차이", sub:"직관형·감각형의 오행 기질 차이와 소통 방법", emoji:"🔍" },
  { slug:"mbti-t-vs-f", title:"T형 vs F형 차이 | 점운 MBTI", desc:"MBTI T형과 F형의 차이 — 사고형(T)과 감정형(F)의 오행 기질 차이와 갈등 해결 방법을 분석합니다.", h1:"T형 vs F형 — 오행으로 보는 사고·감정 차이", sub:"사고형·감정형의 오행 기질 차이와 갈등 해결법", emoji:"⚖️" },
  { slug:"mbti-j-vs-p", title:"J형 vs P형 차이 | 점운 MBTI", desc:"MBTI J형과 P형의 차이 — 판단형(J)과 인식형(P)의 오행 기질 차이와 협업 방법을 분석합니다.", h1:"J형 vs P형 — 오행으로 보는 판단·인식 차이", sub:"판단형·인식형의 오행 기질 차이와 협업 방법", emoji:"📅" },
  { slug:"mbti-stress", title:"MBTI 스트레스 유형 | 점운 MBTI", desc:"MBTI 유형별 스트레스 패턴 — 각 유형이 스트레스를 받는 상황과 해소 방법을 오행과 함께 분석합니다.", h1:"MBTI 스트레스 패턴 — 유형별 해소 방법", sub:"MBTI 유형별 스트레스 원인·패턴·해소 방법 분석", emoji:"😮‍💨" },
  { slug:"mbti-leadership", title:"MBTI 리더십 유형 | 점운 MBTI", desc:"MBTI 리더십 분석 — 각 유형별 리더십 스타일과 오행 기질에서 나오는 강점 리더십을 분석합니다.", h1:"MBTI 리더십 — 내 유형의 리더십 강점 분석", sub:"MBTI 유형별 리더십 스타일과 오행 강점 분석", emoji:"👑" },
  { slug:"mbti-creativity", title:"MBTI 창의성 유형 | 점운 MBTI", desc:"MBTI 창의성 분석 — 각 유형의 창의성 발현 방식과 오행 기질에서 나오는 창의력을 분석합니다.", h1:"MBTI 창의성 — 내 유형의 창의적 강점", sub:"MBTI 유형별 창의성 발현 방식과 오행 창의력", emoji:"🎨" },
  { slug:"mbti-friendship", title:"MBTI 우정 유형 | 점운 MBTI", desc:"MBTI 우정 분석 — 각 유형이 친구 관계에서 보이는 패턴과 베스트 프렌드 유형을 오행으로 분석합니다.", h1:"MBTI 우정 — 나에게 맞는 베스트 프렌드 유형", sub:"MBTI 유형별 우정 패턴과 베스트 프렌드 조합", emoji:"🤝" },
  { slug:"mbti-work", title:"MBTI 업무 스타일 | 점운 MBTI", desc:"MBTI 업무 스타일 분석 — 각 유형의 업무 방식, 협업 패턴, 강점 역할을 오행과 함께 분석합니다.", h1:"MBTI 업무 스타일 — 내 유형의 최적 업무 환경", sub:"MBTI 유형별 업무 방식·협업 패턴·강점 역할", emoji:"💻" },
  { slug:"mbti-communication", title:"MBTI 소통 방식 | 점운 MBTI", desc:"MBTI 소통 방식 분석 — 각 유형이 선호하는 소통 방식과 갈등 해결 패턴을 오행으로 분석합니다.", h1:"MBTI 소통 방식 — 유형별 대화 스타일 분석", sub:"MBTI 유형별 소통 방식·갈등 해결 패턴 분석", emoji:"💬" },
  { slug:"mbti-money", title:"MBTI 재물 관리 | 점운 MBTI", desc:"MBTI 재물 관리 스타일 — 각 유형의 돈 관리 방식과 재물 에너지를 오행과 함께 분석합니다.", h1:"MBTI 재물 관리 — 내 유형의 돈 관리 방식", sub:"MBTI 유형별 재물 관리 방식과 오행 재물 에너지", emoji:"💰" },
  { slug:"mbti-health", title:"MBTI 건강 유형 | 점운 MBTI", desc:"MBTI 건강 관리 스타일 — 각 유형의 건강 관리 방식과 취약한 부분을 오행 기질로 분석합니다.", h1:"MBTI 건강 — 내 유형의 건강 관리 방식", sub:"MBTI 유형별 건강 관리 방식과 취약 부분 분석", emoji:"❤️" },
  { slug:"mbti-travel", title:"MBTI 여행 스타일 | 점운 MBTI", desc:"MBTI 여행 스타일 분석 — 각 유형의 여행 계획 방식, 선호 여행지, 동행자 궁합을 분석합니다.", h1:"MBTI 여행 스타일 — 내 유형에 맞는 여행 방식", sub:"MBTI 유형별 여행 계획 방식과 최적 여행지", emoji:"✈️" },
  { slug:"mbti-food", title:"MBTI 음식 취향 | 점운 MBTI", desc:"MBTI 음식 취향 분석 — 각 유형의 음식 선택 패턴과 오행 기질에 맞는 식습관을 분석합니다.", h1:"MBTI 음식 취향 — 내 유형의 음식 선택 패턴", sub:"MBTI 유형별 음식 취향과 오행 기질 식습관", emoji:"🍽️" },
  { slug:"mbti-parenting", title:"MBTI 육아 스타일 | 점운 MBTI", desc:"MBTI 육아 스타일 분석 — 각 유형의 육아 방식, 자녀와의 관계 패턴을 오행 기질로 분석합니다.", h1:"MBTI 육아 스타일 — 내 유형의 육아 방식", sub:"MBTI 유형별 육아 방식과 자녀 관계 패턴 분석", emoji:"👨‍👩‍👧" },
  { slug:"mbti-sleep", title:"MBTI 수면 패턴 | 점운 MBTI", desc:"MBTI 수면 패턴 분석 — 각 유형의 수면 습관, 야행성 vs 아침형, 수면 질 개선 방법을 분석합니다.", h1:"MBTI 수면 패턴 — 내 유형의 최적 수면 방식", sub:"MBTI 유형별 수면 패턴과 수면 질 개선 방법", emoji:"😴" },
  { slug:"mbti-learning", title:"MBTI 학습 방식 | 점운 MBTI", desc:"MBTI 학습 방식 분석 — 각 유형의 최적 학습 방법과 집중력 높이는 방법을 오행으로 분석합니다.", h1:"MBTI 학습 방식 — 내 유형의 최적 공부법", sub:"MBTI 유형별 최적 학습 방법과 집중력 향상법", emoji:"📚" },
  { slug:"mbti-introvert", title:"MBTI 내향인 특징 | 점운 MBTI", desc:"내향인(I) MBTI 특징 분석 — INFP·INFJ·INTJ·INTP·ISFP·ISFJ·ISTJ·ISTP 내향 유형 완전 가이드.", h1:"MBTI 내향인 완전 가이드 — 8가지 I유형 분석", sub:"8가지 내향형 MBTI 유형 특성과 오행 기질", emoji:"🌙" },
  { slug:"mbti-extrovert", title:"MBTI 외향인 특징 | 점운 MBTI", desc:"외향인(E) MBTI 특징 분석 — ENFP·ENFJ·ENTJ·ENTP·ESFP·ESFJ·ESTJ·ESTP 외향 유형 완전 가이드.", h1:"MBTI 외향인 완전 가이드 — 8가지 E유형 분석", sub:"8가지 외향형 MBTI 유형 특성과 오행 기질", emoji:"☀️" },
  { slug:"mbti-rare", title:"희귀 MBTI 유형 | 점운 MBTI", desc:"희귀 MBTI 유형 분석 — 전체 인구의 1~3% 희귀 유형(INFJ·INTJ·ENTJ·ENFJ)의 특성과 오행 기질을 분석합니다.", h1:"희귀 MBTI 유형 — 전체 1~3% 희귀 유형 분석", sub:"INFJ·INTJ·ENTJ·ENFJ 희귀 유형 특성과 오행", emoji:"💎" },
  { slug:"mbti-most-common", title:"가장 많은 MBTI | 점운 MBTI", desc:"가장 흔한 MBTI 유형 분석 — 전체 인구에서 비율이 높은 유형(ISFJ·ESFJ·ISTJ·ESTJ)의 특성을 분석합니다.", h1:"가장 흔한 MBTI — 많은 유형의 특성 분석", sub:"인구 비율 높은 MBTI 유형 특성과 오행 기질", emoji:"👥" },
  { slug:"mbti-celebrity", title:"연예인 MBTI | 점운 MBTI", desc:"유명인 MBTI 유형 — 연예인·정치인·역사 인물의 MBTI와 오행 기질을 분석합니다.", h1:"유명인 MBTI — 연예인·역사 인물의 MBTI 분석", sub:"유명인 MBTI 유형과 오행 기질 연결 분석", emoji:"⭐" },
  { slug:"mbti-korea", title:"한국인 MBTI 분포 | 점운 MBTI", desc:"한국인 MBTI 유형 분포 — 한국에서 많은 MBTI 유형과 문화적 특성을 오행 기질로 분석합니다.", h1:"한국인 MBTI 분포 — 한국의 MBTI 유형 분석", sub:"한국인에게 많은 MBTI 유형과 문화적 특성", emoji:"🇰🇷" },
  { slug:"mbti-2026", title:"2026년 MBTI 트렌드 | 점운 MBTI", desc:"2026년 MBTI 트렌드 — 올해 가장 주목받는 MBTI 유형과 오행 에너지의 관계를 분석합니다.", h1:"2026년 MBTI 트렌드 — 올해 주목 유형 분석", sub:"2026년 오행 에너지와 MBTI 트렌드 연결 분석", emoji:"📅" },
  { slug:"mbti-history", title:"MBTI 역사 | 점운 MBTI", desc:"MBTI의 역사와 원리 — 마이어스-브릭스 유형 지표의 역사와 오행 기질과의 공통점을 분석합니다.", h1:"MBTI 역사와 원리 — 오행 기질과의 공통점", sub:"MBTI 역사·원리와 사주 오행 기질과의 연결점", emoji:"📖" },
  { slug:"mbti-accuracy", title:"MBTI 정확도 | 점운 MBTI", desc:"MBTI 테스트는 얼마나 정확한가? — MBTI의 한계와 오행 기질 분석을 함께 활용하는 방법을 안내합니다.", h1:"MBTI 정확도 — 한계와 오행 기질 보완 활용법", sub:"MBTI 테스트 정확도 한계와 오행 기질 보완 방법", emoji:"🎯" },
  { slug:"mbti-change", title:"MBTI 변하나요? | 점운 MBTI", desc:"MBTI가 시간이 지나면 변하나요? — MBTI의 변화 가능성과 오행 기질의 안정성을 비교합니다.", h1:"MBTI가 변하나요? — 변화 가능성 분석", sub:"MBTI 변화 가능성과 오행 기질 안정성 비교", emoji:"🔄" },
  { slug:"mbti-fake", title:"가짜 MBTI 구별법 | 점운 MBTI", desc:"가짜 MBTI를 구별하는 법 — 상황에 따라 다르게 나오는 MBTI와 진짜 기질을 구별하는 방법입니다.", h1:"진짜 vs 가짜 MBTI — 진짜 기질 구별법", sub:"상황별 MBTI 변화와 진짜 오행 기질 구별 방법", emoji:"🔍" },
  { slug:"mbti-free-online", title:"온라인 무료 MBTI | 점운 MBTI", desc:"온라인 무료 MBTI 테스트 — 16문항으로 무료로 즉시 MBTI와 오행 기질을 동시에 분석합니다.", h1:"온라인 무료 MBTI — 16문항 즉시 분석", sub:"온라인에서 무료로 즉시 MBTI+오행 기질 분석", emoji:"💻" },
  { slug:"mbti-app", title:"MBTI 앱 | 점운 MBTI", desc:"무료 MBTI 앱 — 점운 MBTI 앱으로 16문항 무료 테스트와 오행 기질 분석을 즉시 확인하세요.", h1:"MBTI 앱 — 무료 16문항 테스트 앱", sub:"무료 MBTI 테스트와 오행 기질 분석 앱", emoji:"📱" },
  { slug:"mbti-16types", title:"MBTI 16가지 유형 | 점운 MBTI", desc:"MBTI 16가지 유형 완전 정리 — 모든 유형의 특성, 강점, 약점, 오행 기질을 한 번에 확인하세요.", h1:"MBTI 16가지 유형 완전 정리", sub:"16가지 MBTI 유형 특성·강점·약점·오행 기질 정리", emoji:"📊" },
  { slug:"mbti-career-match", title:"MBTI 직업 매칭 | 점운 MBTI", desc:"MBTI 직업 매칭 — 내 MBTI 유형과 오행 기질에 100% 맞는 직업과 피해야 할 직업을 분석합니다.", h1:"MBTI 직업 매칭 — 내 유형에 100% 맞는 직업", sub:"MBTI+오행으로 찾는 최적 직업과 피해야 할 직업", emoji:"🎯" },
  { slug:"mbti-love-match", title:"MBTI 연애 매칭 | 점운 MBTI", desc:"MBTI 연애 매칭 — 내 MBTI 유형과 가장 잘 맞는 연인 유형과 주의해야 할 유형을 분석합니다.", h1:"MBTI 연애 매칭 — 내 유형의 최적 연인 찾기", sub:"MBTI+오행으로 찾는 최적 연인 유형과 주의 유형", emoji:"💕" },
  { slug:"mbti-new", title:"새로운 MBTI 이해 | 점운 MBTI", desc:"MBTI를 새롭게 이해하는 법 — 오행 기질과 MBTI를 결합해 더 깊이 자신을 이해하는 방법을 안내합니다.", h1:"MBTI를 새롭게 이해하는 법 — 오행 기질과 결합", sub:"MBTI와 오행 기질을 결합해 자신을 더 깊이 이해하기", emoji:"🌟" },
  { slug:"mbti-vs-enneagram", title:"MBTI vs 에니어그램 | 점운 MBTI", desc:"MBTI vs 에니어그램 비교 — 두 성격 분류법의 차이와 오행 기질을 함께 활용하는 방법을 안내합니다.", h1:"MBTI vs 에니어그램 — 차이와 통합 활용법", sub:"MBTI·에니어그램·오행 기질 통합 자아 분석법", emoji:"⚖️" },
  { slug:"mbti-introvert", title:"내향형 MBTI | 점운 MBTI", desc:"내향형 MBTI(I유형) 완전 분석 — INFP·INFJ·INTJ·INTP·ISFP·ISFJ·ISTJ·ISTP 내향형의 특성과 오행 기질을 분석합니다.", h1:"내향형 MBTI — I유형 8가지 완전 분석", sub:"INFP·INFJ·INTJ·INTP 등 내향형 특성과 오행 기질", emoji:"🌙" },
  { slug:"mbti-extravert", title:"외향형 MBTI | 점운 MBTI", desc:"외향형 MBTI(E유형) 완전 분석 — ENFP·ENFJ·ENTP·ENTJ·ESFP·ESFJ·ESTJ·ESTP 외향형의 특성과 오행 기질을 분석합니다.", h1:"외향형 MBTI — E유형 8가지 완전 분석", sub:"ENFP·ENFJ·ENTJ·ESTP 등 외향형 특성과 오행 기질", emoji:"☀️" },
  { slug:"mbti-sensing", title:"감각형 MBTI | 점운 MBTI", desc:"감각형 MBTI(S유형) 완전 분석 — ISTJ·ISFJ·ESTJ·ESFJ·ISTP·ISFP·ESTP·ESFP 감각형의 특성과 오행 기질을 분석합니다.", h1:"감각형 MBTI — S유형 8가지 완전 분석", sub:"ISTJ·ISFJ·ESTJ·ESFJ 등 감각형 특성과 오행 기질", emoji:"👁️" },
  { slug:"mbti-intuition", title:"직관형 MBTI | 점운 MBTI", desc:"직관형 MBTI(N유형) 완전 분석 — INFP·INFJ·INTJ·INTP·ENFP·ENFJ·ENTJ·ENTP 직관형의 특성과 오행 기질을 분석합니다.", h1:"직관형 MBTI — N유형 8가지 완전 분석", sub:"INFP·INFJ·INTJ·ENFP 등 직관형 특성과 오행 기질", emoji:"💡" },
  { slug:"mbti-thinking", title:"사고형 MBTI | 점운 MBTI", desc:"사고형 MBTI(T유형) 분석 — 논리·분석·객관성이 강한 T유형의 특성과 오행 금·수 기질의 연결을 분석합니다.", h1:"사고형 MBTI — T유형 특성과 오행 기질 분석", sub:"T유형의 논리적 사고 방식과 오행 금·수 기질 연결", emoji:"🧩" },
  { slug:"mbti-feeling", title:"감정형 MBTI | 점운 MBTI", desc:"감정형 MBTI(F유형) 분석 — 공감·가치·관계를 중시하는 F유형의 특성과 오행 목·화 기질의 연결을 분석합니다.", h1:"감정형 MBTI — F유형 특성과 오행 기질 분석", sub:"F유형의 공감 능력과 오행 목·화 기질 연결 분석", emoji:"💕" },
  { slug:"mbti-judging", title:"판단형 MBTI | 점운 MBTI", desc:"판단형 MBTI(J유형) 분석 — 계획·체계·결단력이 강한 J유형의 특성과 오행 토·금 기질의 연결을 분석합니다.", h1:"판단형 MBTI — J유형 특성과 오행 기질 분석", sub:"J유형의 체계적 사고와 오행 토·금 기질 연결 분석", emoji:"📋" },
  { slug:"mbti-perceiving", title:"인식형 MBTI | 점운 MBTI", desc:"인식형 MBTI(P유형) 분석 — 유연·자유·가능성을 중시하는 P유형의 특성과 오행 목·수 기질의 연결을 분석합니다.", h1:"인식형 MBTI — P유형 특성과 오행 기질 분석", sub:"P유형의 유연한 사고와 오행 목·수 기질 연결 분석", emoji:"🌊" },
  { slug:"t-f-test", title:"T형 F형 구분 테스트 | 점운 MBTI", desc:"T형 F형 구분 테스트 — 사고형과 감정형의 차이를 빠르게 테스트하고 오행 기질과의 연결을 확인하세요.", h1:"T형 vs F형 — 나는 사고형? 감정형? 즉시 테스트", sub:"T형·F형 차이 테스트와 오행 기질 연결 분석", emoji:"⚡" },
  { slug:"j-p-difference", title:"J형 P형 차이 | 점운 MBTI", desc:"J형 P형 차이 완전 분석 — 판단형과 인식형의 생활 방식, 의사결정, 스트레스 반응 차이를 분석합니다.", h1:"J형 vs P형 — 판단형과 인식형의 완전 비교", sub:"J형·P형의 생활 방식·의사결정·스트레스 차이 분석", emoji:"📅" },
  { slug:"n-s-difference", title:"N형 S형 차이 | 점운 MBTI", desc:"N형 S형 차이 완전 분석 — 직관형과 감각형의 세상을 바라보는 방식과 정보 처리 스타일 차이를 분석합니다.", h1:"N형 vs S형 — 직관형과 감각형의 완전 비교", sub:"N형·S형의 세계관·정보처리·의사소통 방식 차이", emoji:"🔭" },
  { slug:"mbti-change", title:"MBTI 바뀌는 이유 | 점운 MBTI", desc:"MBTI가 시간이 지나면 바뀌는 이유 — 상황과 성장에 따른 MBTI 변화와 오행 기질의 안정성을 비교합니다.", h1:"MBTI 왜 바뀌나 — 변화하는 MBTI와 안정적 오행", sub:"MBTI 변화 원인과 오행 기질의 안정성 비교 분석", emoji:"🔄" },
  { slug:"mbti-stress", title:"MBTI 스트레스 반응 | 점운 MBTI", desc:"MBTI 유형별 스트레스 반응 — 각 MBTI 유형이 스트레스를 받을 때 어떻게 반응하는지 오행으로 분석합니다.", h1:"MBTI 스트레스 반응 — 유형별 스트레스 해소법", sub:"MBTI 유형별 스트레스 반응과 오행 기질별 해소법", emoji:"😤" },
  { slug:"mbti-money", title:"MBTI 돈 관리 | 점운 MBTI", desc:"MBTI 유형별 돈 관리 습관 — 각 MBTI 유형의 소비 패턴, 저축 방식, 재물 오행 기질을 분석합니다.", h1:"MBTI 돈 관리 — 유형별 소비·저축 패턴 분석", sub:"MBTI 유형별 소비 패턴과 오행 재물 기질 연결", emoji:"💰" },
  { slug:"mbti-team", title:"MBTI 팀 궁합 | 점운 MBTI", desc:"팀에서 MBTI 궁합 — 직장 팀 내 MBTI 조합이 업무 효율과 협업에 미치는 영향을 분석합니다.", h1:"MBTI 팀 궁합 — 최강 팀 조합 오행 분석", sub:"직장 팀 내 MBTI 조합과 업무 효율 오행 분석", emoji:"🤝" },
  { slug:"mbti-leader", title:"MBTI 리더십 | 점운 MBTI", desc:"MBTI 유형별 리더십 스타일 — 각 유형의 리더십 방식과 오행 기질별 리더 특성을 분석합니다.", h1:"MBTI 리더십 — 유형별 리더십 스타일 분석", sub:"MBTI 유형별 리더십 강점과 오행 기질 리더 특성", emoji:"👑" },
  { slug:"mbti-travel", title:"MBTI 여행 스타일 | 점운 MBTI", desc:"MBTI 유형별 여행 스타일 — 여행 계획 방식, 선호 여행지, 동행 궁합을 오행과 함께 분석합니다.", h1:"MBTI 여행 스타일 — 유형별 최적 여행 방식", sub:"MBTI 유형별 여행 계획·선호지·동행 궁합 오행 분석", emoji:"✈️" },
  { slug:"mbti-communication", title:"MBTI 소통 방식 | 점운 MBTI", desc:"MBTI 유형별 소통 방식 — 각 유형이 대화하는 방식과 오행 기질별 소통 스타일을 분석합니다.", h1:"MBTI 소통 방식 — 유형별 대화 스타일 분석", sub:"MBTI 유형별 소통 방식과 오행 기질 대화 특성", emoji:"💬" },
  { slug:"mbti-saju", title:"MBTI와 사주 | 점운 MBTI", desc:"MBTI와 사주 오행의 차이와 연결 — 두 가지 성격 분류 방법을 함께 활용해 더 깊은 자아를 이해하세요.", h1:"MBTI와 사주 — 두 가지 자아 분석의 만남", sub:"MBTI와 사주 오행을 결합한 통합 자아 분석법", emoji:"☯️" },
  { slug:"mbti-celebrity", title:"연예인 MBTI | 점운 MBTI", desc:"유명인 MBTI 분석 — 유명 연예인·역사 인물의 MBTI와 사주 오행 기질을 함께 분석합니다.", h1:"연예인 MBTI — 유명인의 MBTI와 오행 기질 분석", sub:"유명 연예인·역사 인물의 MBTI와 오행 기질 비교", emoji:"⭐" },
  { slug:"infp-career", title:"INFP 직업 추천 | 점운 MBTI", desc:"INFP 직업 추천 — 이상적인 중재자 INFP에게 맞는 직업, 피해야 할 직업, 오행 기질별 커리어를 분석합니다.", h1:"INFP 직업 추천 — 이상적 중재자의 최적 커리어", sub:"INFP 성격과 오행 기질에 맞는 직업과 커리어 방향", emoji:"🌿" },
  { slug:"intj-career", title:"INTJ 직업 추천 | 점운 MBTI", desc:"INTJ 직업 추천 — 전략적 사색가 INTJ에게 맞는 직업, 피해야 할 직업, 오행 기질별 커리어를 분석합니다.", h1:"INTJ 직업 추천 — 전략적 사색가의 최적 커리어", sub:"INTJ 성격과 오행 기질에 맞는 직업과 커리어 방향", emoji:"♟️" },
  { slug:"enfp-career", title:"ENFP 직업 추천 | 점운 MBTI", desc:"ENFP 직업 추천 — 활발한 활동가 ENFP에게 맞는 직업, 피해야 할 직업, 오행 기질별 커리어를 분석합니다.", h1:"ENFP 직업 추천 — 활발한 활동가의 최적 커리어", sub:"ENFP 성격과 오행 기질에 맞는 직업과 커리어 방향", emoji:"🌈" },
  { slug:"istj-career", title:"ISTJ 직업 추천 | 점운 MBTI", desc:"ISTJ 직업 추천 — 청렴한 논리주의자 ISTJ에게 맞는 직업, 피해야 할 직업, 오행 기질별 커리어를 분석합니다.", h1:"ISTJ 직업 추천 — 청렴한 논리주의자의 최적 커리어", sub:"ISTJ 성격과 오행 기질에 맞는 직업과 커리어 방향", emoji:"📋" },
  { slug:"mbti-decision", title:"MBTI 의사결정 스타일 | 점운 MBTI", desc:"MBTI 유형별 의사결정 스타일 — 각 유형이 중요한 결정을 내리는 방식과 오행 기질별 결정 패턴을 분석합니다.", h1:"MBTI 의사결정 — 유형별 결정 방식 완전 분석", sub:"MBTI 유형별 의사결정 패턴과 오행 기질 연결 분석", emoji:"🎯" },
  { slug:"mbti-friendship", title:"MBTI 우정 궁합 | 점운 MBTI", desc:"MBTI 친구 궁합 분석 — 어떤 MBTI 유형과 진정한 우정을 쌓을 수 있는지 오행으로 분석합니다.", h1:"MBTI 우정 궁합 — 진정한 친구 유형 분석", sub:"MBTI 유형별 우정 궁합과 오행 기질 친구 패턴", emoji:"👫" },
  { slug:"mbti-love-style", title:"MBTI 연애 스타일 | 점운 MBTI", desc:"MBTI 유형별 연애 스타일 — 사랑에 빠지는 방식, 갈등 패턴, 이상적 파트너를 오행과 함께 분석합니다.", h1:"MBTI 연애 스타일 — 유형별 사랑 방식 완전 분석", sub:"MBTI 유형별 연애 방식·갈등·이상형 오행 분석", emoji:"💖" },
  { slug:"mbti-korea-popular", title:"한국 인기 MBTI | 점운 MBTI", desc:"한국에서 많은 MBTI 유형 — 한국인 MBTI 분포와 가장 많은 유형, 오행 기질과의 연결을 분석합니다.", h1:"한국인 MBTI 분포 — 가장 많은 유형은?", sub:"한국인 MBTI 분포와 오행 기질 연결 분석", emoji:"🇰🇷" },
  { slug:"mbti-dark-side", title:"MBTI 부정적 면 | 점운 MBTI", desc:"MBTI 유형별 부정적 면 — 각 유형의 약점, 단점, 스트레스 시 나타나는 그림자 면을 오행으로 분석합니다.", h1:"MBTI 그림자 면 — 유형별 약점과 단점 분석", sub:"MBTI 유형별 약점·단점·스트레스 반응 오행 분석", emoji:"🌑" },
  { slug:"mbti-morning", title:"MBTI 아침형 저녁형 | 점운 MBTI", desc:"MBTI 유형별 아침형·저녁형 분류 — 어떤 MBTI 유형이 아침에 강하고 저녁에 강한지 오행으로 분석합니다.", h1:"MBTI 아침형 vs 저녁형 — 유형별 에너지 리듬", sub:"MBTI 유형별 에너지 리듬과 오행 기질 시간대 분석", emoji:"🌅" },
  { slug:"mbti-online-test", title:"MBTI 온라인 테스트 | 점운 MBTI", desc:"MBTI 온라인 무료 테스트 — 회원가입 없이 16문항으로 즉시 MBTI와 오행 기질을 무료로 분석합니다.", h1:"MBTI 온라인 무료 테스트 — 가입 없이 즉시 분석", sub:"회원가입 없이 16문항 MBTI+오행 기질 즉시 무료 분석", emoji:"🌐" },
  { slug:"mbti-animal", title:"MBTI 동물 유형 | 점운 MBTI", desc:"MBTI 동물 유형 분석 — 각 MBTI 유형을 대표하는 동물과 오행 기질의 연결 관계를 재미있게 분석합니다.", h1:"MBTI 동물 유형 — 내 MBTI를 닮은 동물은?", sub:"MBTI 유형별 대표 동물과 오행 기질 재미 분석", emoji:"🐾" },
  { slug:"mbti-summary", title:"MBTI 전체 정리 | 점운 MBTI", desc:"MBTI 16유형 전체 정리 — 모든 유형의 특성을 한눈에 비교하고 오행 기질과 함께 정리한 완전 가이드입니다.", h1:"MBTI 16유형 전체 정리 — 완전 비교 가이드", sub:"MBTI 16가지 유형과 오행 기질 한눈에 비교 정리", emoji:"📖" },
  { slug:"mbti-color", title:"MBTI 색깔 유형 | 점운 MBTI", desc:"MBTI 유형별 색깔 분석 — 각 MBTI 유형을 대표하는 색깔과 오행 오색(청·적·황·백·흑)의 연결 관계를 분석합니다.", h1:"MBTI 색깔 — 내 유형을 대표하는 색은?", sub:"MBTI 유형별 색깔과 오행 오색 연결 분석", emoji:"🎨" },
  { slug:"mbti-test-2min", title:"2분 MBTI 테스트 | 점운 MBTI", desc:"2분 만에 끝나는 MBTI 테스트 — 16문항으로 2분 안에 내 MBTI 유형과 오행 기질을 무료로 즉시 확인하세요.", h1:"2분 MBTI 테스트 — 빠르고 정확한 무료 분석", sub:"16문항 2분 완성 MBTI+오행 기질 무료 즉시 분석", emoji:"⏱️" },
  { slug:"mbti-health", title:"MBTI 건강 관리 | 점운 MBTI", desc:"MBTI별 건강 관리법 — 각 MBTI 유형과 오행 기질에 맞는 맞춤 건강 관리 전략을 분석합니다.", h1:"MBTI 건강 관리 — 내 유형에 맞는 건강 전략", sub:"MBTI 유형별·오행 기질별 맞춤 건강 관리 전략", emoji:"💊" },
  { slug:"mbti-parent-child", title:"부모 자녀 MBTI 궁합 | 점운 MBTI", desc:"부모-자녀 MBTI 궁합 — 부모와 자녀의 MBTI 유형 차이를 이해하고 오행 기질로 관계를 개선하는 가이드입니다.", h1:"부모 자녀 MBTI 궁합 — 오행 기질로 이해하기", sub:"부모와 자녀의 MBTI·오행 기질 차이 이해와 관계 개선", emoji:"👨‍👩‍👧" },
  { slug:"mbti-perfect-match", title:"MBTI 완벽한 궁합 | 점운 MBTI", desc:"MBTI 완벽한 궁합 — 내 MBTI 유형과 오행 기질을 기반으로 가장 잘 맞는 이상형의 유형을 분석합니다.", h1:"MBTI 완벽한 궁합 — 내 유형과 가장 잘 맞는 상대는?", sub:"MBTI 유형별 최적 이상형과 오행 기질 궁합 분석", emoji:"💑" },
  { slug:"mbti-vs-disc", title:"MBTI vs DISC 비교 | 점운 MBTI", desc:"MBTI vs DISC 성격 도구 비교 — 두 도구의 차이점과 오행 기질과의 연결점, 활용 방법을 비교합니다.", h1:"MBTI vs DISC — 성격 도구 비교와 오행 연결", sub:"MBTI와 DISC 성격 도구 비교, 오행 기질과 연결 분석", emoji:"🆚" },
  { slug:"mbti-love-infj", title:"INFJ 연애 유형 | 점운 MBTI", desc:"INFJ 연애 유형 분析 — 옹호자 INFJ의 연애 스타일, 이상형, 갈등 원인과 오행 기질 연결.", h1:"INFJ 연애 — 선의의 옹호자의 연애 스타일", sub:"INFJ 연애 스타일·이상형·갈등 원인 오행 분析", emoji:"🌙" },
  { slug:"mbti-love-infp", title:"INFP 연애 유형 | 점운 MBTI", desc:"INFP 연애 유형 분析 — 중재자 INFP의 연애 스타일, 이상형, 갈등 원인과 오행 기질 연결.", h1:"INFP 연애 — 이상적 중재자의 연애 스타일", sub:"INFP 연애 스타일·이상형·갈등 원인 오행 분析", emoji:"🌿" },
  { slug:"mbti-love-intj", title:"INTJ 연애 유형 | 점운 MBTI", desc:"INTJ 연애 유형 분析 — 전략가 INTJ의 연애 스타일, 이상형, 갈등 원인과 오행 기질 연결.", h1:"INTJ 연애 — 전략적 사색가의 연애 스타일", sub:"INTJ 연애 스타일·이상형·갈등 원인 오행 분析", emoji:"♟️" },
  { slug:"mbti-love-entp", title:"ENTP 연애 유형 | 점운 MBTI", desc:"ENTP 연애 유형 분析 — 토론가 ENTP의 연애 스타일, 이상형, 갈등 원인과 오행 기질 연결.", h1:"ENTP 연애 — 논쟁 즐기는 토론가의 연애 스타일", sub:"ENTP 연애 스타일·이상형·갈등 원인 오행 분析", emoji:"💡" },
  { slug:"mbti-love-enfj", title:"ENFJ 연애 유형 | 점운 MBTI", desc:"ENFJ 연애 유형 분析 — 사회운동가 ENFJ의 연애 스타일, 이상형, 갈등 원인과 오행 기질 연결.", h1:"ENFJ 연애 — 정의로운 사회운동가의 연애 스타일", sub:"ENFJ 연애 스타일·이상형·갈등 원인 오행 분析", emoji:"🌟" },
  { slug:"mbti-love-istp", title:"ISTP 연애 유형 | 점운 MBTI", desc:"ISTP 연애 유형 분析 — 만능재주꾼 ISTP의 연애 스타일, 이상형, 갈등 원인과 오행 기질 연결.", h1:"ISTP 연애 — 만능재주꾼의 연애 스타일", sub:"ISTP 연애 스타일·이상형·갈등 원인 오행 분析", emoji:"🔧" },
  { slug:"mbti-love-isfj", title:"ISFJ 연애 유형 | 점운 MBTI", desc:"ISFJ 연애 유형 분析 — 수호자 ISFJ의 연애 스타일, 이상형, 갈등 원인과 오행 기질 연결.", h1:"ISFJ 연애 — 용감한 수호자의 연애 스타일", sub:"ISFJ 연애 스타일·이상형·갈등 원인 오행 분析", emoji:"🛡️" },
  { slug:"mbti-love-estj", title:"ESTJ 연애 유형 | 점운 MBTI", desc:"ESTJ 연애 유형 분析 — 관리자 ESTJ의 연애 스타일, 이상형, 갈등 원인과 오행 기질 연결.", h1:"ESTJ 연애 — 엄격한 관리자의 연애 스타일", sub:"ESTJ 연애 스타일·이상형·갈등 원인 오행 분析", emoji:"📊" },
  { slug:"mbti-love-esfp", title:"ESFP 연애 유형 | 점운 MBTI", desc:"ESFP 연애 유형 분析 — 연예인 ESFP의 연애 스타일, 이상형, 갈등 원인과 오행 기질 연결.", h1:"ESFP 연애 — 자유로운 연예인의 연애 스타일", sub:"ESFP 연애 스타일·이상형·갈등 원인 오행 분析", emoji:"🎭" },
  { slug:"mbti-self-esteem", title:"MBTI 자존감 | 점운 MBTI", desc:"MBTI 유형별 자존감 특성 — 각 유형이 자존감과 자기 가치를 인식하는 방식을 오행으로 분析합니다.", h1:"MBTI 자존감 — 유형별 자기 가치 인식 방식", sub:"MBTI 유형별 자존감 특성과 오행 기질 자아 분析", emoji:"💎" },
  { slug:"mbti-anxiety-type", title:"MBTI 불안 유형 | 점운 MBTI", desc:"MBTI 유형별 불안 유형 — 각 유형이 불안을 경험하는 방식과 극복 방법을 오행으로 분析합니다.", h1:"MBTI 불안 유형 — 유형별 불안 원인과 극복법", sub:"MBTI 유형별 불안 경험 방식과 오행 기질 극복법", emoji:"😰" },
  { slug:"mbti-break-up", title:"MBTI 이별 방식 | 점운 MBTI", desc:"MBTI 유형별 이별 방식 — 각 유형이 이별을 겪을 때 나타나는 반응과 회복 방법을 분析합니다.", h1:"MBTI 이별 방식 — 유형별 이별 반응과 회복법", sub:"MBTI 유형별 이별 반응 패턴과 오행 기질 회복법", emoji:"💔" },
  { slug:"mbti-marriage-style", title:"MBTI 결혼 스타일 | 점운 MBTI", desc:"MBTI 유형별 결혼 스타일 — 각 유형이 결혼에 임하는 방식과 배우자 선택 기준을 분析합니다.", h1:"MBTI 결혼 스타일 — 유형별 배우자 선택 기준", sub:"MBTI 유형별 결혼 방식과 배우자 선택 기준 분析", emoji:"💍" },
  { slug:"mbti-first-impression", title:"MBTI 첫인상 | 점운 MBTI", desc:"MBTI 유형별 첫인상 — 각 유형이 처음 만나는 사람에게 주는 첫인상과 실제 모습의 차이를 분析합니다.", h1:"MBTI 첫인상 — 유형별 첫인상과 실제 모습 차이", sub:"MBTI 유형별 첫인상과 실제 성격의 차이 분析", emoji:"👋" },
  { slug:"mbti-conflict-style", title:"MBTI 갈등 해결 | 점운 MBTI", desc:"MBTI 유형별 갈등 해결 스타일 — 각 유형이 갈등 상황에서 보이는 반응과 해결 방법을 분析합니다.", h1:"MBTI 갈등 해결 — 유형별 갈등 대처 방식", sub:"MBTI 유형별 갈등 반응과 해결 방식 오행 분析", emoji:"🤝" },
  { slug:"mbti-love-language-type", title:"MBTI 사랑의 언어 | 점운 MBTI", desc:"MBTI 유형별 사랑의 언어 — 각 유형이 사랑을 표현하고 받고 싶은 방식을 오행으로 분析합니다.", h1:"MBTI 사랑의 언어 — 유형별 사랑 표현 방식", sub:"MBTI 유형별 사랑 표현·수용 방식 오행 기질 분析", emoji:"💝" },
  { slug:"mbti-procrastination", title:"MBTI 미루기 습관 | 점운 MBTI", desc:"MBTI 유형별 미루기 습관 — 각 유형이 미루는 이유와 극복하는 방법을 오행으로 분析합니다.", h1:"MBTI 미루기 습관 — 유형별 미루는 이유와 극복", sub:"MBTI 유형별 미루기 원인과 극복 방법 오행 분析", emoji:"⏰" },
  { slug:"mbti-perfectionism-type", title:"MBTI 완벽주의 | 점운 MBTI", desc:"MBTI 유형별 완벽주의 성향 — 어떤 유형이 완벽주의적 성향이 강하고 어떻게 관리하는지 분析합니다.", h1:"MBTI 완벽주의 — 유형별 완벽주의 성향 분析", sub:"MBTI 유형별 완벽주의 성향과 오행 기질 관리법", emoji:"🎯" },
  { slug:"mbti-success-pattern", title:"MBTI 성공 패턴 | 점운 MBTI", desc:"MBTI 유형별 성공 패턴 — 각 유형이 성공에 이르는 방식과 오행 기질에서 나오는 성공 비결.", h1:"MBTI 성공 패턴 — 유형별 성공 방식과 비결", sub:"MBTI 유형별 성공 패턴과 오행 기질 성공 비결", emoji:"🏆" },
  { slug:"mbti-social-battery", title:"MBTI 사회적 에너지 | 점운 MBTI", desc:"MBTI 유형별 사회적 배터리 — 사람을 만날 때 에너지가 충전되는 유형 vs 소진되는 유형을 분析합니다.", h1:"MBTI 사회적 배터리 — 에너지 충전 vs 소진 유형", sub:"사람 만남으로 에너지 충전·소진되는 MBTI 유형 분析", emoji:"🔋" },
  { slug:"mbti-toxic-trait", title:"MBTI 독성 특성 | 점운 MBTI", desc:"MBTI 유형별 독성 특성 — 각 유형이 스트레스를 받을 때 나타나는 부정적인 측면을 솔직하게 분析합니다.", h1:"MBTI 독성 특성 — 유형별 부정적 면 솔직 분析", sub:"MBTI 유형별 스트레스 시 독성 특성 오행 분析", emoji:"⚠️" },
  { slug:"infp-vs-infj-diff", title:"INFP INFJ 차이 | 점운 MBTI", desc:"INFP와 INFJ의 차이 — 비슷해 보이는 두 유형의 결정적 차이점과 오행 기질을 분析합니다.", h1:"INFP vs INFJ — 두 유형의 결정적 차이", sub:"INFP와 INFJ의 결정적 차이점과 오행 기질 비교", emoji:"🔍" },
  { slug:"intj-vs-intp-diff", title:"INTJ INTP 차이 | 점운 MBTI", desc:"INTJ와 INTP의 차이 — 전략가와 사색가의 결정적 차이점과 오행 기질을 분析합니다.", h1:"INTJ vs INTP — 전략가와 사색가의 차이", sub:"INTJ와 INTP의 결정적 차이점과 오행 기질 비교", emoji:"🔬" },
  { slug:"enfp-vs-enfj-diff", title:"ENFP ENFJ 차이 | 점운 MBTI", desc:"ENFP와 ENFJ의 차이 — 활동가와 사회운동가의 결정적 차이점과 오행 기질을 분析합니다.", h1:"ENFP vs ENFJ — 활동가와 사회운동가의 차이", sub:"ENFP와 ENFJ의 결정적 차이점과 오행 기질 비교", emoji:"🌈" },
  { slug:"istj-vs-isfj-diff", title:"ISTJ ISFJ 차이 | 점운 MBTI", desc:"ISTJ와 ISFJ의 차이 — 논리주의자와 수호자의 결정적 차이점과 오행 기질을 분析합니다.", h1:"ISTJ vs ISFJ — 논리주의자와 수호자의 차이", sub:"ISTJ와 ISFJ의 결정적 차이점과 오행 기질 비교", emoji:"📋" },
  { slug:"mbti-gen-z-trend", title:"Z세대 MBTI | 점운 MBTI", desc:"Z세대 MBTI 트렌드 — Z세대가 선호하는 MBTI 유형과 오행 기질의 시대적 특성을 분析합니다.", h1:"Z세대 MBTI 트렌드 — Z세대 MBTI 특성 분析", sub:"Z세대 선호 MBTI 유형과 오행 기질 시대 특성", emoji:"📱" },
  { slug:"mbti-social-media-type", title:"MBTI SNS 사용법 | 점운 MBTI", desc:"MBTI 유형별 SNS 사용 패턴 — 어떤 유형이 어떤 SNS를 주로 사용하는지 오행과 함께 분析합니다.", h1:"MBTI SNS 사용 패턴 — 유형별 SNS 선택 방식", sub:"MBTI 유형별 SNS 사용 패턴과 오행 기질 연결", emoji:"📲" },
  { slug:"mbti-music-type", title:"MBTI 음악 취향 | 점운 MBTI", desc:"MBTI 유형별 음악 취향 — 각 유형이 선호하는 음악 장르와 오행 기질의 연결을 분析합니다.", h1:"MBTI 음악 취향 — 유형별 선호 음악 장르 분析", sub:"MBTI 유형별 선호 음악 장르와 오행 기질 연결", emoji:"🎵" },
  { slug:"mbti-book-genre", title:"MBTI 독서 취향 | 점운 MBTI", desc:"MBTI 유형별 독서 취향 — 각 유형이 선호하는 책 장르와 독서 방식을 오행과 함께 분析합니다.", h1:"MBTI 독서 취향 — 유형별 선호 책 장르 분析", sub:"MBTI 유형별 선호 독서 장르와 오행 기질 연결", emoji:"📚" },
  { slug:"mbti-spending-habit", title:"MBTI 소비 습관 | 점운 MBTI", desc:"MBTI 유형별 소비 습관 — 각 유형의 소비 패턴과 저축 방식, 돈을 쓰는 방식을 분析합니다.", h1:"MBTI 소비 습관 — 유형별 돈 쓰는 방식 분析", sub:"MBTI 유형별 소비 패턴과 저축 방식 오행 분析", emoji:"💳" },
  { slug:"mbti-diet-style", title:"MBTI 식습관 | 점운 MBTI", desc:"MBTI 유형별 식습관 — 각 유형의 음식 선택 방식과 오행 기질에 맞는 건강한 식습관을 분析합니다.", h1:"MBTI 식습관 — 유형별 음식 선택과 식사 방식", sub:"MBTI 유형별 음식 선택 방식과 오행 기질 식습관", emoji:"🍽️" },
  { slug:"mbti-exercise-type", title:"MBTI 운동 유형 | 점운 MBTI", desc:"MBTI 유형별 운동 스타일 — 각 유형에게 맞는 운동 방법과 오행 체질 운동 조합을 분析합니다.", h1:"MBTI 운동 유형 — 내 유형에 맞는 운동 방식", sub:"MBTI 유형별 운동 스타일과 오행 체질 운동 가이드", emoji:"🏃" },
  { slug:"mbti-vacation-type", title:"MBTI 휴가 스타일 | 점운 MBTI", desc:"MBTI 유형별 휴가 스타일 — 여행·홈스테이·활동적 휴가 중 각 유형에게 맞는 방식을 분析합니다.", h1:"MBTI 휴가 스타일 — 유형별 최적 휴식 방식", sub:"MBTI 유형별 최적 휴가 스타일과 오행 기질 연결", emoji:"🏖️" },
  { slug:"mbti-goal-achievement", title:"MBTI 목표 달성 | 점운 MBTI", desc:"MBTI 유형별 목표 달성 방식 — 각 유형이 목표를 세우고 달성하는 방식을 오행과 함께 분析합니다.", h1:"MBTI 목표 달성 — 유형별 목표 달성 방식 分析", sub:"MBTI 유형별 목표 설정·달성 방식 오행 기질 분析", emoji:"🎯" },
  { slug:"mbti-apology-style", title:"MBTI 사과 방식 | 점운 MBTI", desc:"MBTI 유형별 사과 방식 — 각 유형이 실수했을 때 사과하는 방식과 오행 기질 분析입니다.", h1:"MBTI 사과 방식 — 유형별 사과하는 방식 분析", sub:"MBTI 유형별 사과 방식과 오행 기질 반성 패턴", emoji:"🙏" },
  { slug:"mbti-ghosting-type", title:"MBTI 잠수 유형 | 점운 MBTI", desc:"MBTI 유형별 잠수 패턴 — 어떤 유형이 잠수를 타는지, 그 이유와 오행 기질 연결을 분析합니다.", h1:"MBTI 잠수 패턴 — 잠수 타는 유형과 이유 분析", sub:"MBTI 유형별 잠수 원인과 오행 기질 회피 패턴", emoji:"👻" },
  { slug:"mbti-long-distance-love", title:"MBTI 장거리 연애 | 점운 MBTI", desc:"MBTI 유형별 장거리 연애 적합도 — 각 유형이 장거리 연애에 잘 맞는지 오행과 함께 분析합니다.", h1:"MBTI 장거리 연애 — 유형별 적합도와 극복법", sub:"MBTI 유형별 장거리 연애 적합도와 오행 극복법", emoji:"✈️" },
  { slug:"mbti-introvert-recharge", title:"MBTI 내향인 충전법 | 점운 MBTI", desc:"내향형 MBTI 에너지 충전법 — I유형이 사람들과의 만남 후 에너지를 회복하는 방법을 분析합니다.", h1:"내향인 에너지 충전법 — I유형의 회복 방식", sub:"내향형 MBTI I유형의 에너지 회복과 충전 방法", emoji:"🔋" },
  { slug:"mbti-extrovert-tips", title:"MBTI 외향인 팁 | 점운 MBTI", desc:"외향형 MBTI 에너지 관리 팁 — E유형이 혼자 있는 시간을 활용하고 내향인과 소통하는 방法.", h1:"외향인 에너지 팁 — E유형 혼자 시간 활용법", sub:"외향형 MBTI E유형의 에너지 관리와 내향인 소통법", emoji:"☀️" },
  { slug:"mbti-couple-habits", title:"MBTI 커플 습관 | 점운 MBTI", desc:"MBTI 유형별 커플 습관 — 연애 중인 커플의 MBTI 조합별 행동 패턴과 갈등을 오행으로 분析합니다.", h1:"MBTI 커플 습관 — 유형 조합별 관계 패턴 분析", sub:"MBTI 유형 조합별 커플 습관과 오행 갈등 분析", emoji:"💑" },
  { slug:"mbti-child-raising", title:"MBTI 자녀 양육 | 점운 MBTI", desc:"MBTI 유형별 자녀 양육 방식 — 부모의 MBTI와 아이의 MBTI 조합이 육아에 미치는 영향을 분析합니다.", h1:"MBTI 자녀 양육 — 부모·아이 유형 조합 분析", sub:"부모·아이 MBTI 조합과 오행 기질 육아 방向", emoji:"👨‍👩‍👧" },
  { slug:"mbti-confidence-build", title:"MBTI 자신감 키우기 | 점운 MBTI", desc:"MBTI 유형별 자신감 키우는 법 — 각 유형에 맞는 자신감 향상 방법을 오행 기질과 함께 분析합니다.", h1:"MBTI 자신감 — 유형별 자신감 키우는 방法", sub:"MBTI 유형별 자신감 향상법과 오행 기질 강점化", emoji:"💪" },
  { slug:"mbti-morning-habit", title:"MBTI 아침 루틴 | 점운 MBTI", desc:"MBTI 유형별 최적 아침 루틴 — 각 유형에게 맞는 아침 습관과 하루 시작 방법을 오행으로 분析합니다.", h1:"MBTI 아침 루틴 — 유형별 최적 하루 시작법", sub:"MBTI 유형별 최적 아침 루틴과 오행 에너지 活用", emoji:"🌅" },
  { slug:"mbti-study-method", title:"MBTI 공부법 | 점운 MBTI", desc:"MBTI 유형별 최적 공부법 — 각 유형에게 맞는 학습 방법과 집중력 향상 전략을 분析합니다.", h1:"MBTI 공부법 — 유형별 최적 학습 전략 분析", sub:"MBTI 유형별 최적 공부법과 집중력 향상 전략", emoji:"📖" },
  { slug:"mbti-hidden-trait", title:"MBTI 숨겨진 특성 | 점운 MBTI", desc:"MBTI 유형별 숨겨진 특성 — 겉으로 잘 드러나지 않는 각 유형의 숨겨진 면을 오행으로 분析합니다.", h1:"MBTI 숨겨진 특성 — 유형별 알려지지 않은 면", sub:"MBTI 유형별 숨겨진 특성과 오행 기질 내면 分析", emoji:"🔍" },
  { slug:"mbti-spending-type", title:"MBTI 씀씀이 유형 | 점운 MBTI", desc:"MBTI 유형별 씀씀이 — 각 유형이 돈을 어디에 가장 먼저 쓰는지 오행 기질로 분析합니다.", h1:"MBTI 씀씀이 — 유형별 돈 우선순위 분析", sub:"MBTI 유형별 씀씀이 우선순위와 오행 기질 연결", emoji:"💰" },
  { slug:"mbti-creative-type", title:"MBTI 창작 유형 | 점운 MBTI", desc:"MBTI 유형별 창작 방식 — 예술·글쓰기·음악 등 창작 활동에서 각 유형이 보이는 특성을 분析합니다.", h1:"MBTI 창작 유형 — 유형별 창작 활동 방식 분析", sub:"MBTI 유형별 창작 방식과 오행 기질 예술성 분析", emoji:"🎨" },
];

export async function generateStaticParams() {
  return DATA.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];
  return {
    title: d.title,
    description: d.desc,
    keywords: ["MBTI테스트", "무료MBTI", "MBTI유형", "MBTI오행", "점운MBTI", "성격유형테스트"],
    openGraph: { title: d.title, description: d.desc, url: `https://jeomun.com/mbti/guide/${d.slug}` },
  };
}

export default async function MbtiSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];

  const features = [
    { icon: "🧠", title: "16가지 유형 분석", desc: "MBTI 16가지 유형의 성격 특성, 강점, 약점, 직업 방향을 즉시 무료로 분석합니다." },
    { icon: "☯️", title: "오행 기질 연결", desc: "목·화·토·금·수 오행 기질과 MBTI를 결합해 더 정확한 자아 분석을 제공합니다." },
    { icon: "💕", title: "연애 궁합 분석", desc: "내 MBTI와 가장 잘 맞는 연인 유형과 갈등 패턴을 분석합니다." },
    { icon: "💼", title: "직업 추천", desc: "내 MBTI와 오행 기질에 맞는 최적 직업과 커리어 방향을 분석합니다." },
  ];

  const faqs = [
    { q: "MBTI 테스트가 무료인가요?", a: "네, 완전 무료입니다. 16문항으로 2분 안에 내 MBTI 유형과 오행 기질을 동시에 분석할 수 있습니다." },
    { q: "MBTI와 사주 오행은 어떻게 연결되나요?", a: "MBTI 유형과 오행 기질은 성격 분석의 다른 관점입니다. 목=ENTJ·ENFJ, 화=ENFP·ESFP, 토=ISTJ·ISFJ, 금=INTJ·ENTJ, 수=INTP·INFJ와 공명 관계가 있습니다." },
    { q: "MBTI가 시간이 지나면 변하나요?", a: "MBTI는 상황에 따라 조금 변할 수 있습니다. 반면 사주 오행 기질은 태어날 때 결정되어 더 안정적입니다. 두 가지를 함께 보면 더 정확합니다." },
    { q: "16Personalities와 점운 MBTI는 무엇이 다른가요?", a: "점운 MBTI는 사주 오행 기질과 MBTI를 결합해 더 한국적 맥락에서 성격을 분석합니다. 기본 무료, 16문항으로 빠르게 분석합니다." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f0030 0%,#1e0060 50%,#0f0030 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "#f5f5f5", wordBreak: "keep-all" as const }}>
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{d.emoji}</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, lineHeight: 1.3, margin: "0 0 14px", background: "linear-gradient(135deg,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{d.h1}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 28px" }}>{d.sub}</p>
        <Link href="/mbti" style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 32px", borderRadius: 30, textDecoration: "none", boxShadow: "0 8px 32px rgba(124,58,237,0.4)" }}>
          무료 MBTI 테스트 →
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>16문항 · 2분 완성 · 오행 기질 포함 · 완전 무료</p>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>점운 MBTI가 특별한 이유</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 16, padding: "18px 14px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <p style={{ fontSize: 13, fontWeight: 900, color: "white", margin: "0 0 6px" }}>{f.title}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 14, padding: "16px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#a78bfa", margin: "0 0 8px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#1e0060,#0f0030)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 24, padding: "32px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 10px" }}>무료 MBTI 테스트 시작</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 22px" }}>16문항으로 2분 안에 내 MBTI 유형과 사주 오행 기질을 동시에 무료로 분석해드려요</p>
          <Link href="/mbti" style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 36px", borderRadius: 30, textDecoration: "none" }}>
            무료 MBTI 테스트 →
          </Link>
        </div>
        <style>{`.toss-mobile-only{display:none}@media(max-width:767px){.toss-mobile-only{display:block}}`}</style>
        <div className="toss-mobile-only" style={{ marginTop: 16, textAlign: "center" }}>
          <a href="https://minion.toss.im/pht8Fcyp" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#1b64da", color: "white", fontWeight: 900, fontSize: 14, padding: "12px 28px", borderRadius: 30, textDecoration: "none" }}>토스에서 바로 열기 ↗</a>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>앱 설치 없이 토스에서 바로 이용</p>
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
          <Link href="/mbti" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>← MBTI 홈</Link>
          <Link href="/main-v2" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>사주 보기</Link>
          <Link href="/gunghap" style={{ color: "#a78bfa", fontSize: 13, textDecoration: "none" }}>궁합 보기</Link>
        </div>
      </section>
    </main>
  );
}
