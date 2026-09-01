---
name: bug-jigun-reward-ad-fake-globalref-2026-09-01
description: "직운(jigun) 리워드광고가 존재하지않는 window.__GoogleAdMob 전역참조 때문에 항상 폴백으로 빠져 닫기만해도 언락되던 버그 확정+수정"
metadata:
  type: project
  date: 2026-09-01
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-01T03:55:42.765Z
---

에스더님이 "택일 광고 중간에 닫아도 열린다" → "우리 사이트 모든 앱이 다 그렇다"고 문제제기해서, 리워드광고(`showAppsInTossAdMob`/`userEarnedReward`)를 쓰는 9개 앱(tarot·taegil·daewoon·sonjeolgak·gwangyeoradar·gunghap·resume·mbti·jigun) 전체 코드를 다시 읽어서 감사함.

**결과: jigun 1개만 진짜 코드버그, 나머지 8개는 전부 정상.**

**원인 (jigun)**: `watchAdToUnlock` 함수가 정식으로 import한 `GoogleAdMob` 모듈이 아니라 `window.__GoogleAdMob`이라는 존재하지 않는 전역을 참조(`adGroupId: ""` 빈값까지)하고 있었음. `isSupported?.()` 체크가 실제 환경에서 항상 false로 떨어지므로 매번 "리워드 미지원 환경 폴백" 분기로 빠짐 — 그 폴백은 그냥 `showFullScreenAd`(일반 전면광고)를 쓰면서 `dismissed`/`adClosed`/`adImpression` 이벤트만으로 `doUnlock()`을 호출했음. 즉 광고를 안 보고 그냥 닫아도 항상 잠금해제되는 구조 — 사실상 리워드 광고가 아니라 "광고 한번 띄우기만 하면 무조건 열리는" 상태였음.

파일에 이미 `REWARD_AD_GROUP_ID = "ait.v2.live.96209f9134704ae7"`가 정의는 돼있었는데 실제로 어디서도 안 쓰이고 있었음 — 만들다 만 미완성 구현으로 추정.

**Why**: 다른 8개 앱은 전부 `GoogleAdMob.showAppsInTossAdMob.isSupported?.()` → 정식 모듈로 직접 체크하고 `userEarnedReward`에서만 언락, dismiss/실패시엔 언락없이 재로딩만 하는 동일 패턴이라 문제없음. jigun만 유일하게 `window.__GoogleAdMob` 전역참조 방식 + 미지원시 전면광고로 대체하는 폴백 분기를 갖고 있었고, 그 폴백이 구식 "닫으면 열림" 로직이었음.

**How to apply**:
- jeomun-jigun `src/App.tsx`: import에 `GoogleAdMob` 추가, `watchAdToUnlock`을 다른 앱과 동일한 패턴(`GoogleAdMob.showAppsInTossAdMob` + `REWARD_AD_GROUP_ID`, `userEarnedReward`에서만 unlock, dismiss/failedToShow/adClosed는 `reloadRewardAd()`만)으로 전면 교체. `reloadRewardAd()` 헬퍼 신규 추가 + 결과지(step==="result") 진입시 프리로드 useEffect 추가. commit `f3a86ec`, typecheck+build+`.ait` 재빌드 완료. **콘솔 업로드는 에스더님 몫.**
- 나머지 8개 앱은 [[project_sonjeolgak_gwangyeoradar_global_unlock_2026_09_01]]에 기록된 대로 이미 정상 — 라이브에서 여전히 "닫아도 열림" 증상이 보인다면 그건 코드 문제가 아니라 **로컬에서 재빌드한 `.ait`가 토스 콘솔에 아직 업로드/심사 안 된 상태(구버전이 서비스중)**일 가능성이 큼. 특히 택일·대운은 지난 세션에 fix 완료했지만 "콘솔 업로드는 에스더님 몫"으로 남겨둔 상태였음 — 새 세션에서 같은 증상 재보고되면 코드 재조사보다 먼저 콘솔 업로드 여부부터 확인할 것.
- [[feedback_investigate_fully_before_asking_reupload]]와 같은 교훈: 메모리에 "이미 수정완료"라고 적혀있어도 사용자가 라이브에서 반대되는 결과를 직접 테스트해서 보고하면, 메모리 기록을 그냥 반복하지 말고 실제 파일을 다시 Grep/Read로 검증할 것 — 이번에 그렇게 해서 jigun의 진짜 버그를 찾음.
