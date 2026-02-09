# OhMyNextJS

한국형 SaaS 보일러플레이트. Next.js 16 + Supabase + TossPayments.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/ohmynextjs&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,SUPABASE_SERVICE_ROLE_KEY,DATABASE_URL,NEXT_PUBLIC_APP_URL,TOSS_SECRET_KEY)

## Quick Start

```bash
# 클론
git clone https://github.com/your-org/ohmynextjs.git
cd ohmynextjs

# 환경변수 설정
cp .env.example .env.local
# .env.local 편집 — Supabase, TossPayments 키 입력

# 의존성 설치
bun install

# DB 마이그레이션
bun run db:push

# 개발 서버
bun dev
```

http://localhost:3000 에서 확인.

## 기술스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 인증 | Supabase Auth (Google, 카카오, 네이버, GitHub) |
| 데이터베이스 | Supabase PostgreSQL + Drizzle ORM |
| 결제 | TossPayments (일회성 결제, 정기결제, 환불) |
| 스타일링 | Tailwind CSS v4 |
| 테스트 | Vitest + Testing Library |
| 런타임 | Bun |

## 프로젝트 구조

```
src/
├── app/                  # Next.js App Router 페이지
│   ├── api/auth/         # Auth 콜백 라우트 핸들러
│   ├── auth/             # 로그인, 회원가입
│   ├── dashboard/        # 대시보드 (인증 필요)
│   ├── pricing/          # 가격 페이지
│   ├── terms/            # 이용약관
│   └── privacy/          # 개인정보처리방침
├── components/           # UI 컴포넌트
├── lib/
│   ├── auth/             # Supabase 인증 (client, server, proxy)
│   ├── db/               # Drizzle ORM 스키마 + 클라이언트
│   └── payment/          # TossPayments 클라이언트
└── types/                # 타입 정의
```

## 스크립트

```bash
bun dev          # 개발 서버
bun run build    # 프로덕션 빌드
bun run test     # 테스트 실행
bun run db:generate  # Drizzle 마이그레이션 생성
bun run db:push      # DB 스키마 푸시
```

## 라이선스

MIT
