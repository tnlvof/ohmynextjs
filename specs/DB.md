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

## 12. 에러 처리

- DB 연결 실패 시 명확한 에러 메시지 (`DATABASE_URL` 미설정 등)
- unique constraint 위반 시 사용자 친화적 메시지 변환
- 마이그레이션 실패 시 롤백 가이드 제공

## 13. Supabase RLS (Row Level Security)

Supabase 사용 시 RLS 정책도 마이그레이션에 포함:

```sql
-- users: 본인 레코드만 읽기/수정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- admin은 모든 테이블 접근 가능 (service_role key 사용)
```
