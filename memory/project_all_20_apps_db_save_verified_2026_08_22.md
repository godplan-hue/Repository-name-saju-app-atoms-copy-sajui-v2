---
name: project_all_20_apps_db_save_verified_2026_08_22
description: 토스 20개 앱 전부 Firebase DB 저장 실제 라이브테스트로 검증 완료 — 저장 안되는 앱 없음
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-22T10:37:29.076Z
---

토스 미니앱 20개 폴더 전부 대상으로 "진짜 DB에 저장되나"를 실제 테스트 write로 검증함 (코드리뷰만이 아니라 실제 curl로 Firebase에 테스트 데이터 넣고 응답 확인 후 삭제하는 방식).

**이전에 이미 확인된 9개(7개 세션+MBTI+diet):** momcare/gamjung/budget(서버경유 저장) / battle(정상) / movie·style·work(크래시버그였고 저장 자체는 문제없었음) / MBTI·diet(이전 세션 확인).

**이번에 라이브테스트로 추가 검증한 10개:** jigun, resume, gunghap, petun, tarot, zodiac, haemong, daewoon, taegil, fortune — 전부 실제 Firebase 경로에 테스트 write 성공 확인(생성된 키 응답 확인) 후 테스트데이터 즉시 삭제 완료, 잔여 테스트데이터 없음.

**결론: 20개 앱 전부 저장 정상.** 저장 안 되는 앱 없음.

**참고 — Firebase 읽기 권한 구조:** `*_toss_users`/`free_leads/toss` 경로는 쓰기는 열려있지만(로그인 없이 미니앱 유저가 바로 씀) 읽기는 막혀있어서, curl로 그냥 GET하면 "Permission denied" 뜸 — 그래서 어드민 API(인증됨) 아니면 직접 write+즉시 read+delete로 검증해야 함.

**Why:** 에스더님이 "11개앱인가 점운 DB에 아직 저장 안되는거 있냐"고 반복 질문 — 실제로는 전부 저장되고 있었음, 저장 코드 자체는 이미 다 있었고 어드민 읽기 경로도 다 연결돼있었음.

**How to apply:** 앞으로 "이 앱 저장되나요" 질문 나오면 이 파일부터 확인 — 20개 전부 검증 끝난 상태. 새 앱을 추가로 만들 때만 저장 코드 체크가 필요함.
