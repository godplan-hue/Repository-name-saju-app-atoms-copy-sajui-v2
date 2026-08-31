---
name: no-question-popups
description: Never use AskUserQuestion popup tool with this user — ask in plain chat text only
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-28T07:56:12.149Z
---

절대 AskUserQuestion(박스형 팝업) 사용 금지. 질문은 항상 일반 채팅 텍스트로만 한다.

**Why:** 여러 번 반복해서 지적받은 규칙. 2026-08-13 세션에서도 다시 위반해서 "그리고질문창띄우지말랫는데왜자꾸 띄우는거야띄우지마 여기다가물어그냥" (팝업 띄우지 말라고 했는데 왜 계속 띄우냐, 그냥 여기다 물어봐)라고 화내며 재지적함. 화면 보며 빠르게 진행하는 작업 스타일과 안 맞고, 팝업이 흐름을 끊는다고 느낌.
2026-08-28 세션에서 또다시 AskUserQuestion(어떤 토스앱을 3.x 전환할지 묻는 4지선다) 사용 → "이창올리잠말라고"(이 창 올리지 말라고)라고 재차 화내며 지적함. **세 번째 반복 위반.**
2026-08-31 세션에서 네 번째 위반 — 당근 광고 이미지 프롬프트에 브랜드명/가격 삽입 위치 확인하려고 AskUserQuestion 연달아 2번 사용 → 두 번째 호출은 사용자가 툴 실행 자체를 거부(reject)하며 "네모올리지마 여기다질문해"라고 지적. **네 번째 반복 위반.**
2026-09-01 세션에서 다섯 번째 위반 — 당근 광고 제목 톤(후킹형/반응형/임팩트형) 선택지 확인하려고 AskUserQuestion 사용 → 사용자가 툴 실행 거부 후 "후킹하고 좀 광고나 홍보용으로좀만들어항상"이라고 지적. **다섯 번째 반복 위반. 이 규칙은 절대 예외 없음 — 사소한 톤 선택조차 텍스트로만 물을 것.**

**How to apply:** 명확화가 필요하면 채팅 텍스트로 짧게 물어본다. AskUserQuestion 도구는 이 프로젝트에서 절대 호출하지 말 것 — "어느 것을 원하세요?" 류의 선택지 질문도 전부 일반 텍스트 문장으로. [[feedback_keep_replies_very_short]]와 함께 적용 — 질문도 짧게.
