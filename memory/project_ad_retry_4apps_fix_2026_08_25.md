---
name: project-ad-retry-4apps-fix-2026-08-25
description: "펫운/별자리는 별도 토스앱이 아니라 jeomun-saju에 흡수된 탭 — 잠금해제 광고 재시도로직 누락 버그 수정 + 타로 impression오인/버튼중복클릭 2차버그 수정"
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-25T02:07:53.503Z
---

## ⚠️ 앱 구조 정정 — 펫운/별자리는 별도 앱이 아니라 사주앱(jeomun-saju)에 흡수된 탭

처음엔 `jeomun-petun`, `jeomun-zodiac` 독립 저장소를 수정했으나, 사용자가 정정: "이 두개 앱은 사주앱 안으로 흡수됐잖아, 꿈해몽이랑 같이 저장하라고 했는데" — **실제 라이브 상태는 jeomun-saju 안에 꿈해몽/별자리/펫운 3개가 탭으로 통합되어 있음**. `jeomun-petun`/`jeomun-zodiac` 독립 저장소 수정은 라이브와 무관한 죽은 코드 수정이었음.

**How to apply**: 이후 펫운/별자리/꿈해몽 관련 요청이 오면 무조건 `jeomun-saju/src/App.tsx`부터 확인할 것. 독립 `jeomun-petun`/`jeomun-zodiac` 저장소는 존재하지만 실제 서비스되는 코드가 아닐 가능성이 높음 — 작업 전 어느 파일이 실제 배포 대상인지 먼저 확인.

## 문제

타로에서 "광고버튼 누르면 광고 안 뜨고 바로 결과지 나옴" 신고 → 조사 결과 원인은 섹션별 "🔓 지금 열어보기" 잠금해제 함수가 `failedToShow`(순간적 노출실패) 이벤트를 재시도 없이 바로 성공 처리해서 잠금해제해버리는 구조였음. 진입(CTA) 버튼들은 이미 `MAX_ATTEMPTS=4`(최초1회+재시도3회, 1.5초 간격, 8초 타임아웃) 재시도 패턴이 있었는데, 섹션잠금해제 함수들엔 이 패턴이 빠져있었음.

## 수정 완료 (실제 라이브 파일 기준)

- **`jeomun-saju`** — 꿈해몽(dream) 잠금1/2, 별자리(zodiac) 잠금1/2, 펫운(pet) 잠금1/2 총 6곳 재시도 로직 추가. commit `2b477b0`, deploymentId `01a0368f-2d15-7025-ace4-a10404cf97b1`
- `jeomun-tarot` `watchAd()` — commit `3391a2c` (독립앱, 실제 라이브 맞음)
- `jeomun-gunghap` `watchAdToUnlock()` — commit `18b676d` (독립앱, 실제 라이브 맞음)
- `jeomun-petun`/`jeomun-zodiac` 독립저장소 수정(`bc2f657`/`6d00215`)은 라이브와 무관 — 무해하지만 불필요한 작업이었음

패턴: `failedToShow`/`onError` 시 즉시 unlock하지 않고 1.5초 후 재시도, 최대 4회 시도 후에도 실패하면 그때 unlock. `dismissed`/`adImpression` 이벤트는 정상 시청완료로 간주해 즉시 unlock.

**Why**: "광고 안 뜨고 결과가 바로 나온다"는 신고는 매번 재현되는 게 아니라 순간적 no-fill 이벤트가 뜰 때만 재현됨 — 재시도 로직 없이 1회 시도만 하면 이 순간에 광고가 통째로 스킵됨.

## 타로 2차 버그 수정 (2026-08-25, commit `0b78ad9`, deploymentId `01a0369a-8f41-72ab-b532-3c54ca6d5efb`)

재시도 로직 추가 후에도 사용자 신고: "타로광고안나와 그리고 위애버튼잘안누러주고두번누르면밑에 잠금까지 같이다풀려". 조사 결과 원인 2개 발견:

1. **`watchAd()`가 `"impression"`(광고 노출됨) 이벤트를 성공조건에 포함**하고 있었음 — SDK 문서상 `impression`은 광고가 "떴다"는 신호일 뿐 시청완료(`dismissed`)가 아님. 광고가 뜨자마자 즉시 잠금해제되어 광고를 스킵한 것처럼 보였던 것. → `impression` 제거, `dismissed`만 성공조건으로 남김.
2. **5개 섹션 잠금해제 버튼에 로딩/비활성화 가드가 전혀 없었음** (궁합/펫운/별자리는 이미 있었는데 타로만 누락). 버튼 눌러도 반응이 안 보여서 사용자가 두번 누르면, 레이아웃이 바뀌면서 두번째 탭이 바로 아래 섹션 버튼에 맞아 같이 풀림. → `unlockingSection` state 추가해 처리중엔 버튼 비활성화+"광고 불러오는 중..." 표시.

**Why**: `impression`과 `dismissed`는 SDK에서 별개 이벤트(노출 vs 닫힘)인데 같은 걸로 취급한 게 근본 원인. 이 문제는 jeomun-saju의 6개 잠금해제 함수와 `jeomun-gunghap`에도 `adImpression`/`impression`이 성공조건에 남아있을 수 있음 — 아직 감사 안 함, 신고 들어오면 여기부터 확인.

## 타로 3차 버그 수정 (2026-08-25, commit `faac20c`, deploymentId `01a036a5-1426-72fc-aa0a-9da3974b0fe7`)

사용자 신고: 공유하기 눌러도 jeomun.com 웹링크 카드가 뜸(토스 미니앱 링크가 아님). 원인: `handleShare()`가 `getTossShareLink` 없이 메시지에 `https://jeomun.com`을 하드코딩. 궁합 앱은 이미 `getTossShareLink("intoss://gunghap-jeomun")`으로 실제 미니앱 딥링크를 발급받아 공유하고 있었음 — 타로도 동일 패턴 적용, `getTossShareLink("intoss://tarot-jeomun")`(scheme은 `granite.config.ts`의 `appName: "tarot-jeomun"`과 일치) 사용하도록 수정.

**How to apply**: 다른 앱(펫운/별자리/MBTI 등)도 공유버튼이 `jeomun.com` 하드코딩돼있으면 같은 버그 — `getTossShareLink("intoss://{appName}-jeomun")` 패턴으로 통일할 것. appName은 각 앱의 `granite.config.ts` 확인.

## 타로 4차 버그 수정 (2026-08-25, commit `14d3b4a`, deploymentId `01a036ab-de7b-747d-9faf-7931cf4498aa`)

사용자 신고: "광고를 불러오는 중" 텍스트만 뜨고 실제 광고는 안 나옴. **진짜 원인**: `showFullScreenAd`는 `loadFullScreenAd`로 미리 채워둔 광고 슬롯 1개를 "소비"하는 구조 — 재적재(reload) 안 하면 다음 호출은 뜰 광고가 없어서 onEvent/onError 콜백조차 없이 조용히 8초 타임아웃까지 대기함(로딩중 텍스트만 계속). 타로는 앱 진입시 1회 preload(line 273) → 결과지 진입 1초 후 "2번째 전면광고"가 그 슬롯을 소비 → 이후 재적재 코드가 없어서 섹션 잠금해제 버튼을 누르면 이미 빈 슬롯에 대고 show를 호출하는 셈이었음.

**수정**: `reloadAd()` 헬퍼 추가 — (1) 결과지 2번째 전면광고 표시/실패 직후, (2) `watchAd()`의 `go()`(잠금해제 성공) 직후, 매번 다음 광고를 재적재하도록 함.

**How to apply**: `loadFullScreenAd`+`showFullScreenAd` 패턴을 쓰는 다른 앱에서도 "광고가 처음엔 뜨는데 두번째부터 안 뜬다"는 신고가 오면 이 소비-후-미재적재 버그부터 의심할 것. 성공적으로 광고를 보여준(또는 소비한) 직후에는 항상 다음 사용을 위해 `loadFullScreenAd`를 다시 호출해야 함.

## 남은 작업

`jeomun-saju` `.ait`(`01a0368f-2d15-7025-ace4-a10404cf97b1`), `jeomun-tarot` `.ait`(`01a0369a-8f41-72ab-b532-3c54ca6d5efb`) 콘솔 재업로드 필요 (사용자). 궁합도 `.ait` 재업로드 필요. 재업로드 후 실기기 재테스트로 최종 확인.

또한 같은 파일(jeomun-saju) 내 `handleAdUnlock`(재물운 등 메인 사주 카테고리 잠금해제, line ~1934)도 동일한 재시도 누락 버그가 있음 — 이번 요청 범위 밖이라 손대지 않았으나, 다음에 사주 카테고리 잠금해제 관련 신고가 오면 여기부터 확인할 것.

`jeomun-saju`의 6개 잠금해제 함수(꿈해몽/별자리/펫운)는 `adImpression`/`impression`을 성공조건에 그대로 남겨뒀음 — 타로와 같은 버그가 잠재해있을 수 있음, 아직 미확인.
