---
name: feedback-haemong-zodiac-petun-bundled-in-saju-reminder-2026-08-27
description: "꿈해몽/별자리/펫운은 사주앱 내장탭 — 별도수정 절대금지, 여러번 반복지적됨"
metadata: 
  node_type: memory
  type: feedback
  date: 2026-08-27
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-01T00:43:46.859Z
---

꿈해몽(haemong)/별자리(zodiac)/펫운(petun)은 토스 미니앱에서 **jeomun-saju 앱 내장 탭**이다. 독립된 `jeomun-haemong`, `jeomun-zodiac`, `jeomun-petun` 폴더는 죽은 코드로 추정되며 손댈 필요가 없다. 관련 작업(크로스프로모 추가 등)은 jeomun-saju 하나만 수정하면 세 앱 다 커버된다.

**Why**: 이미 [[bug_toss_gwangyeoradar_dbsave_and_saju_bundled_apps_architecture_2026_08_26]]에 저장된 사실인데, 크로스프로모 작업 중 다시 확인 없이 jeomun-haemong/jeomun-petun 독립 폴더를 건드려서 에스더님이 "몇 번을 말해"라며 반복 지적함. 저장된 메모리를 실제로 참조하지 않고 작업한 게 문제.

**2026-09-01 재발**: 19개앱 광고ID 전수감사 중, jeomun-petun/jeomun-zodiac은 처음엔 "빈 광고ID = 진짜 문제"로 잘못 보고했다가 에스더님이 "사주앱안으로 들어갔다고 했잖아"로 정정. jeomun-haemong의 REWARD_AD_GROUP_ID(가짜값 "haemong_reward")도 "무해함"으로만 넘겼다가 에스더님이 "꿈해몽도 사주앱으로 들어갔다고 저장해라 했잖아"로 재지적 — 세 번째 반복. **원인**: 독립 폴더 존재 자체를 "감사 대상"으로 자동 포함시켜서 벌어짐. 감사/점검 작업 시작 전에 이 메모리부터 먼저 확인해서 haemong/zodiac/petun 세 폴더를 스캔 대상에서 제외했어야 함.

**How to apply**: 사주/꿈해몽/별자리/펫운 관련 토스앱 작업(수정이든 전수감사·점검이든) 지시를 받으면, 시작 전에 이 메모리부터 확인하고 jeomun-haemong/jeomun-zodiac/jeomun-petun 세 독립 폴더는 스캔·보고 대상에서 아예 제외할 것 — "빈 값이라 문제"조차 언급하지 않는다. 무조건 jeomun-saju 폴더 하나만 대상으로 확인. "저장해"라는 지시는 메모리 저장만 하라는 뜻이며, 그 자리에서 추가 수정 제안이나 질문으로 이어가지 말 것.
