---
name: project-next-session-2026-08-30-toss-payment-tasks
description: 2026-08-29 세션 종료 시점 다음 세션(내일) 할 일 — 토스 사주앱/손절각 결제창 분리 + 손절각·연락기록통계 광고3개/인앱결제 연동
metadata:
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-29T13:01:40.656Z
---

2026-08-29 밤, 에스더님이 피곤해서 다음으로 미룬 작업 목록:

1. **토스 미니앱 사주앱(jeomun-saju), 손절각(jeomun-sonjeolgak) 안에 결제창을 각 항목별로 다 따로 만들기** — 지금처럼 하나의 결제창이 아니라, 항목(파트)마다 결제창을 분리해서 다 만드는 작업.
2. **손절각 + 연락기록통계(구 관계레이더, [[project_gwangyeoradar_renamed_2026_08_29]] 참고) 앱의 광고 3개 + 인앱결제 연동** — 두 앱에 광고 3개랑 인앱결제(IAP) 연결하는 작업.

**Why:** 오늘 세션에서 점운 웹사이트 손절각(`app/sonjeolgak/`)의 결제 파트구분 버그([[feedback_wait_for_explicit_go]] 참고, commit `78444d10`)와 결과지 진입 전 깜빡임 버그를 먼저 고쳤고, 에스더님이 "토스안 사주앱/손절각 결제창 다 따로 만드는 것 + 손절각/연락기록통계 광고3개+인앱결제 연결은 내일 하자"며 명시적으로 다음 세션으로 미룸.

**How to apply:** 다음 세션 시작 시 이 메모부터 확인. 단, [[feedback_wait_for_explicit_go]] 원칙대로 — 이 메모에 있다고 바로 코드부터 고치지 말고, 에스더님이 시작하라고 명확히 말할 때까지 먼저 현재 코드 상태(토스 사주앱/손절각/연락기록통계 저장소)를 읽고 원인·계획만 설명한 뒤 승인받고 진행할 것. 손절각(Toss 미니앱)의 IAP SKU는 [[project_saju_only_paid_sku_bug_deferred_2026_08_29]]에 따르면 아직 PLACEHOLDER 상태였을 수 있으니, 실제 승인/등록 상태부터 재확인 필요.
