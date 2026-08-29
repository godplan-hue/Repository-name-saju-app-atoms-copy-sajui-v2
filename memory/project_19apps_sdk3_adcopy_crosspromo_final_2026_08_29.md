---
name: project_19apps_sdk3_adcopy_crosspromo_final_2026_08_29
description: "토스 미니앱 19개 전체 SDK3.x전환+광고문구통일+크로스프로모18개 최종완료, GitHub push 확인완료 (2026-08-29)"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-29T04:32:57.676Z
---

## ⛔⛔⛔ 이 3가지는 19개 앱 전부 100% 완료됐다 — 다시 "안했다"고 말하지 말 것

2026-08-27, 08-28, 08-29 사흘에 걸쳐 같은 걸 "안 됐다"고 잘못 보고해서 에스더님이 반복해서 화내셨음.
**이 문서가 최종 확정본이다. 새 세션에서 이 3가지를 다시 조사하지 말고 이 문서를 그대로 믿을 것.**

### 대상 19개 앱 (jeomun-* 폴더, C:\Users\moon6\OneDrive\바탕 화면\ 아래)
battle, budget, daewoon, diet, fortune, gamjung, gunghap, gwangyeoradar, jigun, mbti, momcare, movie, resume, saju, sonjeolgak, style, taegil, tarot, work

(haemong/zodiac/petun 폴더는 죽은 프로토타입 — 실제 기능은 jeomun-saju 내부 탭으로 존재. 이 3개 폴더는 위 19개에 포함 안 됨 — [[feedback_haemong_zodiac_petun_bundled_in_saju_reminder_2026_08_27]] 참조)

### 완료 항목 1 — SDK 3.x 전환
`package.json`에 `"@apps-in-toss/web-framework": "^3.1.1"` + `"build": "vite build && ait build"`, `apps-in-toss.config.ts` 존재, `vite.config.ts`에 `aitDevtools.vite()` 플러그인 — **19개 전부 확인됨**

### 완료 항목 2 — 광고 안내 문구 통일
로딩 라벨(예: "📺 광고 준비 중..." 또는 동등 표현) + 버튼 아래 캡션(예: "📺 광고를 보면 무료로 열람할 수 있어요" 또는 동등 표현, daewoon·fortune은 "📺 광고가 표시돼요" 문구로 이미 존재) — **19개 전부 확인됨**
- 2026-08-29에 resume(1곳)·tarot(5곳) 캡션 누락 발견 후 추가완료 — commit `7a94e06`(resume), `ad436d1`(tarot)
- daewoon·fortune은 문구만 다를 뿐 처음부터 이미 있었음 (내 최초 좁은 grep이 false positive였음)

### 완료 항목 3 — 크로스프로모 18개 그리드 (다른앱 소개)
"연락기록통계"(관계레이더)/"손절각" 2개 신규 와이드타일 포함한 18개 앱 그리드 — **19개 전부 확인됨** (gwangyeoradar는 자기자신 제외하는 게 정상)

### GitHub 최종 저장 상태 (2026-08-29 확인)
19개 앱 전부 `git status` 클린(uncommitted 없음), `origin`과 완전 동기화(ahead:0) — 로컬 작업이 전부 GitHub에 반영돼 있음. 각 앱 HEAD 커밋:
battle 149317a / budget 5d2f45a / daewoon dc16497 / diet b32023b / fortune c28c094 / gamjung d95ba15 / gunghap f37a1e1 / gwangyeoradar b084482 / jigun ac4099e / mbti 125aa58 / momcare 4892d8e / movie 066a3b1 / resume 7a94e06 / saju 114c538 / sonjeolgak 498035a / style be8304c / taegil 9afb80d / tarot ad436d1 / work 7a2556a

**⛔ 콘솔 업로드(ait deploy)는 여전히 에스더님 본인 몫 — GitHub 저장 완료 ≠ 토스 콘솔 반영 완료.** 재업로드는 에스더님이 직접 하신다.

## 관련 메모리
- [[project_sdk3_migration_status_2026_08_27]] — 8/21개였던 구버전 현황표, 이 문서로 대체됨
- [[project_budget_ad_retry_timeout_fix_2026_08_28]] — 가계부 코인 중복지급 가드(254bf21)는 코드상 정상, 08-29에 에스더님이 가드 수정 "전" 버전을 테스트했던 것으로 확인됨(타이밍 오해) — 코드 자체는 문제없음
