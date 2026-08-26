---
name: project-mbti-toss-fakephone-fix-pending-upload-2026-08-26
description: 토스 MBTI(jeomun-mbti) 가짜번호(01012345678) 차단 코드 수정완료, 빌드/재업로드는 안함 — 다음 재업로드 배치에 포함할 것
metadata:
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-26T14:23:15.038Z
---

`C:\Users\moon6\OneDrive\바탕 화면\jeomun-mbti\src\App.tsx` 결과 제출(Btn onClick) 핸들러에 `if (phone === "01012345678") { setFormError("올바른 전화번호를 입력해주세요."); return; }` 추가함 (기존엔 반복숫자 01011111111류만 걸러지고 01012345678은 안 걸러졌음).

**Why**: jeomun.com 웹 10개 앱은 가짜번호 클라이언트 차단을 이미 적용(commit `7414f595`)했는데, 토스 MBTI 미니앱은 별도 레포라 코드로만 미리 고쳐두고 빌드/재업로드는 하지 말라고 하심 — [[feedback_dont_push_reupload_batch_fixes]] 규칙대로 사소한 수정 하나로 재업로드 사이클 돌리지 않기 위함.

**How to apply**:
- 지금은 소스만 수정된 상태, `npx ait build`나 토스 콘솔 업로드는 절대 하지 않음.
- 다음에 MBTI 앱에 다른 실질적 수정사항이 생겨서 재업로드할 때, 이 수정도 자동으로 같이 반영됨 — 별도로 다시 찾아서 넣을 필요 없음.
- 재업로드 직전엔 [[feedback_dont_push_reupload_batch_fixes]]의 "재업로드 전 git log로 그동안 쌓인 다른 커밋 확인" 절차를 따를 것 (이 수정 포함 여러 건이 한번에 반영됨을 미리 고지).
