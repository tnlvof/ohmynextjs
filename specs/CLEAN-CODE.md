# CLEAN-CODE — 클린 코드 원칙

## 1. 목적

모든 코드는 **읽기 쉽고, 유지보수하기 쉽고, 테스트하기 쉬워야** 한다. 이 문서는 OhMyNextJS 프로젝트의 코드 품질 기준을 정의한다.

---

## 2. SOLID 원칙

### S — Single Responsibility Principle (단일 책임)
- 하나의 함수/컴포넌트는 **하나의 일만** 한다
- 파일당 하나의 주요 export
- 컴포넌트가 데이터 fetching + 렌더링 + 상태 관리를 모두 하면 분리

```typescript
// ❌ Bad: 모든 걸 하나에
function UserPage() {
  const [users, setUsers] = useState([])
  useEffect(() => { fetch('/api/users').then(...) }, [])
  const filtered = users.filter(...)
  return <table>...</table>
}

// ✅ Good: 역할 분리
function UserPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <UserList />
    </Suspense>
  )
}
async function UserList() {
  const users = await getUsers()
  return <UserTable users={users} />
}
```

### O — Open/Closed Principle (개방/폐쇄)
- 확장에 열려 있고, 수정에 닫혀 있어야 함
- 새로운 기능은 기존 코드 수정 없이 추가 가능하도록 설계
- 컴포넌트 합성(composition) 패턴 활용

### L — Liskov Substitution Principle (리스코프 치환)
- 하위 타입은 상위 타입을 대체할 수 있어야 함
- TypeScript 인터페이스로 계약 정의

### I — Interface Segregation Principle (인터페이스 분리)
- 큰 인터페이스보다 작은 인터페이스 여러 개
- Props는 필요한 것만 받기 (RSC 경계 최소화와도 일치)

```typescript
// ❌ Bad
interface UserCardProps {
  user: FullUser  // 50개 필드
}

// ✅ Good
interface UserCardProps {
  name: string
  email: string
  avatarUrl?: string
}
```

### D — Dependency Inversion Principle (의존성 역전)
- 구체 구현이 아닌 추상(인터페이스)에 의존
- DB 클라이언트, 외부 API는 추상화 레이어를 통해 접근

---

## 3. DRY, KISS, YAGNI

### DRY (Don't Repeat Yourself)
- 동일 로직이 **3번 이상** 반복되면 추출
- 공통 유틸은 `packages/core/src/lib/`에 배치
- 공통 훅은 `packages/core/src/hooks/`에 배치
- 단, 과도한 DRY로 결합도를 높이지 말 것 (AHA — Avoid Hasty Abstractions)

### KISS (Keep It Simple, Stupid)
- 가장 단순한 해결책을 우선
- 불필요한 추상화 레이어 금지
- 복잡한 제네릭보다 명시적 타입

### YAGNI (You Aren't Gonna Need It)
- 현재 필요하지 않은 기능은 구현하지 않음
- "나중에 필요할 수도" → 구현하지 않음
- 스펙에 정의된 것만 구현

---

## 4. 의미 있는 네이밍

### 규칙
- 변수/함수: **의도가 드러나는** 이름
- Boolean: `is-`, `has-`, `can-`, `should-` prefix
- 함수: 동사로 시작 (`get`, `create`, `update`, `delete`, `handle`, `validate`)
- 이벤트 핸들러: `handle-` prefix (`handleSubmit`, `handleClick`)
- 커스텀 훅: `use-` prefix
- 타입/인터페이스: 명사 (PascalCase)

```typescript
// ❌ Bad
const d = new Date()
const list = users.filter(u => u.a)
function process(data: any) { ... }

// ✅ Good
const createdAt = new Date()
const activeUsers = users.filter(user => user.isActive)
function validatePaymentAmount(payment: Payment): boolean { ... }
```

### 약어 금지 (예외: 관용적 약어)
- ✅ 허용: `id`, `url`, `api`, `db`, `ui`, `css`, `html`, `svg`
- ❌ 금지: `usr`, `btn` (변수명), `msg`, `cnt`, `idx` (루프 제외)

---

## 5. 함수는 한 가지만

- 함수 길이: **20줄 이하** 권장 (40줄 초과 시 분리 검토)
- 파라미터: **3개 이하** 권장 (초과 시 객체로 묶기)
- 하나의 추상화 수준만 다루기

```typescript
// ❌ Bad: 여러 일을 하는 함수
async function processPayment(orderId: string) {
  const order = await db.query.payments.findFirst(...)
  if (!order) throw new Error('Not found')
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  if (order.userId !== session.user.id) throw new Error('Forbidden')
  const result = await tossClient.confirmPayment(...)
  await db.update(payments).set({ status: 'paid' }).where(...)
  await logAudit(...)
  return result
}

// ✅ Good: 각각 한 가지 일
async function processPayment(orderId: string) {
  const order = await findOrderOrThrow(orderId)
  const session = await requireAuth()
  assertOwnership(order, session)
  const result = await confirmTossPayment(order)
  await markAsPaid(order, result)
  await logPaymentAudit(order, session)
  return result
}
```

---

## 6. 주석 대신 자명한 코드

### 나쁜 주석
```typescript
// ❌ 코드를 반복하는 주석
// 유저 이름을 설정한다
user.name = name

// ❌ 주석으로 나쁜 코드를 변명
// TODO: 나중에 리팩토링
const x = data.filter(d => d.s === 'a').map(d => d.v * 1.1)
```

### 좋은 주석 (허용)
```typescript
// ✅ WHY를 설명하는 주석
// Kakao OAuth는 prompt: 'login'이 없으면 자동 로그인됨
queryParams: provider === 'kakao' ? { prompt: 'login' } : undefined

// ✅ 복잡한 비즈니스 로직 설명
// 토스 결제 승인 시 금액 위변조 방지를 위해 서버측 amount 검증 필수
if (order.amount !== requestedAmount) throw new Error('PAYMENT_AMOUNT_MISMATCH')

// ✅ 정규식 설명
// 한국 전화번호: 010-XXXX-XXXX 또는 01X-XXX-XXXX
const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/
```

---

## 7. 깊은 중첩 회피 (Early Return)

```typescript
// ❌ Bad: 깊은 중첩
async function updateUser(userId: string, data: UpdateData) {
  const session = await auth()
  if (session) {
    const user = await getUser(userId)
    if (user) {
      if (session.user.id === userId || session.user.role === 'admin') {
        await db.update(users).set(data).where(eq(users.id, userId))
        return { success: true }
      } else {
        throw new Error('Forbidden')
      }
    } else {
      throw new Error('Not found')
    }
  } else {
    throw new Error('Unauthorized')
  }
}

// ✅ Good: Early Return
async function updateUser(userId: string, data: UpdateData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const user = await getUser(userId)
  if (!user) throw new Error('Not found')

  const isOwner = session.user.id === userId
  const isAdmin = session.user.role === 'admin'
  if (!isOwner && !isAdmin) throw new Error('Forbidden')

  await db.update(users).set(data).where(eq(users.id, userId))
  return { success: true }
}
```

---

## 8. 매직 넘버 금지

```typescript
// ❌ Bad
if (password.length < 6) { ... }
const maxRetries = 3
setTimeout(fn, 300000)

// ✅ Good
const MIN_PASSWORD_LENGTH = 6
const MAX_BILLING_RETRIES = 3
const CACHE_TTL_MS = 5 * 60 * 1000  // 5분

if (password.length < MIN_PASSWORD_LENGTH) { ... }
```

모든 상수는 `packages/core/src/lib/constants.ts` 또는 해당 모듈의 constants 파일에 정의.

---

## 9. 에러 처리 원칙

- **절대 에러를 삼키지 말 것** (빈 catch 금지)
- 에러는 적절한 레벨에서 처리
- 사용자에게 보여줄 메시지와 로깅용 메시지 분리
- 커스텀 에러 클래스 사용

```typescript
// ✅ Good: 커스텀 에러
class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource}을(를) 찾을 수 없습니다`, 404)
  }
}
```

---

## 10. 파일 구조 원칙

- **Colocation**: 관련 파일은 가까이 배치
- 한 파일에 하나의 주요 컴포넌트/함수
- 파일이 **200줄** 초과 시 분리 검토
- index.ts는 re-export 전용 (barrel file, 단 import는 직접 경로 사용)

---

## 11. TypeScript 엄격 모드

- `strict: true` 필수
- `any` 사용 금지 (불가피 시 `unknown` + 타입 가드)
- 타입 단언(`as`) 최소화
- 유틸리티 타입 활용 (`Pick`, `Omit`, `Partial`, `Required`)
