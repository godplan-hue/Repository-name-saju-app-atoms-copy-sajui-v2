---
name: feedback-always-include-email
description: 새 앱 폼에 항상 이메일 필드 포함할 것 — 빠뜨리면 유저가 화냄
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

새 앱 입력 폼에 **이메일 필드를 항상 포함**할 것.

- 전화번호(필수), 이름(선택), **이메일(선택)** — 이 세 개가 표준 세트
- API 저장 시에도 email 필드 포함
- Firebase에도 email 저장

**Why:** 타로·별자리 앱 만들 때 이메일 빠뜨려서 유저가 화냄. "왜 자꾸 이메일 빠뜨냐"고 지적받음.

**How to apply:** 새 앱 폼 작성할 때마다 phone/name/email 세 개 체크.
