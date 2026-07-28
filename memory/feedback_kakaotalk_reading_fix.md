---
name: feedback-kakaotalk-reading-fix
description: 카카오톡 결과지 읽기·보관함·공유 버그 패턴 및 올바른 수정법 — 반드시 읽고 수정할 것
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

## ⚠️ 이 버그는 반복 발생한다 — 수정 전 반드시 읽을 것

### 증상
- 카톡에서 공유 링크 클릭 → 보관함 목록으로 튕김 (결과지 안 보임)
- 보관함에서 "다른 브라우저로 열기" → 결과지 대신 보관함 목록으로 이동
- 읽기 버튼 누를 때마다 모달/팁 화면이 뜸 (매번)
- 버튼 클릭 후 페이지 맨 위로 스크롤 이동

---

### 올바른 수정법 (2026-07-22 확정)

#### ① share-xxx 아이템 보관함 튕김
**파일**: `app/main-v2/history/[id]/page.tsx`
**수정**: useEffect 맨 앞에 추가
```js
if (decodedId.startsWith("share-")) {
  const shareId = decodedId.replace(/^share-/, "");
  window.location.replace(`/main-v2/share/${shareId}`);
  return;
}
```
**이유**: share-xxx 아이템은 history 페이지에 내용이 없고 ShareClient에서 Firebase로 직접 읽음

#### ② 보관함 로딩 빈 화면 플래시
**파일**: `app/main-v2/history/[id]/page.tsx`
**수정**: `useState<any>(null)` → lazy initializer로 localStorage 동기 읽기
```js
const [item, setItem] = useState<any>(() => {
  if (typeof window === "undefined") return null;
  try {
    const pathParts = window.location.pathname.split("/");
    const id = decodeURIComponent(pathParts[pathParts.length - 1] || "");
    if (!id) return null;
    const hist: any[] = JSON.parse(localStorage.getItem("v2_history") || "[]");
    return hist.find(h => String(h.id) === id) || null;
  } catch { return null; }
});
```
**이유**: useEffect보다 먼저 실행되어 첫 렌더부터 데이터 있음 → 빈 화면 없음

#### ③ 읽기 버튼 누를 때마다 팁 모달 뜨는 문제
**파일**: `app/main-v2/history/[id]/page.tsx` (toggleReadAloud 함수 내 비Chrome 모바일 체크)
**수정**: localStorage 날짜 키로 하루 1번만 뜨게
```js
const mobTipKey = "v2_hist_mob_browser_tip_date";
if (localStorage.getItem(mobTipKey) !== new Date().toDateString()) {
  localStorage.setItem(mobTipKey, new Date().toDateString());
  setTipModal({ text: "..." });
  return;
}
```

#### ④ 이미지 저장 시 스크롤 맨 위로 이동
**파일**: `ShareClient.tsx`, `history/[id]/page.tsx` (saveImage 함수)
**수정**: html2canvas 호출 전후로 스크롤 위치 저장/복구
```js
const scrollY = window.scrollY || window.pageYOffset;
const canvas = await html2canvas(el, { ... });
window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
```

#### ⑤ 4900원/2900원 다른 브라우저에서 이미지 저장 버튼 사라짐
**파일**: `ShareClient.tsx`
**원인**: `isOwner` 조건으로 버튼 숨겨짐 — 다른 브라우저에서는 sessionStorage/localStorage 없어서 isOwner=false
**수정**: 이미지 저장(🖼️) 버튼은 헤더에 항상 표시 (isOwner 조건 밖)

#### ⑥ 카카오 공유 결과지 꼭읽어보세요 버튼
**파일**: `KakaoShareClient.tsx`, `ShareClient.tsx`
**수정**: 해당 버튼 삭제 — 카톡 공유 결과지에는 읽기/처음부터읽기 버튼 2개만
**이유**: 에스더님이 이 버튼 카톡 공유시 불필요하다고 명시적 삭제 요청

---

### 절대 하지 말 것 (이전 잘못된 수정 패턴)

- `window.history.replaceState()` 로 카카오에서 URL 변경 시도 → 효과 없음
- `isOwner` 조건 안에 이미지 저장 버튼 넣기 → 다른 브라우저에서 사라짐
- 팁 모달에 한 번만 뜨는 조건 없이 추가 → 매번 클릭마다 모달 뜸

**Why**: 2026-07-21~22 이틀 동안 같은 증상이 반복 발생, 에스더님이 하루 종일 골치아프다고 명시함
**How to apply**: 카카오/보관함/읽기 관련 수정 전 이 파일 반드시 먼저 읽을 것
