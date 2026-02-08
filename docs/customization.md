# 커스터마이징 가이드

## 새 페이지 추가

Next.js App Router의 파일 기반 라우팅을 따릅니다.

```tsx
// apps/web/app/(public)/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">소개</h1>
      <p>서비스 소개 페이지입니다.</p>
    </div>
  );
}
```

### 라우트 그룹

| 그룹 | 경로 | 용도 |
|------|------|------|
| `(public)` | `/`, `/pricing`, `/terms` | 공개 페이지 |
| `(auth)` | `/auth/login`, `/auth/signup` | 인증 페이지 |
| `(dashboard)` | `/dashboard`, `/settings`, `/billing` | 로그인 필요 |
| `(admin)` | `/admin/*` | 관리자 전용 |

## 새 DB 테이블 추가

### 1. 스키마 정의

```typescript
// packages/db/src/schema/posts.ts
import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### 2. Export 추가

```typescript
// packages/db/src/schema/index.ts
export * from './posts';
```

### 3. Relations 정의 (선택)

```typescript
// packages/db/src/relations.ts에 추가
import { relations } from 'drizzle-orm';
import { posts } from './schema/posts';
import { users } from './schema/users';

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

### 4. DB에 반영

```bash
bun run db:push    # 개발 환경
# 또는
bun run db:generate  # 마이그레이션 파일 생성
bun run db:migrate   # 운영 환경
```

## 새 Server Action 추가

```typescript
// apps/web/app/actions/posts.ts
'use server';

import { db } from '@ohmynextjs/db';
import { posts } from '@ohmynextjs/db/schema';
import { createSupabaseServerClient } from '@ohmynextjs/auth';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await db.insert(posts).values({
    title,
    content,
    authorId: user.id,
  });

  revalidatePath('/posts');
}

export async function getPosts() {
  return db.select().from(posts).where(eq(posts.published, true));
}
```

## shadcn/ui 컴포넌트 추가

```bash
# apps/web 디렉토리에서 실행
cd apps/web
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu
bunx shadcn@latest add table
bunx shadcn@latest add tabs
```

추가된 컴포넌트는 `apps/web/components/ui/`에 생성됩니다.

```tsx
// 사용 예시
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
    </DialogHeader>
    <p>내용</p>
  </DialogContent>
</Dialog>
```

## 테마/다크모드 커스텀

### CSS 변수 수정

```css
/* apps/web/app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    /* 원하는 색상으로 변경 */
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
  }
}
```

### 기본 테마 변경

```tsx
<OhMyProvider
  config={{
    theme: {
      defaultTheme: 'dark', // 'light' | 'dark' | 'system'
    },
  }}
>
```

### 폰트 변경

```tsx
// apps/web/app/layout.tsx
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <body>{children}</body>
    </html>
  );
}
```
