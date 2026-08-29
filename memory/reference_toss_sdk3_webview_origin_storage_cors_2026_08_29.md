---
name: reference-toss-sdk3-webview-origin-storage-cors-2026-08-29
description: 앱인토스 SDK 3.1.1+ WebView Origin 변경 공지 — Storage 병합/CORS 조치 필요 대상 앱 전수 확인 결과
metadata: 
  node_type: memory
  type: reference
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-29T02:02:45.332Z
---

## 공지 내용 (2026-08-29 수신)
SDK 3.1.1 이상으로 빌드한 WebView 미니앱은 SDK 2.x와 다른 Origin(`https://{appName}.apps.tossmini.com`, `https://{appName}.private-apps.tossmini.com`)으로 서비스됨.
조치 필요 대상: SDK3.x로 마이그레이션/신규 시작했고 (1) localStorage/IndexedDB/OPFS 사용 또는 (2) 외부 서버와 통신하는 앱.
SDK2.x 유지 앱은 조치 불필요.

## 확인 결과 (2026-08-29, jeomun 전체 SDK3.x 앱 대상)

| 앱 | SDK3.x 여부 | localStorage 사용 | 조치 상태 |
|---|---|---|---|
| gwangyeoradar | ✅ | 있음 | ✅ `_mig_v3_done` 마이그레이션 코드 이미 있음 (Migration.getOriginStorage로 이전 Origin값 병합) |
| tarot | ✅ | 있음 | ✅ 동일 마이그레이션 코드 있음 |
| gunghap | ✅ | 있음 | ✅ 동일 |
| mbti | ✅ | 있음 | ✅ 동일 |
| gamjung | ✅ | 있음 | ✅ 동일 |
| sonjeolgak | ✅ | 있음 | ✅ 동일 |
| battle | ✅ (3.1.1) | **없음** (App.tsx에 localStorage 호출 자체 없음) | 조치 불필요 — 병합할 데이터 자체가 없음 |
| movie | ✅ (3.1.1) | **없음** | 조치 불필요 — 동일 |

**CORS**: jeomun.com API 라우트(`/api/*/lead` 등 27개)는 전부 `Access-Control-Allow-Origin: "*"` 와일드카드라 새 Origin 추가 불필요.
battle·movie는 jeomun.com API가 아니라 Firebase RTDB REST(`saju-app-atoms-default-rtdb.firebaseio.com`)를 직접 fetch — Firebase REST는 기본적으로 모든 Origin 허용이라 이것도 조치 불필요.

## 결론
8개 SDK3.x 전환 앱 전부 이미 대응 완료 상태 (에스더님이 이전 세션에 이미 작업해둠, 08-29에 재확인만 함). 추가 코드 수정 불필요.

관련: [[reference_toss_sdk3_origin_cors_notice_2026_08_26]] (이전 공지, 그땐 전부 SDK2.x였음), [[project_sdk3_migration_status_2026_08_27]] (SDK3.x 전환 현황표)
