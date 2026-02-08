# TESTING — TDD 및 테스트 전략

## 1. 목적

모든 코드는 **테스트 코드부터 작성**한다 (TDD). 테스트 커버리지 80%+ 목표.

---

## 2. TDD 사이클

```
1. 🔴 Red   — 실패하는 테스트를 먼저 작성
2. 🟢 Green — 테스트를 통과하는 최소한의 코드 작성
3. 🔵 Refactor — 코드를 개선 (테스트는 여전히 통과)
```

### 개발 워크플로우

1. 기능 스펙 확인
2. 테스트 케이스 목록 작성
3. 테스트 코드 작성 (실패 확인)
4. 구현 코드 작성 (통과 확인)
5. 리팩토링
6. 반복

---

## 3. 테스트 프레임워크

| 도구 | 용도 |
|------|------|
| **Vitest** | 단위 테스트, 통합 테스트 |
| **Playwright** | E2E 테스트 |
| **Testing Library** | React 컴포넌트 테스트 |
| **MSW** | API 모킹 (Mock Service Worker) |

---

## 4. 프로젝트 설정

### Vitest 설정

```typescript
// vitest.config.ts (루트)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types.ts',
        'drizzle/',
      ],
    },
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web'),
      '@ohmynextjs/core': path.resolve(__dirname, './packages/core/src'),
      '@ohmynextjs/db': path.resolve(__dirname, './packages/db/src'),
      '@ohmynextjs/auth': path.resolve(__dirname, './packages/auth/src'),
      '@ohmynextjs/admin': path.resolve(__dirname, './packages/admin/src'),
      '@ohmynextjs/payment': path.resolve(__dirname, './packages/payment/src'),
    },
  },
})
```

### Playwright 설정

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Setup 파일

```typescript
// tests/setup.ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

---

## 5. 테스트 구조

### 디렉토리 구조

```
ohmynextjs/
├── packages/
│   ├── core/
│   │   └── src/
│   │       ├── lib/
│   │       │   ├── cn.ts
│   │       │   └── cn.test.ts          # 같은 폴더에 테스트
│   │       └── hooks/
│   │           ├── use-media-query.ts
│   │           └── use-media-query.test.ts
│   ├── db/
│   │   └── src/
│   │       └── __tests__/              # 또는 __tests__ 폴더
│   │           └── queries.test.ts
│   ├── auth/
│   │   └── src/
│   │       └── actions/
│   │           ├── sign-in.ts
│   │           └── sign-in.test.ts
│   └── payment/
│       └── src/
│           └── toss/
│               ├── client.ts
│               └── client.test.ts
├── tests/
│   ├── setup.ts                        # Vitest 전역 설정
│   ├── helpers/                        # 테스트 헬퍼
│   │   ├── db.ts                       # 테스트 DB 헬퍼
│   │   └── auth.ts                     # 인증 모킹 헬퍼
│   └── e2e/                            # Playwright E2E 테스트
│       ├── auth.spec.ts
│       ├── payment.spec.ts
│       └── admin.spec.ts
```

### 테스트 작성 패턴

```typescript
// ✅ describe/it/expect 패턴
describe('confirmPayment', () => {
  it('주문 금액과 요청 금액이 다르면 에러를 던진다', async () => {
    // Arrange
    const order = createMockOrder({ amount: 10000 })
    vi.mocked(findOrder).mockResolvedValue(order)

    // Act & Assert
    await expect(
      confirmPayment({ orderId: order.orderId, paymentKey: 'pk_test', amount: 9999 })
    ).rejects.toThrow('PAYMENT_AMOUNT_MISMATCH')
  })

  it('결제 승인 성공 시 payments를 업데이트한다', async () => {
    // Arrange
    const order = createMockOrder({ amount: 10000 })
    vi.mocked(findOrder).mockResolvedValue(order)
    vi.mocked(tossClient.confirmPayment).mockResolvedValue(mockTossResponse)

    // Act
    const result = await confirmPayment({
      orderId: order.orderId,
      paymentKey: 'pk_test',
      amount: 10000,
    })

    // Assert
    expect(result.status).toBe('paid')
    expect(db.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'paid' })
    )
  })
})
```

### AAA 패턴

모든 테스트는 **Arrange-Act-Assert** 패턴을 따른다:
- **Arrange**: 테스트 데이터와 모킹 설정
- **Act**: 테스트 대상 함수/컴포넌트 실행
- **Assert**: 결과 검증

---

## 6. 모킹 전략

### Vitest Mock

```typescript
// 모듈 모킹
vi.mock('@ohmynextjs/db', () => ({
  db: {
    query: { users: { findFirst: vi.fn() } },
    insert: vi.fn().mockReturnValue({ values: vi.fn() }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn() }) }),
  },
}))

// Supabase Auth 모킹
vi.mock('@ohmynextjs/auth', () => ({
  createClient: vi.fn().mockReturnValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id', email: 'test@test.com' } },
      }),
    },
  }),
}))
```

### MSW (API 모킹)

```typescript
// tests/helpers/msw.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('https://api.tosspayments.com/v1/payments/confirm', () => {
    return HttpResponse.json({
      paymentKey: 'pk_test',
      orderId: 'OMN_test',
      status: 'DONE',
    })
  }),
]

export const server = setupServer(...handlers)
```

---

## 7. DB 테스트

```typescript
// tests/helpers/db.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@ohmynextjs/db/schema'

// 테스트 전용 DB (docker-compose로 실행)
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5433/ohmynextjs_test'

export function createTestDb() {
  const client = postgres(TEST_DATABASE_URL, { prepare: false })
  return drizzle(client, { schema })
}

// 테스트 간 데이터 격리
export async function cleanupTestDb(db: ReturnType<typeof createTestDb>) {
  await db.delete(schema.auditLogs)
  await db.delete(schema.payments)
  await db.delete(schema.subscriptions)
  await db.delete(schema.users)
  await db.delete(schema.plans)
}
```

### Docker Compose (테스트 DB)

```yaml
# docker-compose.test.yml
services:
  test-db:
    image: postgres:16
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: ohmynextjs_test
    ports:
      - "5433:5432"
```

---

## 8. 모듈별 테스트 전략

### 8.1 core 패키지

| 대상 | 테스트 유형 | 주요 테스트 케이스 |
|------|------------|-------------------|
| `cn()` | 단위 | 클래스 병합, 조건부 클래스, Tailwind 충돌 해결 |
| `useMediaQuery` | 단위 | breakpoint 변경 감지, SSR 기본값 |
| `ThemeToggle` | 컴포넌트 | 테마 전환, 아이콘 변경, localStorage 저장 |
| `Header` | 컴포넌트 | 네비게이션 렌더링, 모바일 메뉴, 인증 상태별 UI |

### 8.2 db 패키지

| 대상 | 테스트 유형 | 주요 테스트 케이스 |
|------|------------|-------------------|
| 스키마 | 통합 | 마이그레이션 적용, 테이블 생성 확인 |
| 쿼리 | 통합 | CRUD 작업, 관계 조회, 필터/페이지네이션 |
| 제약조건 | 통합 | unique 위반, FK 위반, NOT NULL 위반 |

### 8.3 auth 패키지

| 대상 | 테스트 유형 | 주요 테스트 케이스 |
|------|------------|-------------------|
| `signIn` | 단위 | 성공, 잘못된 credentials, 밴된 유저, rate limit |
| `signUp` | 단위 | 성공, 중복 이메일, 약한 비밀번호 |
| `signInWithOAuth` | 단위 | 리다이렉트 URL 생성, provider별 옵션 |
| `authMiddleware` | 단위 | 보호 라우트 리다이렉트, admin 체크, 세션 갱신 |
| `AuthForm` | 컴포넌트 | 폼 유효성 검증, 제출, 에러 표시 |

### 8.4 payment 패키지

| 대상 | 테스트 유형 | 주요 테스트 케이스 |
|------|------------|-------------------|
| `tossClient` | 단위 (MSW) | API 호출, 에러 응답 처리, 인증 헤더 |
| `createOrder` | 단위 | 주문 생성, orderId 형식, 인증 체크 |
| `confirmPayment` | 단위 | 금액 검증, 토스 승인, DB 업데이트 |
| `cancelPayment` | 단위 | 전액/부분 환불, 이미 환불된 결제 |
| `PricingTable` | 컴포넌트 | 플랜 렌더링, 현재 플랜 하이라이트, 선택 콜백 |

### 8.5 admin 패키지

| 대상 | 테스트 유형 | 주요 테스트 케이스 |
|------|------------|-------------------|
| `requireAdmin` | 단위 | admin 허용, 일반 유저 거부, 미인증 거부 |
| `updateUserRole` | 단위 | 역할 변경, 자기 자신 변경 거부, audit 기록 |
| `getAdminStats` | 단위 | 통계 계산, 전일 대비 증감 |
| `UserTable` | 컴포넌트 | 목록 렌더링, 필터, 페이지네이션, 액션 |

---

## 9. E2E 테스트

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('인증 플로우', () => {
  test('이메일/비밀번호로 로그인할 수 있다', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('잘못된 비밀번호로 로그인 시 에러 메시지가 표시된다', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'wrong')
    await page.click('button[type="submit"]')
    await expect(page.locator('[role="alert"]')).toContainText('이메일 또는 비밀번호')
  })

  test('미인증 상태에서 /dashboard 접근 시 로그인으로 리다이렉트', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth\/login/)
  })
})
```

### E2E 테스트 대상

| 플로우 | 파일 | 시나리오 |
|--------|------|----------|
| 인증 | `auth.spec.ts` | 로그인, 회원가입, 로그아웃, OAuth |
| 결제 | `payment.spec.ts` | 요금제 선택, 결제 플로우, 구독 취소 |
| 관리자 | `admin.spec.ts` | 유저 목록, 역할 변경, 설정 관리 |
| 네비게이션 | `navigation.spec.ts` | 라우트 접근, 반응형, 에러 페이지 |

---

## 10. npm 스크립트

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:db:up": "docker compose -f docker-compose.test.yml up -d",
    "test:db:down": "docker compose -f docker-compose.test.yml down"
  }
}
```

---

## 11. CI 통합

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: ohmynextjs_test
        ports: ['5433:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: pnpm install
      - run: pnpm test:run
      - run: pnpm test:coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
```
