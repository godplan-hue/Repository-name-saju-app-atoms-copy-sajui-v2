---
name: project-mbti-web-20items-expansion-2026-08-30
description: 점운 MBTI(웹앱) 결과지 18가지→20가지 확장 완료 — 오행아우라+공감능력 카드 추가
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-29T22:17:28.614Z
---

에스더님 요청 "점운엠비티아이도 20개로 결과지늘려줘" → 웹앱(`app/mbti/`, jeomun.com)을 의미하는 것으로 판단(패턴: 이전 세션에서 "토스 손절각"/"점운손절각"처럼 "점운"을 붙이면 웹앱을 가리켜왔음, [[bug_sonjeolgak_7parts_identical_content_fixed_2026_08_30]] 참고).

**조사 결과**: 웹앱 결과지는 잠금화면에 "MBTI × 사주 전체 분석 18가지"라고 명시(18개 불릿리스트), 반면 별도 저장소인 토스 미니앱(`jeomun-mbti/src/App.tsx`)은 이미 "심층분석 20개가 한번에 열려요"라는 문구가 있었음 — 토스가 먼저 5종(아우라/친구관계온도/고백타이밍/잼민력/공감능력) 신규 심층분석을 추가해서 19섹션+traits=20 상태였음.

**수정 (2026-08-30)**: 웹앱을 18→20으로 맞추기 위해 토스의 5종 중 2개(🌌오행 아우라 분석, 🫶공감능력 분석)만 포팅. 나머지 3개(친구관계온도/고백타이밍/잼민력)는 웹앱에 이미 있는 "썸·짝사랑 훔쳐보기" 기능과 겹치거나 정확히 +2개만 필요해서 제외.

**적용 파일**:
- `app/api/mbti/analyze/route.ts` — `AURA_BY_OH`/`getAuraText`(오행 5종 텍스트), `EMPATHY_LV`/`getEmpathyLv`(E/I,S/N,T/F,J/P 조합) 함수 추가, POST 결과 객체에 `aura`/`empathyLv` 포함, GET에서 구버전 저장 데이터(필드 없음) 대비 폴백 계산 처리
- `app/mbti/result/[id]/page.tsx` — `MbtiData`에 `aura?`/`empathyLv?` 추가, 잠금화면 "18가지"→"20가지" + 불릿 2개 추가, 이중생활 카드와 썸·짝사랑 카드 사이에 새 카드 2개 렌더링

commit `bd8323f8`, 타입체크 통과, 푸시 완료. 결제창·다른 파일은 건드리지 않음.

**How to apply**: 향후 "토스 OOO에는 있는데 점운(웹) OOO에는 없다"는 기능 격차 요청이 오면, 먼저 두 코드베이스(웹 `app/xxx/` vs 토스 별도 저장소)의 현재 카운트/문구를 직접 읽어 격차를 확인한 뒤, 정확히 필요한 개수만큼만 포팅할 것 — 전체를 다 옮기면 목표 숫자를 초과하게 됨.
