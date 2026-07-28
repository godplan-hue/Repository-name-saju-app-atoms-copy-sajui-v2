---
name: project-whitelabel-partner-model
description: "Decided architecture for scaling partners — single app/DB/payment account with subdomain-based white-label branding, not per-partner app copies"
metadata: 
  node_type: memory
  type: project
  originSessionId: d6bb98eb-4daf-4c77-a75e-aba80f62591e
---

User decided (2026-06-24 session) to scale the partner program as a **white-label multi-tenant SaaS**, not by copying the app per partner.

**Decided structure:**
- One app, one database (Firebase), one payment account (Toss/Polar) — all owned/operated by the user (jeomun.com).
- Partners get a subdomain (e.g. `kim.jeomun.com`) where they can customize logo, business name (상호명), intro text — the underlying server/DB/AI/payment all stay shared and under the user's control.
- Partners explicitly do NOT get: app source, server access, DB access, their own payment account. This avoids losing control if a partner leaves, and avoids 1000x update/bugfix overhead.
- Plan: start with subdomain branding only (10–30 partners), validate, THEN later add support for partners connecting their own independent domain (e.g. `jumho.com`) pointing at the same backend.
- Payment screen / terms of service should disclose the actual operating business entity (e.g. "본 서비스는 [user's 사업자명]이 운영합니다") to preempt customer confusion and PG (Toss/Polar) questions about who the real operator is.
- Considered pricing model for partners (not yet finalized as official price, just discussed as an option): 가입비(one-time) + 월 사용료(monthly) + 매출쉐어(revenue share) — three-layer partner monetization, separate from the existing `lib/partnerTiers.ts` usage-discount tier system (실버/골드/다이아).

**Why:** User wants to scale to potentially 100s–1000s of partners ("수강생" — likely her own course students) without the legal/data-leak risk of giving away DB/admin access, and without the maintenance nightmare of 1000 separate app copies. [[feedback_no_question_popups]]

**How to apply:** When asked to build partner-facing features going forward, default to the subdomain-branding model (not app duplication). When discussing payment/PG questions, note that Toss/Polar approve the merchant (her), not each subdomain individually — but PG terms may have clauses about sub-merchant/전대 practices worth checking directly with Toss, not assumed risk-free. See also [[project_firebase_vs_supabase_decision]] and [[project_deployment]] for related infra context.
