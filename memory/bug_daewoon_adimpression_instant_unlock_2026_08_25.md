---
name: bug-daewoon-adimpression-instant-unlock-2026-08-25
description: "대운 앱 잠금해제 광고가 뜨자마자 바로 잠금해제되던 버그 - adImpression을 성공조건에 넣은 게 원인, 특정 대운기간 문제 아니라 전체 공통"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-25T04:16:49.515Z
---

## 문제

사용자가 대운 결과지에서 "지금 열어보기" 눌렀는데 광고 없이 바로 열림 신고. 처음엔 경신 하나만 그런 줄 알았으나, 확인 요청 중 사용자가 신유·기미·정사·병진 등 여러 대운기간에서 계속 같은 현상 재현 확인 → 특정 기간 문제가 아니라 **전체 공통 버그**였음.

## 원인

`jeomun-daewoon/src/App.tsx`의 `watchAd()` 함수(잠금해제 광고 콜백) 성공조건에 `"adImpression"`이 포함돼 있었음:
```
if (e.type === "dismissed" || e.type === "adClosed" || e.type === "adImpression") { unlockIdx(idx); ... }
```
`adImpression`은 광고를 다 보고 닫았을 때가 아니라 **광고 노출이 시작된 시점**(화면에 뜨는 순간)에 발생하는 이벤트. 그래서 광고가 제대로 보이기도 전에 즉시 성공 처리되어 바로 잠금해제됨 — 사용자 눈엔 "광고 안 뜨고 바로 열린다"로 보임.

[[bug_tarot_gunghap_cloudflare_waf_block_2026_08_25]]와 별개 건이지만 같은 세션에서 발견. 타로 앱은 이미 이전 세션(4차 수정, `0b78ad9`)에서 같은 패턴을 발견해 `adImpression`을 제거했었는데, 대운 앱엔 그 수정이 반영 안 돼 있었음.

## 수정 완료

`watchAd()` 성공조건에서 `"adImpression"` 제거 → `dismissed`, `adClosed`만 남김. 나머지(`failedToShow`, onError)는 광고 실패 시 잠금해제하는 fallback 로직이라 그대로 유지.

- 커밋: `da007d5`
- 빌드: `daewoon-jeomun.ait`, deploymentId `01a036d7-bf95-757f-849d-e0099d536690`

## 추가 수정 (같은날, adImpression 제거만으로는 해결 안 됨)

사용자가 `da007d5` 재업로드 후에도 "대운아직도광고안나와" 반복 신고. "지금 열어보기" 눌러도 안뜬다고 특정. 추가로 3차례 더 파서 진짜 원인 확인:

1. **`bd1572d`** — `watchAd()`의 `failedToShow`/`onError` 분기가 잠금은 풀어주면서 광고슬롯 재적재(`loadFullScreenAd`)를 안 하고 있었음. 한번 실패하면 그 뒤로 슬롯이 계속 빈 채로 남음. ([[bug_tarot_gunghap_cloudflare_waf_block_2026_08_25]]에서 타로에 적용한 `14d3b4a` 패턴과 동일)
2. **`48ee5cd`** — 대운기간(selectedIdx) 바꿀 때마다 미리 광고를 채워두는 프리로드 추가.
3. **`35fb2d2`** — `watchAd()`가 슬롯 준비여부를 확인 안 하고 무조건 `showFullScreenAd`부터 호출 → 슬롯이 비어있으면 아무 이벤트도 안 오고 8초짜리 안전장치(`fsTimer`)가 조용히 잠금만 풀어버림 → 사용자 눈엔 "광고 안 뜨고 바로 열림"으로 보임. SDK 번들 소스(`node_modules/@apps-in-toss/web-framework/dist/prebuilt/*.js`)를 직접 읽어서 `loadFullScreenAd`가 실제로 로드완료 시 `{type:"loaded"}` 이벤트를 쏘는 걸 확인 → `adReadyRef` 추가해서 이 이벤트로만 true 세팅, `watchAd()`는 `adReadyRef.current`가 true일 때만 바로 보여주고, false면 즉시 재로드 후 `loaded` 콜백(최대 4초 대기) 받고서야 보여주도록 변경.
   - 빌드: deploymentId `01a036ef-1c2a-773d-be17-450ff8710268`
   - **이후 `b336350`에서 `48ee5cd` 로직으로 되돌림 — `35fb2d2`는 최종본 아님.** 최종 상태는 이전 세션 기록 참고.

### ⛔ 추가 확인 필요 (2026-08-25 후반)

대운도 타로와 같은 함정에 빠졌을 수 있음 — 코드 수정(`da007d5`→`bd1572d`→`48ee5cd`→`b336350`)만 반복했지, 그 사이 실제로 토스 "앱 출시" 콘솔에서 버전이 승인+출시됐는지 확인한 적이 없음. [[bug_tarot_gunghap_cloudflare_waf_block_2026_08_25]]에서 타로는 16개 버전 전부 "검토 필요"로 미승인 상태였던 게 밝혀짐. 대운도 재조사 전에 먼저 "앱 출시"에서 최신 버전 승인 상태부터 확인할 것. [[feedback_investigate_fully_before_asking_reupload]] 참고.

## How to apply

새 토스앱 만들거나 기존 앱 점검할 때, 전면광고 성공조건에 `adImpression`이 들어가 있는지 항상 확인할 것 — grep으로 `adImpression` 검색해서 성공조건(unlock/저장 등)에 쓰이고 있으면 무조건 버그. `dismissed`/`adClosed`만 성공조건으로 써야 함. `failedToShow`/`onError`는 광고 못 띄웠을 때의 fallback 언락이라 별개 취급.

"광고 안뜨고 바로 열림/저장됨" 류 버그는 원인이 한 겹이 아닐 수 있음 — adImpression버그, 재적재누락, 슬롯준비상태 미확인(이번 건) 세 가지가 겹쳐있을 수 있으니 하나 고쳤다고 바로 재업로드 요청하지 말고 `showFullScreenAd`/`loadFullScreenAd` 관련 코드 전체와 SDK 번들 소스(`node_modules/@apps-in-toss/web-framework/dist/prebuilt/*.js`에서 이벤트 타입 grep)를 한 번에 다 확인한 뒤 수정할 것. [[feedback_investigate_fully_before_asking_reupload]] 참고.
