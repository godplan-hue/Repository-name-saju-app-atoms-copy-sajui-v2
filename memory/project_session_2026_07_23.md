---
name: project_session_2026_07_23
description: 2026-07-23 세션 작업 내용 — 개인정보보호법 마케팅 동의 분리 + 꿈해몽 게이트 + 메인사주 마케팅 체크박스
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

# 2026-07-23 세션 작업 요약

## 핵심 작업: 개인정보보호법 [필수]+[선택] 체크박스 2개 분리

### 완료된 앱 목록 (전체 완료)

| 앱 | 파일 | 커밋 |
|---|---|---|
| 직운 | `app/jigun/page.tsx` | `eb22aa4` |
| 합격자소서 | `app/resume/start/page.tsx` | `eb22aa4` |
| 점운MBTI(jeomun.com) | `app/toss-mbti/page.tsx` | `eb22aa4` |
| 가계부 | `app/budget/page.tsx` | `eb22aa4` |
| 다이어트 | `app/diet/page.tsx` | `eb22aa4` |
| 맘케어 | `app/momcare/page.tsx` | `eb22aa4` |
| 꿈해몽 | `app/haemong/page.tsx` | `9eba5df` (게이트 방식) |
| 메인사주 | `app/main-v2/profile/page.tsx` | `8d4d249` |

※ 재물운무료(/free/FreeForm.tsx), 궁합, MBTI, 행운번호, 펫운, 감정일기, 별자리, 타로 — 이미 이전 세션에서 완료됨

### API marketing 필드 저장 추가

| API | 파일 | 커밋 |
|---|---|---|
| 직운 | `app/api/career/analyze/route.ts` | `eb22aa4` |
| 합격자소서 | `app/api/resume/analyze/route.ts` | `eb22aa4` |
| 가계부 | `app/api/budget/route.ts` | `eb22aa4` |
| 다이어트 | `app/api/diet/route.ts` | `eb22aa4` |
| 메인사주 | `app/api/v2/customer/route.ts` | `8d4d249` |

## 꿈해몽 전화번호 게이트 신규 추가

- `app/haemong/page.tsx`: 첫 진입 시 전화번호(필수)+이름(선택)+2개 체크박스 팝업
  - localStorage `haemong_phone` 저장 → 재방문 시 스킵
- `app/api/haemong/lead/route.ts`: 신규 생성 → Firebase `haemong_leads` 저장
- `app/api/admin/free-leads/route.ts`: `haemong_leads` 경로 추가
- `app/admin/direct-payments/page.tsx`: 🌙 꿈해몽 탭 추가

커밋: `9eba5df`

## 메인 사주 [선택] 마케팅 동의 추가

- `app/main-v2/profile/page.tsx`: [선택] 마케팅 수신 동의 체크박스 추가, finish()에서 marketing 전송
- `app/api/v2/customer/route.ts`: marketing 필드 받아 consumerCustomers에 저장

커밋: `8d4d249`

## 법적 원칙 (개인정보보호법)

- [필수] 개인정보 수집·이용 동의: 서비스 이용을 위해 필수, 거부 시 서비스 불가
- [선택] 마케팅 수신 동의: 선택사항, 거부해도 서비스 이용 가능
- 반드시 두 개 별도 체크박스로 분리 — 합치면 위법

## 꿈해몽·메인사주 예외 사항

- **꿈해몽**: 폼 자체가 없어서 게이트 방식으로 추가
- **메인사주**: 전화번호는 profile 페이지에서 수집, pay 페이지에서도 수집
  - profile 저장 경로: Firebase `consumerCustomers`
  - 무료 사용자(결제 안 한 사람) DB 저장: profile 제출 시 `consumerCustomers`에 저장됨

**Why:** 개인정보보호법상 마케팅 동의는 반드시 별도 선택사항이어야 함. 합치면 과징금 대상.
**How to apply:** 새 앱 추가 시 항상 [필수]+[선택] 2개 체크박스 세트로 구현할 것.
