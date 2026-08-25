---
name: project-ad-retry-4apps-fix-2026-08-25
description: "펫운/별자리는 별도 토스앱이 아니라 jeomun-saju에 흡수된 탭 — 잠금해제 광고 재시도로직 누락 버그, 실제 라이브 파일(jeomun-saju)에서 수정"
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-25T01:36:55.437Z
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

## 남은 작업

`jeomun-saju` `.ait`(`01a0368f-2d15-7025-ace4-a10404cf97b1`) 콘솔 재업로드 필요 (사용자). 타로/궁합도 각자 `.ait` 재업로드 필요. 재업로드 후 실기기 재테스트로 최종 확인.

또한 같은 파일(jeomun-saju) 내 `handleAdUnlock`(재물운 등 메인 사주 카테고리 잠금해제, line ~1934)도 동일한 재시도 누락 버그가 있음 — 이번 요청 범위 밖이라 손대지 않았으나, 다음에 사주 카테고리 잠금해제 관련 신고가 오면 여기부터 확인할 것.
