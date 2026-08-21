---
name: bug-gunghap-zodiac-skip-to-result-2026-08-21
description: 궁합·별자리 이미 결제한 번호로 다시 해도 결제페이지부터 뜨던 버그 수정 (2026-08-21, commit 6ec425b)
metadata:
  type: project
---

**증상**: 궁합(gunghap)에서 이미 990원 결제한 번호(24시간 이내)로 다시 정보 입력해서 제출해도, 결과지로 바로 안 가고 매번 결제 페이지부터 떴음. "왼쪽위 돌아가기" 버튼을 눌러야만 그때서야 잠금해제된 결과지가 보임.

**원인**: `app/mbti/page.tsx`에는 제출 시 "24시간 내 결제한 번호면 결제 페이지 건너뛰고 바로 결과로" 체크(`alreadyUnlocked`)가 있었는데, `app/gunghap/page.tsx`와 `app/zodiac/page.tsx`에는 이 체크가 없어서 무조건 `/pay?id=...`로 보내고 있었음.

**확인 결과 (5개 유료 앱 전체 점검, [[project_5app_paid_conversion_2026_08_21]] 참고)**:
- MBTI: 이미 정상 (원래 체크 있었음)
- 궁합·별자리: 체크 없었음 → 이번에 추가 수정
- 펫운·타로: 애초에 제출 시 결제 페이지를 거치지 않고 바로 `/result/[id]`로 이동하는 구조라 이 버그 자체가 해당 없음 (결과지 안에서 잠금 여부 판단)

**수정**: `app/gunghap/page.tsx`, `app/zodiac/page.tsx`의 analyze() 제출 함수에 `{app}_unlock_until`/`{app}_unlock_phone` localStorage 체크 추가, 이미 유효하게 결제한 번호면 결제 페이지 대신 결과지로 바로 이동. commit `6ec425b`.

**Why**: 에스더님이 실제 재테스트 중 반복 재현 확인 후 요청 — "모든게 바로 결과지가야지 누가 돌아가기버튼을 누르겠어".

**How to apply**: 앞으로 새 유료 앱(mbti류) 만들 때 제출 함수에 이 alreadyUnlocked 체크를 처음부터 포함시킬 것. 패턴은 `app/mbti/page.tsx` 98~124줄 참고.
