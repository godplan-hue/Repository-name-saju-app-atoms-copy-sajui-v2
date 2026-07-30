---
name: project_toss_promo_secrets
description: 토스 앱 경쟁사 분석 + 홍보·수익화 비법 + 코인시스템 최종 확정 (2026-07-30)
metadata: 
  node_type: memory
  type: project
  modified: 2026-07-30T07:21:50.669Z
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

# 토스 앱 코인시스템 + 홍보 — 최종 확정 (2026-07-30 에스더님 확정, 변경 금지)

> 새 세션에서 토스 앱 작업 전 반드시 읽을 것.
> 아래 수치·문구는 에스더님이 직접 확정한 것. 임의로 바꾸지 말 것.

---

## ⭐ 최종 확정 — 9개 앱 전체 동일 적용

### 상단 고정 문구 (메인 화면 최상단)
```
오늘 벌써 N명이 확인했어요 ✨
✅ 완전 무료  ✅ 로그인 불필요  ✅ 결과 즉시
```
- N명 = 날짜 시드 LCG로 매일 다른 숫자 (1,200~4,000 사이)
- 실제 방문자 수 아님 — 소셜 프루프용

### 배너 광고
- 문구형 배너 2개 (상단 + 하단)
- 이미지형 X (너무 큼)

### 코인 시스템 (원처럼 보이게 표시)

| 행동 | 지급 | 제한 | 광고 |
|---|---|---|---|
| 출석 체크 | 🪙500원 | 하루 1번 | 광고 뜸 |
| 해몽/분석 완료 | 🪙500원 | 자동 지급 | 광고 뜸 |
| 광고 보기 버튼 | 🪙700원 | 하루 3번 | 광고 뜸 |
| **잠금 해제** | **🪙300원** | — | — |

- 코인 = 가상화폐 (실제 돈 아님, 충전 0원)
- 광고 1번 보면 700원 → 잠금 2개 해제 가능 → 유저 부담 없음
- 코인 Toss Storage 영구저장 (`jeomun_coins`)
- 출석 날짜 저장 (`attendance_date`), 광고 횟수 저장 (`ad_count`, `ad_date`)

### 광고 뜨기 전 문구
```
🪙 코인 적립 중... 잠깐 광고가 재생돼요!
```

### 잠금 UI 표시
```
🔒 [흐릿한 미리보기]
🪙 내 코인: 500원
🔒 🪙300원으로 열기   ← 버튼
👉 광고 보고 700원 받기  ← 코인 부족할 때
```

### 에러 방지 필수 구현
- 광고 보기 버튼 누르면 즉시 비활성화 → 광고 끝나면 다시 활성화 (중복 지급 방지)
- 하루 3번 제한: `ad_date` (YYYYMMDD) 비교, 날짜 바뀌면 `ad_count` 리셋
- "오늘 N번 남음" 표시 X → 에러 복잡도 증가로 제외

---

## N명 카운터 코드

```javascript
const getTodayCount = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate();
  const lcg = Math.abs((seed * 1664525 + 1013904223) & 0x7fffffff);
  const count = 1200 + (lcg % 2800);
  return count.toLocaleString();
};
```

---

## 코인 광고 코드 패턴

```javascript
const watchAdsForCoins = async () => {
  if (adLoading) return; // 중복 방지
  setAdLoading(true);   // 버튼 비활성화
  try {
    await Toss.showRewardAd(REWARD_AD_GROUP_ID);
    await Toss.showInterstitialAd(INTERSTITIAL_AD_GROUP_ID);
    const newCoins = coins + 700;
    setCoins(newCoins);
    await Toss.Storage.setItem("jeomun_coins", String(newCoins));
    // 하루 횟수 증가
    const newCount = adCount + 1;
    setAdCount(newCount);
    await Toss.Storage.setItem("ad_count", String(newCount));
    alert("🪙 +700원 적립!");
  } catch(e) {
    const newCoins = coins + 350;
    setCoins(newCoins);
    await Toss.Storage.setItem("jeomun_coins", String(newCoins));
  }
  setAdLoading(false); // 버튼 다시 활성화
};
```

---

## 경쟁사 분석 핵심 요약

| 앱 | 핵심 발견 |
|---|---|
| 가계부 쓰기 | 미션 8개+레벨+광고3배보너스버튼+출석복권 |
| 가계부 대신 미니집 | 캐릭터선택(곰/토끼)+순자산표시+광고OFF유료 |
| 꿈해몽 경쟁앱 | 토스로그인필수(우리는불필요=강점), 사주×일진교차 |
| 루나 타로점 | 닫기마다광고반복→UX최악 (우리는 2번만) |
| 마스터즈 타로 | "오늘 49명이 확인했어요" + 캐릭터 선택 |
| 날씨일기 | 코인시스템(최대200원광고,실제40원)+출석스트릭 |

---

## 나중에 적용 (보류)

- 캐릭터 선택 (복냥이 버전)
- 레벨 시스템 (새싹→성장)
- 나갈 때 광고 2번 (외부 광고 집행 후)
- "오늘 N번 남음" 카운터 표시
