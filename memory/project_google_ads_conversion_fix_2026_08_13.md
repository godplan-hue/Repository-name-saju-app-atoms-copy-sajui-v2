---
name: project-google-ads-conversion-fix-2026-08-13
description: 구글애즈 전환추적 0건 버그 원인+수정 완료 (2026-08-13) — gtag 발송 직후 페이지이동으로 신호 끊기던 문제
metadata:
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-13T02:25:03.740Z
---

## 문제

점운-검색-사주 캠페인, 7일간 클릭 114회인데 전환(결제) 0건으로 표시됨.
구글애즈 캠페인 진단에서 "⚠️ 전환 추적 설정이 완료되지 않음" 확인.

## 원인 (2026-08-13 확인)

전환 추적 코드 자체는 [[project_...]] 이미 8/9에 넣어놨었음(commit `1b6291c`, `app/main-v2/pay/page.tsx`).
문제는 `gtag('event','conversion', {...})` 호출 **직후 바로** `window.location.href`로 결과지 페이지 이동시켜서,
전송 신호(beacon)가 브라우저에서 채 나가기도 전에 페이지가 넘어가버려 구글이 못 받던 것.
그래서 결제는 실제로 여러 번 성공(카카오페이 정상)했는데도 구글엔 0건으로 잡힘.

## 수정 (commit `951e91c`)

`app/main-v2/pay/page.tsx` `pay()` 함수 — gtag 이벤트에 `event_callback`을 걸어서 전송 완료 신호를 받은 뒤에 페이지 이동하도록 변경.
콜백이 안 올 경우 대비해 1초 타임아웃 안전장치도 추가(무한 대기 방지).

```js
(window as any).gtag("event", "conversion", {
  send_to: "AW-459070148/D7-4CKip7e0BEMS189oB",
  transaction_id: paymentId,
  event_callback: goNow,
});
setTimeout(goNow, 1000); // 콜백 안 오면 1초 후 강제 이동
```

**Why:** 전환수 0건이라 광고 효율 판단이 원천적으로 불가능했음 — 실제로는 광고가 잘 도는데 추적만 안 잡혀서 "광고가 안 팔린다"고 오해할 뻔함.
**How to apply:** 다른 앱(직운/합격자소서 등) 결제 페이지에도 전환추적 넣을 때는 반드시 이 event_callback 패턴 사용할 것 — gtag 호출 후 즉시 location.href 이동은 절대 금지. 적용 후 며칠 뒤 구글애즈 "구매" 전환 액션 상태가 "운영중"으로 바뀌는지 재확인 필요.
