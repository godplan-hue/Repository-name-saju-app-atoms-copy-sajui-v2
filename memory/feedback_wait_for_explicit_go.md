---
name: feedback-wait-for-explicit-go
description: "Don't run build/commit/push or other concrete actions on your own initiative mid-explanation — wait for the user's explicit go-ahead first."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d6bb98eb-4daf-4c77-a75e-aba80f62591e
  modified: 2026-08-13T01:14:49.933Z
---

When explaining what needs to happen next (e.g. "I'll build, commit, and push now"), stop there and wait for the user to say go — do not immediately follow up with the actual tool calls in the same turn or right after.

**Why:** User said directly: "너 자꾸 니맘대로 부 하지마, 내가 말하면 시작해" (stop doing things on your own, only start when I say so). This happened during the jeomun.com deployment session after I explained a plan and then immediately ran `npm run build` without waiting — the user rejected the tool call twice before voicing this rule explicitly.

**How to apply:** After describing a planned action (especially build/commit/push, or any multi-step browser-driven task like Vercel/domain setup), end the turn and wait for confirmation, even if the action seems obviously wanted. Only proceed once the user replies with something affirmative ("진행해", "해", "그래", etc.). This is distinct from [[feedback_workflow_rules]] (which governs the build→commit→push→report sequence once work is actually authorized) — this rule is about not self-triggering that sequence without a fresh go-ahead each time.

**Recurrence (2026-06-24):** Happened again, this time during a scope-clarification conversation about a multi-card pricing/labeling fix on the main page. The user was still narrowing down *which* cards needed changes ("재물성공 아니고 재물연애라고" — a small correction to a card's description text) and I made the Edit immediately instead of just noting the correction and waiting. The user rejected the tool call and said "잇잔아 아직내가하라고안햇잔아" (hey, I never told you to do it yet). **Key lesson: this rule applies even to small, single-line content edits, not just build/commit/push sequences — if the conversation is still in clarification/scope-discussion mode (even mid-list, even for an "obvious" typo fix), do not edit. Only edit once the user gives a clear go signal for the whole batch or that specific item.**

**Recurrence (2026-08-13):** MBTI 이중광고(첫진입+시작하기 두번 연달아 광고나오는 버그) 관련해서 에스더님이 상황 설명하고 "이대로 올려도 될까?" 의견만 물어본 상황이었는데, 코드 확인 작업을 하고 있길래 에스더님이 먼저 "아직코더넣지마 내설명듣고항상 내가 시작하하면수정이건 시작해야해"라고 선제적으로 못박음. **의견/저장만 요청받은 상황에서는 절대 코드를 열어서 고치지 말 것 — "시작해"라는 명시적 신호 전까지는 설명 듣기+저장만.**
