---
name: project_momcare_tracker_no_coin_lock_decision_2026_08_22
description: 맘케어(육아일기) 트래커(기저귀/수유/수면)에 2천코인 잠금 걸지 않기로 확정 — 일기 저장 시 이미 광고 뜨는데 트래커까지 막으면 유저 짜증날 것으로 판단
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-22T10:10:28.513Z
---

맘케어 트래커(기저귀·수유·수면 로그)는 코인 잠금 없이 계속 완전 무료로 유지한다. 일기(오늘기록/기분기록)만 2,000코인 24시간 잠금 유지.

**Why:** 트래커는 육아일기의 "진짜 기록" 핵심 기능이라 여기까지 막으면 유저가 짜증낼 수 있음. 이미 일기 저장할 때 광고가 뜨고 있어서 트래커까지 코인 게이트를 추가하는 건 과함 — 에스더님이 직접 "그냥두자, 일기저장할때 광고뜨니 너무막으면 짜증날듯" 이라고 판단.

**How to apply:** 이후 세션에서 momcare 트래커에 잠금을 추가하자는 제안이 나오면 이 결정을 먼저 확인할 것. 코드 변경 없음 — 트래커는 계속 `isHistoryUnlocked` 체크 없이 렌더링됨.

관련: [[bug_momcare_7subpages_unlock_check_2026_08_21]]
