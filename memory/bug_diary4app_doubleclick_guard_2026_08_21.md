---
name: bug-diary4app-doubleclick-guard-2026-08-21
description: "일기형 4앱(감정일기/가계부/다이어트/육아일기) 웹+토스 전수점검 결과 감정일기만 저장버튼 연타방지 가드 있었음 — 나머지 3개(6곳)에 동일 가드 추가 (2026-08-21)"
metadata:
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
---

**배경**: 일기류 4개 앱(감정일기/가계부/다이어트/육아일기)에 대해 웹(jeomun.com)과 토스 미니앱 양쪽 다 영구저장·잠금해제 로직 최종점검 요청받음. 저장 자체는 문제없었음(Firebase tossSet+putWithRetry 이중저장 정상, 잠금 로직도 [[bug_momcare_7subpages_unlock_check_2026_08_21]] 수정 이후 정상) — 다만 점검 중 `jeomun-gamjung`(감정일기)만 `submitting` state + `disabled={submitting}` 연타방지 가드가 있고, 나머지 budget/diet/momcare 6곳(웹3+토스3)엔 저장함수에 아무 가드가 없다는 걸 발견해서 보고.

**조치**: 아직 실제로 터진 버그는 아니라서(에스더님 확인: "지금 실제로 문제가 터진 건 아니라서") gamjung과 같은 무거운 `submitting` state 방식 대신, 가벼운 `useRef` 재진입 차단 방식으로 6곳 전부 추가:
```js
const xxxSavingRef = useRef(false);
function xxx() {
  if (xxxSavingRef.current) return;
  xxxSavingRef.current = true;
  setTimeout(() => { xxxSavingRef.current = false; }, 500);
  ... 기존 로직 ...
}
```
- 웹: `app/budget/page.tsx`(addEntry), `app/diet/page.tsx`(saveWeight), `app/momcare/baby-diary/page.tsx`(submit) — commit `29958e6`
- 토스: `jeomun-budget`(addEntry) commit `6cf2a6a`, `jeomun-diet`(saveWeight) commit `e864bc3`, `jeomun-momcare`(addDiaryEntry) commit `c68281c`

**Why**: gamjung은 UI에도 버튼 비활성화 표시("분석 중...")가 있는 반면, 이번 3개는 UI 변화 없이 순수 방어코드만 추가 — 요청 범위를 최소화하기 위해 의도적으로 다른 패턴 사용.

**How to apply**: 새 일기형 앱을 만들 때 저장 함수엔 처음부터 이 useRef 가드 패턴을 기본으로 넣을 것. `app/momcare/daily-tracker/page.tsx`의 `addLog()`(수유/기저귀/유축/기분 4버튼)는 이번 스코프에 포함 안 됨 — 명시적 요청 없었으므로 건드리지 않음, 필요시 별도 확인 후 진행.
