---
name: project-mbti-banner-root-cause-fix-2026-08-19
description: MBTI 메인 배너광고 안 뜨던 진짜 원인 확정+수정 완료 — TossAds.initialize() 끝나기 전 attachBanner 호출되는 레이스 컨디션. 다른 앱도 같은 구조면 동일 위험 있음
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-18T15:02:55.552Z
---

## 확정된 원인 (실기기 진단 배너로 실제 에러 확인함, 추측 아님)

- 에러 메시지: `{"error":{"code":0,"message":"[toss-ad] Call initialize() before attaching an ad."}}`
- `TossAds.initialize({})`는 내부적으로 비동기인데, MBTI 코드는 배너 attach effect가 `[step]`에만 의존 → `step`이 마운트 즉시 "intro"로 정해져 있어서 initialize()랑 거의 동시에 attachBanner가 발사됨 → SDK가 "초기화 안 끝났다"며 렌더 거부

## 왜 다이어트(jeomun-diet)는 같은 구조인데 안 걸렸는가

- 다이어트 배너 effect는 `[setupDone, tab, step]`에 의존, `setupDone`은 Firebase 프로필 로딩 끝나야 true로 바뀜
- 즉 다이어트는 attachBanner가 "우연히" 한 박자 늦게 실행돼서 initialize() 완료 시간을 자동으로 벌어준 것 — 의도적 설계가 아니라 우연히 회피된 것이었음

## 수정 내용 (jeomun-mbti/src/App.tsx)

- `adsReady` state 추가, initialize() 호출 직후 `setTimeout(() => setAdsReady(true), 800)`
- 배너 attach 두 곳(`mbti-banner`, `mbti-banner-top`) effect 모두 `if (!adsReady) return;` 가드 추가, deps에 `adsReady` 포함
- 진단용으로 `attachBanner`의 `callbacks.onAdFailedToRender` / `onNoFill` / `onAdRendered`에 `showTestBanner()` 연결해서 실기기에서 실패 사유가 화면에 바로 보이게 해둠 (이 콜백은 그대로 유지됨 — 원인 재발 시 바로 보임)
- 빌드: deploymentId `01a01565-0e41-7775-929c-05e7e7c5265a`

## ⚠️ 다른 앱도 같은 위험 있을 수 있음 (아직 미확인, 요청 없으면 손대지 말 것)

- initialize()를 별도 effect(`[]`)로 부르고, 배너 attach effect가 **마운트 즉시 값이 정해지는 state**(예: `step` 초기값이 "intro"처럼 고정)에만 의존하는 앱은 전부 같은 레이스 컨디션 위험이 있음
- 반대로 Firebase/tossGet 같은 비동기 로딩 완료 플래그(`setupDone`류)에 의존하는 앱은 우연히 안전함
- **에스더님이 명시적으로 요청하기 전까지 다른 앱 코드는 건드리지 말 것** — 이 메모만 남겨두고 다음에 물어보면 이 패턴부터 확인할 것

## Why
"자꾸 끼워맞추지마" 라는 명확한 지적을 받은 뒤, 추측 대신 실제 화면에 에러를 띄우는 진단 코드로 실기기에서 직접 원인을 확인함 — 실제 근거 있는 원인이 확정된 사례.

## How to apply
MBTI 배너가 다시 안 뜬다는 얘기가 나오면, 먼저 이 진단 콜백(onAdFailedToRender/onNoFill)이 화면에 뭘 띄우는지부터 확인할 것. "이유를 모르겠다"는 답을 하지 말고 진단 배너 내용을 요청할 것.
