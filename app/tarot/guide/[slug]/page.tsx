import type { Metadata } from "next";
import Link from "next/link";

type Entry = { slug: string; title: string; desc: string; h1: string; sub: string; emoji: string; };

const DATA: Entry[] = [
  { slug:"tarot", title:"타로카드 | 점운 타로", desc:"지금 내 마음의 질문에 타로카드가 답해드려요. 오행 에너지와 타로카드를 결합한 무료 타로 분석입니다.", h1:"타로카드 — 오행 에너지와 타로의 만남", sub:"지금 내 마음의 질문에 오행 타로카드가 답합니다", emoji:"🃏" },
  { slug:"free-tarot", title:"무료 타로 | 점운 타로", desc:"무료 타로카드 — 지금 바로 무료로 타로카드를 뽑고 오행 에너지로 해석한 메시지를 확인하세요.", h1:"무료 타로카드 — 즉시 무료 타로 뽑기", sub:"회원가입 없이 즉시 무료로 타로카드 뽑기", emoji:"🆓" },
  { slug:"tarot-one-card", title:"타로 원카드 | 점운 타로", desc:"타로 원카드 뽑기 — 지금 이 순간 가장 필요한 메시지를 타로 원카드 한 장에서 받아보세요.", h1:"타로 원카드 — 지금 이 순간 필요한 메시지", sub:"원카드 한 장으로 받는 오행 에너지 메시지", emoji:"1️⃣" },
  { slug:"tarot-three-card", title:"타로 쓰리카드 | 점운 타로", desc:"타로 쓰리카드 뽑기 — 과거·현재·미래를 보는 3장 타로카드로 지금 상황을 분석해드립니다.", h1:"타로 쓰리카드 — 과거·현재·미래 3장 분석", sub:"과거·현재·미래 3장 타로카드 오행 분석", emoji:"3️⃣" },
  { slug:"love-tarot", title:"연애 타로 | 점운 타로", desc:"연애 타로카드 — 지금 좋아하는 사람의 마음, 우리의 관계, 앞으로의 방향을 타로카드로 분석합니다.", h1:"연애 타로 — 그 사람의 마음을 타로가 말한다", sub:"연애 현재 상황·상대방 마음·미래 방향 타로 분석", emoji:"💕" },
  { slug:"love-tarot-today", title:"오늘 연애 타로 | 점운 타로", desc:"오늘의 연애 타로 — 오늘 연애 에너지를 타로카드 한 장으로 즉시 확인하세요.", h1:"오늘 연애 타로 — 오늘의 연애 에너지 메시지", sub:"오늘 연애 에너지를 보여주는 타로카드 즉시 뽑기", emoji:"💝" },
  { slug:"money-tarot", title:"재물 타로 | 점운 타로", desc:"재물 타로카드 — 지금 재물 에너지와 앞으로 돈의 흐름을 타로카드로 분석합니다.", h1:"재물 타로 — 지금 내 재물 에너지 타로 분석", sub:"현재 재물 에너지와 앞으로 돈의 흐름 타로 분석", emoji:"💰" },
  { slug:"career-tarot", title:"직업 타로 | 점운 타로", desc:"직업·커리어 타로카드 — 지금 직업 에너지와 커리어 방향을 타로카드로 분석합니다.", h1:"직업 타로 — 지금 커리어 에너지 타로 분석", sub:"현재 직업 에너지와 커리어 방향 타로카드 분석", emoji:"💼" },
  { slug:"yes-no-tarot", title:"예스노 타로 | 점운 타로", desc:"예스노 타로 — YES or NO 질문에 타로카드가 즉시 답해드립니다. 오행 에너지로 더 정확한 답을 받으세요.", h1:"예스노 타로 — YES or NO 즉시 타로 답변", sub:"YES·NO 질문에 즉시 답하는 오행 타로카드", emoji:"✅" },
  { slug:"tarot-today", title:"오늘의 타로 | 점운 타로", desc:"오늘의 타로카드 — 오늘 하루의 에너지와 주의 포인트를 타로카드 한 장으로 확인하세요.", h1:"오늘의 타로 — 오늘 하루 에너지 타로 메시지", sub:"오늘 하루 에너지와 주의 포인트 타로카드 확인", emoji:"🌟" },
  { slug:"tarot-weekly", title:"이번 주 타로 | 점운 타로", desc:"이번 주 타로카드 — 이번 주 에너지와 주요 포인트를 타로카드로 미리 확인하세요.", h1:"이번 주 타로 — 주간 에너지 타로카드 분석", sub:"이번 주 에너지·주요 포인트 타로카드 미리 확인", emoji:"📅" },
  { slug:"tarot-monthly", title:"이달의 타로 | 점운 타로", desc:"이달의 타로카드 — 이달 에너지와 주요 포인트를 타로카드로 미리 확인하세요.", h1:"이달의 타로 — 월간 에너지 타로카드 분석", sub:"이달 에너지와 주요 포인트 타로카드 미리 확인", emoji:"🗓️" },
  { slug:"tarot-major", title:"메이저 아르카나 | 점운 타로", desc:"메이저 아르카나 22장 완전 해설 — 마법사부터 세계까지 22장의 오행 에너지 의미를 완전히 안내합니다.", h1:"메이저 아르카나 22장 — 오행 에너지 완전 해설", sub:"마법사부터 세계까지 메이저 22장 오행 에너지 의미", emoji:"🌍" },
  { slug:"tarot-minor", title:"마이너 아르카나 | 점운 타로", desc:"마이너 아르카나 56장 해설 — 완드·컵·소드·펜타클 4개 수트와 오행 에너지의 연결을 안내합니다.", h1:"마이너 아르카나 56장 — 4개 수트 오행 연결", sub:"완드·컵·소드·펜타클 4수트와 오행 에너지 연결", emoji:"🃏" },
  { slug:"tarot-wands", title:"완드 카드 | 점운 타로", desc:"완드 수트 타로카드 — 화(火) 오행 에너지를 담은 완드 14장의 의미와 해석을 안내합니다.", h1:"완드 타로카드 — 화 오행 에너지 완드 14장", sub:"화 오행 에너지 완드 수트 14장 의미와 해석", emoji:"🔥" },
  { slug:"tarot-cups", title:"컵 카드 | 점운 타로", desc:"컵 수트 타로카드 — 수(水) 오행 에너지를 담은 컵 14장의 의미와 해석을 안내합니다.", h1:"컵 타로카드 — 수 오행 에너지 컵 14장", sub:"수 오행 에너지 컵 수트 14장 의미와 해석", emoji:"💧" },
  { slug:"tarot-swords", title:"소드 카드 | 점운 타로", desc:"소드 수트 타로카드 — 금(金) 오행 에너지를 담은 소드 14장의 의미와 해석을 안내합니다.", h1:"소드 타로카드 — 금 오행 에너지 소드 14장", sub:"금 오행 에너지 소드 수트 14장 의미와 해석", emoji:"⚔️" },
  { slug:"tarot-pentacles", title:"펜타클 카드 | 점운 타로", desc:"펜타클 수트 타로카드 — 토(土) 오행 에너지를 담은 펜타클 14장의 의미와 해석을 안내합니다.", h1:"펜타클 타로카드 — 토 오행 에너지 펜타클 14장", sub:"토 오행 에너지 펜타클 수트 14장 의미와 해석", emoji:"⭐" },
  { slug:"tarot-fool", title:"바보 카드 | 점운 타로", desc:"타로 바보(0) 카드 — 새로운 시작과 무한한 가능성을 상징하는 바보 카드의 오행 에너지 의미입니다.", h1:"타로 바보 카드 — 새로운 시작의 에너지", sub:"새로운 시작·가능성을 상징하는 바보 카드 오행 의미", emoji:"🌱" },
  { slug:"tarot-magician", title:"마법사 카드 | 점운 타로", desc:"타로 마법사(1) 카드 — 의지력과 목적의식을 상징하는 마법사 카드의 오행 에너지 의미입니다.", h1:"타로 마법사 카드 — 의지력과 목적의 에너지", sub:"의지력·목적의식을 상징하는 마법사 카드 오행 의미", emoji:"🪄" },
  { slug:"tarot-high-priestess", title:"여사제 카드 | 점운 타로", desc:"타로 여사제(2) 카드 — 직관과 내면의 지혜를 상징하는 여사제 카드의 오행 에너지 의미입니다.", h1:"타로 여사제 카드 — 직관과 내면 지혜의 에너지", sub:"직관·내면의 지혜를 상징하는 여사제 카드 오행 의미", emoji:"🌙" },
  { slug:"tarot-empress", title:"여황제 카드 | 점운 타로", desc:"타로 여황제(3) 카드 — 풍요와 창조, 모성을 상징하는 여황제 카드의 오행 에너지 의미입니다.", h1:"타로 여황제 카드 — 풍요와 창조의 에너지", sub:"풍요·창조·모성을 상징하는 여황제 카드 오행 의미", emoji:"👸" },
  { slug:"tarot-emperor", title:"황제 카드 | 점운 타로", desc:"타로 황제(4) 카드 — 권위와 안정, 리더십을 상징하는 황제 카드의 오행 에너지 의미입니다.", h1:"타로 황제 카드 — 권위와 안정의 에너지", sub:"권위·안정·리더십을 상징하는 황제 카드 오행 의미", emoji:"👑" },
  { slug:"tarot-lovers", title:"연인 카드 | 점운 타로", desc:"타로 연인(6) 카드 — 선택과 사랑, 조화를 상징하는 연인 카드의 오행 에너지 의미와 연애 해석입니다.", h1:"타로 연인 카드 — 선택과 사랑의 에너지", sub:"선택·사랑·조화를 상징하는 연인 카드 오행 의미", emoji:"💑" },
  { slug:"tarot-chariot", title:"전차 카드 | 점운 타로", desc:"타로 전차(7) 카드 — 승리와 의지력, 진전을 상징하는 전차 카드의 오행 에너지 의미입니다.", h1:"타로 전차 카드 — 승리와 진전의 에너지", sub:"승리·의지력·진전을 상징하는 전차 카드 오행 의미", emoji:"🏆" },
  { slug:"tarot-strength", title:"힘 카드 | 점운 타로", desc:"타로 힘(8) 카드 — 내면의 강인함과 용기를 상징하는 힘 카드의 오행 에너지 의미입니다.", h1:"타로 힘 카드 — 내면 강인함과 용기의 에너지", sub:"내면의 강인함·용기를 상징하는 힘 카드 오행 의미", emoji:"💪" },
  { slug:"tarot-wheel", title:"운명의 수레바퀴 | 점운 타로", desc:"타로 운명의 수레바퀴(10) 카드 — 변화와 운명, 행운을 상징하는 이 카드의 오행 에너지 의미입니다.", h1:"운명의 수레바퀴 — 변화와 행운의 에너지", sub:"변화·운명·행운을 상징하는 수레바퀴 카드 오행 의미", emoji:"🎡" },
  { slug:"tarot-justice", title:"정의 카드 | 점운 타로", desc:"타로 정의(11) 카드 — 균형과 공정, 진실을 상징하는 정의 카드의 오행 에너지 의미입니다.", h1:"타로 정의 카드 — 균형과 공정의 에너지", sub:"균형·공정·진실을 상징하는 정의 카드 오행 의미", emoji:"⚖️" },
  { slug:"tarot-star", title:"별 카드 | 점운 타로", desc:"타로 별(17) 카드 — 희망과 영감, 회복을 상징하는 별 카드의 오행 에너지 의미입니다.", h1:"타로 별 카드 — 희망과 영감의 에너지", sub:"희망·영감·회복을 상징하는 별 카드 오행 에너지 의미", emoji:"⭐" },
  { slug:"tarot-moon", title:"달 카드 | 점운 타로", desc:"타로 달(18) 카드 — 환상과 직관, 두려움을 상징하는 달 카드의 오행 에너지 의미입니다.", h1:"타로 달 카드 — 직관과 두려움의 에너지", sub:"환상·직관·두려움을 상징하는 달 카드 오행 의미", emoji:"🌙" },
  { slug:"tarot-sun", title:"태양 카드 | 점운 타로", desc:"타로 태양(19) 카드 — 기쁨과 성공, 활력을 상징하는 태양 카드의 오행 에너지 의미입니다.", h1:"타로 태양 카드 — 기쁨과 성공의 에너지", sub:"기쁨·성공·활력을 상징하는 태양 카드 오행 의미", emoji:"☀️" },
  { slug:"tarot-judgement", title:"심판 카드 | 점운 타로", desc:"타로 심판(20) 카드 — 변화와 각성, 새로운 시작을 상징하는 심판 카드의 오행 에너지 의미입니다.", h1:"타로 심판 카드 — 변화와 각성의 에너지", sub:"변화·각성·새로운 시작을 상징하는 심판 카드 의미", emoji:"🎺" },
  { slug:"tarot-world", title:"세계 카드 | 점운 타로", desc:"타로 세계(21) 카드 — 완성과 통합, 성취를 상징하는 세계 카드의 오행 에너지 의미입니다.", h1:"타로 세계 카드 — 완성과 성취의 에너지", sub:"완성·통합·성취를 상징하는 세계 카드 오행 의미", emoji:"🌍" },
  { slug:"tarot-death", title:"죽음 카드 | 점운 타로", desc:"타로 죽음(13) 카드 — 변화와 전환, 끝과 새로운 시작을 상징하는 죽음 카드의 진짜 의미입니다.", h1:"타로 죽음 카드 — 변화와 전환의 에너지", sub:"죽음 카드의 진짜 의미 — 끝이 아닌 새로운 시작", emoji:"🦋" },
  { slug:"tarot-tower", title:"탑 카드 | 점운 타로", desc:"타로 탑(16) 카드 — 갑작스러운 변화와 각성을 상징하는 탑 카드의 오행 에너지 의미입니다.", h1:"타로 탑 카드 — 갑작스러운 변화의 에너지", sub:"갑작스러운 변화·각성을 상징하는 탑 카드 오행 의미", emoji:"⚡" },
  { slug:"tarot-devil", title:"악마 카드 | 점운 타로", desc:"타로 악마(15) 카드 — 속박과 집착, 물질주의를 상징하는 악마 카드의 오행 에너지 의미입니다.", h1:"타로 악마 카드 — 속박과 집착의 에너지", sub:"속박·집착·물질주의를 상징하는 악마 카드 오행 의미", emoji:"😈" },
  { slug:"tarot-hermit", title:"은둔자 카드 | 점운 타로", desc:"타로 은둔자(9) 카드 — 내면 탐구와 고독, 지혜를 상징하는 은둔자 카드의 오행 에너지 의미입니다.", h1:"타로 은둔자 카드 — 내면 탐구의 에너지", sub:"내면 탐구·고독·지혜를 상징하는 은둔자 카드 의미", emoji:"🔦" },
  { slug:"tarot-saju", title:"타로와 사주 | 점운 타로", desc:"타로카드와 사주 오행의 연결 — 두 가지 점술의 차이와 함께 활용해 더 깊은 인사이트를 얻는 방법입니다.", h1:"타로와 사주 — 두 점술의 만남과 활용법", sub:"타로카드와 사주 오행을 결합한 심층 분석법", emoji:"☯️" },
  { slug:"tarot-ohaeng", title:"오행 타로 | 점운 타로", desc:"오행 에너지 타로카드 — 목·화·토·금·수 오행 에너지를 담은 타로카드의 의미와 해석법입니다.", h1:"오행 타로 — 목·화·토·금·수 에너지 타로 해석", sub:"목·화·토·금·수 오행 에너지로 해석하는 타로카드", emoji:"☯️" },
  { slug:"tarot-spread", title:"타로 스프레드 | 점운 타로", desc:"타로 스프레드 완전 가이드 — 원카드, 쓰리카드, 켈틱크로스 등 다양한 타로 스프레드를 안내합니다.", h1:"타로 스프레드 가이드 — 원카드부터 켈틱크로스", sub:"원카드·쓰리카드·켈틱크로스 타로 스프레드 가이드", emoji:"📖" },
  { slug:"tarot-interpretation", title:"타로 해석법 | 점운 타로", desc:"타로카드 해석법 완전 가이드 — 타로카드를 정확하게 해석하는 방법과 오행 에너지 적용법입니다.", h1:"타로 해석법 — 타로카드 정확하게 읽는 방법", sub:"타로카드 정확한 해석법과 오행 에너지 적용 가이드", emoji:"🔍" },
  { slug:"tarot-reversed", title:"역방향 타로 | 점운 타로", desc:"역방향 타로카드 해석 — 역방향(리버스) 타로카드의 의미와 오행 에너지 변형을 분석합니다.", h1:"역방향 타로 — 리버스 카드의 오행 에너지 의미", sub:"역방향(리버스) 타로카드 의미와 오행 에너지 변형", emoji:"🔄" },
  { slug:"tarot-beginner", title:"타로 초보자 가이드 | 점운 타로", desc:"타로카드 초보자 가이드 — 처음 타로를 시작하는 분들을 위한 기초부터 활용까지 완전 가이드입니다.", h1:"타로 초보자 가이드 — 기초부터 활용까지", sub:"타로카드를 처음 시작하는 분들을 위한 완전 가이드", emoji:"🌱" },
  { slug:"tarot-history", title:"타로카드 역사 | 점운 타로", desc:"타로카드의 역사 — 15세기 이탈리아에서 시작된 타로카드의 역사와 오행 동양 철학의 연결을 안내합니다.", h1:"타로카드 역사 — 15세기부터 현재까지", sub:"타로카드 역사와 동양 오행 철학 연결 완전 가이드", emoji:"📜" },
  { slug:"tarot-vs-saju", title:"타로 vs 사주 차이 | 점운 타로", desc:"타로와 사주의 차이 — 서양 타로카드와 동양 사주 오행의 차이점과 각각의 장점을 분석합니다.", h1:"타로 vs 사주 — 서양과 동양 점술의 차이", sub:"타로카드와 사주 오행의 차이점과 각각의 장점 분석", emoji:"⚖️" },
  { slug:"tarot-app", title:"타로 앱 | 점운 타로", desc:"무료 타로 앱 — 점운 타로 앱으로 언제 어디서나 즉시 무료로 타로카드를 뽑고 오행 해석을 받으세요.", h1:"타로 앱 — 즉시 무료 타로카드 오행 해석", sub:"언제 어디서나 즉시 무료 타로카드 뽑기 앱", emoji:"📱" },
  { slug:"tarot-relationship", title:"관계 타로 | 점운 타로", desc:"관계 타로카드 — 지금 중요한 관계(연인/친구/가족/직장)의 에너지를 타로카드로 분석합니다.", h1:"관계 타로 — 지금 중요한 관계 에너지 분석", sub:"연인·친구·가족·직장 관계 에너지 타로 분석", emoji:"🤝" },
  { slug:"tarot-decision", title:"결정 타로 | 점운 타로", desc:"결정 타로카드 — 중요한 결정을 앞두고 있다면 타로카드의 에너지로 방향을 찾아보세요.", h1:"결정 타로 — 중요한 결정의 방향 타로 분석", sub:"중요한 결정 앞에서 방향을 찾는 타로카드 분석", emoji:"🎯" },
  { slug:"tarot-healing", title:"힐링 타로 | 점운 타로", desc:"힐링 타로카드 — 지치고 힘든 마음을 치유하는 타로카드 메시지를 즉시 받아보세요.", h1:"힐링 타로 — 지친 마음을 치유하는 타로 메시지", sub:"지치고 힘든 마음을 위한 오행 힐링 타로 메시지", emoji:"🌿" },
  { slug:"tarot-morning", title:"아침 타로 | 점운 타로", desc:"아침에 뽑는 타로카드 — 하루를 시작하기 전 타로카드 한 장으로 오늘의 에너지를 확인하세요.", h1:"아침 타로 — 하루 시작 전 에너지 확인 타로", sub:"하루 시작 전 타로카드 한 장으로 오늘 에너지 확인", emoji:"🌅" },
  { slug:"tarot-night", title:"밤 타로 | 점운 타로", desc:"밤에 뽑는 타로카드 — 하루를 마무리하며 타로카드 한 장으로 오늘의 에너지를 정리하세요.", h1:"밤 타로 — 하루 마무리 에너지 정리 타로", sub:"하루 마무리 타로카드 한 장으로 오늘 에너지 정리", emoji:"🌙" },
  { slug:"tarot-mbti", title:"타로와 MBTI | 점운 타로", desc:"타로카드와 MBTI 연결 — MBTI 16유형과 타로카드의 관계, 오행 기질을 함께 분석합니다.", h1:"타로와 MBTI — 성격 유형과 타로의 연결", sub:"MBTI 16유형·타로카드·오행 기질 통합 분석", emoji:"🧠" },
  { slug:"tarot-zodiac", title:"타로와 별자리 | 점운 타로", desc:"타로카드와 별자리 연결 — 12별자리와 타로카드, 오행 에너지를 결합한 통합 분석입니다.", h1:"타로와 별자리 — 12별자리와 타로의 만남", sub:"12별자리·타로카드·오행 에너지 통합 분석", emoji:"⭐" },
  { slug:"tarot-saju-combined", title:"타로+사주 통합 분석 | 점운 타로", desc:"타로카드+사주 오행 통합 분석 — 두 점술을 함께 활용해 더 정확한 인사이트를 얻는 방법입니다.", h1:"타로+사주 통합 — 두 점술의 시너지 분석", sub:"타로카드와 사주 오행 통합 활용 시너지 분석법", emoji:"✨" },
  { slug:"tarot-celtic-cross", title:"켈틱크로스 타로 | 점운 타로", desc:"켈틱크로스 타로 스프레드 — 10장 카드로 상황을 깊이 분석하는 켈틱크로스 완전 가이드입니다.", h1:"켈틱크로스 타로 — 10장으로 보는 심층 분석", sub:"10장 카드 켈틱크로스 타로 스프레드 완전 가이드", emoji:"✝️" },
  { slug:"tarot-horse-shoe", title:"말발굽 타로 | 점운 타로", desc:"말발굽 타로 스프레드 — 7장 카드로 상황의 과거·현재·미래를 분석하는 말발굽 스프레드 가이드입니다.", h1:"말발굽 타로 — 7장으로 보는 과거·현재·미래", sub:"7장 말발굽 타로 스프레드 완전 가이드", emoji:"🐎" },
  { slug:"tarot-love-spread", title:"연애 타로 스프레드 | 점운 타로", desc:"연애 타로 스프레드 — 연인 관계를 깊이 분석하는 다양한 타로 스프레드 가이드입니다.", h1:"연애 타로 스프레드 — 관계 심층 분석 스프레드", sub:"연인 관계를 깊이 분석하는 타로 스프레드 완전 가이드", emoji:"💕" },
  { slug:"tarot-career-spread", title:"직업 타로 스프레드 | 점운 타로", desc:"직업·커리어 타로 스프레드 — 커리어 방향을 분석하는 다양한 타로 스프레드 가이드입니다.", h1:"직업 타로 스프레드 — 커리어 분석 스프레드", sub:"직업·커리어 방향을 분석하는 타로 스프레드 가이드", emoji:"💼" },
  { slug:"tarot-money-spread", title:"재물 타로 스프레드 | 점운 타로", desc:"재물 타로 스프레드 — 재물 에너지와 돈의 흐름을 분석하는 타로 스프레드 가이드입니다.", h1:"재물 타로 스프레드 — 재물 에너지 분석 스프레드", sub:"재물 에너지와 돈의 흐름 분석 타로 스프레드 가이드", emoji:"💰" },
  { slug:"tarot-confirm", title:"타로 확인 질문 | 점운 타로", desc:"타로카드 확인 질문법 — 타로카드를 더 정확하게 읽기 위한 질문 방법과 해석 기법을 안내합니다.", h1:"타로 확인 질문 — 더 정확하게 읽는 질문법", sub:"타로카드를 더 정확하게 읽는 질문법·해석 기법", emoji:"❓" },
  { slug:"tarot-intuition", title:"타로 직관 | 점운 타로", desc:"타로 직관 계발법 — 타로카드를 읽을 때 직관을 활용하는 방법과 오행 기질별 직관 특성을 안내합니다.", h1:"타로 직관 계발 — 오행 기질별 직관 활용법", sub:"오행 기질별 타로 직관 계발법과 활용 방법", emoji:"💡" },
  { slug:"tarot-online-free", title:"온라인 무료 타로 | 점운 타로", desc:"온라인 무료 타로카드 — 온라인에서 회원가입 없이 즉시 무료로 타로카드를 뽑고 해석을 받으세요.", h1:"온라인 무료 타로 — 가입 없이 즉시 무료 뽑기", sub:"온라인에서 회원가입 없이 즉시 무료 타로카드 뽑기", emoji:"🌐" },
  { slug:"tarot-korean", title:"한국 타로 | 점운 타로", desc:"한국식 타로카드 — 한국 문화와 오행 철학을 결합한 한국식 타로카드의 특성과 해석법입니다.", h1:"한국 타로 — 오행 철학과 결합한 한국식 타로", sub:"한국 문화·오행 철학을 결합한 한국식 타로 해석법", emoji:"🇰🇷" },
  { slug:"tarot-2025", title:"2025년 타로 | 점운 타로", desc:"2025년 타로카드 운세 — 을사년 뱀의 해 오행 에너지와 타로카드로 보는 2025년 운세를 분석합니다.", h1:"2025년 타로 운세 — 을사년 뱀의 해 타로 분석", sub:"을사년 오행 에너지와 타로카드로 보는 2025 운세", emoji:"🐍" },
  { slug:"tarot-2026", title:"2026년 타로 | 점운 타로", desc:"2026년 타로카드 운세 — 병오년 말의 해 오행 에너지와 타로카드로 보는 2026년 운세를 분석합니다.", h1:"2026년 타로 운세 — 병오년 말의 해 타로 분석", sub:"병오년 오행 에너지와 타로카드로 보는 2026 운세", emoji:"🐴" },
  { slug:"tarot-birth-card", title:"탄생 타로카드 | 점운 타로", desc:"탄생 타로카드 — 내 생년월일로 계산한 나를 대표하는 타로카드와 오행 기질의 연결을 분석합니다.", h1:"탄생 타로카드 — 생년월일로 보는 나의 타로 카드", sub:"생년월일로 계산한 나를 대표하는 타로카드 분석", emoji:"🎂" },
  { slug:"tarot-soulmate", title:"소울메이트 타로 | 점운 타로", desc:"소울메이트 타로카드 — 나의 소울메이트와의 연결을 타로카드와 오행 에너지로 분석합니다.", h1:"소울메이트 타로 — 나의 소울메이트와의 연결 분석", sub:"소울메이트와의 오행 연결과 타로카드 에너지 분석", emoji:"💫" },
  { slug:"tarot-ex", title:"전 연인 타로 | 점운 타로", desc:"전 연인과의 타로카드 — 전 연인과의 관계 에너지, 재결합 가능성을 타로카드로 분석합니다.", h1:"전 연인 타로 — 전 연인과의 관계 에너지 분석", sub:"전 연인과의 관계 에너지와 재결합 가능성 타로 분석", emoji:"💔" },
  { slug:"tarot-marriage", title:"결혼 타로 | 점운 타로", desc:"결혼 타로카드 — 결혼 시기, 결혼 상대, 결혼 후 관계를 타로카드와 오행으로 분석합니다.", h1:"결혼 타로 — 결혼 시기와 상대 타로 분석", sub:"결혼 시기·결혼 상대·결혼 후 관계 타로·오행 분석", emoji:"💍" },
  { slug:"tarot-pregnancy", title:"임신 타로 | 점운 타로", desc:"임신·출산 타로카드 — 임신 가능성과 출산 시기를 타로카드와 오행 에너지로 분석합니다.", h1:"임신 타로 — 임신 가능성과 출산 시기 타로 분석", sub:"임신 가능성·출산 시기 타로카드·오행 에너지 분석", emoji:"👶" },
  { slug:"tarot-health", title:"건강 타로 | 점운 타로", desc:"건강 타로카드 — 지금 건강 에너지와 주의해야 할 건강 부위를 타로카드와 오행으로 분석합니다.", h1:"건강 타로 — 현재 건강 에너지 타로 분석", sub:"현재 건강 에너지와 주의 부위 타로·오행 분석", emoji:"❤️" },
  { slug:"tarot-work", title:"직장 타로 | 점운 타로", desc:"직장 타로카드 — 현재 직장 에너지, 직장 내 관계, 커리어 방향을 타로카드로 분석합니다.", h1:"직장 타로 — 현재 직장 에너지 타로 분석", sub:"직장 에너지·직장 내 관계·커리어 방향 타로 분석", emoji:"🏢" },
  { slug:"tarot-business", title:"사업 타로 | 점운 타로", desc:"사업 타로카드 — 지금 사업 에너지, 사업 시작 시기, 사업 파트너를 타로카드로 분석합니다.", h1:"사업 타로 — 사업 에너지와 시기 타로 분석", sub:"사업 에너지·시작 시기·파트너 타로카드 분석", emoji:"📊" },
  { slug:"tarot-study", title:"공부 타로 | 점운 타로", desc:"공부·시험 타로카드 — 지금 공부 에너지와 시험 결과를 타로카드와 오행으로 분석합니다.", h1:"공부 타로 — 공부 에너지와 시험 결과 타로 분석", sub:"현재 공부 에너지와 시험 결과 타로·오행 분석", emoji:"📚" },
  { slug:"tarot-move", title:"이사 타로 | 점운 타로", desc:"이사·이동 타로카드 — 이사 시기와 방향, 새 집 에너지를 타로카드와 오행으로 분석합니다.", h1:"이사 타로 — 이사 시기와 방향 타로 분석", sub:"이사 시기·방향·새 집 에너지 타로·오행 분석", emoji:"🏠" },
  { slug:"tarot-travel", title:"여행 타로 | 점운 타로", desc:"여행 타로카드 — 여행 시기, 여행지, 여행의 에너지를 타로카드와 오행으로 분석합니다.", h1:"여행 타로 — 여행 시기와 에너지 타로 분석", sub:"여행 시기·여행지·여행 에너지 타로·오행 분석", emoji:"✈️" },
  { slug:"tarot-meaning", title:"타로카드 의미 | 점운 타로", desc:"타로카드 78장 의미 완전 정리 — 메이저 22장, 마이너 56장 타로카드 의미를 오행과 함께 정리합니다.", h1:"타로카드 78장 의미 — 오행과 함께 완전 정리", sub:"메이저 22장·마이너 56장 타로카드 의미 오행 정리", emoji:"📖" },
  { slug:"tarot-combination", title:"타로 카드 조합 | 점운 타로", desc:"타로카드 조합 해석법 — 여러 장의 타로카드가 함께 나왔을 때 조합 해석하는 방법을 안내합니다.", h1:"타로 카드 조합 해석 — 여러 장 함께 읽는 법", sub:"여러 장의 타로카드를 조합해 해석하는 완전 가이드", emoji:"🧩" },
  { slug:"tarot-summary", title:"타로 완전 정리 | 점운 타로", desc:"타로카드 완전 정리 — 78장 의미, 스프레드, 오행 연결, 활용법의 완전한 가이드입니다.", h1:"타로 완전 정리 — 78장·스프레드·오행 완전 가이드", sub:"타로카드 78장·스프레드·오행 연결 완전 정리 가이드", emoji:"📖" },
  { slug:"tarot-reversed", title:"역방향 타로 | 점운 타로", desc:"역방향 타로카드 해석 — 타로카드가 거꾸로 나왔을 때(역방향)의 의미와 오행 에너지 해석법입니다.", h1:"역방향 타로 해석 — 거꾸로 나온 카드의 오행 의미", sub:"타로카드 역방향(역위치) 의미와 오행 에너지 해석법", emoji:"🔄" },
  { slug:"tarot-celtic-cross", title:"켈틱크로스 타로 | 점운 타로", desc:"켈틱크로스 타로 스프레드 — 10장 배열의 켈틱크로스 스프레드 해석법과 오행 연결을 안내합니다.", h1:"켈틱크로스 타로 — 10장 배열 스프레드 해석법", sub:"10장 켈틱크로스 타로 스프레드 배열·해석·오행 연결", emoji:"✝️" },
  { slug:"tarot-yes-no", title:"YES NO 타로 | 점운 타로", desc:"YES·NO 타로 — 한 가지 질문에 즉각적으로 YES 또는 NO로 답하는 타로 리딩 방법입니다.", h1:"YES NO 타로 — 한 질문 즉답 타로 리딩 방법", sub:"한 가지 질문에 YES 또는 NO로 즉답하는 타로 리딩", emoji:"✅" },
  { slug:"tarot-3card", title:"3장 타로 스프레드 | 점운 타로", desc:"3장 타로 스프레드 — 과거·현재·미래를 3장 카드로 읽는 가장 기본적인 타로 스프레드입니다.", h1:"3장 타로 스프레드 — 과거·현재·미래 3카드 리딩", sub:"과거·현재·미래를 3장 카드로 읽는 기본 타로 스프레드", emoji:"🃏" },
  { slug:"tarot-zodiac-spread", title:"별자리 타로 스프레드 | 점운 타로", desc:"별자리 타로 스프레드 — 12개 포지션이 12별자리에 대응하는 연간 운세 타로 스프레드입니다.", h1:"별자리 타로 스프레드 — 12별자리 연간 타로 리딩", sub:"12별자리 대응 12포지션 연간 운세 타로 스프레드", emoji:"⭐" },
  { slug:"tarot-chakra-spread", title:"차크라 타로 | 점운 타로", desc:"차크라 타로 스프레드 — 7개 차크라에 대응하는 타로 카드 배열로 에너지 흐름을 분석합니다.", h1:"차크라 타로 — 7차크라 에너지 타로 분석", sub:"7차크라에 대응하는 타로 카드 배열 에너지 분석", emoji:"🌈" },
  { slug:"tarot-wands-detailed", title:"완즈 세부 카드 | 점운 타로", desc:"완즈(Wands) 마이너 아르카나 세부 카드 해석 — Ace부터 10, 인물 카드까지 전체 의미와 화(火) 오행 연결.", h1:"완즈 세부 카드 — Ace~10·인물 카드 화 오행 의미", sub:"완즈 Ace~10·기사·여왕·왕 카드 화 오행 연결 해석", emoji:"🪄" },
  { slug:"tarot-cups-detailed", title:"컵스 세부 카드 | 점운 타로", desc:"컵스(Cups) 마이너 아르카나 세부 카드 해석 — Ace부터 10, 인물 카드까지 전체 의미와 수(水) 오행 연결.", h1:"컵스 세부 카드 — Ace~10·인물 카드 수 오행 의미", sub:"컵스 Ace~10·기사·여왕·왕 카드 수 오행 연결 해석", emoji:"🏆" },
  { slug:"tarot-swords-detailed", title:"소드 세부 카드 | 점운 타로", desc:"소드(Swords) 마이너 아르카나 세부 카드 해석 — Ace부터 10, 인물 카드까지 전체와 금(金) 오행 연결.", h1:"소드 세부 카드 — Ace~10·인물 카드 금 오행 의미", sub:"소드 Ace~10·기사·여왕·왕 카드 금 오행 연결 해석", emoji:"⚔️" },
  { slug:"tarot-pentacles-detailed", title:"펜타클 세부 카드 | 점운 타로", desc:"펜타클(Pentacles) 마이너 아르카나 세부 카드 해석 — Ace부터 10, 인물 카드까지 토(土) 오행 연결.", h1:"펜타클 세부 카드 — Ace~10·인물 카드 토 오행 의미", sub:"펜타클 Ace~10·기사·여왕·왕 카드 토 오행 연결", emoji:"⭐" },
  { slug:"tarot-meditation", title:"타로 명상 | 점운 타로", desc:"타로카드 명상 활용법 — 특정 타로카드의 오행 에너지로 명상하고 마음을 정화하는 방법입니다.", h1:"타로 명상 — 오행 에너지 타로카드 명상법", sub:"타로카드 오행 에너지를 활용한 마음 정화 명상법", emoji:"🧘" },
  { slug:"tarot-dream", title:"꿈 타로 해석 | 점운 타로", desc:"꿈에 나온 타로 — 꿈에서 타로카드나 숫자·상징이 나왔을 때 오행 에너지와 결합해 해석합니다.", h1:"꿈 타로 해석 — 꿈 속 타로 상징과 오행 의미", sub:"꿈에 나온 타로카드·숫자·상징의 오행 에너지 해석", emoji:"💭" },
  { slug:"tarot-self-reading", title:"혼자 하는 타로 | 점운 타로", desc:"혼자 하는 타로 리딩 — 처음 시작하는 분들을 위한 자기 자신을 위한 타로 리딩 방법입니다.", h1:"혼자 하는 타로 리딩 — 셀프 타로 시작 완전 가이드", sub:"처음 타로를 시작하는 분들을 위한 셀프 타로 가이드", emoji:"🃏" },
  { slug:"tarot-beginner", title:"타로 입문자 가이드 | 점운 타로", desc:"타로 입문자 완전 가이드 — 타로를 처음 접하는 분들을 위한 기초 개념과 카드 선택법입니다.", h1:"타로 입문자 가이드 — 기초 개념과 카드 선택법", sub:"타로를 처음 접하는 입문자를 위한 완전 기초 가이드", emoji:"📚" },
  { slug:"tarot-deck-choice", title:"타로 덱 선택법 | 점운 타로", desc:"타로 덱 선택법 — 오행 기질에 맞는 타로 덱 스타일과 초보자·중급자·숙련자 추천 덱을 안내합니다.", h1:"타로 덱 선택법 — 오행 기질에 맞는 덱 고르기", sub:"오행 기질과 수준별 맞춤 타로 덱 선택 완전 가이드", emoji:"🎴" },
  { slug:"tarot-cleansing", title:"타로 카드 정화 | 점운 타로", desc:"타로카드 정화 방법 — 오행 에너지로 타로카드의 기운을 정화하고 리딩 정확도를 높이는 방법입니다.", h1:"타로카드 정화 — 오행 에너지 카드 기운 정화법", sub:"오행 에너지를 활용한 타로카드 기운 정화 방법", emoji:"🌙" },
  { slug:"tarot-daily-card", title:"오늘의 타로 카드 | 점운 타로", desc:"오늘의 타로 카드 리딩 — 매일 아침 한 장 뽑는 데일리 타로와 오행 에너지 결합 해석법입니다.", h1:"오늘의 타로 카드 — 매일 한 장 데일리 타로 리딩", sub:"매일 아침 한 장 뽑는 데일리 타로와 오행 에너지", emoji:"🌅" },
  { slug:"tarot-question-method", title:"타로 질문 방법 | 점운 타로", desc:"타로 질문 방법 — 타로 리딩에서 좋은 결과를 얻기 위한 올바른 질문 방법과 주의사항입니다.", h1:"타로 질문 방법 — 정확한 리딩을 위한 질문법", sub:"타로 리딩에서 좋은 결과 얻기 위한 올바른 질문법", emoji:"❓" },
  { slug:"tarot-history", title:"타로카드 역사 | 점운 타로", desc:"타로카드 역사 — 14세기 이탈리아에서 시작된 타로카드의 역사와 오행 사주와의 연결점을 탐구합니다.", h1:"타로카드 역사 — 14세기 이탈리아부터 오행 연결까지", sub:"타로카드의 역사적 기원과 동양 오행 사주와의 연결", emoji:"📜" },
  { slug:"tarot-ohaeng-connection", title:"타로와 오행 연결 | 점운 타로", desc:"타로카드와 오행의 연결 — 서양 타로카드의 4원소와 동양 오행의 연결점과 통합 해석법입니다.", h1:"타로와 오행 연결 — 4원소·5오행 통합 해석", sub:"서양 타로 4원소와 동양 오행 5기질의 통합 연결 해석", emoji:"☯️" },
  { slug:"tarot-free-reading", title:"무료 타로 뽑기 | 점운 타로", desc:"무료 타로카드 뽑기 — 오행 기질 기반 무료 타로카드를 즉시 뽑고 오늘의 에너지를 확인하세요.", h1:"무료 타로 뽑기 — 오행 기반 오늘의 타로카드", sub:"오행 기질 기반 무료 타로카드 즉시 뽑기·오늘 에너지", emoji:"🎴" },
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
    keywords: ["타로카드", "무료타로", "타로운세", "오행타로", "점운타로", "타로뽑기"],
    openGraph: { title: d.title, description: d.desc, url: `https://jeomun.com/tarot/guide/${d.slug}` },
  };
}

export default async function TarotSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DATA.find((x) => x.slug === slug) ?? DATA[0];

  const features = [
    { icon: "🃏", title: "오행 타로카드 뽑기", desc: "오행 에너지와 결합한 타로카드로 지금 이 순간 필요한 메시지를 즉시 무료로 받아보세요." },
    { icon: "☯️", title: "사주 오행 연결", desc: "서양 타로카드와 동양 사주 오행을 결합해 더 정확하고 깊은 인사이트를 제공합니다." },
    { icon: "❓", title: "예스노 즉시 답변", desc: "YES or NO 질문에 타로카드가 즉시 답해드립니다. 오행 에너지로 더 정확한 답을 받으세요." },
    { icon: "🔮", title: "78장 완전 해설", desc: "메이저 22장, 마이너 56장 타로카드의 오행 에너지 의미를 완전히 안내합니다." },
  ];

  const faqs = [
    { q: "타로카드가 정확한가요?", a: "타로카드는 현재 에너지와 잠재의식을 시각화하는 도구입니다. 오행 에너지와 결합해 더 다양한 관점에서 상황을 볼 수 있습니다." },
    { q: "완전 무료인가요?", a: "네, 완전 무료입니다. 회원가입 없이 즉시 타로카드를 뽑고 오행 에너지 해석을 받을 수 있습니다." },
    { q: "타로와 사주는 어떻게 다른가요?", a: "타로는 서양의 직관 기반 점술이고 사주는 동양의 철학 기반 운명 분석입니다. 점운은 두 가지를 결합해 더 깊은 분석을 제공합니다." },
    { q: "몇 번이나 뽑을 수 있나요?", a: "무제한으로 뽑을 수 있습니다. 다시 뽑기 버튼으로 새로운 카드 에너지를 언제든 확인하세요." },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f0020 0%,#1a0040 50%,#0f0020 100%)", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", color: "#f5f5f5", wordBreak: "keep-all" as const }}>
      <section style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>{d.emoji}</div>
        <h1 style={{ fontSize: "clamp(22px,5vw,30px)", fontWeight: 900, lineHeight: 1.3, margin: "0 0 14px", background: "linear-gradient(135deg,#c084fc,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{d.h1}</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 28px" }}>{d.sub}</p>
        <Link href="/tarot" style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#be185d)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 32px", borderRadius: 30, textDecoration: "none", boxShadow: "0 8px 32px rgba(124,58,237,0.4)" }}>
          지금 타로카드 뽑기 →
        </Link>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>회원가입 없이 즉시 무료 · 오행 에너지 해석 포함</p>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 40px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, textAlign: "center", marginBottom: 20, color: "white" }}>점운 타로가 특별한 이유</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(192,132,252,0.2)", borderRadius: 16, padding: "18px 14px" }}>
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
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,132,252,0.15)", borderRadius: 14, padding: "16px 16px" }}>
              <p style={{ fontSize: 13, fontWeight: 900, color: "#c084fc", margin: "0 0 8px" }}>Q. {f.q}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: 0 }}>A. {f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px 60px", textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#1e0040,#0f0020)", border: "1px solid rgba(192,132,252,0.3)", borderRadius: 24, padding: "32px 24px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🃏</div>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: "white", margin: "0 0 10px" }}>지금 타로카드 뽑기</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 22px" }}>지금 내 마음의 질문에 오행 타로카드가 답해드려요. 회원가입 없이 즉시 무료로 뽑아보세요</p>
          <Link href="/tarot" style={{ display: "inline-block", background: "linear-gradient(135deg,#7c3aed,#be185d)", color: "white", fontWeight: 900, fontSize: 16, padding: "15px 36px", borderRadius: 30, textDecoration: "none" }}>
            무료 타로카드 뽑기 →
          </Link>
        </div>
        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" as const }}>
          <Link href="/tarot" style={{ color: "#c084fc", fontSize: 13, textDecoration: "none" }}>← 타로 홈</Link>
          <Link href="/main-v2" style={{ color: "#c084fc", fontSize: 13, textDecoration: "none" }}>사주 보기</Link>
          <Link href="/gunghap" style={{ color: "#c084fc", fontSize: 13, textDecoration: "none" }}>궁합 보기</Link>
        </div>
      </section>
    </main>
  );
}
