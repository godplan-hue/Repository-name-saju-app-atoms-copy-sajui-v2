---
name: project-qa-expansion-plan
description: 택일/대운/연도별운세 Q&A 카테고리 추가 계획 — 상품 완성 후에 Q&A 추가하기로 함
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

택일, 대운, 연도별운세 Q&A 카테고리 확장 계획 (아직 미착수)

**Why:** 세 상품 모두 아직 결제 흐름이 없어서 Q&A를 먼저 노출하면 구매 불가 상태로 이탈이 생김. 상품 완성 후 Q&A 추가하기로 결정.

**How to apply:** 각 상품 결제 UI 완성되면 아래 순서로 Q&A 추가 진행.

---

## 우선순위

1. **대운** — 백엔드 완성됨, 결제 UI만 만들면 바로 연결 가능. 최우선.
2. **연도별운세** — 사주아이 벤치마킹 상품. 상품 설계·구현 후 Q&A 추가.
3. **택일** — 상품 기획부터 필요. 제일 나중.

## 구현 방식 (기존 Q&A 구조와 동일)

각 카테고리 10문항 × 5오행 = 카테고리당 50개 답변

- `lib/qa/daewoon.ts` — 대운 10문항
- `lib/qa/yearly-multi.ts` — 연도별운세 10문항
- `lib/qa/taekhil.ts` — 택일 10문항
- `lib/qa/index.ts` QA_CATEGORIES 배열에 추가
- `app/main-v2/qa/page.tsx` CATEGORY_KEYWORDS에 키워드 추가
- 구매 모달 SINGLES 또는 PKGS에 해당 상품 추가
- 결제 페이지 SELECT_CATS(단품) 또는 PACKAGES(패키지)에 추가
