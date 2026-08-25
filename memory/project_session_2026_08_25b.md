---
name: project-session-2026-08-25b
description: "타로 상단잠금+궁합 공유딥링크/광고프리로드/2개잠금분리 완료, DB저장 재신고 원인은 콘솔 미재업로드로 추정, 24h폰번호락 mbti만 있고 tarot/gunghap엔 없음"
metadata:
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-25T00:03:24.604Z
---

## 1. jeomun-tarot — 상단 "오늘의 타로카드" 무료노출 잠금 전환 (commit `678d08c`)

최상단 미리보기가 Section1~4와 달리 항상 무료로 열려있던 문제. `unlocked0` state 추가해 동일 잠금패턴 적용. 빌드완료 `tarot-jeomun.ait`, deploymentId `01a03637-4645-794f-8e58-6348102e5d93` — **콘솔 재업로드 필요(사용자)**.

## 2. jeomun-gunghap 4종 수정 (commit `95fdc27`)

- `handleShare()`에 `getTossShareLink("intoss://gunghap-jeomun")` 딥링크 추가 — 공유메시지에 링크 없던 문제 수정
- 결과화면(`step==="result"`) 진입시 `GoogleAdMob.loadAppsInTossAdMob` 프리로드 useEffect 추가 — mbti의 검증된 패턴과 동일. 이게 없으면 첫 클릭에 광고 안뜸
- `watchAdToUnlock`에 남아있던 3번째 `"adClosed"` 오타 제거 (이전 세션에 2곳 고쳤다고 기록했었는데 실제로 1곳 더 있었음 — **"고쳤다"는 이전 기록도 재확인 필요할 수 있음**)
- 상단에 항상 무료로 노출되던 "궁합점수+오행+상생상극" 카드를 "🔮 궁합 점수"(점수써클+오행칩)와 "☯️ 상생상극 관계"(관계뱃지) 2개로 분리, 각각 `watchAdToUnlock`/`payToUnlockSection`으로 광고·990원 개별잠금. 연애성향 무료티저는 궁합점수 카드 안에 그대로 유지(사용자가 이건 잠그라고 안 함)

빌드완료 `gunghap-jeomun.ait`, deploymentId `01a03637-0269-7c09-b6fd-f250f7d17b9d` — **콘솔 재업로드 필요(사용자)**.

## 3. ⚠️ DB저장 재신고 — [[project_session_2026_08_25]] 2번 항목의 "문제없음" 결론은 근거 부족했음

사용자가 "아까 이상없다고 했는데 방금 실제 전번으로 테스트해보니 아직도 저장 안 된다"고 재신고. 재조사 결과:

- jeomun-gunghap(`c1b586d`, 08-23)·jeomun-saju(`3316ab5`, 08-25 03:26) 둘 다 **이미 Firebase 직접POST → jeomun.com API경유 방식으로 코드 수정 완료됨** (Toss 웹뷰에서 Firebase 직접호출시 RTDB 보안규칙에 막혀 permission denied 나던 문제)
- `app/api/toss-saju/lead/route.ts`, `app/api/admin/free-leads/route.ts` 서버측 코드 전부 정상 확인
- **두 앱 다 이 수정이 반영된 최신 .ait가 이미 로컬에 빌드되어 있음** — `gunghap-jeomun.ait`(08-25 01:50, 이번 세션 재빌드로 더 최신화됨), `saju-jeomun.ait`(08-25 03:27)
- 이전 세션 "문제없음 확인"은 **curl로 서버 API만 직접 테스트한 것** — 실제 Toss 콘솔에 떠있는 (수정 전) 구버전 클라이언트 코드는 전혀 건드리지 않은 테스트였음. `__DIAGTEST__` 진단행이 그 흔적.

**결론(가설, 미확정)**: 사용자가 신고한 "아직도 저장 안 됨"은 코드 결함이 아니라, **수정된 .ait를 아직 콘솔에 재업로드 안 했을 가능성이 매우 높음**.

**Why**: 로컬 재빌드는 자동배포 안 됨 — Toss 콘솔에 .ait를 수동 재업로드해야 실제 앱에 반영됨(이 프로젝트 전체의 반복되는 배포 특성).
**How to apply**: 다음 대화에서 반드시 먼저 물어볼 것 — "혹시 최근 gunghap-jeomun.ait / saju-jeomun.ait를 콘솔에 재업로드 하셨나요?" 재업로드 확인 후에도 안 되면 그때 코드 재조사. **"문제없다"고 성급히 결론내지 말 것** — [[feedback_check_code_not_docs]] 참고.

## 4. ⚠️ 24시간 전화번호락 — mbti만 있고 tarot·gunghap엔 없음 (사용자에게 미보고, 미수정)

사용자 요청: "타로 궁합도 mbti처럼 24시간 오픈, 다른전번으로 오면 재잠금, 결제한 번호로 오면 재오픈, 24시간동안 결과지 계속 뜨는지 확인해줘"

코드 직접 확인 결과:
- **mbti (`jeomun-mbti/src/App.tsx`)**: `Storage`(토스 API) 기반 `mbtiPaidUntil_${phone}` 키로 전화번호별 잠금해제 시각 저장. 전화번호 입력값이 `lastPhoneRef.current`와 달라지면 즉시 `setMbtiPaidUntil(0)` + `setUnlockedSections(new Set())`로 재잠금. mount시 마지막 전화번호로 저장된 값 복원해서 유효하면 자동 재오픈. **이게 사용자가 원하는 정확한 동작.**
- **tarot·gunghap**: 둘 다 raw `localStorage`에 기기 스코프 키(`tarot_s1_until~s4_until`, `gunghap_unlock_1/2/3(+score/relation)`)로만 저장 — **전화번호와 전혀 연동 안 됨**. 즉 같은 기기에서는 전화번호를 바꿔도 안 잠기고, 다른 기기로 가면(결제한 번호 그대로 입력해도) 복원이 안 됨.

**결론**: 사용자가 원하는 mbti식 동작이 tarot·gunghap엔 없다 — 확인 요청이었지만 실제로는 버그(미구현)에 가까움.
**How to apply**: 다음 대화에서 이 gap을 먼저 보고하고, mbti와 동일한 `Storage` 기반 `{key}_${phone}` 패턴으로 전환할지 확인받을 것. 규모가 큼 — tarot 5개락, gunghap 5개락(이번 세션에 2개 추가되어 총 5개) 전부 개조 필요. **사용자 승인 후 진행**([[feedback_wait_for_explicit_go]]).

## 5. 다음 세션 우선순위

1. 사용자에게 3번(콘솔 재업로드 여부)과 4번(전화번호락 gap) 보고 — 둘 다 아직 미전달
2. 4번 승인되면 tarot+gunghap 전화번호 스코프 잠금 구현
3. memory를 프로젝트 `memory/` 폴더에도 복사 + commit + push (아직 안함)
