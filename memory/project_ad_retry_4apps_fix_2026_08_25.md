---
name: project-ad-retry-4apps-fix-2026-08-25
description: "타로/궁합/펫운/별자리 잠금해제 함수에 광고 재시도 로직 누락 — failedToShow 즉시 잠금해제하던 버그 4개앱 일괄수정"
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-25T01:25:52.677Z
---

## 문제

타로에서 "광고버튼 누르면 광고 안 뜨고 바로 결과지 나옴" 신고. 처음엔 토스 광고 fill率 문제로 오진했으나, 사용자가 "1초씩 3번 자동재시도로 바꾸라고 전에 말했잖아, 다른앱은 다 되어있는데 왜 이건 안했냐"고 지적 — 실제 원인은 코드 결함이었음.

**원인**: mbti/resume/jigun의 진입(CTA) 버튼에는 이미 `MAX_ATTEMPTS=4`(최초1회+재시도3회, 1.5초 간격, 8초 타임아웃) 재시도 패턴이 있었는데, **타로/궁합/펫운/별자리의 "🔓 지금 열어보기" 섹션잠금해제 함수**에는 이 패턴이 없어서 `failedToShow` 이벤트 한 번(순간적 노출실패)만 떠도 광고를 안 띄우고 바로 잠금해제해버렸음.

## 수정

4개 앱의 잠금해제 함수(`watchAd`/`watchAdToUnlock`)에 동일한 재시도 패턴 적용:
- `jeomun-tarot` `watchAd()` — commit `3391a2c`, deploymentId `01a03681-0331-7fc9-bc7d-7b8ff1a17b18`
- `jeomun-gunghap` `watchAdToUnlock()` — commit `18b676d`, deploymentId `01a03681-4f0d-7af6-a7d2-eb26845173ac`
- `jeomun-petun` `watchAd()` — commit `bc2f657`, deploymentId `01a03681-d0d6-7183-8009-bfd43568245e`
- `jeomun-zodiac` `watchAd()` (LockGate 내부) — commit `6d00215`, deploymentId `01a03682-4763-796a-b409-23b44d5fc2af`

패턴: `failedToShow`/`onError` 발생 시 즉시 unlock하지 않고 1.5초 후 재시도, 최대 4회 시도 후에도 실패하면 그때 unlock. `dismissed`/`impression`(또는 `adClosed`/`adImpression`) 이벤트는 정상 시청완료로 간주해 즉시 unlock.

**Why**: "광고 안 뜨고 결과가 바로 나온다"는 신고는 실제로 매번 재현되는 게 아니라 순간적 no-fill 이벤트가 뜰 때만 재현됨 — 재시도 로직 없이 1회 시도만 하면 이 순간에 광고가 통째로 스킵됨.

**How to apply**: 새 앱을 만들거나 기존 앱에 잠금해제/광고 함수를 추가할 때, "진입 버튼엔 있는데 섹션별 잠금해제 함수엔 없는" 식의 불일치가 생기기 쉬움 — 같은 앱 안에서도 광고를 띄우는 모든 지점(진입 CTA + 섹션별 잠금해제 전부)에 동일한 재시도 패턴이 적용됐는지 매번 확인할 것.

## 남은 작업

4개 앱 모두 `.ait` 콘솔 재업로드 필요 (사용자가 직접). 재업로드 후 실기기 재테스트로 최종 확인.
