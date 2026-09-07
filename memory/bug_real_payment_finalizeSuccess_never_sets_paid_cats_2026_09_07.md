---
name: bug-real-payment-finalizesuccess-never-sets-paid-cats-2026-09-07
description: "990원사주 재물운이 하나도 없다" 미해결버그의 진짜원인 코드로 확인함 — finalizeSuccess()(토스/포트원 실카드결제)가 v2_paid_cats를 아예 안 세팅, 아직 미수정(승인대기)
metadata:
  type: bug
---

## 확인된 사실 (2026-09-07, 코드 직접 읽어서 확인 — 추측 아님)

[[bug-saju-paid-cats-leak-all-categories-2026-08-29]]에서 `app/main-v2/result/page.tsx`의 `v2_paid_cats` 없을 때 fallback을 "전체카테고리 열기" → `[]`(잠김)으로 고쳤음 (그 자체는 올바른 수정, 전체 카테고리 새는 버그 해결됨). 그런데 이번에 코드를 다시 읽다가 **이 수정이 다른 미해결 버그의 직접 원인이라는 걸 코드로 확인함**:

- `app/main-v2/pay/page.tsx`의 `finalizeSuccess()` (토스페이먼츠/포트원 실카드·카카오페이 결제 완료 후 처리 함수, line 215~296) — `v2_paid`, `price`, `v2_plan="select"`는 세팅하지만 **`v2_paid_cats`는 어디에도 세팅하지 않음**.
- 반면 같은 파일의 무료쿠폰 처리 함수(line 140~177, `payFree` 계열)는 `v2_paid_cats`에 "💰 재물운"을 명시적으로 push해서 저장함 — 이 함수만 정상 동작.
- `app/main-v2/result/page.tsx` line 478-479: `v2_paid_cats` 없으면 `return []` (8/29 수정 결과) → `finalizeSuccess()`로 완료된 실결제는 결과지 진입 시 `paidCats=[]`가 되어 **구매한 카테고리가 하나도 안 보임**.
- line 608-624의 자동 재호출 로직은 `tier==="select"`이고 `allAnalyses`가 비어있을 때만 동작하고, 그마저도 `cats[0] || "💰 재물운"` 식으로 **카테고리 1개만** 재조회함 — 여러 개 구매해도 1개만 채워짐.

## 결론
에스더님이 예전에 보고했던 "990원 사주 결제해도 재물운 같은 게 하나도 없다" 증상은, **8/29에 고친 "전체카테고리 새는 버그"의 수정 자체가 부작용으로 만든 반대증상**임. 8/29 이전엔 fallback이 "전체 열기"라 이 버그가 안 보였다가(대신 과다노출 버그가 있었음), 8/29 이후 fallback이 `[]`로 바뀌면서 `finalizeSuccess()` 실결제 경로가 정확히 이 사각지대에 걸림.

## 아직 미수정 — 승인 대기 중
`finalizeSuccess()`가 결제된 카테고리를 `v2_paid_cats`에 세팅하지 않는 문제. 수정 방향(둘 중 하나, 아직 미결정):
1. `finalizeSuccess()` 호출부에서 결제 대상 카테고리 정보(`next` URL의 `package`/카테고리 파라미터 등)를 파싱해서 `v2_paid_cats`를 채우기
2. 또는 `result/page.tsx`의 자동 재호출 로직을 "카테고리 1개만"이 아니라 실제 구매한 전체 카테고리를 복원하도록 보강

**결제(매출) 관련 실코드라서 사용자 승인 없이 먼저 고치지 않음 — CLAUDE.md "요청한 것만 수정" 원칙.**

**Why:** [[bug-saju-paid-cats-leak-all-categories-2026-08-29]] 수정 이후 처음으로 이 인과관계가 코드로 확인됨 — 이전엔 가설 상태로 며칠 멈춰있던 이슈.
**How to apply:** 다음에 "990원/3900원 결제했는데 카테고리 안 보인다"는 리포트 오면 이 메모부터 볼 것. 고칠 때는 `finalizeSuccess()`와 `payFree()` 양쪽 다 건드리게 되니 결제 흐름 전체 회귀테스트(무료쿠폰+실카드 둘 다) 필요.
