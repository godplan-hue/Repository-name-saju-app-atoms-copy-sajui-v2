---
name: bug-dns-cname-fix-google-indexing-2026-08-28
description: jeomun.com 구글 미색인 근본원인 = Cloudflare A레코드(프록시) vs Vercel CNAME(비프록시) 불일치 — DNS 수정으로 해결, 색인 66→1260개 증가 확인
metadata:
  type: bug
---

## 문제
jeomun.com·www.jeomun.com이 구글에 거의 색인되지 않음 (약 6900페이지 중 소수만). Vercel Domains에서 두 도메인 모두 "Invalid Configuration"으로 표시되고 있었음.

## 원인
Cloudflare DNS에 레거시 **A레코드**(216.198.79.65, 64.29.17.1, 216.198.79.1 등, 전부 프록시 활성화/주황구름)가 남아있었는데, Vercel은 현재 **CNAME 레코드**(`@`/`www` → `d7c9ffda2bc33ce7.vercel-dns-017.com`, 프록시 비활성화/회색구름=DNS전용)를 요구함. 이 불일치 때문에 Vercel이 "Invalid Configuration"으로 판정 → 구글이 크롤링 시 "리디렉션이 포함된 페이지"로 색인 거부.

## 수정 (2026-08-28, Cloudflare 대시보드에서 직접)
1. 기존 A레코드 4개 삭제 (jeomun.com→216.198.79.65/64.29.17.1, www.jeomun.com→64.29.17.1/216.198.79.1)
2. CNAME 2개 추가: `@`→`d7c9ffda2bc33ce7.vercel-dns-017.com` (DNS전용), `www`→동일 타겟 (DNS전용)
3. MX/CAA/TXT/`_domainconnect` 레코드는 무관하므로 건드리지 않음
4. Vercel Domains 양쪽 다 즉시 "Valid Configuration"으로 전환 확인

## GSC 후속 조치
- 도메인 속성(`jeomun.com`, URL프리픽스 아님)으로 전환해서 확인해야 www 서브도메인도 검사 가능
- URL Inspection의 "다시 요청"은 **URL 1개씩만** 재크롤링 큐에 넣는 기능 (전체 재신청 아님)
- **6,900개 페이지 전체를 한번에 재신청하려면 → Sitemaps 페이지에서 이미 등록된 `sitemap.xml`을 "제출" 버튼 다시 누르면 됨.** 사이트맵 재제출 = 그 안의 모든 URL을 구글에 재크롤링 요청하는 효과.
- 에스더님이 이 사이트맵 재제출 버튼을 직접 찾아서(1시간 소요) 눌렀고, 그 결과로 색인이 66→1,260개로 늘어남 — **이 버튼을 처음부터 명확히 안내하지 못한 게 원인**, [[feedback_gsc_bulk_action_must_be_named_explicitly_2026_09_01]] 참고

## 결과 확인 (2026-08-31/09-01, 사이트맵 재제출 후 3일)
- 색인생성됨 페이지: 66개 → **1,260개**로 증가 확인
- "리디렉션이 포함된 페이지" 사유: 1,162개 남음 (계속 감소 예상)
- "발견됨 - 현재 색인이 생성되지 않음": 5,469개 — **별개 원인** (크롤 우선순위/콘텐츠 유사도 문제로 추정, DNS 수정으로 해결 안 됨)
- 구글에 "점운" 검색 시 (2026-09-01 기준): 카카오톡채널·Nomad Coders 글은 뜨지만 **jeomun.com 자체는 아직 검색결과에 안 뜸** — 색인과 브랜드검색 노출은 별개, 추가로 며칠~2주 더 소요 예상. `site:jeomun.com`으로 색인 현황 직접 확인 가능

**Why:** Vercel 온보딩 방식이 A레코드→CNAME으로 바뀌었는데 기존 Cloudflare 설정이 마이그레이션 안 된 채 남아있었던 것으로 추정. 이게 몇 달간 구글 미색인의 실질적 근본원인이었음.

**How to apply:** 향후 "구글에 사이트가 안 뜬다"는 문제가 재발하면 먼저 Vercel Domains 페이지에서 Valid/Invalid Configuration부터 확인할 것. 색인 안 되는 페이지가 여전히 많다면 사유를 구분해서 볼 것 — "리디렉션" 계열은 이 DNS 문제, "발견됨-색인안됨"은 콘텐츠/크롤예산 문제로 별도 접근 필요 (템플릿 SEO 랜딩페이지 352개+ 유사도 이슈 가능성, [[project_docs_plan]] 참고).
