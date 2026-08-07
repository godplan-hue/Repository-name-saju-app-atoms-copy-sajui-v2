---
name: project-session-2026-08-07
description: 2026-08-07 세션 — 토스 미니앱 5개 크로스프로모 16개 앱 업데이트 + 육아일기 전면 수정 완료
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
  modified: 2026-08-07T12:47:09.556Z
---

# 2026-08-07 세션 작업 완료

## 빌드 완료 앱 (토스 콘솔 업로드 필요)
- **momcare-jeomun.ait** ✅ (여러 번 수정 후 최종 빌드 완료)
- **budget-jeomun.ait** ✅
- **gunghap-jeomun.ait** ✅
- **fortune-jeomun.ait** ✅
- **daewoon-jeomun.ait** ✅
- **haemong-jeomun.ait** — ⛔ 업로드 금지 (꿈해몽은 사주앱 안으로 들어감)

## 공통 수정 사항 (budget / gunghap / fortune / daewoon)
- 크로스프로모 헤더: `📱 점운 모든 앱` → `📱 점운 다른 앱`
- 초기화(테스트) 버튼 제거
- budget: 꿈해몽 → 인생이영화라면으로 교체 (꿈해몽은 사주앱 안에 있어 크로스프로모에 없음)
- gunghap: `점운의 다른 앱도 무료로 이용하세요` → `📱 점운 다른 앱` (2곳)

## 크로스프로모 17개 앱 목록 (각 앱은 자기 자신 빼고 16개 표시)
꿈해몽·별자리·펫운은 사주앱 안의 탭 → 독립 앱 아님 → 크로스프로모 목록에 없음

17개 앱: 사주점운 / 육아일기점운 / 가계부점운 / 감정일기점운 / 다이어트점운 / MBTI점운 / 궁합점운 / 오늘의운세점운 / 대운점운 / 타로점운 / 직운점운 / 합격점운 / 직장버티기점운 / 이상형월드컵점운 / 인생이영화라면점운 / 추구미점운 / 오늘의핑계(또는 나쁜운세 등 챌린지 앱)

## 육아일기(momcare) 수정 전체 목록

### 광고 구조
- 탭 광고: 세션 1번 (앱 끄고 켜면 다시 뜸, 탭 전환 시에는 안 뜸)
  - `tabAdShown` state로 관리 (tossStorage X, React state만)
- 태몽 해석하기 클릭 시 전면광고 1회 추가
- 태몽 결과 열기 시 광고 1회 (기존 watchAdToUnlock)
- = 태몽 관련 총 2회 광고

### 잠금 구조 수정 (핵심 버그 수정)
**이전**: `isTaemongUnlocked = taemongUnlocked || (isHistoryUnlocked && !diaryJustWritten)`
→ 히스토리 한 번 열면 태몽/오행/캘린더 모두 자동 잠금 해제되는 버그

**수정 후**: 각각 독립 세션 상태만 사용
```
const isTaemongUnlocked = taemongUnlocked;
const isOhaengUnlocked = ohaengUnlocked;
const isMissionUnlocked = missionUnlocked;
```
→ 히스토리 열어도 태몽/오행/캘린더는 별도 광고 필요

### 태몽 해몽 UX 변경
**이전**: 잠금 버튼 → 광고 보기 → 입력창 나타남 → 꿈 입력 → 결과

**변경 후**: 입력창 항상 표시 → 꿈 입력 → "태몽 해석하기" 클릭 → 전면광고 → 결과 잠금 상태로 표시 → "🔓 지금 열어보기 →" → 광고 → 결과 공개

### 새 유저 흐름
- `init()` 에서 프로필 없으면 `setStep("contact")` 로 폼 먼저 표시
- 헤더 우측 "✏️ 정보 수정" 버튼 추가 → 누르면 프로필 폼으로 이동

### 운세 탭 — 아기 정보 없을 때
- `babyBirthDate` 없으면 "아기 정보 입력하기" 버튼 표시
- `babyBirthDate` 있으면 오행 카드 표시

### 성장 위기 캘린더
- 주차 클릭 → 증상·발달·팁 드롭다운으로 표시
- `selectedCrisisWeek` state로 관리 (같은 주차 재클릭 시 닫힘)

### 푸터 수정 (최종 — 2차 수정)
- W 스타일: `minHeight:"100vh"` → `height:"100vh"` + `overflowY:"auto"` 로 변경
  - `minHeight`는 div가 내용에 맞게 커져서 scroll container가 안 됨 → 푸터 잘림
  - `height:"100vh"` + `overflowY:"auto"` = 진짜 scroll container → 내용 넘치면 스크롤
- 메인 뷰 하단 패딩: 160px (고정 탭바 덮임 방지)
- contact 폼 하단 패딩: 40px (탭바 없음)
- 커밋: `0ee01df` (jeomun-momcare 로컬)

## 주의사항 (다음 세션)
- 감정일기(gamjung) / MBTI / 다이어트 — 승인신청중, 절대 건드리지 말 것
- haemong.ait — 빌드해도 업로드 금지 (사주앱 안에 포함됨)
- 육아일기 크로스프로모 9개 → 16개 업데이트 완료

**Why:** 에스더님이 직접 테스트하며 발견한 버그들 수정. 히스토리 잠금이 태몽 잠금을 자동 해제하는 게 가장 심각한 버그였음.

**How to apply:** 다른 일기형 앱(감정일기 등)에서도 잠금 상태를 `isHistoryUnlocked`에 연동하지 말 것. 각 섹션 잠금은 독립 세션 state로만 관리.
