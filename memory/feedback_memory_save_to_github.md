---
name: feedback-memory-save-to-github
description: memory 파일 저장은 항상 GitHub에 — 로컬만 저장하면 컴퓨터 용량 문제로 유실 위험
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
  modified: 2026-07-28T00:16:21.957Z
---

memory 파일을 저장하거나 수정할 때는 반드시 GitHub에도 커밋+푸시한다.

**Why:** 에스더님 컴퓨터 용량이 부족해서 파일이 지워질 수 있음. 로컬 `.claude/projects/memory/`에만 저장하면 컴퓨터에서 삭제 시 영구 유실됨. 2026-07-28에 발견, 그 전까지는 로컬에만 저장하고 있었음 — 큰일 날 뻔한 상황.

**How to apply:**
1. memory 파일 추가/수정 후 → 프로젝트 폴더 `memory/` 에도 동일하게 복사 또는 반영
2. `git add memory/ && git commit && git push` 까지 완료해야 저장 완료
3. "저장했다"는 말은 GitHub push 완료 후에만 할 것
4. 세션 끝날 때도 memory 변경사항 있으면 반드시 push
