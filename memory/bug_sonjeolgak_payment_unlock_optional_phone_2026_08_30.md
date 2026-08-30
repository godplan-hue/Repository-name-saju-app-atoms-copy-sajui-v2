---
name: bug-sonjeolgak-payment-unlock-optional-phone-2026-08-30
description: "손절각 990원 결제해도 잠금이 안풀리던 버그 원인+수정 (전화번호 선택입력인데 매칭조건은 필수AND였음), 연락기록통계는 반대로 과다열림 확인"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-30T01:00:55.432Z
---

에스더님 신고: "점운 손절각이랑 연락ㅇ앱이 결재가안된다는거야" + "소절각은7개로 각각990원다결재되게핸뇟는데 에러수정해줘". 손절각은 7개 관계카테고리(part)별로 각각 990원 결제하는 구조.

**원인**: `app/sonjeolgak/result/[id]/page.tsx`의 잠금해제 조건이 `until > Date.now() && !!savedPhone && !!resultPhone && savedPhone === resultPhone` (AND 필수매칭). 그런데 `app/sonjeolgak/pay/page.tsx`의 전화번호 입력란은 "휴대폰 번호 (선택)"으로 선택입력 — `finalizeSuccess()`가 `uKey`(unlock_until)는 항상 저장하지만 `pKey`(unlock_phone)는 `if (cleanMobile)`일 때만 저장. 번호를 안 넣고 결제하면 `savedPhone`이 영원히 빈 값이라 AND 조건이 절대 참이 될 수 없어 결제해도 절대 안 풀림.

**수정** (commit `76f456a0`): 조건을 `until > Date.now() && (!savedPhone || !resultPhone || savedPhone === resultPhone)`로 완화 (OR기반, gwangyeoradar 기존 패턴과 동일하게 맞춤). 손절각 코드 전체에서 이 조건이 유일한 잠금 게이트였음(grep 확인).

**연락기록통계(gwangyeoradar)는 조사했으나 반대 증상**: 코드를 보면 오히려 전화번호 둘 중 하나만 비어도 풀리는 느슨한 OR 로직(`gwangyeoradar_unlock_until`은 결과id 무관 전역키)이라, "결제해도 안풀림"이 아니라 "한 번 결제하면 그 브라우저에서 24시간 동안 다른 사람 공유링크까지 다 풀려버릴 위험"이 있는 구조. 사용자가 신고한 "안풀림" 증상과 코드가 안 맞아서, 수정하지 않고 스크린샷/재현 상황을 요청한 상태 (미해결).

**Why**: 폼에서 전화번호를 선택입력으로 만들어두고 잠금조건은 그 값이 있어야만 통과하는 필수조건으로 짜면, 번호 없이 결제한 사람은 영구히 콘텐츠를 못 봄 — 사주앱 계열 전체에 반복되는 설계 실수 패턴. [[bug_mbti_global_unlock_key_overwrite_2026_08_30]] 참고 — 같은 "unlock 키 설계" 버그의 3번째 변종(전역키 덮어쓰기).

**How to apply**: 새 990원 결제 앱 만들거나 잠금 버그 신고 받으면, (1) 전화번호 필드가 선택입력인지, (2) 잠금조건이 그 값을 필수(AND)로 요구하는지 먼저 확인. 필수 아니면 OR기반으로 짤 것.
