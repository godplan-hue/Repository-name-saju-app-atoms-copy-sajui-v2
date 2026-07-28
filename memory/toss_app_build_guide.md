---
name: toss-app-build-guide
description: "⭐⭐⭐ 토스 미니앱 빌드 완전 가이드 — 새 앱 만들기 전 반드시 읽고, 항상 에스더님께 먼저 확인 후 진행"
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
  modified: 2026-07-26T03:02:58.977Z
---

# 토스 미니앱 빌드 완전 가이드

> **⛔ 핵심 원칙**: 새 앱 만들기 전 반드시 이 파일 전체를 읽고,  
> **계획을 먼저 에스더님께 설명 → "이렇게 만들면 될까요?" 확인 후 코딩 시작**  
> 절대로 혼자 판단해서 먼저 짜지 않는다.

---

## 1. 토스 앱인토스 시장 현황 (2026-07-24 기준)

| 항목 | 내용 |
|---|---|
| 정식 출시 | 2025년 7월 |
| 2025년 10월 | 200개 미니앱 돌파 (출시 100일) |
| 2026년 2월 | 1,000개 돌파 |
| 2026년 4월 | 2,000개 돌파 |
| 현재 | 계속 증가 중 (정확한 수치 미공개) |
| 이용자 | 3천만 명 이상 |

### 카테고리별 매출 추정 (업계 추정, 공식 미공개)
| 등급 | 예상 월 매출 |
|---|---|
| 상위권 쇼핑·금융 | 수천만~수억 원 |
| 상위권 운세·생산성·생활 | 수백만~수천만 원 |
| 중위권 | 수십만~수백만 원 |
| 하위권 | 거의 없음 |

> **운세 카테고리**: 결제 전환율이 높아 사용자 수가 많지 않아도 매출이 나오는 분야  
> **990원 저가 전략**: 구매 장벽이 낮아 전환율에 유리 — 토스 환경에 최적

---

## 2. ⛔ 앱 이름 절대 원칙

**형식: [키워드] 점운** (키워드 먼저, 점운 나중)

- ✅ 올바름: "MBTI 점운", "다이어트 점운", "궁합 점운", "감정일기 점운"
- ❌ 잘못됨: "점운 MBTI", "점운 다이어트"

**이유**: 토스 검색에서 키워드가 앞에 있어야 상단 노출됨

---

## 2-1. ⛔ 상세 설명 작성 원칙 (앱 제출 시 반드시 적용)

**이모지 절대 금지** — ✔ ✅ 🔥 등 일체 사용 금지. 순수 텍스트 + 하이픈(-)만 사용.
**이유**: 에스더님이 설명의 ✔ 를 이미지에 넣어야 하는 줄 알고 이미지 50번 다시 만든 사건 발생(2026-07-26)

**작성 형식 (모든 앱 동일)**:
```
[앱 한 줄 설명 — 핵심 키워드 포함]

[기능 설명 1~2문장]

- [키워드1] / [키워드2]
- [키워드3] / [키워드4]
- [키워드5] / [키워드6]
- [키워드7] / [키워드8]
```

**키워드 전략**:
- 사람들이 검색할 단어를 그대로 넣기 (예: "MBTI 테스트", "칼로리 계산기", "다이어트 식단")
- 앱 이름 키워드 + 유사 키워드 + 기능 키워드 조합
- 새 앱 만들 때 빌드 계획과 함께 설명 초안도 같이 드릴 것

## 3. 새 앱 만들기 전 에스더님께 확인할 것 (무조건 먼저 물어보기)

새 앱 요청이 오면 코딩하기 전에 이 내용을 정리해서 먼저 보고:

```
📋 [앱 이름] 빌드 계획입니다. 확인해주세요!

1. 앱 이름: [키워드] 점운 형식
2. 무료 기능: [목록]
3. 유료 잠금 기능 (990원): [목록]
4. 잠금 방식: 공유 → 24h 해제 / 광고시청 → 24h / 결제 → 30일
5. 폼 수집 항목: 이름(선택), 전화번호(필수), 생년도(필요 여부)
6. 오행 계산 필요 여부
7. Firebase 저장 경로: free_leads/toss (source: "toss-[앱명]")
8. 어드민 탭 추가 여부

이렇게 만들면 될까요? ✅
```

---

## 4. 모든 앱에 반드시 들어가야 하는 것 (체크리스트)

### 4-1. 폼 필수 항목
- [ ] 이름 → **"이름 (선택)"** 라벨
- [ ] 전화번호 → **"전화번호 ★ 필수"** 라벨
- [ ] `[필수]` 개인정보 수집·이용 동의 체크박스
- [ ] `[선택]` 마케팅 수신 동의 체크박스 (별도 분리)

### 4-2. 가짜 번호 차단 (반드시 추가)
```typescript
const cleanPhone = phone.replace(/\D/g, "");
if (cleanPhone.length < 10) { setFormError("전화번호를 입력해주세요."); return; }
const body2 = cleanPhone.slice(3);
if (body2.length >= 6 && new Set(body2.split("")).size <= 1) {
  setFormError("올바른 전화번호를 입력해주세요."); return;
}
```

### 4-3. Firebase 저장 (반드시 agreed: true 포함)
```typescript
fetch("https://saju-app-atoms-default-rtdb.firebaseio.com/free_leads/toss.json", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: name || "익명",
    phone: cleanPhone,
    agreed: true,          // ← 반드시 포함
    marketing,
    source: "toss-[앱명]", // ← 앱마다 다르게
    createdAt: Date.now(),
  }),
}).catch(() => {});
```

### 4-4. 공유 버튼 ⛔ 반드시 tossShare 사용 (2026-07-24 확정)
```typescript
import { share as tossShare, getTossShareLink } from "@apps-in-toss/web-framework";

// ✅ 올바른 방법 — 토스 네이티브 공유 API
async function shareToUnlock() {
  const link = await getTossShareLink("intoss://앱이름").catch(() => "");
  const text = `공유 텍스트${link ? `\n${link}` : ""}`;
  try { await tossShare({ message: text }); } catch {}
  setTimeout(() => setShareInitiated(true), 500);
}

// ⛔ 이것들은 토스 미니앱에서 작동 안 함 — 절대 쓰지 말 것
// navigator.share() — 공유창 안 뜸
// window.location.href = "kakaotalk://..." — 작동 안 함
// navigator.clipboard.writeText() — 복사만 되고 공유 안 됨
```

### 4-5. 배너 광고 placeholder div (광고 없을 때도 보이게)
```tsx
// ✅ 올바른 방법 — 배경/테두리 있어야 눈에 보임
<div style={{ minHeight: 100, width: "100%", background: "rgba(255,255,255,0.08)", border: "1.5px dashed rgba(255,255,255,0.25)", borderRadius: 10 }} id="앱이름-banner" />
// ⛔ 배경 없으면 투명해서 광고 영역이 있는지 모름
```

### 4-5. Toss Storage (영구 저장)
```typescript
import { Storage } from "@apps-in-toss/web-bridge";
async function tossGet(key: string): Promise<string | null> {
  try { return await Storage.getItem(key); } catch { return localStorage.getItem(key); }
}
async function tossSet(key: string, val: string): Promise<void> {
  try { await Storage.setItem(key, val); } catch { localStorage.setItem(key, val); }
}
// ⛔ localStorage 직접 사용 금지 — 앱 종료 후 날아감
```

### 4-6. 잠금 해제 방식 (확정 — 2026-07-26)

| 방식 | 지속 시간 | 특징 |
|---|---|---|
| 광고 시청 (리워드) | 24시간 | 수익 발생, 섹션별 |
| 리뷰 작성 | 7일 전체 | 별점 확보 |
| 인앱결제 (IAP) | 30일 전체 | 안정 수익 |

⛔ **공유 → 잠금해제 절대 금지** (2026-07-26 확정)
- 나 자신에게 공유해도 잠금 열려서 완전 무료로 쓸 수 있게 됨
- 공유 버튼은 앱 퍼뜨리기 용도로만 두고, 잠금해제 기능과 연결하지 말 것
- `shareInitiated`, `shareToUnlock()`, `confirmShare()` 코드 절대 추가 금지

---

## 5. 광고 코드 패턴

### 광고 그룹 ID (앱마다 다름 — 토스 콘솔에서 생성 후 입력)
```typescript
const BANNER_AD_GROUP_ID = "";      // 토스 콘솔에서 받은 ID
const INTERSTITIAL_AD_GROUP_ID = ""; // 전면형
const REWARD_AD_GROUP_ID = "";      // 리워드 (잠금해제용)
```

### 배너 광고 (try-catch 방식 — isSupported() 쓰지 말 것)
```typescript
useEffect(() => {
  if (!setupDone) return;
  const target = document.getElementById("banner-ad");
  if (!target) return;
  try {
    const { destroy } = TossAds.attachBanner(BANNER_AD_GROUP_ID, target, { theme: "auto" });
    return destroy;
  } catch {}
}, [setupDone]);
// HTML: <div id="banner-ad" />
```

### 전면형 광고 (결과 화면 진입 후 1.5초)
```typescript
// 프리로드
useEffect(() => {
  if (setupDone) return;
  const cleanup = loadFullScreenAd({ options: { adGroupId: INTERSTITIAL_AD_GROUP_ID }, onEvent: () => {}, onError: () => {} });
  return cleanup;
}, [setupDone]);

// 1.5초 후 표시
useEffect(() => {
  if (!setupDone) return;
  const timer = setTimeout(() => {
    showFullScreenAd({ options: { adGroupId: INTERSTITIAL_AD_GROUP_ID }, onEvent: () => {}, onError: () => {} });
  }, 1500);
  return () => clearTimeout(timer);
}, [setupDone]);
```

### 리워드 광고 (광고 보면 24h 잠금해제)
```typescript
function watchAdToUnlock() {
  if (adWatching) return;
  setAdWatching(true);
  GoogleAdMob.showAppsInTossAdMob({
    options: { adGroupId: REWARD_AD_GROUP_ID },
    onEvent: async (event: { type: string }) => {
      if (event.type === "userEarnedReward") {
        const until = Date.now() + 24 * 60 * 60 * 1000;
        await tossSet("앱이름PaidUntil", String(until));
        setPaidUntil(until);
      }
      if (event.type === "dismissed" || event.type === "failedToShow") {
        setAdWatching(false);
      }
    },
    onError: () => { setAdWatching(false); },
  });
}
```

---

## 6. ⛔⛔⛔ 결제 방식 절대 원칙 — 모든 앱 동일하게

> **에스더님 지시 (2026-07-24): 모든 토스 앱은 반드시 같은 결제 방식으로 만들어라.**
> 다른 방식 쓰면 에러 나고 안 된다. 절대 다르게 만들지 말 것.

**모든 토스 앱 결제 = IAP.createOneTimePurchaseOrder 하나만 사용**

| 방식 | 허용 | 비고 |
|---|---|---|
| `IAP.createOneTimePurchaseOrder` | ✅ 유일한 정답 | MBTI/다이어트/감정일기 전부 동일 |
| `checkoutPayment` | ❌ 절대 금지 | 토스 미니앱 안에서 안 됨 |
| `TossPay` | ❌ 절대 금지 | 토스 미니앱 안에서 안 됨 |
| 서버 payToken 방식 | ❌ 절대 금지 | 웹앱(jeomun.com) 전용 |

**결제가 안 되는 유일한 이유 = SKU가 비어있음**
- 토스 콘솔 → 해당 앱 → 인앱결제 → 상품 추가 → SKU 복사 → 코드에 넣기
- SKU 형태: `ait.XXXXXXXX.XXXXXXXX.XXXXXXXXXXXXXXXX.XXXXXXXXXX`

## 6-2. 인앱결제 (IAP) 패턴

```typescript
import { IAP } from "@apps-in-toss/web-framework";
const SKU_앱명 = ""; // 토스 콘솔 → 인앱결제 상품 추가 후 SKU 입력

function payAndUnlock() {
  if (paying || !SKU_앱명) {
    if (!SKU_앱명) alert("결제 준비 중이에요. 잠시 후 다시 시도해주세요."); return;
  }
  setPaying(true);
  let cleanupFn: (() => void) | null = null;
  cleanupFn = IAP.createOneTimePurchaseOrder({
    options: {
      sku: SKU_앱명,
      processProductGrant: async () => {
        const until = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30일
        await tossSet("앱이름PaidUntil", String(until));
        setPaidUntil(until);
        setPaying(false);
        cleanupFn?.();
        return true;
      },
    },
    onEvent: () => {},
    onError: (error: unknown) => {
      setPaying(false);
      const code = (error as { code?: string })?.code;
      if (code !== "USER_CANCELED") alert("결제 오류: " + (code || "다시 시도해주세요"));
      cleanupFn?.();
    },
  });
}
```

> ⛔ `TossPay` 임포트 금지 → `IAP.createOneTimePurchaseOrder` 사용  
> ⛔ SKU는 인앱결제 사업자 심사 승인 후에만 채울 것

---

## 7. 오행 계산 (생년도 기반)

```typescript
const GANS = ["경","신","임","계","갑","을","병","정","무","기"];
const OH_FROM_GAN: Record<string, string> = {
  갑:"목",을:"목",병:"화",정:"화",무:"토",기:"토",경:"금",신:"금",임:"수",계:"수"
};
function getOhFromYear(year: number): string {
  const gan = GANS[(year - 4) % 10];
  return OH_FROM_GAN[gan] || "토";
}
```

---

## 8. 앱 화면 흐름 (표준 패턴)

```
초기 로딩 → Toss Storage에서 프로필 복원 시도
  ↓ 프로필 있으면 → 메인 화면 바로
  ↓ 없으면 → 설정 폼 (이름/전화/생년도 + 동의)
          ↓
          메인 화면 (퀴즈 또는 기능)
          ↓
          결과 화면 (무료 부분 보여줌)
          ↓
          프리미엄 잠금 영역 (공유/광고/결제 중 선택)
```

---

## 9. 로빈 웨비나 핵심 — 스마트 발송 세그먼트

**앱 출시 후 스마트 발송 설정 시 적용**

```
핵심: 좁힐수록 더 많이 간다
넓은 세그먼트 → 낮은 클릭률 → 토스가 발송 줄임
뾰족한 세그먼트 → 높은 클릭률 → 토스가 더 뿌려줌
```

| 항목 | 설정 |
|---|---|
| 타겟 비율 | 50% |
| 고관여 투자자 | 항상 제외 |
| 조건문 | AND 위주 |

**점운 앱별 세그먼트 레시피**
| 앱 | 포함 | 제외 |
|---|---|---|
| MBTI | 심리테스트 소비 + 20~30대 | 고관여 투자자 |
| 다이어트 | 헬스/다이어트 소비 | 고관여 투자자 |
| 감정일기 | 명상/자기계발 소비 + 20~40대 여성 | 고관여 투자자 |
| 사주/운세 | 사주/운세 소비 이력 + 40~50대 여성 | 고관여 투자자 |

**메시지 공식**: [앱 핵심 기능] + [포인트/혜택 금액 명시]  
예: "오늘 감정 오행 분석 무료로 받고 100포인트 받아가세요"

---

## 10. 개발 명령어

```
# 새 앱 생성
npx create-ait-app {appName}
# → react-ts 선택 → TDS No → 예제코드 엔터

# 빌드
cd "C:\Users\moon6\OneDrive\바탕 화면\{앱폴더}"
npx ait build
# → {앱명}.ait 생성 → 토스 콘솔 업로드
# ⚠️ npm run build 아님, npx ait build 임
```

---

## 11. 현재 앱 현황 (2026-07-24 최신)

| 앱 | 상태 | deploymentId | 메모 |
|---|---|---|---|
| MBTI 점운 | ✅ 출시 | **019f9432** | tossShare 공유버튼 수정 완료 |
| 다이어트 점운 | 🔍 심사중 | **019f9431** | tossShare 공유버튼 + 배너 placeholder 수정 |
| 감정일기 점운 | 🔍 심사중 | **019f942d** | ⚠️ tossShare 적용됨 BUT [테스트]잠금초기화 버튼 포함 → **최종 제출 전 반드시 제거 후 재빌드** |
| 가계부 점운 | ⏳ 미제작 | - | 3순위 |
| 맘케어 점운 | ⏳ 미제작 | - | 4순위 |

> ⛔ **감정일기 재빌드 전에**: `jeomun-gamjung/src/App.tsx`에서 `[테스트] 잠금 초기화` 버튼 블록 삭제 후 `npx ait build`

---

## 12. ⛔ 절대 금지 사항

| 금지 | 이유 |
|---|---|
| `navigator.share()` 로 공유 | 토스 웹뷰에서 공유창 안 뜸 |
| `window.location.href = "kakaotalk://..."` | 토스 내에서 작동 안 함 |
| `navigator.clipboard.writeText()` 로 공유 | 복사만 되고 카카오 안 열림 |
| `localStorage` 직접 사용 | 토스 앱 종료 후 날아감 |
| `TossAds.attachBanner.isSupported?.()` 가드 | false 반환해서 배너 안 붙음 |
| `TossPay` import | 토스 앱 내에서 안 됨, IAP 사용 |
| **앱마다 다른 결제 방식 사용** | **에스더님 지시: 모든 앱 IAP.createOneTimePurchaseOrder 통일** |
| `checkoutPayment` / `payToken` 서버 방식 | jeomun.com 웹전용, 토스 미니앱에서 사용 금지 |
| 외부 링크(jeomun.com) 버튼 추가 | 토스 심사 탈락 |
| 구독/자동결제 문구 | 카드사 심사 문제 |
| SKU 없이 결제 코드 실행 | 앱 크래시 |
| 인앱결제 승인 전 결제 코드 활성화 | 승인 전 작동 안 함 |

---

## 13. 새 앱 요청 시 Claude가 할 것 (절차)

1. **이 파일 먼저 읽는다**
2. 계획을 아래 형식으로 정리해서 에스더님께 보고한다:
   ```
   📋 [앱 이름] 빌드 계획

   무료: ...
   유료 (990원 / 30일): ...
   잠금 방식: 공유 24h + 광고 24h + IAP 30일 중 [선택]
   폼: 이름(선택) + 전화(필수) + 생년도(필요여부)
   광고: 배너 / 전면형 / 리워드 중 [선택]
   Firebase 저장: source: "toss-[앱명]"

   이렇게 만들면 될까요? ✅
   ```
3. 에스더님이 "응", "맞아", "그렇게 해" 라고 하면 그때 코딩 시작
4. 체크리스트 4번 항목 전부 적용
5. 빌드 후 deploymentId 보고
