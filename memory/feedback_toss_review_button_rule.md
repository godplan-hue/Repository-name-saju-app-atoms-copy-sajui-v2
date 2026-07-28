---
name: feedback-toss-review-button-rule
description: 토스 미니앱 리뷰 버튼은 반드시 requestReview() 사용 — window.location.href 절대 금지
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
  modified: 2026-07-27T21:49:33.260Z
---

## 규칙

토스 미니앱(.ait)의 리뷰 버튼은 **반드시 `requestReview()`** 를 사용한다.

```typescript
// ✅ 올바른 방법
<button onClick={async () => { try { await requestReview(); } catch {} }}>
  ⭐ 리뷰 쓰기
</button>

// ❌ 절대 금지
<button onClick={() => { window.location.href = "https://minion.toss.im/..."; }}>
  ⭐ 리뷰 쓰기
</button>
```

**Why:** 토스 미니앱 환경에서 `window.location.href`로 URL 이동하면 리뷰창이 안 열린다. 감정일기(jeomun-gamjung)에서 `requestReview()`가 동작 확인됨.

**How to apply:** 새 앱 만들 때, 또는 기존 앱에 리뷰 버튼 추가할 때 항상 `requestReview()` 사용. import도 확인: `import { ..., requestReview } from "@apps-in-toss/web-bridge";`

**현재 상태 (2026-07-28):** 9개 전체 앱 모두 `requestReview()` 사용 중 확인 완료.
