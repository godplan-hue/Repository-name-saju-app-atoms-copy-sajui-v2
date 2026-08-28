---
name: project-admin-source-tracking-2026-08-28
description: 관리자 패널 유입경로(경로) 추적 확장 — 일반회원 DB에도 당근/틱톡/블로그 등 표시되게 수정
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-28T13:46:42.102Z
---

## 배경
에스더님이 2026-08-28 틱톡·당근마켓 광고를 집행하고, 어느 앱/어느 광고에서 신규 가입자가 들어왔는지 확인하려다가 관리자 패널 구조를 정리하게 됨.

## 관리자 패널 3분리 구조 (재확인)
1. `/admin/customers` "일반회원 DB" — Firebase `consumerCustomers`. 사주 프로필입력(`app/main-v2/profile/page.tsx` finish()) + 파트너랜딩(`app/lp/[id]/LandingForm.tsx`)만 씀. 결제여부 무관, 사주 전용.
2. `/admin/direct-payments` "💳 결제내역" 탭 — `v2_direct_payments`. 실제 990원+ 사주 결제만.
3. `/admin/direct-payments` "🎁 무료DB" 탭 — MBTI/직운/합격/궁합/펫운/타로/별자리/토스가입자 등 다른앱 무료가입 전부(~37개 Firebase 경로). 사주 직접고객은 여기 절대 안뜸.

## 오늘 한 수정 (commit ede235ac, 5edce4d1 — jeomun main repo)
- `app/main-v2/pay/page.tsx`: 결제 유입경로 감지에 당근(daangn)/네이버블로그(blog.naver)/티스토리(tistory) 추가. 틱톡·인스타·유튜브·페이스북은 이미 있었음.
- `app/api/v2/customer/route.ts`, `app/main-v2/profile/page.tsx`, `app/admin/customers/page.tsx`: "일반회원 DB"에는 경로 필드 자체가 없었어서 신규 추가. referrer 기반 자동감지(구글/네이버/다음/빙/카카오/인스타/유튜브/틱톡/페이스북/당근/네이버블로그/티스토리/내부경로/직접).

## 한계 (에스더님께 안내 완료, 승인받음)
- 틱톡·인스타·카카오 인앱브라우저는 referrer를 가끔 안 보내줘서 "직접"으로 잡힘 — 100% 추적 안 됨, 에스더님도 "안잡히는건 어쩔수없다" 승인함.
- "직접" = 순수 자체유입이 아니라 "직접방문 + 추적안된 경우" 혼합임 (오해 정정 완료).
- 코드가 자동으로 referrer만 읽는 구조라 틱톡/당근 광고플랫폼 쪽에서 따로 설정할 건 없음 (순수 코드사이드).
- 새로 추가된 경로 컬럼은 신규가입자부터만 표시됨. 기존 기록은 "-"로 비어있음.

## 손절각(sonjeolgak) 웹+토스 프리미엄 구조 재확인 (수정 안함, 질문만 받음)
7개 파트(우정/연애/전애인/썸바람/직장/가족/여행) 퀴즈+기본결과(점수/타입/설명/조언/궁합)는 전부 무료 — 이건 [[project_sonjeolgak_app_launch_2026_08_27]]에서 8/27에 의도적으로 설계한 MBTI 방식 훅. 진짜 유료 콘텐츠(심층분석 10항목: 과거패턴/위험신호/회복팁/미래운/액션플랜/어두운면/이별스타일/닮은유명인/궁합상세/부딪히는유형TOP3)는 결과지 하단에 잠겨있고 ₩990 결제해야 24시간 열림. 토스 미니앱(`jeomun-sonjeolgak`)도 동일 구조로 확인됨.

## 기타
- 오늘 세션 중 `jeomun-petun` 저장소에 미커밋 상태로 남아있던 크로스프로모 명칭 수정("관계레이더 점운"→"연락기록통계", "손절각 점운"→"손절각") 발견해서 commit d5e45da로 커밋+푸시 완료.
- 22개 토스 미니앱 폴더 전체 git status 확인 — petun 외엔 전부 클린했음.
