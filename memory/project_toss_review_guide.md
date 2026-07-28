---
name: project-toss-review-guide
description: 토스 미니앱 리뷰 받는 방법 — requestReview() 네이티브 API + 24h 잠금해제 보상
metadata: 
  node_type: memory
  type: reference
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
  modified: 2026-07-25T00:27:40.058Z
---

## 핵심 요약

토스 미니앱에서 리뷰 받는 가장 좋은 방법 = **requestReview() + 24h 잠금해제 보상**

---

## requestReview API (공짜, 네이티브)

```typescript
import { requestReview } from "@apps-in-toss/web-bridge";

// 사용법
async function handleReviewClick() {
  try {
    await requestReview(); // 토스 네이티브 리뷰 창 띄움
  } catch {}
  // 창 닫히면 (리뷰 썼든 안 썼든) 24시간 잠금해제
  const until = Date.now() + 24 * 60 * 60 * 1000;
  await tossSet("앱이름PaidUntil", String(until));
  setPaidUntil(until);
}
```

- **위치**: `@apps-in-toss/web-bridge` 패키지
- **비용**: 0원
- **단점**: 리뷰 실제 작성 여부 확인 불가 (창만 열어도 보상 지급됨)
- **장점**: 별도 설정 없이 바로 사용, 토스 네이티브 UI

---

## 유료 포인트 방식 (나중에 — 30만원 충전 필요)

```typescript
import { grantPromotionReward } from "@apps-in-toss/web-framework";

await grantPromotionReward({
  params: { promotionCode: "PROMOTION_CODE", amount: 100 }
});
```

- **조건**: 토스 콘솔 → 프로모션 등록 + 비즈월렛 최소 30만원 충전
- **효과**: 토스 포인트 직접 지급 → 혜택탭 노출 가능
- **기간**: 1주일 이내만 운영 가능

---

## 3개 앱 적용 현황

| 앱 | 상태 | 리뷰 버튼 위치 |
|---|---|---|
| 감정일기 점운 | ⏳ 미적용 | 결과 화면 하단 |
| 다이어트 점운 | ⏳ 미적용 | 결과 화면 하단 |
| MBTI 점운 | ⏳ 미적용 | 결과 화면 하단 |
