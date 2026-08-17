---
name: project-mainv2-bg-cream-change-2026-08-17
description: "메인페이지(main-v2) 뒷배경 다이아몬드 이미지 → 크림색 변경, 원본 백업"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-17T10:03:43.832Z
---

## 2026-08-17 변경

**파일**: `app/main-v2/page.tsx` (802번째 줄, `<main>` 태그)
**커밋**: `d389115`

에스더님이 다이아몬드/케익 반짝이 배경화면이 너무 화려해서 사주글·가격에 집중이 안 된다고 하셔서
메인페이지 뒷배경(`<main>` 전체 backdrop)만 크림색 단색으로 교체함.

### 원본 (되돌릴 때 이 값 그대로 복원)
```jsx
<main style={{ minHeight: "100vh", background: BG, backgroundImage: `url('https://i.pinimg.com/736x/81/09/ff/8109fff1db1ee44dbdeab87d9cfe276b.jpg')`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", overflowX: "hidden" }}>
```
- `BG` 상수 = `"linear-gradient(160deg, #fdf2f8 0%, #ede9fe 100%)"` (10번째 줄, 그대로 유지됨 — 다른 곳에서도 씀)
- 다이아몬드 이미지 URL: `https://i.pinimg.com/736x/81/09/ff/8109fff1db1ee44dbdeab87d9cfe276b.jpg`

### 변경 후
```jsx
<main style={{ minHeight: "100vh", background: "#fdf6ec", fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif", overflowX: "hidden" }}>
```
- 크림색 단색: `#fdf6ec`

### ⚠️ 건드리지 않은 것
- 571번째 줄에도 같은 다이아몬드 이미지가 있지만, 이건 "점냥이가 읽는 나의 운명" 히어로 배너 카드 전용 이미지라서 뒷배경과 별개 — 요청 범위 아니라서 그대로 둠
- `BG` 그라디언트 상수 자체는 다른 페이지(result 등)에서도 쓰이므로 삭제하지 않음

### 되돌리는 법
다음에 이상하면 위 "원본" 코드로 802번째 줄만 다시 바꾸면 됨 (또는 `git revert d389115`)
