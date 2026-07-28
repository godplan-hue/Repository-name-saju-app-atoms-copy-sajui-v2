---
name: feedback-dont-touch-existing
description: 기존에 잘 작동하는 코드는 절대 건드리지 말 것
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

요청한 부분만 수정하고, 기존에 잘 동작하는 코드는 절대 건드리지 말 것.

**Why:** 기존 동작하는 코드를 "같이 정리"하거나 "혹시 모르니" 수정했다가 멀쩡히 작동하던 기능이 망가지는 일이 반복됨. 유저가 강하게 경고함.

**How to apply:** 요청 범위를 정확히 파악하고, 그 파일·함수·블록만 수정. 주변 코드가 비효율적으로 보여도 건드리지 않음. 수정 전 반드시 "이 파일의 이 부분만 바꿉니다"라고 먼저 말할 것.
