---
name: project-toss-landing-method
description: "토스 전용 SEO 랜딩페이지 제작 방법 — guide(점운사이트)/toss(토스앱) 이중 구조, 앱별 적용법"
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
  modified: 2026-08-08T22:47:20.637Z
---

# 토스 랜딩페이지 제작 방법 (2026-08-09 확정)

## 전체 구조 (앱당 300개 페이지)

| 페이지 종류 | 경로 | CTA 목적지 | 대상 |
|---|---|---|---|
| guide (점운) | `/[앱]/guide/[slug]` | jeomun.com | PC + 모바일 |
| toss (토스앱) | `/[앱]/toss/[slug]` | `minion.toss.im/[ID]` | 모바일 (토스앱) |

- 각 앱당 150개 guide + 150개 toss = **총 300개 SEO 랜딩**
- PC에서는 toss 링크가 안 열리므로, PC 유저는 guide 페이지(jeomun.com)로 자연스럽게 유입
- 모바일 유저는 toss 페이지에서 토스앱으로 직접 연결

## 현재 완성된 앱 (2026-08-09)

| 앱 | guide 경로 | toss 경로 | 토스앱 ID | 토스앱 링크 |
|---|---|---|---|---|
| 다이어트 | `/diet/guide/[slug]` | `/diet/toss/[slug]` | `5ARnY9gB` | `https://minion.toss.im/5ARnY9gB` |
| MBTI | `/mbti/guide/[slug]` | `/mbti/toss/[slug]` | `pht8Fcyp` | `https://minion.toss.im/pht8Fcyp` |
| 맘케어(육아일기) | `/momcare/guide/[slug]` | `/momcare/toss/[slug]` | `npN9k0Ni` | `https://minion.toss.im/npN9k0Ni` |

각 항목 수:
- diet/guide: 151개, diet/toss: 151개
- mbti/guide: 150개, mbti/toss: 114개
- momcare/guide: 145개, momcare/toss: 145개

## toss 페이지 구조 (필수 요소)

```tsx
// app/[앱]/toss/[slug]/page.tsx

const DATA: Entry[] = [
  { slug:"...", title:"[키워드] 토스앱 | 점운 [앱명]", desc:"...", h1:"...", sub:"...", emoji:"..." },
  // 150개
];

export async function generateStaticParams() { ... }
export async function generateMetadata() { ... }

// UI 요소
// 1. 이모지 + h1 (그라디언트 텍스트)
// 2. sub 설명
// 3. 토스 CTA 버튼 — 모든 기기에서 표시 (모바일 전용 아님)
//    <a href="https://minion.toss.im/[ID]" target="_blank">토스에서 바로 이용 ↗</a>
// 4. 2×2 기능 그리드
// 5. 하단 카드 + 두번째 토스 버튼
// 6. 하단 링크: ← 앱 홈 | 웹에서 보기 | 사주 보기
```

## guide 페이지 구조 (점운.com 연결)

```tsx
// app/[앱]/guide/[slug]/page.tsx
// CTA: <Link href="/[앱]">무료 [앱명] →</Link>
// 모바일에서 토스 버튼 별도 표시 (선택)
```

## 배경색 테마 (앱별)

| 앱 | 배경 그라디언트 | 강조색 |
|---|---|---|
| 다이어트 | `#1a2a0a → #2a4a1a` (다크 그린) | `#4ade80` |
| MBTI | `#0f0030 → #1e0060` (다크 퍼플) | `#a78bfa` |
| 맘케어 | `#2a0020 → #4a1040` (다크 핑크) | `#f9a8d4` |

## 사이트맵 추가 방법

```bash
# 1. 각 페이지에서 slug 목록 추출
grep -o 'slug:"[^"]*"' app/[앱]/toss/\[slug\]/page.tsx | sed 's/slug:"//' | sed 's/"//'

# 2. sitemap.xml 끝 </urlset> 앞에 삽입
# <url><loc>https://jeomun.com/[앱]/toss/[slug]</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
```

## 다음 앱 제작할 때 순서

1. 기존 `guide/[slug]/page.tsx`에서 DATA 배열 복사
2. `toss/[slug]/page.tsx` 새로 생성 (토스 링크, 앱 테마 색으로)
3. title에 "토스앱" 키워드 추가 (예: "MBTI 테스트 토스앱 | 점운 MBTI")
4. `sitemap.xml`에 toss URL 추가
5. 커밋 + 푸시 → 구글 서치콘솔 사이트맵 재제출

## 나중에 만들 앱들 (동일 방식 적용 예정)

- 꿈해몽 (`/haemong/toss/[slug]`) — 토스앱 ID 확인 필요
- 궁합 (`/gunghap/toss/[slug]`)
- 직운 (`/jigun/toss/[slug]`)
- 합격자소서 (`/resume/toss/[slug]`)

**Why:** 토스 미니앱은 PC에서 못 열리므로, SEO 랜딩 → guide(점운)/toss(토스) 이중 구조로 PC/모바일 트래픽 모두 커버
**How to apply:** 새 앱 토스 출시할 때마다 이 방식으로 toss/[slug] 150개 + sitemap 추가
