---
name: project-session-2026-08-02
description: 2026-08-02 세션 — 카카오 알림톡 3종 버그 수정 + 결과지 직접 링크 알림톡 발송 완료
metadata:
  type: project
---

## 2026-08-02 세션 핵심 작업

### 카카오 알림톡 완전 수정 — ✅ 완료

**왜 15일간 알림톡이 안 갔나 — 근본 원인 두 가지**

1. **`type: "ATA"` 누락** (커밋 `4400bd6`) — Solapi에서 알림톡을 보내려면 message 객체에 `type: "ATA"` 필수. 없으면 SMS로 잘못 발송됨. 이게 진짜 근본 원인.

2. **`#{파트너명}` 변수 미사용** (커밋 `6612ad8`) — `partnerName`을 받아두고 variables에 안 넣어서 템플릿 변수 오류.

**알림톡 → 결과지 직접 링크 변경** (커밋 `5237e1d`)
- 이전: `pay/page.tsx`에서 결제 직후 알림톡 발송 → `#{링크}` = 보관함(`/main-v2/history`)
- 이전: `result/page.tsx`에서 SMS(`send-sms`)로 결과지 링크 발송
- 수정: `pay/page.tsx` 알림톡 제거, `result/page.tsx`에서 share ID 생성 후 `/api/notify` 호출 → `#{링크}` = `https://jeomun.com/main-v2/result?sid=XXX`

**현재 알림톡 흐름**:
```
결제 완료 → 결과지 로딩 → sid 생성 → 알림톡 1개 발송 (결과지 직접 링크)
```

### 꼭읽어보세요 버튼 첫 진입 시 안 보이던 버그 수정 (커밋 `366bc5b`)

- **원인**: `rp_scroll` sessionStorage 스크롤 복원이 navigate 타입(결제 후 첫 진입)에도 실행됨
- **수정**: `performance.getEntriesByType("navigation")[0].type`으로 분기
  - `back_forward` → 복원
  - `navigate` / `reload` → 초기화 (항상 맨 위)

### 알림톡 코드 현황 (`app/api/notify/route.ts`)

```ts
const body = {
  message: {
    to: cleanPhone,
    type: "ATA",  // ← 필수! 없으면 SMS로 발송됨
    kakaoOptions: {
      pfId,
      templateId,
      variables: {
        "#{파트너명}": partnerName || "점운",
        "#{금액}": String(amount || ""),
        "#{링크}": resultLink,  // 기본값: jeomun.com/main-v2/history
      },
    },
  },
};
```

**Why:** 솔라피는 `type` 필드로 SMS/알림톡/LMS를 구분함. 누락 시 SMS로 발송되어 알림톡 템플릿 사용 불가.
**How to apply:** `notify/route.ts` 수정 시 `type: "ATA"` 절대 삭제 금지.
