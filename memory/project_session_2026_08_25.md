---
name: project-session-2026-08-25
description: "displayName 원복(battle/work/movie/style/tarot 5개), 사주·궁합 DB저장 확인완료, 타로 3버그 수정, 추구미 6개전부잠금 전환"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-24T23:11:06.461Z
---

## 1. 토스 앱 displayName 오분류 수정 (콘솔 스크린샷 대조 확정)

이전 세션에서 "무료 제거" 패턴을 추측으로 5개앱에 적용했다가, 콘솔 스크린샷 확인 결과 아래처럼 뒤섞여 있었음. **반드시 스크린샷/사용자 확인 없이 추측으로 이런 값 바꾸지 말 것** — [[feedback_no_speculative_defensive_code]] 참고.

확정된 콘솔 등록 displayName (2026-08-25 스크린샷 대조 완료):
- jeomun-battle: "이상형월드컵 점운" (무료 없음) — commit 332630b
- jeomun-work: "직장버티기 점운" (무료 없음, 띄어쓰기도 붙임) — commit cdcd40c
- jeomun-movie: "인생이영화라면 점운" (무료 없음) — commit a803521
- jeomun-style(chugumi): "추구미 점운 무료" (무료 있음) — commit ad928a7
- jeomun-tarot: "타로 점운 무료" (무료 있음) — commit e6e5c76
- jeomun-gunghap: "궁합 점운 무료" (무료 있음, 수정 안함 — 원래 맞았음)
- jeomun-saju: "사주 점운 무료" (무료 있음, 수정 안함 — 원래 맞았음)

**Why**: 크로스프로모 배열 텍스트는 실제 등록명과 다를 수 있어 신뢰 불가 — tarot/style 둘 다 크로스프로모 텍스트 추측으로 잘못 고쳤다가 스크린샷으로 들통남.
**How to apply**: 새로 displayName 바꿔야 할 일 생기면 반드시 콘솔 스크린샷 먼저 요청. 5개 앱 모두 재빌드 후 .ait 콘솔 재업로드 완료 확인 필요(사용자가 업로드).

## 2. 사주(jeomun-saju)·궁합(jeomun-gunghap) DB저장 — 문제없음 확인

어제(2026-08-23) 있었던 7개앱(budget/gamjung/momcare/diet/mbti/petun/zodiac) Cloudflare apex도메인 CORS리다이렉트 버그와 무관. saju/gunghap 둘 다 애초부터 `www.jeomun.com` 직접 호출이라 영향 없었음. curl POST + OPTIONS preflight 라이브 테스트 둘 다 200/204 확인 완료. 코드수정 없음.

## 3. jeomun-tarot 버그 3종 수정 (src/App.tsx, commit e6e5c76)

- 결과화면에 16개 크로스프로모 그리드가 인라인 렌더 + `<CrossPromoMini/>` 컴포넌트 이중렌더 → 후자 삭제
- 크로스프로모 카드명 줄바꿈 깨짐("이상형월드컵 점" / "운" 등) → `whiteSpace:"pre-line", wordBreak:"keep-all"` 누락이 원인, 추가함
- 배너광고가 result 화면에서 안 뜸 → 배너 attach useEffect가 `[]` 의존성이라 최초 mount(main화면)에만 붙고 step 전환시 재실행 안됨 → `[step]`으로 수정. **다른 멀티스텝 앱에도 같은 버그 있을 수 있음 — 배너 안뜬다는 신고 오면 이 패턴부터 의심할 것**

## 4. jeomun-style(추구미) 전체 잠금 전환 (commit ad928a7)

기존: "나의 추구미 분석" + "추천 스타일 키워드" 2개 카드는 무료로 항상노출 (movie/battle/work도 동일 패턴이었음), 나머지 4개(퍼스널컬러/뷰티팁/아이템추천/닮은아이콘)만 광고잠금.
사용자 요청: "다 잠궈 한나라도 더 잠궈서 돈을 벌자" → 이 2개도 광고잠금으로 전환, 총 6개 전부 잠금.
**Why**: 수익화 우선 — 무료 미리보기보다 잠금 개수를 늘려 광고 시청 유도.
**How to apply**: 다른 앱(movie/battle/work)은 현재 승인요청 중이라 이번엔 건드리지 않음. **나중에 반려되면 그때 movie/battle/work도 동일하게 2개 카드 추가잠금 필요** — 승인 통과하면 그대로 두고, 반려되면 style과 동일 패턴 적용할 것.
