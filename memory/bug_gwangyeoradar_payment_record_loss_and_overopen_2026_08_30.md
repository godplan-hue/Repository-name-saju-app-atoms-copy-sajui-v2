---
name: bug-gwangyeoradar-payment-record-loss-and-overopen-2026-08-30
description: "연락기록통계(gwangyeoradar) 결제해도 안 풀리던 버그 + 전역 unlock키로 과다열림(다른 결과·새 분석까지 열림) 버그, 둘 다 원인 찾아 수정"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-30T01:57:40.421Z
---

**계기**: 에스더님이 "연락통계에서 에러난거못찾앗어 니가 찾아다하니이것들도다수정해잘되게" — 재현 정보 없이 직접 원인 찾아 고치라는 명시적 지시.

**버그 1 — 결제해도 안 풀림**: [[bug_mbti_tarot_petun_zodiac_payment_record_loss_2026_08_30]]와 완전히 같은 구조적 결함. `redirectUrl`/`successUrl`/`failUrl`에 `?id=`가 없어서 모바일 PG 리다이렉트 왕복 중 `pay_pending` 임시저장이 사라지면 조용히 아무것도 안 함(결제기록·잠금해제 둘 다 누락). mbti pay/page.tsx 패턴 그대로 이식: `?id=` 쿼리 추가 + PortOne 무응답시 최소정보 폴백.

**버그 2 — 과다열림 (보너스로 발견)**: 전역 키(`gwangyeoradar_unlock_until`/`gwangyeoradar_unlock_phone`) + OR 매칭이 원인. 한 번 결제하면 24시간 내 같은 브라우저에서 다른 사람 공유링크나 완전히 새로운 분석까지 결제 없이 열려버림. [[bug_mbti_global_unlock_key_overwrite_2026_08_30]](MBTI, 덮어쓰기) · [[bug_sonjeolgak_payment_unlock_optional_phone_2026_08_30]](손절각, 너무 엄격해서 안 풀림)에 이은 세 번째 변종 — 이번엔 반대로 너무 느슨해서 과다열림.

**수정** (commit `420a23b3`, 2026-08-30):
1. `app/gwangyeoradar/pay/page.tsx` — finalizeSuccess+PortOne useEffect를 mbti 패턴으로 교체, Toss/PortOne URL에 `?id=` 추가, 무료쿠폰 분기도 per-id 키로 전환
2. `app/gwangyeoradar/result/[id]/page.tsx` — `checkPaid()`/`updateCountdown()`을 전역 키 → `gwangyeoradar_unlock_until_${id}` per-id 키로 전환
3. `app/gwangyeoradar/page.tsx` — 새 분석 제출 시 "이미 결제한 적 있으면 건너뛰기" 하던 alreadyUnlocked 바이패스 로직 완전 제거 (매 분석마다 결제 필요하도록 정상화)

**확인**: `npx tsc --noEmit` clean, commit+push 완료.

**How to apply**: [[bug_mbti_tarot_petun_zodiac_payment_record_loss_2026_08_30]]의 "How to apply"에 있던 "gwangyeoradar는 아직 미확장, 요청 없이 건드리지 말 것"이라는 문구는 이제 stale — gwangyeoradar는 이 커밋으로 이미 완료됨. 남은 미확장 앱은 budget 등 나머지뿐.

관련: [[bug_mbti_tarot_petun_zodiac_payment_record_loss_2026_08_30]] [[bug_mbti_global_unlock_key_overwrite_2026_08_30]] [[bug_sonjeolgak_payment_unlock_optional_phone_2026_08_30]] [[bug_budget_diet_momcare_save_failure_hidden_2026_08_30]]
