---
name: project-budget-ad-retry-timeout-fix
description: "가계부(jeomun-budget) 토스미니앱 광고 준비안됨 오탐+코인미지급 버그 수정, 빌드까지 완료"
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-28T07:24:39.569Z
---

## 문제 (2026-08-28)

에스더님 신고: "가게부 지금 모든 광고가 준비안됐다는 글같은게 계속 떠 그리고 실제로 광고가 나와도 끝나면 처리안되고 광고안됫다 이러고 코인도 안주고 전체 광고 안돼"

## 원인 (gamjung/jeomun-gamjung과 비교해서 발견)

1. **재시도 로직 없음** — `watchAdToUnlock`/`doAttendance`/`watchAdForCoins` 3곳 모두 `failedToShow`/`onError` 발생 시 바로 실패 알림. gamjung은 1.5초 간격 최대 4회 재시도 후에야 포기.
2. **8초 타임아웃이 너무 짧음** — 실제 광고 로딩+재생은 8초 넘게 걸리는 경우가 흔한데, 8초 지나면 무조건 fail() 처리. 광고가 끝까지 잘 재생돼도 dismissed 이벤트가 8초보다 늦게 오면 이미 실패 처리된 뒤라 코인이 안 나감.
   - 참고: 예전엔 8초 타임아웃시 그냥 코인을 줬는데(관대), [[bug_coin_double_reward_gamjung_budget_fix_2026_08_22]]류의 코인 부정지급 버그를 막으려고 commit `3012582`에서 타임아웃시 실패 처리로 바꾼 것 — 그 부작용으로 이번 버그 발생.

## 수정 내용

`jeomun-budget/src/App.tsx` — `watchAdToUnlock`, `doAttendance`, `watchAdForCoins` 3곳:
- `failedToShow`/`onError` → 즉시 실패 대신 `attempt()`/`retryOrFail()` 패턴으로 1.5초 간격 최대 4회 재시도
- 타임아웃 8000ms → 20000ms로 연장
- 재시도 다 소진해도 반응 없으면 여전히 `fail()` (코인 지급 안 함) — 부정지급 버그는 재발 안 하도록 유지

commit `41eea9c` — "가계부: 광고 재시도(4회) + 타임아웃 20초로 연장 - 준비안됨 오탐/코인 미지급 버그 수정"
**푸시는 안 함** — 로컬 커밋만 완료.

## 빌드

`npm install` (node_modules 없었음) → `npx tsc --noEmit` 통과 → `npm run build`(=`ait build`) 성공.
결과물: `jeomun-budget/budget-jeomun.ait` (재생성됨, git에도 커밋됨).

**Why:** 8초 타임아웃과 무재시도 조합이 실제 광고 재생시간을 못 버텨서 정상 시청도 실패 처리되던 것.
**How to apply:** 다른 토스미니앱(직운 등)에도 동일한 8초-타임아웃+무재시도 패턴이 있을 수 있음(`jeomun-jigun`의 `watchAdToUnlock`도 동일 패턴 확인됨) — 단, 명시적 요청 없이는 손대지 말 것 (요청범위만 수정 원칙).
