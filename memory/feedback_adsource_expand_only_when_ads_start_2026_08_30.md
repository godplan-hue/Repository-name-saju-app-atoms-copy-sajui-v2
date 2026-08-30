---
name: feedback-adsource-expand-only-when-ads-start-2026-08-30
description: "adSource(실제광고경로) 필드는 광고 도는 앱에만, 나머지는 광고 시작할 때 요청받아서 추가"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-30T00:22:23.784Z
---

[[project_mbti_adsource_ad_channel_tracking_2026_08_30]] 후속 (2026-08-30).

에스더님이 "이거 수정 금방 하네, 그럼 그냥 다 수정해버릴까?"라고 물어봐서, 13개 나머지 서브앱(가계부·손절각 등)까지 `adSource` 미리 다 넣는 건 반대 의견을 드렸고 — **동의받음("ㄱ,레")**.

**이유**: `RefTracker.tsx`(당근/틱톡/구글애즈 UTM·gclid 감지, commit `2a12d025`)는 파일 1개라 전체 앱에 이미 자동 적용됨 — 이건 완료. 하지만 `adSource`를 각 앱 결제 저장 코드에 실제로 꽂는 건 앱마다 `pay()` 함수 등 3~4곳씩 따로 고쳐야 하는 작업(MBTI 때 한 것과 동일 패턴). 광고 안 도는 앱에 미리 넣어봤자 값이 계속 비어있어 쓸모없고, 저장 코드를 13개 파일 더 건드리면 그만큼 리스크만 늘어남.

**확정된 방침**: 지금은 사주+MBTI만 유지. 나중에 다른 앱에 광고를 실제로 돌리기 시작하면 그때 에스더님이 요청 → 그 앱만 같은 패턴(`adSource: localStorage.getItem("first_source") || ""`)으로 추가.

**How to apply**: 앞으로 "이것도 다 해버릴까" 식으로 스코프 확장을 제안받으면, 실제 필요(광고 집행 여부 등) 없는 선제적 확장은 만류하고 이유를 설명할 것 — 이번에 그렇게 해서 동의받은 전례가 있음.
