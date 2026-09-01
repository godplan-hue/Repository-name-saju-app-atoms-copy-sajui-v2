---
name: project-sonjeolgak-gwangyeoradar-global-unlock-2026-09-01
description: "손절각+연락기록통계 전면개편 — 결제1번 또는 광고1번 시청으로 전체 24시간 언락 통일, 대운/택일도 광고전용 확인"
metadata:
  node_type: memory
  type: project
  date: 2026-09-01
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-01T02:03:12.044Z
---

손절각(jeomun-sonjeolgak)과 연락기록통계(jeomun-gwangyeoradar) 둘 다 "결제 990원 1번 또는 리워드광고 1번 시청 → 전체 콘텐츠가 24시간 동안 다 열림" 구조로 통일 완료. 기존엔 파트별/항목별로 각각 광고를 봐야 열리는 구조였음.

**Why**: 에스더님이 결제 전환율이 낮다며 대운·택일처럼 "한 번의 행동으로 전체가 열리는" 방식을 요청. 조사 결과 대운(jeomun-daewoon)·택일(jeomun-taegil)은 실제로는 IAP 결제 코드 자체가 없고 광고 전용이었지만, "한 번의 액션(광고 1회)이 전체를 한번에 연다"는 구조적 패턴은 동일했음 — 이 패턴을 결제 옵션이 있는 손절각/연락기록통계에 이식.

**How to apply**:
- jeomun-sonjeolgak: `sonjeolgak_unlock_until_all` / `sonjeolgak_unlock_phone_all` 전역 키로 통일 (기존 파트별 키 제거), `watchAdToUnlockAll()` 신설, 결제 버튼 옆에 "🎬 광고 보고 7개 전체 무료로 열기" 버튼 + "결제하면 7개 전체 24시간 다 열림" 문구 추가. commit `6f8820e` (branch main). `.ait` 재빌드 완료 (`jeomun-sonjeolgak.ait`) — 콘솔 업로드는 에스더님 몫.
- jeomun-gwangyeoradar: 결제 쪽(`gwangyeoradarPaidUntil_${phone}`)은 이미 전역이었으나 광고 쪽이 27개 항목별 개별버튼이었음 → `grantUnlock24h()` 공용함수로 통합, `watchAdToUnlockAll()` 신설, "결제하면 27개 전체 24시간 다 열림" 문구 추가. commit `699d81b` (branch master). `.ait` 재빌드 완료 (`contactstats-jeomun.ait`).
- 대운/택일은 원래 IAP가 없는 광고전용 앱이라 이번 작업에서 수정 안 함 (구조가 이미 "한번에 전체 언락"이라 손댈 필요 없었음).
- [[feedback_haemong_zodiac_petun_bundled_in_saju_reminder_2026_08_27]]과 무관 — 이번 작업은 haemong/zodiac/petun 폴더 안 건드림.
- [[project_19apps_sdk3_adcopy_crosspromo_final_2026_08_29]] 광고문구/크로스프로모 체크리스트는 이번 세션에서 재확인 결과 여전히 유효 — 이번에 바꾼 건 sonjeolgak/gwangyeoradar의 "언락 로직"뿐이고 광고문구·크로스프로모 자체는 손대지 않음.
