"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FOODS, OH_DIET, getOhFromYear, type Food } from "@/lib/foodDb";
import { postWithRetry } from "@/lib/postWithRetry";

type Meal = { id: string; name: string; cal: number; unit: string; time: string };
type DayLog = { meals: Meal[]; totalCal: number; updatedAt?: number; weight?: number };
type Tab = "today" | "search" | "premium" | "history";
type Season = "봄" | "여름" | "가을" | "겨울";
type PremiumSub = "avoid" | "exercise" | "seasonal" | "report";

const OH_AVOID: Record<string, { name: string; reason: string }[]> = {
  목: [
    { name: "삼겹살·베이컨", reason: "과도한 동물성 지방이 목 체질 간에 부담" },
    { name: "튀김·치킨(기름)", reason: "기름 과다로 체내 열 축적" },
    { name: "라면·인스턴트", reason: "나트륨이 목 체질 간 해독에 부담" },
    { name: "소주·맥주·와인", reason: "목 체질 약점인 간에 직접적 타격" },
    { name: "가공육(햄·소시지)", reason: "방부제가 간 기능 저하" },
    { name: "버터·마가린", reason: "트랜스지방이 목 체질 혈액순환 방해" },
    { name: "갈비·차돌박이", reason: "지방 과다로 간 부담 증가" },
    { name: "에너지드링크", reason: "카페인+당분이 목 체질 신경계 자극" },
    { name: "콜라·사이다", reason: "당분+산성이 목 체질 소화기 자극" },
    { name: "과자·스낵류", reason: "정제 탄수화물이 목 체질 혈당 급등" },
    { name: "크림파스타·리조또", reason: "크림+밀가루 조합이 간에 이중 부담" },
    { name: "아이스크림·케이크", reason: "설탕+지방 콤보가 목 체질 혈당 불안정" },
    { name: "전·부침개", reason: "기름에 지지는 조리가 목 체질 간에 부담" },
    { name: "밀가루 과다(빵류)", reason: "글루텐이 목 체질 장 기능 약화" },
  ],
  화: [
    { name: "짠 음식·젓갈", reason: "나트륨 과다로 화 체질 심장에 부담" },
    { name: "커피·에너지드링크", reason: "카페인이 화 체질 심박수 불안정" },
    { name: "삼겹살·기름진 고기", reason: "포화지방이 화 체질 혈관에 영향" },
    { name: "라면·고나트륨 국물", reason: "고나트륨이 화 체질 혈압 상승" },
    { name: "인스턴트·패스트푸드", reason: "복합 첨가물이 화 체질 심장 부담" },
    { name: "알코올(모든 종류)", reason: "화 체질 심장 리듬 불안정" },
    { name: "과자·단 간식 과다", reason: "혈당 급등이 화 체질 심혈관에 무리" },
    { name: "버터·크림류", reason: "포화지방이 화 체질 혈관 막힘 위험" },
    { name: "매운 음식 과다", reason: "화 체질 열에 더 열을 더하는 악순환" },
    { name: "훈제·소금 절인 음식", reason: "과다 나트륨이 화 체질 신장 부담" },
    { name: "탄산음료", reason: "당분+가스가 화 체질 소장 자극" },
    { name: "야식·과식", reason: "화 체질 심장이 수면 중 쉬지 못함" },
    { name: "설탕 과다(케이크 등)", reason: "화 체질 혈당 급등락으로 심장 부담" },
    { name: "고카페인 차 과다", reason: "화 체질 각성 상태 유지로 수면 방해" },
  ],
  토: [
    { name: "밀가루 과다(빵·파스타)", reason: "토 체질 소화기에 과부하" },
    { name: "찬 음식·아이스크림", reason: "토 체질 위를 차갑게 해 소화력 저하" },
    { name: "과식·폭식", reason: "토 체질 비위가 가장 취약, 소화기 과부하" },
    { name: "생것·날것 과다", reason: "토 체질 위에 소화 부담 가중" },
    { name: "튀김·기름진 음식", reason: "토 체질 비장 기능 저하" },
    { name: "커피·카페인", reason: "토 체질 위산 과다 분비 유발" },
    { name: "술+안주 조합", reason: "토 체질 위장 점막 손상" },
    { name: "청량음료·주스", reason: "산성+당분이 토 체질 위산에 자극" },
    { name: "야식", reason: "토 체질 위장이 야간에 소화 못해 더부룩함" },
    { name: "인스턴트·가공식품", reason: "토 체질 장내 환경 파괴" },
    { name: "달콤한 간식 과다", reason: "토 체질 혈당 불안정 + 비장 과부하" },
    { name: "유제품 과다", reason: "토 체질에 따라 유당불내증 위험" },
    { name: "매운 음식 과다", reason: "토 체질 위 점막 손상" },
    { name: "스트레스 상태 식사", reason: "토 체질은 정서와 소화 연결, 긴장 시 소화 불량" },
  ],
  금: [
    { name: "찬 음식·냉음식", reason: "금 체질 폐·기관지 차게 해 호흡기 약화" },
    { name: "유제품 과다(우유·치즈)", reason: "금 체질 담 생성, 폐 기능 저하" },
    { name: "인스턴트·가공식품", reason: "금 체질 대장 환경 파괴" },
    { name: "밀가루 과다", reason: "금 체질 장내 환경에 부담" },
    { name: "알코올", reason: "금 체질 폐+간 동시 약화" },
    { name: "설탕 과다", reason: "금 체질 면역력 저하로 이어짐" },
    { name: "기름진 음식 과다", reason: "금 체질 폐 점막에 영향" },
    { name: "자극적 향신료 과다", reason: "금 체질 기관지 자극" },
    { name: "라면·인스턴트 국물", reason: "나트륨이 금 체질 폐 부담" },
    { name: "에너지드링크·고카페인", reason: "금 체질 폐+심장 동시 자극" },
    { name: "탄산음료", reason: "금 체질 위산 역류로 식도·기관지 자극" },
    { name: "훈제·구운 고기", reason: "탄화물이 금 체질 폐에 영향" },
    { name: "삼겹살·기름진 육류", reason: "기름 과다로 금 체질 대장 부담" },
    { name: "야식+야간 과식", reason: "금 체질 대장 리듬 파괴" },
  ],
  수: [
    { name: "짠 음식(젓갈·간장 과다)", reason: "수 체질 신장이 나트륨 과부하로 손상" },
    { name: "찬 음식·냉음식", reason: "수 체질 신장·방광 냉기로 기능 저하" },
    { name: "알코올", reason: "수 체질 신장에 직접적 부담" },
    { name: "에너지드링크·카페인 과다", reason: "수 체질 신장에 이뇨 과부하" },
    { name: "인스턴트·가공식품", reason: "첨가물이 수 체질 신장 필터 부담" },
    { name: "외식·배달 고나트륨", reason: "수 체질 신장에 지속적 부담" },
    { name: "생것 과다(날채소·회 과다)", reason: "수 체질 장에 냉기 유발" },
    { name: "설탕 과다", reason: "수 체질 혈당 불안정으로 신장 손상" },
    { name: "밀가루 과다", reason: "수 체질 부종·소화 불량 유발" },
    { name: "튀김·기름진 음식", reason: "수 체질 신장+담낭 동시 부담" },
    { name: "탄산음료", reason: "수 체질 신장에 산성 부담" },
    { name: "커피 과다", reason: "수 체질 신장 과로+불면 유발" },
    { name: "절인 음식(피클·장아찌 과다)", reason: "수 체질 나트륨 극도 과다" },
    { name: "라면·인스턴트 국물", reason: "수 체질 신장이 나트륨 처리에 과부하" },
  ],
};

const OH_EXERCISE: Record<string, {
  best: { name: string; time: string; effect: string }[];
  tip: string;
  avoid: string;
}> = {
  목: {
    best: [
      { name: "🧘 요가·필라테스", time: "30~45분/일", effect: "유연성 향상, 스트레스 해소, 목 체질 간 기능 활성화" },
      { name: "🏃 가벼운 조깅", time: "20~30분/일", effect: "혈액순환 촉진, 목 체질 간 독소 배출" },
      { name: "🏊 수영", time: "30~40분/일", effect: "전신 균형 운동, 목 체질 관절 보호" },
      { name: "🚲 자전거", time: "30~45분/일", effect: "하체 근력, 목 체질 기 순환 개선" },
      { name: "🥾 등산·트레킹", time: "1~2시간/주말", effect: "목 체질 기 에너지 충전, 자연 치유력 강화" },
      { name: "💃 댄스·에어로빅", time: "30분/일", effect: "목 체질 에너지 발산, 스트레스 해소" },
      { name: "🧗 스트레칭", time: "10~15분/아침저녁", effect: "목 체질 근막 이완, 기 흐름 원활화" },
      { name: "🌳 맨몸 산책", time: "30분/일", effect: "목 체질 심신 안정, 자연광 흡수" },
    ],
    tip: "새벽 5~7시 운동이 목 체질에 최적. 공복 유산소로 지방 연소 효과 극대화!",
    avoid: "격렬한 고강도 인터벌(HIIT) — 목 체질 간에 무리, 회복이 느림",
  },
  화: {
    best: [
      { name: "🚶 파워워킹", time: "30~40분/일", effect: "화 체질 심장 부담 없는 유산소, 혈액순환 개선" },
      { name: "🏊 가벼운 수영", time: "30분/일", effect: "화 체질 체온 조절, 심장 부담 최소" },
      { name: "🧘 명상 요가", time: "20~30분/일", effect: "화 체질 열 과잉 진정, 마음 안정" },
      { name: "🚲 저강도 사이클", time: "30분/일", effect: "화 체질 심박 안정권 유지" },
      { name: "☯️ 태극권·기공", time: "20~30분/일", effect: "화 체질 기 균형, 심장 무리 없음" },
      { name: "🤸 스트레칭", time: "15분/아침저녁", effect: "화 체질 긴장 해소, 혈액순환 촉진" },
      { name: "🌊 아쿠아로빅", time: "30분/회", effect: "화 체질 물속에서 관절 보호 + 체온 조절" },
      { name: "🌿 산책", time: "30분/일", effect: "화 체질 급격한 자극 없이 기 순환" },
    ],
    tip: "오전 9~11시가 화 체질 운동 최적 시간. 수분 충분히 섭취하며 무리하지 말 것!",
    avoid: "폭발적 고강도 운동·고온 환경 운동 — 화 체질 심장에 과부하, 열사병 위험",
  },
  토: {
    best: [
      { name: "🚶 파워워킹", time: "40~50분/일", effect: "토 체질 소화 촉진, 하체 근력 강화" },
      { name: "🏋️ 근력운동", time: "30~40분/3회/주", effect: "토 체질 지구력 기반 근육 강화" },
      { name: "🏸 배드민턴", time: "30~40분/회", effect: "토 체질 민첩성, 사교 활동 병행" },
      { name: "⬆️ 계단 오르기", time: "10~15분/일", effect: "토 체질 하체 강화, 심폐 기능 개선" },
      { name: "🏀 농구·구기 스포츠", time: "30분/회", effect: "토 체질 협동 + 유산소 + 근력 복합" },
      { name: "🚲 자전거", time: "30분/일", effect: "토 체질 하체 강화, 무릎 보호" },
      { name: "🧗 스쿼트·런지", time: "15~20분/일", effect: "토 체질 하체 근력 핵심, 대사 활성화" },
      { name: "🏊 수영", time: "30분/회", effect: "토 체질 전신 균형, 관절 부담 없음" },
    ],
    tip: "식후 30분 후 운동이 토 체질에 최적. 꾸준함이 핵심 — 하루도 빠지지 않는 가벼운 운동!",
    avoid: "공복 격렬 운동·야간 폭발 운동 — 토 체질 혈당 급락, 위장 부담 가중",
  },
  금: {
    best: [
      { name: "🚶 파워워킹·빠른 걷기", time: "30~40분/일", effect: "금 체질 폐활량 증가, 산소 공급 최적화" },
      { name: "🏊 수영", time: "30~40분/일", effect: "금 체질 폐·기관지 강화, 호흡 훈련" },
      { name: "🏃 달리기", time: "20~30분/일", effect: "금 체질 폐 단련, 규칙적 호흡 훈련" },
      { name: "🧘 필라테스", time: "30분/일", effect: "금 체질 코어 강화, 복식호흡 훈련" },
      { name: "🌿 단전호흡·명상", time: "15~20분/일", effect: "금 체질 폐 기능 직접 강화" },
      { name: "🥾 등산", time: "2시간/주말", effect: "금 체질 맑은 공기 + 폐활량 강화" },
      { name: "🤸 요가", time: "30분/일", effect: "금 체질 호흡과 스트레칭 동시 강화" },
      { name: "🚲 사이클", time: "30분/일", effect: "금 체질 심폐 기능 향상, 야외 공기 흡수" },
    ],
    tip: "규칙적인 시간에 운동하는 것이 금 체질에 핵심. 환기 잘 되는 야외에서 호흡하며 운동할 것!",
    avoid: "실내 밀폐 환경 운동·먼지 많은 곳 — 금 체질 폐·기관지 자극, 호흡기 악화",
  },
  수: {
    best: [
      { name: "🏊 수영", time: "30~40분/일", effect: "수 체질 신장·방광 강화, 전신 유산소" },
      { name: "🚶 가벼운 걷기", time: "30~40분/일", effect: "수 체질 혈액순환, 신장 노폐물 배출" },
      { name: "🧘 요가", time: "30분/일", effect: "수 체질 심신 균형, 신장 에너지 보존" },
      { name: "🚲 자전거", time: "30분/일", effect: "수 체질 관절 보호, 저충격 유산소" },
      { name: "🏃 가벼운 조깅", time: "20~25분/일", effect: "수 체질 노폐물 배출, 무리하지 않는 운동" },
      { name: "🧗 스트레칭", time: "15분/아침저녁", effect: "수 체질 기 흐름 원활, 냉기 예방" },
      { name: "🌊 아쿠아로빅", time: "30분/회", effect: "수 체질 물 에너지 흡수, 신장 기능 활성화" },
      { name: "☯️ 기공·명상", time: "20분/일", effect: "수 체질 내면 에너지 축적, 신장 기운 강화" },
    ],
    tip: "오후 4~6시가 수 체질 운동 최적 시간. 몸을 항상 따뜻하게 유지하며 운동할 것!",
    avoid: "새벽 운동·차가운 환경 운동 — 수 체질 신장·방광에 냉기 유입, 기능 저하",
  },
};

const OH_SEASONAL: Record<string, Record<Season, { best: { name: string; reason: string }[]; tip: string }>> = {
  목: {
    봄: { best: [{ name: "봄나물(냉이·달래·쑥)", reason: "목 체질 간 해독 최적, 쓴맛이 간 기운 상승" }, { name: "두릅·방풍나물", reason: "봄 신진대사 활성화, 목 체질 피로 해소" }, { name: "딸기·블루베리", reason: "항산화 성분이 목 체질 간 세포 보호" }, { name: "브로콜리·시금치", reason: "엽산이 목 체질 세포 재생 촉진" }, { name: "매실·레몬", reason: "신맛이 목 체질 간 기능 활성화" }], tip: "봄 목 체질 핵심 — 쓴맛 나물로 겨우내 쌓인 노폐물 배출!" },
    여름: { best: [{ name: "오이·애호박", reason: "목 체질 여름 열 진정, 수분 보충" }, { name: "수박·참외", reason: "목 체질 이뇨 작용, 간 해독 돕기" }, { name: "상추·깻잎", reason: "목 체질 여름 열 기운 조절" }, { name: "팥빙수용 팥", reason: "이뇨+해독이 목 체질 여름에 최적" }, { name: "토마토", reason: "리코펜이 목 체질 간 세포 보호" }], tip: "여름 목 체질 핵심 — 녹색 채소와 수분 충분히, 기름진 음식은 최소화!" },
    가을: { best: [{ name: "사과·배", reason: "목 체질 가을 폐 기운 보강, 소화 촉진" }, { name: "표고·느타리버섯", reason: "목 체질 면역력 강화, 가을 환절기 보호" }, { name: "견과류(호두·잣)", reason: "목 체질 뇌+간 영양 공급" }, { name: "연근·우엉", reason: "목 체질 장 청소, 가을 해독" }, { name: "감·단감", reason: "목 체질 가을 비타민 공급, 간 기능 보조" }], tip: "가을 목 체질 핵심 — 버섯류로 면역 강화, 견과류로 뇌·간 동시 관리!" },
    겨울: { best: [{ name: "시금치·들깨", reason: "목 체질 겨울 철분+칼슘 보충" }, { name: "검은콩·서리태", reason: "목 체질 간·신장 겨울 에너지 저장" }, { name: "브로콜리·배추(데친)", reason: "목 체질 면역력 유지, 따뜻하게 섭취" }, { name: "귤·한라봉", reason: "목 체질 겨울 비타민C 보충, 간 보호" }, { name: "마·도라지", reason: "목 체질 겨울 기관지·간 동시 강화" }], tip: "겨울 목 체질 핵심 — 검은콩·들깨로 간 에너지 충전, 따뜻하게 데쳐 먹을 것!" },
  },
  화: {
    봄: { best: [{ name: "쑥·봄나물(가볍게)", reason: "화 체질 봄 기운 상승, 소화 활성화" }, { name: "녹차·허브티", reason: "화 체질 심장 진정, 항산화" }, { name: "딸기·체리", reason: "화 체질 혈관 보호, 항염" }, { name: "상추·깻잎", reason: "화 체질 봄 열 진정, 가벼운 식사" }, { name: "두부·콩나물", reason: "화 체질 단백질 가볍게 보충" }], tip: "봄 화 체질 핵심 — 가볍고 식물성 위주로, 짜고 자극적인 음식은 줄이기!" },
    여름: { best: [{ name: "수박·참외·메론", reason: "화 체질 여름 열 최고 진정 과일" }, { name: "오이냉국·미역냉국", reason: "화 체질 여름 체온 조절, 나트륨 주의" }, { name: "토마토·파프리카", reason: "화 체질 항산화+심장 보호" }, { name: "녹두·팥", reason: "화 체질 여름 해독, 부기 빼기" }, { name: "연근·우엉 차", reason: "화 체질 심장 안정, 여름 쿨링" }], tip: "여름 화 체질 핵심 — 수분 충분히+심장 진정 채소 중심. 매운 음식과 고나트륨 주의!" },
    가을: { best: [{ name: "배·감", reason: "화 체질 가을 폐+심장 동시 보호" }, { name: "도라지·더덕", reason: "화 체질 기관지+심폐 기능 강화" }, { name: "연어·등 푸른 생선", reason: "화 체질 오메가3로 혈관 관리" }, { name: "고구마·단호박", reason: "화 체질 가을 에너지 충전, 혈당 완만" }, { name: "사과·블루베리", reason: "화 체질 항산화, 심장 세포 보호" }], tip: "가을 화 체질 핵심 — 도라지·더덕으로 심폐 강화, 등 푸른 생선으로 혈관 관리!" },
    겨울: { best: [{ name: "검은참깨·흑임자", reason: "화 체질 겨울 심장 영양 보충" }, { name: "귤·한라봉", reason: "화 체질 겨울 비타민C, 혈관 탄력" }, { name: "두부찌개(따뜻하게)", reason: "화 체질 식물성 단백질+따뜻한 기운" }, { name: "마늘·생강(소량)", reason: "화 체질 겨울 면역, 적당히만" }, { name: "연근·우엉 조림", reason: "화 체질 겨울 심장 안정, 혈당 완만" }], tip: "겨울 화 체질 핵심 — 따뜻하되 과하지 않게. 짜거나 기름진 겨울 음식 줄이기!" },
  },
  토: {
    봄: { best: [{ name: "된장국·청국장", reason: "토 체질 봄 소화기 활성화, 발효 식품" }, { name: "봄나물(데친 것)", reason: "토 체질 봄 비위 자극, 소화 촉진" }, { name: "현미밥·잡곡밥", reason: "토 체질 혈당 완만, 소화기 안정" }, { name: "배추·양배추", reason: "토 체질 위 점막 보호, 소화 개선" }, { name: "완두콩·렌틸콩", reason: "토 체질 단백질+식이섬유 동시 공급" }], tip: "봄 토 체질 핵심 — 따뜻한 발효 식품으로 겨울 굳은 소화기 살리기!" },
    여름: { best: [{ name: "미역국(따뜻하게)", reason: "토 체질 여름도 위는 따뜻하게" }, { name: "아보카도·바나나", reason: "토 체질 여름 에너지+소화 동시" }, { name: "옥수수·감자", reason: "토 체질 여름 탄수화물 완만 공급" }, { name: "된장·청국장", reason: "토 체질 여름 소화기 유익균 보호" }, { name: "두부·계란", reason: "토 체질 여름 단백질 가볍게 보충" }], tip: "여름 토 체질 핵심 — 찬 음식 줄이고 발효식품으로 소화기 보호!" },
    가을: { best: [{ name: "호박·단호박", reason: "토 체질 가을 비위 강화, 단맛으로 소화 돕기" }, { name: "고구마·감자", reason: "토 체질 가을 에너지 저장, 소화 촉진" }, { name: "사과·배", reason: "토 체질 가을 소화 효소 보충" }, { name: "표고버섯·느타리", reason: "토 체질 면역+소화기 동시 강화" }, { name: "현미·잡곡", reason: "토 체질 가을 에너지 축적" }], tip: "가을 토 체질 핵심 — 황색 뿌리채소 위주로, 단맛으로 비위 기운 강화!" },
    겨울: { best: [{ name: "순두부찌개·된장찌개", reason: "토 체질 겨울 소화기 따뜻하게 보호" }, { name: "마·연근", reason: "토 체질 겨울 위 점막 강화" }, { name: "찹쌀·현미죽", reason: "토 체질 겨울 소화기 최소 부담" }, { name: "닭죽(담백하게)", reason: "토 체질 겨울 원기 회복, 소화 부담 최소" }, { name: "밤·고구마", reason: "토 체질 겨울 단맛 에너지 충전" }], tip: "겨울 토 체질 핵심 — 죽·찜 형태로 소화 부담 최소화. 찬 음식은 봄까지 자제!" },
  },
  금: {
    봄: { best: [{ name: "도라지·더덕", reason: "금 체질 봄 기관지 청소, 폐 기능 깨우기" }, { name: "배·무", reason: "금 체질 봄 가래 제거, 폐 촉촉하게" }, { name: "봄나물(데친 것)", reason: "금 체질 봄 해독, 폐+장 동시 정화" }, { name: "흰살생선·두부", reason: "금 체질 가벼운 단백질, 장 부담 최소" }, { name: "배추·브로콜리", reason: "금 체질 폐·장 동시 강화" }], tip: "봄 금 체질 핵심 — 도라지·더덕으로 겨울 내 굳은 폐 기운 깨우기!" },
    여름: { best: [{ name: "배·오이", reason: "금 체질 여름 폐 촉촉하게, 열 진정" }, { name: "흰살생선(광어·농어)", reason: "금 체질 여름 폐 단백질 보충" }, { name: "수박·참외", reason: "금 체질 여름 폐 수분 공급" }, { name: "두부냉국·콩국수", reason: "금 체질 여름 폐+장 동시 식히기" }, { name: "도라지차·배즙", reason: "금 체질 여름 기관지 보호 음료" }], tip: "여름 금 체질 핵심 — 폐에 수분 공급이 최우선. 에어컨 바람 직접 쐬지 말 것!" },
    가을: { best: [{ name: "배·도라지·더덕", reason: "금 체질 가을 건조함에서 폐 보호 핵심" }, { name: "연근·마", reason: "금 체질 가을 장·폐 점막 강화" }, { name: "흰쌀죽·흰콩", reason: "금 체질 소화+폐 동시 안정" }, { name: "배추·양배추", reason: "금 체질 가을 장 건강 최고 채소" }, { name: "견과류(잣·호두)", reason: "금 체질 가을 폐+뇌 영양 공급" }], tip: "가을 금 체질 핵심 — 도라지·배는 매일 먹을 것. 건조한 날씨에 폐 보호 최우선!" },
    겨울: { best: [{ name: "더덕구이·도라지구이", reason: "금 체질 겨울 폐 기운 강화" }, { name: "은행·잣", reason: "금 체질 겨울 폐 기운 보충, 기침 예방" }, { name: "흰살생선찜", reason: "금 체질 겨울 단백질+폐 보호" }, { name: "배숙·생강배즙", reason: "금 체질 겨울 기관지 보호, 따뜻하게" }, { name: "검은깨죽·잣죽", reason: "금 체질 겨울 폐·장 동시 윤활" }], tip: "겨울 금 체질 핵심 — 은행·잣·도라지 삼총사로 폐 보호. 실내 습도 유지도 필수!" },
  },
  수: {
    봄: { best: [{ name: "검은콩·검은깨", reason: "수 체질 봄 신장 에너지 충전" }, { name: "부추·달래(소량)", reason: "수 체질 봄 신장 기운 활성화, 따뜻한 성질" }, { name: "쑥(따뜻하게)", reason: "수 체질 봄 냉기 제거, 신장 따뜻하게" }, { name: "연어·고등어", reason: "수 체질 봄 오메가3+신장 강화" }, { name: "미역·다시마", reason: "수 체질 봄 미네랄 보충, 신장 세척" }], tip: "봄 수 체질 핵심 — 검은콩·검은깨로 신장 에너지 충전. 차가운 봄 기운 조심!" },
    여름: { best: [{ name: "수박·복숭아", reason: "수 체질 여름 신장 수분 공급, 이뇨 작용" }, { name: "오이·가지", reason: "수 체질 여름 열 진정+신장 보호" }, { name: "검은콩밥·미역국", reason: "수 체질 여름도 신장 영양 유지" }, { name: "블루베리·포도", reason: "수 체질 여름 항산화, 신장 세포 보호" }, { name: "팥죽·팥빙수(팥)", reason: "수 체질 여름 이뇨+해독 최고" }], tip: "여름 수 체질 핵심 — 충분한 수분 섭취+신장 보호 과일 중심. 찬 음식은 조금씩만!" },
    가을: { best: [{ name: "검은콩·흑임자", reason: "수 체질 가을 신장 에너지 저장 핵심" }, { name: "밤·호두", reason: "수 체질 가을 신장+뇌 에너지 동시 충전" }, { name: "굴·조개(소량)", reason: "수 체질 가을 아연+신장 미네랄 보충" }, { name: "미역·다시마", reason: "수 체질 가을 미네랄, 신장 기능 보조" }, { name: "흑미밥", reason: "수 체질 가을 에너지 축적, 신장 강화" }], tip: "가을 수 체질 핵심 — 검은색 음식으로 신장 에너지 저장. 겨울 대비 영양 충전!" },
    겨울: { best: [{ name: "검은콩죽·흑임자죽", reason: "수 체질 겨울 신장 기운 최고 보충" }, { name: "돼지고기(수육·담백)", reason: "수 체질 겨울 신장 단백질 보충" }, { name: "미역국·다시마국", reason: "수 체질 겨울 신장 미네랄 공급" }, { name: "구기자·오미자차", reason: "수 체질 겨울 신장·방광 직접 강화" }, { name: "흑임자·검은깨볶음", reason: "수 체질 겨울 신장 에너지 최고 집약" }], tip: "겨울 수 체질 핵심 — 검은 식품 매일 섭취. 몸 차게 하는 음식 완전 차단!" },
  },
};

function getTodayCount(): string {
  const d = new Date();
  const dateSeed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const lcg = Math.abs((dateSeed * 1664525 + 1013904223) & 0x7fffffff);
  const base = 2000 + (lcg % 200);
  const block = Math.floor(d.getHours() / 8);
  const delta1 = 300 + (lcg % 200);
  const delta2 = 400 + ((lcg >> 4) % 300);
  return (base + (block >= 1 ? delta1 : 0) + (block >= 2 ? delta2 : 0)).toLocaleString();
}

function getSeason(): Season {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "봄";
  if (m >= 6 && m <= 8) return "여름";
  if (m >= 9 && m <= 11) return "가을";
  return "겨울";
}

const SEASON_EMOJI: Record<Season, string> = { 봄: "🌸", 여름: "☀️", 가을: "🍂", 겨울: "❄️" };
const SEASONS: Season[] = ["봄", "여름", "가을", "겨울"];

const todayStr = () => new Date().toISOString().slice(0, 10);

// ─────────────────────────────────────────────────────────────────────────────

export default function DietPage() {
  const [tab, setTab] = useState<Tab>("today");
  const [setupDone, setSetupDone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem("v2_saved_profile");
      if (saved) { const p = JSON.parse(saved); if (p.birthYear) return true; }
    } catch {}
    return false;
  });
  const [birthYear, setBirthYear] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hpField, setHpField] = useState(""); // 허니팟 — 봇 방지용 숨김 필드, 사람 눈엔 안 보임
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [hasPhone, setHasPhone] = useState(false);
  const [dietPrivacyAgreed, setDietPrivacyAgreed] = useState(false);
  const [dietMarketingAgreed, setDietMarketingAgreed] = useState(false);
  const [mcUserId, setMcUserId] = useState("");
  const [dietLocked, setDietLocked] = useState(true);
  const [restorePhone, setRestorePhone] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const saveWeightSavingRef = useRef(false);
  const [historyData, setHistoryData] = useState<Record<string, DayLog>>({});
  const [searchQ, setSearchQ] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCal, setCustomCal] = useState("");
  const [todayWeight, setTodayWeight] = useState("");
  const [weightSaved, setWeightSaved] = useState(false);
  const [premiumSub, setPremiumSub] = useState<PremiumSub>("avoid");
  const [selectedSeason, setSelectedSeason] = useState<Season>(getSeason());
  const [avoidShowAll, setAvoidShowAll] = useState(false);

  useEffect(() => {
    try {
      const until = Number(localStorage.getItem("diet_unlock_until") || 0);
      if (!until || until < Date.now()) setDietLocked(true);
      else { setDietLocked(false); setAvoidShowAll(true); }
    } catch {}
    let uid = "";
    let yr = "";
    let ph = "";
    try {
      const saved = localStorage.getItem("v2_saved_profile");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.birthYear) yr = String(p.birthYear);
        if (p.name) setName(p.name);
        if (p.email) setEmail(p.email);
        if (p.phone) { ph = p.phone; setRestorePhone(p.phone); setHasPhone(true); uid = `phone_${p.phone.replace(/\D/g, "")}`; }
      }
    } catch {}
    try {
      const h = localStorage.getItem("diet_height");
      const w = localStorage.getItem("diet_weight");
      const tw = localStorage.getItem("diet_target_weight");
      if (h) setHeight(h);
      if (w) setWeight(w);
      if (tw) setTargetWeight(tw);
    } catch {}
    if (!uid) {
      setHasPhone(false);
      let devId = localStorage.getItem("diet_device_id");
      if (!devId) { devId = Date.now().toString(36) + Math.random().toString(36).slice(2); localStorage.setItem("diet_device_id", devId); }
      uid = `device_${devId}`;
    }
    setMcUserId(uid);
    setBirthYear(yr);
    setPhone(ph);
    if (yr) setSetupDone(true);
    const todayKey = todayStr();
    const stored = localStorage.getItem(`diet_meals_${todayKey}`);
    if (stored) setMeals(JSON.parse(stored));
    if (uid) {
      fetch(`/api/diet?userId=${uid}`)
        .then(r => r.json())
        .then(d => {
          if (d.data && typeof d.data === "object") {
            setHistoryData(d.data);
            if (d.data[todayKey]?.meals) {
              setMeals(d.data[todayKey].meals);
              localStorage.setItem(`diet_meals_${todayKey}`, JSON.stringify(d.data[todayKey].meals));
            }
            if (d.data[todayKey]?.weight) {
              setTodayWeight(String(d.data[todayKey].weight));
              setWeightSaved(true);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  function saveToday(m: Meal[]) {
    const todayKey = todayStr();
    const totalCal = m.reduce((s, x) => s + x.cal, 0);
    const existingWeight = historyData[todayKey]?.weight;
    setMeals(m);
    setHistoryData(prev => ({ ...prev, [todayKey]: { meals: m, totalCal, weight: existingWeight } }));
    localStorage.setItem(`diet_meals_${todayKey}`, JSON.stringify(m));
    if (mcUserId) {
      postWithRetry("/api/diet", { userId: mcUserId, date: todayKey, meals: m, totalCal, weight: existingWeight });
    }
  }

  function saveWeight() {
    if (saveWeightSavingRef.current) return;
    saveWeightSavingRef.current = true;
    setTimeout(() => { saveWeightSavingRef.current = false; }, 500);
    const wNum = parseFloat(todayWeight);
    if (!wNum || wNum < 20 || wNum > 300) { alert("올바른 체중을 입력해주세요 (20~300kg)"); return; }
    const todayKey = todayStr();
    const log = historyData[todayKey] || { meals, totalCal: meals.reduce((s, m) => s + m.cal, 0) };
    const updated: DayLog = { ...log, weight: wNum };
    setHistoryData(prev => ({ ...prev, [todayKey]: updated }));
    setWeightSaved(true);
    if (mcUserId) {
      postWithRetry("/api/diet", { userId: mcUserId, date: todayKey, meals: log.meals, totalCal: log.totalCal, weight: wNum });
    }
  }

  function addMeal(food: Pick<Food, "name" | "cal" | "unit">) {
    const m: Meal = {
      id: Date.now().toString(),
      name: food.name, cal: food.cal, unit: food.unit,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };
    saveToday([...meals, m]);
    setTab("today");
    setSearchQ("");
  }

  function addCustom() {
    const cal = parseInt(customCal);
    if (!customName || !cal) return;
    addMeal({ name: customName, cal, unit: "직접 입력" });
    setCustomName(""); setCustomCal("");
  }

  function removeMeal(id: string) { saveToday(meals.filter(m => m.id !== id)); }

  function saveSetup() {
    if (hpField) return; // 봇 감지 — 조용히 무시
    if (!dietPrivacyAgreed) { alert("개인정보 수집·이용 동의를 체크해주세요."); return; }
    const yr = parseInt(birthYear);
    if (!yr || yr < 1940 || yr > 2015) { alert("올바른 출생연도를 입력해주세요 (1940~2015)"); return; }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) { alert("전화번호를 입력해주세요."); return; }
    try {
      const existing = localStorage.getItem("v2_saved_profile");
      const profile = existing ? JSON.parse(existing) : {};
      profile.birthYear = yr;
      if (name) profile.name = name;
      if (phone) profile.phone = phone;
      if (email) profile.email = email;
      localStorage.setItem("v2_saved_profile", JSON.stringify(profile));
    } catch {}
    if (height) localStorage.setItem("diet_height", height);
    if (weight) localStorage.setItem("diet_weight", weight);
    if (targetWeight) localStorage.setItem("diet_target_weight", targetWeight);
    const uid = `phone_${cleanPhone}`;
    setMcUserId(uid);
    setHasPhone(true);
    fetch("/api/diet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "lead", userId: uid, name, phone: cleanPhone, email, marketing: dietMarketingAgreed }),
    }).catch(() => {});
    setSetupDone(true);
  }

  const handleRestore = async () => {
    const ph = restorePhone.replace(/\D/g, "");
    if (ph.length < 10) { setRestoreMsg("전화번호를 확인해주세요."); return; }
    setRestoring(true); setRestoreMsg("");
    try {
      const r = await fetch(`/api/phone-unlock?phone=${ph}`);
      const d = await r.json();
      const hasTicket = d.ok && d.unlocks?.diet_unlock_until > Date.now();
      if (hasTicket) {
        try { localStorage.setItem("diet_unlock_until", String(d.unlocks.diet_unlock_until)); } catch {}
      }
      try { const _p = JSON.parse(localStorage.getItem("v2_saved_profile") || "{}"); _p.phone = restorePhone; localStorage.setItem("v2_saved_profile", JSON.stringify(_p)); } catch {}
      setRestoreMsg(hasTicket ? "✅ 이용권 복원 완료! 새로고침할게요." : "✅ 기록을 불러올게요. 새로고침할게요.");
      setTimeout(() => window.location.reload(), 1000);
    } catch { setRestoreMsg("복원 중 오류가 발생했어요."); }
    finally { setRestoring(false); }
  };

  const yr = parseInt(birthYear) || 1990;
  const oh = getOhFromYear(yr);
  const ohData = OH_DIET[oh];
  const target = ohData?.kcal || 1700;
  const totalCal = meals.reduce((s, m) => s + m.cal, 0);
  const ratio = Math.round((totalCal / target) * 100);
  const trafficLight = ratio <= 85 ? "🟢" : ratio <= 105 ? "🟡" : "🔴";

  const h = parseFloat(height) || 0;
  const w = parseFloat(weight) || 0;
  const bmi = h > 0 && w > 0 ? Math.round((w / Math.pow(h / 100, 2)) * 10) / 10 : 0;
  const bmiLabel = bmi === 0 ? "" : bmi < 18.5 ? "저체중" : bmi < 23 ? "정상" : bmi < 25 ? "과체중" : "비만";
  const bmiColor = bmi === 0 ? "transparent" : bmi < 18.5 ? "#60a5fa" : bmi < 23 ? "#4ade80" : bmi < 25 ? "#fbbf24" : "#f87171";

  const searchResults: Food[] = searchQ.length >= 1
    ? FOODS.filter(f => f.name.includes(searchQ) || f.cat.includes(searchQ)).slice(0, 30)
    : [];

  // 7일 차트용
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const weekMax = Math.max(target, ...weekDays.map(d => historyData[d]?.totalCal || 0), 1);

  // 월별 리포트용
  const allDays = Object.entries(historyData).sort(([a], [b]) => b.localeCompare(a)).slice(0, 30);
  const monthAvg = allDays.length > 0 ? Math.round(allDays.reduce((s, [, l]) => s + l.totalCal, 0) / allDays.length) : 0;
  const goodDays = allDays.filter(([, l]) => l.totalCal <= target).length;
  const overDays = allDays.filter(([, l]) => l.totalCal > target).length;
  const foodCount: Record<string, number> = {};
  allDays.forEach(([, l]) => l.meals.forEach(m => { foodCount[m.name] = (foodCount[m.name] || 0) + 1; }));
  const top3 = Object.entries(foodCount).sort(([, a], [, b]) => b - a).slice(0, 3);

  // ── 잠금 화면 ─────────────────────────────────────────────────────────────
  if (dietLocked) {
    const dietShareText = "🥗 오행 체질 맞춤 다이어트!\n3,000개 식품 칼로리 DB + 오행 식단 가이드\n바코드 없이 빠른 기록 👉 jeomun.com/diet";
    const handleDietShare = () => {
      if (typeof navigator !== "undefined" && navigator.share) {
        navigator.share({ title: "점운 다이어트", text: dietShareText, url: "https://jeomun.com/diet" })
          .catch(() => { window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent(dietShareText)}`; });
      } else {
        window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent(dietShareText)}`;
      }
    };
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#111827,#0f172a)", color: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
        <nav style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="/main-v2" style={{ fontSize: 14, color: "#a5b4fc", textDecoration: "none" }}>← 점운 홈</a>
          <button onClick={handleDietShare} style={{ fontSize: 12, color: "#a5b4fc", fontWeight: 700, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 20, padding: "5px 14px", cursor: "pointer" }}>🔗 공유하기</button>
        </nav>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "36px 20px 0", textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>🥗</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>점운 다이어트</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 8px", lineHeight: 1.6 }}>오행 체질에 맞는 맞춤 칼로리 관리</p>
          <p style={{ fontSize: 12, color: "rgba(99,102,241,0.9)", margin: "0 0 24px", fontWeight: 700 }}>오늘 {getTodayCount()}명이 다이어트 중이에요!</p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 36, textAlign: "left" }}>
            {[
              { e: "🔍", t: "3,000개 식품 칼로리 DB 즉시 검색" },
              { e: "🌿", t: "오행 체질별 맞춤 권장 칼로리 제공" },
              { e: "🚫", t: "내 체질에 금지된 음식 14개 확인" },
              { e: "🏃", t: "오행별 맞춤 운동 루틴 추천" },
              { e: "📊", t: "30일 칼로리 기록 & 7일 차트 분석" },
            ].map(f => (
              <div key={f.t} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{f.e}</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{f.t}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 32, display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔒</div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 8px" }}>이용권이 필요해요</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: "0 0 24px" }}>
              1,980원 단독권 또는 4개앱 30일 5,900원 풀패스로 이용해요<br />감정일기·다이어트·가계부·육아일기(맘케어)
            </p>
            <a href="/diet/pay" style={{ display: "inline-block", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "white", fontSize: 15, fontWeight: 900, padding: "15px 36px", borderRadius: 26, textDecoration: "none", marginBottom: 24 }}>
              이용권 구매하기 →
            </a>
            <div style={{ width: "100%", maxWidth: 320, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 8px" }}>📱 다른 기기에서 이용하셨나요? 전화번호로 복원</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="tel" value={restorePhone} onChange={e => setRestorePhone(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="01012345678" style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 12px", color: "white", fontSize: 13, outline: "none" }} inputMode="numeric" />
                <button onClick={handleRestore} disabled={restoring} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "10px 16px", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{restoring ? "확인중..." : "복원"}</button>
              </div>
              {restoreMsg && <p style={{ fontSize: 12, margin: "8px 0 0", color: restoreMsg.startsWith("✅") ? "#4ade80" : "#f87171" }}>{restoreMsg}</p>}
            </div>
          </div>
        </div>
        <footer style={{ padding: "32px 20px 40px", textAlign: "center" }}>
          <div style={{ maxWidth: 380, margin: "0 auto", padding: "20px 18px", borderRadius: 20, background: "#0a0020", border: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, margin: "0 0 10px" }}>© 2026 점운 · Powered by 점운</p>
            <div style={{ color: "#94a3b8", fontSize: 10.5, lineHeight: 1.9, marginBottom: 14 }}>
              <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신</p>
              <p style={{ margin: 0 }}>사업자등록번호 773-60-00359</p>
              <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38, 7층 7017호</p>
              <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 11 }}>※ 전화 문의는 받지 않습니다. 카카오톡으로 문의해 주세요.</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 12 }}>
              <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "7px 18px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 900, fontSize: 12 }}>💬 카카오톡 문의</a>
              <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ display: "inline-block", padding: "7px 18px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, color: "#e2e8f0", textDecoration: "none", fontWeight: 700, fontSize: 12 }}>📧 이메일 문의</a>
            </div>
            <div style={{ fontSize: 11, display: "flex", justifyContent: "center", gap: 12 }}>
              <a href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>이용약관</a>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <a href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>개인정보처리방침</a>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <a href="/refund" style={{ color: "#94a3b8", textDecoration: "none" }}>환불정책</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ── 셋업 화면 ─────────────────────────────────────────────────────────────
  if (!setupDone) {
    const setupH = parseFloat(height) || 0;
    const setupW = parseFloat(weight) || 0;
    const setupBmi = setupH > 0 && setupW > 0 ? Math.round((setupW / Math.pow(setupH / 100, 2)) * 10) / 10 : 0;
    const setupBmiLabel = setupBmi === 0 ? "" : setupBmi < 18.5 ? "저체중" : setupBmi < 23 ? "정상" : setupBmi < 25 ? "과체중" : "비만";

    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#111827,#0f172a)", color: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
        <nav style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "14px 20px" }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 900, color: "#a5b4fc", textDecoration: "none" }}>점운 다이어트</Link>
        </nav>
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "40px 20px 60px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 56, marginBottom: 10 }}>🥗</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>점운 다이어트</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
              오행 체질에 맞는 맞춤 칼로리 관리<br />바코드·AI 없이 빠른 칼로리 기록
            </p>
          </div>

          {[
            { label: "이름 또는 별명 (선택)", type: "text", value: name, onChange: (v: string) => setName(v), placeholder: "예) 에스더" },
            { label: "전화번호 * (기록 영구보관 필수)", type: "tel", value: phone, onChange: (v: string) => setPhone(v), placeholder: "010-0000-0000" },
            { label: "이메일 (선택)", type: "email", value: email, onChange: (v: string) => setEmail(v), placeholder: "example@email.com" },
            { label: "출생연도 * (오행 체질 분석용)", type: "number", value: birthYear, onChange: (v: string) => setBirthYear(v), placeholder: "예: 1992" },
          ].map(f => (
            <div key={f.label} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px 20px", marginBottom: 12 }}>
              <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "13px 14px", fontSize: 16, color: "white", outline: "none", boxSizing: "border-box" as const }} />
              {f.type === "tel" && (
                <input
                  type="text" name="website" value={hpField} onChange={e => setHpField(e.target.value)}
                  autoComplete="off" tabIndex={-1} aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />
              )}
            </div>
          ))}

          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px 20px", marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>키 · 몸무게 (BMI 계산용, 선택)</label>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="키 (cm)" min="100" max="250"
                  style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "13px 14px", fontSize: 15, color: "white", outline: "none", boxSizing: "border-box" as const }} />
              </div>
              <div style={{ flex: 1 }}>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="몸무게 (kg)" min="20" max="300"
                  style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "13px 14px", fontSize: 15, color: "white", outline: "none", boxSizing: "border-box" as const }} />
              </div>
            </div>
            {setupBmi > 0 && (
              <div style={{ marginTop: 10, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "8px 14px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>BMI</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: setupBmiLabel === "정상" ? "#4ade80" : setupBmiLabel === "저체중" ? "#60a5fa" : "#fbbf24" }}>{setupBmi} — {setupBmiLabel}</span>
              </div>
            )}
          </div>

          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px 20px", marginBottom: 8 }}>
            <label style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>목표 체중 (kg, 선택)</label>
            <input type="number" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} placeholder="예: 55" min="20" max="200"
              style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "13px 14px", fontSize: 16, color: "white", outline: "none", boxSizing: "border-box" as const }} />
          </div>

          <div style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#fbbf24", lineHeight: 1.6 }}>
            ⚠️ 전화번호 필수 — 입력하지 않으면 다른 기기에서 기록을 불러올 수 없어요.
          </div>

          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={dietPrivacyAgreed} onChange={e => setDietPrivacyAgreed(e.target.checked)}
              style={{ marginTop: 2, accentColor: "#6366f1", width: 16, height: 16, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              <strong style={{ color: "rgba(255,255,255,0.8)" }}>[필수] 개인정보 수집·이용 동의</strong><br />
              수집 항목: 이름(선택), 출생연도(필수), 전화번호(필수), 이메일(선택) / 보관: 3년 후 파기
            </span>
          </label>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24, cursor: "pointer" }}>
            <input type="checkbox" checked={dietMarketingAgreed} onChange={e => setDietMarketingAgreed(e.target.checked)}
              style={{ marginTop: 2, accentColor: "#6366f1", width: 16, height: 16, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
              <strong style={{ color: "rgba(255,255,255,0.8)" }}>[선택] 마케팅 수신 동의</strong><br />
              점운의 새로운 기능·이벤트 알림을 받겠습니다. 언제든 수신거부 가능합니다.
            </span>
          </label>

          <button onClick={saveSetup} style={{ width: "100%", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "white", border: "none", borderRadius: 14, padding: "16px", fontSize: 16, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
            오행 체질 분석 시작 →
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "rgba(74,222,128,0.5)", marginTop: 12, lineHeight: 1.6 }}>
            🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임<br />기획의신 에스더(Esther)가 직접 만들고 검증한 앱
          </p>
        </div>
      </div>
    );
  }

  // ── 메인 화면 ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: ohData.bg, color: "#f5f5f5", fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      <nav style={{ background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontSize: 16, fontWeight: 900, color: ohData.color, textDecoration: "none" }}>점운 다이어트</Link>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>오늘 {getTodayCount()}명 이용 중</span>
      </nav>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "16px 16px 120px" }}>

        {/* 워터마크 */}
        <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 12, lineHeight: 1.6 }}>
          🏆 탈잉 2년 연속 1위 · 크몽 상위 2% 프라임 · 기획의신 에스더
        </p>

        {!hasPhone && (
          <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 12, padding: "10px 14px", marginBottom: 14, fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
            ⚠️ 전화번호 미등록 — 기록이 이 기기에만 저장돼요.<br />
            <a href="/main-v2" style={{ color: "#f97316", fontWeight: 700, textDecoration: "none" }}>사주 앱에서 전화번호 등록하기 →</a>
          </div>
        )}

        {/* 오행 체질 + BMI 뱃지 */}
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>내 오행 체질</p>
            <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 900, color: ohData.color }}>{ohData.emoji} {ohData.label} — {ohData.type}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>일일 권장</p>
            <p style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 900, color: ohData.color }}>{ohData.kcal.toLocaleString()} kcal</p>
          </div>
          {bmi > 0 && (
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>BMI</p>
              <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 900, color: bmiColor }}>{bmi} <span style={{ fontSize: 10 }}>{bmiLabel}</span></p>
            </div>
          )}
        </div>

        {/* ── 오늘 탭 ── */}
        {tab === "today" && (
          <>
            {/* 칼로리 카드 */}
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 18, padding: "18px 18px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>오늘 섭취 칼로리</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 26 }}>{trafficLight}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: ratio >= 105 ? "#f87171" : ohData.color }}>
                    {totalCal.toLocaleString()} / {target.toLocaleString()} kcal
                  </span>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 12, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ width: `${Math.min(100, ratio)}%`, height: "100%", background: ratio >= 105 ? "#f87171" : ratio >= 86 ? "#fbbf24" : ohData.color, borderRadius: 99, transition: "width 0.4s ease" }} />
              </div>
              <p style={{ margin: "0 0 14px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                {ratio < 80 ? `${(target - totalCal).toLocaleString()} kcal 더 섭취 가능해요` :
                  ratio <= 105 ? `목표까지 ${(target - totalCal).toLocaleString()} kcal 남았어요 💪` :
                  `목표 초과 +${(totalCal - target).toLocaleString()} kcal ⚠️`}
              </p>

              {/* 체중 트래커 */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
                {weightSaved ? (
                  <div style={{ fontSize: 13, color: "#4ade80", marginBottom: 6 }}>✅ {todayWeight}kg 저장됐어요!</div>
                ) : (
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>⚖️ 오늘 체중을 기록하면 7일 체중 변화를 볼 수 있어요</p>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="number" value={todayWeight} onChange={e => { setTodayWeight(e.target.value); setWeightSaved(false); }}
                    placeholder="오늘 체중 (kg)" min="20" max="300" step="0.1"
                    style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "9px 12px", fontSize: 14, color: "white", outline: "none" }} />
                  <button onClick={saveWeight} style={{ background: ohData.color, color: ohData.bg, border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>저장</button>
                </div>
                {targetWeight && parseFloat(todayWeight) > 0 && (
                  <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                    목표까지 {Math.max(0, parseFloat(todayWeight) - parseFloat(targetWeight)).toFixed(1)}kg 남았어요
                  </p>
                )}
              </div>
            </div>

            {/* 음식 목록 */}
            <div style={{ marginBottom: 14 }}>
              {meals.length === 0 ? (
                <div style={{ textAlign: "center", padding: "28px 0", color: "rgba(255,255,255,0.35)" }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>🍽️</div>
                  <p style={{ margin: 0, fontSize: 14 }}>아직 기록한 음식이 없어요</p>
                </div>
              ) : meals.map(m => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 4px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{m.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{m.unit} · {m.time}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 900, color: ohData.color }}>{m.cal.toLocaleString()} kcal</span>
                    <button onClick={() => removeMeal(m.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0 }}>×</button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setTab("search")} style={{ width: "100%", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "white", border: "none", borderRadius: 16, padding: "15px", fontSize: 15, fontWeight: 900, cursor: "pointer", marginBottom: 10, boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
              + 음식 추가하기
            </button>
            <button onClick={() => {
              const text = `🥗 오늘 내 다이어트 기록\n${todayStr()} — ${totalCal.toLocaleString()} kcal / ${target.toLocaleString()} kcal\n${meals.slice(0, 4).map(m => `• ${m.name} ${m.cal}kcal`).join("\n")}\n\n내 오행 체질로 맞춤 다이어트 👉 jeomun.com/diet`;
              if (navigator.share) navigator.share({ title: "점운 다이어트", text }).catch(() => {});
              else window.location.href = `kakaotalk://msg/send?text=${encodeURIComponent(text)}`;
            }} style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", borderRadius: 16, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>
              📤 오늘 기록 공유하기
            </button>

            {/* 오행 맞춤 식단 팁 */}
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{ohData.emoji} {ohData.label} 맞춤 식단 가이드</p>
              <p style={{ margin: "0 0 6px", fontSize: 13, lineHeight: 1.6 }}>✅ 잘 맞는 음식: <span style={{ color: ohData.color }}>{ohData.good.join(", ")}</span></p>
              <p style={{ margin: "0 0 6px", fontSize: 13, lineHeight: 1.6 }}>⚠️ 줄여야 할 것: {ohData.avoid.join(", ")}</p>
              <p style={{ margin: 0, fontSize: 13, color: ohData.color, lineHeight: 1.6 }}>💡 {ohData.tip}</p>
            </div>
          </>
        )}

        {/* ── 검색 탭 ── */}
        {tab === "search" && (
          <>
            <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="음식 이름 검색 (예: 삼겹살, 콜라, 사과)"
              style={{ width: "100%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "14px 16px", fontSize: 15, color: "white", outline: "none", boxSizing: "border-box" as const, marginBottom: 14 }} />
            {searchQ.length === 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>자주 먹는 음식</p>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                  {["밥", "라면", "치킨", "커피", "과일", "빵", "계란", "김밥", "삼겹살"].map(k => (
                    <button key={k} onClick={() => setSearchQ(k)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 20, padding: "7px 14px", color: "rgba(255,255,255,0.75)", cursor: "pointer", fontSize: 13 }}>{k}</button>
                  ))}
                </div>
              </div>
            )}
            {searchResults.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {searchResults.map((f, i) => (
                  <button key={i} onClick={() => addMeal(f)} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 12, padding: "12px 16px", marginBottom: 6, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" as const }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "white" }}>{f.name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{f.unit} · {f.cat}</p>
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 900, color: ohData.color, flexShrink: 0, marginLeft: 10 }}>{f.cal} kcal</span>
                  </button>
                ))}
              </div>
            )}
            {searchQ.length > 0 && searchResults.length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, textAlign: "center", padding: "16px 0" }}>"{searchQ}" 검색 결과 없음</p>
            )}
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px", marginTop: 6 }}>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>DB에 없으면 직접 입력</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="음식 이름" style={{ flex: 2, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px", fontSize: 14, color: "white", outline: "none" }} />
                <input value={customCal} onChange={e => setCustomCal(e.target.value)} placeholder="kcal" type="number" style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px", fontSize: 14, color: "white", outline: "none" }} />
              </div>
              <button onClick={addCustom} disabled={!customName || !customCal} style={{ width: "100%", background: customName && customCal ? ohData.color : "rgba(255,255,255,0.1)", color: customName && customCal ? ohData.bg : "rgba(255,255,255,0.4)", border: "none", borderRadius: 10, padding: "10px", fontSize: 14, fontWeight: 700, cursor: customName && customCal ? "pointer" : "default" }}>
                추가하기
              </button>
            </div>
          </>
        )}

        {/* ── 프리미엄 탭 ── */}
        {tab === "premium" && (
          <>
            <div style={{ marginBottom: 16 }}>
              <p style={{ textAlign: "center", fontSize: 13, color: ohData.color, fontWeight: 900, marginBottom: 12 }}>
                💎 {ohData.emoji} {ohData.label} 체질 프리미엄 가이드
              </p>
              <div style={{ display: "flex", gap: 6, overflowX: "auto" as const, paddingBottom: 4 }}>
                {([
                  { key: "avoid", label: "🚫 금지 음식" },
                  { key: "exercise", label: "🏃 맞춤 운동" },
                  { key: "seasonal", label: "🍽️ 계절별 음식 추천" },
                  { key: "report", label: "📅 월별 리포트" },
                ] as { key: PremiumSub; label: string }[]).map(s => (
                  <button key={s.key} onClick={() => setPremiumSub(s.key)} style={{ flexShrink: 0, background: premiumSub === s.key ? ohData.color : "rgba(255,255,255,0.08)", color: premiumSub === s.key ? ohData.bg : "rgba(255,255,255,0.7)", border: premiumSub === s.key ? "none" : "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "7px 14px", fontSize: 13, fontWeight: premiumSub === s.key ? 900 : 400, cursor: "pointer", whiteSpace: "nowrap" as const }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 금지 음식 */}
            {premiumSub === "avoid" && (
              <div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 14, lineHeight: 1.6 }}>
                  {ohData.emoji} <strong>{ohData.label} 체질</strong>이 꼭 줄여야 할 음식 {OH_AVOID[oh].length}가지예요.
                </p>
                {(avoidShowAll ? OH_AVOID[oh] : OH_AVOID[oh].slice(0, 5)).map((item, i) => (
                  <div key={i} style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 900, color: "#fca5a5" }}>🚫 {item.name}</p>
                    <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{item.reason}</p>
                  </div>
                ))}
                {!avoidShowAll && (
                  <button onClick={() => setAvoidShowAll(true)} style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px", color: ohData.color, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                    ▼ 나머지 {OH_AVOID[oh].length - 5}개 더 보기
                  </button>
                )}
              </div>
            )}

            {/* 맞춤 운동 */}
            {premiumSub === "exercise" && (() => {
              const ex = OH_EXERCISE[oh];
              return (
                <div>
                  <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>💡 최적 운동 시간 & 팁</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#a5b4fc", fontWeight: 700, lineHeight: 1.6 }}>{ex.tip}</p>
                  </div>
                  {ex.best.map((item, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: ohData.color }}>{item.name}</p>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", flexShrink: 0, marginLeft: 8 }}>{item.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{item.effect}</p>
                    </div>
                  ))}
                  <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 12, padding: "12px 14px", marginTop: 4 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 12, color: "#fca5a5" }}>⚠️ 이건 피하세요</p>
                    <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>{ex.avoid}</p>
                  </div>
                </div>
              );
            })()}

            {/* 이 계절 */}
            {premiumSub === "seasonal" && (() => {
              const seasonData = OH_SEASONAL[oh][selectedSeason];
              return (
                <div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    {SEASONS.map(s => (
                      <button key={s} onClick={() => setSelectedSeason(s)} style={{ flex: 1, background: selectedSeason === s ? ohData.color : "rgba(255,255,255,0.08)", color: selectedSeason === s ? ohData.bg : "rgba(255,255,255,0.6)", border: selectedSeason === s ? "none" : "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 0", fontSize: 12, fontWeight: selectedSeason === s ? 900 : 400, cursor: "pointer" }}>
                        {SEASON_EMOJI[s]} {s}
                      </button>
                    ))}
                  </div>
                  <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#a5b4fc", fontWeight: 700, lineHeight: 1.6 }}>💡 {seasonData.tip}</p>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 10 }}>{SEASON_EMOJI[selectedSeason]} {selectedSeason} {ohData.emoji} {ohData.label} 체질 추천 음식</p>
                  {seasonData.best.map((item, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 900, color: ohData.color }}>✅ {item.name}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>{item.reason}</p>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* 월별 리포트 */}
            {premiumSub === "report" && (
              <div>
                {allDays.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.35)" }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>📅</div>
                    <p style={{ margin: 0, fontSize: 14 }}>아직 기록이 없어요.<br />오늘부터 음식을 기록해보세요!</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                      {[
                        { label: "평균 칼로리", value: `${monthAvg.toLocaleString()} kcal`, color: ohData.color },
                        { label: "목표 달성일", value: `${goodDays}일`, color: "#4ade80" },
                        { label: "초과일", value: `${overDays}일`, color: "#f87171" },
                      ].map(stat => (
                        <div key={stat.label} style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                          <p style={{ margin: "0 0 4px", fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{stat.label}</p>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: stat.color }}>{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    {top3.length > 0 && (
                      <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px", marginBottom: 16 }}>
                        <p style={{ margin: "0 0 10px", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>🍴 자주 먹는 음식 TOP 3</p>
                        {top3.map(([name, cnt], i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>#{i + 1} {name}</span>
                            <span style={{ fontSize: 13, color: ohData.color, fontWeight: 700 }}>{cnt}회</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>최근 30일 기록</p>
                    {allDays.slice(0, 10).map(([date, log]) => {
                      const cal = log.totalCal || 0;
                      const r = Math.min(100, Math.round((cal / target) * 100));
                      return (
                        <div key={date} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "10px 14px", marginBottom: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 13 }}>{date} {log.weight ? `· ⚖️ ${log.weight}kg` : ""}</span>
                            <span style={{ fontSize: 13, fontWeight: 900, color: r >= 105 ? "#f87171" : ohData.color }}>{cal.toLocaleString()} kcal</span>
                          </div>
                          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 99, height: 5 }}>
                            <div style={{ width: `${r}%`, height: "100%", background: r >= 105 ? "#f87171" : ohData.color, borderRadius: 99 }} />
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* ── 기록 탭 ── */}
        {tab === "history" && (
          <>
            {/* 7일 차트 */}
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 14px", marginBottom: 16 }}>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.55)" }}>📊 7일 칼로리 현황</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                {weekDays.map(d => {
                  const cal = historyData[d]?.totalCal || 0;
                  const barH = cal > 0 ? Math.max(6, Math.round((cal / weekMax) * 72)) : 4;
                  const isToday = d === todayStr();
                  const overTarget = cal > target;
                  const dayLabel = d.slice(8);
                  return (
                    <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 9, color: overTarget && cal > 0 ? "#f87171" : "rgba(255,255,255,0.35)" }}>
                        {cal > 0 ? `${Math.round(cal / 100) * 100}` : ""}
                      </span>
                      <div style={{ width: "100%", height: barH, background: cal === 0 ? "rgba(255,255,255,0.1)" : overTarget ? "#f87171" : ohData.color, borderRadius: 4, opacity: isToday ? 1 : 0.7 }} />
                      <span style={{ fontSize: 10, color: isToday ? ohData.color : "rgba(255,255,255,0.45)", fontWeight: isToday ? 900 : 400 }}>{dayLabel}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                <span>목표: {target.toLocaleString()} kcal</span>
                <span>■ <span style={{ color: ohData.color }}>목표 이내</span> &nbsp; ■ <span style={{ color: "#f87171" }}>초과</span></span>
              </div>
            </div>

            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>최근 30일 기록</p>
            {Object.keys(historyData).length === 0 ? (
              <div style={{ textAlign: "center", padding: "36px 0", color: "rgba(255,255,255,0.35)" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>📊</div>
                <p style={{ margin: 0, fontSize: 14 }}>아직 기록이 없어요</p>
              </div>
            ) : (
              Object.entries(historyData)
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 30)
                .map(([date, log]) => {
                  const cal = log.totalCal || (log.meals || []).reduce((s, m) => s + m.cal, 0);
                  const r = Math.min(100, Math.round((cal / target) * 100));
                  return (
                    <div key={date} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{date}{log.weight ? ` · ⚖️${log.weight}kg` : ""}</span>
                        <span style={{ fontSize: 13, fontWeight: 900, color: r >= 105 ? "#f87171" : ohData.color }}>{cal.toLocaleString()} kcal</span>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 5 }}>
                        <div style={{ width: `${r}%`, height: "100%", background: r >= 105 ? "#f87171" : ohData.color, borderRadius: 99 }} />
                      </div>
                      <div style={{ marginTop: 5 }}>
                        {(log.meals || []).slice(0, 3).map((m, i) => (
                          <span key={i} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginRight: 8 }}>{m.name} {m.cal}kcal</span>
                        ))}
                        {(log.meals || []).length > 3 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>+{(log.meals || []).length - 3}개</span>}
                      </div>
                    </div>
                  );
                })
            )}

            <div style={{ marginTop: 18, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "18px 16px", textAlign: "center" }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 900, color: "#f3f4f6" }}>🔮 건강 체질이 걱정된다면?</p>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>사주로 건강운 흐름을 분석하면<br />내 몸이 왜 이런지 답이 나와요.</p>
              <Link href="/main-v2" style={{ display: "block", background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "white", textDecoration: "none", borderRadius: 14, padding: "12px", fontWeight: 900, fontSize: 14, boxShadow: "0 4px 16px rgba(99,102,241,0.4)" }}>
                건강운 사주로 확인하기 — 990원 →
              </Link>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "8px 0 0" }}>단 1회 결제 · 반복청구 없음</p>
            </div>
          </>
        )}
      </div>

      {/* 푸터 */}
      <footer style={{ padding: "24px 20px 110px", textAlign: "center" }}>
        <div style={{ maxWidth: 380, margin: "0 auto", padding: "18px 16px", borderRadius: 20, background: "#0a0020", border: "1px solid rgba(255,255,255,0.15)" }}>
          <p style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, margin: "0 0 8px" }}>© 2026 점운 · Powered by 점운</p>
          <div style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.8, marginBottom: 12 }}>
            <p style={{ margin: 0 }}>대표 장문정 · 상호 기획의신 · 사업자등록번호 773-60-00359</p>
            <p style={{ margin: 0 }}>통신판매번호 제 2020-서울강남-01681호</p>
            <p style={{ margin: 0 }}>서울특별시 강남구 선릉로86길 38, 7층 7017호(대치동)</p>
            <p style={{ margin: "4px 0 0", color: "#f87171", fontWeight: 900, fontSize: 10 }}>※ 전화 문의는 받지 않습니다. 카카오톡으로 문의해 주세요.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, justifyContent: "center", marginBottom: 10 }}>
            <a href="http://pf.kakao.com/_xbwtPX/chat" target="_blank" rel="noopener noreferrer" style={{ padding: "6px 14px", background: "#FEE500", color: "#1a1a1a", borderRadius: 20, textDecoration: "none", fontWeight: 900, fontSize: 11 }}>💬 카카오톡 문의</a>
            <a href="mailto:info@jeomun.com?subject=점운 문의" style={{ padding: "6px 14px", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, color: "#e2e8f0", textDecoration: "none", fontWeight: 700, fontSize: 11 }}>📧 이메일 문의</a>
          </div>
          <div style={{ fontSize: 10, display: "flex", justifyContent: "center", gap: 10 }}>
            <a href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>이용약관</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <a href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>개인정보처리방침</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <a href="/refund" style={{ color: "#94a3b8", textDecoration: "none" }}>환불정책</a>
          </div>
        </div>
      </footer>

      {/* 하단 탭바 (4개) */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex" }}>
        {([
          { key: "today", label: "오늘", emoji: "🍽️" },
          { key: "search", label: "음식 검색", emoji: "🔍" },
          { key: "premium", label: "프리미엄", emoji: "💎" },
          { key: "history", label: "기록", emoji: "📊" },
        ] as { key: Tab; label: string; emoji: string }[]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, background: "none", border: "none", color: tab === t.key ? ohData.color : "rgba(255,255,255,0.45)", cursor: "pointer", padding: "10px 0 16px", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 3, fontSize: 10, fontWeight: tab === t.key ? 900 : 400 }}>
            <span style={{ fontSize: 20 }}>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
