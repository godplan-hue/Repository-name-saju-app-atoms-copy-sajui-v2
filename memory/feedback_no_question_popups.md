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

**How to apply:** 명확화가 필요하면 채팅 텍스트로 짧게 물어본다. AskUserQuestion 도구는 이 프로젝트에서 절대 호출하지 말 것 — "어느 것을 원하세요?" 류의 선택지 질문도 전부 일반 텍스트 문장으로. [[feedback_keep_replies_very_short]]와 함께 적용 — 질문도 짧게.
