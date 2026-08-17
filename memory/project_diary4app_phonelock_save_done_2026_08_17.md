---
name: project-diary4app-phonelock-save-done-2026-08-17
description: 토스 4개 일기앱(gamjung/budget/momcare/diet) 전화번호변경 차단 + 영구저장 재시도 전부 완료
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-17T08:48:05.577Z
---

**2026-08-17 완료: 토스 미니앱 4개(감정일기/가계부/육아일기/다이어트) 전부 아래 2가지 완료됨.**

1. **전화번호 변경 기능 차단** — 등록된 번호를 다른 번호로 바꿀 수 없도록 예전 방식으로 복구 (`openPhoneChange` 버튼/호출 제거 또는 원래부터 죽어있던 코드 확인)
2. **영구저장 재시도 로직** — Firebase 저장을 `fetch(...).catch(()=>{})`(실패해도 그냥 무시) 대신, 최대 4회까지 700ms×횟수 간격으로 재시도하는 `putWithRetry`/`patchLogWithRetry` 헬퍼로 교체 → 네트워크 순간 끊김으로 저장 실패하는 일 감소

**앱별 상세:**
| 앱 | 전화번호변경 차단 | 영구저장 재시도 | 커밋 |
|---|---|---|---|
| jeomun-gamjung | 이미 죽은코드(버튼 없음) 확인 | 완료 | `b15233f` |
| jeomun-budget | 버튼+함수 제거 | 완료(이전) | `c88263c` (+이전 `7a88961`) |
| jeomun-momcare | 버튼+함수 제거 | 완료 | `2cecc32` |
| jeomun-diet | 이미 죽은코드(버튼 없음) 확인 | 이미 `patchLogWithRetry`로 구현되어 있었음 — 추가 수정 불필요 | (기존 코드) |

jeomun.com 웹사이트 쪽(app/diet, app/gamjung 등) 저장 안정화도 같은 날 별도로 완료 — 커밋 `6a9654c`.

**⛔ 절대 원칙 (이번 작업 내내 지킴): 기존에 저장된 일기 기록은 단 하나도 삭제·초기화하지 않았다.** 저장이 "더 안정적으로" 되게만 바꿨을 뿐, 기존 Firebase 데이터나 토스 Storage 데이터는 손대지 않음.

**momcare 파일 특이사항**: 작업 당시 `jeomun-momcare/src/App.tsx`에 이미 다른(에스더님이 진행 중이던) 미커밋 변경사항이 섞여 있었음 — 광고 SDK 교체, 전화번호 입력시 자동복원 로직 등. 이 부분은 건드리지 않고, git 인덱스 조작(HEAD버전 추출→내 수정만 적용→hash-object→update-index)으로 내 수정분만 정확히 골라서 커밋함. 그 미커밋 변경들은 여전히 working tree에 그대로 남아있음(에스더님이 이어서 작업할 부분).

**How to apply:** 이 4개 앱의 전화번호변경/영구저장 관련 질문이 다시 나오면 "이미 다 끝났다"고 바로 답하면 됨 — 재확인 불필요.

관련: [[feedback_diet_app_no_touch]]
