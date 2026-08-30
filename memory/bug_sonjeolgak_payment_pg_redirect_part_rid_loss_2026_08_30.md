---
name: bug-sonjeolgak-payment-pg-redirect-part-rid-loss-2026-08-30
description: "손절각 결제 PG리다이렉트 왕복 중 part/rid 유실 시 결제기록+잠금해제 통째로 누락되던 위험 수정"
metadata:
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-30T05:56:25.144Z
---

**문제**: `app/sonjeolgak/pay/page.tsx` — PG(PortOne/Toss) 결제창 갔다 온 후 같은 페이지로 복귀할 때, `sessionStorage`/`localStorage`의 `pay_pending`이 브라우저 정책 등으로 사라지면 `part`(관계 카테고리 파트)/`rid`(결과 id) 정보가 아예 복구 불가능해서 결제기록·잠금해제가 통째로 누락됨. 결제는 PG쪽에서 성공했는데 앱은 모름.

**원인**: PortOne `redirectUrl`, Toss `successUrl`/`failUrl`이 전부 `${origin}${pathname}` 그대로였고 `part`/`rid`를 쿼리에 안 담았음. [[bug_mbti_tarot_petun_zodiac_payment_record_loss_2026_08_30]]과 완전히 동일한 원인/동일한 패턴.

**수정** (commit `38073849`, 2026-08-30):
1. `redirectUrl`/`successUrl`/`failUrl`에 `?part=${part}&rid=${rid}` 쿼리 추가.
2. PortOne 복귀 처리의 `if (!pendingRaw) return;` 제거 → `part`/`rid`가 있으면 최소정보로 `finalizeSuccess` 호출하는 폴백으로 교체.
3. Toss 쪽은 기존 폴백 로직이 이미 `part`/`rid`를 참조하고 있었으나 URL에 안 담겨 무력했던 상태 — URL 수정만으로 정상 작동.

**적용 순서**: mbti/tarot/petun/zodiac(`216d5082`) → gwangyeoradar(`420a23b3`) → sonjeolgak(`38073849`) 순으로 같은 패턴을 앱마다 이식. 아직 이 패턴 안 적용된 990원 결제앱(budget/diet/jigun/gamjung/gunghap/haemong/main-v2/momcare/resume/pass/daewoon 등)이 남아있음 — [[feedback_only_touch_requested]] 규칙대로 명시적 요청 없이 확장하지 않음.

관련: [[bug_mbti_tarot_petun_zodiac_payment_record_loss_2026_08_30]] [[bug_gwangyeoradar_payment_record_loss_and_overopen_2026_08_30]] [[bug_sonjeolgak_payment_unlock_optional_phone_2026_08_30]] [[bug_sonjeolgak_7parts_identical_content_fixed_2026_08_30]]
