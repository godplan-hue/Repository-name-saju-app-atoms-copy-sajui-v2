---
name: feedback-kakaotalk-navigation-bug
description: 카카오톡 인앱브라우저에서 결과지 버튼이 페이지를 벗어나는 반복 발생 버그 — 원인·증상·수정법·주의사항
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

## ⚠️ 반복 발생 버그 — 새 세션마다 필독

### 증상
- 공유페이지(`/main-v2/share/[id]`) 또는 보관함 결과지(`/main-v2/history/[id]`)에서 버튼(사주시작, 보관함, 꿈해몽, 결제 등)을 누르면
  - 결과지 내용이 모두 사라지거나
  - 메인 또는 다른 페이지로 바로 이동하거나
  - 뒤로가기가 안 됨
- 카카오톡 인앱브라우저에서 특히 심하게 발생

### 원인
- `window.location.replace(url)` 사용 시 현재 히스토리 엔트리가 교체됨 → 뒤로가기 불가 + 결과지 재진입 시 재초기화
- 카카오톡 WebView는 `window.open("_blank")`를 일부 URL에서 현재 탭 내에서 처리해 결과지를 덮어씀

### 수정법 (확정)
```js
// ❌ 잘못된 방식
window.location.replace("/main-v2");
window.location.href = "/main-v2";

// ✅ 올바른 방식
window.open("/main-v2", "_blank");
```
- **결과지를 벗어나는 모든 버튼** → `window.open(url, "_blank")`로 통일
- 결과지 내부에서의 scroll 이동, 모달 열기 등은 기존 유지

### 적용 파일 목록
- `app/main-v2/share/[id]/ShareClient.tsx` — commit `33b78ad` (2026-07-15)
  - `window.location.replace` 전체를 `window.open("_blank")`로 replace_all 교체
  - 대상: /main-v2, /main-v2/qa-list, /main-v2/payment, /haemong, /pass, /main-v2/daewoon, /main-v2/taegil, /share-coupon
- `app/main-v2/result/page.tsx` — commit `c65b304`
  - "AI 사주 990원부터 시작" + "홈으로" 버튼 새 탭으로 변경
- `components/QAChatWidget.tsx` — commit `459e59b`
  - 복냥이 모달 구매버튼 7개 새 탭으로 변경

---

## ⚠️ 카톡공유 페이지 버튼 3개가 안 보이는 버그 (2026-07-15 확정)

### 증상
- 카톡으로 공유 링크 보내서 열면 KakaoShareClient(버튼 3개 결과지) 대신 전체 결과지가 뜸
- KakaoShareClient.tsx를 아무리 수정해도 반영이 안 됨

### 진짜 원인
`app/main-v2/share-kakao/[id]/page.tsx` 에 서버사이드 redirect 코드가 있었음:

```tsx
// ❌ 이 코드가 범인 — 실제 사용자를 전체 결과지로 강제 이동시킴
const isBot = /bot|crawl|scrap|.../i.test(ua);
if (!isBot) redirect(`/main-v2/result?sid=${id}`);
```

봇이 아닌 실제 사용자가 카톡 링크를 열면 서버가 즉시 `/main-v2/result`로 보내버림 → KakaoShareClient는 봇(미리보기 크롤러)만 볼 수 있었음.

### 수정법
`app/main-v2/share-kakao/[id]/page.tsx` 에서 redirect 관련 코드 전체 제거, `return <KakaoShareClient id={id} />` 만 남김 — commit `6baa259`

### 새 세션에서 이 버그가 또 나오면
1. **KakaoShareClient.tsx 수정 전에 반드시 `page.tsx` 먼저 확인**
2. `if (!isBot) redirect(...)` 같은 코드가 있으면 제거
3. `return <KakaoShareClient id={id} />` 한 줄만 남기면 됨

---

### 새 세션에서 window.location 버그가 또 나오면
1. 해당 파일에서 `window.location.replace` 또는 `window.location.href`로 페이지를 이동하는 코드 찾기
2. 전부 `window.open(url, "_blank")`로 교체
3. 빌드 → 커밋 → 푸시

**Why:** 카카오톡 인앱브라우저의 히스토리 관리 방식이 일반 브라우저와 달라서 replace 사용 시 결과지를 잃게 됨. 이 패턴은 앞으로 신규 페이지 개발 시에도 동일하게 적용할 것.

**How to apply:** 결과지(결과 표시 페이지)의 CTA 버튼, 공유 버튼, 홈/보관함 이동 버튼에는 항상 window.open 사용. 결제 흐름(window.location.href로 Toss로 리다이렉트)은 예외.
