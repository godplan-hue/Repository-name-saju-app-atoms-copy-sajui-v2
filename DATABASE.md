# 점운 — Firebase Realtime Database 구조

> ⛔ 이 문서를 읽지 않고 DB를 건드리지 마라.
> 노드 경로 하나만 틀려도 데이터가 다른 곳에 쌓이거나 조회가 안 된다.

---

## DB 엔진

**Firebase Realtime Database** (`lib/firebase.ts`)

- Supabase는 사용하지 않는다. `lib/supabase.ts` 파일이 있지만 연결되어 있지 않다. 절대 활성화하지 말 것.
- 모든 읽기/쓰기는 `db.ref("노드경로")` 형태로 접근한다.

---

## 전체 노드 목록

```
/consumerCustomers/{pushId}     ← 일반 고객 정보
/sharedResults/{pushId}         ← 공유 링크 결과
/partners/{partnerId}           ← 파트너 계정
  /payments/{pushId}            ← 파트너 결제 이력
/partnerArchive/{partnerId}/{pushId}  ← 파트너가 생성한 분석 보관함
/partnerBrands/{subdomain}      ← 파트너 브랜드(서브도메인 → 브랜드)
/partnerStats/{partnerId}       ← 파트너 분석 건수/매출 집계
  /total                        ← 전체 누적
  /{YYYY-MM}                    ← 월별 집계
/promoCodes/{CODE}              ← 할인코드 (키는 대문자)
```

---

## 노드별 상세

### `/consumerCustomers/{pushId}`
일반 사용자(파트너 아닌 점운 직접 고객)의 연락처·동의 기록.
동의 없이 저장하지 않는다.

```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "email": "user@example.com",
  "birthYear": "1990",
  "birthMonth": "5",
  "birthDay": "15",
  "gender": "male",
  "birthHour": "자시",
  "relationship": "본인",
  "consentGiven": true,
  "createdAt": "2026-06-01T09:00:00.000Z"
}
```

- `pushId`: Firebase `.push()` 자동 생성 키
- `phone`, `email`: 둘 중 하나만 있어도 저장 가능
- 조회: 관리자 화면에서 최신순으로 페이지 단위 조회 (한 번에 전체 읽지 않음)

---

### `/sharedResults/{pushId}`
공유 링크를 받은 사람이 볼 수 있도록 결과를 서버에 저장한 것.
공유하는 순간 저장되고, 이후 링크로 누구나 조회 가능.

```json
{
  "name": "홍길동",
  "birthYear": "1990",
  "scores": {
    "total": 82,
    "wealth": 75,
    "love": 88,
    "health": 70,
    "success": 85
  },
  "luckyColor": "보라색",
  "luckyNumber": "7",
  "luckyDirection": "동쪽",
  "categories": [
    { "label": "재물운", "text": "분석 내용...", "color": "#f59e0b" }
  ],
  "businessName": "점운",
  "tier": "package",
  "createdAt": "2026-06-01T09:00:00.000Z"
}
```

- 공개 조회 가능 (로그인 불필요)
- `tier`: `"free"` | `"select"` | `"package"`

---

### `/partners/{partnerId}`
파트너 계정 정보. `partnerId`는 Firebase `.push()` 자동 생성 키.

```json
{
  "email": "partner@example.com",
  "password": "salt:hash (pbkdf2 sha512)",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "businessName": "길동 사주",
  "tier": "basic",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "feeRenewedAt": "2026-01-01T00:00:00.000Z",
  "paymentConfirmed": false,
  "subdomain": "gildong",
  "guideConfirmedAt": "2026-01-02T00:00:00.000Z"
}
```

- `tier`: `"free"` | `"basic"` | `"premium"` | `"diamond"`
- `paymentConfirmed`: 유료 등급만 존재. `false`이면 분석 생성 차단.
- `subdomain`: 다이아 등급만 사용. `/partnerBrands/{subdomain}`과 연결.
- `password`: 절대 평문 저장 금지. 항상 pbkdf2 해시로 저장.

#### `/partners/{partnerId}/payments/{pushId}`
파트너 가입비/연회비 결제 이력.

```json
{
  "type": "signup",
  "tier": "basic",
  "amount": 50000,
  "paidAt": "2026-01-01T00:00:00.000Z",
  "couponCode": "PROMO20",
  "discountPercent": 20
}
```

- `type`: `"signup"` | `"renew"` | `"upgrade"`

---

### `/partnerArchive/{partnerId}/{pushId}`
파트너가 고객에게 발행한 분석 결과 보관함.
파트너별로 분리 저장되어, 다른 파트너/일반 고객과 섞이지 않는다.

```json
{
  "partnerName": "길동 사주",
  "customerName": "김철수",
  "customerEmail": "kim@example.com",
  "customerPhone": "010-9999-8888",
  "birth": "1995-03-20",
  "birthHour": "오시",
  "gender": "male",
  "packageType": "기본 분석",
  "result": { "재물운": "분석 내용...", "연애운": "분석 내용..." },
  "consentGiven": true,
  "charge": {
    "listPrice": 9900,
    "discountRate": 0.3,
    "totalCharge": 6930
  },
  "createdAt": "2026-06-01T09:00:00.000Z"
}
```

- 조회: 최신 50건씩 페이지 단위 (전체를 한 번에 읽지 않음)
- 분석 생성 시 `partnerStats`도 동시에 갱신 (트랜잭션)

---

### `/partnerBrands/{subdomain}`
다이아 파트너 전용. 서브도메인 → 브랜드 정보 매핑.
메인 사이트가 호스트명으로 O(1) 조회한다.

```json
{
  "partnerId": "-NxABC123...",
  "businessName": "길동 사주",
  "logoUrl": "https://...",
  "customPriceBasic": "19,900원",
  "customPriceStandard": "",
  "customPricePremium": "49,900원",
  "customPriceVip": "",
  "updatedAt": "2026-06-01T09:00:00.000Z"
}
```

- `subdomain` 키: 영문 소문자·숫자·하이픈, 3~20자
- `customPrice*`: 화면 표시용 텍스트. 빈 값이면 기본 가격 표시.
- 예약어 서브도메인 금지: `www`, `api`, `admin`, `jeomun` 등

---

### `/partnerStats/{partnerId}/total` 및 `/partnerStats/{partnerId}/{YYYY-MM}`
분석 보관함 전체를 읽지 않고도 건수·매출을 빠르게 확인하기 위한 집계.
분석 생성 때마다 트랜잭션으로 동시 갱신한다.

```json
{
  "count": 42,
  "revenue": 290000
}
```

- `total`: 전체 누적 집계
- `{YYYY-MM}` (예: `"2026-06"`): 해당 월 집계. 월별 한도 체크에도 사용.

---

### `/promoCodes/{CODE}`
일반 고객용 할인코드. 키는 반드시 **대문자**.

```json
{
  "discountPercent": 30,
  "note": "인플루언서 이벤트",
  "active": true,
  "usageCount": 0
}
```

- 한 번 사용되면 `active: false`로 자동 비활성화 (1회용)
- 파트너 할인과 무관 (파트너는 별도 등급 할인 적용)

---

## 절대 금지

| 금지 행위 | 이유 |
|-----------|------|
| 노드 경로 임의 변경 | 기존 데이터 조회 불가 |
| `password` 평문 저장 | 보안 사고 |
| `partnerArchive` 전체 한 번에 읽기 | 수만 건이 되면 타임아웃 |
| `supabase.ts` 활성화 | Firebase RTDB로 확정된 결정 |
| `paymentConfirmed` 없이 유료 등급 생성 | 미입금 파트너 차단 불가 |

---

## 주요 API 경로

| 역할 | 경로 |
|------|------|
| 일반 고객 저장 | `POST /api/v2/customer` |
| 공유 결과 저장/조회 | `POST /api/v2/share`, `GET /api/v2/share?id=` |
| 파트너 가입 | `POST /api/partner/signup` |
| 파트너 로그인 | `POST /api/partner/login` |
| 분석 보관함 저장/조회 | `POST /api/partner/archive`, `GET /api/partner/archive?partnerId=` |
| 브랜드 설정 | `POST /api/partner/brand`, `GET /api/partner/brand?subdomain=` |
| 할인코드 관리 | `GET/POST/PATCH /api/promo-codes` |
| 관리자 대시보드 | `GET /api/admin/dashboard` |
