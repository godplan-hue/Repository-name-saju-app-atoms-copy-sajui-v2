---
name: project_admin_session_30days_decision
description: 관리자 로그인 세션 30일로 연장 결정 + 만료시 자동 로그인페이지 이동 처리 완료 (2026-08-21)
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-21T01:33:26.243Z
---

## 배경

2026-08-21, 에스더님이 `/admin/direct-payments` 새로고침 후 데이터가 전부 사라진 것처럼 보여 놀람.
원인: `lib/adminAuth.ts`의 관리자 로그인 토큰이 7일 만료(2026-08-14 보안수정 때 도입)라 세션이 끊긴 것이었고,
DB 데이터는 전혀 삭제되지 않았음(코드상 `v2_direct_payments` 삭제는 화면의 "삭제" 버튼 클릭시에만 실행됨).
다만 만료돼도 화면이 그냥 빈 배열로 표시돼 "삭제된 것처럼" 보이는 게 진짜 문제였음.

## 수정 완료

- `app/admin/direct-payments/page.tsx` (commit d2f9f63) — fetch 응답이 401이면 자동으로 `/admin/login`으로 이동시키도록 수정. 세션 만료 시 빈 화면 대신 로그인 페이지로 바로 넘어가서 오해 안 생김.
- `lib/adminAuth.ts`의 `TOKEN_TTL_MS` 7일 → 30일로 연장 (commit fd06fe5).

## 세션 기간 결정: 30일

처음엔 "불편해도 보안이 더 잘된다면 7일 유지"라 하셨다가, 바로 이어서 "큰차이없음 30일로하고"로 최종 변경.
**최종 확정은 30일.**

**Why**: 7일마다 재로그인하는 불편이 보안 이득 대비 크다고 판단, 30일로 절충.
**How to apply**: 향후 세션 기간 관련 요청 오면 30일이 최종 결정임을 알릴 것. 이미 결정된 사안이니 다시 여쭤보지 말 것.
**참고**: TOKEN_TTL_MS를 바꿔도 이미 발급된 기존 토큰의 만료시각은 소급 적용 안 됨 — 로그인 시점 기준으로 고정되므로, 이 변경 이후 새로 로그인한 세션부터 30일 적용됨.

관련: [[project_security_fix_2026_08_14]]
