---
name: project-deployment
description: "The saju app is now deployed live on Vercel with custom domain jeomun.com — changes require a git push to appear, not just a local edit."
metadata: 
  node_type: memory
  type: project
  originSessionId: d6bb98eb-4daf-4c77-a75e-aba80f62591e
---

The app was deployed to Vercel (project `repository-name-saju-app-atoms-copy-sajui-v2`, team "저문", Hobby/free plan) and connected to the custom domain `jeomun.com`, purchased at 가비아(Gabia). `www.jeomun.com` is also connected (CNAME) and redirects to the bare `jeomun.com`.

**Why this matters:** Before this, the user only ever viewed changes via `localhost` (instant hot-reload). Now that the site is live, any code change only becomes visible after: edit → build → git commit → git push → Vercel auto-deploys (~1-2 min) → user may also need a hard refresh (Ctrl+Shift+R) to bust browser cache. A local-only edit (not pushed) will show nothing different on jeomun.com, which has caused real confusion/frustration (see [[feedback_wait_for_explicit_go]]).

**How to apply:** When making visual/content tweaks now, always state explicitly whether the change has been pushed yet or is still local-only, so the user knows whether checking jeomun.com will show anything. When the user wants to rapidly iterate on many options (e.g. trying several images), clarify whether to push after every single change (so they can check live each time) or batch them — don't assume; this caused friction once already. Root domain `/` permanently redirects to `/main-v2` (old root homepage `app/page.tsx` was deleted for this reason — main-v2 is the one true current main page, partner main is separate at `/partner`).

Firebase Admin auth for production reads from env var `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON string) when set, falling back to the local `firebase-service-account.json` file for local dev (see `lib/firebase.ts`) — this fallback was added specifically to make Vercel deployment work since that file is gitignored.
