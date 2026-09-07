---
name: bug-vercel-primary-domain-www-redirect-reversed-2026-09-07
description: "Vercel Domains에서 jeomun.com이 www.jeomun.com으로 308리다이렉트되던 설정을 반대로 뒤집음(정식원인, DNS수정과는별개) — GSC 리디렉션 페이지 오류 잔여분 해소 목적"
metadata: 
  node_type: memory
  type: bug
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-09-07T13:26:52.699Z
---

## 문제
[[bug-dns-cname-fix-google-indexing-2026-08-28]]에서 DNS(Cloudflare A레코드→CNAME) 문제를 고쳤는데도 GSC "리디렉션이 포함된 페이지" 오류가 1,162개 남아있었음. 에스더님이 "저번에 버셀 다 고쳤잖아, 그때 제대로 안한거야?"라고 질문 — 확인해보니 **완전히 다른 별개의 설정 문제**였음.

## 원인
Vercel 프로젝트의 Domains 설정(`vercel.com/<team>/<project>/settings/domains`, 팀레벨 `~/domains`나 `~/settings`가 아님)에서:
- `jeomun.com` → "Redirect to Another Domain" (308) → `www.jeomun.com`으로 설정되어 있었음
- `www.jeomun.com` → "Connect to an environment" (Production)으로 직접 서빙되고 있었음

즉 **www가 실제 서빙 도메인, non-www(jeomun.com)이 리다이렉트 소스**였는데, 코드베이스 전체(`app/layout.tsx`의 `SITE_URL="https://jeomun.com"`, `metadataBase`, `canonical`, sitemap.xml 6,725개 URL 전부)는 **non-www(jeomun.com)이 canonical**이라고 가정하고 있어서 정반대로 꼬여있었음.

## 수정 (2026-09-07, Vercel 대시보드에서 직접, 에스더님이 스크린샷 보며 단계별 진행)
1. `jeomun.com`: "Redirect to Another Domain" → **"Connect to an environment" (Production)**으로 변경 — 직접 서빙하도록 전환
2. `www.jeomun.com`: "Connect to an environment" → **"Redirect to Another Domain"** → target `jeomun.com`으로 변경
3. 리다이렉트 타입 기본값이 **"307 Temporary"**였는데 **"308 Permanent"**로 반드시 변경(SEO상 임시리다이렉트는 canonical 통합신호가 약함) — 저장 전에 캐치해서 수정함
4. `curl -sIL`로 직접 검증 완료: `jeomun.com` → 200 OK 직접서빙, `www.jeomun.com` → 308 → `https://jeomun.com/`

**Why:** [[bug-dns-cname-fix-google-indexing-2026-08-28]]의 DNS 수정(Invalid Configuration→Valid Configuration)과 이 primary-domain 리다이렉트 방향은 Vercel Domains 안의 서로 다른 두 설정값이라 하나를 고쳤다고 다른 하나가 같이 고쳐지지 않음. 8/28엔 이 리다이렉트 방향 설정 자체를 건드린 적이 없었음 — "제대로 안 했다"가 아니라 "아예 다른 문제를 처음 발견한 것".
**How to apply:** 앞으로 "구글 리디렉션 오류/미색인" 얘기 나오면 (1) DNS Valid Configuration 여부 + (2) Domains에서 어느 도메인이 실제 서빙(Production)이고 어느 쪽이 Redirect인지, 리다이렉트 타입이 308인지 **둘 다** 확인할 것. GSC "revalidate"는 에스더님이 1-2일 뒤(전파 대기) 직접 클릭 예정 — 결과는 스크린샷으로 확인.
