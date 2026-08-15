---
name: project-gamjung-section-unlock-history-pass
description: "2026-08-15 gamjung(토스 미니앱) 섹션잠금×24시간 히스토리 이용권 연동 설계+구현 완료, commit 0dc21a3"
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-15T00:00:00.000Z
---

`C:\Users\moon6\OneDrive\바탕 화면\jeomun-gamjung\src\App.tsx` — 감정일기 카드/편지/날씨 섹션 잠금과 2,000코인 24시간 히스토리 이용권의 상호작용 최종 확정 및 구현.

**확정된 규칙 (에스더님 직접 여러 번 확인, 절대 임의 변경 금지)**:
1. **한 번도 광고 안 본 섹션** → 24시간 이용권이 켜져 있어도 무조건 잠김. 광고를 봐야만 열림. (광고 수익 보존 — 이용권만 사고 광고는 안 보는 꼼수 차단)
2. **이미 광고 봐서 열었던 섹션** → 나중에 다시 들어왔을 때(앱 재시작 포함) 24시간 이용권이 "지금 켜져 있을 때"만 자동으로 다시 보임. 이용권 꺼져있으면 예전에 봤어도 다시 잠김 → 재광고 필요.
3. **방금 쓴 새 일기(같은 세션 안에서 방금 광고보고 연 것)** → 이용권 상태와 무관하게 바로 보임 (나갔다 들어와도 세션 안이면 유지).
4. 히스토리 목록 자체가 이미 `isHistUnlocked`(24시간권) 안에서만 렌더링됨(789~820줄) — 이용권 없으면 과거 일기 클릭 자체가 불가능. 그래서 "이용권 없이 과거 섹션이 잠긴 채 보이는" 상황은 애초에 발생 안 함.

**설계 이유 (에스더님 본인 지적)**: "히스토리 2천코인 주고 샀는데 잠겨있으면 기분 나쁘다" vs "그렇다고 이용권만 사면 다 풀리면 광고 안 보고 저장하는 애들 때문에 일기 쓸 때 광고수익이 없어진다" — 두 우려를 절충한 결론이 위 규칙.

**구현 방식**:
- `sectionUnlocks`(카드/편지/날씨 unlock map)를 Toss Storage(`gamjung_section_unlocks`)에 저장 → 앱 재시작해도 "예전에 봤었다"는 기록 자체는 남음
- `sessionUnlockedRef`(useRef Set) — 이번 런타임 세션에서 방금 광고보고 연 것만 추적. 세션 내면 이용권 무관하게 즉시 unlocked
- `isSectionUnlocked(key)` 함수: `sectionUnlocks[resultId]?.[key]` 없으면 무조건 false → 세션에서 방금 열었으면 true → 그 외엔 `isHistoryUnlocked`(24h 이용권 활성 여부) 값을 그대로 반환

**커밋**: `0dc21a3` (jeomun-gamjung 저장소, 리모트 없음 — 로컬 커밋만). `ait build` 완료, `gamjung-jeomun.ait` 생성됨(deploymentId 01a0059c-aabb-717e-af21-71af6ad2309c). 에스더님 테스트 후 "다 잘 되어있다" 직접 확인 완료 (2026-08-15).

**How to apply**: 다른 일기형 토스앱(budget/diet/momcare)에 같은 히스토리 이용권+섹션잠금 구조가 생기면 이 패턴을 그대로 적용할 것. gamjung 관련 잠금 로직 재작업 시 이 규칙을 최우선 기준으로 삼을 것 — 에스더님이 같은 세션에서 여러 번 반복 확인해서 확정한 내용이라 재논의 불필요.
