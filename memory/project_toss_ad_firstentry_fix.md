---
name: project_toss_ad_firstentry_fix
description: 토스 9개 앱 첫진입 광고 flicker 수정 — loaded 이벤트 방식 확정 (2026-07-31)
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
  modified: 2026-07-31T05:22:23.144Z
---

# 토스 9개 앱 첫진입 광고 수정 내용 (2026-07-31)

## 문제
- 앱 열면 첫 화면이 한 번 깜빡(flicker)하고 다시 뜬 후 3초 뒤 광고 표시
- 원인: `tryShow(0)`이 1500ms에 무조건 `showFullScreenAd` 호출 → 광고 소재 아직 다운 중 → SDK가 순간 렌더링 시도(flicker 발생) → `failedToShow` → 1초 후 재시도 → 성공
- 결과적으로 "실패한 impression 1회(수익 0) + 1초 추가 지연"이 발생

## SDK 타입 발견 (중요)
`@apps-in-toss/types/dist/index.d.ts` 확인:
```typescript
interface LoadFullScreenAdEvent {
    type: 'loaded';  // 오직 이 하나뿐
}
```
`loadFullScreenAd`의 `onEvent`는 `type: 'loaded'` 이벤트 **하나만** 발생시킴.
이 이벤트가 오면 광고가 100% 다운로드 완료되어 즉시 표시 가능한 상태.

## 해결책 — loaded 이벤트 방식 (9개 앱 전체 적용)

```javascript
// 첫진입 광고 — loaded 이벤트 확인 후 표시 (flicker 방지, 준비되는 즉시 표시)
useEffect(() => {
  let stopped = false;
  let showed = false;
  let adLoaded = false;
  let minTimePassed = false;
  const timers: ReturnType<typeof setTimeout>[] = [];
  function doShow() {
    if (stopped || showed) return;
    showed = true;
    try { showFullScreenAd({ options: { adGroupId: INTERSTITIAL_AD_GROUP_ID }, onEvent: (e: { type: string }) => { if (e.type === "dismissed" || e.type === "adClosed" || e.type === "adImpression") { try { loadFullScreenAd({ options: { adGroupId: INTERSTITIAL_AD_GROUP_ID }, onEvent: () => {}, onError: () => {} }); } catch {} } }, onError: () => {} }); } catch {}
  }
  function maybeShow() { if (adLoaded && minTimePassed) doShow(); }
  try { loadFullScreenAd({ options: { adGroupId: INTERSTITIAL_AD_GROUP_ID }, onEvent: (e: { type: string }) => { if (e.type === "loaded") { adLoaded = true; maybeShow(); } }, onError: () => {} }); } catch {}
  timers.push(setTimeout(() => { minTimePassed = true; maybeShow(); }, 500));
  timers.push(setTimeout(() => { if (!showed) doShow(); }, 5000));
  return () => { stopped = true; timers.forEach(t => clearTimeout(t)); };
}, []);
```

## 로직 흐름
- t=0: `loadFullScreenAd` 호출 (다운로드 시작)
- `loaded` 이벤트 발생 시: `adLoaded = true` → `maybeShow()`
- t=500ms: `minTimePassed = true` → `maybeShow()`
- `maybeShow()`: adLoaded AND minTimePassed 둘 다 true일 때 `doShow()` 호출
- t=5000ms (fallback): loaded 이벤트 안 왔어도 강제 `doShow()`

## 왜 더 빠른가
- 이전: 1500ms 고정 대기 → 실패(flicker) → 1초 추가 → 2500ms+에 성공
- 신규: 광고 다운 완료 즉시(보통 1~3s) → 깨끗하게 1회만 표시
- 실패한 impression은 수익 0 → 성공 impression만 발생이 수익에 유리

## 적용된 앱 (9개 전부)
jeomun-diet / jeomun-gamjung / jeomun-budget / jeomun-momcare / jeomun-mbti
jeomun-haemong / jeomun-fortune / jeomun-taegil / jeomun-daewoon

## 카운터 수정 (8시간 블록 방식, 같은 세션에서 완료)
```javascript
function getTodayCount() {
  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate();
  const lcg = Math.abs((dateSeed * 1664525 + 1013904223) & 0x7fffffff);
  const base = 2000 + (lcg % 200);        // 하루 시작: 항상 2000~2199
  const block = Math.floor(today.getHours() / 8);
  const delta1 = 300 + (lcg % 200);       // 8시간 후: +300~499
  const delta2 = 400 + ((lcg >> 4) % 300); // 16시간 후: +400~699
  return (base + (block >= 1 ? delta1 : 0) + (block >= 2 ? delta2 : 0)).toLocaleString();
}
```
하루 종일 증가만 함(역전 없음), 매일 아침 2000~2199로 리셋.

## ⛔ 이후 광고 코드 수정 시 주의
- `tryShow` + `isSupported` 방식 절대 사용 금지 (flicker 원인)
- `loaded` 이벤트 방식 유지
- 결과지 진입 광고(haemong/fortune/taegil/daewoon)는 별도 try/catch 방식 유지 (사용자 액션 시점)

**Why:** tryShow 방식은 광고 소재 미완성 상태에서 호출 → flicker 발생 → 사용자 이탈 우려 + 수익 0
**How to apply:** 새 토스 앱 만들 때 첫진입 광고는 항상 위의 loaded 이벤트 패턴 사용
