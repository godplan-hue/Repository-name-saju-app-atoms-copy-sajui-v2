---
name: project-sdk3-migration-status-2026-08-27
description: "토스 미니앱 21개 중 SDK 3.x 전환+광고문구 완료 9개, 미전환 13개 현황표+전환절차"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-28T08:01:07.359Z
---

## SDK 3.x 전환 + 광고문구(안내캡션) 완료 — 9개

| 앱 | 3.x 전환 | 광고문구 | 비고 |
|---|---|---|---|
| jeomun-gwangyeoradar | ✅ | ✅ (최초 기준 패턴) | 이전 세션 완료, commit e79c744 |
| jeomun-tarot | ✅ | ✅ | commit 7a87813 |
| jeomun-gunghap | ✅ | ✅ | commit 275fbc3, 마이그레이션과 무관한 기존 tsc 에러 4개 그대로 남음(건드리지 않음) |
| jeomun-battle | ✅ | ✅ | commit 03b7fda |
| jeomun-movie | ✅ | ✅ | commit ae56376 |
| jeomun-mbti | ✅ | ✅ | commit b2677a1 + c91ba1f(배너 width 중복키 정리) |
| jeomun-gamjung | ✅ | ✅ (광고문구는 전날 이미 완료, 이번엔 3.x 전환만) | commit c630c9d |
| jeomun-sonjeolgak | ✅ | ✅ | 신규앱, 처음부터 3.x+광고문구로 제작. 콘솔 미배포 |
| jeomun-budget | ✅ | ✅ (로딩라벨 스왑 방식, 감정일기와 동일) | commit bae94e2, **GitHub 푸시 완료**(2026-08-28). CORS 확인함 — jeomun.com API가 와일드카드(*)라 tossmini.com origin 등록 불필요, 신경 안 써도 됨. **토스 콘솔 업로드는 에스더님이 직접 함** — `ait deploy` CLI는 Claude Code 권한상 차단되어 있어서 대신 실행 불가 (다른 SDK3 전환 앱들도 전부 동일하게 코드+빌드만 하고 콘솔 업로드는 항상 사용자가 직접 함) |

## 아직 SDK 2.x — 미전환 13개

daewoon, diet, fortune, haemong, jigun, momcare, petun, resume, saju, style, taegil, work, zodiac

(2026-08-27 기준 `package.json`의 `@apps-in-toss/web-framework` 버전으로 직접 확인한 결과. 다음 전환 세션 시작 전 반드시 재확인할 것 — 이 표는 시간이 지나면 stale해짐.)

## 광고문구(안내캡션) 패턴 규칙 — 실제로는 2가지 하위 방식이 혼재함

**방식 A — 별도 캡션 줄 추가** (movie, battle 등 풀와이드 단일진입 버튼):
- `loadFullScreenAd`/`showFullScreenAd`로 이어지는 버튼 바로 아래에 삽입:
  `<p style={{fontSize:11,color:"#6b7280",textAlign:"center",margin:"6px 0 0"}}>📺 [문구] 광고가 표시돼요</p>`
- 팝업/모달(`position:fixed;inset:0` 등) 금지 — 인라인 캡션만. (손절각 초안에서 전체화면 모달로 잘못 만들었다가 이 규칙대로 다시 수정한 적 있음)
- 진입점이 여러 개면(버튼마다) 각각 다 캡션 필요 (예: battle 5개, movie 4개)

**방식 B — 로딩라벨 스왑만, 별도 캡션 없음** (gamjung 확인, budget도 동일하게 맞춤):
- 버튼 로딩 중 텍스트를 `"로딩중..."` 같은 일반 문구 대신 `"📺 광고 준비 중..."`으로 표시 — 이게 광고문구 역할을 함
- 출석체크/코인받기/섹션잠금해제(짜테크챌린지·리포트·캘린더·감정태그 등) 자잘한 pill/작은버튼류에 적용 — 별도 캡션 `<p>` 줄은 추가하지 않음
- 왜 다른가: gamjung 원본 코드를 직접 열어 확인한 결과 섹션 unlock 버튼들(card/letter/weather)이 전부 이 방식이었음 — "감정일기처럼 해줘" 요청 시 이 방식이 기준

**어떤 방식을 쓸지 판단법**: 그 앱/그 버튼이 기존에 어떤 방식이었는지 참고 앱(대개 요청에서 언급된 앱)을 실제로 열어서 확인하고 그대로 맞출 것 — 문서의 방식 A 규칙만 보고 일괄 적용하면 gamjung/budget 케이스에서 틀림.
- `GoogleAdMob.showAppsInTossAdMob`(리워드형 광고)는 두 방식 모두 대상 아님

## 2.x → 3.x 전환 절차 (6개 앱에서 검증된 방법, 재사용)

1. `package.json`에서 `@apps-in-toss/web-framework`를 `^2.10.7` → `^3.1.1`로 올리고 `npm install`
2. `git commit` (체크포인트, 되돌릴 수 없는 작업이라 필수)
3. `npx ait migrate v3` — `granite.config.*` → `apps-in-toss.config.*` 자동 전환, package.json build 스크립트도 `vite build && ait build`로 교체됨
4. `@apps-in-toss/web-bridge`에서 가져오던 `Storage`/`requestReview`를 `@apps-in-toss/web-framework` import 한 줄로 합치고 web-bridge import 삭제 (3.1.1부터 web-framework가 직접 export)
5. `npx tsc --noEmit` 0에러 확인 — gunghap처럼 tsconfig가 solution-style(참조형)이면 이 명령이 사실상 무의미하니 `-p tsconfig.app.json` 붙여서 진짜 체크할 것
6. 해당 앱이면 광고문구 추가 (위 패턴)
7. `npm run build` — `npx ait build` 단독 실행 금지(웹 빌드 산출물 없다는 에러남, 반드시 `vite build && ait build` 체인으로)
8. curl로 CORS/저장 확인 시 더미 payload는 401 뜰 수 있음(실제 스키마 shape로 보내야 정확한 판단 가능) — false negative 주의. jeomun.com API는 CORS가 와일드카드(`*`)라 도메인명(`jeomun-OO` vs `OO-jeomun` 역순 문제)는 신경 안 써도 됨
9. `git commit` + `git push` (최종). `ait deploy`/콘솔 업로드는 사용자 명시 승인 전까지 하지 않음 — 그리고 애초에 `npm run deploy`(=`ait deploy`) 자체가 Claude Code 자동모드 분류기에서 차단당해서 실행 불가함(2026-08-28 가계부에서 확인). 즉 콘솔 업로드는 항상 에스더님이 직접 해야 함 — "왜 안 올렸냐"는 질문 나오면 이 이유 설명할 것.
10. `.ait` 파일이 새로 생성/변경됐으면 반드시 커밋에 포함해서 push까지 끝내야 사용자가 콘솔에서 최신 파일을 받을 수 있음

**Why:** 앱이 21개까지 늘어나서 어떤 앱이 3.x고 어떤 게 2.x인지, 광고문구가 어디 붙었는지 매번 헷갈림 — 실제로 이번 세션에서도 "이게 배틀이다/무비다" 혼동이 있었음.

**How to apply:** 새로 3.x 전환하거나 광고문구 추가할 때마다 이 표부터 업데이트할 것. 나머지 14개 전환 시작 전에도 이 표 먼저 확인.
