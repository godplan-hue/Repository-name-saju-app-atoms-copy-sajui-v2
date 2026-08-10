---
name: project-18app-upgrade-plan
description: 18개 앱 토스 수준 업그레이드 전체 계획 — 절대 잃어버리지 말 것
metadata:
  type: project
---

# 18개 앱 업그레이드 마스터 플랜 (2026-08-10 확정)

**Why:** 토스 미니앱에 올리면서 결과지 길이·기능이 토스 버전에 맞게 업그레이드됐는데, jeomun.com 웹앱은 예전 버전 그대로라 동기화 필요  
**How to apply:** 앱 하나씩 순서대로. 수정 후 반드시 커밋+푸시. 에러 없이 안전하게.

---

## ✅ 전체 완료 (2026-08-10)

### 7개 전면 업그레이드 — 전부 완료
| 앱 | 상태 | 비고 |
|---|---|---|
| 사주 (main-v2) | ✅ 건들지 말 것 | |
| 꿈해몽 (haemong) | ✅ 건들지 말 것 | |
| 별자리 (zodiac) | ✅ commit c8581ac | 24h lock + pay page |
| 펫운 (petun) | ✅ commit a9f42ec | 24h lock + pay page 신규 |
| 궁합 (gunghap) | ✅ 이미 완성 | |
| MBTI (mbti) | ✅ commit 05a740d | |
| 타로 (tarot) | ✅ 이미 완성 | |

### 11개 기능 추가 — 전부 완료
- 오늘 몇 명 기능: 전 앱 완료
- 탈잉 1위 내 소개: 전 앱 완료
- 카카오페이: 전 결제 페이지 완료

### 직운 (jigun) — 추가 수정
- commit 3dd59b4: Firebase permanent → 24h localStorage 전환
- commit adf40af: 결제 안내 문구 "영구" → "24시간"

---

## 확정 결정사항

| 항목 | 결정 |
|------|------|
| 유료 잠금 방식 | 처음부터 완전 잠금 (부분 미리보기 없애기) |
| 결제 후 유지 | 24시간 유지 |
| 오늘 몇 명 기능 | 18개 전체 앱에 추가 (아침/점심/저녁 3번 숫자 변경) |
| 내 소개 | 탈잉 1위 추가/수정 |
| 결제창 | 카카오페이 전부 연결 완료 |

---

## localStorage 잠금 키 정리

| 앱 | 키 |
|---|---|
| 별자리 | `zodiac_unlock_until` |
| 펫운 | `petun_unlock_until` |
| 궁합 | `gunghap_unlock_until` |
| MBTI | `mbti_unlock_until` |
| 타로 | `tarot_unlock_until` |
| 직운 | `jigun_unlock_until` |
| 꿈해몽 | `haemong_unlock_until` |
