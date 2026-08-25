---
name: bug-toss-gwangyeoradar-dbsave-and-saju-bundled-apps-architecture-2026-08-26
description: 신규 토스앱 gwangyeoradar DB저장 버그 수정+GitHub 저장소 신규생성, jeomun-saju 내부 탭 구조 vs 개별 폴더 혼동 정리
metadata:
  type: project
---

## gwangyeoradar("연락기록통계 점운", 구 인간관계분석기) — 2026-08-25~26

- **버그**: 리드 저장이 Firebase에 직접 POST하는 방식이라 보안규칙(permission denied)에 막혀 조용히 실패 — MBTI에서 이미 겪었던 것과 똑같은 버그(commit `98d713f` 패턴).
- **수정**: `/api/gwangyeoradar/lead` 신규 API 생성해서 그쪽으로 저장하도록 클라이언트 fetch 변경. 어드민 무료DB에 "📡토스연락통계" 탭 추가(`gwangyeoradar_toss_users` 경로).
- **⛔ 이 앱은 이번 세션 전까지 GitHub 저장소 자체가 없었음** (`git init`도 안 된 상태). `gh repo create godplan-hue/jeomun-gwangyeoradar --private --push`로 신규 생성+커밋+푸시 완료. 확인: `gh repo view godplan-hue/jeomun-gwangyeoradar` → 실재 확인됨.
- **교훈**: 새 토스앱 폴더 만들 때 git 저장소 생성 여부를 매번 확인할 것 — 안 하면 로컬에만 존재해서 복구 불가능한 상태가 됨.

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
