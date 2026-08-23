---
name: bug-budget-cloudflare-empty-useragent-block
description: 가계부·감정일기·육아·다이어트·MBTI·펫운·별자리 7개앱 DB저장 안되던 진짜 원인 — Cloudflare 커스텀룰 skip설정 누락
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-23T00:00:00.000Z
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

---

## ⭐⭐⭐ 진짜 근본원인 정정 (2026-08-23 같은날 재조사) — User-Agent 헤더 fix는 진짜원인이 아니었음

위의 "User-Agent 헤더 추가" 수정을 다 하고 재빌드까지 했는데도 momcare가 **여전히 실저장 안 됨**을 에스더님이 재보고. Cloudflare 대시보드를 화면공유로 같이 열어서 재조사한 결과, **진짜 원인은 따로 있었다.**

**진짜 원인**: "Allow Toss Mini App" 이라는 커스텀 WAF 규칙이 이미 있었는데, 이 규칙의 액션이 "건너뛰기(Skip)"였음에도 **"건너뛸 WAF 구성요소" 체크리스트에서 "나머지 모든 사용자 지정 규칙"이 체크가 안 되어 있었음** — "모든 Super Bot Fight 모드 규칙"만 체크되어 있었음.
- 즉 이 규칙이 토스 트래픽을 매칭해도, "Block empty user-agent"(빈 UA 차단) 같은 **다른 커스텀 규칙은 계속 그대로 적용**되어 결국 차단됨.
- User-Agent 헤더를 앱 코드에 추가한 건 무해하지만, **이게 진짜 원인 해결책은 아니었다** — Cloudflare 규칙 자체가 그 헤더 유무와 무관하게 다른 차단 규칙을 계속 태우고 있었기 때문.

**수정 (2026-08-23, Cloudflare 대시보드 설정 변경만 — 앱 재빌드/재업로드 불필요)**:
1. "Allow Toss Mini App" 규칙의 "건너뛸 WAF 구성요소"에서 **"나머지 모든 사용자 지정 규칙"**을 추가로 체크 (기존 "모든 Super Bot Fight 모드 규칙"은 유지)
2. 매칭 표현식(Expression)에 momcare/gamjung/budget뿐 아니라 **diet, mbti, petun/zodiac(공용 toss-inapp)까지 총 7개 앱 API 경로**를 OR로 추가:
   ```
   any(http.request.headers["origin"][*] contains "tossmini.com") or (http.request.uri.path contains "/api/momcare/save") or (http.request.uri.path contains "/api/gamjung/save") or (http.request.uri.path contains "/api/budget") or (http.request.uri.path contains "/api/diet") or (http.request.uri.path contains "/api/mbti/analyze") or (http.request.uri.path contains "/api/toss-inapp")
   ```
3. 규칙 순서: 다른 차단 규칙(예: Block empty user-agent)보다 **먼저(첫 번째)** 평가되도록 유지.

**검증**: `www.jeomun.com`(리다이렉트 안 거치고 직접) 대상으로 curl에 빈 User-Agent 헤더로 7개 경로 전부 재테스트 → 전부 Cloudflare 403이 아니라 **앱/서버 레벨 응답(400/500)** 확인됨. 즉 Cloudflare 단에서는 더 이상 안 막힘.

**20개 토스 미니앱 구조 정리 (이 조사로 확정)**:
- **jeomun.com/api를 거쳐서(Cloudflare 영향권) 저장하는 7개**: budget, gamjung, momcare, diet, mbti, petun, zodiac (petun·zodiac은 공용 `/api/toss-inapp` 사용)
- **Firebase RTDB에 직접 저장(Cloudflare 영향 전혀 없음) 13개**: battle, daewoon, fortune, gunghap, haemong, jigun, movie, resume, saju, style, taegil, tarot, work

**Why**: 처음엔 "User-Agent 헤더 없어서 차단"이라고 진단했는데, 그 수정을 다 반영한 뒤에도 재발했다 — 즉 **1차 진단은 증상 완화였을 뿐 근본원인이 아니었다.** 진짜 원인은 Cloudflare 커스텀 규칙의 skip 범위 설정 누락. 이후 비슷한 "이미 고쳤는데 또 안 된다"는 보고가 오면, 클라이언트 코드보다 **Cloudflare 커스텀 규칙의 액션/skip 설정부터 다시 확인할 것.**

**앱 재빌드 필요 여부**: 이번 수정은 100% Cloudflare 대시보드 설정 변경이라 **앱 재빌드·토스 콘솔 재업로드 불필요**. 이미 올라간 빌드도 이 서버단 수정만으로 저장이 정상화됨. (단, 이전에 취소했던 토스 콘솔 제출을 다시 올려야 출시되는 건 이 버그와 별개의 정상 프로세스임 — 헷갈리지 말 것.)

---

## ⭐⭐⭐⭐ 진짜 마지막 원인 — CORS preflight가 apex→www 리다이렉트를 못 따라감 (2026-08-23, 같은날 3차 조사) — 이번엔 앱 재빌드 필요함

Cloudflare 설정까지 다 고친 뒤에도 에스더님이 momcare(육아일기)를 실제로 테스트했는데 **오늘 새로 남긴 일기가 DB에 안 보임**. 서버 GET API로 직접 조회해서 확인한 결과, 저장된 건 2026-08-21 옛날 글 하나뿐이고 오늘(08-23) 쓴 글은 저장 자체가 안 되고 있었음 — Cloudflare 문제가 아니라 **또 다른 진짜 원인이 남아있었음**.

**진짜 원인**: 6개 앱(gamjung, momcare, diet, mbti, petun, zodiac)의 fetch 호출 URL이 `https://jeomun.com/api/...` (apex 도메인)으로 되어 있었음. `jeomun.com`은 Vercel에서 `www.jeomun.com`으로 **308 영구 리다이렉트**됨. 문제는:
- POST 요청에 `Content-Type: application/json`이 있으면 브라우저/WebView의 fetch가 실제 요청 전에 **CORS preflight(OPTIONS 요청)를 먼저 보낸다.**
- curl로 직접 `OPTIONS https://jeomun.com/api/momcare/save`를 때려보면 **204(정상 CORS 응답)가 아니라 308 리다이렉트**가 옴 (`location: https://www.jeomun.com/...`).
- **CORS 스펙상 preflight 요청은 리다이렉트를 따라가지 않는다** — 즉 apex 도메인으로 보낸 POST는 preflight 단계에서 이미 실패해서 실제 POST 자체가 나가지도 못하고 fetch가 조용히 실패함(코드에 `catch {}`로 감싸져 있어서 에러조차 안 보임).
- 반면 지금까지 curl로 검증할 때는 항상 `www.jeomun.com`에 **직접** 테스트했기 때문에 이 문제가 안 보였음 — curl은 CORS 규칙이 없어서 preflight 자체가 없음. 그래서 "curl로는 되는데 실제 앱에서는 안 되는" 상황이 발생한 것.
- `budget` 앱만 원래부터 `https://www.jeomun.com/api/budget`로 www를 직접 썼기 때문에 이 문제가 없었음.

**수정 (2026-08-23, 클라이언트 코드 변경 — 앱 재빌드+토스 콘솔 재업로드 필요함)**:
- 6개 앱의 API URL을 apex(`jeomun.com`) → `www.jeomun.com`으로 직접 변경:
  - `jeomun-gamjung/src/App.tsx` commit `389069f`
  - `jeomun-momcare/src/App.tsx` commit `7f86363`
  - `jeomun-diet/src/App.tsx` commit `4e42ff0`
  - `jeomun-mbti/src/App.tsx` commit `f87f73a`
  - `jeomun-petun/src/App.tsx` commit `4754514`
  - `jeomun-zodiac/src/App.tsx` commit `11214b0`
- 전부 GitHub push 완료. tsc 타입체크 전부 통과.

**⛔ 이번엔 진짜로 앱 재빌드 + 토스 콘솔 재업로드가 필요함** — 지금까지의 Cloudflare 설정 수정과 달리, 이번 건 클라이언트 코드(App.tsx) 자체를 고친 것이라서 **.ait 새로 빌드해서 토스 개발자 콘솔에 다시 올려야 실제로 반영됨.** 6개 앱(gamjung, momcare, diet, mbti, petun, zodiac) 전부 해당.

**Why**: 이 세션에서만 벌써 "User-Agent 헤더 문제"(1차, 증상완화였음) → "Cloudflare skip설정 문제"(2차, 진짜원인이었지만 이것도 전부는 아니었음) → "CORS preflight 리다이렉트 문제"(3차, 진짜 마지막 원인) 순으로 3단계 조사가 필요했음. **교훈**: 저장 안 되는 버그는 curl 테스트만으로 "고쳤다"고 확정하면 안 됨 — curl은 CORS를 아예 안 타기 때문에 앱에서 실제로 겪는 실패를 재현 못 할 수 있음. 반드시 서버의 실제 DB(GET API 등)에서 "새로 넣은 데이터가 진짜 들어갔는지" 타임스탬프까지 확인해야 함.
