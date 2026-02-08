# PAYMENT — 결제 모듈 상세 스펙

## 1. 목적과 범위

토스페이먼츠를 통한 **단건 결제**, **구독(정기결제)**, **환불** 처리를 담당한다.

## 2. 패키지 구조

```
packages/payment/
├── src/
│   ├── index.ts
│   ├── toss/
│   │   ├── client.ts           # 토스페이먼츠 API 클라이언트
│   │   ├── types.ts            # 토스 API 타입 정의
│   │   ├── one-time.ts         # 단건 결제
│   │   ├── billing.ts          # 정기결제 (빌링키)
│   │   └── refund.ts           # 환불/취소
│   ├── actions/
│   │   ├── create-order.ts     # 주문 생성 서버 액션
│   │   ├── confirm-payment.ts  # 결제 승인 서버 액션
│   │   ├── cancel-payment.ts   # 결제 취소 서버 액션
│   │   ├── create-subscription.ts   # 구독 생성
│   │   ├── cancel-subscription.ts   # 구독 취소
│   │   └── billing-webhook.ts       # 정기결제 웹훅 처리
│   ├── components/
│   │   ├── payment-button.tsx       # 결제 버튼
│   │   ├── pricing-table.tsx        # 요금제 테이블
│   │   ├── payment-history.tsx      # 결제 내역
│   │   ├── subscription-status.tsx  # 구독 상태 표시
│   │   └── billing-portal.tsx       # 빌링 관리 (구독 변경/취소)
│   ├── hooks/
│   │   ├── use-payment.ts
│   │   └── use-subscription.ts
│   ├── lib/
│   │   ├── order-id.ts         # 주문번호 생성 유틸
│   │   └── price-format.ts     # 가격 포맷팅
│   └── types.ts
├── package.json
└── tsconfig.json
```

## 3. 토스페이먼츠 API 클라이언트

```typescript
// toss/client.ts
const TOSS_API_URL = 'https://api.tosspayments.com/v1';

class TossClient {
  private secretKey: string;  // process.env.TOSS_SECRET_KEY

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(`${TOSS_API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new TossPaymentError(error.code, error.message);
    }
    return response.json();
  }

  // 결제 승인
  async confirmPayment(params: ConfirmPaymentParams): Promise<TossPayment> { ... }
  // 결제 취소
  async cancelPayment(paymentKey: string, params: CancelParams): Promise<TossPayment> { ... }
  // 빌링키 발급
  async issueBillingKey(params: BillingKeyParams): Promise<BillingKeyResponse> { ... }
  // 빌링키로 결제
  async payWithBillingKey(billingKey: string, params: BillingPayParams): Promise<TossPayment> { ... }
}

export const tossClient = new TossClient(process.env.TOSS_SECRET_KEY!);
```

## 4. 단건 결제 플로우

### 4.1 플로우

```
1. 클라이언트: 주문 생성 (createOrder)
   → payments 레코드 생성 (status: pending)
   → orderId 반환

2. 클라이언트: 토스 결제창 호출 (TossPayments SDK)
   → 유저가 결제 수행
   → 성공 시 /payment/success?orderId=xxx&paymentKey=xxx&amount=xxx 로 리다이렉트

3. 서버: 결제 승인 (confirmPayment)
   → 토스 API에 승인 요청
   → payments 레코드 업데이트 (status: paid, paymentKey, paidAt)
   → /payment/complete로 리다이렉트

4. 실패 시: /payment/fail?code=xxx&message=xxx
   → payments 상태를 failed로 업데이트
```

### 4.2 주문 생성

```typescript
// actions/create-order.ts
interface CreateOrderInput {
  planId?: string;           // 요금제 결제인 경우
  amount: number;            // 결제 금액 (원)
  orderName: string;         // '프로 요금제 1개월' 등
  metadata?: Record<string, unknown>;
}

interface CreateOrderResult {
  orderId: string;           // 고유 주문번호
  amount: number;
  orderName: string;
}

// orderId 형식: 'OMN_{timestamp}_{random}'
```

### 4.3 결제 승인

```typescript
// actions/confirm-payment.ts
interface ConfirmPaymentInput {
  orderId: string;
  paymentKey: string;
  amount: number;
}

// 1. payments 테이블에서 orderId 조회
// 2. amount 일치 검증 (위변조 방지)
// 3. tossClient.confirmPayment 호출
// 4. payments 업데이트: status=paid, paymentKey, method, receiptUrl, paidAt
// 5. 구독 결제인 경우 subscriptions 업데이트
```

## 5. 구독(정기결제) 플로우

### 5.1 플로우

```
1. 빌링키 발급
   → 토스 카드 등록 창 호출
   → 성공 시 billingKey 획득
   → subscriptions 레코드 생성

2. 첫 결제
   → billingKey로 즉시 결제
   → 성공 시 subscription.status = active

3. 갱신 결제 (서버 크론/웹훅)
   → currentPeriodEnd 도래 시
   → billingKey로 자동 결제
   → 성공: 기간 갱신
   → 실패: status = past_due, 재시도 (3회)

4. 구독 취소
   → cancelAtPeriodEnd = true
   → 현재 기간 종료 시 status = cancelled
```

### 5.2 구독 생성

```typescript
// actions/create-subscription.ts
interface CreateSubscriptionInput {
  planId: string;
  customerKey: string;       // = userId
  authKey: string;           // 토스 카드 인증 키
}

// 1. tossClient.issueBillingKey로 빌링키 발급
// 2. subscriptions 레코드 생성
// 3. 첫 결제 실행 (billingKey)
// 4. payments 레코드 생성
```

### 5.3 구독 취소

```typescript
// actions/cancel-subscription.ts
interface CancelSubscriptionInput {
  subscriptionId: string;
  immediate?: boolean;        // true: 즉시 취소, false: 기간 종료 시 취소 (기본)
}

// immediate=false: cancelAtPeriodEnd = true
// immediate=true: status = cancelled, 남은 기간 비례 환불
```

### 5.4 정기결제 처리 (Cron/Webhook)

```typescript
// actions/billing-webhook.ts
// Vercel Cron 또는 Supabase Edge Function으로 실행
// 매일 00:00 UTC

// 1. currentPeriodEnd <= now() AND status = 'active' 인 구독 조회
// 2. 각 구독에 대해 billingKey로 결제 시도
// 3. 성공: currentPeriodStart/End 갱신, payments 생성
// 4. 실패: 재시도 카운트 증가, 3회 실패 시 past_due
```

## 6. 환불

```typescript
// toss/refund.ts
interface RefundInput {
  paymentKey: string;
  cancelReason: string;
  cancelAmount?: number;      // 부분 환불 (미입력 시 전액)
}

// 1. tossClient.cancelPayment 호출
// 2. payments 업데이트:
//    - 전액: status = refunded
//    - 부분: status = partial_refunded, cancelAmount 기록
// 3. cancelledAt 기록
// 4. audit_logs에 기록
```

## 7. 컴포넌트

### PricingTable
```typescript
interface PricingTableProps {
  plans: Plan[];
  currentPlanId?: string;     // 현재 구독 중인 요금제
  onSelect: (planId: string) => void;
}

// - 요금제 카드 나열 (가격, 기능 목록, CTA 버튼)
// - 현재 플랜 하이라이트
// - 월간/연간 토글 (해당 시)
```

### PaymentButton
```typescript
interface PaymentButtonProps {
  amount: number;
  orderName: string;
  planId?: string;
  mode: 'one-time' | 'subscription';
  children?: React.ReactNode;
}

// 클릭 시:
// 1. createOrder 서버 액션 호출
// 2. TossPayments SDK 위젯 실행
// 토스 SDK는 <Script> 또는 동적 import로 로드
```

### PaymentHistory
```typescript
// 현재 유저의 결제 내역 테이블
// 컬럼: 주문명, 금액, 상태, 결제일, 영수증
// 상태 뱃지 색상: paid(green), refunded(red), pending(yellow)
```

### SubscriptionStatus
```typescript
// 현재 구독 상태 카드
// - 플랜명, 가격
// - 다음 결제일
// - 상태 (active/cancelled/past_due)
// - 취소 버튼
```

### BillingPortal
```typescript
// 빌링 관리 통합 페이지
// - 현재 구독 정보
// - 결제 수단 (마스킹된 카드 번호)
// - 플랜 변경
// - 구독 취소
// - 결제 내역
```

## 8. 환경 변수

```env
TOSS_SECRET_KEY=test_sk_xxx              # 토스 시크릿 키
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx  # 토스 클라이언트 키
TOSS_WEBHOOK_SECRET=xxx                   # 웹훅 시크릿 (선택)
```

## 9. 에러 처리

| 에러 코드 | 상황 | 메시지 |
|-----------|------|--------|
| `PAYMENT_AMOUNT_MISMATCH` | 금액 위변조 | 결제 금액이 일치하지 않습니다 |
| `PAYMENT_ALREADY_APPROVED` | 이미 승인된 결제 | 이미 처리된 결제입니다 |
| `PAYMENT_NOT_FOUND` | 주문 없음 | 결제 정보를 찾을 수 없습니다 |
| `PAYMENT_CANCEL_FAILED` | 토스 환불 실패 | 환불 처리에 실패했습니다 |
| `SUBSCRIPTION_NOT_FOUND` | 구독 없음 | 구독 정보를 찾을 수 없습니다 |
| `SUBSCRIPTION_ALREADY_CANCELLED` | 이미 취소된 구독 | 이미 취소된 구독입니다 |
| `BILLING_KEY_FAILED` | 빌링키 발급 실패 | 카드 등록에 실패했습니다 |

## 10. 의존성

```json
{
  "dependencies": {},
  "peerDependencies": {
    "next": "^15",
    "react": "^19",
    "@ohmynextjs/core": "workspace:*",
    "@ohmynextjs/db": "workspace:*",
    "@ohmynextjs/auth": "workspace:*"
  }
}
```

토스페이먼츠 SDK는 `apps/web`에서 `<Script src="https://js.tosspayments.com/v2/standard">` 로 로드.

## 11. Export

```typescript
export { tossClient } from './toss/client';
export { createOrder, confirmPayment, cancelPayment } from './actions';
export { createSubscription, cancelSubscription } from './actions';
export { PaymentButton, PricingTable, PaymentHistory, SubscriptionStatus, BillingPortal } from './components';
export { usePayment, useSubscription } from './hooks';
export { generateOrderId, formatPrice } from './lib';
export type * from './types';
```

## 12. 구현 우선순위

1. 토스 API 클라이언트
2. 단건 결제 (주문 생성 → 승인)
3. 결제 내역 조회
4. 환불
5. 구독 (빌링키 → 정기결제)
6. 컴포넌트 (PricingTable → PaymentButton → 나머지)
