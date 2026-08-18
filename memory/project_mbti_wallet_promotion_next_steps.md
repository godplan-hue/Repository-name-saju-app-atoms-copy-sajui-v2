---
name: project-mbti-wallet-promotion-next-steps
description: "MBTI 비즈월렛 프로모션 신청 전 단계 — grantReward 코드는 서류 승인 후 promotionCode 받은 뒤 추가, \"시작하기\" 누르기 전 반드시 확인"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-18T08:17:34.125Z
---

2026-08-18 기준 상태: MBTI 비즈월렛 프로모션 서류 작성/신청 아직 안 함.

## 순서 (반드시 이 순서로)

1. MBTI 지갑 프로모션 서류 작성/신청 (토스 콘솔) — 아직 미착수
2. 승인 완료 → `promotionCode` 발급됨
3. promotionCode 받은 뒤 앱 코드(`jeomun-mbti/src/App.tsx`)에 `Promotion.grantReward` 호출 코드 추가
4. 빌드 → 실기기 설치 → `TEST_{promotionCode}` 코드로 `grantReward` 1회 성공 호출 (resultType SUCCESS 확인)
5. 테스트 성공해야만 콘솔 "시작하기" 버튼으로 실제 프로모션(광고) 시작 가능

**Why:** 다이어트 앱이 이 순서를 안 지켜서(코드 없이 예산만 충전) 소진율 0%로 프로모션이 끝난 전례가 있음 ([[project_biz_wallet_strategy]], [[project_session_2026_08_08_diet]]). 같은 실수 방지.

**How to apply:** 에스더님이 MBTI(또는 다른 앱) 지갑 프로모션 "시작하기" 얘기를 꺼내면, 코드가 들어가 있는지 + TEST_ 코드 테스트 성공했는지부터 먼저 확인하고 짚어줄 것. 지금 당장(서류 신청 전)은 코드 추가 불필요 — promotionCode 없이는 코드를 못 씀.
