---
name: project_session_2026_09_05_flash_bug_and_apps_qa_fixes
description: "로그아웃상태 배너/버튼 클릭시 \"뜨고넘어가는\" 깜빡임 버그 4곳 수정 + /apps D-day표시버그 + qa-list 뒤로가기버그 수정 (2026-09-05)"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-05T07:00:17.292Z
---

## 1. 로그아웃 상태 "뭔가 뜨고 넘어가는" 깜빡임 버그 — 4곳 수정 완료 (commit 37dfbb98)

**증상**: 로그아웃 상태에서 대운/택일 배너, "990원으로 바로 보기" 버튼, "전체 운세 패키지 보기" 카드를 누르면 실제 페이지 내용이 한 프레임 보였다가 `/main-v2/profile`로 튕겨나감.

**원인**: `router.push(url)`(클라이언트 소프트 네비게이션)은 목적지 컴포넌트의 전체 렌더트리를 먼저 그린 뒤, 그 안의 프로필체크 `useEffect`가 나중에 실행돼 `window.location.replace(...)`로 튕겨내는 구조라 레이스컨디션 발생.

**수정**: 아래 4개 파일에 "프로필 확인 전엔 배경색만 있는 빈 화면을 그리는" early-return guard 추가. 반드시 모든 useState/useRef/useEffect 선언 **아래**(React Hooks 규칙 위반 방지), 최종 JSX return **바로 위**에 위치시켜야 함.
- `app/main-v2/daewoon/DaewoonClient.tsx`
- `app/main-v2/taegil/TaegilClient.tsx` (기존 "헤더는 항상 즉시 렌더링(LCP개선)" 주석/설계를 의도적으로 오버라이드 — 깜빡임버그 제거가 우선)
- `app/main-v2/payment/page.tsx` (`gateOk` state 신규 추가, guard는 hooks 전부 선언된 뒤인 최종 return 직전에 배치)
- `app/main-v2/yearly/page.tsx`

이미 안전했던 곳(수정 불필요, 확인만 함): `app/main-v2/pay/page.tsx`(`pageReady` state로 이미 처리됨), `app/main-v2/analysis/page.tsx`(이미 `if(!profile) return 로딩중...` 있음).

**참고**: `/main-v2/payment`에서 로그아웃 상태로 결제 버튼 누르면 프로필입력폼(DB저장)이 먼저 뜨고 그 다음 결제창 뜨는 것은 **의도된 설계**(다른 사람이 저장해둔 정보로 결제되는 것 방지) — 버그 아님, 에스더님께 확인받음.

**Why**: 사용자가 대운→택일→990원버튼→전체패키지카드까지 동일 증상을 4번 연속 신고. 매번 같은 근본원인(router.push race)이라 한 번에 스윕.
**How to apply**: 앞으로 `router.push`로 이동하는 프로필게이트 페이지를 새로 만들 때, 반드시 이 early-return guard 패턴을 처음부터 넣을 것.

## 2. `/apps` 페이지 일기류 4개앱 D-day 배지 "초기화된 것처럼 보이는" 버그 (commit 09105de5)

**증상**: 감정일기·다이어트·가계부·육아일기 배지가 "D-{남은일수}" 대신 기본값 "1,980원·30일"로 표시됨. 에스더님은 예전에 몇십일 남아있던 걸로 기억.

**원인**: `app/apps/page.tsx`의 `getUnlockStatus()`가 **오직 이 브라우저의 localStorage**(`*_unlock_until`)만 읽음 — 다른 브라우저/기기로 열거나 캐시가 지워지면 실제로는 서버(Firebase, 전화번호 기준)에 남아있는 잠금해제 값이 있어도 "리셋된 것처럼" 보임. `/pass` 페이지는 이미 `/api/phone-unlock?phone=` 으로 Firebase 값을 가져와 병합하는데 `/apps` 페이지엔 이 로직이 없었음.

**수정**: `/apps` 페이지 useEffect에 `v2_verified_phone` 있으면 `/api/phone-unlock` 호출해서 Firebase 값과 로컬값 중 더 큰 쪽을 채택하도록 병합 로직 추가.

**한계**: 애초에 그 기기에서 전화번호 인증 없이 로컬에서만 잠금해제됐던 경우엔 서버에도 기록이 없어서 복구 불가.

**Why**: 로컬스토리지 단독 의존 구조의 근본적 약점 — 다른앱(momcare/gamjung/diet/budget) 잠금해제 상태를 보여주는 다른 화면을 새로 만들 때도 같은 함정 주의.
**How to apply**: [[project_gwangyeoradar_sonjeolgak_ad_unlock_2026_08_29]] 계열의 "로컬 vs 서버 unlock 값 병합" 패턴 참고.

## 3. 사주 Q&A(`/main-v2/qa-list`) 뒤로가기 화살표 안눌리는 버그 (commit 39f73df3)

**증상**: 결과지 → Q&A 버튼 눌러 들어간 페이지에서 좌상단 ← 화살표를 눌러도 아무 반응 없음.

**원인**: 결과지의 Q&A 버튼이 `window.open("/main-v2/qa-list", "_blank")`로 **새 탭**을 여는데, 새 탭엔 브라우저 히스토리가 없어서 화살표의 `window.history.back()`이 갈 곳이 없어 무반응.

**수정**: `if (window.history.length > 1) window.history.back(); else window.location.href = "/main-v2";`

**Why**: [[project_lock_system]]에 기록된 "카톡결과지이탈버그 window.open 통일 패턴" 부작용 — window.open으로 새탭 여는 다른 페이지들도 자체 뒤로가기 버튼이 있다면 같은 문제 있을 수 있음, 발견되면 동일 패턴으로 수정.
**How to apply**: 새 탭(`window.open`)으로 열리는 페이지에 자체 "뒤로가기" 버튼을 넣을 땐 항상 `history.length` 체크 후 폴백 경로를 넣을 것.
