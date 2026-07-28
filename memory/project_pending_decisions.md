---
name: project-pending-decisions
description: 결정됐지만 아직 구현 안 된 기능 목록 (2026-07-14 오전 세션 복원) — 새 세션 시작 시 반드시 읽을 것
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

# 결정됐지만 미구현 항목 (2026-07-14 오전 세션 복원)

> 에스더님과 결정했으나 아직 코드로 구현 안 된 것들.
> 새 세션 시작 시 이 파일 먼저 읽고, 에스더님께 현황 보고할 것.

---

## 1. 전화번호로 잠금 해제 상태 Firebase 저장 ⭐ 최우선

**결정 내용**: 현재 `localStorage`에만 저장되는 잠금 해제 상태를
전화번호 키로 Firebase에도 저장 → 다른 브라우저/기기에서 열어도 유료 결제 내용 유지

**Firebase 구조**:
```
users/{cleanPhone}/
  haemong_until: timestamp
  momcare_until: timestamp
  jigun_until:   timestamp  (나중에)
  resume_until:  timestamp  (나중에)
```

**흐름**:
1. 결제 완료 → localStorage 저장 + Firebase `users/{phone}/` 동시 저장
2. 앱 로드 → localStorage 확인 (빠름)
3. localStorage 없거나 만료 → "이전에 결제하셨나요? 전화번호 입력" → DB 조회 → 복원

**수정 파일**: `app/main-v2/pay/page.tsx`, `app/api/unlock/route.ts` (신규), 각 앱 잠금 확인 로직

**상태**: ❌ 미구현

---

## 2. 직운·합격자소서 잠금 방식 변경 (24시간 → 1회 영구)

**상태**: ✅ 완료 (commit dc4c2f6, 2026-07-14)
- jigun/pay: localStorage 제거, Firebase PATCH `/api/career/analyze`
- resume/pay: localStorage 제거, Firebase PATCH `/api/resume/analyze`
- jigun/result: `?paid=1` OR Firebase `paid===true` 중 하나면 열림
- resume/result: 동일

---

## 3. 어드민 쿠폰 "전체 앱 열기" 체크박스 추가

**상태**: ✅ 완료 (commit dc4c2f6, 2026-07-14)
- admin/discount-codes: fullAccess 체크박스 ✓
- api/promo-codes: POST fullAccess 저장, PATCH fullAccess 반환 ✓
- main-v2/pay: couponFullAccess 처리, payFree+pay에서 4개 앱 unlock ✓

---

## 4. 전화번호 필수 하드블록

**상태**: ✅ 완료 (commit dc4c2f6, 2026-07-14)
- jigun/page.tsx: 전화번호 ★ 필수사항, 없으면 제출 차단
- resume/start/page.tsx: 전화번호 ★ 필수사항, 없으면 제출 차단
- FreeForm.tsx: 이름 선택사항으로 변경, 전화번호만 필수
- free-lead API: name 없어도 저장 가능 (phone만 필수)
- momcare baby-diary/time-capsule/baby-words: !hasPhone 시 경고 배너

---

## 5. 꼭 읽어보세요 C항목 (Firebase 완성 후)

**결정 내용**: 결과지 모달(PC+모바일) + 공유 페이지 모달에 추가
"브라우저를 바꾸거나 쿠키를 지우면 결과가 사라질 수 있어요.
전화번호를 꼭 입력하세요 — 전화번호가 있어야 복원돼요."

**Why**: Firebase 전화번호 시스템 완성 전에 넣으면 안 되는 기능 약속하는 꼴

**상태**: ❌ 미구현 (Firebase 시스템 #1 완성 후 추가)

---

## 6. 공유 페이지 모달 업데이트

**결정 내용**: `app/main-v2/share/` 페이지 모달도 결과지 모달과 동일하게
인앱브라우저 경고 + 전화번호 안내 추가

**상태**: ❌ 미구현

---

## 7. 쿠폰 "미사용" 표시 버그

**결정 내용**: `/free` 페이지에서 쿠폰 사용 후 `free_leads/{phone}.used`가 `true`로 안 바뀜
→ 어드민에서 항상 "미사용"으로 표시됨

**상태**: ❌ 미구현

---

## 8. Vercel Pro 전환

**결정 내용**: 현재 Hobby 플랜 (상업적 사용 약관 위반) → Pro $20/월 ≈ ₩28,000 전환 필요

**시기**: 카카오페이 연동 + 실제 결제 오픈 시점에 전환

**상태**: ❌ 미구현 (타이밍 대기)

---

## 잠금 기간 최종 확정표 (2026-07-14 오전 의논 결과)

| 앱/기능 | 기간 | Firebase 필드 | 트리거 |
|---|---|---|---|
| 꿈해몽 | 24시간 | `haemong_until` | 사주 990원 결제 시 |
| 복냥이 상담 | 24시간 | `v2_paid=1`이면 자동 | 사주 결제 시 |
| Q&A 360개 | 24시간 | `v2_paid=1`이면 자동 | 사주 결제 시 |
| 직운 | **1회 영구** | 결과 ID `paid:true` | 직운 전용 결제 시 |
| 합격자소서 | **1회 영구** | 결과 ID `paid:true` | 합격 전용 결제 시 |
| 맘케어 일기 | 30일 | `momcare_until` | 사주 990원 결제 시 |
| MBTI/행운번호/펫운/궁합 | 평생 무료 | 없음 | 바이럴 도구 |
| 감정일기 | 30일 | `mood_until` | 나중에 추가 |
| 다이어트 칼로리 | 30일 | `diet_until` | 나중에 추가 |

---

## 완료된 것 (2026-07-14 기준)

| 작업 | 커밋 |
|---|---|
| 이름 자동입력 전앱 추가 | 81c0d53 |
| career API 익명→빈값 | 81c0d53 |
| 가계부 재방문 이름 재저장 방지 | 81c0d53 |
| 재물운무료 5개운세 버그(sessionStorage→localStorage) | 0fcbb8e |
| FreeForm 이름 자동입력 | 0fcbb8e |
| 전체삭제 12경로 | 0fcbb8e |
| 가계부 DB재저장 1회 제한 | 7569185 |
| PC 결과지 ← 버튼 강화 | 7569185 |
| PC/모바일 모달 전화번호 안내 추가 | 7569185 |
| 카카오채널 스마트채팅 키워드 자동응답 3개 등록 | 수동작업 |
