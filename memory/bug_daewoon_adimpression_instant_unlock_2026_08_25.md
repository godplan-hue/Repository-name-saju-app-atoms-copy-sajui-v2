---
name: bug-daewoon-adimpression-instant-unlock-2026-08-25
description: "대운 앱 잠금해제 광고가 뜨자마자 바로 잠금해제되던 버그 - adImpression을 성공조건에 넣은 게 원인, 특정 대운기간 문제 아니라 전체 공통"
metadata:
  type: project
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
- **토스 콘솔 재업로드 필요** (아직 안 함)

## How to apply

새 토스앱 만들거나 기존 앱 점검할 때, 전면광고 성공조건에 `adImpression`이 들어가 있는지 항상 확인할 것 — grep으로 `adImpression` 검색해서 성공조건(unlock/저장 등)에 쓰이고 있으면 무조건 버그. `dismissed`/`adClosed`만 성공조건으로 써야 함. `failedToShow`/`onError`는 광고 못 띄웠을 때의 fallback 언락이라 별개 취급.
