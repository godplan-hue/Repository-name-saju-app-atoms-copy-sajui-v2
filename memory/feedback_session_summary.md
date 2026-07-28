---
name: feedback-session-summary
description: 매 세션 종료 시 작업 내용을 CLAUDE.md에 자동 저장해야 함
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

세션이 끝날 때마다 그날 한 작업을 CLAUDE.md에 정리해서 저장하고 커밋·푸시할 것. 유저가 따로 요청하지 않아도 자동으로 해야 한다.

**Why:** 다음 세션 Claude가 이전에 뭘 했는지 기억 못 하면 중복 작업·잘못된 현황 파악이 생김. 유저가 매번 설명하는 수고를 없애기 위해.

**How to apply:** 대화 종료 직전, 오늘 완료한 항목·미완료 항목·다음에 할 일을 CLAUDE.md의 "진행 중/남은 작업" 섹션에 업데이트하고 커밋+푸시.
