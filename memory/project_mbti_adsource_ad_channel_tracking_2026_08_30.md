---
name: project-mbti-adsource-ad-channel-tracking-2026-08-30
description: "사주+MBTI만 실제 광고유입경로(adSource) 추가, 기존 저장 절대 안 건드림 (사용자 명시적 범위확정)"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-30T00:16:39.744Z
---

[[bug_admin_customers_source_always_internal_fixed_2026_08_30]] 이후 후속 논의 (2026-08-30, commit `76d609bb` → `59c8520c`).

**계기**: `/admin/direct-payments`에서 sonjeolgak 결제 상품명이 빈칸으로 뜬 걸 지적받아 조사하던 중, main-v2 사주 외 나머지 ~15개 서브앱(mbti, sonjeolgak, budget, gunghap 등)은 결제 저장 시 `source` 필드에 **트래픽 경로가 아니라 앱 이름 자체**(`"mbti"`, `"sonjeolgak"`)를 하드코딩하고 있다는 걸 발견함. 이 `source` 필드는 어드민 `SOURCE_CFG`/`MERGED_SOURCES`가 앱 뱃지(🔮MBTI 등)를 그리는 데 쓰는 필드라 손대면 안 됨.

**에스더님께 물어본 것과 답변**:
- "고쳐도 틱톡이 실제로 뜨냐" → 카톡/인스타 인앱브라우저는 `document.referrer`를 아예 안 보내는 경우가 있어 완벽하진 않음(UTM 파라미터가 더 정확하지만 광고링크에 직접 태깅 필요, 아직 미구현)
- "저장 잘 되는 거 망치면 안 된다" (반복 강조) → **기존 `source` 필드는 절대 안 건드리고, 완전히 새로운 `adSource` 필드를 추가만 하는 방식으로 처리** — 기존 저장 로직·검증(`!id || !amount`)·다른 필드 전부 그대로.
- **범위 확정 (사용자 직접 지시)**: "지금 사주랑 MBTI만 광고 돌리는 중" → 이 두 앱만 처리. 나머지 13개 서브앱은 광고 안 돌리므로 이번엔 손대지 않음 — 앞으로도 사용자가 명시적으로 요청할 때만 확장할 것.

**구현 (commit `59c8520c`)**:
- `app/api/v2/save-payment/route.ts`: body에서 `adSource` 추가 destructure, `.set()`에 `adSource: adSource || ""` 한 줄만 추가. 기존 필드 전부 무변경.
- `app/mbti/pay/page.tsx`: `finalizeSuccess`가 받는 정보 타입에 `adSource?: string` 추가. 카드/카카오페이(`pay()`)·토스(`payToss()`) 두 결제경로의 `pendingInfo` 객체 및 토스 콜백의 fallback `finalInfo` 전부 `adSource: localStorage.getItem("first_source") || ""` 포함하도록 수정 — `first_source`는 `app/_components/RefTracker.tsx`(전역 mount, layout.tsx)가 최초 방문 시 한 번만 저장해두는 값.
- `app/admin/direct-payments/page.tsx`: `Payment` 인터페이스에 `adSource?: string` 추가, `AD_SOURCE_ICON` 맵(구글/네이버/카카오/틱톡/당근 등) 신규 추가, 경로 컬럼 기존 뱃지 아래에 `adSource` 있을 때만 작은 회색 라벨로 추가 표시 — 값 없으면 아무것도 안 그려짐(완전 추가형, 기존 뱃지 시스템 무변경).
- `npx tsc --noEmit` 통과 확인.

**사주는 이미 이 방식(`first_source` 우선)으로 처리돼 있음** — [[bug_admin_customers_source_always_internal_fixed_2026_08_30]] 참고, 이번 세션에선 그 패턴을 그대로 따라 MBTI에도 완전 추가형으로만 적용.

**How to apply**: 나중에 다른 앱(sonjeolgak 등)도 광고를 돌리게 되면, 그 앱의 `source:"앱이름"` 필드는 그대로 두고 이번과 동일하게 `adSource: localStorage.getItem("first_source") || ""`만 추가하는 패턴을 재사용할 것. 절대 `source` 필드 자체를 재활용하거나 덮어쓰지 말 것 — 어드민 앱뱃지 시스템이 깨짐.
