---
name: project-mbti-banner-batch-final-and-promotion-launch-2026-08-19
description: "배너초기화 재시도로직 11개앱 최종빌드+깃허브 저장 완료, MBTI 비즈월렛 프로모션 실제 시작(진행중) 완료"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-18T16:54:06.319Z
---

## 배너 초기화 레이스컨디션 재시도로직 — 11개앱 최종 완료 (2026-08-19)

[[project_mbti_banner_root_cause_fix_2026_08_19]]에서 확정된 `attachBannerWithRetry` 패턴을
아래 11개 앱(zodiac/petun/saju/resume/tarot/battle/gunghap/jigun/movie/style/work)에 전부 적용,
`.ait` 빌드 완료 후 각 앱 자체 GitHub 저장소에 commit+push 완료.

**Why**: 이전 세션에서 MBTI에서 발견된 `TossAds.initialize()` 비동기 레이스컨디션 버그(초기화 끝나기 전
`attachBanner` 호출 → 배너 안 뜸)가 같은 구조를 쓰는 다른 앱들도 위험해서 전수 적용.

**How to apply**: 새 앱 만들 때 배너 붙이는 코드는 항상 이 재시도 패턴(`attachBannerWithRetry`,
`onAdFailedToRender`에서 "initialize" 메시지면 최대 6번 200ms 간격 재시도) 그대로 복사해서 쓸 것.

각 앱 커밋 해시(master branch):
- battle: 39e0e1d / gunghap: 51a1335 / jigun: 567696c / movie: 7d3b5fa / style: a4c449a / work: f7ed754
- zodiac: 30c3583 / petun: 8b38db0 / saju: 387a3a0 / resume: 1886984 / tarot: 8592145
- diet: 15f6925 (배너 로직 변경 없음, "기획의신 에스더" 소개 2줄 박스만 추가)

**⛔ 확인된 사실 — 다시 물을 필요 없음**: battle/movie/style/work 4개 앱은 이 세션 시작 전부터
이미 "기획의신 에스더" 소개 2줄 박스가 들어가 있었음 (완전무료 배지 바로 위/아래). 새로 넣은 건 diet 하나뿐.
zodiac/saju/resume/tarot/gunghap/jigun 6개는 "완전무료" 배지 자리가 없어서 이 박스를 넣지 않음 — 의도적 스킵, 버그 아님.

빌드는 12개 전부(위 11개+diet) 이 세션에서 성공, deploymentId 전부 기록됨. 업로드는 에스더님이 콘솔에서 직접 진행.

---

## MBTI 비즈월렛 프로모션 — 실제 라이브 시작 완료 (2026-08-19)

[[project_diet_mbti_promotion_approval_flow_2026_08_18]]에서 예고한 "승인 난 뒤 4단계" 전부 실행 완료:

1. `PROMOTION_TEST_MODE`: `true` → `false` 수정 (`jeomun-mbti/src/App.tsx` 19번줄), commit `518786b`
2. 재빌드 → 콘솔에 20260819-92 번들로 업로드(에스더님 직접) → 토스 앱 심사 통과("출시 준비됨")
   - 참고: 같은 날 20260819-91은 "이름 달라서" 반려됨(테스트코드 문제 아니었음, 확인됨) — 92로 재해결
3. 92 "출시하기" 눌러서 앱 버전 정식 출시 완료 ("현재 출시됨" 상태로 확정)
4. 비즈월렛 프로모션 페이지("MBTI 소름 결과 체험", 0/50,000원, 2026.09.17 마감)에서 "시작하기" 눌러서
   프로모션 상태 "진행 전" → **"진행중"**으로 전환 완료

**앱 시작하기(1원 실제 지급) 확인 버튼은 누르지 않고 스킵함** — 코드 구조가 TEST_ 버전과 동일해서
사용자 판단으로 건너뜀. 문제 생기면 이 판단이 원인일 수 있음, 참고할 것.

**Why**: 프로모션 승인(비즈월렛 설정 심사)과 앱 빌드 심사(코드 자체)는 서로 다른 절차 —
프로모션 승인은 코드 변경과 무관하게 이미 별도로 완료되어 있었음. 이 구분을 몰라서 이 세션에
"이거 다시 승인요청 해야하냐" 류의 질문이 여러 번 반복됨.

**How to apply**: 다음에 다른 앱(다이어트 등) 비즈월렛 프로모션 승인 났다고 하면 정확히 같은 4단계
(코드 test mode false 수정 → 재빌드 → 앱 출시하기 → 콘솔 프로모션 시작하기) 그대로 안내할 것.
다이어트는 [[project_diet_mbti_promotion_approval_flow_2026_08_18]] 기준 2026-08-19 시점 아직 승인 안 남 —
"다이어트 승인났어"라고 말하면 즉시 `jeomun-diet/src/App.tsx` 19번줄 `PROMOTION_TEST_MODE` false로 바꾸고 시작.
