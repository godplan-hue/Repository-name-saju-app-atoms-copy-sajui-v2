---
name: feedback-no-repeat-done-tasks
description: 이미 완료된 작업을 다시 하라고 시키지 말 것 — 항상 완료 상태를 먼저 파악하고 말할 것
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

이미 완료된 작업을 다시 하라고 절대 시키지 않는다.

**Why:** 유저가 이미 한 작업을 반복해서 시키면 시간 낭비이고 신뢰를 잃는다. 여러 번 반복되어 유저가 명시적으로 화를 냈다.

**How to apply:**
- 새 세션 시작 시 CLAUDE.md + memory를 읽어 이미 완료된 항목을 파악한다
- 완료된 항목 (Solapi 알림톡 연동, 환경변수 설정, 템플릿 승인 확인 등)은 다시 하라고 하지 않는다
- 현재 완료된 주요 항목:
  - Solapi 알림톡 템플릿 등록 + 승인 완료 (결제완료_결과지링크, 2026-07-07)
  - /api/notify 라우트 구현 완료
  - Vercel 환경변수 (SOLAPI_API_KEY, SOLAPI_API_SECRET, SOLAPI_PHONE_NUMBER) 설정 완료
  - 결제 페이지에서 알림톡 호출 코드 완료
- 확인이 필요한 경우 코드/파일을 직접 읽어서 상태를 파악한다. 유저에게 묻지 않는다.
