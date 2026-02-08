# SECURITY — OWASP Top 10 보안 스펙

## 1. 목적

모든 코드는 **OWASP Top 10 (2021)** 취약점을 예방해야 한다. 이 문서는 OhMyNextJS 기술스택 기준 구체적 구현 방법을 정의한다.

---

## 2. A01: Broken Access Control (접근 제어 실패)

### 원칙
- 모든 Server Action과 API Route에 **인증 + 인가** 체크 필수
- 미들웨어만으로 충분하지 않음 — Server Action은 직접 호출 가능

### 구현

```typescript
// ✅ 모든 Server Action에 인증 체크
'use server'
export async function deleteUser(userId: string) {
  const session = await requireAuth()
  requireRole(session, 'admin')
  // ... 실행
}

// ✅ 인가 헬퍼 함수
async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new AppError('AUTH_REQUIRED', '로그인이 필요합니다', 401)
  return user
}

function requireRole(session: Session, role: UserRole) {
  if (session.user.role !== role) {
    throw new AppError('AUTH_FORBIDDEN', '접근 권한이 없습니다', 403)
  }
}

function requireOwnership(resourceUserId: string, sessionUserId: string) {
  if (resourceUserId !== sessionUserId) {
    throw new AppError('AUTH_FORBIDDEN', '본인의 리소스만 접근 가능합니다', 403)
  }
}
```

### 체크리스트
- [ ] 모든 Server Action에 `requireAuth()` 호출
- [ ] 관리자 액션에 `requireRole(session, 'admin')` 호출
- [ ] 리소스 소유권 체크 (`requireOwnership`)
- [ ] 미들웨어: 보호된 라우트 체크, admin 라우트 role 체크
- [ ] IDOR(Insecure Direct Object Reference) 방지: URL 파라미터 ID 검증

---

## 3. A02: Cryptographic Failures (암호화 실패)

### 원칙
- 민감 데이터는 **절대 평문 저장/전송 금지**
- HTTPS 강제

### 구현

```typescript
// ✅ 환경 변수로 민감 데이터 관리
// .env.local (git 무시됨)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
TOSS_SECRET_KEY=test_sk_...

// ✅ 서버 전용 환경 변수 접근 체크
function getServerEnv(key: string): string {
  if (typeof window !== 'undefined') {
    throw new Error(`서버 전용 환경 변수 ${key}를 클라이언트에서 접근 시도`)
  }
  const value = process.env[key]
  if (!value) throw new Error(`환경 변수 ${key}가 설정되지 않았습니다`)
  return value
}
```

### 체크리스트
- [ ] `.env.local`은 `.gitignore`에 포함
- [ ] `NEXT_PUBLIC_` prefix 없는 환경 변수는 서버 전용
- [ ] 비밀번호는 Supabase Auth가 bcrypt로 해싱 (직접 처리 금지)
- [ ] 토스 시크릿 키는 서버에서만 사용
- [ ] 로그에 민감 데이터 출력 금지

---

## 4. A03: Injection (인젝션)

### 원칙
- 모든 사용자 입력은 **zod로 검증**
- SQL: Drizzle ORM의 parameterized queries 사용 (raw SQL 금지)
- XSS: React의 기본 이스케이프 활용, `dangerouslySetInnerHTML` 금지

### 구현

```typescript
// ✅ 모든 입력은 zod 스키마로 검증
import { z } from 'zod'

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email(),
})

'use server'
export async function updateProfile(rawInput: unknown) {
  const input = updateProfileSchema.parse(rawInput)
  // Drizzle는 자동으로 parameterized query 생성
  await db.update(users).set({ name: input.name }).where(eq(users.id, userId))
}

// ❌ 절대 금지: raw SQL with string interpolation
// await db.execute(`SELECT * FROM users WHERE id = '${userId}'`)

// ✅ 필요 시 Drizzle의 sql 태그 사용
import { sql } from 'drizzle-orm'
await db.execute(sql`SELECT * FROM users WHERE id = ${userId}`)
```

### 체크리스트
- [ ] 모든 Server Action/Route Handler에 zod 검증
- [ ] Drizzle ORM만 사용 (raw SQL 금지, 불가피 시 `sql` 태그)
- [ ] `dangerouslySetInnerHTML` 사용 금지
- [ ] URL 파라미터/쿼리 스트링도 검증

---

## 5. A04: Insecure Design (불안전한 설계)

### 원칙
- 보안은 사후 대응이 아닌 **설계 단계에서** 고려
- 위협 모델링: 각 기능의 공격 벡터 사전 식별

### 가이드라인
- 결제 금액은 **서버에서 검증** (클라이언트 전송 금액 신뢰 금지)
- 역할 변경, 환불 등 민감 작업은 **audit_logs** 기록
- rate limiting으로 brute force 방지
- 비즈니스 로직은 서버(Server Action)에서만 실행

---

## 6. A05: Security Misconfiguration (보안 설정 오류)

### 구현

```typescript
// next.config.js — 보안 헤더
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.tosspayments.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.tosspayments.com;"
  },
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

### 체크리스트
- [ ] 보안 헤더 설정 (위 참고)
- [ ] 개발/프로덕션 환경 변수 분리
- [ ] 디버그 모드 프로덕션 비활성화
- [ ] `.env.example` 제공 (실제 값 없이)
- [ ] 불필요한 API 엔드포인트 노출 방지

---

## 7. A06: Vulnerable and Outdated Components (취약 컴포넌트)

### 원칙
- 의존성 최소화
- 정기적 보안 감사

### 구현

```bash
# 의존성 감사
pnpm audit

# 업데이트 확인
pnpm outdated

# 자동 수정
pnpm audit --fix
```

### 체크리스트
- [ ] `pnpm audit` CI에 포함
- [ ] 월 1회 의존성 업데이트 검토
- [ ] 사용하지 않는 의존성 제거
- [ ] lockfile(`pnpm-lock.yaml`) 커밋

---

## 8. A07: Identification and Authentication Failures (인증 실패)

### 원칙
- Supabase Auth 사용 (자체 구현 금지)
- 세션 관리는 Supabase가 처리

### 구현

```typescript
// ✅ Rate Limiting (로그인 시도)
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),  // 10회/분
  analytics: true,
})

// 미들웨어 또는 Server Action에서
const { success } = await ratelimit.limit(ip)
if (!success) throw new AppError('RATE_LIMITED', '요청이 너무 많습니다', 429)
```

### 체크리스트
- [ ] Supabase Auth 사용 (비밀번호 해싱, 세션 관리 위임)
- [ ] 로그인/회원가입에 rate limiting
- [ ] 비밀번호 최소 6자 (zod 검증)
- [ ] 세션 만료 시 자동 갱신 (미들웨어)
- [ ] banned 유저 세션 무효화

---

## 9. A08: Software and Data Integrity Failures (무결성 실패)

### 구현

```typescript
// ✅ 토스 웹훅 서명 검증
export async function POST(request: Request) {
  const signature = request.headers.get('TossPayments-Signature')
  const body = await request.text()
  
  if (!verifyTossSignature(body, signature, TOSS_WEBHOOK_SECRET)) {
    return new Response('Invalid signature', { status: 401 })
  }
  // ... 처리
}

// ✅ 결제 금액 무결성 검증
if (order.amount !== requestedAmount) {
  throw new AppError('PAYMENT_AMOUNT_MISMATCH', '금액 위변조 감지', 400)
}
```

### 체크리스트
- [ ] 웹훅 서명 검증
- [ ] 결제 금액 서버측 검증
- [ ] CSP 헤더 설정 (외부 스크립트 제한)
- [ ] lockfile 무결성 유지

---

## 10. A09: Security Logging and Monitoring Failures (로깅 실패)

### 구현

```typescript
// ✅ audit_logs 테이블 활용
async function logAudit(params: {
  userId?: string
  action: string
  target?: string
  targetId?: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}) {
  await db.insert(auditLogs).values({
    ...params,
    createdAt: new Date(),
  })
}

// ✅ 보안 이벤트 로깅 대상
// - 로그인 성공/실패
// - 역할 변경
// - 유저 밴/삭제
// - 결제/환불
// - 설정 변경
// - 비정상 접근 시도
```

### 로깅 필수 항목

| 이벤트 | action 값 | 상세 |
|--------|-----------|------|
| 로그인 성공 | `auth.sign_in` | provider, IP |
| 로그인 실패 | `auth.sign_in_failed` | 시도 email, IP |
| 역할 변경 | `admin.update_role` | 대상 userId, 이전/이후 role |
| 유저 밴 | `admin.ban_user` | 대상 userId, 사유 |
| 결제 승인 | `payment.confirmed` | orderId, amount |
| 환불 | `payment.refunded` | orderId, amount, reason |
| 설정 변경 | `admin.update_setting` | key, 이전/이후 value |

---

## 11. A10: Server-Side Request Forgery (SSRF)

### 원칙
- 사용자 입력으로 URL 접근 금지
- 외부 URL fetch 시 도메인 화이트리스트

### 구현

```typescript
// ✅ 허용된 도메인만 fetch
const ALLOWED_DOMAINS = [
  'api.tosspayments.com',
  // Supabase는 SDK가 처리
]

function validateExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_DOMAINS.includes(parsed.hostname)
  } catch {
    return false
  }
}
```

### 체크리스트
- [ ] 사용자 입력 URL로 서버 fetch 금지
- [ ] 외부 API 호출 시 도메인 화이트리스트
- [ ] 내부 네트워크 IP(127.0.0.1, 10.x, 192.168.x) 접근 차단

---

## 12. 보안 코드 리뷰 체크리스트

모든 PR에서 확인:

- [ ] Server Action에 인증/인가 체크가 있는가?
- [ ] 사용자 입력이 zod로 검증되는가?
- [ ] 민감 데이터가 클라이언트에 노출되지 않는가?
- [ ] 환경 변수가 적절히 사용되는가?
- [ ] audit_logs에 보안 이벤트가 기록되는가?
- [ ] raw SQL이 사용되지 않는가?
- [ ] `dangerouslySetInnerHTML`이 사용되지 않는가?
