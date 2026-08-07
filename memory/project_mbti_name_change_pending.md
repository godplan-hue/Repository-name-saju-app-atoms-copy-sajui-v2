---
name: project-mbti-name-change-pending
description: MBTI 앱 이름 변경 후 코드 수정 대기 목록 (승인 오면 바로 처리)
metadata:
  type: project
---

## MBTI 앱 이름 변경 현황
- 변경 전: "MBTI 점운"
- 변경 후: "나의 성격유형 MBTI"
- 상태: 토스 심사 중 (영업일 2일 내 이메일 통보)
- appName: jeomun-mbti (그대로 유지)

## 승인 후 반드시 해야 할 수정 (지금 하지 말 것)

**Why:** 이름 변경 승인 전에 수정하면 심사 충돌 발생, 빌드도 다시 해야 함

### 1. jeomun-mbti/src/App.tsx 756번 줄
```
변경 전: 🔮 MBTI 점운 | 토스에서 'MBTI 점운' 검색
변경 후: 🔮 나의 성격유형 MBTI | 토스에서 '나의 성격유형 MBTI' 검색
```

### 2. 16개 앱 크로스프로모 CROSS 배열
- 모든 앱의 CROSS 배열에서 `name: "MBTI 점운"` → `name: "나의 성격유형 MBTI"` 변경
- 변경 후 17개 앱 전체 빌드 필요

**How to apply:** MBTI 이름 변경 승인 이메일 오면 즉시 위 2가지 수정 후 전체 빌드
