import type { Metadata } from "next";
import Link from "next/link";

type Entry = { slug: string; title: string; desc: string; h1: string; sub: string; emoji: string; };

const DATA: Entry[] = [
  { slug:"zodiac", title:"별자리 운세 | 점운 별자리", desc:"내 별자리와 사주 오행을 결합해 오늘의 운세와 나의 기질을 무료로 분석합니다.", h1:"별자리 운세 — 오행과 결합한 별자리 분석", sub:"내 별자리+사주 오행 결합 오늘의 운세·기질 무료 분석", emoji:"⭐" },
  { slug:"free-zodiac", title:"무료 별자리 운세 | 점운 별자리", desc:"무료 별자리 운세 — 내 별자리와 오행 기질로 오늘의 운세를 즉시 무료로 확인하세요.", h1:"무료 별자리 운세 — 즉시 무료 별자리 분석", sub:"별자리+오행 기질 오늘의 운세 즉시 무료 분석", emoji:"🆓" },
  { slug:"aries-zodiac", title:"양자리 운세 | 점운 별자리", desc:"양자리(3.21~4.19) 운세 분석 — 양자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"양자리 운세 — 화 오행 에너지 양자리 분석", sub:"양자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♈" },
  { slug:"taurus-zodiac", title:"황소자리 운세 | 점운 별자리", desc:"황소자리(4.20~5.20) 운세 분석 — 황소자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"황소자리 운세 — 토 오행 에너지 황소자리 분석", sub:"황소자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♉" },
  { slug:"gemini-zodiac", title:"쌍둥이자리 운세 | 점운 별자리", desc:"쌍둥이자리(5.21~6.20) 운세 분석 — 쌍둥이자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"쌍둥이자리 운세 — 목 오행 에너지 쌍둥이자리", sub:"쌍둥이자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♊" },
  { slug:"cancer-zodiac", title:"게자리 운세 | 점운 별자리", desc:"게자리(6.21~7.22) 운세 분석 — 게자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"게자리 운세 — 수 오행 에너지 게자리 분석", sub:"게자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♋" },
  { slug:"leo-zodiac", title:"사자자리 운세 | 점운 별자리", desc:"사자자리(7.23~8.22) 운세 분석 — 사자자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"사자자리 운세 — 화 오행 에너지 사자자리 분석", sub:"사자자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♌" },
  { slug:"virgo-zodiac", title:"처녀자리 운세 | 점운 별자리", desc:"처녀자리(8.23~9.22) 운세 분석 — 처녀자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"처녀자리 운세 — 토 오행 에너지 처녀자리 분석", sub:"처녀자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♍" },
  { slug:"libra-zodiac", title:"천칭자리 운세 | 점운 별자리", desc:"천칭자리(9.23~10.22) 운세 분석 — 천칭자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"천칭자리 운세 — 금 오행 에너지 천칭자리 분석", sub:"천칭자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♎" },
  { slug:"scorpio-zodiac", title:"전갈자리 운세 | 점운 별자리", desc:"전갈자리(10.23~11.21) 운세 분석 — 전갈자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"전갈자리 운세 — 수 오행 에너지 전갈자리 분석", sub:"전갈자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♏" },
  { slug:"sagittarius-zodiac", title:"사수자리 운세 | 점운 별자리", desc:"사수자리(11.22~12.21) 운세 분석 — 사수자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"사수자리 운세 — 화 오행 에너지 사수자리 분석", sub:"사수자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♐" },
  { slug:"capricorn-zodiac", title:"염소자리 운세 | 점운 별자리", desc:"염소자리(12.22~1.19) 운세 분석 — 염소자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"염소자리 운세 — 토 오행 에너지 염소자리 분석", sub:"염소자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♑" },
  { slug:"aquarius-zodiac", title:"물병자리 운세 | 점운 별자리", desc:"물병자리(1.20~2.18) 운세 분석 — 물병자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"물병자리 운세 — 금 오행 에너지 물병자리 분석", sub:"물병자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♒" },
  { slug:"pisces-zodiac", title:"물고기자리 운세 | 점운 별자리", desc:"물고기자리(2.19~3.20) 운세 분석 — 물고기자리의 성격 특성, 오행 기질, 오늘의 운세를 분석합니다.", h1:"물고기자리 운세 — 수 오행 에너지 물고기자리", sub:"물고기자리 성격 특성·오행 기질·오늘의 운세 분석", emoji:"♓" },
  { slug:"zodiac-ohaeng", title:"별자리와 오행 | 점운 별자리", desc:"12별자리와 오행 에너지의 연결 — 서양 별자리와 동양 오행 기질의 공명 관계를 분석합니다.", h1:"별자리와 오행 — 서양과 동양 기질의 만남", sub:"12별자리와 목·화·토·금·수 오행 기질 공명 관계 분석", emoji:"☯️" },
  { slug:"zodiac-mbti", title:"별자리와 MBTI | 점운 별자리", desc:"12별자리와 MBTI 관계 — 12별자리와 16가지 MBTI 유형, 오행 기질의 통합 분석입니다.", h1:"별자리·MBTI·오행 — 3가지 자아 분석 통합", sub:"12별자리·MBTI 16유형·오행 기질 통합 분석", emoji:"🧠" },
  { slug:"zodiac-saju", title:"별자리와 사주 | 점운 별자리", desc:"12별자리와 사주 오행의 연결 — 서양 별자리와 동양 사주를 함께 활용한 통합 운세 분석입니다.", h1:"별자리와 사주 — 서동양 운세 통합 분석", sub:"12별자리와 사주 오행을 결합한 통합 운세 분석법", emoji:"🔮" },
  { slug:"zodiac-gunghap", title:"별자리 궁합 | 점운 별자리", desc:"별자리 궁합 분석 — 두 사람의 별자리와 오행 궁합을 함께 분석한 통합 궁합 분석입니다.", h1:"별자리 궁합 — 별자리+오행 통합 궁합 분석", sub:"두 사람의 별자리와 오행 궁합 통합 분석", emoji:"💑" },
  { slug:"zodiac-today", title:"오늘의 별자리 운세 | 점운 별자리", desc:"오늘의 별자리 운세 — 내 별자리와 오행 에너지로 오늘 하루의 운세를 즉시 확인하세요.", h1:"오늘의 별자리 운세 — 별자리+오행 오늘 운세", sub:"별자리+오행 에너지로 오늘 하루 운세 즉시 확인", emoji:"🌟" },
  { slug:"zodiac-love", title:"별자리 연애 운세 | 점운 별자리", desc:"별자리 연애 운세 — 내 별자리와 오행 에너지로 연애 운세와 이상적인 파트너를 분석합니다.", h1:"별자리 연애 운세 — 별자리+오행 연애 분석", sub:"내 별자리·오행으로 보는 연애 운세와 이상형 분석", emoji:"💕" },
  { slug:"zodiac-money", title:"별자리 재물 운세 | 점운 별자리", desc:"별자리 재물 운세 — 내 별자리와 오행 에너지로 재물 운세와 돈의 흐름을 분석합니다.", h1:"별자리 재물 운세 — 별자리+오행 재물 분석", sub:"내 별자리·오행으로 보는 재물 운세·돈의 흐름 분석", emoji:"💰" },
  { slug:"zodiac-career", title:"별자리 직업 운세 | 점운 별자리", desc:"별자리 직업 운세 — 내 별자리와 오행 에너지로 직업 운세와 커리어 방향을 분석합니다.", h1:"별자리 직업 운세 — 별자리+오행 직업 분석", sub:"내 별자리·오행으로 보는 직업 운세와 커리어 방향", emoji:"💼" },
  { slug:"zodiac-health", title:"별자리 건강 운세 | 점운 별자리", desc:"별자리 건강 운세 — 내 별자리와 오행 에너지로 건강 운세와 주의 부위를 분석합니다.", h1:"별자리 건강 운세 — 별자리+오행 건강 분석", sub:"내 별자리·오행으로 보는 건강 운세·주의 부위 분석", emoji:"❤️" },
  { slug:"zodiac-fire-signs", title:"불 별자리 운세 | 점운 별자리", desc:"불의 별자리(양자리·사자자리·사수자리) 운세 — 화(火) 오행과 공명하는 불의 별자리 분석입니다.", h1:"불 별자리 운세 — 양자리·사자자리·사수자리 화 오행", sub:"불의 별자리와 화 오행 에너지 공명 관계 분석", emoji:"🔥" },
  { slug:"zodiac-earth-signs", title:"흙 별자리 운세 | 점운 별자리", desc:"흙의 별자리(황소자리·처녀자리·염소자리) 운세 — 토(土) 오행과 공명하는 흙의 별자리 분석입니다.", h1:"흙 별자리 운세 — 황소·처녀·염소자리 토 오행", sub:"흙의 별자리와 토 오행 에너지 공명 관계 분석", emoji:"🌍" },
  { slug:"zodiac-air-signs", title:"바람 별자리 운세 | 점운 별자리", desc:"바람의 별자리(쌍둥이자리·천칭자리·물병자리) 운세 — 목(木) 오행과 공명하는 바람의 별자리 분석입니다.", h1:"바람 별자리 운세 — 쌍둥이·천칭·물병자리 목 오행", sub:"바람의 별자리와 목 오행 에너지 공명 관계 분석", emoji:"🌿" },
  { slug:"zodiac-water-signs", title:"물 별자리 운세 | 점운 별자리", desc:"물의 별자리(게자리·전갈자리·물고기자리) 운세 — 수(水) 오행과 공명하는 물의 별자리 분석입니다.", h1:"물 별자리 운세 — 게·전갈·물고기자리 수 오행", sub:"물의 별자리와 수 오행 에너지 공명 관계 분석", emoji:"💧" },
  { slug:"zodiac-personality", title:"별자리 성격 분석 | 점운 별자리", desc:"12별자리 성격 완전 분석 — 각 별자리의 성격 특성, 장단점, 오행 기질을 완전히 분석합니다.", h1:"별자리 성격 분석 — 12별자리 특성 완전 분석", sub:"12별자리 성격·장단점·오행 기질 완전 분석 가이드", emoji:"🌈" },
  { slug:"aries-ohaeng", title:"양자리 오행 기질 | 점운 별자리", desc:"양자리(♈) 오행 기질 분석 — 양자리의 화(火) 오행 에너지와 성격 특성을 분석합니다.", h1:"양자리 오행 — 화 오행 에너지 양자리 기질", sub:"양자리와 화 오행 에너지의 공명 관계 기질 분석", emoji:"♈" },
  { slug:"leo-ohaeng", title:"사자자리 오행 기질 | 점운 별자리", desc:"사자자리(♌) 오행 기질 분석 — 사자자리의 화(火) 오행 에너지와 성격 특성을 분석합니다.", h1:"사자자리 오행 — 화 오행 에너지 사자자리 기질", sub:"사자자리와 화 오행 에너지의 공명 관계 기질 분석", emoji:"♌" },
  { slug:"scorpio-ohaeng", title:"전갈자리 오행 기질 | 점운 별자리", desc:"전갈자리(♏) 오행 기질 분석 — 전갈자리의 수(水) 오행 에너지와 성격 특성을 분석합니다.", h1:"전갈자리 오행 — 수 오행 에너지 전갈자리 기질", sub:"전갈자리와 수 오행 에너지의 공명 관계 기질 분석", emoji:"♏" },
  { slug:"capricorn-ohaeng", title:"염소자리 오행 기질 | 점운 별자리", desc:"염소자리(♑) 오행 기질 분석 — 염소자리의 토(土) 오행 에너지와 성격 특성을 분석합니다.", h1:"염소자리 오행 — 토 오행 에너지 염소자리 기질", sub:"염소자리와 토 오행 에너지의 공명 관계 기질 분석", emoji:"♑" },
  { slug:"zodiac-lucky-color", title:"별자리 행운 색깔 | 점운 별자리", desc:"별자리별 행운 색깔 — 내 별자리와 오행 오색(청·적·황·백·흑)을 결합한 행운 색깔을 분석합니다.", h1:"별자리 행운 색깔 — 별자리+오행 오색 행운 색", sub:"별자리와 오행 오색 결합 행운 색깔·스타일 분석", emoji:"🌈" },
  { slug:"zodiac-lucky-number", title:"별자리 행운번호 | 점운 별자리", desc:"별자리별 행운번호 — 내 별자리와 오행 에너지로 이번 주 행운 번호를 분석합니다.", h1:"별자리 행운번호 — 별자리+오행 행운 번호", sub:"별자리와 오행 에너지 결합 행운 번호 즉시 분석", emoji:"🍀" },
  { slug:"zodiac-month", title:"별자리 월별 운세 | 점운 별자리", desc:"별자리 월별 운세 — 내 별자리와 오행 에너지로 이달의 운세를 분석합니다.", h1:"별자리 월별 운세 — 별자리+오행 이달의 운세", sub:"내 별자리+오행으로 이달의 운세 흐름 분석", emoji:"📅" },
  { slug:"zodiac-new-year", title:"별자리 신년 운세 | 점운 별자리", desc:"별자리 신년 운세 — 내 별자리와 올해 오행 에너지를 결합한 올해의 운세를 분석합니다.", h1:"별자리 신년 운세 — 별자리+올해 오행 에너지", sub:"내 별자리+올해 오행 에너지 결합 신년 운세 분석", emoji:"🎊" },
  { slug:"zodiac-career-advice", title:"별자리 직업 조언 | 점운 별자리", desc:"별자리별 직업 조언 — 내 별자리와 오행 기질에 맞는 직업 추천과 커리어 방향을 안내합니다.", h1:"별자리 직업 조언 — 별자리+오행 직업 추천", sub:"별자리+오행 기질로 찾는 최적 직업·커리어 방향", emoji:"💼" },
  { slug:"zodiac-love-match", title:"별자리 연애 궁합 | 점운 별자리", desc:"별자리 연애 궁합 매칭 — 내 별자리와 잘 맞는 파트너 별자리와 오행 궁합을 분석합니다.", h1:"별자리 연애 궁합 — 내 별자리 최적 파트너 분석", sub:"내 별자리와 잘 맞는 파트너 별자리+오행 궁합 분석", emoji:"💕" },
  { slug:"zodiac-strengths", title:"별자리 강점 분석 | 점운 별자리", desc:"별자리별 강점 분석 — 내 별자리와 오행 기질로 나의 핵심 강점과 재능을 분석합니다.", h1:"별자리 강점 분석 — 별자리+오행 핵심 강점", sub:"별자리+오행 기질로 보는 나의 핵심 강점과 재능", emoji:"💪" },
  { slug:"zodiac-weakness", title:"별자리 약점 분석 | 점운 별자리", desc:"별자리별 약점 분석 — 내 별자리와 오행 기질로 나의 약점과 보완해야 할 점을 분석합니다.", h1:"별자리 약점 분석 — 별자리+오행 약점과 보완점", sub:"별자리+오행 기질로 보는 나의 약점과 보완해야 할 점", emoji:"🛡️" },
  { slug:"zodiac-friend", title:"별자리 친구 궁합 | 점운 별자리", desc:"별자리 친구 궁합 — 어떤 별자리와 진정한 우정을 쌓을 수 있는지 오행으로 분석합니다.", h1:"별자리 친구 궁합 — 별자리+오행 우정 분석", sub:"별자리+오행으로 보는 진정한 우정 궁합 분석", emoji:"👫" },
  { slug:"zodiac-work-team", title:"별자리 직장 궁합 | 점운 별자리", desc:"별자리 직장 궁합 — 직장에서 함께 일하기 좋은 별자리와 오행 궁합을 분석합니다.", h1:"별자리 직장 궁합 — 함께 일하기 좋은 별자리", sub:"직장 내 별자리+오행 궁합과 협업 패턴 분석", emoji:"🏢" },
  { slug:"zodiac-stress", title:"별자리 스트레스 반응 | 점운 별자리", desc:"별자리별 스트레스 반응 — 내 별자리와 오행 기질로 스트레스 반응과 해소법을 분석합니다.", h1:"별자리 스트레스 반응 — 별자리+오행 스트레스 분석", sub:"별자리+오행 기질로 보는 스트레스 반응과 해소법", emoji:"😤" },
  { slug:"zodiac-money-habit", title:"별자리 돈 관리 | 점운 별자리", desc:"별자리별 돈 관리 습관 — 내 별자리와 오행 기질로 소비 패턴과 재물 관리법을 분석합니다.", h1:"별자리 돈 관리 — 별자리+오행 재물 습관 분석", sub:"별자리+오행 기질로 보는 소비 패턴과 재물 관리법", emoji:"💰" },
  { slug:"zodiac-travel", title:"별자리 여행 스타일 | 점운 별자리", desc:"별자리별 여행 스타일 — 내 별자리와 오행 기질로 선호하는 여행 방식과 여행지를 분석합니다.", h1:"별자리 여행 스타일 — 별자리+오행 여행 분석", sub:"별자리+오행 기질로 보는 여행 방식과 추천 여행지", emoji:"✈️" },
  { slug:"zodiac-rising", title:"어센던트 별자리 | 점운 별자리", desc:"상승 별자리(어센던트) 분석 — 태어난 시간으로 결정되는 어센던트 별자리와 오행 기질의 연결을 분석합니다.", h1:"어센던트 별자리 — 상승 별자리와 오행 기질", sub:"태어난 시간의 어센던트 별자리와 오행 기질 연결 분석", emoji:"🌅" },
  { slug:"zodiac-moon-sign", title:"달자리 | 점운 별자리", desc:"달자리(문 사인) 분석 — 감정과 내면을 상징하는 달자리와 오행 기질의 연결을 분석합니다.", h1:"달자리 분석 — 내면과 감정의 달자리+오행 연결", sub:"감정과 내면을 상징하는 달자리와 오행 기질 연결", emoji:"🌙" },
  { slug:"zodiac-planet", title:"별자리 지배 행성 | 점운 별자리", desc:"별자리별 지배 행성 — 12별자리의 지배 행성과 오행 에너지의 연결 관계를 분석합니다.", h1:"별자리 지배 행성 — 오행 에너지와의 연결 분석", sub:"12별자리 지배 행성과 오행 에너지 연결 관계 분석", emoji:"🪐" },
  { slug:"zodiac-element", title:"별자리 원소 | 점운 별자리", desc:"별자리 4원소(불·흙·공기·물)와 오행(목·화·토·금·수)의 연결 관계를 완전 분석합니다.", h1:"별자리 4원소와 오행 — 서동양 에너지 연결", sub:"별자리 4원소(불·흙·공기·물)와 오행 에너지 연결 분석", emoji:"☯️" },
  { slug:"zodiac-chart", title:"출생 차트 | 점운 별자리", desc:"출생 차트(호로스코프)와 사주의 연결 — 서양 출생 차트와 동양 사주 오행의 통합 분석법을 안내합니다.", h1:"출생 차트와 사주 — 서동양 운명 통합 분석", sub:"서양 출생 차트(호로스코프)와 동양 사주 통합 분석법", emoji:"🔮" },
  { slug:"zodiac-history", title:"별자리 역사 | 점운 별자리", desc:"별자리 점성술의 역사 — 바빌로니아부터 현재까지 별자리 점성술의 역사와 동양 오행과의 연결을 안내합니다.", h1:"별자리 역사 — 점성술의 역사와 동양 철학 연결", sub:"바빌로니아부터 현재까지 별자리 점성술 역사 안내", emoji:"📜" },
  { slug:"zodiac-app", title:"별자리 앱 | 점운 별자리", desc:"별자리 운세 앱 — 점운 별자리 앱으로 내 별자리와 오행 기질 통합 운세를 즉시 무료로 확인하세요.", h1:"별자리 앱 — 별자리+오행 통합 운세 무료 앱", sub:"별자리와 오행 기질 통합 운세 즉시 무료 앱", emoji:"📱" },
  { slug:"zodiac-2025", title:"2025년 별자리 운세 | 점운 별자리", desc:"2025년 별자리 운세 — 을사년 뱀의 해 오행 에너지와 12별자리의 2025년 운세를 분석합니다.", h1:"2025년 별자리 운세 — 을사년 12별자리 운세", sub:"을사년 오행 에너지와 12별자리 2025년 운세 분석", emoji:"🐍" },
  { slug:"zodiac-2026", title:"2026년 별자리 운세 | 점운 별자리", desc:"2026년 별자리 운세 — 병오년 말의 해 오행 에너지와 12별자리의 2026년 운세를 분석합니다.", h1:"2026년 별자리 운세 — 병오년 12별자리 운세", sub:"병오년 오행 에너지와 12별자리 2026년 운세 분석", emoji:"🐴" },
  { slug:"zodiac-tarot", title:"별자리 타로 | 점운 별자리", desc:"별자리 타로카드 — 내 별자리와 오행 에너지로 타로카드 메시지를 즉시 받아보세요.", h1:"별자리 타로 — 별자리+오행+타로 통합 분석", sub:"별자리+오행 에너지로 해석하는 타로카드 메시지", emoji:"🃏" },
  { slug:"zodiac-healing", title:"별자리 힐링 | 점운 별자리", desc:"별자리 힐링 — 내 별자리와 오행 기질에 맞는 힐링 방법과 에너지 회복법을 안내합니다.", h1:"별자리 힐링 — 별자리+오행으로 에너지 회복하기", sub:"별자리+오행 기질에 맞는 힐링 방법과 에너지 회복법", emoji:"🌿" },
  { slug:"zodiac-meditation", title:"별자리 명상 | 점운 별자리", desc:"별자리 명상법 — 내 별자리와 오행 기질에 맞는 명상 방법과 집중 포인트를 안내합니다.", h1:"별자리 명상 — 별자리+오행 기질 맞춤 명상법", sub:"별자리+오행 기질에 맞는 명상 방법과 집중 포인트", emoji:"🧘" },
  { slug:"zodiac-crystal", title:"별자리 수정 | 점운 별자리", desc:"별자리별 수정(크리스탈) 추천 — 내 별자리와 오행 기질에 맞는 행운의 수정을 추천합니다.", h1:"별자리 수정 추천 — 별자리+오행 행운 크리스탈", sub:"별자리+오행 기질에 맞는 행운의 수정(크리스탈) 추천", emoji:"💎" },
  { slug:"zodiac-food", title:"별자리 음식 | 점운 별자리", desc:"별자리별 행운 음식 — 내 별자리와 오행 기질에 맞는 음식과 피해야 할 음식을 추천합니다.", h1:"별자리 행운 음식 — 별자리+오행 맞춤 식단", sub:"별자리+오행 기질에 맞는 음식과 피해야 할 음식", emoji:"🍽️" },
  { slug:"zodiac-vs-saju", title:"별자리 vs 사주 | 점운 별자리", desc:"별자리 vs 사주 차이 — 서양 별자리 점성술과 동양 사주의 차이점과 각각의 장점을 분석합니다.", h1:"별자리 vs 사주 — 서양과 동양 점술 비교", sub:"서양 별자리 점성술과 동양 사주의 차이점·장점 분석", emoji:"⚖️" },
  { slug:"zodiac-summary", title:"별자리 완전 정리 | 점운 별자리", desc:"12별자리 완전 정리 — 12별자리 성격·궁합·오행 연결의 완전한 가이드입니다.", h1:"별자리 완전 정리 — 12별자리+오행 완전 가이드", sub:"12별자리 성격·궁합·오행 연결 완전 정리 가이드", emoji:"📖" },
  { slug:"zodiac-aries-love", title:"양자리 연애운 | 점운 별자리", desc:"양자리 연애운 분석 — 양자리(♈)의 열정적 연애 스타일과 오행 화(火) 에너지로 보는 이상적 상대입니다.", h1:"양자리 연애운 — 열정 연애 스타일·이상적 상대", sub:"양자리 열정 연애 스타일과 오행 화 에너지 이상형", emoji:"♈" },
  { slug:"zodiac-taurus-love", title:"황소자리 연애운 | 점운 별자리", desc:"황소자리 연애운 분석 — 황소자리(♉)의 안정적 연애 스타일과 오행 토(土) 에너지로 보는 이상적 상대입니다.", h1:"황소자리 연애운 — 안정적 연애 스타일·이상형", sub:"황소자리 안정적 연애 스타일과 오행 토 에너지 이상형", emoji:"♉" },
  { slug:"zodiac-gemini-love", title:"쌍둥이자리 연애운 | 점운 별자리", desc:"쌍둥이자리 연애운 분석 — 쌍둥이자리(♊)의 다양한 연애 스타일과 오행 목(木) 에너지로 보는 이상형입니다.", h1:"쌍둥이자리 연애운 — 다채로운 연애 스타일·이상형", sub:"쌍둥이자리 다채로운 연애 스타일과 오행 목 에너지", emoji:"♊" },
  { slug:"zodiac-cancer-love", title:"게자리 연애운 | 점운 별자리", desc:"게자리 연애운 분석 — 게자리(♋)의 감성적 연애 스타일과 오행 수(水) 에너지로 보는 이상형입니다.", h1:"게자리 연애운 — 감성적 연애 스타일·이상형", sub:"게자리 감성적 연애 스타일과 오행 수 에너지 이상형", emoji:"♋" },
  { slug:"zodiac-leo-love", title:"사자자리 연애운 | 점운 별자리", desc:"사자자리 연애운 분석 — 사자자리(♌)의 자신감 넘치는 연애 스타일과 오행 화(火) 에너지 이상형입니다.", h1:"사자자리 연애운 — 자신감 연애 스타일·이상형", sub:"사자자리 자신감 연애 스타일과 오행 화 에너지 이상형", emoji:"♌" },
  { slug:"zodiac-virgo-love", title:"처녀자리 연애운 | 점운 별자리", desc:"처녀자리 연애운 분석 — 처녀자리(♍)의 신중한 연애 스타일과 오행 토(土) 에너지로 보는 이상형입니다.", h1:"처녀자리 연애운 — 신중한 연애 스타일·이상형", sub:"처녀자리 신중한 연애 스타일과 오행 토 에너지 이상형", emoji:"♍" },
  { slug:"zodiac-libra-love", title:"천칭자리 연애운 | 점운 별자리", desc:"천칭자리 연애운 분석 — 천칭자리(♎)의 균형적 연애 스타일과 오행 금(金) 에너지로 보는 이상형입니다.", h1:"천칭자리 연애운 — 균형적 연애 스타일·이상형", sub:"천칭자리 균형적 연애 스타일과 오행 금 에너지 이상형", emoji:"♎" },
  { slug:"zodiac-scorpio-love", title:"전갈자리 연애운 | 점운 별자리", desc:"전갈자리 연애운 분석 — 전갈자리(♏)의 열정적 심층 연애 스타일과 오행 수(水) 에너지 이상형입니다.", h1:"전갈자리 연애운 — 심층 열정 연애 스타일·이상형", sub:"전갈자리 심층 열정 연애 스타일과 오행 수 에너지", emoji:"♏" },
  { slug:"zodiac-sagittarius-love", title:"궁수자리 연애운 | 점운 별자리", desc:"궁수자리 연애운 분석 — 궁수자리(♐)의 자유로운 연애 스타일과 오행 화(火) 에너지로 보는 이상형입니다.", h1:"궁수자리 연애운 — 자유로운 연애 스타일·이상형", sub:"궁수자리 자유로운 연애 스타일과 오행 화 에너지 이상형", emoji:"♐" },
  { slug:"zodiac-capricorn-love", title:"염소자리 연애운 | 점운 별자리", desc:"염소자리 연애운 분석 — 염소자리(♑)의 진지한 연애 스타일과 오행 토(土) 에너지로 보는 이상형입니다.", h1:"염소자리 연애운 — 진지한 연애 스타일·이상형", sub:"염소자리 진지한 연애 스타일과 오행 토 에너지 이상형", emoji:"♑" },
  { slug:"zodiac-aquarius-love", title:"물병자리 연애운 | 점운 별자리", desc:"물병자리 연애운 분석 — 물병자리(♒)의 독특한 연애 스타일과 오행 수(水) 에너지로 보는 이상형입니다.", h1:"물병자리 연애운 — 독특한 연애 스타일·이상형", sub:"물병자리 독특한 연애 스타일과 오행 수 에너지 이상형", emoji:"♒" },
  { slug:"zodiac-pisces-love", title:"물고기자리 연애운 | 점운 별자리", desc:"물고기자리 연애운 분석 — 물고기자리(♓)의 로맨틱 연애 스타일과 오행 수(水) 에너지 이상형입니다.", h1:"물고기자리 연애운 — 로맨틱 연애 스타일·이상형", sub:"물고기자리 로맨틱 연애 스타일과 오행 수 에너지", emoji:"♓" },
  { slug:"zodiac-aries-career", title:"양자리 직업운 | 점운 별자리", desc:"양자리 직업운 분석 — 양자리(♈)에게 맞는 직업과 오행 화 에너지를 활용한 성공 직업 전략입니다.", h1:"양자리 직업운 — 화 에너지 활용 성공 직업 전략", sub:"양자리 오행 화 에너지 활용 맞춤 직업·성공 전략", emoji:"💼" },
  { slug:"zodiac-taurus-career", title:"황소자리 직업운 | 점운 별자리", desc:"황소자리 직업운 분석 — 황소자리(♉)에게 맞는 직업과 오행 토 에너지를 활용한 성공 전략입니다.", h1:"황소자리 직업운 — 토 에너지 활용 성공 직업 전략", sub:"황소자리 오행 토 에너지 활용 맞춤 직업·성공 전략", emoji:"💼" },
  { slug:"zodiac-gemini-career", title:"쌍둥이자리 직업운 | 점운 별자리", desc:"쌍둥이자리 직업운 분석 — 쌍둥이자리(♊)에게 맞는 직업과 오행 목 에너지 성공 전략입니다.", h1:"쌍둥이자리 직업운 — 목 에너지 성공 직업 전략", sub:"쌍둥이자리 오행 목 에너지 맞춤 직업·성공 전략", emoji:"💼" },
  { slug:"zodiac-compatibility-fire", title:"불의 별자리 궁합 | 점운 별자리", desc:"불의 별자리(양자리·사자·궁수) 궁합 — 화(火) 오행 기질 3개 별자리의 궁합과 관계 패턴입니다.", h1:"불의 별자리 궁합 — 양자리·사자·궁수 화 오행 관계", sub:"화 오행 불의 별자리 3종 궁합과 관계 패턴 분석", emoji:"🔥" },
  { slug:"zodiac-compatibility-earth", title:"흙의 별자리 궁합 | 점운 별자리", desc:"흙의 별자리(황소·처녀·염소) 궁합 — 토(土) 오행 기질 3개 별자리의 궁합과 관계 패턴입니다.", h1:"흙의 별자리 궁합 — 황소·처녀·염소 토 오행 관계", sub:"토 오행 흙의 별자리 3종 궁합과 관계 패턴 분석", emoji:"🌍" },
  { slug:"zodiac-compatibility-air", title:"바람의 별자리 궁합 | 점운 별자리", desc:"바람의 별자리(쌍둥이·천칭·물병) 궁합 — 목(木) 오행 기질 3개 별자리의 궁합과 관계 패턴입니다.", h1:"바람의 별자리 궁합 — 쌍둥이·천칭·물병 목 오행", sub:"목 오행 바람의 별자리 3종 궁합과 관계 패턴 분석", emoji:"💨" },
  { slug:"zodiac-compatibility-water", title:"물의 별자리 궁합 | 점운 별자리", desc:"물의 별자리(게·전갈·물고기) 궁합 — 수(水) 오행 기질 3개 별자리의 궁합과 관계 패턴입니다.", h1:"물의 별자리 궁합 — 게·전갈·물고기 수 오행 관계", sub:"수 오행 물의 별자리 3종 궁합과 관계 패턴 분석", emoji:"💧" },
  { slug:"zodiac-monthly", title:"별자리 월별 운세 | 점운 별자리", desc:"별자리 월별 운세 — 1월부터 12월까지 12별자리의 월별 오행 에너지 운세를 분석합니다.", h1:"별자리 월별 운세 — 12별자리 1~12월 오행 운세", sub:"1월부터 12월까지 12별자리 월별 오행 에너지 운세", emoji:"📅" },
  { slug:"zodiac-yearly", title:"별자리 연간 운세 | 점운 별자리", desc:"별자리 연간 운세 — 2025·2026년 12별자리 연간 오행 에너지 운세를 분석합니다.", h1:"별자리 연간 운세 — 2025·2026 12별자리 오행 운세", sub:"2025·2026 연간 12별자리 오행 에너지 운세 분석", emoji:"📆" },
  { slug:"zodiac-health", title:"별자리 건강운 | 점운 별자리", desc:"별자리 건강운 분석 — 12별자리와 오행 에너지로 보는 건강 취약 부위와 건강 관리 방법입니다.", h1:"별자리 건강운 — 12별자리 오행 건강 취약·관리법", sub:"12별자리 오행 에너지로 보는 건강 취약 부위와 관리", emoji:"💊" },
  { slug:"zodiac-money", title:"별자리 재물운 | 점운 별자리", desc:"별자리 재물운 분석 — 12별자리와 오행 에너지로 보는 재물 축적 방식과 지출 패턴입니다.", h1:"별자리 재물운 — 12별자리 오행 재물 축적·지출 패턴", sub:"12별자리 오행 에너지로 보는 재물 축적 방식·지출", emoji:"💰" },
  { slug:"zodiac-mbti", title:"별자리와 MBTI | 점운 별자리", desc:"별자리와 MBTI 연결 — 12별자리와 16MBTI 유형의 연관성을 오행 기질로 분석합니다.", h1:"별자리와 MBTI — 12별자리·16유형 오행 연결 분석", sub:"12별자리와 16MBTI 유형의 오행 기질 연관성 분석", emoji:"🧠" },
  { slug:"zodiac-saju-integration", title:"별자리+사주 통합 분석 | 점운 별자리", desc:"별자리+사주 통합 분석 — 서양 별자리와 동양 사주를 함께 보는 통합 운세 분석 방법입니다.", h1:"별자리+사주 통합 분석 — 동서양 운세 통합 가이드", sub:"서양 별자리와 동양 사주를 함께 보는 통합 운세 분석", emoji:"🌏" },
  { slug:"zodiac-risingsign", title:"상승궁 별자리 | 점운 별자리", desc:"상승궁(어센던트) 별자리 분석 — 출생 시간으로 계산하는 상승궁과 오행의 관계를 분석합니다.", h1:"상승궁 별자리 — 출생 시간 어센던트 오행 분석", sub:"출생 시간 기반 상승궁(어센던트) 별자리와 오행 관계", emoji:"⬆️" },
  { slug:"zodiac-moonsign", title:"달 별자리 | 점운 별자리", desc:"달 별자리(문 사인) 분석 — 내면의 감정과 오행 수(水) 에너지를 달 별자리로 분석합니다.", h1:"달 별자리 — 내면 감정과 오행 수 에너지 분석", sub:"달 별자리(문 사인)로 보는 내면 감정과 오행 수 에너지", emoji:"🌙" },
  { slug:"zodiac-planet", title:"별자리 지배 행성 | 점운 별자리", desc:"별자리 지배 행성 분석 — 12별자리의 지배 행성과 오행 에너지의 연결을 분석합니다.", h1:"별자리 지배 행성 — 12별자리 지배성과 오행 연결", sub:"12별자리 지배 행성과 오행 에너지 연결 완전 분석", emoji:"🪐" },
  { slug:"zodiac-nakshatra", title:"별자리와 28수 | 점운 별자리", desc:"서양 별자리와 동양 28수 — 서양 12별자리와 동양 28수(宿)의 연결점과 오행 에너지 비교입니다.", h1:"별자리와 28수 — 서양과 동양 별자리 연결 비교", sub:"서양 12별자리와 동양 28수의 오행 에너지 연결 비교", emoji:"✨" },
  { slug:"zodiac-cusp", title:"별자리 경계 (커스프) | 점운 별자리", desc:"별자리 경계(커스프) 분석 — 두 별자리 사이 날짜에 태어난 분들의 오행 에너지를 분석합니다.", h1:"별자리 경계 — 두 별자리 사이 커스프 오행 분석", sub:"두 별자리 경계일 태어난 분들의 오행 에너지 분석", emoji:"⚖️" },
  { slug:"zodiac-soulmate", title:"별자리 소울메이트 | 점운 별자리", desc:"별자리 소울메이트 — 오행 에너지로 보는 12별자리별 소울메이트 유형과 만남의 시기를 분석합니다.", h1:"별자리 소울메이트 — 오행 에너지 소울메이트 분석", sub:"12별자리별 소울메이트 유형과 오행 에너지 만남 시기", emoji:"💫" },
  { slug:"zodiac-friendship", title:"별자리 우정 궁합 | 점운 별자리", desc:"별자리 우정 궁합 — 12별자리와 오행 에너지로 보는 친구 궁합과 오래가는 우정 유형입니다.", h1:"별자리 우정 궁합 — 오행 에너지 친구 궁합 분석", sub:"12별자리 오행 에너지로 보는 친구 궁합·오래가는 우정", emoji:"🤝" },
  { slug:"zodiac-parent-child", title:"별자리 부모자녀 궁합 | 점운 별자리", desc:"별자리 부모자녀 궁합 — 부모와 자녀의 별자리 오행 에너지 차이를 이해하는 관계 가이드입니다.", h1:"별자리 부모자녀 궁합 — 오행 에너지 가족 관계", sub:"부모와 자녀의 별자리·오행 에너지 차이 이해 가이드", emoji:"👨‍👩‍👧" },
  { slug:"zodiac-work", title:"별자리 직장 궁합 | 점운 별자리", desc:"별자리 직장 궁합 — 동료·상사·부하와의 별자리 오행 에너지 궁합으로 직장 관계를 개선합니다.", h1:"별자리 직장 궁합 — 동료·상사 오행 에너지 관계", sub:"직장 동료·상사·부하와의 별자리 오행 궁합 분석", emoji:"🏢" },
  { slug:"zodiac-today", title:"오늘 별자리 운세 | 점운 별자리", desc:"오늘의 별자리 운세 — 오늘 날짜의 오행 에너지와 내 별자리를 결합한 오늘의 운세입니다.", h1:"오늘 별자리 운세 — 오행 에너지 오늘의 별자리", sub:"오늘 날짜 오행 에너지와 별자리 결합 오늘의 운세", emoji:"🌞" },
  { slug:"zodiac-free", title:"무료 별자리 운세 | 점운 별자리", desc:"무료 별자리 운세 — 회원가입 없이 내 별자리와 오행 기질을 즉시 무료로 분석해드립니다.", h1:"무료 별자리 운세 — 즉시 별자리+오행 기질 분석", sub:"회원가입 없이 즉시 별자리와 오행 기질 무료 분석", emoji:"🎁" },
  { slug:"zodiac-lucky-color", title:"별자리 행운 색깔 | 점운 별자리", desc:"별자리별 행운 색깔 — 12별자리와 오행 오색(청·적·황·백·흑) 연결로 보는 행운의 색깔입니다.", h1:"별자리 행운 색깔 — 별자리+오행 오색 행운의 색", sub:"12별자리와 오행 오색 연결로 보는 별자리별 행운 색깔", emoji:"🎨" },
  { slug:"zodiac-lucky-number", title:"별자리 행운 숫자 | 점운 별자리", desc:"별자리별 행운 숫자 — 12별자리와 오행 수리를 결합한 행운의 숫자와 의미를 분석합니다.", h1:"별자리 행운 숫자 — 별자리+오행 수리 행운 숫자", sub:"12별자리와 오행 수리를 결합한 행운의 숫자 분석", emoji:"🔢" },
  { slug:"zodiac-lucky-day", title:"별자리 행운의 날 | 점운 별자리", desc:"별자리별 행운의 날 — 12별자리와 오행 일주 에너지 결합으로 보는 행운이 따르는 요일과 날입니다.", h1:"별자리 행운의 날 — 별자리+오행 일주 행운 요일", sub:"12별자리와 오행 일주 에너지 결합 행운의 요일·날", emoji:"📅" },
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
    keywords: ["별자리운세", "무료별자리", "별자리오행", "12별자리", "점운별자리", "별자리사주"],
    openGraph: { title: d.title, description: d.desc, url: `https://jeomun.com/zodiac/guide/${d.slug}` },
  };
}

export default async function ZodiacSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];

  const features = [
    { icon: "⭐", title: "12별자리+오행 분석", desc: "서양 12별자리와 동양 오행 기질을 결합해 더 정확한 성격과 운세를 분석합니다." },
    { icon: "💕", title: "별자리 궁합 분석", desc: "두 사람의 별자리와 오행 궁합을 함께 분석한 통합 궁합을 제공합니다." },
    { icon: "🔮", title: "사주와 통합 분석", desc: "별자리 운세와 사주 오행을 함께 활용해 더 깊은 인사이트를 얻으세요." },
    { icon: "🌟", title: "오늘의 운세 즉시 확인", desc: "내 별자리+오행 에너지로 오늘 하루의 운세를 즉시 무료로 확인합니다." },
  ];

  const faqs = [
    { q: "별자리와 사주는 어떻게 연결되나요?", a: "서양 별자리는 4원소(불·흙·공기·물)로 성격을 분류하고, 동양 사주는 5오행(목·화·토·금·수)으로 분류합니다. 두 가지를 함께 보면 더 풍부한 자아 분석이 가능합니다." },
    { q: "내 별자리는 어떻게 알 수 있나요?", a: "생년월일로 별자리를 확인할 수 있습니다. 예를 들어 3월 21일~4월 19일은 양자리, 4월 20일~5월 20일은 황소자리입니다." },
    { q: "완전 무료인가요?", a: "네, 완전 무료입니다. 별자리+오행 통합 운세, 궁합, 성격 분석을 모두 무료로 이용하세요." },
    { q: "사주와 별자리 중 어느 것이 더 정확한가요?", a: "두 가지 모두 다른 각도에서 자신을 이해하는 도구입니다. 점운은 두 가지를 통합해 더 전체적인 그림을 제공합니다." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0a2a 0%,#1a1a4a 50%,#0a0a2a 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "#f5f5f5", wordBreak: "keep-all" as const }}>
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{d.emoji}</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, lineHeight: 1.3, margin: "0 0 14px", background: "linear-gradient(135deg,#fbbf24,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{d.h1}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 28px" }}>{d.sub}</p>
        <Link href="/zodiac" style={{ display: "inline-block", background: "linear-gradient(135deg,#d97706,#2563eb)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 32px", borderRadius: 30, textDecoration: "none", boxShadow: "0 8px 32px rgba(217,119,6,0.4)" }}>
          지금 별자리 운세 보기 →
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>별자리+사주 오행 통합 분석 · 완전 무료</p>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>점운 별자리가 특별한 이유</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 16, padding: "18px 14px" }}>
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
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 14, padding: "16px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#fbbf24", margin: "0 0 8px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#1a1a4a,#0a0a2a)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 24, padding: "32px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 10px" }}>별자리+오행 운세 보기</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 22px" }}>내 별자리와 사주 오행을 결합해 오늘의 운세와 나의 기질을 즉시 무료로 분석해드려요</p>
          <Link href="/zodiac" style={{ display: "inline-block", background: "linear-gradient(135deg,#d97706,#2563eb)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 36px", borderRadius: 30, textDecoration: "none" }}>
            무료 별자리 운세 →
          </Link>
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
          <Link href="/zodiac" style={{ color: "#fbbf24", fontSize: 13, textDecoration: "none" }}>← 별자리 홈</Link>
          <Link href="/main-v2" style={{ color: "#fbbf24", fontSize: 13, textDecoration: "none" }}>사주 보기</Link>
          <Link href="/mbti" style={{ color: "#fbbf24", fontSize: 13, textDecoration: "none" }}>MBTI 보기</Link>
        </div>
      </section>
    </main>
  );
}
