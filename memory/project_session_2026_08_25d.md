---
name: project-session-2026-08-25d
description: "타로+궁합 DB저장 실제코드결함 발견+수정(1회실패시 재시도없이포기), 광고타입 확인결과 수정불필요"
metadata:
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-25T00:49:56.426Z
---

## 1. DB저장 재신고 — 실제 코드 결함 발견 + 수정 (commit `c8f292f` gunghap, `285bf1d` tarot)

[[project_session_2026_08_25c]]에서 Cloudflare를 배제한 뒤, 잘되는 앱(saju/mbti)과 구조를 직접 비교해서 진짜 차이를 찾음.

**발견**: gunghap(`/api/gunghap/lead`)과 tarot(`/api/tarot/lead`)의 저장 fetch 둘 다 **단 1회만 시도하고, 실패해도 `res.ok` 확인 없이 그냥 catch로 조용히 삼킴**. 반면 이미 검증된 saju의 `fbPut()`과 mbti의 `postAnalyzeWithRetry()`는 **3회 재시도 + `res.ok` 체크** 로직이 있음. 네트워크 순간 끊김(토스 웹뷰 특성상 흔함)이 한 번만 발생해도 gunghap/tarot는 그대로 저장 실패인데, 화면 전환은 그대로 진행되어 사용자는 "저장됐다"고 느낌 — **애초에 두 앱 다 성공/실패를 화면에 표시하는 코드 자체가 없었음**(성공 메시지도 없이 그냥 다음 화면으로 넘어감).

**수정**: 두 앱 다 saju/mbti와 동일한 3회 재시도 + `res.ok` 체크 패턴으로 교체.
**Why**: "저장됐다고 나왔는데 안됨" 신고는 애초에 클라이언트가 성공여부를 확인도 안 하고 넘어가는 구조였음 — 화면 전환=성공이 아니었음.
**How to apply**: 이 수정으로 완전히 해결됐다고 단정하지 말 것 — 여전히 실기기 재테스트 필요. 재시도해도 매번 실패한다면(예: 토스 웹뷰가 화면전환 시 백그라운드 fetch를 강제 종료하는 경우) 원인이 더 있을 수 있음. 다음 신고 오면 재확인.
**패턴 각인**: 새 토스 앱 만들 때 리드저장 fetch는 항상 saju의 `fbPut` 패턴(3회 재시도+ok체크)을 기본으로 쓸 것 — 1회성 fetch+빈 catch는 이제 금지 패턴으로 취급.

## 2. 광고 타입 질문 — 리워드광고 vs 전면형, 수정 불필요 확인

사용자 질문: 무료전환 후 "리워드광고 붙은 거 빼고 전면형으로 다시 잠그거나 광고를 다 수정해야 하나?"

코드 직접 확인 결과:
- **tarot의 `watchAd()`**: 이미 `showFullScreenAd`(전면형 광고) 사용 중 — `userEarnedReward` 체크 없이 `dismissed`/`impression`이면 바로 unlock. 즉 tarot는 원래부터 전면형 광고 기반 무료열기였음(진짜 리워드광고 아님).
- **gunghap의 `watchAdToUnlock()`**: `GoogleAdMob.showAppsInTossAdMob` + `userEarnedReward` 이벤트 체크 — 진짜 리워드광고 맞음.

**결론**: 둘 다 지금 상태 그대로 두면 됨. tarot는 이미 전면형이라 수정할 것 없고, gunghap은 리워드광고가 맞게 붙어있어서 이것도 정상. 사용자가 걱정한 "광고 타입 재수정"은 불필요.
**How to apply**: 혹시 gunghap도 tarot처럼 "끝까지 안 봐도 닫으면 바로 열리는" 더 관대한 방식으로 통일하고 싶다면 그건 순수 UX 선택이지 버그 수정이 아님 — 요청 오면 그때 반영.
