---
name: project-sonjeolgak-app-launch-2026-08-27
description: "점운 손절각 신규 앱 출시 — 7파트 구조, 가격모델, 8유형 로스터, 파일위치"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-27T00:22:15.093Z
---

2026-08-27 점운 손절각(관계 손절각 테스트) 앱 신규 빌드 완료, commit `f1e811af`.

**구조**: 7파트(우정/연애/전애인/썸바람/직장/가족/여행) 중 우정만 무료, 나머지 6개는 990원 결제 1번으로 24시간 전체 잠금해제(`sonjeolgak_unlock_until`). poomang.com 손절각 테스트 클러스터 벤치마킹([[reference_poomang_quiz_catalog_2026_08_27]]).

**파일**:
- `app/sonjeolgak/page.tsx` — 랜딩+퀴즈(파트별 10문항×7=70문항)
- `app/api/sonjeolgak/analyze/route.ts` — 8가지 고양이 유형(칼단호~올인집사, 점수임계값 88/76/64/52/40/28/15/0), 매칭·순위 알고리즘 산출(수작업 매트릭스 아님)
- `app/sonjeolgak/result/[id]/page.tsx` — 결과지
- `app/sonjeolgak/pay/page.tsx` — 결제(gunghap/pay 템플릿 그대로 재사용, PortOne/Toss 채널키 동일)

**Why**: 여러 개 앱으로 쪼개면 토스 "유사카테고리 반려" 리스크 있어 하나의 앱+7파트로 통합 설계(이 앱 자체는 토스 미니앱 아니라 jeomun.com 웹페이지).

**How to apply**: 이 앱 관련 후속 작업(전화번호매칭 잠금, 파트별 개별잠금 등) 논의 시 이 문서 기준으로 판단. testmoa.com 벤치마킹은 아직 미착수(보류 중).

⛔ **주의**: 이 저장소(saju-app-atoms 복사본사주아이본)에는 토스 미니앱(jeomun-mbti 등 16개) 폴더가 없다 — 별도 저장소/폴더. 2026-08-27 세션에서 사용자가 "MBTI 폴더 삭제했냐"고 오해했었음 — 삭제 아니라 애초에 이 워크스페이스에 없던 것. 토스 미니앱 관련 요청 받으면 먼저 해당 폴더 경로를 물어볼 것.
