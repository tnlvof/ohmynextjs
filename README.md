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

## Quick Start

```bash
# 클론
git clone https://github.com/tnlvof/ohmynextjs.git my-app
cd my-app

# 의존성 설치
bun install

# 환경변수 설정
cp apps/web/.env.example apps/web/.env.local
# .env.local 파일을 열어 Supabase, 토스 키 입력

# DB 설정
bun run db:push    # 스키마 푸시
bun run db:seed    # 시드 데이터

# 개발 서버
bun run dev
```

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

## 테스트

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

## 배포

1. Vercel Deploy 버튼 클릭 (위 참조)
2. 환경 변수 입력
3. Supabase 설정 ([배포 가이드](./specs/DEPLOY.md))
4. 끝!

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
