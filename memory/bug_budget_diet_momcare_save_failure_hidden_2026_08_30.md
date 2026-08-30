---
name: bug-budget-diet-momcare-save-failure-hidden-2026-08-30
description: "가계부/다이어트/맘케어(7서브페이지) 저장이 서버에 실패해도 화면엔 항상 저장됨으로 표시되던 버그, 10곳 전부 수정"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-30T01:57:57.257Z
---

**문제**: `lib/postWithRetry.ts`는 4회 재시도 후 최종 성공/실패를 `Promise<boolean>`으로 정확히 반환하는데, 이걸 호출하는 10곳(budget 1 + diet 2 + momcare 7서브페이지 8곳)이 전부 `postWithRetry(...)`만 호출하고 결과를 확인 안 함(fire-and-forget). 반면 `localStorage.setItem`+`setState`는 항상 동기적으로 성공하므로, Firebase 서버 저장이 실제로 실패해도 사용자 화면엔 항상 정상 저장된 것처럼 보임.

**원인**: postWithRetry 자체는 버그 없음 — 계약(return true/false)은 맞음. 문제는 모든 호출부가 반환값을 무시한 것.

**수정** (commit `6f6e77b1`, 2026-08-30): 각 파일에 `syncFailed` state 추가 → `postWithRetry(...).then(ok => setSyncFailed(!ok))`로 결과 반영 → 실패 시 빨간 경고 배너("서버 저장 실패 — 이 기기에만 저장됨") 렌더. 기존 `!hasPhone` 경고배너 스타일 그대로 재사용(budget/diet엔 이미 있던 패턴, momcare 7개엔 새로 추가).

**적용 파일 (9개, 10 호출부)**:
- `app/budget/page.tsx` (saveEntries)
- `app/diet/page.tsx` (saveToday, saveWeight)
- `app/momcare/baby-diary/page.tsx`, `baby-words/page.tsx`, `daily-tracker/page.tsx`, `growth-diary/page.tsx`, `memory-journal/page.tsx`, `time-capsule/page.tsx` (각 1곳)
- `app/momcare/growth-calendar/page.tsx` (2곳 — 프로필저장 + 초기화버튼)

**공유 컴포넌트/헬퍼 새로 안 만듦** — CLAUDE.md "새 파일은 명시적 요청시만" 원칙에 따라 각 파일에 인라인으로 개별 적용.

**확인**: `npx tsc --noEmit` clean, commit+push 완료.

**Why**: 에스더님이 원인을 직접 못 찾아서 "니가 찾아다하니이것들도다수정해잘되게"라고 위임 — 명시적 재현정보 없이 코드 레벨에서 근본원인 추적해서 수정.

**How to apply**: 앞으로 momcare에 새 서브페이지가 postWithRetry를 쓰게 되면 이 패턴(syncFailed state + .then() + 경고배너) 그대로 적용할 것.

관련: [[bug_gwangyeoradar_payment_record_loss_and_overopen_2026_08_30]] [[bug_mbti_tarot_petun_zodiac_payment_record_loss_2026_08_30]]
