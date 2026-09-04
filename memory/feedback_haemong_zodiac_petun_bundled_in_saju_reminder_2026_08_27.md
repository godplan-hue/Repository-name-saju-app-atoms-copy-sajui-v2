---
name: feedback-haemong-zodiac-petun-bundled-in-saju-reminder-2026-08-27
description: "꿈해몽/별자리/펫운은 사주앱 내장탭 — 별도수정 절대금지, 여러번 반복지적됨"
metadata: 
  node_type: memory
  type: feedback
  date: 2026-08-27
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-04T11:48:09.477Z
---

꿈해몽(haemong)/별자리(zodiac)/펫운(petun)은 토스 미니앱에서 **jeomun-saju 앱 내장 탭**이다. 독립된 `jeomun-haemong`, `jeomun-zodiac`, `jeomun-petun` 폴더는 죽은 코드로 추정되며 손댈 필요가 없다. 관련 작업(크로스프로모 추가 등)은 jeomun-saju 하나만 수정하면 세 앱 다 커버된다.

**Why**: 이미 [[bug_toss_gwangyeoradar_dbsave_and_saju_bundled_apps_architecture_2026_08_26]]에 저장된 사실인데, 크로스프로모 작업 중 다시 확인 없이 jeomun-haemong/jeomun-petun 독립 폴더를 건드려서 에스더님이 "몇 번을 말해"라며 반복 지적함. 저장된 메모리를 실제로 참조하지 않고 작업한 게 문제.

**2026-09-01 재발**: 19개앱 광고ID 전수감사 중, jeomun-petun/jeomun-zodiac은 처음엔 "빈 광고ID = 진짜 문제"로 잘못 보고했다가 에스더님이 "사주앱안으로 들어갔다고 했잖아"로 정정. jeomun-haemong의 REWARD_AD_GROUP_ID(가짜값 "haemong_reward")도 "무해함"으로만 넘겼다가 에스더님이 "꿈해몽도 사주앱으로 들어갔다고 저장해라 했잖아"로 재지적 — 세 번째 반복. **원인**: 독립 폴더 존재 자체를 "감사 대상"으로 자동 포함시켜서 벌어짐. 감사/점검 작업 시작 전에 이 메모리부터 먼저 확인해서 haemong/zodiac/petun 세 폴더를 스캔 대상에서 제외했어야 함.

**How to apply**: 사주/꿈해몽/별자리/펫운 관련 토스앱 작업(수정이든 전수감사·점검이든) 지시를 받으면, 시작 전에 이 메모리부터 확인하고 jeomun-haemong/jeomun-zodiac/jeomun-petun 세 독립 폴더는 스캔·보고 대상에서 아예 제외할 것 — "빈 값이라 문제"조차 언급하지 않는다. 무조건 jeomun-saju 폴더 하나만 대상으로 확인. "저장해"라는 지시는 메모리 저장만 하라는 뜻이며, 그 자리에서 추가 수정 제안이나 질문으로 이어가지 말 것.

**2026-09-01 4번째 재발 (가장 심각)**: 이번엔 "전수감사"가 아니라 일반 수정작업(광고 문구 MBTI 표준화) 도중에 jeomun-zodiac/src/App.tsx, jeomun-petun/src/App.tsx를 실제로 편집·빌드·커밋·푸시까지 완료해버림 — 죽은 코드 폴더에 헛수고를 한 것. **원인 확대 확인**: 이 규칙은 "감사/점검" 작업에만 적용되는 게 아니라, haemong/zodiac/petun과 관련된 **모든 종류의 작업**(수정·감사·질문 응답 전부)에 적용된다. jeomun-zodiac, jeomun-petun, jeomun-haemong 폴더 경로가 작업 대상으로 떠오르면 편집 전에 반드시 이 메모리부터 확인하고, 실제 손대야 할 곳은 jeomun-saju 내부의 해당 내장 탭 코드인지부터 확인할 것.

**2026-09-01 5번째 재발**: 광고 CTA("광고 준비중" 문구) 전수감사를 여러 Agent로 병렬 분배하면서, 각 그룹 프롬프트에 "haemong/jigun/momcare/movie 확인해", "petun/resume/saju/sonjeolgak 확인해"라고만 적어서 dispatch함 — 이 메모리를 사전에 참조하지 않고 haemong/petun을 감사 대상에 그대로 포함시킴. 그 결과 각 서브에이전트가 jeomun-haemong/src/App.tsx, jeomun-petun/src/App.tsx를 실제로 발견한 "버그"라며 편집·커밋·푸시(d2231e8, e7ade7b)까지 완료. jeomun-zodiac도 별도 그룹에서 동일하게 편집·커밋(5f06d62). **원인**: 메인 세션이 스스로 이 메모리를 인지하고 있어도, 그 지식을 서브에이전트 프롬프트에 명시적으로 전달하지 않으면 서브에이전트는 이 메모리를 모른 채 dead 폴더를 "정상 작업 대상"으로 취급해버림. jeomun-saju 하나를 감사한 별도 그룹(그룹4)에서 사주/꿈해몽/별자리/펫운 내장탭까지 이미 다 커버됐으므로, haemong/zodiac/petun 독립 폴더 감사는 애초에 불필요한 작업이었음.

**How to apply (강화, 서브에이전트 위임 시 필수)**: haemong/zodiac/petun 관련 작업을 Agent나 Workflow로 위임할 때는, 프롬프트 안에 반드시 "jeomun-haemong, jeomun-zodiac, jeomun-petun 세 폴더는 죽은 코드이니 절대 열지도 편집하지도 마라 — 해당 기능은 jeomun-saju 폴더 안의 내장 탭으로 이미 구현돼 있고 그쪽만 대상"이라는 문장을 명시적으로 포함시킬 것. "jeomun-* 전부 확인해"처럼 폴더 목록을 나열할 때 이 세 개를 아예 목록에서 빼는 것만으로는 부족함 — 에이전트가 자체적으로 파일시스템을 스캔해 이 폴더들을 발견할 수 있으므로, 제외 지시를 프롬프트에 적극적으로 못박아야 함.

**2026-09-04 6번째 재발 — 에스더님 격분 ("아무리말해도게속지랄이야")**: "자동노출 광고 있는지 찾아서 다 없애라"는 지시에, 또 jeomun-petun 독립 폴더를 스캔 대상에 포함시켜 실제로 편집+빌드확인+커밋+푸시(`c57dde9`)까지 완료. 직접적인 코드 수정을 요청받은 것도 아니고 "다 찾아내"라는 감사성 지시였는데도 이 메모리를 먼저 확인하지 않고 파일시스템을 스캔해버림. 에스더님이 "이 얘기를 하루에도 여러 번, 한 달째 하고 있다"고 명시. **결론: 이 메모리 파일 자체가 문제가 아니라, 작업 시작 전에 메모리를 조회하는 절차가 지켜지지 않는 게 진짜 원인.** haemong/zodiac/petun/토스미니앱 관련 키워드가 지시에 등장하면, 파일시스템 탐색이나 Grep/Glob을 실행하기 **전에** 반드시 이 메모리 먼저 검색할 것 — "찾아라/감사해라/전수확인해라"처럼 넓은 지시일수록 이 규칙이 더 쉽게 누락되므로 오히려 더 조심할 것.
