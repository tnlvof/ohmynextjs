# Postgres Best Practices ??Supabase 30 Rules for OhMyNextJS

> ì¶œì²˜: [supabase/agent-skills](https://github.com/supabase/agent-skills) ??supabase-postgres-best-practices v1.1.0
> ?ìš© ?€?? Drizzle ORM + Supabase + Next.js 16

---

## ëª©ì°¨

1. [Query Performance (CRITICAL)](#1-query-performance-critical)
2. [Connection Management (CRITICAL)](#2-connection-management-critical)
3. [Security & RLS (CRITICAL)](#3-security--rls-critical)
4. [Schema Design (HIGH)](#4-schema-design-high)
5. [Concurrency & Locking (MEDIUM-HIGH)](#5-concurrency--locking-medium-high)
6. [Data Access Patterns (MEDIUM)](#6-data-access-patterns-medium)
7. [Monitoring & Diagnostics (LOW-MEDIUM)](#7-monitoring--diagnostics-low-medium)
8. [Advanced Features (LOW)](#8-advanced-features-low)
9. [Drizzle ORM ?ìš© ê°€?´ë“œ](#9-drizzle-orm-?ìš©-ê°€?´ë“œ)

---

## 1. Query Performance (CRITICAL)

### 1.1 WHERE/JOIN ì»¬ëŸ¼???¸ë±??ì¶”ê? (`query-missing-indexes`)
- **Impact**: 100-1000x ë¹ ë¥¸ ì¿¼ë¦¬
- ?¸ë±???†ëŠ” ì»¬ëŸ¼ ?„í„°ë§???Full Table Scan
- FK ì»¬ëŸ¼?€ ë°˜ë“œ???¸ë±???ì„±

```sql
-- ???¸ë±???†ì´ ?„í„°ë§?SELECT * FROM orders WHERE customer_id = 123; -- Seq Scan

-- ???¸ë±???ì„±
CREATE INDEX orders_customer_id_idx ON orders (customer_id);
```

**Drizzle ?ìš©:**
```typescript
export const orders = pgTable('orders', {
  // ...
  userId: uuid('user_id').notNull().references(() => users.id),
}, (table) => ({
  userIdx: index('orders_user_id_idx').on(table.userId),
}));
```

### 1.2 ë³µí•© ?¸ë±??(`query-composite-indexes`)
- **Impact**: 5-10x ë¹ ë¥¸ ë©€??ì»¬ëŸ¼ ì¿¼ë¦¬
- **ê·œì¹™**: equality ì»¬ëŸ¼ ë¨¼ì?, range ì»¬ëŸ¼ ?˜ì¤‘??(leftmost prefix rule)

```sql
-- ??status(=) ë¨¼ì?, created_at(>) ?˜ì¤‘
CREATE INDEX orders_status_created_idx ON orders (status, created_at);
```

**Drizzle ?ìš©:**
```typescript
(table) => ({
  statusCreatedIdx: index('payments_status_created_idx').on(table.status, table.createdAt),
})
```

### 1.3 ì»¤ë²„ë§??¸ë±??(`query-covering-indexes`)
- **Impact**: 2-5x ë¹ ë¥¸ ì¿¼ë¦¬ (heap fetch ?œê±°)
- `INCLUDE`ë¡?SELECT ì»¬ëŸ¼ ?¬í•¨ ??Index-Only Scan

```sql
-- ??emailë¡?ê²€?? nameê³?created_at???¸ë±?¤ì—??ë°”ë¡œ ë°˜í™˜
CREATE INDEX users_email_idx ON users (email) INCLUDE (name, created_at);
```

### 1.4 Partial ?¸ë±??(`query-partial-indexes`)
- **Impact**: 5-20x ?‘ì? ?¸ë±?? ë¹ ë¥¸ ?°ê¸°/?½ê¸°
- ?¹ì • ì¡°ê±´???‰ë§Œ ?¸ë±??
```sql
-- ??pending ?íƒœë§??¸ë±??(?„ì²´??5%ë§?
CREATE INDEX orders_pending_idx ON orders (created_at) WHERE status = 'pending';

-- ??soft delete ?¨í„´
CREATE INDEX users_active_email_idx ON users (email) WHERE deleted_at IS NULL;
```

### 1.5 ?¸ë±???€??? íƒ (`query-index-types`)
- **Impact**: 10-100x (?¬ë°”ë¥??€??? íƒ ??

| ?€??| ?©ë„ | ?°ì‚°??|
|------|------|--------|
| B-tree (ê¸°ë³¸) | =, <, >, BETWEEN, IN | ë²”ìš© |
| GIN | JSONB, ë°°ì—´, ?„ë¬¸ê²€??| @>, ?, ?& |
| BRIN | ?œê³„???€?©ëŸ‰ (10-100x ?‘ì? ?¸ë±?? | ë²”ìœ„ |
| Hash | equality only (B-treeë³´ë‹¤ ?½ê°„ ë¹ ë¦„) | = |

```sql
-- audit_logsì²˜ëŸ¼ ?œê³„???€?©ëŸ‰ ?Œì´ë¸”ì—” BRIN
CREATE INDEX audit_logs_created_idx ON audit_logs USING brin (created_at);
```

---

## 2. Connection Management (CRITICAL)

### 2.1 ì»¤ë„¥???€ë§??„ìˆ˜ (`conn-pooling`)
- **Impact**: 10-100x ??ë§ì? ?™ì‹œ ?¬ìš©??ì²˜ë¦¬
- Postgres ì»¤ë„¥?˜ë‹¹ 1-3MB RAM ?Œë¹„
- Supabase???´ì¥ PgBouncer ?œê³µ (?¬íŠ¸ 6543 = Transaction ëª¨ë“œ)

**ohmynextjs ?ìš©** (`packages/db/src/client.ts`):
```typescript
import postgres from 'postgres';

// Transaction ëª¨ë“œ ?€???¬ìš© (?¬íŠ¸ 6543)
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,  // Transaction ëª¨ë“œ?ì„œ prepared statement ë¹„í™œ?±í™”
  max: 10,         // ???ˆë²¨ ?€ ?¬ì´ì¦?(CPU cores * 2 + 1)
});
```

### 2.2 ì»¤ë„¥???œí•œ ?¤ì • (`conn-limits`)
- **Impact**: DB ?¬ë˜??ë°©ì?
- ê³µì‹: `max_connections = RAM / 5MB - reserved`
- ?¤ë¬´: 100-200???€ë¶€ë¶??ì ˆ

### 2.3 Idle ì»¤ë„¥???€?„ì•„??(`conn-idle-timeout`)
- **Impact**: 30-50% ì»¤ë„¥???¬ë¡¯ ?Œìˆ˜

```sql
ALTER SYSTEM SET idle_in_transaction_session_timeout = '30s';
ALTER SYSTEM SET idle_session_timeout = '10min';
```

### 2.4 Prepared Statement + ?€ë§?ì£¼ì˜ (`conn-prepared-statements`)
- **Impact**: Transaction ëª¨ë“œ?ì„œ prepared statement ì¶©ëŒ ë°©ì?
- `{ prepare: false }` ?„ìˆ˜ (?´ë? DB.md client.ts???ìš©????

---

## 3. Security & RLS (CRITICAL)

### 3.1 RLS ?„ìˆ˜ ?œì„±??(`security-rls-basics`)
- **Impact**: DB ?ˆë²¨ ?°ì´??ê²©ë¦¬
- ? í”Œë¦¬ì??´ì…˜ ?„í„°ë§ë§Œ?¼ë¡œ??ë¶€ì¡???RLSë¡?ê°•ì œ

```sql
-- ??ëª¨ë“  ?Œì´ë¸”ì— RLS ?œì„±??ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

-- Supabase auth.uid() ?¬ìš©
CREATE POLICY orders_user_policy ON orders
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()));  -- SELECT ?˜í•‘?¼ë¡œ 1?Œë§Œ ?¸ì¶œ
```

### 3.2 RLS ?±ëŠ¥ ìµœì ??(`security-rls-performance`)
- **Impact**: 5-10x ë¹ ë¥¸ RLS ì¿¼ë¦¬

```sql
-- ??auth.uid()ê°€ ë§??‰ë§ˆ???¸ì¶œ??USING (auth.uid() = user_id);

-- ??SELECTë¡??˜í•‘ ??1???¸ì¶œ, ìºì‹±
USING ((SELECT auth.uid()) = user_id);
```

- RLS ?•ì±…???¬ìš©?˜ëŠ” ì»¬ëŸ¼??ë°˜ë“œ???¸ë±??ì¶”ê?
- ë³µì¡??ê²€?¬ëŠ” `SECURITY DEFINER` ?¨ìˆ˜ë¡?ë¶„ë¦¬

### 3.3 ìµœì†Œ ê¶Œí•œ ?ì¹™ (`security-privileges`)
- **Impact**: ê³µê²© ?œë©´ ì¶•ì†Œ
- `service_role`?€ ?œë²„ ?„ìš©, ?´ë¼?´ì–¸?¸ì— ?ˆë? ?¸ì¶œ ê¸ˆì?
- ?Œì´ë¸”ë³„ ìµœì†Œ ê¶Œí•œë§?ë¶€??
---

## 4. Schema Design (HIGH)

### 4.1 ?ì ˆ???°ì´???€??(`schema-data-types`)
- **Impact**: 50% ?¤í† ë¦¬ì? ?ˆê°

| ê·œì¹™ | ?ìš© |
|------|------|
| ID ??`bigint` or `uuid` | `int` ?¤ë²„?Œë¡œ ë°©ì? |
| ë¬¸ì????`text` | `varchar(n)` ë¶ˆí•„??|
| ?œê°„ ??`timestamptz` | `timestamp` ?€?„ì¡´ ?„ë½ ë°©ì? |
| ê¸ˆì•¡ ??`numeric(10,2)` or `integer` (???¨ìœ„) | `float` ?•ë????ì‹¤ ë°©ì? |
| ë¶ˆë¦° ??`boolean` | `varchar(5)` ??¹„ |

**ohmynextjs ?„í™©**: DB.md?ì„œ ?´ë? `uuid`, `text`, `timestamptz`, `integer`(???¨ìœ„) ?¬ìš© ì¤???
### 4.2 FK ?¸ë±???„ìˆ˜ (`schema-foreign-key-indexes`)
- **Impact**: 10-100x ë¹ ë¥¸ JOIN, CASCADE
- Postgres??FK???ë™ ?¸ë±???ì„± ????
- **ohmynextjs ?„í™©**: payments, subscriptions, audit_logs ëª¨ë‘ FK ?¸ë±???ˆìŒ ??
### 4.3 Primary Key ?„ëµ (`schema-primary-keys`)
- **Impact**: ?¸ë±??locality, fragmentation ê°ì†Œ
- `bigint identity` (?¨ì¼ DB) ?ëŠ” `UUIDv7` (ë¶„ì‚°)
- **ohmynextjs ?„í™©**: `uuid().defaultRandom()` ?¬ìš© ì¤???UUIDv4ë¡?fragmentation ê°€?¥ì„± ?ˆìŒ
- **ê¶Œì¥**: `gen_random_uuid()` ?€??UUIDv7 ê³ ë ¤ (pg_uuidv7 ?•ì¥) ?ëŠ” ?„ì¬ ê·œëª¨?ì„œ???ˆìš©

### 4.4 ?Œë¬¸???ë³„??(`schema-lowercase-identifiers`)
- Drizzle ORM?€ ê¸°ë³¸?ìœ¼ë¡?snake_case ?ì„± ???´ë? ì¤€????
### 4.5 ?Œí‹°?”ë‹ (`schema-partitioning`)
- **Impact**: 5-20x ë¹ ë¥¸ ì¿¼ë¦¬ (?€?©ëŸ‰)
- 100M+ ???Œì´ë¸”ì— ?ìš©
- **ohmynextjs ?ìš©**: `audit_logs`ê°€ ì»¤ì§ˆ ê²½ìš° `created_at` ê¸°ì? ?”ë³„ ?Œí‹°?”ë‹ ê³ ë ¤

---

## 5. Concurrency & Locking (MEDIUM-HIGH)

### 5.1 ì§§ì? ?¸ëœ??…˜ ? ì? (`lock-short-transactions`)
- **Impact**: 3-5x ì²˜ë¦¬???¥ìƒ
- ?¸ë? API ?¸ì¶œ(ê²°ì œ ???€ ?¸ëœ??…˜ ë°–ì—??ì²˜ë¦¬
- `statement_timeout = '30s'` ?¤ì • ê¶Œì¥

```typescript
// ???¸ëœ??…˜ ?ˆì—??ê²°ì œ API ?¸ì¶œ
await db.transaction(async (tx) => {
  const order = await tx.select()...;
  await tossPayments.confirm(paymentKey); // 2-5ì´?ë¸”ë¡!
  await tx.update(payments).set({ status: 'paid' });
});

// ??ê²°ì œ ?•ì¸ ???¸ëœ??…˜?€ DB ?…ë°?´íŠ¸ë§?const result = await tossPayments.confirm(paymentKey);
await db.transaction(async (tx) => {
  await tx.update(payments).set({ status: 'paid', paidAt: new Date() }).where(...);
});
```

### 5.2 ?°ë“œ??ë°©ì? (`lock-deadlock-prevention`)
- ?¼ê????œì„œë¡????ë“ (ID ?¤ë¦„ì°¨ìˆœ)
- ê°€?¥í•˜ë©??¨ì¼ statementë¡??ì???…ë°?´íŠ¸

### 5.3 SKIP LOCKED ???¨í„´ (`lock-skip-locked`)
- **Impact**: 10x ??ì²˜ë¦¬ ?±ëŠ¥
- ?Œì»¤ ?¤ìˆ˜ê°€ ?™ì‹œ???‘ì—… ì²˜ë¦¬ ???¬ìš©

```sql
UPDATE jobs SET status = 'processing', worker_id = $1
WHERE id = (
  SELECT id FROM jobs WHERE status = 'pending'
  ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED
) RETURNING *;
```

### 5.4 Advisory Lock (`lock-advisory`)
- ? í”Œë¦¬ì??´ì…˜ ?ˆë²¨ ì¡°ìœ¨ (?? ë¦¬í¬???ì„± ì¤‘ë³µ ë°©ì?)
- `pg_advisory_xact_lock(hashtext('resource'))` ???¸ëœ??…˜ ë²”ìœ„ ?ë™ ?´ì œ

---

## 6. Data Access Patterns (MEDIUM)

### 6.1 N+1 ì¿¼ë¦¬ ?œê±° (`data-n-plus-one`)
- **Impact**: 10-100x ?¼ìš´?œíŠ¸ë¦?ê°ì†Œ

```typescript
// ??N+1
const users = await db.select().from(usersTable).where(...);
for (const user of users) {
  const orders = await db.select().from(ordersTable).where(eq(ordersTable.userId, user.id));
}

// ??JOIN ?ëŠ” Drizzle relations
const usersWithOrders = await db.query.users.findMany({
  with: { payments: true },
  where: ...,
});
```

### 6.2 ì»¤ì„œ ê¸°ë°˜ ?˜ì´ì§€?¤ì´??(`data-pagination`)
- **Impact**: O(1) ?±ëŠ¥ (ê¹Šì? ?˜ì´ì§€?ì„œ??
- OFFSET ?€??WHERE + ORDER BY + LIMIT

```typescript
// ??ì»¤ì„œ ?˜ì´ì§€?¤ì´??const nextPage = await db.select()
  .from(payments)
  .where(gt(payments.createdAt, lastCursor))
  .orderBy(asc(payments.createdAt))
  .limit(20);
```

### 6.3 ë°°ì¹˜ INSERT (`data-batch-inserts`)
- **Impact**: 10-50x ë¹ ë¥¸ ë²Œí¬ ?½ì…

```typescript
// ??Drizzle ë°°ì¹˜ ?½ì…
await db.insert(auditLogs).values([
  { action: 'login', userId: '...' },
  { action: 'login', userId: '...' },
  // ... ìµœë? ~1000ê±´ì”©
]);
```

### 6.4 UPSERT (`data-upsert`)
- **Impact**: ?ì??insert-or-update, ?ˆì´??ì»¨ë””???œê±°

```typescript
// ??Drizzle onConflictDoUpdate
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
- ?ë¦° ì¿¼ë¦¬???¤ì œ ë³‘ëª© ?ë³„
- Seq Scan, Rows Removed by Filter, ?’ì? loops ?•ì¸

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE customer_id = 123 AND status = 'pending';
```

### 7.2 pg_stat_statements (`monitor-pg-stat-statements`)
- ?„ì²´ ì¿¼ë¦¬ ?µê³„ ì¶”ì  (ë¹ˆë„, ?‰ê·  ?œê°„)
- Supabase?ì„œ ê¸°ë³¸ ?œì„±??
```sql
-- ê°€???ë¦° ì¿¼ë¦¬ Top 10
SELECT calls, round(mean_exec_time::numeric, 2) as mean_ms, query
FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
```

### 7.3 VACUUM & ANALYZE (`monitor-vacuum-analyze`)
- **Impact**: 2-10x ???˜ì? ì¿¼ë¦¬ ?Œëœ
- Supabase??autovacuum ê¸°ë³¸ ?œì„±??- ?€???°ì´??ë³€ê²????˜ë™ `ANALYZE` ê¶Œì¥

---

## 8. Advanced Features (LOW)

### 8.1 Full-Text Search (`advanced-full-text-search`)
- **Impact**: `LIKE '%term%'`ë³´ë‹¤ 100x ë¹ ë¦„
- `tsvector` + GIN ?¸ë±???¬ìš©

```sql
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))) STORED;
CREATE INDEX articles_search_idx ON articles USING gin (search_vector);
```

### 8.2 JSONB ?¸ë±??(`advanced-jsonb-indexing`)
- **Impact**: 10-100x ë¹ ë¥¸ JSONB ì¿¼ë¦¬
- GIN ?¸ë±??(`jsonb_path_ops`ë¡?2-3x ?‘ì? ?¸ë±??

```sql
-- containment(@>) ì¿¼ë¦¬??CREATE INDEX idx ON products USING gin (attributes jsonb_path_ops);

-- ?¹ì • ??ì¡°íšŒ??CREATE INDEX idx ON products ((attributes->>'brand'));
```

---

## 9. Drizzle ORM ?ìš© ê°€?´ë“œ

### 9.1 ì»¤ë„¥???¤ì • (DB.md ?°ê³„)

```typescript
// packages/db/src/client.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,     // Supabase Transaction ëª¨ë“œ ?€ë§??¸í™˜
  max: 10,            // ???ˆë²¨ ì»¤ë„¥???€
  idle_timeout: 20,   // ? íœ´ ì»¤ë„¥???•ë¦¬ (ì´?
});

export const db = drizzle(client, { schema });
```

### 9.2 ?¸ë±???„ëµ ì²´í¬ë¦¬ìŠ¤??
| ì²´í¬ | ??ª© |
|------|------|
| ??| ëª¨ë“  FK ì»¬ëŸ¼???¸ë±??|
| ??| WHERE ???ì£¼ ?¬ìš©?˜ëŠ” ì»¬ëŸ¼???¸ë±??|
| â¬?| ?ì£¼ ?¨ê»˜ ?„í„°ë§ë˜??ì»¬ëŸ¼?€ ë³µí•© ?¸ë±??|
| â¬?| soft-delete ?¨í„´?€ partial ?¸ë±??|
| â¬?| JSONB ê²€????GIN ?¸ë±??|
| â¬?| ?œê³„???€?©ëŸ‰ ?Œì´ë¸”ì? BRIN ?¸ë±??|

### 9.3 RLS ?•ì±… ?¨í„´

```sql
-- ëª¨ë“  ?¬ìš©???Œì´ë¸?ê³µí†µ ?¨í„´
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {table} FORCE ROW LEVEL SECURITY;

-- SELECT ?˜í•‘?¼ë¡œ auth.uid() 1?Œë§Œ ?¸ì¶œ (?±ëŠ¥ ìµœì ??
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

### 9.4 ì¿¼ë¦¬ ìµœì ???ì¹™

1. **N+1 ?œê±°**: Drizzle `with` relations ?ëŠ” JOIN ?¬ìš©
2. **ì»¤ì„œ ?˜ì´ì§€?¤ì´??*: OFFSET ?€??`WHERE id > cursor` ?¨í„´
3. **ì§§ì? ?¸ëœ??…˜**: ?¸ë? API ?¸ì¶œ?€ ?¸ëœ??…˜ ë°–ì—??4. **ë°°ì¹˜ ì²˜ë¦¬**: ?¤ìˆ˜ INSERT??`values([...])` ë°°ì—´ë¡?5. **UPSERT**: `onConflictDoUpdate` / `onConflictDoNothing`

---

## ì°¸ê³  ë§í¬

- [Supabase Agent Skills](https://github.com/supabase/agent-skills)
- [PostgreSQL ê³µì‹ ë¬¸ì„œ](https://www.postgresql.org/docs/current/)
- [Supabase RLS ê°€?´ë“œ](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [DB.md](./DB.md) ??ohmynextjs ?¤í‚¤ë§??¤ê³„
- [SECURITY.md](./SECURITY.md) ??ë³´ì•ˆ ?¤í™
