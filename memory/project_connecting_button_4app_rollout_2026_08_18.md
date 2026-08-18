---
name: project-connecting-button-4app-rollout-2026-08-18
description: "접속중 버튼 방식 실기기 테스트 확정 + 4개앱(다이어트/맘케어/가계부/궁합) 전체 적용+빌드 완료, 다이어트 1원적립 미확인 버그 원인+수정, 궁합은 탭바 자체가 없음 확인됨"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-18T12:02:36.690Z
---

## 접속중 버튼 방식 — 에스더님 실기기 테스트로 확정 (변경 금지)
- "야 완벽하다 이걸로저장해놔 이리하니넘자연스럽고광고도잘뜬다 두번햇어" — 다이어트 앱에서 두 번 실기기 테스트, 자연스럽고 광고도 잘 뜸 확인
- 패턴: `connecting` state 추가 → 클릭 시 재클릭 방지(`if(connecting) return`) → 즉시 `setConnecting(true)`로 버튼 텍스트 "접속중..."로 변경("광고" 단어 절대 안 씀, 이전 세션에서 에스더님이 직접 교정한 UX 원칙) → 전면광고 시도(최초1회+1.5초 간격 재시도 3회, 총 MAX_ATTEMPTS=4) → 성공하든 실패하든 결국 `proceed()` 호출해 다음 화면 진행 + connecting false 복귀
- **이후 새 앱 만들 때도 "시작하기"류 버튼은 이 패턴 그대로 사용할 것**

## 4개 앱 전체 적용 완료 (2026-08-18)
- "이방식으로바꿔모든앱들 아가4개앱 탭바도 다수정하고" 지시로 확대 적용
- 다이어트(jeomun-diet): 접속중 버튼(이전 세션 적용) + 탭바 플로팅(이전 세션) + 1원 alert 수정(이번 세션)
- 맘케어(jeomun-momcare): 접속중 버튼 + 탭바 플로팅 신규 적용, 빌드 성공 (deploymentId 01a014b6-b461-7dae-8e8b-866382276d53)
- 가계부(jeomun-budget): 접속중 버튼 + 탭바 플로팅 신규 적용, node_modules 없어서 npm install 먼저 필요했음, 빌드 성공 (deploymentId 01a014b9-bb12-716a-8cd4-fb23c728726a)
- 궁합(jeomun-gunghap): 접속중 버튼만 적용(탭바 자체가 없음, 아래 참고), node_modules 없어서 npm install 먼저 필요했음, 빌드 성공 (deploymentId 01a014bd-e06e-7722-a84d-d49a44bea9a0)

## ⚠️ 궁합(gunghap)은 탭바가 없음 — 기존 메모리 "4개앱 탭바" 정정
- [[project_diet_ad_tabbar_fix_2026_08_18]]에 "탭바 쓰는 앱 4개: 다이어트·맘케어·가계부·궁합"이라 적혀있었으나, 실제 코드 확인 결과 궁합에는 여러 아이콘이 나열된 하단 탭바가 없음
- 궁합에 있는 건 하단 고정 광고배너 컨테이너 3곳뿐 (`position:fixed, bottom:0` 광고 배너, 탭 아이콘 아님) — 이건 플로팅 형태로 바꿀 대상이 아니라서 그대로 둠
- 탭바 플로팅 수정이 실제로 필요했던 건 다이어트·맘케어·가계부 3개뿐

## 다이어트 1원 적립 테스트 확인 안 되던 버그 — 원인+수정
- 증상: PROMOTION_TEST_MODE=true로 두 번 테스트해도 1원 지급 성공/실패 여부가 화면에 전혀 안 보임
- 원인: `grantPromotionReward(...).catch(() => {})` — 성공/실패 결과를 그냥 버림, 폰에선 console.log도 안 보이니 확인할 방법이 없었음
- 수정: `.then()/.catch()`에 `alert(JSON.stringify(result))` 추가, 단 `PROMOTION_TEST_MODE`일 때만 뜨게 처리(실사용자에겐 안 보임)
- 파일: `jeomun-diet/src/App.tsx` `grantStartMissionReward()` 함수

## 탭바 플로팅 스타일 (다이어트/맘케어/가계부 공통 적용)
- 기존: `bottom:0,left:0,right:0` 화면에 딱 붙음 → 토스 브랜딩 가이드 위반으로 반려됨
- 수정: `bottom:12,left:12,right:12` + `borderRadius:20` + `boxShadow:"0 4px 20px rgba(0,0,0,0.4)"` + `overflow:"hidden"`, `borderTop` 제거

## 남은 작업
- 4개 앱 새 빌드를 콘솔에 업로드해서 에스더님 실기기 재테스트 필요 (로컬 빌드만 됨, 자동배포 아님)
- git commit/push 아직 안 함 — 에스더님 명시 요청 있을 때 진행
