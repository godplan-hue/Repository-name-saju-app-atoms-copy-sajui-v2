---
name: project-sonjeolgak-app-launch-2026-08-27
description: "점운 손절각 신규 앱 출시 — 7파트 전부 무료 퀴즈, MBTI방식 심층분석 10가지 990원 잠금, 8유형 로스터, 파일위치"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-27T00:49:39.839Z
---

2026-08-27 점운 손절각(관계 손절각 테스트) 앱 신규 빌드, commit `f1e811af`. 같은 날 결과지 구조를 MBTI 방식으로 전면 재설계, commit `2e56c45f`.

**최종 구조 (2e56c45f 이후, 이전 구조 아님)**:
- 7파트(우정/연애/전애인/썸바람/직장/가족/여행) **전부 무료로 퀴즈 가능** (파트 선택 단계 잠금 없음)
- 결과지: 무료로 유형/점수/설명/조언/궁합요약까지는 보여주고, **심층 분석 10가지**를 990원 결제로 잠금
  1. 과거 패턴 분석 2. 위험 신호 3가지 3. 회복 팁 4. 앞으로의 관계운 5. 액션플랜 3단계
  6. 숨겨진 어두운 면 7. 이별·손절 스타일 8. 나와 닮은 유명인 9. 궁합 좋은 이유 상세 10. 부딪히는 유형 TOP3
- 잠금해제: `sonjeolgak_unlock_until`(24h) + `sonjeolgak_unlock_phone` 전화번호매칭(MBTI와 동일 패턴, 다른 사람 공유결과에 내 잠금이 잘못 적용되는 것 방지) + 1초 간격 실시간 카운트다운 배너
- poomang.com 손절각 테스트 클러스터 벤치마킹([[reference_poomang_quiz_catalog_2026_08_27]])

**왜 재설계했는지**: 사용자가 "잠금이 4개밖에 없어서 판매 불가능, 무료 3-4개+유료 10개 이상 필요"라고 지적, 이어서 "MBTI 앱 구조(글/배너/숫자 전부) 그대로 sonjeolgak에 적용하라"고 명시적으로 반복 지시함. 최초엔 파트 자체를 잠그는 구조였으나, 파트는 전부 무료로 풀고 대신 유형별 심층 콘텐츠 10종을 유료 잠금으로 전환.

**파일**:
- `app/sonjeolgak/page.tsx` — 랜딩+퀴즈(파트별 10문항×7=70문항, 전부 무료)
- `app/api/sonjeolgak/analyze/route.ts` — 8가지 고양이 유형(칼단호~올인집사) + 유형별 심층콘텐츠 10종 + `MATCH_REASON`/`CLASH_REASON` 룩업으로 궁합상세·최악TOP3 동적 산출
- `app/sonjeolgak/result/[id]/page.tsx` — 결과지 (MBTI 스타일 카드+잠금박스+카운트다운)
- `app/sonjeolgak/pay/page.tsx` — 결제("심층 분석 10가지" 문구로 전면 수정, gunghap/pay 템플릿 기반)

**2026-08-27 추가 수정 — MBTI 수준으로 콘텐츠·구조 보강, commit `133a96a9`**:
사용자가 "공유버튼 MBTI처럼 수정했는지/celebTwin·bestMatchDetail·worstMatchTop3가 MBTI와 제목·레이아웃도 비슷한지/항목마다 최소 5-6줄인지" 검증 질문 → 직접 코드 대조 결과 4가지 불일치 확인, 이어서 "엠비티아이정도답변나와야하는데"라는 명시 지시로 즉시 수정.
- **콘텐츠 길이**: 8유형 전부 pastPattern/recoveryTip/futureForecast/darkSide/breakupStyle을 기존 1문장 → 2-3문장으로 확장. MATCH_REASON/CLASH_REASON도 각 1문장 추가.
- **celebTwin 구조 변경**: 기존엔 평범한 문자열 하나였음 → MBTI처럼 `{name, reason}` 객체로 변경, 결과지에 유명인 이름을 굵은 헤드라인으로 먼저 보여주고 그 아래 설명 문단 배치.
- **worstMatchTop3 레이아웃 변경**: 기존엔 인라인 한 줄 나열이었음 → MBTI처럼 항목마다 박스형 서브카드 + "1위/2위/3위 · 이모지 유형명" 순위 배지로 재구성. 목록 위에 `worstMatchIntro` 안내문 신규 추가.
- **공유 버튼 교체**: 기존 노란 카톡버튼(`#FEE500`, "💬 친구한테 공유하기", `kakaotalk://` 딥링크 방식) → MBTI와 동일하게 보라 그라디언트(`#a78bfa→#7c3aed`) + "📤 친구에게 공유하기" + Kakao Share SDK(`objectType:"feed"`) 우선 시도 + 클립보드 폴백 + "✅ 복사됐어요!" 상태로 전면 교체.
- **전화번호 잠금 로직 강화**: 기존엔 `savedPhone`이나 `resultPhone` 둘 중 하나라도 비어있으면 통과되는 느슨한 조건이었음 → MBTI처럼 둘 다 존재하고 정확히 일치해야만 잠금 해제되도록 강화(`!!savedPhone && !!resultPhone && savedPhone === resultPhone`).
- **bestMatchDetail 관련 — 의도적으로 유지, 미해결 아님**: MBTI엔 이 카드의 직접적인 대응물이 없음(MBTI 궁합 요약은 전부 무료 한줄). sonjeolgak만의 유료 추가 카드로 그대로 유지하기로 함 — 삭제/축소하지 않음.

**How to apply**: 이 앱 관련 후속 작업(가격 변경, 콘텐츠 추가, 잠금 방식 변경 등) 논의 시 이 문서 기준으로 판단. testmoa.com 벤치마킹은 아직 미착수(보류 중).

⛔ **주의**: 이 저장소(saju-app-atoms 복사본사주아이본)에는 토스 미니앱(jeomun-mbti 등 16개) 폴더가 없다 — 별도 저장소/폴더. sonjeolgak과 mbti는 둘 다 이 저장소 안의 jeomun.com 웹페이지(`app/mbti/`, `app/sonjeolgak/`)이며, 토스 미니앱과는 무관하다.
