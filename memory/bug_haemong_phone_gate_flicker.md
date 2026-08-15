---
name: bug-haemong-phone-gate-flicker
description: "2026-08-15 꿈해몽(/haemong) 전화번호 게이트 깜빡임 버그 수정, commit cf02b56"
metadata:
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-15T00:00:00.000Z
---

`app/haemong/page.tsx` — 이미 전화번호를 등록한 사용자도 `/haemong` 진입할 때마다 전화번호 입력 게이트 모달이 한 프레임 떴다가 바로 사라지는 깜빡임 버그.

**원인**: `gateDone` state 초기값이 `false`라서 첫 렌더에서 무조건 게이트가 그려짐. `useEffect`가 `localStorage.getItem("haemong_phone")` 확인 후 `setGateDone(true)`로 바꾸는 게 그다음 틱에 일어나서, 이미 등록된 사용자는 "모달 뜸 → 즉시 사라짐" 순서로 보임. 캡처 못 할 정도로 빠르게 사라짐.

**수정**: `gateChecked` state 추가. localStorage 확인이 끝나기 전에는 게이트 자체를 렌더링하지 않음(`{gateChecked && !gateDone && (...)}`). 신규 사용자는 여전히 정상적으로 게이트가 뜨고 유지됨.

**확인된 사실**: 이 버그는 `haemong_unlock_until`(24시간 잠금해제, 사주 990원 결제로 열림)과 완전히 무관 — 별도 localStorage 키, 별도 파일(`pay/page.tsx`, `FortuneAnglesSection.tsx` 등)에서 관리됨. 이번 수정으로 전혀 영향 없음.

**커밋**: `cf02b56` (saju-app-atoms 메인 저장소, push 완료). 에스더님 직접 확인 후 정상 작동 컨펌 (2026-08-15).
