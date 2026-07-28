---
name: feedback-apply-to-all-pages
description: 여러 페이지에 동일한 변경 요청 시 한 번에 전부 적용할 것
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

"모든 결과지에", "전부", "다" 같은 표현이 있으면 관련 페이지를 먼저 전부 파악하고 한 번에 수정한다.

**Why:** 페이지 하나씩 고치면서 여러 번 작업하게 해 유저가 반복적으로 같은 요청을 해야 했음.

**How to apply:** 변경 전에 영향 받는 파일 목록을 먼저 파악(Grep/Glob)하고, 한 번의 작업 사이클로 전부 처리한다. 한 파일씩 fix → test → fix 루프를 돌리지 않는다.
