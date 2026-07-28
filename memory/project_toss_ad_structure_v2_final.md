---
name: project-toss-ad-structure-v2-final
description: 토스 미니앱 3개 광고+리뷰 구조 최종 확정 v3 (2026-07-26) — 리뷰1회영구+만료메시지+흰배경+MBTI폼순서복구
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
  modified: 2026-07-26T16:20:14.394Z
---

> ⚠️ 이 파일이 최신 최종본 (v4, 2026-07-26 야간).
> 작업 전 반드시 이 파일 먼저 읽을 것.

---

## ⭐ 전면(인터스티셜) 광고 규칙 (절대 변경 금지)

### MBTI
- **무료 유저**: 결과지 들어올 때마다 (번호 바뀌어도 매번) 5초 후 전면광고
- **유료/리뷰 유저**: 하루 1번, 전화번호별 (`mbtiInterstitialDay_${phone}` Toss Storage 키)
- ⛔ global `mbtiInterstitialDay` 키 절대 사용 금지 — 다른 번호 광고까지 막힘
- ⛔ `if (isPaid) return` 절대 넣지 말 것

### 다이어트
- **💎 프리미엄 탭 클릭 시**: 3초 후 전면광고 — **무료=클릭마다, 유료/리뷰=하루1번** (`dietPremiumInterstitialDay` Toss Storage) ← 2026-07-27 수정
- **음식 기록 후**: 유료 유저 대상 하루 1번 (`dietInterstitialDay` Toss Storage)
- **첫 가입 시**: 1회

### 감정일기
- **일기 제출 → 결과지 진입 시**: 모든 유저 1회 (하루 1번 제출 = 자연스럽게 하루 1번)
- 별도 프리미엄 탭 없음

### 새 앱 추가 시 원칙
- 결과지 있는 앱: 결과지 진입 시 모든 유저 하루 1번 (날짜 Toss Storage 저장)
- 유료/리뷰 여부로 전면광고 제외하지 말 것

---

## 이번 세션 확정 변경사항 (v2 → v3)

| 항목 | v2 | v3 확정 |
|---|---|---|
| 리뷰 보상 버튼 위치 | ①마지막섹션 + ②결과지 맨아래 2곳 | **마지막 잠금 섹션 안 1곳만** (하단 별도 카드 제거) |
| 리뷰 보상 1회 제한 | 없음 (계속 보임) | **있음** — 리뷰 쓴 사람은 영구 숨김 (`reviewClaimed` Toss Storage 저장) |
| 리뷰 보상 표시 조건 | 마지막 섹션이면 표시 | **다른 섹션 전부 열린 사람만** + `!reviewClaimed` |
| 만료 메시지 | 없음 | **있음** — 섹션 잠금 해제 후 기간 만료 시 "⏱ 이용 기간이 만료됐어요 · 열기 버튼을 누르거나 990원 결제 후 다시 이용하세요." |
| 광고 버튼 | 24시간 열리면 숨김 | **항상 표시** — 기간 만료 후에도 광고 버튼 다시 나옴 |
| 첫화면 푸터 배경 | `#f9f9f9` | **`#ffffff`** (흰색) — 카톡 공유 시 메인 푸터와 동일 |
| MBTI 첫화면 피처섹션 | 검은 배경 (`#07000f`) | **흰 배경 (`#ffffff`)**, 텍스트도 어두운 색으로 조정 |
| MBTI 흐름 | init → setStep("result") 자동점프 | **폼 먼저** → 같은 전번 제출 시 결과지, 다른 전번 시 퀴즈→결과 |
| 테스트 초기화 버튼 | reviewClaimed 리셋 안 됨 | **reviewClaimed도 함께 리셋** (3개 앱 모두) |

---

## 리뷰 보상 버튼 규칙 (절대 변경 금지)

```
조건: (다른 섹션 전부 열림) AND (!reviewClaimed)
위치: 마지막 잠금 섹션 광고 버튼 바로 아래
노출: 위 조건 만족 시에만 표시
1회 영구: requestReview() → 완료 → Toss Storage 저장 → 다시는 표시 안 함
```

- **MBTI**: 스트레스(마지막) 섹션에서:
  - love+career 미열람 → "위 2개 섹션을 먼저 열어주세요" 메시지
  - love+career 열람 완료(`isLastLocked`) + `!reviewClaimed` → 리뷰 버튼 표시 → 24시간 전체 열기
  - `reviewClaimed` → "이미 사용하신 혜택입니다. 감사합니다! 😊"
  - deploymentId: `019f9e41-9789-7980-8f3c-2a7ff34b3289`
- **다이어트**: `isAvoidUnlocked && isExerciseUnlocked && isSeasonalUnlocked && !reviewClaimed` → 7일 전체 열기
- **감정일기**: `isCardUnlocked && isLetterUnlocked && !reviewClaimed` → 7일 전체 열기

### 리뷰 버튼 vs 일반 리뷰 버튼 구분
- **보상 리뷰 버튼** (위 조건): 잠금 섹션 안, 1회 영구, 7일/24시간 잠금 해제
- **단순 리뷰 버튼** (무료 섹션 끝): 항상 표시, 보상 없음, `requestReview()` 호출만
- 두 버튼 절대 같은 위치에 두지 말 것

---

## 만료 메시지 규칙

```jsx
// 잠금 섹션 else 분기 안에서만
{xxxUntil > 0 && !isXxxUnlocked && (
  <div style={{ background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:12, padding:"10px 14px", marginBottom:10, textAlign:"center" }}>
    <p style={{ fontSize:12, color:"#fbbf24", margin:"0 0 2px", fontWeight:700 }}>⏱ 이용 기간이 만료됐어요</p>
    <p style={{ fontSize:11, color:"rgba(255,255,255,0.45)", margin:0 }}>열기 버튼을 누르거나 990원 결제 후 다시 이용하세요.</p>
  </div>
)}
```

- `xxxUntil > 0` = 한 번이라도 열었던 섹션 (처음 잠금은 메시지 없음)
- `!isXxxUnlocked` = 현재 만료된 상태
- 광고 버튼은 만료 후에도 항상 표시 (광고는 1회만이 아님)

---

## ⛔ 카카오톡 공유 미리보기 카드 색 = 코드로 못 바꿈

- `tossShare({ message: string })` — 텍스트만 전달, 카드 배경색 파라미터 없음
- 카카오톡 링크 미리보기 카드 배경색은 **토스 콘솔 > 앱 정보 > 대표 이미지** 에서만 변경 가능
- 코드로 고쳐달라는 요청이 오면 "못 바꿔요, 토스 콘솔에서 대표 이미지 바꾸세요" 라고 안내할 것
- 에스더님 확인: 그대로 두기로 결정 (2026-07-26)

---

## 첫화면 푸터 스타일 규칙 (모든 앱 공통 — 신규 앱도 동일 적용)

```
배경: #ffffff (순백)
텍스트: #6b7280 (회색) — 현재 앱들과 동일한 색
앱 이름: fontSize 13, fontWeight 700, color #374151 (진회색)
사업자 정보: fontSize 11~12, color #6b7280 (회색)
```

- **3개 앱 모두**: 첫화면(메인/인트로) 푸터 배경 `#ffffff` (순백)
- **MBTI**: 피처 리스트 섹션도 `background: "#ffffff"`, 텍스트 색 `#1f2937` (어두운 회색)
- **감정일기**: 푸터 카드 `background: "#ffffff"`
- **다이어트**: 이미 `#ffffff` (기존 유지)
- **신규 앱 추가 시**: 반드시 이 스타일 그대로 적용할 것
- 이유: 카톡 공유 시 첫화면이 보일 때 메인 푸터와 동일한 흰 배경으로 통일

---

## 테스트 초기화 버튼 필수 포함 항목 (3개 앱 공통)

```js
// MBTI
await tossSet(`mbtiPaidUntil_${phone}`, "0");
await tossSet(`mbtiReviewClaimed_${phone}`, "");
await tossSet("mbtiLastPhone", "");
await tossSet(`mbtiResult_${phone}`, "");
setMbtiPaidUntil(0); setUnlockedSections(new Set()); setReviewInitiated(false); setReviewClaimed(false);

// 다이어트
await tossSet("dietPaidUntil", "0"); await tossSet("dietReviewClaimed", "");
await tossSet("dietAvoidUntil","0"); await tossSet("dietExerciseUntil","0");
await tossSet("dietSeasonalUntil","0"); await tossSet("dietReportUntil","0");
setDietPaidUntil(0); setReviewInitiated(false); setReviewClaimed(false); ...섹션Until들...

// 감정일기
await tossSet("gamjungPaidUntil","0"); await tossSet("gamjungReviewClaimed","");
await tossSet("gamjungCardUntil","0"); await tossSet("gamjungLetterUntil","0");
await tossSet("gamjungWeatherUntil","0"); await tossSet("gamjungOhTypeUntil","0");
setGamjungPaidUntil(0); setReviewInitiated(false); setReviewClaimed(false); ...섹션Until들...
```

---

## MBTI 전화번호 기반 복원 흐름 (확정)

```
앱 시작
  → Toss Storage에서 mbtiLastPhone 로드
  → phone 상태에 pre-fill (입력창에 자동 입력)
  → paid/reviewClaimed 상태도 로드
  → 결과지로 자동 점프 ❌ (폼 먼저 보여줌)

폼 제출
  → phone === lastPhoneRef.current && result 있음 → 결과지로 바로 이동
  → phone이 다른 경우 → 퀴즈 → 전면광고 → 결과지
```

---

## 잠금 구조 (변경 없음)

### MBTI
| 섹션 | 상태 | unlock 기간 |
|---|---|---|
| 💕 연애 패턴 (love) | 잠금 | 세션만 (광고) |
| 💼 직업 적성 (career) | 잠금 | 세션만 (광고) |
| 😤 스트레스 (stress) | 잠금 = 마지막 | 세션만 (광고) / 24h (리뷰·결제) |
| 🤝 인간관계 (relation) | 무료 | — |
| 🌱 성장 메시지 (growth) | 무료 | — |

### 다이어트
| 섹션 | 상태 | unlock 기간 |
|---|---|---|
| 🚫 금지음식 (avoid) | 잠금 | 24시간 (광고) |
| 🏃 운동 루틴 (exercise) | 잠금 | 24시간 (광고) |
| 🍽️ 계절별 음식 (seasonal) | 잠금 | 24시간 (광고) |
| 📊 30일 리포트 (report) | 잠금 = 마지막 | 24시간 (광고) / 7일 (리뷰) / 30일 (결제) |

### 감정일기
| 섹션 | 상태 | unlock 기간 |
|---|---|---|
| 🎴 치유 카드 (card) | 잠금 | 24시간 (광고) |
| 💌 위로 편지 (letter) | 잠금 | 24시간 (광고) |
| 🌤️ 날씨 (weather) | 잠금 = 마지막 | 24시간 (광고) / 7일 (리뷰) / 24시간 (결제) |
| 🌿 오행 유형 (ohtype) | 무료 | — |
