---
name: bug-momcare-7subpages-unlock-check-2026-08-21
description: "육아일기(구 맘케어) 결제기간 남았는데 계속 결제하라 뜨던 버그 — 7개 서브페이지 전부 unlocked state를 true로 설정하는 분기가 없었음 (2026-08-21, commit b7627ff)"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-21T10:37:47.980Z
---

**증상**: 에스더님이 육아일기(맘케어) 열었는데 "45일쯤 남았는데 계속 결제하라 뜬다"고 보고. `/apps` 그리드 카드에는 D-71 배지가 떠 있어서 유효기간 자체는 살아있는 상태였음.

**원인**: `app/momcare/` 하위 7개 서브페이지(baby-diary/육아일기, baby-words/아기말사전, time-capsule/타임캡슐, growth-calendar/성장캘린더, growth-diary/성장일기, daily-tracker/데일리트래커, memory-journal/소중한순간저널) 전부 동일한 구조적 버그:
- `unlocked`(또는 time-capsule만 `momcareUnlocked`) state를 `useState(false)`로 초기화
- `useEffect`에서 `momcare_unlock_until`을 읽어 만료/없음이면 `false`로 세팅하는 분기는 있었지만, **유효기간이 남아있을 때 `true`로 세팅하는 분기가 7개 파일 전부 없었음**
- 결제 저장(`app/momcare/pay/page.tsx`)과 메인 랜딩(`app/momcare/page.tsx`)의 동기화 로직은 정상이었음 — 버그는 순수하게 7개 서브페이지의 읽기(check) 쪽에만 있었음

**수정**: 7개 파일 각각의 unlock-check useEffect에 `else { setUnlocked(true); }` (또는 `else setUnlocked(true);`) 분기 추가.

**Why**: 7개 파일이 복붙으로 만들어지면서 "만료됐을 때"만 처리하고 "유효할 때"를 빠뜨린 동일한 실수가 그대로 복제됨.

**How to apply**: 앞으로 momcare류 앱에 서브페이지를 새로 추가할 때, unlock-check useEffect는 반드시 세 가지 분기(없음/만료/유효)를 다 채웠는지 확인할 것. `if (!exp) {...} else if (expired) {...}` 패턴을 볼 때마다 else(유효) 분기 누락 여부를 의심할 것 — [[bug_gamjung_double_save_2026_08_21]]과 같은 계열의 "복붙 패턴 반복 버그".

에스더님이 대화 중 "맘케어가 육아일기로 이름변경됫어"라고 언급함 — 코드/브랜딩 변경 요청은 아니었고 앱을 부르는 이름 안내였음. CLAUDE.md 브랜드 표에는 아직 "맘케어"로 남아있으니, 실제 이름 변경 작업 요청이 오면 그때 CLAUDE.md 포함 전체 반영할 것.
