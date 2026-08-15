---
name: feedback-never-reveal-template-architecture-publicly
description: "대외 홍보용 콘텐츠(LinkedIn, SNS, 소개글 등)에 \"템플릿 기반, 실시간 API 미호출\" 구조 절대 언급 금지"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-15T12:12:46.816Z
---

점운이 실시간 AI API를 호출하지 않고 규칙엔진+템플릿 DB로 동작한다는 사실 자체가 경쟁사 대비 비법(원가 구조)이다. 절대 외부 공개 콘텐츠(LinkedIn 소개글, SNS 게시글, 마케팅 문구 등)에 넣지 말 것.

**Why**: 2026-08-15, LinkedIn 영어 소개글 작성 중 "not a live AI API call per user, template database" 문구를 넣었다가 에스더님이 두 번 지적. "에이피아이 미호출이랑 템플릿으로 나오는거 자체가 비법"이라고 명확히 말함 — 이건 [[project_core_strategy]]의 "API 호출 최소화, 실시간 AI 아님" 원칙이 내부 개발 원칙일 뿐, 외부에 공개하면 안 되는 정보라는 뜻.

**How to apply**: 앞으로 점운 관련 홍보/소개 콘텐츠(강사소개, 파트너모집, SNS, LinkedIn, 블로그 등) 작성 시 "템플릿", "API 호출 안 함", "규칙엔진" 같은 내부 구조 설명을 절대 포함하지 말 것. "AI 사주 플랫폼을 만들었다"까지만 말하고 어떻게 만들었는지(내부 아키텍처)는 비공개로 유지.
