---
name: feedback-save-decisions-immediately
description: 결정됐지만 미구현 항목은 말 안 해도 즉시 memory에 저장할 것
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

결정이 났는데 아직 코드로 구현 안 된 것은 사용자가 "저장해줘" 말 안 해도 즉시 memory에 저장한다.

**Why:** 에스더님이 아침에 긴 시간 결정한 내용을 저장 안 해서 세션 끊기자 전부 유실됨. 에스더님도 메모 안 하고 있었고, 나만 믿었던 상황.

**How to apply:**
- 대화 중 "이렇게 하기로 했어", "이거 결정", "나중에 할게" 같은 말 나오면 → 즉시 project_pending_decisions.md에 추가
- 세션이 길어질 것 같으면 중간중간 저장
- 구현 완료되면 해당 항목을 완료로 표시
- 절대 "말씀하시면 저장할게요" 식으로 기다리지 말 것
