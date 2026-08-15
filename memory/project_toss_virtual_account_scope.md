---
name: project-toss-virtual-account-scope
description: 가상계좌(virtual account) 결제수단은 main-v2/pay가 아니라 파트너 페이지에만 추가하면 됨 — 에스더님 확정
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-15T01:49:30.601Z
---

토스페이먼츠 통합결제 연동 시, `method:"CARD"`로 여는 결제창에는 카드+간편결제(카카오페이/토스페이/페이코/삼성페이/L페이/SSG페이)만 포함되고 가상계좌·계좌이체는 별도 버튼이 필요함.

에스더님 확정: **가상계좌는 파트너 페이지(`app/partner/`)에서만 필요** — `main-v2/pay`(사주 990원 결제)에는 추가할 필요 없음.

**Why:** 2026-08-15 토스 통합결제 연동 테스트 중, 가상계좌가 카드+간편결제 통합창에 안 뜨는 걸 발견. 에스더님이 파트너 결제 흐름에서만 가상계좌가 쓰인다고 직접 확인해줌.

**How to apply:** 향후 파트너 페이지 결제 연동 작업 시 `method:"VIRTUAL_ACCOUNT"` 요청을 별도 버튼으로 추가할 것. `main-v2/pay`는 카드+간편결제만으로 충분 — 가상계좌 버튼 추가 요청 없이 임의로 넣지 말 것. [[project_toss_live_switch_reminder]]와 함께 참고.
