---
name: reference_toss_ai_miniapp_build_guide
description: "앱인토스 공식 \"AI로 미니앱 만들기\" 가이드 — Claude/Codex+MCP 연결, 기획~출시 전체 흐름, 로그(Analytics) 이벤트 문법. 새 토스 미니앱 만들 때 참고"
metadata: 
  node_type: memory
  type: reference
  originSessionId: e04af5d5-eb3c-4469-ab5d-37a8c64cef95
  modified: 2026-08-20T12:39:03.150Z
---

# 앱인토스 공식 AI 미니앱 빌드 가이드 (2026-08-20 저장)

에스더님이 앱인토스 공식 문서를 붙여넣어 저장 요청. 새 미니앱(다이어트/AI상담 등 예정 앱 포함) 만들 때 참고할 것.
[[toss_app_build_guide]] (기존 시장분석·체크리스트 가이드)와 함께 사용 — 이 문서는 "AI 도구 연결 방법 + 공식 절차 + 로그 문법" 쪽에 특화됨.

## 1. 준비 — AI 도구 + Node.js
- Claude 또는 Codex 설치, 로그인 후 'Code' 진입
- Node.js 확인/설치는 AI에게 그냥 요청하면 됨: "Node.js가 설치되어 있는지 확인하고, 없으면 설치해줘"

## 2. MCP 연결 (필수 — 안 하면 AI가 짐작해서 엉뚱하게 만듦)

**개발용 MCP + 문서검색 MCP**:
```
ax CLI를 설치하고 앱인토스 개발 MCP를 연결해줘.
문서 검색을 위해 아래 MCP도 추가해줘.
https://developers-apps-in-toss.toss.im/~gitbook/mcp
```
확인: "연결된 MCP 목록을 보여줘" → apps-in-toss, apps-in-toss-docs 있어야 정상

**콘솔(앱 등록/관리) MCP**:
```
콘솔 작업을 위한 MCP를 추가해줘.
URL: https://mcp.toss.im/adapters/apps-in-toss-console/mcp
Client ID: mcp-gateway
연결한 다음에는 인증까지 진행해줘.
```
로그인창 뜨면 인증 진행. 확인: "콘솔 MCP가 잘 연결됐는지 확인해줘"

## 3. 개발 흐름

1. **기획**: "[앱 설명]을 만들고 싶어. 1)앱인토스 오픈정책에 맞는지 확인 2)필요한 화면·기능 정리 3)가이드 어긋나는 부분 미리 알려줘"
2. **미니앱 생성**: "{이름} 이름으로 미니앱을 만들어줘" → 앱인토스 등록 + 코드 저장소 자동 생성
3. **기능 요청**: 구체적으로 말할수록 정확함 (예: "화면 중앙에 시작하기 버튼 만들고 누르면 보상형 광고 노출되게 연동해줘")
4. **외부 저장소 연동**: 데이터 저장 필요할 때만 (Supabase/Firebase/Cloudflare 중 택1). 연결정보(URL·API키) 주면 AI가 연동. **보안설정도 확인해달라고 반드시 같이 요청할 것** (기본값이 아무나 접근 가능한 경우 많음)
   - 점운은 Firebase RTDB 사용 확정 — 새 토스 미니앱도 Firebase REST API 직접 호출 패턴 사용 (참고: [[project_toss_firebase_saving]])

## 4. 테스트 · 출시

- 테스트: "미니앱을 테스트해보고 싶어. 테스트할 수 있게 푸시를 보내줘" → 토스앱 푸시로 실기기 테스트
- 에러날 때: 화면 캡처 + 상황 설명 같이 주면 AI가 더 정확히 고침
- 출시: "미니앱을 출시하고 싶어. 검수를 요청해줘" → 검수 결과는 콘솔+이메일 통보 → 승인되면 콘솔에서 '출시하기' 버튼 직접 눌러야 공개됨 → 출시 후 1시간 뒤 토스 미니앱 리스트 반영

## 5. 로그(Analytics) 이벤트 — SDK 0.0.26 이상 필수

페이지 이동 로그는 자동 기록. 클릭/노출 이벤트는 직접 심어야 함.

**클릭 이벤트**:
```js
import { Analytics } from '@apps-in-toss/web-framework';
Analytics.click({ button_name: 'my_button' });
```

**노출(임프레션) 이벤트** — IntersectionObserver로 10% 이상 보일 때:
```js
import { Analytics } from '@apps-in-toss/web-framework';
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    Analytics.impression({ item_id: target.dataset.itemId });
    observer.disconnect();
  }
}, { threshold: 0.1 });
observer.observe(target);
```

**화면 이벤트 + 커스텀 파라미터**:
```js
Analytics.screen({
  log_name: 'product_detail_screen',
  product_id: 'prod_123', product_category: 'electronics', price: 29900,
});
```
`log_name`이 콘솔(분석>이벤트)에 표시되는 이벤트명. 파라미터 구체적으로 넣을수록 분석 정교해짐.

**주의사항**:
- 샌드박스/출시준비 단계 데이터는 집계 안 됨 — 실제 런칭 후 데이터부터, 런칭 다음날부터 확인 가능
- 개인정보·민감정보는 로깅 금지 (사용자 식별자는 익명화/해시 처리)
- 너무 많은 이벤트는 노이즈 — 의미있는 전환 지점 위주로 기록

## Why
에스더님이 이 가이드로 앞으로 새 미니앱들을 계속 만들 예정이라 매번 다시 안 찾아도 되게 저장 요청.
**How to apply**: 새 토스 미니앱 착수 전 이 문서 + [[toss_app_build_guide]] 둘 다 먼저 읽을 것. MCP 연결 여부부터 확인.
