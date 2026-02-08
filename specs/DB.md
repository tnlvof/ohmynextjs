# DB — 데이터베이스 스키마 전체 설계

## 1. 목적과 범위

Drizzle ORM 기반 전체 DB 스키마를 정의한다. Supabase(PostgreSQL) 위에서 동작하며, 모든 테이블, 관계, 인덱스, enum을 포함한다.

## 2. 패키지 구조

```
packages/db/
├── src/
│   ├── index.ts            # Public API
│   ├── client.ts           # Drizzle 클라이언트 생성
│   ├── schema/
│   │   ├── index.ts        # 모든 스키마 re-export
│   │   ├── users.ts        # users 테이블
│   │   ├── payments.ts     # payments 테이블
│   │   ├── subscriptions.ts # subscriptions 테이블
│   │   ├── plans.ts        # plans (요금제) 테이블
│   │   ├── settings.ts     # app_settings 테이블
│   │   ├── audit-logs.ts   # audit_logs 테이블
│   │   └── enums.ts        # 공통 enum 정의
│   ├── relations.ts        # Drizzle relations 정의
│   └── seed.ts             # 시드 데이터
├── drizzle/
│   └── migrations/         # 자동 생성 마이그레이션 파일
├── drizzle.config.ts       # Drizzle Kit 설정
├── package.json
└── tsconfig.json
```

## 3. Enum 정의

```typescript
// schema/enums.ts
import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'banned', 'deleted']);
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', 'paid', 'failed', 'cancelled', 'refunded', 'partial_refunded'
]);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', 'cancelled', 'past_due', 'expired', 'trialing'
]);
export const paymentMethodEnum = pgEnum('payment_method', [
  'card', 'virtual_account', 'transfer', 'mobile'
]);
```

## 4. 테이블 설계

### 4.1 users

Supabase Auth의 `auth.users`와 연동하는 프로필 테이블.

```typescript
// schema/users.ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),                          // = auth.users.id
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').default('user').notNull(),
  status: userStatusEnum('status').default('active').notNull(),
  provider: text('provider'),                            // 'google', 'kakao', 'github', 'naver', 'email'
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  lastSignInAt: timestamp('last_sign_in_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
  statusIdx: index('users_status_idx').on(table.status),
  createdAtIdx: index('users_created_at_idx').on(table.createdAt),
}));
```

### 4.2 plans (요금제)

```typescript
export const plans = pgTable('plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),                          // 'Basic', 'Pro', 'Enterprise'
  slug: text('slug').notNull().unique(),                 // 'basic', 'pro', 'enterprise'
  description: text('description'),
  price: integer('price').notNull(),                     // 원 단위 (예: 9900)
  currency: text('currency').default('KRW').notNull(),
  interval: text('interval').notNull(),                  // 'month', 'year', 'once'
  intervalCount: integer('interval_count').default(1).notNull(),
  features: jsonb('features').$type<string[]>(),         // 기능 목록
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('plans_slug_idx').on(table.slug),
  activeIdx: index('plans_active_idx').on(table.isActive),
}));
```

### 4.3 payments (결제 내역)

```typescript
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id').references(() => plans.id),
  orderId: text('order_id').notNull().unique(),          // 토스 orderId
  paymentKey: text('payment_key').unique(),              // 토스 paymentKey
  amount: integer('amount').notNull(),                   // 결제 금액 (원)
  currency: text('currency').default('KRW').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  method: paymentMethodEnum('method'),
  receiptUrl: text('receipt_url'),                       // 영수증 URL
  failReason: text('fail_reason'),
  cancelReason: text('cancel_reason'),
  cancelAmount: integer('cancel_amount'),                // 부분 환불 금액
  paidAt: timestamp('paid_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index('payments_user_id_idx').on(table.userId),
  orderIdx: uniqueIndex('payments_order_id_idx').on(table.orderId),
  statusIdx: index('payments_status_idx').on(table.status),
  createdAtIdx: index('payments_created_at_idx').on(table.createdAt),
}));
```

### 4.4 subscriptions (구독)

```typescript
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id').notNull().references(() => plans.id),
  billingKey: text('billing_key'),                       // 토스 빌링키
  status: subscriptionStatusEnum('status').default('active').notNull(),
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }).notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false).notNull(),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  trialStart: timestamp('trial_start', { withTimezone: true }),
  trialEnd: timestamp('trial_end', { withTimezone: true }),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index('subscriptions_user_id_idx').on(table.userId),
  statusIdx: index('subscriptions_status_idx').on(table.status),
  periodEndIdx: index('subscriptions_period_end_idx').on(table.currentPeriodEnd),
}));
```

### 4.5 app_settings (앱 설정)

```typescript
export const appSettings = pgTable('app_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').notNull().unique(),                   // 'site_name', 'maintenance_mode' 등
  value: jsonb('value').notNull(),                       // 아무 JSON 값
  description: text('description'),
  isPublic: boolean('is_public').default(false).notNull(), // 클라이언트 노출 여부
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  keyIdx: uniqueIndex('app_settings_key_idx').on(table.key),
}));
```

### 4.6 audit_logs (감사 로그)

```typescript
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: text('action').notNull(),                      // 'user.ban', 'payment.refund' 등
  target: text('target'),                                // 대상 리소스 종류
  targetId: text('target_id'),                           // 대상 리소스 ID
  details: jsonb('details').$type<Record<string, unknown>>(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index('audit_logs_user_id_idx').on(table.userId),
  actionIdx: index('audit_logs_action_idx').on(table.action),
  createdAtIdx: index('audit_logs_created_at_idx').on(table.createdAt),
}));
```

## 5. Relations (Drizzle Relations)

```typescript
// relations.ts
export const usersRelations = relations(users, ({ many }) => ({
  payments: many(payments),
  subscriptions: many(subscriptions),
  auditLogs: many(auditLogs),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  payments: many(payments),
  subscriptions: many(subscriptions),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  plan: one(plans, { fields: [payments.planId], references: [plans.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));
```

## 6. Drizzle 클라이언트

```typescript
// client.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
export type Database = typeof db;
```

## 7. Drizzle Config

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## 8. 시드 데이터

```typescript
// seed.ts — 기본 시드
// 1. 기본 plans: Free, Pro, Enterprise
// 2. 기본 app_settings: site_name, maintenance_mode, etc.
// 3. 테스트용 admin 유저 (개발 환경)
```

## 9. 마이그레이션 스크립트

```json
// package.json scripts
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio",
  "db:seed": "tsx src/seed.ts"
}
```

## 10. 의존성

```json
{
  "dependencies": {
    "drizzle-orm": "^0.38",
    "postgres": "^3.4"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30"
  }
}
```

## 11. Export (Public API)

```typescript
// index.ts
export { db, type Database } from './client';
export * from './schema';
export * from './relations';
```

## 12. Postgres Best Practices 적용

> 상세: [POSTGRES-BEST-PRACTICES.md](./POSTGRES-BEST-PRACTICES.md)

### 12.1 인덱스 전략

| 전략 | 적용 대상 | 예시 |
|------|----------|------|
| **단일 인덱스** | 모든 FK 컬럼, WHERE 빈도 높은 컬럼 | `payments_user_id_idx`, `users_email_idx` |
| **복합 인덱스** | 자주 함께 필터링되는 컬럼 | `(status, created_at)` — equality 먼저, range 나중 |
| **Partial 인덱스** | soft-delete, 상태 필터 | `WHERE status = 'pending'`, `WHERE deleted_at IS NULL` |
| **Covering 인덱스** | SELECT 컬럼까지 인덱스 포함 | `(email) INCLUDE (name, created_at)` |
| **BRIN** | 시계열 대용량 | `audit_logs(created_at)` — 100M+ 행 시 |
| **GIN** | JSONB, 배열, 전문검색 | `metadata` 컬럼 검색 시 |

**현재 스키마 인덱스 점검:**
- ✅ 모든 FK에 인덱스 (payments.user_id, subscriptions.user_id 등)
- ✅ 자주 조회하는 컬럼 (email, status, created_at)
- ⬜ 복합 인덱스 추가 고려: `payments(status, created_at)`, `subscriptions(status, currentPeriodEnd)`
- ⬜ audit_logs 대용량 시 BRIN 인덱스 전환

### 12.2 RLS 정책

모든 테이블에 RLS 활성화 + FORCE 적용:

```sql
-- 성능 최적화된 RLS 패턴 (auth.uid()를 SELECT로 래핑 → 1회만 호출)
CREATE POLICY "users_select" ON users
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

CREATE POLICY "payments_select" ON payments
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- admin 역할은 별도 정책
CREATE POLICY "admin_all" ON users
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM users WHERE id = (SELECT auth.uid())) = 'admin'
  );
```

### 12.3 커넥션 풀링

```typescript
// client.ts — Supabase Transaction 모드 풀링 최적화
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,     // Transaction 모드 필수
  max: 10,            // 앱 레벨 풀 (CPU cores * 2 + 1)
  idle_timeout: 20,   // 유휴 커넥션 정리
});
```

- Supabase 포트 6543 (Transaction 모드) 사용
- `prepare: false` 필수 (prepared statement 충돌 방지)
- Vercel Serverless 환경에서 커넥션 폭증 방지

### 12.4 쿼리 최적화 가이드

| 규칙 | 설명 | 적용 |
|------|------|------|
| **N+1 제거** | 루프 안에서 쿼리 금지 | Drizzle `with` relations 사용 |
| **커서 페이지네이션** | OFFSET 대신 WHERE > cursor | 관리자 목록, 로그 조회 |
| **짧은 트랜잭션** | 외부 API는 트랜잭션 밖 | 결제 확인 → DB 업데이트 분리 |
| **배치 INSERT** | 다건 삽입은 배열로 | `db.insert(table).values([...])` |
| **UPSERT** | 중복 체크+삽입 원자적 | `onConflictDoUpdate` |

## 13. 에러 처리

- DB 연결 실패 시 명확한 에러 메시지 (`DATABASE_URL` 미설정 등)
- unique constraint 위반 시 사용자 친화적 메시지 변환
- 마이그레이션 실패 시 롤백 가이드 제공

## 14. 테스트 전략

| 대상 | 유형 | 주요 케이스 |
|------|------|------------|
| 스키마 | 통합 (테스트 DB) | 마이그레이션 적용, 테이블/컬럼 존재 확인 |
| users CRUD | 통합 | 생성, 조회, 수정, 삭제, unique 위반 |
| payments CRUD | 통합 | 생성, 상태 변경, FK 관계, 금액 계산 |
| subscriptions | 통합 | 생성, 기간 갱신, 취소, 만료 조회 |
| 관계 조회 | 통합 | user → payments, user → subscriptions |
| 인덱스 | 통합 | 쿼리 성능 확인 (EXPLAIN) |
| seed | 통합 | 시드 데이터 삽입, 중복 실행 안전성 |

### 테스트 DB 설정
- Docker Compose로 별도 PostgreSQL 인스턴스 (포트 5433)
- 테스트 전 마이그레이션 적용, 테스트 후 데이터 정리
- 상세: [TESTING.md](./TESTING.md) §7 참고

## 15. 보안 고려사항

- **RLS 필수**: 모든 테이블에 Row Level Security 활성화
- **service_role key**: 서버 전용, 클라이언트 노출 절대 금지
- **SQL Injection 방지**: Drizzle ORM만 사용, raw SQL 금지 (불가피 시 `sql` 태그)
- **민감 데이터**: `metadata` 컬럼에 PII 저장 시 접근 제어 강화
- **audit_logs**: 보안 이벤트 기록용, 삭제 불가 정책 권장
- **인덱스**: 개인정보 컬럼(email) 인덱스 존재 확인, 필요 시 partial index

## 16. Supabase RLS (Row Level Security)

Supabase 사용 시 RLS 정책도 마이그레이션에 포함:

```sql
-- users: 본인 레코드만 읽기/수정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- admin은 모든 테이블 접근 가능 (service_role key 사용)
```
