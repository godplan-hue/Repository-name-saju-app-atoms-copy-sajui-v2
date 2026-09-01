---
name: project-crosspromo-intro-result-all18apps-done
description: "18개 jeomun-* 미니앱 전부 인트로(첫화면)+결과지 화면에 CrossPromoMini(18개 다른앱 소개) 삽입 완료, 커밋 해시 전체 목록"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-01T08:06:32.294Z
---

2026-09-01 세션에서 택일(taegil)에 18개 다른앱 소개가 결과지에만 있고 인트로/정보입력엔 없던 걸 시작으로, 전체 jeomun-* 앱을 감사해 인트로(첫화면)+결과지 두 곳 모두에 `<CrossPromoMini />`가 뜨도록 전부 맞췄다.

**Why:** 에스더님이 대운도 이미 심사제출했는데 인트로에 안 보인다고 지적 → "모든앱에광고문구다넣어" → 이후 "결과지에만나오네" 확인 → "엠비티아이처럼넣어줘" (MBTI 방식=인트로에 넣기) → "아마 매인과 결과지일거야"로 스코프 확정(인트로+결과지 최소 보장).

**커밋 해시 전체 (18개 앱)**:
- jeomun-taegil `f30074f` — 인트로/정보입력/목적선택 추가(결과지는 원래 있었음)
- jeomun-daewoon `941b695` — 인트로/정보입력/메인첫화면 추가 (⚠️ 이미 심사제출된 상태라 재업로드 시급)
- jeomun-saju `8f42de1` — 인트로/사주결과 추가 (기존 중복 인라인 그리드는 공유컴포넌트로 교체 — 이후 [[feedback_dont_remove_existing_crosspromo_other_pages_2026_09_01]] 제지받음)
- jeomun-battle `8f11abe` — 정보입력/월드컵진행 추가
- jeomun-fortune `0a870ff` — 인트로/중간화면 추가
- jeomun-gamjung `8641d1a` — 정보입력/기분선택/활동태그/메모작성 추가
- jeomun-gwangyeoradar `509c820` — 인트로 추가
- jeomun-diet `c3d86a2` — 인트로/정보입력 추가
- jeomun-budget `8fff68d` — 인트로/정보입력/공유모달/대시보드 (컴포넌트 자체가 없어 새로 분리)
- jeomun-movie `b99e617` — 정보입력/상황선택 추가
- jeomun-resume `8a59932` — 정보입력 추가
- jeomun-gunghap `cbcde54` — 정보입력/퀴즈 추가
- jeomun-momcare `2b605bf` — 인트로/정보입력 추가 (컴포넌트 새로 분리)
- jeomun-tarot `15ec6b4` — 메인/결과 추가 (기존 다른 위치 중복 그리드는 안건드림, 정상처리)
- jeomun-work `b2ad8b0` — 정보입력/퀴즈/직장상사선택 추가
- jeomun-style `f236521` — 정보입력/퀴즈 추가
- jeomun-sonjeolgak `f97b8d7` — 정보입력/퀴즈 추가
- jeomun-jigun 변경없음 — 이미 메인+결과지 다 있었음

**How to apply**: 전부 로컬 코드수정+빌드(.ait)+커밋+푸시까지 완료. **토스 콘솔 재업로드+심사재제출은 전부 사용자 몫으로 남아있음** — 특히 대운은 이미 심사 들어간 상태라 재업로드 안 하면 옛 버전으로 승인남. 다음 세션에서 "다 됐다고 했는데 왜 안 보이냐"는 질문이 오면 콘솔 업로드 여부부터 확인할 것.
