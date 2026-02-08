# 모듈 사용법

## @ohmynextjs/core

앱의 기본 Provider, 레이아웃, 테마를 관리합니다.

### OhMyProvider 설정

```tsx
// apps/web/app/layout-content.tsx
'use client';

import { OhMyProvider } from '@ohmynextjs/core';

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <OhMyProvider
      config={{
        app: {
          name: '내 서비스',
          description: '서비스 설명',
        },
        theme: {
          defaultTheme: 'system', // 'light' | 'dark' | 'system'
        },
        layout: {
          header: true,
          footer: true,
          sidebar: false,
        },
      }}
    >
      {children}
    </OhMyProvider>
  );
}
```

### 레이아웃 커스텀

```tsx
import { Header, Footer, Sidebar } from '@ohmynextjs/core';

// 헤더/푸터/사이드바를 개별적으로 사용 가능
export default function CustomLayout({ children }) {
  return (
    <>
      <Header />
      <Sidebar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

### 테마 토글

```tsx
import { ThemeToggle } from '@ohmynextjs/core';

// 다크모드 토글 버튼
<ThemeToggle />
```

---

## @ohmynextjs/db

Drizzle ORM 기반 DB 스키마와 클라이언트를 제공합니다.

### 스키마 수정/추가

```typescript
// packages/db/src/schema/products.ts
import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

```typescript
// packages/db/src/schema/index.ts에 export 추가
export * from './products';
```

### 마이그레이션

```bash
# 스키마 변경 후 마이그레이션 파일 생성
bun run db:generate

# 마이그레이션 실행 (운영)
bun run db:migrate

# 직접 스키마 푸시 (개발)
bun run db:push
```

### DB 클라이언트 사용

```typescript
import { db } from '@ohmynextjs/db';
import { products } from '@ohmynextjs/db/schema';
import { eq } from 'drizzle-orm';

// 조회
const allProducts = await db.select().from(products);

// 조건 조회
const product = await db.select().from(products).where(eq(products.id, id));

// 삽입
await db.insert(products).values({ name: '상품', price: 10000 });
```

---

## @ohmynextjs/auth

Supabase 기반 인증 모듈입니다.

### 소셜 로그인

```tsx
import { SocialButtons } from '@ohmynextjs/auth';

// Google, Kakao, Naver, GitHub 소셜 로그인 버튼
<SocialButtons />
```

### AuthGuard 사용

```tsx
import { AuthGuard } from '@ohmynextjs/auth';

// 인증된 사용자만 접근 가능
<AuthGuard
  user={user}
  isLoading={isLoading}
  fallback={<p>로그인이 필요합니다</p>}
  requiredRole="admin" // 선택: 'admin' | 'user'
>
  <ProtectedContent />
</AuthGuard>
```

### Server Action에서 사용자 확인

```typescript
import { createSupabaseServerClient } from '@ohmynextjs/auth';

export async function myAction() {
  'use server';
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');
  // ...
}
```

---

## @ohmynextjs/admin

관리자 대시보드를 제공합니다.

### 관리자 페이지 구성

기본 제공 페이지:
- `/admin` — 대시보드 (통계, 차트)
- `/admin/users` — 유저 관리 (목록, 필터, 상세)
- `/admin/payments` — 결제 관리 (목록, 환불)
- `/admin/settings` — 앱 설정 관리

### 커스텀 관리 페이지 추가

```tsx
// apps/web/app/(admin)/admin/my-page/page.tsx
import { AdminLayout } from '@ohmynextjs/admin';

export default function MyAdminPage() {
  return (
    <div>
      <h1>커스텀 관리 페이지</h1>
      {/* 내용 */}
    </div>
  );
}
```

사이드바에 메뉴를 추가하려면 `AdminSidebar` 컴포넌트를 수정하세요.

---

## @ohmynextjs/payment

토스페이먼츠 결제를 처리합니다.

### 결제 버튼

```tsx
import { PaymentButton } from '@ohmynextjs/payment';

<PaymentButton
  amount={9900}
  orderName="Pro 플랜 구독"
  orderId="order_xxx"
/>
```

### 요금제 테이블

```tsx
import { PricingTable } from '@ohmynextjs/payment';

// DB에서 plans 데이터를 가져와 표시
<PricingTable plans={plans} currentPlan={userPlan} />
```

### 구독 상태

```tsx
import { SubscriptionStatus } from '@ohmynextjs/payment';

<SubscriptionStatus subscription={subscription} />
```

### 결제 내역

```tsx
import { PaymentHistory } from '@ohmynextjs/payment';

<PaymentHistory payments={payments} />
```

---

## @ohmynextjs/ai-agent

AI 코딩 에이전트를 위한 룰셋과 AGENTS.md 생성기입니다.

### AGENTS.md 생성

```typescript
import { generateAgentsMd } from '@ohmynextjs/ai-agent';

// 프로젝트에 맞는 AGENTS.md 생성
const agentsMd = generateAgentsMd({
  projectName: 'my-app',
  techStack: ['next.js', 'supabase', 'drizzle'],
  modules: ['auth', 'payment', 'admin'],
});
```

### 프리셋 사용

```typescript
import { presets } from '@ohmynextjs/ai-agent';

// 사용 가능한 프리셋 확인
console.log(presets);
// → { fullstack, frontend, backend, ... }
```
