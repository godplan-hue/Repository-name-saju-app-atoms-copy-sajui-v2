---
name: project_mbti_toss_all15_ad_unlock_2026_08_29
description: 토스 MBTI(jeomun-mbti) 심층분석 15개 전부 광고로도 풀리게 전환 — 결제 1개(핑크버튼)만 유지
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-29T09:16:18.987Z
---

에스더님 결정 (2026-08-29): 토스 MBTI 앱에서 하루 14명 DB 유입은 있지만 990원 결제 전환은 낮을 것으로 판단 → 심층분석 15개 항목을 결제 없이도 리워드광고(개당 50원, 15개 다 보면 약 750원)로 전부 풀 수 있게 전환.

**파일**: `C:\Users\moon6\OneDrive\바탕 화면\jeomun-mbti\src\App.tsx` (토스 미니앱 별도 저장소 — jeomun.com 웹앱 `app/mbti/`와는 다른 코드베이스, 혼동 주의)

## 수정 내용
- 심층분석 14개 항목 중 `paidOnly: true`였던 11개(career/love/worstMatchIntro/worstMatchTop3/celebTwin/tetoEgen/bundle/moneyStyle/pastLife/darkSide/workVsReal)에서 `paidOnly` 제거 → 기존 3개(stress/relation/growth)와 동일하게 "🆓 무료로 열어보기 →" 광고버튼으로 통일
- 강점/주의할점(traits) 섹션은 이미 광고버튼이었음 — 변경 없음
- 상단 배너 + 하단 "전체 한 번에 열기" 카드 텍스트를 2줄로 분리: "💳 결제하면 15개가 한번에 열려요" / "⏱ 24시간 동안 계속 볼 수 있어요"
- **1개만 결제전용으로 남김**: 연애 HOT 카드(핑크 그라디언트 #ec4899/#f472b6, "⚡ 결정적 신호 1개 발견" 블러 티저) — 에스더님이 명시적으로 "궁금하게 만들고 결제하게 만드는 버튼은 그대로 두자"고 확정
- 하단 "전체 한 번에 열기" 990원 일괄결제 버튼도 그대로 유지 (급한 유저용 결제 경로는 남겨둠)

**Why**: 무료 MBTI 앱 유입 유저는 990원 결제 전환율이 낮음 — 광고 수익(개당 50원)이 오히려 더 확실하고, 광고로 다 풀어줘도 인기(순위)에 도움이 됨.
**How to apply**: 이후 다른 무료 유입형 토스앱(궁합/행운번호/펫운 등)도 유료전환율 낮다고 판단되면 이 패턴(핑크 결제유도 카드 1개만 남기고 나머지는 전부 광고unlock)을 참고할 것. 빌드(`ait build`)와 콘솔 재업로드는 아직 안 함 — 사용자가 직접 진행.
