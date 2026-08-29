---
name: bug-admin-customers-source-always-internal-fixed-2026-08-30
description: 일반회원 DB 경로가 항상 점운내부로만 뜨던 진짜원인+수정 + 전체인원수 표시 추가
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-29T23:38:17.975Z
---

[[project_admin_source_tracking_2026_08_28]] 후속 수정 (2026-08-30, commit `cda3f9a0`).

**증상**: 틱톡·유튜브 광고로 들어온 사람도 `/admin/customers`(일반회원 DB) "경로" 컬럼에 전부 "점운내부"로만 표시됨.

**진짜 원인**: 경로 판별 로직이 프로필 저장 시점(`app/main-v2/profile/page.tsx` finish())의 `document.referrer`만 봄. 이 코드베이스는 페이지 이동을 `window.location.href`(완전 새로고침)로 많이 함 — 그래서 틱톡→점운 랜딩 후 사이트 내부를 몇 페이지만 거쳐도, 프로필 입력 시점의 `document.referrer`는 "직전에 있던 점운 내부 페이지"로 바뀌어버림. `/main-v2`,`/free`,`/main-v2/share` 등 특정 경로만 이름표(메인/무료랜딩/공유페이지 등)가 붙어있고 나머지는 전부 "점운내부"로 뭉뚱그려짐 — 08-28에 고친 "카테고리 목록에 틱톡/당근 추가"는 맞았지만,애초에 "최초 유입"이 아니라 "직전 내부페이지"를 보고 있던 게 근본 원인이었음.

**수정**:
- `app/_components/RefTracker.tsx`(모든 페이지 최상단 layout에서 항상 실행): 최초 방문 시 `document.referrer`로 경로를 판별해 `localStorage["first_source"]`에 **한 번만** 저장. 이후 사이트 내부를 아무리 돌아다녀도 이 값은 안 바뀜.
- `app/main-v2/profile/page.tsx`: 저장 시 `first_source`가 있으면 그걸 우선 사용, 없으면 기존 live referrer 계산으로 폴백.

**전체 인원수 표시**: `/admin/customers` 첫 페이지 로드 시 `consumerCustomers` 전체 개수를 세어 "전체 N명"으로 표시 (`app/api/admin/customers/route.ts` GET에 `total` 추가). "더보기" 클릭마다는 다시 세지 않음(성능).

**후속 수정 (같은 날, commit `abdf1054`)**: 에스더님이 "일반회원 결제내역"(`/admin/direct-payments`) 화면도 경로가 "내부"로만 뜬다고 재확인 요청 — `app/main-v2/pay/page.tsx`의 `pay()`(카드/카카오페이)와 `payToss()`(토스페이먼츠) 두 함수 모두 동일한 구조적 결함(결제 시점 live `document.referrer`만 사용)이 있어서 똑같이 `localStorage["first_source"]` 우선 사용하도록 수정. `finalizeSuccess()` → `/api/v2/save-payment`로 전달되는 `source` 필드가 이걸로 바뀜.

**한계 (에스더님께 안내 필요)**:
- 신규가입/신규결제부터만 정확히 잡힘 — 이미 저장된 기존 레코드(가입 DB든 결제내역이든)는 그대로, 소급 반영 안 됨.
- 틱톡/인스타/카카오 인앱브라우저는 여전히 `document.referrer` 자체를 안 보내는 경우가 있어 그런 경우는 "직접"으로 잡힘(기존에도 승인받은 한계, [[project_admin_source_tracking_2026_08_28]] 참고).
- `daewoon/pay/page.tsx`의 `source:"daewoon"`은 트래픽 경로가 아니라 "어떤 앱 결제인지" 구분용 필드라 무관 — 건드리지 않음.

**How to apply**: 앞으로 새 유입경로 추적 지점을 추가할 때는 `document.referrer`를 그 시점에 바로 읽지 말고, `localStorage["first_source"]`(RefTracker가 최초 1회 저장) 우선 사용 → 없을 때만 live referrer 폴백.
