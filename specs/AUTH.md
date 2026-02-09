# AUTH ???�증 모듈 ?�세 ?�펙

## 1. 목적�?범위

Supabase Auth 기반 ?�증??처리?�다. ?�셜 로그??Google, Kakao, Naver, GitHub)�??�메??비�?번호 로그?�을 모두 코드�?구현?�되, ?�제 ?�성?�는 Supabase ?�?�보???�정???�존?�다.

## 2. ?�키지 구조

```
packages/auth/
?��??� src/
??  ?��??� index.ts                # Public API
??  ?��??� supabase/
??  ??  ?��??� client.ts           # 브라?��???Supabase ?�라?�언????  ??  ?��??� server.ts           # ?�버??Supabase ?�라?�언????  ??  ?��??� middleware.ts       # Next.js 미들?�어???�라?�언????  ?��??� actions/
??  ??  ?��??� sign-in.ts          # 로그???�버 ?�션
??  ??  ?��??� sign-up.ts          # ?�원가???�버 ?�션
??  ??  ?��??� sign-out.ts         # 로그?�웃 ?�버 ?�션
??  ??  ?��??� oauth.ts            # ?�셜 로그???�버 ?�션
??  ??  ?��??� reset-password.ts   # 비�?번호 ?�설????  ?��??� components/
??  ??  ?��??� auth-form.tsx       # 로그???�원가???�합 ????  ??  ?��??� social-buttons.tsx  # ?�셜 로그??버튼 그룹
??  ??  ?��??� user-button.tsx     # ?��? ?�바?� ?�롭?�운
??  ??  ?��??� auth-guard.tsx      # ?�증 ?�수 ?�퍼
??  ?��??� hooks/
??  ??  ?��??� use-user.ts         # ?�재 ?��? ?�보
??  ??  ?��??� use-session.ts      # ?�션 ?�태
??  ?��??� middleware.ts            # Auth 미들?�어 ?�퍼
??  ?��??� types.ts                # ?�증 관???�???��??� package.json
?��??� tsconfig.json
```

## 3. ?�세 ?�구?�항

### 3.1 Supabase ?�라?�언??
#### 브라?��? ?�라?�언??```typescript
// supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
```

#### ?�버 ?�라?�언??```typescript
// supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

#### Admin ?�라?�언??(?�버 ?�용)
```typescript
// supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

### 3.2 ?�메??비�?번호 ?�증

#### ?�원가??```typescript
// actions/sign-up.ts
'use server';

interface SignUpInput {
  email: string;
  password: string;
  name?: string;
}

// 1. supabase.auth.signUp({ email, password })
// 2. ?�공 ??users ?�이블에 ?�로???�성 (DB trigger ?�는 ?�동)
// 3. ?�메???�인 메일 ?�동 발송 (Supabase ?�정)
// 4. redirect to /auth/verify-email
```

#### 로그??```typescript
// actions/sign-in.ts
'use server';

interface SignInInput {
  email: string;
  password: string;
}

// 1. supabase.auth.signInWithPassword({ email, password })
// 2. ?�공 ??users.last_sign_in_at ?�데?�트
// 3. redirect to /dashboard
// ?�러: 'Invalid login credentials' ??'?�메???�는 비�?번호가 ?�바르�? ?�습?�다'
```

#### 비�?번호 ?�설??```typescript
// actions/reset-password.ts
'use server';

// 1. supabase.auth.resetPasswordForEmail(email, { redirectTo })
// 2. /auth/reset-password?code=xxx ?�이지?�서 ??비�?번호 ?�력
// 3. supabase.auth.updateUser({ password: newPassword })
```

### 3.3 ?�셜 로그??(OAuth)

```typescript
// actions/oauth.ts
'use server';

type OAuthProvider = 'google' | 'kakao' | 'naver' | 'github';

export async function signInWithOAuth(provider: OAuthProvider) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      queryParams: provider === 'kakao' ? { prompt: 'login' } : undefined,
    },
  });
  if (error) throw error;
  redirect(data.url);
}
```

#### OAuth 콜백 처리
```typescript
// apps/web/app/api/auth/callback/route.ts
// GET /api/auth/callback?code=xxx
// 1. code ??session 교환
// 2. users ?�이블에 ?�로??upsert
// 3. redirect to /dashboard
```

#### Provider�?Supabase ?�?�보???�정 가?�드

| Provider | Client ID ?�경변??| Redirect URL |
|----------|-------------------|--------------|
| Google | Supabase ?�?�보?�에???�정 | `{SUPABASE_URL}/auth/v1/callback` |
| Kakao | Supabase ?�?�보?�에???�정 | `{SUPABASE_URL}/auth/v1/callback` |
| Naver | Supabase ?�?�보?�에???�정 | `{SUPABASE_URL}/auth/v1/callback` |
| GitHub | Supabase ?�?�보?�에???�정 | `{SUPABASE_URL}/auth/v1/callback` |

### 3.4 Auth 미들?�어

```typescript
// middleware.ts
// Next.js middleware?�서 ?�용
// 1. ?�션 갱신 (?�큰 리프?�시)
// 2. 보호???�우??체크
// 3. 미인�???/auth/login?�로 리다?�렉??// 4. 관리자 ?�우?? role 체크

export const protectedRoutes = ['/dashboard', '/settings', '/billing'];
export const adminRoutes = ['/admin'];
export const authRoutes = ['/auth/login', '/auth/signup']; // 로그???�태�?리다?�렉??```

### 3.5 Supabase DB Trigger (?��? ?�동 ?�성)

```sql
-- Supabase?�서 auth.users ?�성 ??public.users???�동 ?�입
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 3.6 컴포?�트

#### AuthForm
```typescript
interface AuthFormProps {
  mode: 'login' | 'signup';
  showSocial?: boolean;       // 기본: true
  redirectTo?: string;        // 로그?????�동 경로
}

// - ?�메??비�?번호 ?�력 ??// - mode???�라 로그???�원가???�환 링크
// - 비�?번호 ?�설??링크 (로그??모드)
// - ?�단??SocialButtons
// - react-hook-form + zod ?�효??검�?```

#### SocialButtons
```typescript
interface SocialButtonsProps {
  providers?: OAuthProvider[];  // 기본: ['google', 'kakao', 'naver', 'github']
  size?: 'sm' | 'default' | 'lg';
}

// - �?provider�??�이�?+ 브랜??컬러
// - Google: #4285F4, Kakao: #FEE500, Naver: #03C75A, GitHub: #333
// - ?�릭 ??signInWithOAuth ?�출
// - 로딩 ?�태 ?�시
```

#### UserButton
```typescript
interface UserButtonProps {
  showName?: boolean;         // 기본: false
}

// - ?�바?� ?��?지 (?�으�??�니??
// - ?�롭?�운: ?�로?? ?�정, 빌링, 로그?�웃
// - 관리자??경우: '관리자 ?�?�보?? 메뉴 추�?
```

#### AuthGuard
```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;  // 미인�????�시 (기본: redirect)
  requiredRole?: 'admin' | 'user';
}
```

### 3.7 Hooks

```typescript
// hooks/use-user.ts
// ?�재 로그?�한 ?��? ?�보 (users ?�이�?기�?)
export function useUser(): {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// hooks/use-session.ts
// Supabase ?�션 ?�태
export function useSession(): {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

## 4. ?�경 변??
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # ?�버 ?�용
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. ?�러 처리

| ?�러 코드 | ?�황 | ?�용??메시지 |
|-----------|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | ?�못???�메??비�?번호 | ?�메???�는 비�?번호가 ?�바르�? ?�습?�다 |
| `AUTH_EMAIL_EXISTS` | ?��? 가?�된 ?�메??| ?��? 가?�된 ?�메?�입?�다 |
| `AUTH_WEAK_PASSWORD` | 비�?번호 6??미만 | 비�?번호??6???�상?�어???�니??|
| `AUTH_EMAIL_NOT_CONFIRMED` | ?�메??미인�?| ?�메???�증???�료?�주?�요 |
| `AUTH_USER_BANNED` | 밴된 ?��? | 계정???��??�었?�니??|
| `AUTH_SESSION_EXPIRED` | ?�션 만료 | ?�시 로그?�해주세??|

## 6. ?�존??
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.47",
    "@supabase/ssr": "^0.5"
  },
  "peerDependencies": {
    "next": "^15",
    "react": "^19",
    "@ohmynextjs/core": "workspace:*",
    "@ohmynextjs/db": "workspace:*"
  }
}
```

## 7. Export (Public API)

```typescript
// index.ts
export { createClient } from './supabase/client';
export { createClient as createServerClient } from './supabase/server';
export { supabaseAdmin } from './supabase/admin';
export { signIn, signUp, signOut, signInWithOAuth, resetPassword } from './actions';
export { AuthForm, SocialButtons, UserButton, AuthGuard } from './components';
export { useUser, useSession } from './hooks';
export { authMiddleware, protectedRoutes, adminRoutes } from './middleware';
export type { OAuthProvider, User } from './types';
```

## 8. ?�스???�략

| ?�??| ?�형 | 주요 케?�스 |
|------|------|------------|
| `signIn` | ?�위 (Vitest) | ?�공, ?�못??credentials, 밴된 ?��?, ?�메??미인�?|
| `signUp` | ?�위 | ?�공, 중복 ?�메?? ?�한 비�?번호, users ?�이�??�기??|
| `signOut` | ?�위 | ?�션 ??��, 쿠키 ?�리 |
| `signInWithOAuth` | ?�위 | 리다?�렉??URL ?�성, provider�?queryParams |
| `resetPassword` | ?�위 | ?�메??발송, ??비�?번호 ?�정 |
| `authMiddleware` | ?�위 | 보호 ?�우??리다?�렉?? admin ?�우??role 체크, ?�션 갱신 |
| `AuthForm` | 컴포?�트 | 로그???�원가??모드 ?�환, ?�효??검�? ?�러 ?�시, ?�출 |
| `SocialButtons` | 컴포?�트 | 버튼 ?�더�? ?�릭 ??OAuth ?�출, 로딩 ?�태 |
| `UserButton` | 컴포?�트 | ?�바?� ?�시, ?�롭?�운 메뉴, admin 메뉴 조건부 ?�시 |
| `AuthGuard` | 컴포?�트 | ?�증 ??children ?�더�? 미인�???fallback/리다?�렉??|
| `useUser` / `useSession` | ?�위 | 로딩 ?�태, ?��? ?�이??반환, ?�러 처리 |
| 로그???�로??| E2E (Playwright) | ?�메??로그?? ?�못??비�?번호, 미인�?리다?�렉??|

## 9. 보안 고려?�항

- **Supabase Auth ?�임**: 비�?번호 ?�싱, ?�큰 관�???직접 구현 금�?
- **?�션 갱신**: 미들?�어?�서 �??�청마다 ?�큰 리프?�시
- **banned ?��?**: 로그??차단 + 기존 ?�션 무효??(`supabaseAdmin.auth.admin.signOut`)
- **Rate Limiting**: 로그???�원가???�드?�인?�에 10??�??�한 (IP 기�?)
- **OAuth callback**: state ?�라미터 검�?(CSRF 방�?, Supabase가 ?�동 처리)
- **?�경 변??*: `SUPABASE_SERVICE_ROLE_KEY`???�버 ?�용, ?�라?�언???��? ?�출 금�?
- **?�러 메시지**: ?��? 존재 ?��?�??�추?????�도�??�반??메시지 ?�용

## 10. 구현 ?�선?�위

1. Supabase ?�라?�언??(browser + server)
2. ?�메??비�?번호 로그???�원가??3. DB trigger (?��? ?�동 ?�성)
4. OAuth (Google ??GitHub ??Kakao ??Naver)
5. 미들?�어
6. 컴포?�트 (AuthForm ??SocialButtons ??UserButton)
7. Hooks
