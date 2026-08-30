---
name: bug-mbti-global-unlock-key-overwrite-2026-08-30
description: "MBTI가 전역 unlock 키 하나만 써서 같은 기기에서 두번째 결제(다른 사람)가 첫번째 결제자의 잠금해제를 덮어쓰던 버그, 결과id별 키로 분리해 수정"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-30T01:00:29.815Z
---

에스더님이 본인 이름으로 MBTI 990원 결제 → 결과 확인 → 언니 이름으로 다시 결제 → 언니 결과 확인 → 본인 결과로 돌아가니 다시 잠겨있던 버그. 원인: `app/mbti/pay/page.tsx`의 `setUnlock()`이 `mbti_unlock_until` / `mbti_unlock_phone`이라는 **전역(global) 단일 키**만 썼음 — 결과 id와 무관하게 브라우저에 딱 1개. 두번째 결제(언니)가 이 키를 덮어써서 첫번째 결제자(본인)의 24시간 잠금해제 상태가 사라짐.

수정 (commit `e31071a8`): [[bug_sonjeolgak_payment_unlock_optional_phone_2026_08_30]]와 동일한 패턴으로 키를 결과id별로 분리 — `mbti_unlock_until_${id}` / `mbti_unlock_phone_${id}`. 전화번호 매칭도 손절각처럼 AND→OR로 완화(`!savedPhone || !resultPhone || savedPhone === resultPhone`) — 전화번호가 선택입력이라 비워두면 원래 영원히 안풀리던 문제도 같이 방지됨.

**Why**: 손절각(전역아님, per-part AND엄격→막힘), 연락기록통계/gwangyeoradar(전역, OR느슨→과다열림), MBTI(전역, AND엄격→다른사람결제가 내것 덮어씀) — 같은 "잠금해제 키 설계" 버그가 앱마다 다른 증상으로 나타난 3번째 변종. 다른 앱(꿈해몽/직운/합격자소서/타로/펫운/별자리/궁합 등)도 990원 결제+localStorage unlock 구조를 쓰면 같은 클래스 버그 가능성 있음 — 유사 신고 들어오면 이 3가지 패턴(전역키+엄격AND / 전역키+느슨OR / per-id키+엄격AND) 중 어디 해당하는지부터 확인할 것.

**How to apply**: 앞으로 새 앱 만들거나 다른 앱 잠금 버그 신고 받으면, unlock 키가 전역인지 결과id별인지부터 grep으로 확인. 전역 키 쓰는 앱은 "다른 사람이 같은 기기에서 결제하면 내 결과 잠김" 위험이 항상 존재함.
