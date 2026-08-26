---
name: reference-toss-sdk3-origin-cors-notice-2026-08-26
description: 앱인토스 SDK 3.1.1+ Origin변경 공지 확인결과 — 21개앱 전부 SDK 2.x라 조치불필요, 향후 3.x업그레이드시 재확인할 것
metadata:
  type: reference
---

## 공지 내용 (2026-08-25 앱인토스 발송)
SDK 3.1.1 이상으로 빌드/업로드한 WebView 미니앱은 Origin이 `https://{appName}.apps.tossmini.com`, `https://{appName}.private-apps.tossmini.com`으로 바뀜 → localStorage/IndexedDB/OPFS 데이터 마이그레이션 + 외부서버 CORS 허용Origin 추가 필요할 수 있음. **SDK 2.x 계속 사용중인 앱은 조치 불필요.**

## 확인 결과 (2026-08-26) — 조치 불필요
- 점운 토스 미니앱 21개(`C:\Users\moon6\OneDrive\바탕 화면\jeomun-*`) 전부 `@apps-in-toss/web-framework` + `@apps-in-toss/cli`(ait 빌드툴) 둘 다 **2.10.7~2.10.8 (SDK 2.x)** — 3.x 마이그레이션한 적 없음.
- 추가 안전장치 확인: jeomun.com 서버 API 25개(`app/api/**/lead`, `save`, `analyze` 등) 전부 `Access-Control-Allow-Origin: "*"` 와일드카드 사용 중 — 나중에 3.x로 올려 Origin이 바뀌어도 서버측 CORS는 자동으로 다 허용됨. 화이트리스트 방식이 아니라서 이 공지의 CORS 조치 자체가 원천적으로 필요없는 구조.

## 다음 SDK 업그레이드 시 재확인할 것
- `@apps-in-toss/web-framework` 또는 `ait` CLI를 3.x로 올리는 순간 이 공지가 적용됨.
- 특히 로컬저장(tossSet/tossGet) 쓰는 일기형 앱 4개(감정일기 gamjung/가계부 budget/다이어트 diet/맘케어 momcare)는 Origin 바뀌면 기존 로컬데이터 병합 필요할 수 있음 — 업그레이드 전에 커뮤니티 공지(techchat-apps-in-toss.toss.im/t/webview-storage-cors/4673) 다시 확인.
- CORS는 와일드카드라 서버쪽은 걱정 없음 — Storage 마이그레이션 API 사용법만 확인하면 됨.
