---
name: project_toss_firebase_saving
description: 토스 미니앱(.ait)에서 Firebase RTDB에 직접 저장하는 방법 — 다른 토스 앱 추가 시 동일 패턴 사용
metadata: 
  node_type: memory
  type: project
  originSessionId: f854df3a-19ca-4d16-ad61-120f368e9970
---

# 토스 미니앱 Firebase 저장 방법

**핵심**: 토스 미니앱은 Next.js 서버가 없는 standalone React 앱이므로, Firebase SDK 대신 **Firebase REST API**로 직접 저장한다.

## 저장 코드 패턴

```javascript
fetch("https://saju-app-atoms-default-rtdb.firebaseio.com/free_leads/toss.json", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: userName || "익명",
    phone,
    marketing,           // [선택] 마케팅 수신 동의 boolean
    source: "toss-mbti", // ← 앱마다 다르게 (toss-gamjung, toss-zodiac 등)
    mbtiType: r.type,    // ← 앱별 결과 필드 추가
    createdAt: Date.now(),
  }),
})
```

## Firebase REST API 규칙

- URL: `https://saju-app-atoms-default-rtdb.firebaseio.com/{경로}.json`
- `POST` → 자동 고유 키로 저장 (push와 동일)
- `PUT` → 특정 키로 저장 (set과 동일)
- 인증 없이 가능한 이유: Firebase Rules에서 `free_leads/toss` 경로 쓰기 허용

## 저장 경로

- 모든 토스 앱 → `free_leads/toss` 하위에 저장
- `source` 필드로 앱 구분: `"toss-mbti"`, `"toss-gamjung"` 등

## 어드민에서 읽는 법

```javascript
// app/api/admin/free-leads/route.ts
db.ref("free_leads/toss").orderByChild("createdAt").once("value")
```

toss 항목은 source 필드 그대로 유지해 어드민에서 앱별 구분 가능.

## 새 토스 앱 추가 시 체크리스트

1. `jeomun-mbti/src/App.tsx` 패턴 참고
2. 결과 계산 후 `fetch("...free_leads/toss.json", { method: "POST", body: JSON.stringify({...}) })` 삽입
3. `source` 필드를 새 앱 이름으로 변경 (예: `"toss-zodiac"`)
4. 이름(선택), 전화번호(필수), [필수]+[선택] 체크박스 2개 UI 포함
5. `.ait` 빌드 후 토스 콘솔에서 검토요청

## 파일 위치

- 토스 미니앱 소스: `c:\Users\moon6\OneDrive\바탕 화면\jeomun-mbti\src\App.tsx`
- Firebase DB URL: `https://saju-app-atoms-default-rtdb.firebaseio.com`
