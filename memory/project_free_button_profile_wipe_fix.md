---
name: project_free_button_profile_wipe_fix
description: 2026-08-14 결과지 홈으로/처음부터 버튼이 생년월일 프로필까지 지워서 3초 무료버튼이 로그인처럼 안되던 버그 수정 (commit a327637)
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-14T01:40:04.340Z
---

## 문제
"🔮 3초만에 무료로 내 사주 보기" 버튼이 기존 가입자에게도 5단계 프로필을 처음부터 다시 입력하게 만들었음. 화면엔 이름("장문정님")이 남아있어 로그인된 것처럼 보였지만, 실제 생년월일/성별/시간 정보는 사라진 상태였음.

## 원인
`app/main-v2/result/page.tsx`의 "홈으로"/"처음부터 시작하기" 버튼 2곳(자동 리다이렉트 블록 + 에러화면 버튼)이 localStorage `v2_saved_profile`(생년월일/성별/시간 캐시)을 결제/잠금 키들과 함께 통째로 지우고 있었음. 반면 `v2_user_name`은 지우는 목록에 없어서 이름만 남고 생년월일은 사라지는 불일치가 생김.

`goFree()`(main-v2/page.tsx)와 profile 위저드의 자유흐름 단축 로직 둘 다 `name+birthYear+gender+birthHour` 4개가 다 있어야 5단계 위저드를 건너뛰는데, birthYear 등이 없으니 매번 처음부터 다시 보여줬던 것.

## 확인된 사실
- 전화번호 기반 Firebase 서버 저장(`consumerCustomers`)은 이 버그와 완전히 무관, 항상 정상 작동 — 로그인(전화번호 인증) 하면 `checkPhone()`이 서버에서 다시 받아와 `v2_saved_profile`을 자동 복구(self-heal)했기 때문에 로그인 흐름은 늘 정상으로 보였음
- 브라우저 로컬 캐시(`v2_saved_profile`)만 결과지 버튼에 의해 지워지는 문제였음

## 수정
`app/main-v2/result/page.tsx` 두 곳에서 `"v2_saved_profile"`을 초기화 배열에서 제거. 결제/잠금 키(`v2_paid_cats`, `v2_plan`, `v2_paid`, `v2_price`, `*_unlock_until`)만 초기화되고 프로필 캐시는 유지되도록 함.

**Why**: 에스더님 의도된 설계 — "3초 무료" 버튼도 로그인처럼 기존 가입자는 자동으로 정보가 채워져서 다음만 누르면 넘어가야 함.

**How to apply**: localStorage 초기화 로직을 다른 곳에도 추가할 때 `v2_saved_profile`(프로필 캐시)과 결제/잠금 상태 키를 구분해서, 프로필 캐시는 로그아웃 목적이 아닌 이상 지우지 말 것.
