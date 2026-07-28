---
name: feedback-diary-app-firebase-rule
description: 일기 형식 앱에만 자동복원+수동동기화 버튼 구현 — 일회성 앱(MBTI 등)은 해당 없음
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
  modified: 2026-07-26T01:48:49.157Z
---

일기 형식 앱(날마다 기록 쌓이는 앱)만 Firebase 자동복원 + ↻ 수동동기화 버튼 구현.

**해당되는 앱**: 감정일기, 다이어트, 가계부(예정), 습관(예정) — 날마다 기록이 쌓이는 앱
**해당 안 되는 앱**: MBTI, 행운번호, 궁합 등 일회성 결과지 앱

**구현 패턴 (2개 세트)**:
1. **자동복원**: init() 내 Toss Storage 비어있으면 Firebase에서 자동 fetch → 조용히 복원
2. **수동동기화**: 기록 탭/목록 상단에 "↻ 기록 동기화" 버튼 + `window.confirm()` 선행 (실수로 덮어쓰기 방지)

**완성 파일**:
- 감정일기: `jeomun-gamjung/src/App.tsx` (init auto-restore + ↻ confirm 버튼)
- 다이어트: `jeomun-diet/src/App.tsx` (init auto-restore 이미 있었음 + ↻ confirm 버튼 추가)

**Why:** 재설치 시 Toss Storage 초기화됨 → Firebase가 진짜 백업. 자동복원은 사용자 불편 없애고, 수동버튼은 기기 교체 등 예외 상황 대비.
**How to apply:** 새 일기형 앱 만들 때 동일 패턴 항상 적용. MBTI/궁합 등 일회성 앱에는 추가하지 말 것.
