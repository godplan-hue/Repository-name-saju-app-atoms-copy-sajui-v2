---
name: project_gwangyeoradar_sonjeolgak_ad_unlock_2026_08_29
description: 토스 관계레이더(gwangyeoradar)+손절각(sonjeolgak) 결제전용 항목을 광고로도 열리게 전환 — 결제는 전체일괄, 광고는 항목별
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-29T09:33:11.898Z
---

에스더님 확인 (2026-08-29): 점운 사주(jeomun-saju)만 유료로 남기고, 나머지 토스 미니앱은 전부 광고로도 열리게 하기로 확정. 전수조사 결과 이 시점 기준 "결제로만 열리고 광고 옵션이 없는" 앱은 jeomun-gwangyeoradar와 jeomun-sonjeolgak 2개뿐이었음 (gunghap/tarot/style은 이미 광고기반 또는 완전무료라 손대지 않음 — [[project_mbti_toss_all15_ad_unlock_2026_08_29]] 참고).

## jeomun-gwangyeoradar (관계레이더)
**파일**: `C:\Users\moon6\OneDrive\바탕 화면\jeomun-gwangyeoradar\src\App.tsx`
- 27개 항목 중 `lock: "paid"`였던 20개(reachOutSignal~finalPrescription)를 전부 `lock: "ad"`로 변경 → 기존 4개 ad항목과 동일하게 개별 리워드광고로 열리게 통일 (3개 free 항목은 그대로)
- 항목 렌더링에서 결제전용 분기(`it.lock === "paid"` else 브랜치) 제거 — 모든 비-free 항목이 `watchAdToUnlock(it.key)` 버튼 하나로 통일됨
- 상단 잠금 배너에 "990원으로 전체 한번에 열기 (24시간)" 결제 버튼 신규 추가 (기존엔 텍스트만 있고 버튼이 없어서 `payAndUnlock` 호출부가 사라질 뻔함)
- 하단 안내문구를 "항목마다 광고 보고 무료로 열거나, 결제 한 번이면 24시간 동안 전체 열람 가능해요"로 수정

## jeomun-sonjeolgak (손절각)
**파일**: `C:\Users\moon6\OneDrive\바탕 화면\jeomun-sonjeolgak\src\App.tsx`
- 원래 `GoogleAdMob` import 자체가 없어서 리워드광고 기능이 전혀 없었음 (전면광고만 있었음) — 신규로 `GoogleAdMob` import, `REWARD_AD_GROUP_ID` placeholder 상수, `unlockedSections`/`adLoadingKey` state, `reloadRewardAd()`/`watchAdToUnlock()` 함수를 gwangyeoradar와 동일한 패턴으로 신규 작성
- 기존엔 심층분석 10가지가 하나의 `unlocked` boolean(990원 결제 전용)으로 전부 묶여 있었음 → `paidSections` 배열 각 항목에 `key` 추가해서 항목별 개별 언락 가능하게 구조 변경
- 렌더링: 항목별로 `unlocked(결제) || unlockedSections.has(key)`면 내용 표시, 아니면 "🔓 광고 보고 열어보기 →" 버튼 표시
- 기존 990원 전체결제 버튼(`payAndUnlock`)은 그대로 유지 — 급한 유저용 일괄 24시간 언락 경로
- 인트로 화면 안내문구도 "광고 보고 하나씩 열거나, 990원 한 번이면 24시간 전체 열람돼요"로 수정
- ⚠️ `REWARD_AD_GROUP_ID`는 다른 placeholder 2개(`BANNER_AD_GROUP_ID`, `INTERSTITIAL_AD_GROUP_ID`)와 마찬가지로 토스 콘솔에 앱 등록 후 실제 값으로 교체 필요 — sonjeolgak 앱 자체가 아직 콘솔 미등록 placeholder 상태였음

## 공통
- 두 파일 모두 `npx tsc --noEmit` 에러 없음 확인 완료
- `ait build` 및 토스 콘솔 재업로드는 진행 안 함 — 에스더님이 직접 진행

**Why**: 무료 유입 앱들은 990원 결제 전환율이 낮고 광고 수익(개당 약 50원)이 더 확실 + 인기 순위에도 도움 됨 — [[project_mbti_toss_all15_ad_unlock_2026_08_29]]와 동일 전략.
**How to apply**: 앞으로 새 토스앱을 만들거나 기존 앱 잠금구조를 점검할 때, "결제로만 열리는 항목이 있는가"를 먼저 grep(`lock: "paid"`, `payAndUnlock`, `IAP.createOneTimePurchaseOrder`)으로 확인하고, 있으면 이 문서의 패턴(항목별 `key`+`watchAdToUnlock`+결제는 전체일괄 유지)을 그대로 적용할 것. jeomun-saju는 예외 — 사주 앱만 유료 유지가 확정 방침.
