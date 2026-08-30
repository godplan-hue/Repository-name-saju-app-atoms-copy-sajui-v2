---
name: bug-mbti-tarot-petun-zodiac-payment-record-loss-2026-08-30
description: "MBTI/타로/펫운/별자리 4개 웹앱, 모바일 결제 후 임시저장 소실 시 결제기록·잠금해제 누락되던 구조적 위험 수정"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-30T01:34:31.208Z
---

**문제**: MBTI/타로/펫운/별자리(`app/mbti|tarot|petun|zodiac/pay/page.tsx`) 4개 웹앱(jeomun.com, 토스 미니앱 아님)에서, 모바일 카드/카카오페이 결제 시 PG 인증 후 같은 페이지로 "새로 돌아오는" 방식을 쓰는데, 이 흐름이 전적으로 `sessionStorage`/`localStorage`의 `pay_pending` 값이 PG 리다이렉트 왕복을 무사히 버텨야만 동작함.

- PortOne 분기: `if (!pendingRaw) return;` — 임시저장이 사라지면 완전히 조용히 아무것도 안 함(DB기록 없음, 잠금해제 없음). 결제 자체는 PG쪽에서 성공했는데 앱은 전혀 모름.
- Toss 분기: `info || {...}` 폴백은 있었지만, `id`가 `searchParams.get("id")`(원래 쿼리에 없었음)에 의존해서 리다이렉트 후엔 빈 값이 됨 → 폴백이 있어도 사실상 무력.

**원인**: `redirectUrl`/`successUrl`/`failUrl`이 전부 `${origin}${pathname}` 그대로였고 결과 id를 쿼리에 안 담았음. PG는 리다이렉트 시 자기 파라미터(`paymentId`, `code` 등)만 붙이고 원래 쿼리는 유지하므로, 애초에 id를 쿼리에 넣어두면 임시저장이 다 날아가도 살아남음.

**수정** (commit `216d5082`, 2026-08-30):
1. `redirectUrl`(PortOne) / `successUrl`,`failUrl`(Toss)에 `?id=${encodeURIComponent(id)}` 추가 — 4개 파일 전부.
2. PortOne 복귀 처리의 `if (!pendingRaw) return;`을, `id`가 있으면 최소정보(id, 연락처, 이름, 기본금액 — 쿠폰정보는 유실 감수)로 `finalizeSuccess` 호출하는 폴백으로 교체.

**확인한 것**: 이 `?id=` 패턴은 기존에 다른 990원 결제앱(budget/diet/gwangyeoradar/jigun/gamjung/gunghap/haemong/main-v2/momcare/resume/pass/sonjeolgak/daewoon 등 15개+)에 이미 있던 게 아니라 이번에 새로 도입한 하드닝 — grep으로 전체 확인 후 4개 파일에만 적용, 다른 파일은 손대지 않음(에스더님 명시적 요청: "다른파일건들면안되").

**Why**: 에스더님이 "결재저장 닫잘되개 에러없이" 요구 — 결제는 성공했는데 DB에 기록이 안 남는 게 제일 큰 리스크(고객은 돈 냈는데 서비스도 못 받고 문의도 안 들어옴).

**How to apply**: 다른 앱(budget/gwangyeoradar 등)에 같은 리스크가 있다는 걸 알지만, 명시적 요청 없이 확장하지 말 것 — [[feedback_only_touch_requested]] 규칙과 동일. 나중에 에스더님이 "다른 앱들도"라고 하면 이 패턴 그대로 재사용.

관련: [[feedback_only_touch_requested]] [[feedback_wait_for_explicit_go]]
