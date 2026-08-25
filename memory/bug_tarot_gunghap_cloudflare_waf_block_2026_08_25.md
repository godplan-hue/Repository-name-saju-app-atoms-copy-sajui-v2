---
name: bug-tarot-gunghap-cloudflare-waf-block-2026-08-25
description: "타로 저장 안됨 진짜원인=Cloudflare WAF 커스텀규칙에 /api/tarot/lead 경로 누락, 궁합/사주는 이미 정상"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-25T02:34:55.955Z
---

## 문제

사용자가 궁합 저장 안 됨 신고 → 사주/타로/궁합 3개 앱 다 저장 안 될 거라고 의심(같은 코드로 수정했다고 착각). 실제로는 3개 앱 저장로직은 서로 독립적이고 손댄 적 없었음([[project_ad_retry_4apps_fix_2026_08_25]] 참고 — 그때 수정한 건 광고 재시도로직뿐, 저장코드 아님).

## 진짜 원인 (2026-08-25 확인)

curl 기본 User-Agent로 테스트하면 항상 200 성공 — 하지만 실제 토스 앱 환경처럼 **빈 User-Agent**로 테스트하면 `/api/tarot/lead`가 Cloudflare에 **403 차단**됨. [[bug_budget_cloudflare_empty_useragent_block_2026_08_23]]와 완전히 같은 패턴 — Cloudflare "Allow Toss Mini App" 커스텀 WAF 규칙의 match 식에 해당 경로가 빠져있었음.

- `/api/tarot/lead` → 빈UA 403 확인됨 (진짜 차단)
- `/api/gunghap/lead` → 빈UA로도 200 (원래 안 막혀있었음, 그래도 예방차원에서 규칙에 추가함)
- `/api/toss-saju/lead` (사주) → 이미 규칙에 있던 `/api/toss-saju`(contains매칭)에 걸려서 원래부터 정상, 재확인해도 정상

## 수정 완료

사용자가 Cloudflare 대시보드 → 보안규칙 → "Allow Toss Mini App" 커스텀규칙 match식에 직접 추가·저장함:
```
or (http.request.uri.path contains "/api/tarot/lead")
or (http.request.uri.path contains "/api/gunghap/lead")
```
**서버설정 변경이라 앱 재업로드 불필요, 즉시 적용됨.**

## How to apply

앞으로 "OO앱 저장 안 됨" 신고가 오면:
1. curl로 서버 API 직접 테스트할 때 반드시 `-A ""`(빈 User-Agent)로도 같이 테스트할 것 — 기본 UA로만 테스트하면 Cloudflare 차단을 못 잡아냄
2. 빈UA에서 403(Cloudflare 차단페이지 HTML) 뜨면 → 해당 API 경로가 Cloudflare "Allow Toss Mini App" 커스텀 규칙 match식에 빠진 것 — 대시보드에서 경로 추가(코드수정 불필요)
3. "예전 빌드로 테스트한 거 아니냐"는 절대 다시 말하지 말 것 — 사용자가 매번 새 .ait 재업로드하고 테스트한다고 명확히 확인함
4. 새 토스앱 만들 때마다 저장 API 경로를 이 Cloudflare 규칙에 미리 추가해두는 걸 체크리스트에 넣을 것

## 남은 재업로드 (저장문제와 무관, 별개 수정사항) — 2026-08-25 갱신

전부 코드수정+빌드+커밋+푸시 완료:
- 타로: 광고 재적재 수정본 `14d3b4a`
- 대운: 공유링크 스킴 수정 `7227f1b` + 잠금해제 adImpression버그 수정 `da007d5` ([[bug_daewoon_adimpression_instant_unlock_2026_08_25]] 참고)
- 직운(jigun): 공유링크 스킴 수정 `a120850`
- 합격자소서(resume): 공유링크 스킴 수정 `af98a11`
- 택일(taegil): 공유링크 스킴 수정 `c22003d`

### ⛔ 추가 확인 필요 (2026-08-25 후반) — "재업로드만 남음"이 아니라 승인여부부터 확인해야 함

타로에서 실제로 벌어진 일: 코드는 이미 맞았는데(`faac20c`), 콘솔 "앱 출시"에서 만든 버전 16개가 전부 "검토 필요"/"요청 취소됨" 상태 — **승인된 적이 한 번도 없었음.** 그런데도 계속 "코드가 또 틀렸나보다" 하고 재조사·재빌드를 반복시킴 ([[feedback_investigate_fully_before_asking_reupload]] 참고).

이 5개 앱(타로·대운·직운·합격자소서·택일) 전부 위 커밋들을 코드에 반영한 뒤로 "앱 출시" 화면에서 실제 승인+출시가 됐는지 확인한 적이 없음. 즉 대운·직운·합격자소서·택일도 같은 함정(코드는 맞는데 리뷰 미승인이라 반영 안 된 것)에 빠져있을 가능성 있음 — 이 4개 앱도 재조사 전에 먼저 "앱 출시" 콘솔에서 최신 버전 상태부터 확인할 것.
