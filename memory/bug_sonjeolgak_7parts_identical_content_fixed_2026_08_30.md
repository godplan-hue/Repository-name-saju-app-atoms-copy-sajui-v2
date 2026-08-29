---
name: bug-sonjeolgak-7parts-identical-content-fixed-2026-08-30
description: 손절각 7개 관계 카테고리(친구/연인/전애인/썸/직장/가족/여행) 결과가 사실상 동일했던 버그 원인+수정 완료
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-29T22:05:36.880Z
---

에스더님이 손절각(웹) 990원 결제 테스트 중 "7개 카테고리 결과가 비슷해보인다"고 발견 → 코드 확인 결과 진짜 버그였음.

**원인**: `type.desc.replaceAll("관계", ...)` 딱 한 곳만 part(관계 종류)를 반영했고, 나머지 11개 필드(pastPattern/warningSigns/recoveryTip/futureForecast/actionPlan/darkSide/breakupStyle 등)는 전부 점수(score)로만 결정 → 같은 점수면 친구든 연인이든 결과가 사실상 동일했음.

**수정 (2026-08-30, 에스더님 명시적 승인 후 진행)**: `PART_CONTEXT` 레코드(7개 관계별 noun/scene/signalHint/tipHint/futureHint/planHint/darkHint/endHint)를 만들어 기존 문장에 prepend/append로 엮어 넣는 방식. 배열 길이(warningSigns=3, actionPlan=3)는 결과지 UI("위험 신호 3가지"/"액션플랜 3단계" 하드코딩) 때문에 그대로 유지 — index만 관계별로 치환.

**적용 범위**:
- 점운 웹앱: `app/api/sonjeolgak/analyze/route.ts` — commit `6bbedc96`, 푸시완료
- 토스 미니앱: `jeomun-sonjeolgak/src/sonjeolgakResult.ts` (웹과 동일 로직 클라이언트 이식본) — commit `1299357`, 빌드(.ait)+푸시 완료, **토스 콘솔 재업로드 필요**

**How to apply**: 결제창(`pay/page.tsx`)이나 결과지 렌더링 파일은 에스더님이 명시적으로 건들지 말라고 해서 손대지 않음 — 콘텐츠 계산 로직만 수정. 향후 다른 앱(예: 궁합, MBTI)에서도 "카테고리별 결과가 비슷하다"는 피드백이 나오면 같은 패턴(단일 필드만 파라미터 반영, 나머지는 점수만 의존)이 있는지부터 의심해볼 것.
