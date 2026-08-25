---
name: project-session-2026-08-25c
description: "타로+궁합 990원결제 전면제거(광고무료전환) 완료, DB저장 재신고 원인 재조사 결과 Cloudflare 아님(원인 미확정)"
metadata:
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-25T00:18:29.099Z
---

## 1. jeomun-tarot·jeomun-gunghap 990원 결제 완전 제거 → 전체 무료 전환 (commit `1cb99de`, `33802b6`)

[[project_session_2026_08_25b]] 4번 항목의 "24시간 전화번호락 mbti만 있고 tarot/gunghap엔 없음" 문제를 해결하는 방법으로, 사용자가 mbti식 전화번호 스코프 잠금(큰 작업)을 만드는 대신 **더 간단한 방법**을 선택함: "990원결재창 잠그고 버튼만 없애면 간단하게 수정된다".

- **jeomun-tarot**: 원래 섹션당 결제버튼이 없고 전체를 한번에 여는 글로벌 "💳 990원으로 전체 한번에 보기" 버튼 1개(`handleAllPay`, `!tarotPaid` 조건)만 있었음. 이 버튼 블록만 제거. 각 섹션(0~4)은 원래도 광고시청 버튼(`🔓 지금 열어보기 →`) 하나씩만 있었으므로 그대로 유지 — 사실상 이제 tarot 전체가 광고 무료 열기로만 작동.
- **jeomun-gunghap**: 5개 섹션(score/relation/1/2/3) 전부 광고버튼+990원버튼 2개가 나란히 있던 flex 구조 → 광고버튼 1개(`width:"100%"`)만 남기고 990원버튼+캡션("무료 열기: 이번 세션만 · 결제: 24시간 유지") 삭제.
- **원칙 준수**: `payToUnlockSection`, `payToUnlock`, `handleAllPay`, IAP 호출부는 전부 코드에 그대로 남겨둠(삭제 안 함) — "삭제보다 추가를 우선한다" 원칙. 단순히 UI에서 참조만 제거된 죽은 코드 상태.
- 두 앱 모두 `npm run build` 성공 확인. `gunghap-jeomun.ait`(deploymentId `01a03646-eebb-761f-bd49-8b0757a7d1ed`), `tarot-jeomun.ait`(deploymentId `01a03647-43bb-79de-b06d-1898ea91901e`) — **콘솔 재업로드 필요(사용자)**.

**Why**: 전화번호 스코프 영구잠금(mbti 패턴)을 두 앱에 이식하는 건 규모가 큰 작업 — 아예 유료 단계를 없애 문제 자체를 제거하는 게 더 간단하다고 사용자가 판단.
**How to apply**: 앞으로 tarot/gunghap 관련 "결제", "990원", "잠금해제 24시간" 요청이 오면 이제 두 앱 다 완전 무료(광고시청만)라는 전제로 답할 것. [[project_session_2026_08_25b]] 4번 항목(전화번호락 gap)은 이 변경으로 **해소됨** — 유료 상태 자체가 없으니 전화번호별로 추적할 대상이 없음.

## 2. ⚠️ DB저장 재신고 — Cloudflare 원인 아님 확인, 근본원인 여전히 미확정 (미해결)

사용자가 재확인 결과 "두앱다 테스트하면서 전번저장했다고 근데 저장안된다고" — [[project_session_2026_08_25b]] 3번의 "콘솔 미재업로드 가설"이 사용자의 실제 재테스트로 깨짐(재업로드 후에도 안 됨).

재조사(이번 세션):
- `bug_budget_cloudflare_empty_useragent_block_2026_08_23.md`의 7개 앱 Cloudflare/CORS 3단계 버그 패턴을 gunghap/saju에 대입 검토
- `jeomun-gunghap/src/App.tsx` 354번째줄 grep 확인 — 이미 `https://www.jeomun.com/api/gunghap/lead` (apex 아닌 www 직접 호출) → apex→www 리다이렉트로 preflight 깨지는 버그 패턴 아님
- curl 라이브 테스트: `gunghap/lead` POST(빈 UA) 200, `toss-saju/lead` POST(빈 UA) 400(바디 검증 실패, 차단 아님), 둘 다 OPTIONS 204 — **Cloudflare가 이 두 엔드포인트를 막고 있다는 증거 없음**

**결론**: Cloudflare 가설은 이번에도 근거 부족으로 배제. 하지만 curl 테스트는 실제 토스 RN 웹뷰의 진짜 CORS preflight 조건을 완벽히 재현 못하는 한계가 있어 100% 확정은 아님.
**진짜 원인은 아직 못 찾음** — 다음 후보: (1) 실제 기기에서 발생하는 fetch 요청의 서버측 로그/응답바디 직접 확인 필요, (2) `db.ref(path).set(data)` 관련 Firebase 조용한 실패 가능성, (3) `app/api/toss-saju/lead/route.ts`의 `ALLOWED_PREFIXES`가 gunghap이 실제 보내는 경로와 일치하는지 재확인, (4) 클라이언트가 fetch 완료를 기다리지 않고 다른 코드경로가 먼저 "저장됨" 문구를 띄우는 타이밍 버그 가능성.

**Why**: 이전 두 번의 "문제없음"/"재업로드하면 될 것" 결론이 전부 사용자의 실기기 테스트로 깨졌음 — curl 성공은 실제 앱 동작의 증거가 되지 못한다는 것이 세 번째로 확인됨.
**How to apply**: 다음 세션에서 이 이슈를 다룰 때 **"코드 확인했으니 문제없다"는 식의 결론을 절대 다시 내지 말 것**. 실제 기기 테스트 결과 또는 서버 로그 확인 전까지는 "원인 불명, 조사 중"으로만 보고할 것. [[feedback_check_code_not_docs]], [[feedback_no_speculative_defensive_code]] 참고.

## 3. 다음 세션 우선순위

1. DB저장 미해결 건 — 서버 로그 확인 방법 모색 (Vercel 로그 등) 또는 사용자에게 재현 절차 상세히 물어보기
2. tarot/gunghap 콘솔 재업로드 여부 확인
3. [[project_session_2026_08_25]] 6번 항목(gunghap·saju IAP 깨진 패턴)은 이번 무료전환으로 gunghap은 사실상 무의미해짐(결제버튼 자체가 없어짐) — saju는 여전히 유효한 미해결 항목으로 남음
