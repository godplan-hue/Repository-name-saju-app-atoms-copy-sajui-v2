---
name: feedback-diet-app-no-touch
description: 수정 금지 범위는 토스 미니앱(jeomun-diet)만 — jeomun.com 웹사이트의 app/diet/ 는 다른 앱들과 동일하게 자유롭게 수정 가능
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-17T08:48:19.631Z
---

**수정 금지 대상은 별도 프로젝트 폴더인 토스 미니앱 `jeomun-diet/src/App.tsx` 딱 하나뿐이다.**

jeomun.com 웹사이트 저장소(`saju-app-atoms`)의 `app/diet/` 페이지들(랜딩·결과지·pay 등)은 여기 해당하지 않는다 — 다른 15개+ 앱과 완전히 동일하게 자유롭게 수정·기능추가(예: 토스 결제 연동)해도 된다.

**Why:** 2026-08-15, 토스 통합결제를 jeomun.com의 다이어트 결제 페이지(`app/diet/pay/page.tsx`)에도 추가하려다 이 메모리 때문에 물어봤는데, 에스더님이 "토스다이어트만 수정금지라고 점운은 모든앱다 수정해도되"라고 명확히 정정함. 원래 이 규칙은 2026-08-08 토스 미니앱 `jeomun-diet`에서 git reset으로 소스가 영구 소실된 사고 이후 그 프로젝트에만 적용하려던 것이었는데, 범위가 불명확하게 저장돼 있어서 jeomun.com 쪽까지 확대 해석하는 실수가 반복됐다.

**How to apply:** "다이어트 앱 건드리지 마세요" 확인 질문은 **파일 경로가 `jeomun-diet/`로 시작하는 별도 토스 미니앱 프로젝트일 때만** 한다. `saju-app-atoms` 저장소 안의 `app/diet/`는 확인 없이 바로 다른 앱들과 동일하게 작업 진행할 것.

**⚠️ 2026-08-17 예외 — 명시적 작업 승인 시:** 에스더님이 특정 작업(예: 전화번호 변경 차단, 영구저장 재시도 등)을 콕 집어 "다이어트/육아일기/MBTI 토스앱도 다 수정 가능하게 저장해"라고 명시적으로 승인하면, **그 작업 범위 안에서는** `jeomun-diet/`(및 momcare/mbti 등 다른 "건드리지 마라" 앱들)도 수정 가능. 즉 이 메모리는 "기본값은 확인 질문"이라는 뜻이지, 에스더님이 이미 명확히 승인한 작업까지 다시 물어보라는 뜻이 아니다. 이미 승인받은 작업은 재확인 없이 바로 진행. 상세: [[project_diary4app_phonelock_save_done_2026_08_17]]
