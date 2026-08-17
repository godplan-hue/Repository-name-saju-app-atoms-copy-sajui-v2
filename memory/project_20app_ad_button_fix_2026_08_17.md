---
name: project-20app-ad-button-fix-2026-08-17
description: "토스 미니앱 20개 전체 \"시작하기\" 버튼 광고 안뜨는 문제 전수 수정 완료"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-17T09:02:01.905Z
---

## 2026-08-17 완료 — 20개 앱 전수 확인, 10개 파일에서 발견+수정

**문제**: "시작하기" 버튼 클릭 시 `showFullScreenAd()` 호출 직후 광고 표시 여부와 무관하게
바로 `setStep(...)`으로 다음 화면 이동 — 광고가 뜨기 전에 건너뛰어지는 fire-and-forget 버그.

**기준 패턴 (엠비티아이 = 정상 동작 확인됨)**: `dismissed`/`adClosed`/`failedToShow` 이벤트를
확인한 뒤에만 이동, 8초 타임아웃 폴백 포함.

### 수정 완료 파일 10개 (전부 git commit 완료 or 저장 완료)

| 앱 | 커밋 | 비고 |
|---|---|---|
| jeomun-gunghap | (git repo 아님, 파일에 직접 저장됨) | .git 폴더 없음 |
| jeomun-resume | `edffcda` | 순수 버튼fix만 |
| jeomun-tarot | (git repo 아님, 파일에 직접 저장됨) | .git 폴더 없음 |
| jeomun-budget | `d3fa45d` | 순수 버튼fix만 |
| jeomun-daewoon | `d01262f` | 버튼fix + 기존 미커밋 광고구조개선(TossAds.initialize 등) 함께 커밋 |
| jeomun-fortune | `cfc8de4` | 버튼fix + 기존 미커밋 광고구조개선 함께 커밋 |
| jeomun-jigun | `5d59ec0` | 버튼fix + 기존 미커밋 광고구조개선 함께 커밋 |
| jeomun-momcare | `ea4df03` | git-index 격리기법으로 버튼fix만 분리 커밋 (사용자의 별도 미완성 작업은 워킹트리에 그대로 남김) |
| jeomun-taegil | `cf8b80f` | 버튼fix + 기존 미커밋 광고구조개선 함께 커밋 |
| jeomun-saju (메인 사주) | `da9196f` | "내 사주 보러가기" 버튼, 순수 버튼fix만 |

### 확인 결과 문제 없음 (원래부터 정상)
jeomun-mbti(기준), jeomun-diet(이미 정상), jeomun-gamjung, jeomun-haemong, jeomun-petun,
jeomun-zodiac, jeomun-battle, jeomun-movie, jeomun-style, jeomun-work — 전부 `catch {} setStep(` /
`catch {} set` 패턴 검색으로 재확인, 해당 없음.

### 남은 작업
- gunghap/tarot는 git 저장소가 아니라서 커밋 불가능 — 파일 자체엔 수정 반영됨 (필요시 git init 여부 사용자에게 문의)
- **`.ait build`(ait build/ait deploy) 아직 안 함** — 다이어트 앱 사례처럼 코드는 맞아도 배포된 빌드가 예전 버전이면
  라이브에서는 여전히 안 뜰 수 있음. 빌드/업로드는 사용자 승인 후 진행.
- daewoon/fortune/jigun/taegil은 이번에 버튼fix와 함께 이전 세션에서 미완료였던 광고구조 개선사항도
  같이 커밋됨(각 커밋 메시지에 명시) — 별도 문제 아님, 정상 누적 개선사항.

관련: [[project_diary4app_phonelock_save_done_2026_08_17]]
