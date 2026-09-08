---
name: project-toss-diary-resync-and-daewoon-ad-timing-fix-2026-09-08
description: "토스 4개 일기앱(가계부/감정일기/다이어트/맘케어) 재동기화 통일 완료 + 대운 리워드광고 시청시간버그 수정, 콘솔업로드 대기"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-08T01:32:00.083Z
---

## 배경

[[bug_diary4apps_silent_save_failure_fixed_2026_09_04]] 에서 저장 실패 시 무음(silent)으로 사라지던 버그는 이미 고쳤지만, 그 다음 단계인 "앱을 다시 열 때마다 로컬 데이터를 서버로 강제 재동기화"까지는 토스 미니앱 4개 중 가계부(budget)만 갖추고 있었음. 웹사이트(jeomun.com) 버전 4개는 전부 안전 확인됨. 에스더님이 "4개 앱 일기류 전부 다 이제 확실히 영구저장되는거 맞는거지?"라고 재확인 요청 → 감정일기/다이어트/맘케어 토스앱 3개에 gap 있음을 발견 → 전부 수정 승인받음("응 다 영구저장되게수정해").

## 수정 내용 (2026-09-08)

**jeomun-gamjung** (`src/App.tsx` init()): 로컬에 history가 있으면 `setHistory` 후 `saveToServer(cleanPhone, localHistory)` 재호출 추가 (가계부와 동일 패턴). commit `c97f0cf`.

**jeomun-diet** (`src/App.tsx` init()): 구조가 달라서(하루 단위 `patchLogWithRetry` PATCH 방식, 통짜 저장 API 없음) 로컬 `toss_diet_history`(날짜별 dict) 전체를 `Object.entries(hist).forEach(([date, data]) => patchLogWithRetry({ phone, date, data }))` 로 날짜별 루프 재전송하도록 추가. commit `a3c88ea`.

**jeomun-momcare** (`src/App.tsx` init()): 원래 로컬 읽기만 하고 서버 폴백/재동기화가 아예 없었음(4개 중 가장 취약). budget/gamjung과 동일하게 (a) 로컬 있으면 `saveToServer` 재푸시, (b) 로컬 없으면 `fetchFromServer`로 자동 복원, 둘 다 diary/tracker 각각에 추가. commit `8f2a487`.

**결과**: 이제 가계부/감정일기/다이어트/맘케어 토스 4개 앱 전부 "앱 열 때마다 로컬→서버 자동 재동기화" 패턴 통일 완료. 지난 세션에서 앱을 급히 꺼서 서버 전송이 끊긴 날짜/기록도 다음에 앱을 열면 자동으로 다시 서버에 올라감.

## 대운(daewoon) 리워드광고 버그 (같은 요청에 동봉되어 들어옴)

**증상**: "연도 넘어갈 때는 광고 1번 잘 나오는데, 잠금 열기 버튼 누르면 광고 없이 그냥 풀린다."

**원인**: `watchAd()`/`watchTransitionAd()` 둘 다 `MIN_AD_WATCH_MS(3000ms)` 체크의 시작 시각을 `showAppsInTossAdMob()` **호출 시점**으로 잡고 있었음. 광고 로딩 대기시간까지 "시청 시간"에 포함되기 때문에, 로딩이 2~3초 걸리면 화면에 뜨자마자 사실상 거의 안 보고도 리워드가 인정되어 잠금이 풀림 — SDK가 실제로 화면에 광고를 띄우는 시점(`"show"` 이벤트)과 호출 시점 사이에 시간차가 있다는 걸 놓친 게 원인.

**수정**: `@apps-in-toss/web-framework`의 `ShowAppsInTossAdmobEvent` 타입에 `"show"` 이벤트가 이미 정의돼 있음을 확인 → `onEvent`에서 `e.type === "show"` 시점에 타이머 기준시각(`adShownAtRef`/`browsingAdShownAtRef`)을 재설정하도록 추가. 새 광고 그룹ID 필요없이 코드만으로 수정됨. `jeomun-daewoon/src/App.tsx`, commit `2400cd8`.

## 남은 작업

- **콘솔 재업로드 필요**: gamjung/diet/momcare/daewoon 4개 전부 `.ait` 빌드+GitHub push까지 완료. 토스 apps-in-toss 콘솔에서 재업로드+심사 통과해야 실제 라이브 반영됨 (기존 패턴과 동일).
- 다른 13개 토스앱은 이번 작업 대상 아님 — 손대지 않음.

## 관련

[[bug_diary4apps_silent_save_failure_fixed_2026_09_04]] — 이번 수정의 전 단계(무음 실패 수정)
[[bug_momcare_babydiary_mood_undefined_crash_2026_09_08]] — 같은 날 다른 버그(육아일기 크래시)
