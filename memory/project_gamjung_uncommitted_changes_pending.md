---
name: project-gamjung-uncommitted-changes-pending
description: "jeomun-gamjung/src/App.tsx에 이전부터 있던 미커밋 변경 3가지, 에스더님이 이해 안 가서 진행 보류 지시 — 명시적 승인 전까지 빌드/커밋 금지"
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-15T03:52:47.854Z
---

`C:\Users\moon6\OneDrive\바탕 화면\jeomun-gamjung\src\App.tsx`에 이번 세션 이전부터(누가 언제 넣었는지 불명) 커밋 안 된 상태로 들어있던 변경 3가지:

1. **`fromHistory` state** — 보관함(히스토리)에서 지난 기록 클릭해 결과화면 진입 시, 히스토리 경유인지 표시
2. **히스토리 잠금 조건 변경** — `isCardUnlocked`/`isLetterUnlocked`/`isWeatherUnlocked`가 `fromHistory && isHistoryUnlocked`일 때도 풀리게 변경
3. **코인광고 재시도 로직** — 코인 받으려고 광고 봤는데 안 뜨면, 그냥 코인 주는 대신 "잠시 후 다시 시도해주세요" 메시지 띄우고 재시도하게 (`retry()` 함수)

**에스더님 확인**: 3번(코인광고 재시도)은 "감정일기에서 되던데"(이미 동작 확인됨)라고 하셨지만, 3개 전체가 뭔지 정확히 모르겠다며 **"진행하지말라고 적어놔 확실치않다고"** — 즉 이 3가지는 명시적으로 다시 확인/승인하기 전까지 빌드·배포에 포함시키지 말 것.

**How to apply**: jeomun-gamjung 관련 작업(빌드 포함) 시, 이 3개 변경사항은 건드리지 않은 채로 두되(이미 파일에 있으므로 삭제도 하지 말 것 — 삭제도 무단수정), **에스더님이 이 3가지에 대해 명시적으로 "빌드해" "이대로 진행해" 등 승인하기 전까지는 빌드 명령(`ait build`)도 실행하지 말 것.** 오늘 승인된 작업은 오직 "첫진입 자동광고 제거 + 오늘 감정 기록하기 버튼 클릭 시 광고 1회"뿐. [[feedback_wait_for_explicit_go]] 참고.
