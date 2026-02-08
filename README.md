# ohmynextjs

> 🚀 바이브코딩으로 상용 서비스를 빠르게 만드는 Next.js 풀스택 스타터킷

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tnlvof/ohmynextjs&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,DATABASE_URL,NEXT_PUBLIC_TOSS_CLIENT_KEY,TOSS_SECRET_KEY,NEXT_PUBLIC_APP_URL&project-name=my-ohmynextjs&repository-name=my-ohmynextjs)

## Features

- ⚡ **Next.js 15** (App Router, Server Components, Server Actions)
- 🗄️ **Supabase** (Auth + PostgreSQL)
- 🔄 **Drizzle ORM** (Type-safe DB)
- 🔐 **인증** — 이메일 + 소셜 로그인 (Google, Kakao, Naver, GitHub)
- 💳 **결제** — 토스페이먼츠 (단건, 구독, 환불)
- 🛠️ **관리자 페이지** — 대시보드, 유저관리, 결제관리, 설정
- 🤖 **AI Agent 프리셋** — 범용 AGENTS.md 생성, 서브에이전트 프리셋
- 🎨 **Tailwind CSS + shadcn/ui** — 다크모드 지원
- 📦 **모듈화** — 필요한 것만 붙여서 사용
- 🚢 **Vercel 원클릭 배포**
- ✅ **TDD** — 전 모듈 테스트 코드 포함

## Modules

| Module | Description |
|--------|-------------|
| `@ohmynextjs/core` | Provider, 레이아웃, 다크모드, shadcn/ui |
| `@ohmynextjs/db` | Drizzle 스키마, 마이그레이션, 시드 |
| `@ohmynextjs/auth` | Supabase 인증 (이메일 + 소셜) |
| `@ohmynextjs/admin` | 관리자 대시보드, 유저/결제/설정 관리 |
| `@ohmynextjs/payment` | 토스페이먼츠 결제 (단건, 구독, 환불) |
| `@ohmynextjs/ai-agent` | AI 에이전트 룰셋, AGENTS.md 생성기 |

---

## 📋 Prerequisites

### Node.js 18+

```bash
# nvm 사용 (권장)
nvm install 18
nvm use 18

# 또는 공식 사이트에서 다운로드
# https://nodejs.org/
```

### Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"

# 설치 확인
bun --version
```

### 외부 서비스 계정

- **Supabase** — [supabase.com](https://supabase.com) 무료 계정 생성 → [상세 설정 가이드](./docs/supabase-setup.md)
- **토스페이먼츠** — [developers.tosspayments.com](https://developers.tosspayments.com) 개발자 계정 → [상세 설정 가이드](./docs/tosspayments-setup.md)

---

## 🚀 Installation

### 1. 클론

```bash
git clone https://github.com/tnlvof/ohmynextjs.git my-app
cd my-app
```

### 2. 의존성 설치

```bash
bun install
```

### 3. 환경변수 설정

```bash
cp apps/web/.env.example apps/web/.env.local
```

`.env.local` 파일을 열어 각 항목을 설정합니다:

```env
# === Supabase ===
# Supabase 대시보드 → Settings → API에서 복사
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Supabase → Settings → Database → Connection string (Session mode 포트 5432)
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# === App ===
NEXT_PUBLIC_APP_URL=http://localhost:3000

# === 토스페이먼츠 ===
# 개발자센터 → API 키에서 복사 (test_ 접두사 = 테스트 환경)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx
TOSS_SECRET_KEY=test_sk_xxx

# === 선택 사항 ===
CRON_SECRET=your-cron-secret          # Cron job 인증
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX        # Google Analytics
```

### 4. Supabase 설정

Supabase 프로젝트 생성, Auth Provider 활성화, DB Trigger 설정이 필요합니다.

👉 **[Supabase 설정 가이드](./docs/supabase-setup.md)** — 프로젝트 생성부터 RLS 정책까지 단계별 안내

### 5. 토스페이먼츠 설정

👉 **[토스페이먼츠 설정 가이드](./docs/tosspayments-setup.md)** — 가맹점 등록, 키 복사, 웹훅 설정

---

## 🗄️ DB 설정

```bash
# 개발: 스키마를 직접 DB에 푸시 (마이그레이션 파일 없이)
bun run db:push

# 운영: 마이그레이션 파일 생성 → 실행
bun run db:generate    # 마이그레이션 파일 생성
bun run db:migrate     # 마이그레이션 실행

# 시드 데이터 삽입 (Free/Pro/Enterprise 요금제 + 기본 설정)
bun run db:seed

# Drizzle Studio (DB GUI)
bun run db:studio
# → https://local.drizzle.studio 에서 테이블 조회/편집
```

> 💡 `db:push`는 개발 중 빠른 이터레이션에, `db:migrate`는 운영 환경의 안전한 마이그레이션에 사용합니다.

---

## 💻 개발 서버

```bash
bun run dev
```

- **URL**: http://localhost:3000
- **포트 변경**: `apps/web/package.json`의 `dev` 스크립트에서 `--port 3001` 추가

---

## 📁 프로젝트 구조

```
ohmynextjs/
├── apps/
│   └── web/                    # Next.js 앱
│       ├── app/
│       │   ├── (public)/       # 공개 페이지 (랜딩, 가격, 약관)
│       │   ├── (auth)/         # 인증 페이지 (로그인, 회원가입)
│       │   ├── (dashboard)/    # 대시보드 (로그인 필요)
│       │   ├── (admin)/        # 관리자 페이지
│       │   ├── api/            # API 라우트 (auth callback, payment webhook)
│       │   └── payment/        # 결제 결과 페이지
│       ├── components/
│       │   ├── ui/             # shadcn/ui 컴포넌트
│       │   ├── common/         # 공용 컴포넌트
│       │   └── landing/        # 랜딩 페이지 컴포넌트
│       └── __tests__/          # 웹 앱 테스트
│
├── packages/
│   ├── core/                   # 🎨 Provider, 레이아웃, 테마, 유틸
│   ├── db/                     # 🗄️ Drizzle 스키마, 클라이언트, 시드
│   ├── auth/                   # 🔐 Supabase 인증, 미들웨어
│   ├── admin/                  # 🛠️ 관리자 대시보드 컴포넌트
│   ├── payment/                # 💳 토스페이먼츠 결제 모듈
│   └── ai-agent/               # 🤖 AI 에이전트 룰셋/생성기
│
├── specs/                      # 📝 설계 스펙 & 베스트 프랙티스
│   ├── OVERVIEW.md             # 프로젝트 전체 개요
│   ├── AUTH.md                 # 인증 모듈 스펙
│   ├── PAYMENT.md              # 결제 모듈 스펙
│   ├── DB.md                   # DB 설계 스펙
│   ├── ADMIN.md                # 관리자 모듈 스펙
│   ├── CORE.md                 # 코어 모듈 스펙
│   ├── AI-AGENT.md             # AI 에이전트 스펙
│   ├── TESTING.md              # 테스트 가이드
│   ├── DEPLOY.md               # 배포 가이드
│   ├── SECURITY.md             # 보안 (OWASP Top 10)
│   ├── CLEAN-CODE.md           # 클린코드 원칙
│   ├── REACT-BEST-PRACTICES.md # React 40+ 룰
│   ├── POSTGRES-BEST-PRACTICES.md # Postgres 30개 레퍼런스
│   └── VIBE-CODING-PRINCIPLES.md  # 바이브코딩 10원칙
│
└── docs/                       # 📖 사용 가이드
    ├── supabase-setup.md       # Supabase 설정 상세
    ├── tosspayments-setup.md   # 토스페이먼츠 설정 상세
    ├── modules.md              # 모듈별 사용법
    ├── customization.md        # 커스터마이징 가이드
    └── deployment.md           # 배포 가이드
```

### specs/ 폴더

`specs/`는 **설계 스펙 문서**입니다. AI 에이전트나 개발자가 프로젝트 구조와 규칙을 빠르게 파악할 수 있도록 각 모듈의 설계 의도, 인터페이스, 제약 사항을 정리해 둔 파일입니다.

---

## 📦 모듈 사용법

각 모듈의 상세 사용법과 코드 예시는 **[모듈 사용 가이드](./docs/modules.md)**를 참고하세요.

### 핵심 예시

#### OhMyProvider 설정

```tsx
// apps/web/app/layout-content.tsx
import { OhMyProvider } from '@ohmynextjs/core';

<OhMyProvider config={{
  app: { name: '내 서비스' },
  theme: { defaultTheme: 'system' },
  layout: { header: true, footer: true, sidebar: false },
}}>
  {children}
</OhMyProvider>
```

#### 인증 가드

```tsx
import { AuthGuard } from '@ohmynextjs/auth';

<AuthGuard user={user} requiredRole="admin" fallback={<Login />}>
  <AdminPanel />
</AuthGuard>
```

#### 결제 버튼

```tsx
import { PaymentButton } from '@ohmynextjs/payment';

<PaymentButton amount={9900} orderName="Pro 플랜" orderId="order_123" />
```

#### AGENTS.md 생성

```typescript
import { generateAgentsMd } from '@ohmynextjs/ai-agent';

const md = generateAgentsMd({
  projectName: 'my-app',
  techStack: ['next.js', 'supabase', 'drizzle'],
});
```

---

## 🎨 커스터마이징

상세 가이드: **[커스터마이징 가이드](./docs/customization.md)**

| 작업 | 방법 |
|------|------|
| 새 페이지 추가 | `apps/web/app/(public)/my-page/page.tsx` 생성 |
| 새 DB 테이블 | `packages/db/src/schema/`에 파일 추가 → `db:push` |
| Server Action | `apps/web/app/actions/`에 파일 추가, `'use server'` 선언 |
| UI 컴포넌트 | `cd apps/web && bunx shadcn@latest add [component]` |
| 다크모드 | `globals.css`의 CSS 변수 수정 |
| 폰트 변경 | `layout.tsx`에서 `next/font` 사용 |

---

## 바이브코딩 원칙

이 프로젝트는 [10가지 바이브코딩 원칙](./specs/VIBE-CODING-PRINCIPLES.md)을 따릅니다:

1. **YAGNI** — 지금 필요한 것만
2. **Unix 철학** — 작게 나눠서
3. **Design by Contract** — 조건을 명확히
4. **관심사의 분리** — 모듈화
5. **점진적 개선** — 한번에 완벽은 없음
6. **방어적 프로그래밍** — 신뢰하되 검증
7. **바이브 TDD** — 테스트로 검증
8. **Convention over Configuration** — 패턴을 잡아두면 품질 올라감
9. **최소 놀람의 원칙** — idiomatic하게
10. **피드백 루프** — 짧고 빈번하게

## 개발 원칙

- [React Best Practices](./specs/REACT-BEST-PRACTICES.md) (Vercel 40+ 룰)
- [Clean Code](./specs/CLEAN-CODE.md) (SOLID, DRY, KISS)
- [보안 — OWASP Top 10](./specs/SECURITY.md)
- [Postgres Best Practices](./specs/POSTGRES-BEST-PRACTICES.md) (Supabase 30개 레퍼런스)
- [TDD](./specs/TESTING.md) (Vitest + Playwright)

---

## ✅ 테스트

```bash
# 전체 테스트
bun run test

# 모듈별 테스트
bun run test:db
bun run test:core
bun run test:auth
bun run test:admin
bun run test:payment
bun run test:ai-agent
bun run test:web
```

### 새 테스트 추가

테스트 파일은 각 패키지의 `__tests__/` 디렉토리에 위치합니다.

```typescript
// packages/db/__tests__/schema/posts.test.ts
import { describe, it, expect } from 'vitest';
import { posts } from '../../src/schema/posts';

describe('posts schema', () => {
  it('should have required columns', () => {
    expect(posts.title).toBeDefined();
    expect(posts.content).toBeDefined();
    expect(posts.authorId).toBeDefined();
  });
});
```

### TDD 워크플로우

1. **Red** — 실패하는 테스트 작성
2. **Green** — 테스트를 통과하는 최소한의 코드 작성
3. **Refactor** — 코드 정리, 테스트는 계속 통과

```bash
# 워치 모드로 개발 (파일 변경 시 자동 실행)
cd packages/db
bunx vitest --watch
```

---

## 🚢 배포

상세 가이드: **[배포 가이드](./docs/deployment.md)**

### Vercel 원클릭 배포

1. 위의 **Deploy with Vercel** 버튼 클릭
2. 환경변수 입력 (Supabase, 토스 키)
3. 배포 완료 후 [체크리스트](./docs/deployment.md#배포-후-체크리스트) 확인

### 수동 배포

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🤝 Contributing

### 기여 방법

1. 이 저장소를 **Fork**
2. 기능 브랜치 생성: `git checkout -b feature/my-feature`
3. 변경사항 커밋: `git commit -m 'feat: add my feature'`
4. 브랜치 푸시: `git push origin feature/my-feature`
5. **Pull Request** 생성

### 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 사용:

- `feat:` 새 기능
- `fix:` 버그 수정
- `docs:` 문서 변경
- `test:` 테스트 추가/수정
- `refactor:` 리팩토링
- `chore:` 빌드/설정 변경

### 이슈 등록

- 🐛 **버그 리포트** — 재현 단계, 예상/실제 동작 포함
- 💡 **기능 제안** — 사용 사례와 기대 효과 설명
- 📖 **문서 개선** — 누락/부정확한 내용 지적

### PR 가이드

- 관련 이슈 번호 연결 (`Closes #123`)
- 테스트 코드 포함 필수
- `bun run test` 통과 확인
- 리뷰어 1명 이상 승인 후 머지

---

## ❓ FAQ

### Q: `bun install`에서 에러가 발생해요

Bun 버전을 확인하세요. 최소 1.0 이상이 필요합니다:
```bash
bun --version
bun upgrade  # 최신 버전으로 업그레이드
```

### Q: DB 연결이 안 돼요

1. `DATABASE_URL`이 올바른지 확인
2. Supabase 대시보드에서 프로젝트가 활성 상태인지 확인 (Free tier는 1주일 비활성 시 일시정지)
3. 포트 확인: Session mode는 `5432`, Transaction mode는 `6543`

### Q: 소셜 로그인이 안 돼요

1. Supabase → **Providers**에서 해당 프로바이더가 활성화되어 있는지 확인
2. Client ID, Secret이 올바른지 확인
3. Redirect URI가 `https://[project-ref].supabase.co/auth/v1/callback`인지 확인
4. `NEXT_PUBLIC_APP_URL`이 현재 서버 URL과 일치하는지 확인

### Q: 토스 결제 테스트가 안 돼요

1. `test_` 접두사 키를 사용하고 있는지 확인
2. `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY` 모두 설정했는지 확인
3. 테스트 카드 번호 `4330000000000002` 사용

### Q: 관리자 페이지에 접근할 수 없어요

`public.users` 테이블에서 해당 사용자의 `role`을 `admin`으로 변경하세요:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
```

### Q: `db:push`에서 테이블이 이미 존재한다는 에러

이미 생성된 테이블이 있는 경우입니다. Supabase SQL Editor에서 테이블을 삭제하거나, `db:migrate`를 사용하세요.

### Q: Vercel 배포 후 500 에러

1. Vercel 대시보드 → **Logs**에서 에러 메시지 확인
2. 환경변수가 모두 설정되었는지 확인 (특히 `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
3. `NEXT_PUBLIC_APP_URL`이 배포 URL과 일치하는지 확인

### Q: 새 패키지를 추가하고 싶어요

```bash
# 특정 워크스페이스에 추가
bun add --filter web some-package
bun add --filter @ohmynextjs/core some-package

# 루트에 dev dependency 추가
bun add -D some-package
```

### Q: shadcn/ui 컴포넌트를 추가하려면?

```bash
cd apps/web
bunx shadcn@latest add button dialog table tabs
```

### Q: TypeScript 타입 에러가 발생해요

```bash
# 타입 체크
bun run lint

# 빌드로 전체 타입 확인
bun run build
```

---

## Tech Stack

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript (strict) |
| DB | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| 인증 | Supabase Auth |
| UI | Tailwind CSS + shadcn/ui |
| 결제 | 토스페이먼츠 |
| 테스트 | Vitest + Playwright |
| 배포 | Vercel |

## License

MIT
