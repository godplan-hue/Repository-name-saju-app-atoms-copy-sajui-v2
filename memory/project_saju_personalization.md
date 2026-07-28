---
name: project-saju-personalization
description: "Architecture of saju result-text personalization in app/api/v2/analyze/route.ts, what's fixed and what's still pending"
metadata: 
  node_type: memory
  type: project
  originSessionId: d6bb98eb-4daf-4c77-a75e-aba80f62591e
---

**Why this matters:** User repeatedly complained about duplicate/same-feeling text across different saju categories and across different users. Refuses to use a real AI API (callHaiku exists in the file but is unused — too slow/costly per her). All personalization must stay template-based ($0 cost, instant).

**What's done (as of 2026-06-24):**
- `getPersonalProfile(y, m, gender, seed)` in `app/api/v2/analyze/route.ts` — generates a "나의 사주 개인 특성" block from zodiac(띠)×오행×season (~240 base combos), now also varies one closing line by a seed derived from name+year+month so even people sharing the same zodiac/오행/season don't get byte-identical text.
- Wired into all 6 select-tier (990원) categories inside `getGenericPaidTemplate`: 오늘의 운세(newly split out — previously silently reused the "총운" template verbatim, which was the single biggest duplication bug), 재물운, 연애운, 건강운, 성공운, 총운.
- `ohangTraits` enriched with concrete career examples and "기운이 과할 때" warnings, referencing 점신(원현우) 명리학 자료 the user provided (유통업=수, 교육·의료=목, 언론·방송·연예=화, 귀금속·철강·기계=금).
- Package tier (9,900원+, `getPackageTemplate`) and its 올해운세/월별운세/궁합운 restructuring were already done in an earlier session — confirmed still present and correctly differentiated (quarterly 대운 vs monthly action-codes vs real 오행 상생상극 compatibility).

**Known dead code (do not assume it runs):** `getPaidTemplate`'s special-cased branches for "올해 운세"/"전체 사주분석"/"이름분석" (lines ~479-558) are unreachable from the current select-tier UI (`ALL_SCORE_CATS` in `app/main-v2/result/page.tsx` only ever requests 오늘의운세/재물운/연애운/건강운/성공운/총운). Don't waste time editing those branches expecting it to affect live behavior.

**Calendar engine progress (started 2026-06-24, near top of `app/api/v2/analyze/route.ts`, functions `getYearPillar`/`getDayPillar`):**
- DONE: 연주 now uses 입춘 cutoff (Jan 1 – Feb 3 births get previous year's pillar) instead of plain calendar year.
- DONE: 일주 calculated precisely via verified epoch 1900-01-31 = 갑자일 (confirmed via web search, not guessed) — day-count mod 60, no lookup table needed. Wired into `getPersonalProfile`'s new "일주" section for BOTH select(990원) and package(9,900원+) tiers, threaded through `getPaidTemplate`→`getGenericPaidTemplate` and `getPackageTemplate` (both now extract `d` from birth string and pass it down).
- DONE: 월주 via `getMonthPillar` — uses 절기 average boundary dates (입춘2/4, 경칩3/5~6, 청명4/5, 입하5/5~6, 망종6/5~6, 소서7/7, 입추8/7~8, 백로9/7~8, 한로10/8, 입동11/7~8, 대설12/7, 소한1/5~6 — ±1 day/year drift, not exact astronomical calc) plus the 오호건원(五虎遁元) month-stem formula `(yearGanIdx*2+2)%10` for 인월's stem, then +1 per month. Verified against a published reference table (갑/기년→병인묘무진..., etc.) with a standalone test script before committing — all cases matched exactly.
- DONE (2026-06-24, same day): 시주 via `getHourPillar(dayGan, birthHour)` — uses 둔시법 formula `(dayGanIdx*2)%10` for 자시's stem (verified against search: 갑/기일→갑자시, 을/경일→병자시, 병/신일→무자시, 정/임일→경자시, 무/계일→임자시), +1 per 시 step. `birthHour` ("00"~"11", "unknown") threaded all the way from the POST handler through `getPaidTemplate`/`getPackageTemplate`/`getGenericPaidTemplate` into `getPersonalProfile`; gracefully omits the 시주 block when hour is "unknown"/missing.
- **All 4 pillars (연/월/일/시) complete and wired into both tiers.**
- DONE: 십성(十星) via `getTenGod(dayGan, otherGan)` — standard 음양오행 생극 비교(verified via search: 비견/겁재=same element, 식신/상관=element I generate, 편인/정인=element that generates me, 편재/정재=element I overcome, 편관/정관=element that overcomes me; 편 vs 정 split by matching/differing yin-yang). Shows 연간/월간/시간's 십성 relative to 일간 (day stem = "me").
- Bug fixed same day: 월주/시주 were showing only a generic "what this pillar means" sentence with no personalized trait — now reuse the same `dayGanDesc` lookup used for 일주, applied to 월간/시간 too. This fix lives in the single shared `getPersonalProfile` function so it auto-applies to all categories/tiers — no need to touch each category separately.
- NOT done: 십이운성(Twelve Stages), 십이신살(Twelve Spirits) — not started.
- NOT done: category-by-category duplication AUDIT (user wants someone to actually read through 재물운/연애운/건강운/etc.'s main bodies — not just the personalProfile add-on — and confirm/fix cross-category sameness). User believes this was "already done" in an earlier session but is no longer confident it's actually sufficient; treat as unverified until someone reads the bodies side by side.
- NOT done: 택일(date-selection) feature.
- Caught one real bug while writing 월주 text: referenced `${name}` inside `getPersonalProfile` which has no `name` parameter — would have silently resolved to the global `name` (empty string in Node) instead of erroring. Fixed before commit. Lesson: double-check every interpolated variable actually exists in the enclosing function's params when adding new text blocks here.
- 택일(date-selection) feature — requested same day, likely needs the same calendar infrastructure as above. Not started.
- `app/saju-info/page.tsx` exists in the repo (음양오행/십성 설명 탭) but is orphaned — no other page links to it, and its content has real quality problems (garbled/duplicate text, e.g. "최강자지" tab title, nonsense 상생 description) that need rewriting before it's presentable, let alone linking it into nav.

**How to apply:** If the user asks to continue the "personalization"/"중복 글" work, read this file first — don't re-discover the dead-code trap or re-litigate API vs template (template-only is settled). If asked about the calendar engine or 택일, treat as a separate large project requiring careful data-accuracy planning, not a same-day task.
