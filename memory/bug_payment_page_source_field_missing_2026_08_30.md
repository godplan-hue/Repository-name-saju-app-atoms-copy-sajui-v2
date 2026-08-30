---
name: bug-payment-page-source-field-missing-2026-08-30
description: 결제선택 페이지(개별 990원/3900원) 결제가 경로 추적 자체를 안 하던 버그 발견+수정
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-30T00:26:56.255Z
---

[[project_mbti_adsource_ad_channel_tracking_2026_08_30]] 이후 실사용 중 발견 (2026-08-30, commit `1e61d412`).

**증상**: 에스더님이 결혼사주(990원 개별) 실제 결제 후 `/admin/direct-payments`에서 해당 행의 경로 컬럼이 "—"로 빈칸.

**원인**: `app/main-v2/pay/page.tsx`(재물운 등 메인 결제 흐름)는 이미 `first_source` 기반 경로 저장이 돼 있었지만, **개별 카테고리 990원/3900원 결제를 처리하는 완전히 다른 페이지** `app/main-v2/payment/page.tsx`(결제선택 페이지, `finalizeModalPaymentSuccess` 함수)는 애초에 `save-payment` 호출 시 `source` 필드 자체를 아예 안 보내고 있었음 — 지난 세션에서 "사주는 이미 고쳐짐"이라고 확인했던 게 `pay/page.tsx`만 확인한 것이었고, 같은 사주 앱 안에 있는 이 별도 결제 페이지는 놓쳤던 것.

**수정**: `main-v2/pay/page.tsx`와 동일 패턴 적용 — `localStorage.getItem("first_source")` 우선, `referred_by`(파트너코드) 있으면 `파트너:코드`로 표시. 기존 필드/로직 무변경, 완전 추가.

**한계**: 신규 결제부터만 적용됨. 방금 전에 이미 저장된 결제 기록(박형순 등)은 소급 반영 안 됨 — 이후 새로 결제되는 건부터 확인 가능.

**How to apply**: "사주는 이미 경로추적 됨"이라고 가정하지 말 것 — 사주 앱 안에도 결제 진입점이 여러 개(main-v2/pay, main-v2/payment, daewoon/pay, payment-complete 등)라 각각 따로 확인 필요. 새로 이런 신고가 들어오면 먼저 `grep -r "save-payment"`로 실제 호출 지점을 찾아 그 함수에 `source`가 빠졌는지부터 확인할 것.

**추가 발견+수정 (같은 세션, commit `a01fd36e`)**: `app/payment-complete/page.tsx`(모바일 리디렉션 결제 후 돌아오는 공용 페이지, 사주 여러 화면에서 참조)도 동일하게 `source` 필드가 아예 없었음 — 같은 패턴으로 추가. `app/main-v2/daewoon/pay/page.tsx`의 `source:"daewoon"`은 트래픽경로가 아니라 앱구분용 필드라 의도적으로 그대로 둠(건드리지 않음).

**최종 확인된 사주 결제 진입점 3곳 전부 처리 완료**: `main-v2/pay`(기존 완료) + `main-v2/payment`(이번 수정) + `payment-complete`(이번 수정). `grep -r "save-payment" app/main-v2`로 재확인함 — 이 3개 외 다른 사주 진입점 없음.
