---
name: project-firebase-vs-supabase-decision
description: Decided to stay on Firebase Realtime Database instead of migrating to Supabase before launch
metadata: 
  node_type: memory
  type: project
  originSessionId: d6bb98eb-4daf-4c77-a75e-aba80f62591e
---

Decision (2026-06-24): Keep Firebase Realtime Database. Do NOT migrate to Supabase before launch.

**Why this came up:** User worried that "회원 수십만 명, 동시접속 많아지면 Firebase가 버틸까?" (will Firebase hold up at hundreds of thousands of members / high concurrency). Investigated thoroughly:
- App uses Firebase Realtime Database only — no Firestore, no Firebase Auth (custom PBKDF2-SHA512+salt, 100k iterations — already secure, not plaintext), no Storage, no Functions.
- Result generation is template-based (no external AI API call, instant).
- Normal result viewing reads from sessionStorage only — does NOT touch Firebase at all. Firebase is only read when someone opens a *share link* (`/main-v2/share/[id]`).
- Estimated storage at 100k/500k/1M members: ~0.33GB/1.65GB/3.3GB → Blaze plan cost ~$0/$3.3/$11.5 per month (storage only).
- Estimated download/egress cost even at 100,000 share-link views/day stays within Firebase's free 10GB/month tier (~$0/month); only becomes non-trivial (~$7-8/month) around 200k+ views/day.
- Migration to Supabase would touch all 17 files that call Firebase (`db.ref`) — estimated 11-17 hours of focused work (schema design + per-file rewrite + full regression testing), regardless of how much data exists (effort scales with file count, not data volume, so "doing it now while data is small" has no advantage).

**How to apply:** If this topic resurfaces, the answer is settled — don't re-litigate. Stay on Firebase. Recommended sequence: finish Toss Payments integration → launch → grow real users → revisit DB choice only if/when real triggers appear (e.g., thousands of partners needing complex SQL-based 정산/통계, not concurrency/cost). See also [[project_no_real_payment_gateway]] and [[project_toss_payment_pending]] if those exist — Toss integration is the actual next priority, not infra migration.
