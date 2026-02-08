# API — 전체 API 엔드포인트 목록

## 1. 목적과 범위

`apps/web/app/api/` 하위의 모든 Route Handler와 Server Action을 정의한다.

## 2. API 설계 원칙

- **Server Actions 우선**: 폼 제출, 데이터 변경은 Server Actions 사용
- **Route Handlers**: 외부 콜백, 웹훅, 파일 다운로드 등에만 사용
- **인증**: 모든 보호된 엔드포인트는 Supabase 세션 검증
- **응답 형식**: 통일된 JSON 구조

```typescript
// 성공
{ data: T }

// 에러
{ error: { code: string, message: string, details?: unknown } }
```

## 3. Route Handlers

### 3.1 인증

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| `GET` | `/api/auth/callback` | OAuth 콜백 처리 | 불필요 |
| `GET` | `/api/auth/confirm` | 이메일 확인 콜백 | 불필요 |

#### GET /api/auth/callback
```
Query: code (string), next? (string)
동작:
1. code를 세션으로 교환 (supabase.auth.exchangeCodeForSession)
2. users 테이블 upsert
3. redirect to {next || '/dashboard'}
에러: 코드 무효 → redirect to /auth/login?error=auth_callback_failed
```

#### GET /api/auth/confirm
```
Query: token_hash (string), type ('signup' | 'recovery')
동작:
1. supabase.auth.verifyOtp({ token_hash, type })
2. type=signup → redirect to /dashboard
3. type=recovery → redirect to /auth/reset-password
```

### 3.2 결제

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| `POST` | `/api/payment/confirm` | 결제 승인 (토스 리다이렉트 후) | 필요 |
| `POST` | `/api/payment/webhook` | 토스 웹훅 수신 | 웹훅 시크릿 |

#### POST /api/payment/confirm
```typescript
Body: {
  orderId: string;
  paymentKey: string;
  amount: number;
}

Response (성공): { data: { paymentId: string, status: 'paid' } }
Response (에러): { error: { code: 'PAYMENT_AMOUNT_MISMATCH', message: '...' } }

동작:
1. 세션에서 userId 추출
2. payments 테이블에서 orderId 조회, amount 검증
3. tossClient.confirmPayment 호출
4. payments 업데이트
5. 구독 결제인 경우 subscriptions 업데이트
```

#### POST /api/payment/webhook
```typescript
Headers: { 'TossPayments-Signature': string }
Body: TossWebhookEvent

동작:
1. 서명 검증
2. 이벤트 타입별 처리:
   - PAYMENT_STATUS_CHANGED: payments 상태 동기화
   - BILLING_KEY_STATUS_CHANGED: 빌링키 상태 동기화
```

### 3.3 Cron

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| `GET` | `/api/cron/billing` | 정기결제 처리 | CRON_SECRET |

#### GET /api/cron/billing
```
Headers: { Authorization: 'Bearer {CRON_SECRET}' }

동작:
1. 만료된 활성 구독 조회
2. 각 구독에 billingKey로 결제
3. 성공: 기간 갱신
4. 실패: past_due 처리
```

### 3.4 관리자

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| `GET` | `/api/admin/export/users` | 유저 CSV 내보내기 | admin |
| `GET` | `/api/admin/export/payments` | 결제 CSV 내보내기 | admin |

## 4. Server Actions

### 4.1 인증 액션

| 액션 | 파일 | 설명 |
|------|------|------|
| `signIn(email, password)` | `packages/auth/src/actions/sign-in.ts` | 이메일 로그인 |
| `signUp(email, password, name?)` | `packages/auth/src/actions/sign-up.ts` | 회원가입 |
| `signOut()` | `packages/auth/src/actions/sign-out.ts` | 로그아웃 |
| `signInWithOAuth(provider)` | `packages/auth/src/actions/oauth.ts` | 소셜 로그인 |
| `resetPassword(email)` | `packages/auth/src/actions/reset-password.ts` | 비밀번호 재설정 메일 |
| `updatePassword(password)` | `packages/auth/src/actions/reset-password.ts` | 새 비밀번호 설정 |

### 4.2 결제 액션

| 액션 | 파일 | 설명 |
|------|------|------|
| `createOrder(input)` | `packages/payment/src/actions/create-order.ts` | 주문 생성 |
| `cancelPayment(paymentId, reason, amount?)` | `packages/payment/src/actions/cancel-payment.ts` | 결제 취소/환불 |
| `createSubscription(planId, authKey)` | `packages/payment/src/actions/create-subscription.ts` | 구독 생성 |
| `cancelSubscription(subscriptionId, immediate?)` | `packages/payment/src/actions/cancel-subscription.ts` | 구독 취소 |

### 4.3 관리자 액션

| 액션 | 파일 | 설명 |
|------|------|------|
| `getAdminStats()` | `packages/admin/src/lib/admin-actions.ts` | 대시보드 통계 |
| `getRevenueChart(months)` | 같은 파일 | 매출 차트 데이터 |
| `getUserGrowthChart(days)` | 같은 파일 | 유저 증가 데이터 |
| `getRecentActivity(limit)` | 같은 파일 | 최근 감사 로그 |
| `getUsers(filters, page, pageSize)` | 같은 파일 | 유저 목록 |
| `updateUserRole(userId, role)` | 같은 파일 | 역할 변경 |
| `updateUserStatus(userId, status)` | 같은 파일 | 밴/활성화 |
| `deleteUser(userId)` | 같은 파일 | 유저 삭제 |
| `getPayments(filters, page, pageSize)` | 같은 파일 | 결제 목록 |
| `refundPayment(paymentId, amount?, reason)` | 같은 파일 | 환불 처리 |
| `getSettings()` | 같은 파일 | 설정 목록 |
| `updateSetting(key, value)` | 같은 파일 | 설정 수정 |
| `createSetting(key, value, desc, isPublic)` | 같은 파일 | 설정 생성 |
| `deleteSetting(key)` | 같은 파일 | 설정 삭제 |

### 4.4 사용자 프로필 액션

| 액션 | 파일 | 설명 |
|------|------|------|
| `updateProfile(name, avatarUrl?)` | `apps/web/app/actions/profile.ts` | 프로필 수정 |
| `getMyPayments(page, pageSize)` | `apps/web/app/actions/billing.ts` | 내 결제 내역 |
| `getMySubscription()` | `apps/web/app/actions/billing.ts` | 내 구독 정보 |

## 5. Input 유효성 검증

모든 Server Action과 Route Handler는 zod 스키마로 입력 검증:

```typescript
// 예시
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
});

const createOrderSchema = z.object({
  amount: z.number().int().positive('금액은 0보다 커야 합니다'),
  orderName: z.string().min(1).max(100),
  planId: z.string().uuid().optional(),
});

const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['admin', 'user']),
});
```

## 6. 미들웨어 체인

```
요청 → Next.js Middleware
  → 세션 갱신 (토큰 리프레시)
  → 보호된 라우트 체크
  → admin 라우트 role 체크
  → Route Handler / Page
```

## 7. 테스트 전략

| 대상 | 유형 | 주요 케이스 |
|------|------|------------|
| `GET /api/auth/callback` | 통합 (Vitest) | 유효한 code → 세션 교환, 무효 code → 에러 리다이렉트 |
| `GET /api/auth/confirm` | 통합 | signup 확인, recovery 리다이렉트 |
| `POST /api/payment/confirm` | 통합 (MSW) | 금액 검증, 토스 승인 성공/실패, 미인증 거부 |
| `POST /api/payment/webhook` | 통합 | 서명 검증, 이벤트별 처리, 잘못된 서명 거부 |
| `GET /api/cron/billing` | 통합 | 만료 구독 결제, 실패 재시도, CRON_SECRET 검증 |
| `GET /api/admin/export/*` | 통합 | CSV 생성, admin 인증, 일반 유저 거부 |
| zod 스키마 | 단위 | 유효/무효 입력, 에지 케이스, 타입 변환 |
| Server Action 인증 | 단위 | requireAuth 성공/실패, requireAdmin 성공/실패 |

### 모킹 전략
- 외부 API (토스, Supabase Auth): MSW로 HTTP 레벨 모킹
- DB: 테스트 DB 또는 vitest mock
- 인증: Supabase 클라이언트 mock

## 8. 보안 고려사항

- **모든 Route Handler/Server Action에 인증**: 미들웨어 + 함수 내부 이중 체크
- **zod 검증 필수**: 모든 사용자 입력 (body, query, params)
- **웹훅 서명 검증**: 토스 웹훅, Cron 시크릿
- **CORS**: Next.js 기본 설정 (같은 도메인만 허용)
- **에러 노출 제한**: 프로덕션에서 `details` 필드 비활성화
- **요청 크기 제한**: body-parser 기본값 활용

## 9. Rate Limiting (권장)

| 엔드포인트 | 제한 |
|-----------|------|
| `/api/auth/*` | 10회/분 (IP 기준) |
| `/api/payment/*` | 5회/분 (유저 기준) |
| `/api/admin/*` | 30회/분 (유저 기준) |

Vercel Edge Middleware 또는 `@upstash/ratelimit` 사용 권장.
