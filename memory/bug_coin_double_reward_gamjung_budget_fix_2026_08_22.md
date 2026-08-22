---
name: bug_coin_double_reward_gamjung_budget_fix_2026_08_22
description: 감정일기·가계부 광고보기 코인 연타시 중복지급 버그 발견+수정. 맘케어는 승인요청중이라 안건드림
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-22T10:36:55.592Z
---

감정일기(jeomun-gamjung)에서 유저가 광고 1번 봤는데 코인이 3700→5000(+1300)으로 뛴 신고 발생. 코드 확인 결과 `watchAdForCoins()`/`doAttendance()`의 재진입 방지가 `coinAdLoading`(React state)으로만 돼있어서, 빠르게 연타하면 state 반영 지연 때문에 두 번 다 통과할 수 있는 구조적 버그 발견. 단, +1300이라는 정확한 숫자 자체는 코드상 딱 맞아떨어지는 경로가 없어 완전히 재현 확인은 못함 — 그래도 race condition 자체는 실재하는 버그라 수정함.

**수정 내용 (commit `55708a3` gamjung, `9bbc596` budget, 둘 다 push 완료):**
- `coinAdLoading`/`attendanceLoading` state 체크 → `useRef` 플래그로 변경 (state는 리렌더 전까지 반영 안 돼서 연타에 뚫림, ref는 즉시 반영됨)
- 출석코인 받는 중엔 광고코인 버튼도, 광고코인 받는 중엔 출석버튼도 서로 막도록 상호가드 추가 (이전엔 한쪽만 체크)
- budget은 `give()` 함수에 `done` 플래그 자체가 없어서 내부 이중호출 방어도 추가
- coins/coinAdCount 증가를 함수형 업데이트(`prev => prev + n`)로 변경 — 동시호출시 카운트 씹히는 문제 방지
- 둘 다 `npm run build`(ait build)까지 완료, dist/.ait 포함 빌드산출물도 commit+push 완료 (`ad88828` gamjung, `196014c` budget)

**Why:** 감정일기·가계부·맘케어 세 앱이 코인 시스템 코드를 그대로 복사해서 씀 — 감정일기에서 발견된 버그가 가계부·맘케어에도 똑같이 있음. 에스더님이 "감정일기랑 가계부는 고쳐줘" 라고 지시함.

**How to apply:** 맘케어(momcare)는 방금 테스트 마치고 토스 승인요청 넣은 상태라 이번엔 의도적으로 안 건드림. 나중에 맘케어 다음 업데이트 때 이 파일 보고 같은 패턴(coinAdLoadingRef, done플래그, 함수형 setCoins) 그대로 적용할 것. momcare의 `watchAdForCoins`/`doAttendance` 위치는 gamjung/budget과 동일한 구조.

관련: [[project_momcare_tracker_no_coin_lock_decision_2026_08_22]]
