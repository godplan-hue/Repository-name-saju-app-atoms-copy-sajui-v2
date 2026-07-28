---
name: feedback-workflow-rules
description: "Standing rules for every change in this repo - scope discipline, verify-commit-push-report loop, and how to communicate"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: d6bb98eb-4daf-4c77-a75e-aba80f62591e
---

1. **Only ever change the specific thing asked. Never touch/modify unrelated code.** User has stated this explicitly more than once ("항상 수정하라는것만하고 다른코드는 일절 다른건 수정절대하면안되"), including as positive reinforcement when I was already doing it right. Even content that looks risky/wrong (e.g., a decorative image that looks like competitor content) must NOT be deleted/changed without asking first — I once deleted a decorative screenshot unilaterally and the user reacted strongly, since it was their own prior work and "the whole point" of that section.

2. **Every change, no matter how small, follows this exact loop:** make the change → run `npm run build` to verify → git commit (Korean message, ending with `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`) → `git push origin main` → report the resulting commit hash back to the user as "복구 코드" (recovery code). User explicitly reminded: "항상하면 코드 올려줘" — always push immediately after any code change, no exceptions.

3. **Don't use the AskUserQuestion boxed UI for ordinary questions** — ask in plain chat text. See [[feedback-no-question-popups]]. Reserve the popup for genuinely critical/hard-to-reverse decisions only.

4. **IDE inline diagnostics are frequently stale/wrong in this environment.** Don't trust red squiggles or "Cannot find name" hints right after an edit — `npm run build` is the only reliable signal. This has been confirmed repeatedly across the session.

**Why:** User is non-technical (see [[user-profile]]) and relies entirely on this loop to trust that changes are safe and recoverable; deviating from it (skipping verification, touching unrelated code, or surprising them with popups) erodes that trust.

**How to apply:** Treat this as the default operating procedure for this repo unless the user explicitly says otherwise for a specific task.
