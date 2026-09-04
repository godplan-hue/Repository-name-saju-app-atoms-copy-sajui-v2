---
name: bug-toss-gwangyeoradar-dbsave-and-saju-bundled-apps-architecture-2026-08-26
description: "신규 토스앱 gwangyeoradar DB저장 버그 수정+GitHub 저장소 신규생성, jeomun-saju 내부 탭 구조 vs 개별 폴더 혼동 정리"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-04T11:44:04.628Z
---

## gwangyeoradar("연락기록통계 점운", 구 인간관계분석기) — 2026-08-25~26

- **버그**: 리드 저장이 Firebase에 직접 POST하는 방식이라 보안규칙(permission denied)에 막혀 조용히 실패 — MBTI에서 이미 겪었던 것과 똑같은 버그(commit `98d713f` 패턴).
- **수정**: `/api/gwangyeoradar/lead` 신규 API 생성해서 그쪽으로 저장하도록 클라이언트 fetch 변경. 어드민 무료DB에 "📡토스연락통계" 탭 추가(`gwangyeoradar_toss_users` 경로).
- **⛔ 이 앱은 이번 세션 전까지 GitHub 저장소 자체가 없었음** (`git init`도 안 된 상태). `gh repo create godplan-hue/jeomun-gwangyeoradar --private --push`로 신규 생성+커밋+푸시 완료. 확인: `gh repo view godplan-hue/jeomun-gwangyeoradar` → 실재 확인됨.
- **교훈**: 새 토스앱 폴더 만들 때 git 저장소 생성 여부를 매번 확인할 것 — 안 하면 로컬에만 존재해서 복구 불가능한 상태가 됨.

## ⛔⛔⛔⛔⛔ 2026-09-04 재확인 — 이 혼동이 또 반복됐음, 절대 다시 반복 금지

에스더님이 "몇십번을 말했다"고 할 정도로 이미 여러 번 정정한 사실인데, 이 세션에서 또 jeomun-petun 독립 폴더를 실제 라이브 앱처럼 취급해서 "자동노출 광고 버그"를 찾아 수정+커밋+푸시(`c57dde9`)하고, 심지어 "이거 다시 .ait 빌드해서 콘솔에 올려야 하나요?"라고 되물어서 크게 짜증나게 만듦.

**최종 확정 (더 이상 확인 질문 하지 말 것)**: 꿈해몽·별자리·펫운은 100% jeomun-saju 안의 내장 탭이다. `jeomun-haemong`/`jeomun-zodiac`/`jeomun-petun` 독립 폴더는 죽은 프로토타입이고 토스 콘솔에 올라간 적도, 올릴 계획도 없다. 이 폴더들 코드를 수정해도 실제 서비스에는 전혀 영향 없다 — **수정 자체가 시간 낭비이자 에스더님 신경을 긁는 행위**이니, 앞으로 "자동 광고/버그가 있나" 같은 감사·점검 요청이 오면 jeomun-saju 안의 펫운/꿈해몽/별자리 관련 코드(activeTab 분기)만 보고, 독립 폴더 3개는 아예 건드리거나 언급하지 말 것.

**How to apply**: 향후 세션에서 haemong/zodiac/petun 이름이 나오면 반사적으로 "jeomun-saju 내장 탭"으로만 이해하고 독립 폴더는 검색·수정 대상에서 제외한다. 헷갈리면 이 메모리부터 다시 읽을 것.

## ⛔⛔⛔ 중요 아키텍처 혼동 정리 — 반드시 읽을 것

**jeomun-saju (토스 미니앱)** 안에는 사주뿐 아니라 **꿈해몽·별자리·펫운이 탭으로 전부 내장**되어 있음 (`activeTab: "사주"|"꿈해몽"|"별자리"|"펫운"`). 저장은 `fbPut()` 헬퍼로 `/api/toss-saju/lead`를 경유하며, 이 API는 `saju_leads/`, `haemong_toss_users/`, `zodiac_toss_users/`, `petun_toss_users/` 4개 prefix를 화이트리스트로 허용함. **이 내장 탭들은 처음부터 정상 저장되고 있었음 — 버그 없음.**

이것과 별개로, `C:\Users\moon6\OneDrive\바탕 화면\` 밑에 **jeomun-haemong / jeomun-zodiac / jeomun-petun 이라는 완전히 독립된 폴더 3개가 존재**함 (각자 GitHub 저장소도 있음: godplan-hue/jeomun-haemong 등). 이건 **실제로 사용되지 않는 옛날 프로토타입 코드**로 추정됨 — 토스 콘솔에 올라간 적 없음(에스더님 확인: "아직 올리지도 않았어").

**2026-08-26 세션에서 실수**: 이 독립 폴더 3개(jeomun-haemong/zodiac/petun)에서도 firebaseio.com 직접POST 패턴을 발견하고 gwangyeoradar와 같은 버그로 착각 → `/api/toss-zodiac/lead`, `/api/toss-petun/lead`, `/api/toss-haemong/lead` 신규 API 3개 생성 + 각 폴더 코드수정+재빌드+커밋+푸시까지 완료함. **나중에 에스더님이 실제 라이브 앱은 jeomun-saju 내장 탭이라고 정정** — 이 독립 폴더들은 안 쓰이는 죽은 코드일 가능성이 높음. 만들어진 API 3개(toss-zodiac/petun/haemong)와 코드수정은 해가 되진 않지만 **불필요했을 가능성 높음** — 콘솔에 올릴 계획 없으면 무시해도 됨.

### 다음 세션 확인할 것
- jeomun-haemong/jeomun-zodiac/jeomun-petun 독립 폴더가 진짜 죽은 코드인지, 혹시 미래에 개별앱으로 분리 출시할 계획이 있는지 에스더님께 확인.
- 점운.com 웹사이트(jeomun.com)의 `/haemong`, `/petun` 등은 이것과 또 다른 별개의 코드베이스(Next.js 웹앱) — 토스 미니앱과 혼동하지 말 것.

## 확인된 정상 상태 (2026-08-26 기준)
- 사주(jeomun-saju 토스앱, 내장 탭 포함) → ✅ 정상
- 궁합(jeomun-gunghap 토스앱) → ✅ 정상 (`/api/gunghap/lead` 경유, 3회 재시도)
- gwangyeoradar(연락기록통계 점운) → ✅ 수정 완료, 오늘 최초 출시 예정
- style/movie/work/battle 토스앱 → 코드상 firebaseio.com 직접POST 패턴이 남아있지만, 에스더님이 "잘 저장되고 있다"고 확인함 — 건드리지 않음 (재확인 필요시 어드민 DB 직접 대조 권장)
