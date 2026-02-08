# OVERVIEW — OhMyNextJS 프로젝트 전체 스펙

## 1. 프로젝트 목적

바이브코딩으로 상용 서비스를 빠르게 구축하기 위한 **Next.js 15 풀스택 스타터킷**.
SaaS, 커머스, 어떤 웹서비스든 즉시 시작할 수 있는 모듈화된 패키지 구조를 제공한다.

## 2. 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript (strict) |
| DB | Supabase (PostgreSQL) |
| ORM | Drizzle ORM |
| 인증 | Supabase Auth |
| UI | Tailwind CSS v4 + shadcn/ui |
| 결제 | 토스페이먼츠 |
| 모노레포 | pnpm workspace (or turborepo) |
| 배포 | Vercel |

## 3. 디렉토리 구조

```
ohmynextjs/
├── apps/
│   └── web/                    # 메인 Next.js 앱
│       ├── app/                # App Router
│       │   ├── (public)/       # 공개 페이지
│       │   ├── (auth)/         # 인증 관련 페이지
│       │   ├── (dashboard)/    # 로그인 후 페이지
│       │   ├── (admin)/        # 관리자 페이지
│       │   └── api/            # API Route Handlers
│       ├── components/         # 앱 전용 컴포넌트
│       └── lib/                # 앱 전용 유틸
├── packages/
│   ├── core/                   # Provider, 레이아웃, 설정
│   ├── db/                     # Drizzle 스키마, 마이그레이션
│   ├── auth/                   # Supabase 인증
│   ├── admin/                  # 관리자 대시보드
│   ├── payment/                # 토스페이먼츠 결제
│   └── ai-agent/               # AI 에이전트 룰셋
├── specs/                      # 이 스펙 파일들
├── package.json                # 루트 workspace 설정
└── turbo.json                  # Turborepo 설정 (선택)
```

## 4. 모듈 의존성 그래프

```
ai-agent (독립)

core ← db
  ↑
auth ← db, core
  ↑
admin ← db, core, auth
  ↑
payment ← db, core, auth

apps/web ← core, db, auth, admin, payment, ai-agent
```

### 의존성 규칙
- `db`는 다른 패키지에 의존하지 않음 (최하위)
- `core`는 `db`만 의존
- `auth`는 `db`, `core` 의존
- `admin`과 `payment`는 `db`, `core`, `auth` 의존
- `ai-agent`는 독립 (런타임 의존성 없음, 빌드 타임 프리셋만)
- `apps/web`이 모든 패키지를 통합

## 5. 구현 순서

| 순서 | 모듈 | 이유 |
|------|------|------|
| 1 | `db` | 모든 모듈의 기반, 스키마 먼저 |
| 2 | `core` | Provider, 레이아웃 등 공통 인프라 |
| 3 | `auth` | 인증 없이 다른 기능 불가 |
| 4 | `apps/web` (기본) | 라우팅, 페이지 골격 |
| 5 | `admin` | 관리 기능 |
| 6 | `payment` | 결제 기능 |
| 7 | `ai-agent` | 개발 보조 도구 |
| 8 | 배포 | Vercel 설정 |

## 6. 공통 규칙

### 코드 컨벤션
- **파일명**: kebab-case (`user-table.tsx`)
- **컴포넌트**: PascalCase (`UserTable`)
- **함수/변수**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **타입**: PascalCase, `I` prefix 안 씀

### Export 규칙
- 각 패키지는 `src/index.ts`에서 public API만 re-export
- 내부 모듈 직접 import 금지

### 에러 처리
- 모든 API는 통일된 에러 응답 형식 사용:
```typescript
interface ApiError {
  error: {
    code: string;       // 'AUTH_INVALID_TOKEN', 'PAYMENT_FAILED' 등
    message: string;    // 사람이 읽을 수 있는 메시지
    details?: unknown;  // 추가 정보 (개발 모드)
  }
}

interface ApiSuccess<T> {
  data: T;
}
```

## 7. 개발 원칙

모든 코드는 아래 4가지 원칙을 준수한다. 각 원칙의 상세 내용은 별도 스펙 참조.

### 7.1 React Best Practices (→ [REACT-BEST-PRACTICES.md](./REACT-BEST-PRACTICES.md))
Vercel Engineering의 40+ 룰, 8개 카테고리를 따른다:
- **CRITICAL**: Waterfall 제거, 번들 사이즈 최적화
- **HIGH**: 서버 사이드 성능 (Server Action 인증, RSC 최소 직렬화, React.cache)
- **MEDIUM+**: 클라이언트 데이터 페칭 (SWR), 리렌더 최적화, 렌더링 성능
- **LOW+**: JS 성능 최적화, 고급 패턴

### 7.2 Clean Code (→ [CLEAN-CODE.md](./CLEAN-CODE.md))
- **SOLID** 원칙 (단일 책임, 개방/폐쇄, 리스코프 치환, 인터페이스 분리, 의존성 역전)
- **DRY, KISS, YAGNI** — 중복 제거, 단순하게, 필요한 것만
- 의미 있는 네이밍, 함수는 한 가지만, 주석 대신 자명한 코드
- Early return으로 깊은 중첩 회피, 매직 넘버 금지

### 7.3 보안 — OWASP Top 10 (→ [SECURITY.md](./SECURITY.md))
- A01~A10 모든 항목에 대한 구체적 예방 코드
- 모든 Server Action에 인증/인가, zod 입력 검증, Drizzle parameterized query
- 보안 헤더, rate limiting, audit_logs, 웹훅 서명 검증

### 7.4 TDD (→ [TESTING.md](./TESTING.md))
- **Vitest** (단위/통합) + **Playwright** (E2E)
- Red → Green → Refactor 사이클
- 테스트 커버리지 목표: **80%+**
- 모든 Server Action, API Route, 비즈니스 로직에 테스트 필수

### 환경 변수
- 모든 환경 변수는 `NEXT_PUBLIC_` prefix로 클라이언트 노출 여부 구분
- 서버 전용: `SUPABASE_SERVICE_ROLE_KEY`, `TOSS_SECRET_KEY`
- 클라이언트: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
