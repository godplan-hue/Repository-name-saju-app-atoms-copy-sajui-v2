---
name: project-gamjung-crosspromo-banner-fix-2026-08-21
description: "감정일기(gamjung) 16개앱소개 '매일 쓰는 가계부' 줄바꿈 버그 수정 + 배너 점선 옅게 조정 (2026-08-21, commit e71cad2)"
metadata: 
  node_type: memory
  type: project
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-21T13:06:04.156Z
---

**수정 1 — CROSS_PROMO 줄바꿈 버그**: 16개앱 소개 그리드(4열, 9px폰트, wordBreak:"break-word")에서 "매일 쓰는 가계부" 이름이 "부"만 혼자 다음줄로 떨어지는 문제. `jeomun-gamjung/src/App.tsx` CROSS_PROMO 배열에서 `"매일 쓰는 가계부"` → `"매일 쓰는\n가계부"`로 수동 줄바꿈 (기존 "이상형월드컵\n점운" 등과 같은 패턴).

**동일 버그가 다른 앱에도 있음 — 손대지 않기로 함**: grep으로 확인한 결과 mbti·momcare·diet·budget·tarot·taegil·saju·fortune·daewoon·battle·jigun·work·style·movie·zodiac·petun·haemong 등 약 20개 앱에 동일 문자열/버그가 존재. 에스더님이 "이미그건다올렷어 아까보기엔안보엿는데 올린건그냥둘게"라며 명시적으로 그대로 두라고 함 — **재요청 없으면 절대 다시 손대지 말 것**.

**수정 2 — 광고 배너 점선 옅게**: 결과지 등에서 배너 placeholder(`gamjung-banner`, `gamjung-banner-top`, dashed border)가 "너무 많이 보인다"는 피드백으로 opacity 낮춤. border 0.25→0.14, background 0.08→0.04 (변형A), border 0.12→0.07, background 0.04→0.02 (변형B). 8곳 전부 수정, 무관한 초록테두리 UI(815·907줄)는 건드리지 않음.

**Why**: 배너 자체는 이전 "투명해서 안보이던 버그"(`bug_diet_bottom_banner_hidden_by_tabbar_2026_08_21.md` 등 참고) 이후 일부러 눈에 띄게 만든 것 — 완전히 안 보이게 하면 안 됨. 이번엔 "너무 많이 보인다"는 반대 피드백이라 옅게만 조정, 0으로 만들지 않음.

**How to apply**: `.ait` 빌드 완료(deploymentId `01a0246c-c613-782b-a1c9-1970a5ce7066`), commit `e71cad2`, `jeomun-gamjung` 저장소에 push 완료. **토스 콘솔(apps-in-toss.toss.im) 재업로드 필요** — 아직 안 했으면 다음 세션에서 확인할 것.
