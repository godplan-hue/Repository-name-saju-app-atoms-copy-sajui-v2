---
name: project-sonjeolgak-gwangyeoradar-global-unlock-2026-09-01
description: "손절각+연락기록통계 전면개편(결제/광고 1번=전체24시간) + 대운/택일 990원 결제기능 신규추가 완료, 리워드광고 전환은 대기중"
metadata:
  node_type: memory
  type: project
  date: 2026-09-01
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-01T00:00:00.000Z
---

손절각(jeomun-sonjeolgak)과 연락기록통계(jeomun-gwangyeoradar) 둘 다 "결제 990원 1번 또는 리워드광고 1번 시청 → 전체 콘텐츠가 24시간 동안 다 열림" 구조로 통일 완료. 기존엔 파트별/항목별로 각각 광고를 봐야 열리는 구조였음.

**⛔ 중요 수정사항**: 에스더님이 이후 "광고는 하나씩만 열려야 한다(MBTI처럼), 전체가 한번에 열리면 안 된다"고 재수정 지시함 — 리워드광고 시청은 항목 1개씩만 언락, 결제(990원)만 전체 24시간 언락으로 최종 확정. sonjeolgak/gwangyeoradar 둘 다 이 기준으로 이미 수정 완료(prior 세션, commit은 각 레포 별도).

**Why**: 에스더님이 결제 전환율이 낮다며 대운·택일처럼 "한 번의 행동으로 전체가 열리는" 방식을 요청했다가, 이후 광고쪽은 MBTI식 개별언락으로 재수정.

**How to apply**:
- jeomun-sonjeolgak: `sonjeolgak_unlock_until_all` / `sonjeolgak_unlock_phone_all` 전역 키(결제 전용). 광고는 항목별 개별 언락으로 최종 수정됨.
- jeomun-gwangyeoradar: 결제 쪽(`gwangyeoradarPaidUntil_${phone}`) 전역, 광고는 항목별 개별 언락.
- **대운(jeomun-daewoon)·택일(jeomun-taegil)**: 최초 조사 시 IAP 결제 코드 자체가 없는 광고전용 앱이었음이 확인됨 (2026-08-28 세션). 이후 토스 콘솔에 두 앱 모두 990원 IAP SKU가 사전등록되어 있는 걸 확인 → 2026-08-28~09-01 세션에서 결제기능 신규 구현 완료:
  - 대운: SKU `ait.0000057918.7ac169df.4c876d81ea.5263359947` ("대운 24시간 전체보기"). `daewoon_unlock_until_all`/`daewoon_unlock_phone_all` 키로 8개 대운구간 전체 24시간 언락. 결제 완료 시 구간전환 시 전면광고도 스킵(`!isPaid` 체크 추가). 광고는 기존대로 구간별 1개씩 무료 언락 유지. commit `e3f931a` (jeomun-daewoon repo, branch master).
  - 택일: SKU `ait.0000057919.bd2a452d.accedfb16f.5264036380` ("택일 24시간 전체보기"). `taegil_unlock_until_all`/`taegil_unlock_phone_all` 키로 택일 조언 전체 24시간 언락. commit `49c2a12` (jeomun-taegil repo, branch master).
  - 두 앱 다 "재방문 시 폼은 항상 새로 입력받는다"는 기존 설계는 유지하면서, 결제 상태(phone 기준)만 예외적으로 복원하는 `useEffect` 추가.
  - 두 앱 다 `npx tsc --noEmit -p .` 통과 + `npm run build` 성공 + `.ait` 재빌드 완료. **콘솔 업로드는 에스더님 몫 — 아직 안 함.**
- **⏳ 미완료(블로커)**: 대운/택일의 기존 광고 언락 로직은 여전히 `showFullScreenAd`(전면광고, dismiss만 해도 언락됨)이지 진짜 리워드광고(`userEarnedReward` 이벤트로만 언락)가 아님. 두 앱 다 `REWARD_AD_GROUP_ID`가 콘솔에 등록되어 있지 않음(grep으로 확인, sonjeolgak/gwangyeoradar/mbti의 리워드 ID는 앱마다 고유해서 재사용 불가). **에스더님이 대운/택일용 "리워드형" 광고그룹ID를 토스/AdMob 콘솔에서 새로 등록해줘야 다음 작업 진행 가능.**
- [[feedback_haemong_zodiac_petun_bundled_in_saju_reminder_2026_08_27]]과 무관 — haemong/zodiac/petun 폴더 안 건드림.
- [[project_19apps_sdk3_adcopy_crosspromo_final_2026_08_29]] 광고문구/크로스프로모 체크리스트는 이번 작업과 무관, 언락 로직만 변경.
