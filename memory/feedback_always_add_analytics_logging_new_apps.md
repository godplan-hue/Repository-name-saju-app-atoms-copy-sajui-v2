---
name: feedback-always-add-analytics-logging-new-apps
description: 새 토스 미니앱 만들 때는 처음부터 Analytics 로그를 반드시 심을 것
metadata:
  type: feedback
---

앞으로 만드는 모든 신규 토스 미니앱은 처음부터 `Analytics` 로그를 기본으로 심는다.

**Why:** 관계레이더(점운) 앱 개발 중 에스더님이 "이제부터만들앱들은항상 로그다심어야해"라고 명시적으로 지시함(2026-08-25). 이탈 지점·전환율 파악을 위해 로그 없이 앱을 완성하면 나중에 다시 넣어야 하는 비효율이 생김.

**How to apply:**
- 새 앱 App.tsx 작성 시 `@apps-in-toss/web-framework`에서 `Analytics` import
- 화면 진입: 각 step 변경마다 `Analytics.screen?.({ log_name: "{app}_{step}" })` (useEffect로 step 의존)
- 결과 화면은 유료/무료 상태 분기: `{app}_result_paid` / `{app}_result_locked`
- 주요 액션 클릭: `Analytics.click?.({ log_name: "{app}_xxx_click" })` — 광고클릭, 결제클릭, 공유클릭, 문의제출클릭 등
- 리워드 광고 획득: `Analytics.impression?.({ log_name: "{app}_reward_ad_earned", section: sectionKey })`
- 모든 호출은 optional chaining(`?.`) 필수 — 환경에 따라 API 없을 수 있음
- 참고 구현: jeomun-mbti/src/App.tsx (mbti_ 접두사), jeomun-gwangyeoradar/src/App.tsx (gyr_ 접두사)
