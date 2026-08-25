---
name: bug-budget-gamjung-entries-restore-and-missing-analytics-2026-08-23
description: 가계부·감정일기 내역복구 버그 수정 + 펫운·별자리·꿈해몽 로그(Analytics) 누락 발견+추가, 재빌드 대상 8개앱 확정
metadata:
  type: project
---

## 배경
[[bug_budget_cloudflare_empty_useragent_block_2026_08_23]] 에서 6개앱(MBTI/다이어트/감정일기/맘케어/펫운/별자리) apex→www CORS 저장버그를 고친 뒤에도, 에스더님이 가계부는 "저장한 게 다 사라지고 코인도 다시 채워지고 24시간도 사라진다"고 계속 보고함. 가계부는 이미 www 도메인을 쓰고 있어서 그 버그 대상이 아니었음 → 별개의 새 버그로 재조사.

## 버그 1 — 가계부(budget) 내역 복구 로직 오류
**파일**: `jeomun-budget/src/App.tsx` init useEffect
**원인**: `if (entriesStr)` 로 로컬 저장소 값의 "존재 여부"만 체크 — `entriesStr`가 `"[]"`(빈 배열 문자열)이어도 truthy라서 "로컬에 데이터 있음"으로 취급하고 서버(DB) 조회 자체를 스킵함.
**결과**:
1. 로컬이 어떤 이유로든 빈 배열이 되면 서버에 실제 저장된 내역이 있어도 절대 안 보임
2. 그 상태에서 새 항목을 추가하면 `saveToServer`가 `{userId, entries}`를 통째로 덮어쓰기(POST가 `.set()`이라 전체교체) 때문에 서버의 기존 데이터까지 지워질 위험 있었음
**수정**: `entriesStr`를 파싱해서 실제 배열 길이(`localEntries.length > 0`)로 판단하도록 변경. 로컬이 비어있으면 무조건 서버(`fetchFromServer`)에서 복구 시도.
**커밋**: `b6a8a68` (jeomun-budget)

## 버그 2 — 감정일기(gamjung)도 동일한 버그
**파일**: `jeomun-gamjung/src/App.tsx` init useEffect
**원인**: `if (histStr) {...} else {fetchFromServer...}` — 가계부와 완전히 동일한 패턴. `histStr === "[]"`면 fetchFromServer 자체를 안 탐.
**수정**: 가계부와 동일하게 파싱 후 length 체크로 변경.
**커밋**: `5b197df` (jeomun-gamjung)

## 확인함 — 맘케어(momcare)는 이 버그 없음
`jeomun-momcare/src/App.tsx`는 init에서 자동 서버복구를 아예 안 하고, "재등록(registerMode)" 버튼을 눌렀을 때만 `fetchFromServer`로 복구하는 구조([[feedback_diary_app_firebase_rule]] — 일기형 앱은 자동복원 대신 수동 동기화 버튼 방식이 의도된 설계). 그래서 이 "빈배열이 서버조회를 막는" 버그 패턴 자체가 없음. 추가 수정 안 함.

## 발견 2 — 펫운·별자리·꿈해몽 3개 앱에 로그(Analytics)가 아예 없었음
`Analytics.screen`/`Analytics.click` grep 결과 17개 토스앱 중 14개는 있었는데, **petun/zodiac/haemong 3개는 `@apps-in-toss/web-framework` import 줄에 `Analytics` 자체가 없었음** — 방문자 이탈지점 추적이 원천적으로 안 되고 있던 상태. 콘솔 업로드 문제나 앱 잘못 진입한 문제가 아니라 애초에 소스코드에 로그 심는 코드가 없었던 것 (다른 14개 앱은 처음 만들 때부터 있었음).
**수정**: 3개 앱 모두 `Analytics` import 추가 + `step`(펫운/별자리) 또는 `step+view`(꿈해몽) 상태값 기준으로 화면 진입 로그(`Analytics.screen`) 추가.
**커밋**: 꿈해몽 `6be7331`, 별자리 `d376325`, 펫운 `0a1e416`

## 최종 재빌드+재업로드 대상 — 8개 (2026-08-23 기준)
| 앱 | 이유 |
|---|---|
| 가계부 | 내역복구 버그 |
| 감정일기 | CORS버그 + 내역복구 버그 (2가지 다) |
| MBTI | CORS버그 |
| 육아일기(맘케어) | CORS버그 |
| 다이어트 | CORS버그 (이미 출시됨에도 대상) |
| 펫운 | CORS버그 + 로그 추가 |
| 별자리 | CORS버그 + 로그 추가 |
| 꿈해몽 | 로그 추가만 (CORS버그 대상 아님 — Firebase 직접저장 구조) |

**재업로드 필요 없음**: 오늘운세(CORS버그 대상 아님), 직운·합격(Firebase 직접저장이라 이 버그들과 무관)

## 릴리스 상태 (에스더님 확인, 2026-08-23)
- 이미 출시됨: 다이어트, 오늘운세, 직운, 합격
- 승인요청중: 감정일기, MBTI, 육아일기
- 가계부·펫운·별자리: 상태 미확인 (제출 전으로 추정)
- **주의**: 승인요청중인 3개 앱을 심사 중에 새 빌드로 교체 가능한지는 토스 콘솔 정책이라 확인 안 됨 — 에스더님이 콘솔에서 직접 확인 필요.

## 이번 세션에서의 내 실수 (기록)
curl로 `/api/budget` 직접 테스트하다가 실제 에스더님 전화번호(01021062689) 가계부 DB에 테스트 데이터 2건을 실수로 덮어씀 (POST가 entries 배열을 통째로 교체하는 구조라서). 즉시 발견해서 원래 데이터로 복구 완료했고, 에스더님께 바로 실토함. **교훈**: 실제 고객 DB에 테스트 POST 절대 하지 말 것 — 반드시 더미 ID 쓰거나, 부득이하면 GET으로 기존값 백업 후 테스트.
