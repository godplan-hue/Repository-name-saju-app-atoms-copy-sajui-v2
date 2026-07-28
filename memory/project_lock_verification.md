---
name: project-lock-verification
description: "잠금/해제/영구저장 시스템 전체 검증 완료 결과 (2026-07-17 확인, commit 4ef5ee1)"
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

2026-07-17 기준 전체 잠금·해제·저장 시스템 검증 완료.

**Why:** 에스더님이 결제/잠금/저장이 제대로 작동하는지 한 번에 확인 요청.
**How to apply:** 새 세션에서 이 항목들 다시 만들지 말 것 — 이미 완성됨.

---

## 사주 990원 실결제 → 3종 24시간 잠금 해제

| 항목 | localStorage 키 | 방식 | 상태 |
|------|----------------|------|------|
| 꿈해몽 | `haemong_unlock_until` | 타임스탬프 24h | ✅ |
| Q&A 360개 | `v2_qa_unlock_until` | 타임스탬프 24h | ✅ |
| 복냥이 상담 | `v2_qa_unlock_until` | 타임스탬프 24h | ✅ |

- pay() 함수(`app/main-v2/pay/page.tsx`)에서 `haemong_unlock_until`과 `v2_qa_unlock_until` 동시에 Date.now()+24h 설정
- result/page.tsx 인라인 결제에서도 동일하게 설정
- QAChatWidget.tsx의 `unlocked` prop → `qaUnlocked` state로 분리 (타임스탬프 체크)
- qa-list/page.tsx에서 `v2_qa_unlock_until > Date.now()` 체크

## 무료쿠폰(payFree) → 3종 안 열림

| 항목 | 상태 | 이유 |
|------|------|------|
| 꿈해몽 | ✅ 차단 | payFree에서 `haemong_unlock_until` 설정 없음 |
| Q&A | ✅ 차단 | `paidSession` 허점 제거됨 — 타임스탬프만 허용 |
| 복냥이 | ✅ 차단 | `qaUnlocked=false` (타임스탬프 없으면 잠김) |

- **핵심**: payFree는 `v2_paid="1"`, `v2_plan="select"` 만 설정. unlock 키 절대 없음
- 이전 허점: `paidSession` = `v2_plan==="select"` 체크 → payFree도 통과했음 → 제거 완료

## 7개앱 풀패스 (4,900원, app/pass/page.tsx)

| 항목 | 상태 |
|------|------|
| 7개앱 동시 열림 | ✅ PASS_APPS 7개 `xxx_unlock_until` 30일 일괄 설정 |
| 30일 후 자동 잠김 | ✅ 각 앱이 `until < Date.now()` 체크 |
| 기존 가입자 날짜 연장 | ✅ Firebase 현재 만료일 조회 → `Math.max(local, firebase) + 30일` |
| Firebase 동기화 | ✅ 결제 시 `/api/phone-unlock` POST → 다른 기기 복원 가능 |

PASS_APPS 7개: `haemong / gamjung / diet / budget / tarot / petun / momcare`

## 어드민 fullAccess 쿠폰

- `app/admin/discount-codes/page.tsx`: 체크박스 이미 완성 ✅
- 레이블: "전체 앱 열기 (꿈해몽·감정일기·다이어트·가계부·타로·펫운·맘케어 7개앱 30일)"
- `app/api/promo-codes/route.ts`: fullAccess 저장/반환 모두 구현 ✅
- `app/main-v2/pay/page.tsx`의 payFree: fullAccess 쿠폰이면 7개앱 30일 열림 ✅

## 일기 영구저장 (고객 직접 삭제 전까지)

| 앱 | Firebase 경로 | 만료 후 기존 글 |
|----|-------------|--------------|
| 아기일기 (`app/momcare/baby-diary/`) | `/api/momcare/save` | ✅ 영구 보존 |
| 감정일기 (`app/gamjung/`) | `/api/gamjung/analyze` | ✅ 영구 보존 |
| 가계부 (`app/budget/`) | `/api/budget?userId=phone_XXXXX` | ✅ 영구 보존 |

- 저장 키 패턴: `phone_XXXXX` (전화번호 기반 userId)
- 잠금 만료 후: 새 글 작성 차단, 기존 글은 Firebase에 그대로 보존
- 재결제 시 기존 글 그대로 이어서 볼 수 있음

## share-coupon 쿠폰 신청 문구 (2026-07-17 확정)

```
⚠️ 공개 게시글만 · 1,000자 이상 · 사진 3장 이상 필수
기준에 맞는 게시글만 발급 · 1인 1회
기준에 맞는 좋은 후기 잘 부탁드려요 🙏
```

- "기준 미달 시 발급 불가" → 제거 (부정 표현 제거)
- "비방·광고성 내용 포함 시 영구 이용 제한" → 제거 (오히려 반발 유발)
- 앱 전체(꿈해몽·대운 포함) grep 확인 → `app/share-coupon/page.tsx` 단 1곳만 존재, 수정 완료
- 1인 1회 = 전화번호 기준 (`share_coupon_pending/${cleanPhone}` + `share_coupons/${cleanPhone}` 중복 체크)

## 관련 커밋

- `4ef5ee1` — Q&A/복냥이 24h 타임스탬프 제한, paidSession 허점 제거
- `3265629` — share-coupon 비방 문구 제거
- `78950d9` — "기준 미달 시 발급 불가" → "기준에 맞는 게시글만 발급" 변경
