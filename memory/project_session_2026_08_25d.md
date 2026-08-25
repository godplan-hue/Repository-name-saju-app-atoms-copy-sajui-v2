---
name: project-session-2026-08-25d
description: "타로+궁합 DB저장 실제코드결함 발견+수정(1회실패시 재시도없이포기), 광고타입 확인결과 수정불필요"
metadata:
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-25T00:56:34.797Z
---

## 1. DB저장 재신고 — 실제 코드 결함 발견 + 수정 (commit `c8f292f` gunghap, `285bf1d` tarot)

[[project_session_2026_08_25c]]에서 Cloudflare를 배제한 뒤, 잘되는 앱(saju/mbti)과 구조를 직접 비교해서 진짜 차이를 찾음.

**발견**: gunghap(`/api/gunghap/lead`)과 tarot(`/api/tarot/lead`)의 저장 fetch 둘 다 **단 1회만 시도하고, 실패해도 `res.ok` 확인 없이 그냥 catch로 조용히 삼킴**. 반면 이미 검증된 saju의 `fbPut()`과 mbti의 `postAnalyzeWithRetry()`는 **3회 재시도 + `res.ok` 체크** 로직이 있음. 네트워크 순간 끊김(토스 웹뷰 특성상 흔함)이 한 번만 발생해도 gunghap/tarot는 그대로 저장 실패인데, 화면 전환은 그대로 진행되어 사용자는 "저장됐다"고 느낌 — **애초에 두 앱 다 성공/실패를 화면에 표시하는 코드 자체가 없었음**(성공 메시지도 없이 그냥 다음 화면으로 넘어감).

**수정**: 두 앱 다 saju/mbti와 동일한 3회 재시도 + `res.ok` 체크 패턴으로 교체.
**Why**: "저장됐다고 나왔는데 안됨" 신고는 애초에 클라이언트가 성공여부를 확인도 안 하고 넘어가는 구조였음 — 화면 전환=성공이 아니었음.
**How to apply**: 이 수정으로 완전히 해결됐다고 단정하지 말 것 — 여전히 실기기 재테스트 필요. 재시도해도 매번 실패한다면(예: 토스 웹뷰가 화면전환 시 백그라운드 fetch를 강제 종료하는 경우) 원인이 더 있을 수 있음. 다음 신고 오면 재확인.
**패턴 각인**: 새 토스 앱 만들 때 리드저장 fetch는 항상 saju의 `fbPut` 패턴(3회 재시도+ok체크)을 기본으로 쓸 것 — 1회성 fetch+빈 catch는 이제 금지 패턴으로 취급.

## 2. 광고 타입 질문 — 리워드광고 vs 전면형 ⚠️ 최초결론 틀림, 이후 gunghap 전면광고로 실제 전환함 (commit `b76c073`)

사용자 질문: 무료전환 후 "리워드광고 붙은 거 빼고 전면형으로 다시 잠그거나 광고를 다 수정해야 하나?"

**최초 결론(틀림)**: "둘 다 지금 상태 그대로 두면 됨" — tarot는 이미 전면형, gunghap은 진짜 리워드광고라 기술적으로 각자 일관됨이라는 순수 기술적 판단이었음. 하지만 이건 사용자 의도를 놓친 답이었음 — 사용자는 "이제 무료앱인데 왜 굳이 끝까지 봐야만 열리는 리워드광고를 유지하냐"는 취지였고, 이 결론에 재차 반박함: "그러닌깐 이두개앱을 지금 무료로바꿧잔아 그러니 리워드광고는매리고전면광고로수정해야한다고"(리워드광고 떼고 전면광고로 수정).

**실제 조치**: `jeomun-gunghap`의 `watchAdToUnlock()`을 `GoogleAdMob.showAppsInTossAdMob`+`REWARD_AD_GROUP_ID`+`userEarnedReward` 체크 방식에서 → `showFullScreenAd`/`loadFullScreenAd`+`INTERSTITIAL_AD_GROUP_ID`+`dismissed`/`failedToShow`/`impression`시 즉시 unlock 방식(tarot의 `watchAd()`와 동일 패턴)으로 교체. 5개 잠금(score/relation/1/2/3) 전부 이 공유함수 하나로 처리되므로 함수 하나만 수정. `REWARD_AD_GROUP_ID`/`GoogleAdMob`은 다른 곳(결과화면 프리로드)에서 여전히 참조되므로 삭제 안 함(삭제보다 추가 원칙).

**Why**: 무료앱은 유료 전환을 유도할 필요가 없으니, 끝까지 시청을 강제하는 리워드광고보다 이탈 없이 바로 풀리는 전면광고가 UX상 낫다는 것이 사용자의 실제 의도였음.
**How to apply**: "무료전환했으니 광고방식도 통일/완화해야 하나?" 류 질문이 오면, 기술적으로 각자 정상 작동하더라도 **비즈니스 모델 변경에 맞춰 UX를 통일하라는 요청일 가능성을 먼저 고려할 것** — "코드상 문제없다"는 답만으로 끝내지 말 것. 빌드 완료 `gunghap-jeomun.ait`, deploymentId `01a0366a-63ba-7469-a901-6523adc9f121` — **콘솔 재업로드 필요(사용자)**.
