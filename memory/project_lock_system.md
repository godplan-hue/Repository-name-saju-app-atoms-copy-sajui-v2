---
name: project-lock-system
description: "앱별 잠금/해제 체계 확정 (직운/합격자소서 영구, 나머지 기간제) — 2026-07-14 구현 완료"
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

# 점운 앱 잠금 체계 (2026-07-14 전면 구현 완료)

## 잠금 기간 확정표

| 앱/기능 | 기간 | 방식 |
|---|---|---|
| 꿈해몽 | 24시간 | 사주 990원 실카드 결제 시 `haemong_unlock_until` |
| 맘케어 | 30일 | 사주 990원 실카드 결제 시 `momcare_unlock_until` |
| 감정일기 | 30일 | 사주 990원 실카드 결제 시 `gamjung_unlock_until` |
| 가계부 | 30일 | 사주 990원 실카드 결제 시 `budget_unlock_until` |
| 직운 | **1회 영구** | `/jigun/pay` 결제 후 Firebase `career_analyses/{id}.paid: true` |
| 합격자소서 | **1회 영구** | `/resume/pay` 결제 후 Firebase `resume_analyses/{id}.paid: true` |
| MBTI/행운번호/펫운/궁합 | 평생 무료 | 바이럴 도구 |

## 만료 후 동작
- **맘케어**: 만료 시 main page 상단에 "재활성화 → 사주 990원" 배너
- **감정일기**: 만료 시 새 글 추가 버튼 잠금 + 재활성화 배너 (기존 기록은 계속 열람 가능)
- **가계부**: 만료 시 "새 내역 추가" 탭에서 잠금 안내 + 재활성화 배너 (기존 내역 열람 가능)

## fullAccess 쿠폰 (어드민 할인코드)
- 어드민에서 쿠폰 생성 시 "전체 앱 열기" 체크박스 추가됨
- fullAccess=true 쿠폰 사용 시 → 꿈해몽(24h) + 맘케어/감정일기/가계부(30일) 동시 열림
- Firebase `promoCodes/{code}.fullAccess: true` 로 저장됨

## payFree() 규칙 (절대 변경 금지)
- `v2_paid=1`, `v2_plan=select` 만 기본 설정
- `fullAccess=true` 쿠폰일 때만 4개 unlock 키 설정
- unlock 키 = haemong_unlock_until, momcare_unlock_until, gamjung_unlock_until, budget_unlock_until

## pay() (실카드 결제) 규칙
- 꿈해몽 24h, 맘케어 30일, 감정일기 30일, 가계부 30일 자동 해제

## 직운/합격자소서 잠금 (localStorage 제거됨)
- jigun/pay: localStorage 제거 → PATCH /api/career/analyze 호출
- resume/pay: localStorage 제거 → PATCH /api/resume/analyze 호출
- 결과지에서는 `?paid=1` URL 파라미터 OR Firebase `paid===true` 중 하나면 열림
- CTA 버튼들은 모두 `target="_blank"` (뒤로가기 시 결과지 유지)

## 전화번호 필수화 (2026-07-14)
- 직운 폼(jigun/page.tsx): 전화번호 ★ 필수사항, 없으면 제출 차단
- 합격자소서 폼(resume/start/page.tsx): 전화번호 ★ 필수사항, 없으면 제출 차단
- FreeForm.tsx: 이름 선택사항으로 변경 (전화번호만 필수)
- free-lead API: name 없어도 저장 가능 (phone만 필수)

**Why:** 전화번호 없으면 나중에 다른 브라우저/기기에서 결과 접근 불가. 바이럴도 어려움.
**Commit:** dc4c2f6
