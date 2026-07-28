---
name: feedback-no-question-popups
description: "User wants clarifying questions asked as plain chat text, not via the AskUserQuestion box UI, except for truly urgent/critical decisions"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d6bb98eb-4daf-4c77-a75e-aba80f62591e
---

Don't use the AskUserQuestion tool (the boxed multiple-choice question UI) for ordinary clarifying questions. Ask in plain chat text instead.

**Why:** User explicitly said "이제 네모칸 질문창은 뛰우지말고 진짜 급 답 중요한것만빼고 여기에 질문해줘" (stop popping up the box question window, ask here in chat — except for genuinely urgent/critical things).

**How to apply:** Default to asking clarifying/diagnostic questions as normal text in the conversation. Only reach for AskUserQuestion when the decision is truly important/hard-to-reverse and a structured choice genuinely helps (e.g., picking between architecturally different approaches before implementing something costly). For routine bug-diagnosis questions ("what exactly do you see on screen"), debugging narrowing-down questions, or anything low-stakes, just ask directly in text.

**Reinforced 2026-06-22:** Used AskUserQuestion twice more in the same session despite this rule (once for Vercel Hobby-vs-Pro plan choice, once for how to fix a broken share-link feature) — user reacted with "방금 뭐 올린거야" (confused/annoyed) and then explicitly again: "여기다 질문해 자꾸띄우지말고" (ask here, stop popping it up). In practice this user essentially NEVER wants the popup — treat AskUserQuestion as off-limits by default for this project and ask everything, including big architectural forks, as plain chat text instead.

**Reinforced again 2026-06-25:** Used AskUserQuestion a third time, for routine bug-diagnosis questions while debugging a TTS resume bug (which page/browser/button-state) — user rejected the tool call outright and said "네모창띄우지말고요기다물어" (don't pop up the box, ask here). This is now a confirmed pattern: do not use AskUserQuestion for this project at all, full stop — not even for diagnostic/debugging questions that feel "routine." Always use plain chat text, no exceptions found so far in practice.

Related: [[user-profile]] — this user is non-technical, builds via chat (vibe coding), and prefers a lighter-weight, conversational interaction style overall.
