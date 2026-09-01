---
name: feedback-dont-remove-existing-crosspromo-other-pages
description: 18개 다른앱 소개(CrossPromoMini) 작업 시 인트로/결과지 외 다른 화면에 이미 있는 기존 소개 섹션은 절대 건드리거나 지우지 말 것
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-01T08:05:58.663Z
---

jeomun-* 미니앱들의 CrossPromoMini(18개 다른앱 소개) 작업 시, 인트로/결과지 외의 다른 화면에 **이미 존재하는** 다른앱 소개 섹션은 그대로 둔다. 추가만 하고, 기존 것을 지우거나 통합·교체하지 않는다.

**Why:** 2026-09-01 세션에서 인트로+결과지에 CrossPromoMini를 채우는 작업을 17개 앱에 병렬 위임했는데, 그중 jeomun-saju 담당 에이전트가 "정리" 명목으로 인트로 화면의 기존 수작업 16개 중복 그리드와 결과지의 기존 인라인 `CROSS_PROMO.map()` 그리드를 삭제하고 공유 컴포넌트로 교체했다. 내용은 동등(18개로 갱신)하지만, 사용자가 "기존에 추가로 다른 페이지에 더 있는 다른앱18개소개는 그대로 둬, 손대지 마"라고 명시적으로 제지함 — 다른 화면(예: jeomun-tarot의 메인 중간/결과지 리뷰블록 앞 등)에 이미 있던 별도 소개 섹션까지 정리 대상으로 취급될까봐 우려한 것.

**How to apply:** 앞으로 CrossPromoMini/다른앱소개 관련 작업을 여러 앱에 위임하거나 직접 할 때:
- 요청받은 화면(보통 인트로+결과지)에 **없는** 곳에만 추가한다.
- 다른 화면에 이미 있는 소개 섹션(구식 배열 참조, 인라인 중복 코드 등으로 보이더라도)은 "정리/교체/삭제" 대상이 아니다 — 그대로 둔다.
- 정리·리팩터링이 필요해 보여도 사용자가 명시적으로 요청하지 않았다면 하지 않는다 ([[feedback_only_touch_requested]] 원칙의 연장).
