---
name: bug-petun-zodiac-haemong-interstitial-to-reward-ad
description: 펫운/별자리/꿈해몽 무료 잠금해제 광고를 전면광고→진짜 리워드광고(MBTI 방식)로 전환
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-02T03:17:38.165Z
---

펫운(jeomun-petun)·별자리(jeomun-zodiac)·꿈해몽(jeomun-haemong) 3개 앱의 무료 이용자용 잠금해제 광고가 전부 전면광고(`showFullScreenAd`)였고, 광고를 끝까지 안 봐도(닫기/실패/타임아웃) 잠금이 풀리는 구조였음. 별자리는 `INTERSTITIAL_AD_GROUP_ID`가 빈값이면 광고 자체 없이 즉시 잠금해제되는 버그까지 있었음.

MBTI(`jeomun-mbti`)의 `GoogleAdMob.showAppsInTossAdMob` + `userEarnedReward` 이벤트 게이팅 패턴을 그대로 이식. `dismissed`/`failedToShow`/`adClosed`는 잠금해제 없이 광고만 재로드, 오직 `userEarnedReward`에서만 해제.

- 펫운/별자리: 결제(990원/24시간)와 같은 localStorage 키를 재사용해 광고로 풀어도 24시간 유지 (에스더님 명시 요청: "24시간열리고 24시간후닫히는거잔아 엠비티아이처럼")
- 꿈해몽: 꿈 분석 결과가 매번 새로 생성되는 구조라 24시간 저장 미적용, 기존 세션 리셋 로직 유지 — petun/zodiac과 의도적으로 다름
- 결제한 사람은 광고 자체를 안 봄 (기존 유료 분기 그대로 유지, 건드리지 않음)

커밋: petun `679f074`, zodiac `4d9a40d`, haemong `8a82d7b` — 전부 push 완료, tsc --noEmit 통과 확인.

**⛔ 남은 필수 작업 — 리워드 광고 그룹ID가 전부 가짜/공백**:
- 펫운: `REWARD_AD_GROUP_ID = ""` (배너/전면도 원래 공백)
- 별자리: `REWARD_AD_GROUP_ID = ""` (배너/전면도 원래 공백)
- 꿈해몽: `REWARD_AD_GROUP_ID = "ait.v2.live.haemong_reward"` — 이 값은 진짜 형식(`ait.v2.live.해시값`, 예: MBTI의 `ait.v2.live.559c8d618d1549d1`)이 아니라 사람이 지어낸 슬러그로 보임. 실제 콘솔 발급 ID가 아닐 가능성 높음.

**How to apply**: 토스 콘솔에서 펫운/별자리/꿈해몽 3개 앱 각각 리워드 광고 그룹ID를 발급/확인해서 알려달라고 요청할 것 — 실제 ID 없이는 `GoogleAdMob`이 동작 안 해서 코드는 맞아도 광고가 안 뜸. [[bug_jigun_reward_ad_fake_globalref_2026_09_01]]과 같은 계열(잠금해제 로직 버그 패밀리)이지만 이번 건은 원인이 "가짜 전역참조"가 아니라 "인터스티셜→리워드 미전환"이었음.
