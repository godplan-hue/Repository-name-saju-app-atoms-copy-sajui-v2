---
name: bug-budget-cloudflare-empty-useragent-block
description: 가계부(jeomun-budget) DB 저장 안되던 버그 진짜 원인 — Cloudflare가 User-Agent 없는 요청 차단
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-23T07:13:51.483Z
---

가계부 토스 미니앱에서 "DB에 저장 안됨" 버그의 진짜 원인은 코드 로직이 아니라 Cloudflare였다.

**증상**: jeomun-budget이 `https://www.jeomun.com/api/budget`로 POST해서 Firebase에 저장하는데, 실제로는 저장이 안 됨.

**원인 (curl로 실증 확인, 2026-08-23)**:
- `www.jeomun.com`은 Cloudflare "AI 크롤러 차단" 규칙이 걸려있는데, 이 규칙이 **User-Agent 헤더가 비어있거나 없는 요청을 전부 403 차단**함 (홈페이지 GET조차 UA 없으면 403).
- 브라우저처럼 보이는지 여부는 무관 — `okhttp/4.9.2`, Android WebView UA 등 아무 UA나 있으면 200 통과. UA가 완전히 비어있을 때만 403.
- React Native(토스 미니앱은 RN 기반, `.ait` = RN 0.84.0/0.72.6 빌드)의 fetch()가 상황에 따라 User-Agent 헤더를 자동으로 안 붙이는 경우가 있어서, 앱의 저장 요청이 Cloudflare에 막혀 서버(Next.js API route)에 아예 도달하지 못했음. `route.ts`(app/api/budget/route.ts) 코드 자체는 처음부터 정상이었음.
- `saveToServer`의 재시도 로직은 `res.ok`만 보고 실패 처리 → 403이 계속 재시도돼도 결국 실패로 끝나서 로컬에도 서버에도 반영 안 되는 것처럼 보임.

**수정**: `jeomun-budget/src/App.tsx`의 `saveToServer`/`fetchFromServer` fetch 호출에 `User-Agent: "JeomunBudgetApp/1.0 (AppsInToss)"` 헤더 명시적으로 추가. commit `227cbf4`. 재검증: curl로 실제 저장+조회 200 확인.

**Why**: 근본 원인이 앱 코드가 아니라 인프라(Cloudflare WAF)였다는 게 핵심 — 앱 로직만 계속 고쳐봤자 절대 해결 안 됐을 문제였음.

**추가 수정 완료 (2026-08-23, 사용자 명시 요청)**: 에스더님이 "육아랑 감정더수정해줘다시올릴수박에없네결국"이라고 명시적으로 요청 → jeomun-gamjung(commit `2592dbe`), jeomun-momcare(commit `7487e5b`)에도 동일한 User-Agent 헤더 fix 적용 완료. curl로 둘 다 200 확인.

**코인/24시간권/저장데이터가 한꺼번에 초기화되는 것처럼 보이는 문제 — 근본원인 하드닝 (2026-08-23)**:
- 에스더님이 "저장된거 다시들어오면 다사라지는" 증상(코인·24h이용권·항목저장 전부)을 추가로 제보하며 "원인분석해서 수정해줘"라고 요구.
- 코인/24h권은 서버 저장이 아니라 100% 로컬(Toss `Storage`/`localStorage`)이라 Cloudflare 문제와는 무관. 원래 `tossSet`이 Storage 또는 localStorage 둘 중 하나에만 쓰고, 예외가 던져질 때만 폴백 → **Storage가 조용히(예외 없이) 실패하면 백업이 아예 없어서** 재접속 시 전부 사라진 것처럼 보이는 게 유력한 원인으로 추정됨(재현 확인은 못함, 코드 검토 기반 추정).
- **수정**: `tossSet`을 Storage+localStorage 양쪽에 무조건 동시 저장하도록 변경, `tossGet`은 Storage 우선 읽되 결과가 null/undefined면 (예외 여부 상관없이) localStorage로 폴백하도록 변경. budget(commit `f30d098`)·gamjung(commit `2592dbe`)·momcare(commit `7487e5b`) 3개 앱 전부 적용, 빌드 완료.
- **기존 가입자 데이터 영향 없음** — 이 수정은 저장 방식을 이중화한 것뿐, 데이터 포맷이나 Firebase 경로는 전혀 안 건드림. 기존 유저 데이터는 그대로 유지됨.
- **남은 작업**: 토스 개발자 콘솔에 새 `.ait` 재업로드는 에스더님이 직접 해야 함(Claude가 업로드 불가). deploymentId — budget: `01a02d73-db25-7e89-a80d-7e887f4ab465`, gamjung: `01a02d74-1b4a-79df-a288-25c62dc42e4f`, momcare: `01a02d77-55e7-7202-b299-205de79c79bd`.
