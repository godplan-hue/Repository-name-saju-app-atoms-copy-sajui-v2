---
name: bug-mbti-diet-duplicate-reward-fix-2026-08-19
description: "MBTI+다이어트 1원 미션리워드가 시작하기 누를때마다 무한중복지급되던 버그, 기기당1회제한으로 수정완료"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-18T18:08:19.503Z
---

MBTI·다이어트 두 앱 모두 "시작하기" 버튼 → 10초 대기 → 1원 지급(`grantStartMissionReward`) 로직에
중복방지 체크가 전혀 없어서, 같은 사람이 앱을 다시 열고 시작하기를 누를 때마다 계속 1원씩 나가고 있었다.
실제로 에스더님이 테스트 중 "1원 준다더니 2원 나갔다"고 보고해서 발견됨.

**Why**: 프로모션 예산(MBTI 5만원)이 한 사람의 반복 테스트/재방문만으로 소진될 위험이 있었음.
사용자는 이걸 전날 밤 렌더링테스트 배너버그([[project_mbti_banner_root_cause_fix_2026_08_19]])와
같은 문제로 착각했지만, 완전히 별개의 버그였음 — 배너버그를 고쳐도 이 중복지급은 그대로 남아있었음.

**수정 방법**: `tossGet`/`tossSet` (Toss Storage, 기기별 영구저장)으로 "이미 지급함" 플래그를 두고,
`grantStartMissionReward()` 맨 앞에서 체크 → 있으면 즉시 return, 없으면 먼저 플래그를 세팅하고 지급 호출.
- MBTI: 키 `"mbtiRewardGranted"`, commit `ae8c6d4`, deploymentId `01a0160e-625d-790e-97b5-31835b9e1c97`
- 다이어트: 키 `"dietRewardGranted"`, commit `4b74f37`, deploymentId `01a0160e-9819-7b33-b2fd-0a2ebd8619b5`

**How to apply**: 앞으로 새 앱에 같은 "시작하기 후 N초 대기 → 1원 지급" 미션 패턴을 넣을 때는
반드시 처음부터 이 기기당1회 체크를 포함시킬 것 (grantStartMissionReward를 async로 만들고
tossGet으로 먼저 확인하는 패턴 그대로 복사). 두 앱 다 새 빌드를 콘솔에 재업로드→테스트→승인요청
다시 진행해야 함 (다이어트는 기존 승인요청을 취소하고 이 빌드로 재요청하기로 함).
