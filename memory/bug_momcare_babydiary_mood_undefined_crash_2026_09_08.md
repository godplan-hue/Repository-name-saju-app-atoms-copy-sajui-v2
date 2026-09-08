---
name: bug_momcare_babydiary_mood_undefined_crash_2026_09_08
description: "육아일기(/momcare/baby-diary) \"This page couldn't load\" 크래시 — 한 파일에서 원인 3개 연쇄발견(mood폴백/JSON.parse가드/tags필드누락), 전부수정완료"
metadata: 
  node_type: memory
  type: bug
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-08T00:12:27.025Z
---

## 증상
`/momcare/baby-diary` 진입 시 크롬 네이티브 에러화면("This page couldn't load" / Reload / Back)이 뜸. 서버(curl 200, 청크파일 200, HTML 정상), Vercel storage 미사용, Cloudflare WAF, PWA/service-worker(존재 안함), 브라우저 캐시(강제새로고침 Ctrl+Shift+R), 확장프로그램(시크릿창)까지 전부 정상/무관으로 확인됐는데도 재현됨 — "어디서든안되는건문제야"(모든 진입경로에서 재현되는 진짜 버그)라는 게 사용자의 핵심 포인트였음.

## 원인 (F12 콘솔에서 직접 확인)
`Uncaught TypeError: Cannot read properties of undefined (reading 'emoji')` — `app/momcare/baby-diary/page.tsx`의 `renderDiaryCard()`(126줄)와 뷰모드 진입부(153줄)에서 `MOODS[e.mood]`/`MOODS[viewEntry.mood]`를 폴백 없이 바로 `.emoji`/`.color`/`.label`로 접근. 저장된 일기 중 하나라도 mood 값이 6개 유효값(happy/tired/grateful/worried/excited/overwhelmed) 밖이거나 undefined면 렌더링 시 전체 페이지가 크래시. 데이터 문제라 새로고침해도 매번 똑같이 재현됨 — 이게 "리로드해도 안 고쳐지는" 이유였음.

전날(2026-09-07) 커밋 `3f618b27`(일기류4개 월별그룹뷰 추가)에서 `renderDiaryCard`를 분리하며 이 접근부가 생겼거나 노출됨.

## 수정 (commit `5b922a2b`, 2026-09-08)
`app/momcare/baby-diary/page.tsx` 두 곳에 `MOODS[e.mood] || MOODS.happy` 폴백만 추가. 다른 파일(gamjung/diet 등 같은 커밋에서 같이 수정됐던 파일)은 전혀 건드리지 않음 — 사용자가 "다른파일은절대건들지마"라고 명시적으로 지시함.

## 진단 과정에서 배운 것 (중요)
서버/캐시/네트워크 레이어를 아무리 확인해도 전부 정상인데 브라우저에서 "페이지 로드 실패"류 에러가 재현될 때, 순서대로 확인했던 게 전부 허탕이었음(빌드에러/Vercel storage/Cloudflare WAF/서비스워커/캐시/확장프로그램/강제새로고침). **실제 원인은 F12 콘솔의 Uncaught 에러 한 줄로 즉시 확인됨.**

**Why:** 클라이언트 사이드 렌더링 크래시는 서버 응답이나 네트워크 레벨에서는 절대 안 보이고, 브라우저 콘솔에만 나타남.
**How to apply:** 앞으로 "어디서든 페이지가 안 뜬다"류 버그는 서버/캐시 가설을 오래 파지 말고, 최대한 빨리 사용자에게 F12 → Console 탭 에러 문구부터 요청할 것. Network 탭보다 Console 탭이 이런 크래시엔 더 직접적. [[bug_qa_page_dead_orphan_and_special_stale_flag_sweep_2026_09_05]]류의 다른 momcare/일기앱 데이터 무결성 버그와 같은 패턴(레거시 데이터가 새 코드에서 크래시 유발) — 다른 lookup 테이블(MOODS 외에도 유사한 Record 타입 lookup)에도 폴백 없는 곳 있는지 나중에 점검할 가치 있음.

## ⛔ 2차 발견 (같은 날, commit `3c73550a`) — mood 수정만으론 안 끝났음

mood 수정을 배포하고 30분 지나도 에스더님이 같은 화면을 계속 봄. 재조사해서 진짜 2번째 원인 발견: 같은 파일 62-63줄에서 `localStorage.getItem("momcare_diary")` 값을 **try-catch 없이** `JSON.parse(saved)` 하고 있었음. 저장된 일기 JSON이 깨져있으면(용량초과로 잘렸거나 등) 여기서 바로 uncaught 크래시.

**결정적 단서**: 이 케이스는 "코드를 배포해도 안 고쳐진다"가 정상임 — 문제 데이터가 서버가 아니라 **사용자 브라우저의 localStorage 안**에 있기 때문에, 재배포/캐시삭제로는 절대 안 없어지고 매번 같은 자리에서 또 터짐. `catch { localStorage.removeItem("momcare_diary") }`로 수정.

**Why:** 첫 수정(MOODS 폴백)이 유효한 수정이었음에도 사용자 체감 버그가 안 없어진 이유는 애초에 원인이 하나가 아니었기 때문. 같은 파일 안에 "레거시/손상 데이터 → 크래시" 패턴이 최소 2곳 있었음.
**How to apply:** "고쳤는데 배포 기다려도 그대로다"라는 보고를 받으면, 배포 여부(git log/push) 확인은 하되 그게 정상이면 곧바로 "이 재현은 서버 데이터가 아니라 이 사용자 로컬(localStorage)에 박힌 손상 데이터일 수 있다"는 가설로 전환할 것. 같은 파일 내 다른 JSON.parse/lookup 호출도 전부 스캔해서 한 번에 다 고칠 것 — 하나씩 고치고 재확인 반복하지 말 것.

## ⛔⛔ 3차 발견 (같은 날, commit `a1d51fbb`) — 진짜 크래시는 이거였음

2차 수정(JSON.parse 가드)도 배포했는데 30분 넘게 똑같은 화면 재현 지속. 에스더님이 F12 콘솔 스크린샷을 직접 캡처해서 보내줌 — `Uncaught TypeError: Cannot read properties of undefined (reading 'length')`, 스택트레이스에 `at Array.map(<anonymous>)` 포함. mood/JSON.parse 둘 다 아닌 **세 번째 원인**이었음.

**원인**: `renderDiaryCard()`가 `filtered.map(renderDiaryCard)`로 목록에 호출되는데, 함수 안에서 `e.tags.length > 0`을 폴백 없이 접근(141줄). `tags` 필드가 없는(스키마 변경 전에 저장됐거나 손상된) 레거시 일기 항목 하나만 있어도 목록 렌더링 자체가 즉시 크래시. 상세보기(`viewEntry.tags.length`, 176줄)와 공유버튼 텍스트(`viewEntry.tags.join`, 182줄), 검색 필터(`e.tags.some`, 124줄)에도 동일 패턴 존재.

**수정**: `(e.tags || [])`/`(viewEntry.tags || [])`/`(e.title || "")`/`(e.content || "")` 형태로 전부 방어 처리 (한 번에 4곳).

**Why:** 이 파일은 스키마가 진화하면서(태그 기능이 나중에 추가됐을 가능성) 예전에 저장된 데이터가 새 필드를 안 갖고 있어도 그대로 렌더링을 시도하는 구조였음. mood, JSON 파싱, tags — 전부 "레거시 데이터 필드 누락/손상 → 방어 코드 없음 → 크래시"라는 동일 계열의 문제가 한 파일에 3번 반복됨.
**How to apply:** 이 파일(`app/momcare/baby-diary/page.tsx`)류의 "로컬/DB에 오래 쌓인 사용자 데이터를 그대로 렌더링하는 컴포넌트"는 앞으로 새 필드를 추가할 때마다 기존 데이터엔 그 필드가 없을 수 있다는 걸 기본 가정으로 두고 전부 `|| 기본값` 처리할 것. "찾아서 고쳤다"고 보고한 뒤에도 사용자가 똑같은 화면을 계속 본다고 하면, 배포 지연이나 캐시를 의심하기 전에 **그 파일 안에 아직 못 찾은 네 번째 크래시 지점이 있을 수 있다**는 가능성을 먼저 열어둘 것 — 이번에 벌써 세 번째였음.
