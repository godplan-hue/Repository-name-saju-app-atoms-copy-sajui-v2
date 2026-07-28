---
name: bug-share-page-loop
description: ⚠️ 카톡결과지 루프 버그 원인과 해결법 — 새 세션에서 이 버그 다시 나오면 즉시 이걸로 수정
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

# ⚠️ 카톡결과지(share 페이지) 뒤로가기 루프 버그

## 증상
- 모바일(카톡/네이버 인앱브라우저)에서 버튼 누르면 `/main-v2/share/[id]` 페이지로 계속 돌아옴
- "유료결과지에서 버튼 누르면 카톡결과지로 돌아간다"
- 유저가 "카톡결과지" 라고 부르는 페이지 = `app/main-v2/share/[id]/ShareClient.tsx`

## 원인
- `/main-v2/share/[id]` 페이지 내 모든 버튼이 `window.location.href = "/주소"` 사용
- 특히 비오너 "나도 무료 사주 받아보기" 버튼이 `window.open("/main-v2", "_blank")` 사용
- **모바일 인앱브라우저에서 `window.open("_blank")`는 새 탭이 아니라 같은 탭에서 열림**
- share 페이지가 브라우저 히스토리에 남아서 뒤로가기 시 share 페이지로 돌아옴

## 해결법
`app/main-v2/share/[id]/ShareClient.tsx` 에서:
1. 모든 `window.location.href = "/경로"` → `window.location.replace("/경로")`
2. 비오너 버튼 `window.open(url, "_blank")` → `window.location.replace(url)`

`window.location.replace()`는 현재 히스토리 항목을 대체하므로 share 페이지가 스택에서 제거됨.

## 해결 커밋
- `fb3b9a4` — share 페이지 모든 href → replace() 전환 (2026-07-15)

## 관련 파일
- `app/main-v2/share/[id]/ShareClient.tsx` — 주 수정 파일
- `app/main-v2/share-kakao/[id]/page.tsx` — 서버사이드 봇 리다이렉트 (이미 수정됨)
- `app/main-v2/share-kakao/[id]/KakaoShareClient.tsx` — KakaoShare 페이지

## 추가 수정 (같이 진행)
- `isOwner` 상태가 sessionStorage 기반 → localStorage 기반으로 변경 (커밋 `7b07ecd`)
- 결제 직후 `share_just_paid=1` sessionStorage → `share_owner_{id}=1` localStorage 저장
- 새로고침해도 "꼭 읽어보세요" 버튼 유지됨

## 페이지 구조 설명
- `/main-v2/share/[id]` = 결제 후 보여지는 "유료결과지" (스페셜 구매 플로우)
- `/main-v2/share-kakao/[id]` = 카카오 공유 메타데이터용 페이지
- `/main-v2/result` = 일반 990원 결제 결과지

**Why:** 에스더님이 이 버그로 수 시간을 낭비함. 다음 세션에서 즉시 찾을 수 있도록 저장.
**How to apply:** "카톡결과지" 뜨는 버그 나오면 이 파일 먼저 확인 후 ShareClient.tsx 수정.
