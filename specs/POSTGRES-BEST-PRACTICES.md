# Postgres Best Practices — Supabase 30 Rules for OhMyNextJS

> 출처: [supabase/agent-skills](https://github.com/supabase/agent-skills) — supabase-postgres-best-practices v1.1.0
> 적용 대상: Drizzle ORM + Supabase + Next.js 15

---

## 목차

1. [Query Performance (CRITICAL)](#1-query-performance-critical)
2. [Connection Management (CRITICAL)](#2-connection-management-critical)
3. [Security & RLS (CRITICAL)](#3-security--rls-critical)
4. [Schema Design (HIGH)](#4-schema-design-high)
5. [Concurrency & Locking (MEDIUM-HIGH)](#5-concurrency--locking-medium-high)
6. [Data Access Patterns (MEDIUM)](#6-data-access-patterns-medium)
7. [Monitoring & Diagnostics (LOW-MEDIUM)](#7-monitoring--diagnostics-low-medium)
8. [Advanced Features (LOW)](#8-advanced-features-low)
9. [Drizzle ORM 적용 가이드](#9-drizzle-orm-적용-가이드)

---

## 1. Query Performance (CRITICAL)

### 1.1 WHERE/JOIN 컬럼에 인덱스 추가 (`query-missing-indexes`)
- **Impact**: 100-1000x 빠른 쿼리
- 인덱스 없는 컬럼 필터링 → Full Table Scan
- FK 컬럼은 반드시 인덱스 생성

```sql
-- ❌ 인덱스 없이 필터링
SELECT * FROM orders WHERE customer_id = 123; -- Seq Scan

-- ✅ 인덱스 생성
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
```

**Drizzle 적용:**
```typescript
export const orders = pgTable('orders', {
  // ...
  userId: uuid('user_id').notNull().references(() => users.id),
}, (table) => ({
  userIdx: index('orders_user_id_idx').on(table.userId),
}));
```

### 1.2 복합 인덱스 (`query-composite-indexes`)
- **Impact**: 5-10x 빠른 멀티 컬럼 쿼리
- **규칙**: equality 컬럼 먼저, range 컬럼 나중에 (leftmost prefix rule)

```sql
-- ✅ status(=) 먼저, created_at(>) 나중
CREATE INDEX orders_status_created_idx ON orders (status, created_at);
```

**Drizzle 적용:**
```typescript
(table) => ({
  statusCreatedIdx: index('payments_status_created_idx').on(table.status, table.createdAt),
})
```

### 1.3 커버링 인덱스 (`query-covering-indexes`)
- **Impact**: 2-5x 빠른 쿼리 (heap fetch 제거)
- `INCLUDE`로 SELECT 컬럼 포함 → Index-Only Scan

```sql
-- ✅ email로 검색, name과 created_at도 인덱스에서 바로 반환
CREATE INDEX users_email_idx ON users (email) INCLUDE (name, created_at);
```

### 1.4 Partial 인덱스 (`query-partial-indexes`)
- **Impact**: 5-20x 작은 인덱스, 빠른 쓰기/읽기
- 특정 조건의 행만 인덱싱

```sql
-- ✅ pending 상태만 인덱싱 (전체의 5%만)
CREATE INDEX orders_pending_idx ON orders (created_at) WHERE status = 'pending';

-- ✅ soft delete 패턴
CREATE INDEX users_active_email_idx ON users (email) WHERE deleted_at IS NULL;
```

### 1.5 인덱스 타입 선택 (`query-index-types`)
- **Impact**: 10-100x (올바른 타입 선택 시)

| 타입 | 용도 | 연산자 |
|------|------|--------|
| B-tree (기본) | =, <, >, BETWEEN, IN | 범용 |
| GIN | JSONB, 배열, 전문검색 | @>, ?, ?& |
| BRIN | 시계열 대용량 (10-100x 작은 인덱스) | 범위 |
| Hash | equality only (B-tree보다 약간 빠름) | = |

```sql
-- audit_logs처럼 시계열 대용량 테이블엔 BRIN
CREATE INDEX audit_logs_created_idx ON audit_logs USING brin (created_at);
```

---

## 2. Connection Management (CRITICAL)

### 2.1 커넥션 풀링 필수 (`conn-pooling`)
- **Impact**: 10-100x 더 많은 동시 사용자 처리
- Postgres 커넥션당 1-3MB RAM 소비
- Supabase는 내장 PgBouncer 제공 (포트 6543 = Transaction 모드)

**ohmynextjs 적용** (`packages/db/src/client.ts`):
```typescript
import postgres from 'postgres';

// Transaction 모드 풀러 사용 (포트 6543)
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,  // Transaction 모드에서 prepared statement 비활성화
  max: 10,         // 앱 레벨 풀 사이즈 (CPU cores * 2 + 1)
});
```

### 2.2 커넥션 제한 설정 (`conn-limits`)
- **Impact**: DB 크래시 방지
- 공식: `max_connections = RAM / 5MB - reserved`
- 실무: 100-200이 대부분 적절

### 2.3 Idle 커넥션 타임아웃 (`conn-idle-timeout`)
- **Impact**: 30-50% 커넥션 슬롯 회수

```sql
ALTER SYSTEM SET idle_in_transaction_session_timeout = '30s';
ALTER SYSTEM SET idle_session_timeout = '10min';
```

### 2.4 Prepared Statement + 풀링 주의 (`conn-prepared-statements`)
- **Impact**: Transaction 모드에서 prepared statement 충돌 방지
- `{ prepare: false }` 필수 (이미 DB.md client.ts에 적용됨 ✅)

---

## 3. Security & RLS (CRITICAL)

### 3.1 RLS 필수 활성화 (`security-rls-basics`)
- **Impact**: DB 레벨 데이터 격리
- 애플리케이션 필터링만으로는 부족 → RLS로 강제

```sql
-- ✅ 모든 테이블에 RLS 활성화
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

-- Supabase auth.uid() 사용
CREATE POLICY orders_user_policy ON orders
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()));  -- SELECT 래핑으로 1회만 호출
```

### 3.2 RLS 성능 최적화 (`security-rls-performance`)
- **Impact**: 5-10x 빠른 RLS 쿼리

```sql
-- ❌ auth.uid()가 매 행마다 호출됨
USING (auth.uid() = user_id);

-- ✅ SELECT로 래핑 → 1회 호출, 캐싱
USING ((SELECT auth.uid()) = user_id);
```

- RLS 정책에 사용되는 컬럼에 반드시 인덱스 추가
- 복잡한 검사는 `SECURITY DEFINER` 함수로 분리

### 3.3 최소 권한 원칙 (`security-privileges`)
- **Impact**: 공격 표면 축소
- `service_role`은 서버 전용, 클라이언트에 절대 노출 금지
- 테이블별 최소 권한만 부여

---

## 4. Schema Design (HIGH)

### 4.1 적절한 데이터 타입 (`schema-data-types`)
- **Impact**: 50% 스토리지 절감

| 규칙 | 적용 |
|------|------|
| ID → `bigint` or `uuid` | `int` 오버플로 방지 |
| 문자열 → `text` | `varchar(n)` 불필요 |
| 시간 → `timestamptz` | `timestamp` 타임존 누락 방지 |
| 금액 → `numeric(10,2)` or `integer` (원 단위) | `float` 정밀도 손실 방지 |
| 불린 → `boolean` | `varchar(5)` 낭비 |

**ohmynextjs 현황**: DB.md에서 이미 `uuid`, `text`, `timestamptz`, `integer`(원 단위) 사용 중 ✅

### 4.2 FK 인덱스 필수 (`schema-foreign-key-indexes`)
- **Impact**: 10-100x 빠른 JOIN, CASCADE
- Postgres는 FK에 자동 인덱스 생성 안 함!
- **ohmynextjs 현황**: payments, subscriptions, audit_logs 모두 FK 인덱스 있음 ✅

### 4.3 Primary Key 전략 (`schema-primary-keys`)
- **Impact**: 인덱스 locality, fragmentation 감소
- `bigint identity` (단일 DB) 또는 `UUIDv7` (분산)
- **ohmynextjs 현황**: `uuid().defaultRandom()` 사용 중 → UUIDv4로 fragmentation 가능성 있음
- **권장**: `gen_random_uuid()` 대신 UUIDv7 고려 (pg_uuidv7 확장) 또는 현재 규모에서는 허용

### 4.4 소문자 식별자 (`schema-lowercase-identifiers`)
- Drizzle ORM은 기본적으로 snake_case 생성 → 이미 준수 ✅

### 4.5 파티셔닝 (`schema-partitioning`)
- **Impact**: 5-20x 빠른 쿼리 (대용량)
- 100M+ 행 테이블에 적용
- **ohmynextjs 적용**: `audit_logs`가 커질 경우 `created_at` 기준 월별 파티셔닝 고려

---

## 5. Concurrency & Locking (MEDIUM-HIGH)

### 5.1 짧은 트랜잭션 유지 (`lock-short-transactions`)
- **Impact**: 3-5x 처리량 향상
- 외부 API 호출(결제 등)은 트랜잭션 밖에서 처리
- `statement_timeout = '30s'` 설정 권장

```typescript
// ❌ 트랜잭션 안에서 결제 API 호출
await db.transaction(async (tx) => {
  const order = await tx.select()...;
  await tossPayments.confirm(paymentKey); // 2-5초 블록!
  await tx.update(payments).set({ status: 'paid' });
});

// ✅ 결제 확인 후 트랜잭션은 DB 업데이트만
const result = await tossPayments.confirm(paymentKey);
await db.transaction(async (tx) => {
  await tx.update(payments).set({ status: 'paid', paidAt: new Date() }).where(...);
});
```

### 5.2 데드락 방지 (`lock-deadlock-prevention`)
- 일관된 순서로 락 획득 (ID 오름차순)
- 가능하면 단일 statement로 원자적 업데이트

### 5.3 SKIP LOCKED 큐 패턴 (`lock-skip-locked`)
- **Impact**: 10x 큐 처리 성능
- 워커 다수가 동시에 작업 처리 시 사용

```sql
UPDATE jobs SET status = 'processing', worker_id = $1
WHERE id = (
  SELECT id FROM jobs WHERE status = 'pending'
  ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED
) RETURNING *;
```

### 5.4 Advisory Lock (`lock-advisory`)
- 애플리케이션 레벨 조율 (예: 리포트 생성 중복 방지)
- `pg_advisory_xact_lock(hashtext('resource'))` — 트랜잭션 범위 자동 해제

---

## 6. Data Access Patterns (MEDIUM)

### 6.1 N+1 쿼리 제거 (`data-n-plus-one`)
- **Impact**: 10-100x 라운드트립 감소

```typescript
// ❌ N+1
const users = await db.select().from(usersTable).where(...);
for (const user of users) {
  const orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, user.id));
}

// ✅ JOIN 또는 Drizzle relations
const usersWithOrders = await db.query.users.findMany({
  with: { payments: true },
  where: ...,
});
```

### 6.2 커서 기반 페이지네이션 (`data-pagination`)
- **Impact**: O(1) 성능 (깊은 페이지에서도)
- OFFSET 대신 WHERE + ORDER BY + LIMIT

```typescript
// ✅ 커서 페이지네이션
const nextPage = await db.select()
  .from(payments)
  .where(gt(payments.createdAt, lastCursor))
  .orderBy(asc(payments.createdAt))
  .limit(20);
```

### 6.3 배치 INSERT (`data-batch-inserts`)
- **Impact**: 10-50x 빠른 벌크 삽입

```typescript
// ✅ Drizzle 배치 삽입
await db.insert(auditLogs).values([
  { action: 'login', userId: '...' },
  { action: 'login', userId: '...' },
  // ... 최대 ~1000건씩
]);
```

### 6.4 UPSERT (`data-upsert`)
- **Impact**: 원자적 insert-or-update, 레이스 컨디션 제거

```typescript
// ✅ Drizzle onConflictDoUpdate
await db.insert(appSettings)
  .values({ key: 'theme', value: 'dark' })
  .onConflictDoUpdate({
    target: appSettings.key,
    set: { value: 'dark', updatedAt: new Date() },
  });
```

---

## 7. Monitoring & Diagnostics (LOW-MEDIUM)

### 7.1 EXPLAIN ANALYZE (`monitor-explain-analyze`)
- 느린 쿼리의 실제 병목 식별
- Seq Scan, Rows Removed by Filter, 높은 loops 확인

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE customer_id = 123 AND status = 'pending';
```

### 7.2 pg_stat_statements (`monitor-pg-stat-statements`)
- 전체 쿼리 통계 추적 (빈도, 평균 시간)
- Supabase에서 기본 활성화

```sql
-- 가장 느린 쿼리 Top 10
SELECT calls, round(mean_exec_time::numeric, 2) as mean_ms, query
FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
```

### 7.3 VACUUM & ANALYZE (`monitor-vacuum-analyze`)
- **Impact**: 2-10x 더 나은 쿼리 플랜
- Supabase는 autovacuum 기본 활성화
- 대량 데이터 변경 후 수동 `ANALYZE` 권장

---

## 8. Advanced Features (LOW)

### 8.1 Full-Text Search (`advanced-full-text-search`)
- **Impact**: `LIKE '%term%'`보다 100x 빠름
- `tsvector` + GIN 인덱스 사용

```sql
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))) STORED;
CREATE INDEX articles_search_idx ON articles USING gin (search_vector);
```

### 8.2 JSONB 인덱싱 (`advanced-jsonb-indexing`)
- **Impact**: 10-100x 빠른 JSONB 쿼리
- GIN 인덱스 (`jsonb_path_ops`로 2-3x 작은 인덱스)

```sql
-- containment(@>) 쿼리용
CREATE INDEX idx ON products USING gin (attributes jsonb_path_ops);

-- 특정 키 조회용
CREATE INDEX idx ON products ((attributes->>'brand'));
```

---

## 9. Drizzle ORM 적용 가이드

### 9.1 커넥션 설정 (DB.md 연계)

```typescript
// packages/db/src/client.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,     // Supabase Transaction 모드 풀링 호환
  max: 10,            // 앱 레벨 커넥션 풀
  idle_timeout: 20,   // 유휴 커넥션 정리 (초)
});

export const db = drizzle(client, { schema });
```

### 9.2 인덱스 전략 체크리스트

| 체크 | 항목 |
|------|------|
| ✅ | 모든 FK 컬럼에 인덱스 |
| ✅ | WHERE 절 자주 사용하는 컬럼에 인덱스 |
| ⬜ | 자주 함께 필터링되는 컬럼은 복합 인덱스 |
| ⬜ | soft-delete 패턴은 partial 인덱스 |
| ⬜ | JSONB 검색 시 GIN 인덱스 |
| ⬜ | 시계열 대용량 테이블은 BRIN 인덱스 |

### 9.3 RLS 정책 패턴

```sql
-- 모든 사용자 테이블 공통 패턴
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {table} FORCE ROW LEVEL SECURITY;

-- SELECT 래핑으로 auth.uid() 1회만 호출 (성능 최적화)
CREATE POLICY "{table}_select" ON {table}
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "{table}_insert" ON {table}
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "{table}_update" ON {table}
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()));
```

### 9.4 쿼리 최적화 원칙

1. **N+1 제거**: Drizzle `with` relations 또는 JOIN 사용
2. **커서 페이지네이션**: OFFSET 대신 `WHERE id > cursor` 패턴
3. **짧은 트랜잭션**: 외부 API 호출은 트랜잭션 밖에서
4. **배치 처리**: 다수 INSERT는 `values([...])` 배열로
5. **UPSERT**: `onConflictDoUpdate` / `onConflictDoNothing`

---

## 참고 링크

- [Supabase Agent Skills](https://github.com/supabase/agent-skills)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/current/)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [DB.md](./DB.md) — ohmynextjs 스키마 설계
- [SECURITY.md](./SECURITY.md) — 보안 스펙
