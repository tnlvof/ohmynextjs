# ohmynextjs

> 🚀 Vibe Coding Full-Stack Starter Kit for Next.js

바이브코딩으로 **상용 서비스를 빠르게** 만들기 위한 Next.js 풀스택 스타터킷.

## Features

- ⚡ **Next.js 15** (App Router)
- 🗄️ **Supabase** (Auth + Database)
- 🔄 **Drizzle ORM** (Type-safe DB)
- 🔐 **인증** (소셜 로그인)
- 💳 **결제** (토스페이먼츠 / 포트원)
- 🛠️ **관리자 페이지** (대시보드, 유저관리, 설정)
- 🤖 **AI Agent 프리셋** (룰셋, 커맨드, 서브에이전트)
- 📦 **모듈화** — 필요한 것만 붙여서 사용
- 🚢 **배포 자동화** (Vercel 원클릭)

## Modules

| Module | Description |
|--------|-------------|
| `@ohmynextjs/core` | 기본 세팅, 레이아웃, 라우팅 |
| `@ohmynextjs/auth` | Supabase 소셜 로그인 |
| `@ohmynextjs/admin` | 관리자 대시보드 |
| `@ohmynextjs/payment` | 국내 결제 (토스페이먼츠/포트원) |
| `@ohmynextjs/db` | Drizzle 스키마 & 마이그레이션 |
| `@ohmynextjs/ai-agent` | AI 에이전트 룰셋/프리셋 |

## Quick Start

```bash
npx create-ohmynextjs my-app
cd my-app
npm run dev
```

## License

MIT
