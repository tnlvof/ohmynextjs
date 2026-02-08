# AUTH — 인증 모듈 상세 스펙

## 1. 목적과 범위

Supabase Auth 기반 인증을 처리한다. 소셜 로그인(Google, Kakao, Naver, GitHub)과 이메일/비밀번호 로그인을 모두 코드로 구현하되, 실제 활성화는 Supabase 대시보드 설정에 의존한다.

## 2. 패키지 구조

```
packages/auth/
├── src/
│   ├── index.ts                # Public API
│   ├── supabase/
│   │   ├── client.ts           # 브라우저용 Supabase 클라이언트
│   │   ├── server.ts           # 서버용 Supabase 클라이언트
│   │   └── middleware.ts       # Next.js 미들웨어용 클라이언트
│   ├── actions/
│   │   ├── sign-in.ts          # 로그인 서버 액션
│   │   ├── sign-up.ts          # 회원가입 서버 액션
│   │   ├── sign-out.ts         # 로그아웃 서버 액션
│   │   ├── oauth.ts            # 소셜 로그인 서버 액션
│   │   └── reset-password.ts   # 비밀번호 재설정
│   ├── components/
│   │   ├── auth-form.tsx       # 로그인/회원가입 통합 폼
│   │   ├── social-buttons.tsx  # 소셜 로그인 버튼 그룹
│   │   ├── user-button.tsx     # 유저 아바타 드롭다운
│   │   └── auth-guard.tsx      # 인증 필수 래퍼
│   ├── hooks/
│   │   ├── use-user.ts         # 현재 유저 정보
│   │   └── use-session.ts      # 세션 상태
│   ├── middleware.ts            # Auth 미들웨어 헬퍼
│   └── types.ts                # 인증 관련 타입
├── package.json
└── tsconfig.json
```

## 3. 상세 요구사항

### 3.1 Supabase 클라이언트

#### 브라우저 클라이언트
```typescript
// supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

#### 서버 클라이언트
```typescript
// supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

#### Admin 클라이언트 (서버 전용)
```typescript
// supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
```

### 3.2 이메일/비밀번호 인증

#### 회원가입
```typescript
// actions/sign-up.ts
'use server';

interface SignUpInput {
  email: string;
  password: string;
  name?: string;
}

// 1. supabase.auth.signUp({ email, password })
// 2. 성공 시 users 테이블에 프로필 생성 (DB trigger 또는 수동)
// 3. 이메일 확인 메일 자동 발송 (Supabase 설정)
// 4. redirect to /auth/verify-email
```

#### 로그인
```typescript
// actions/sign-in.ts
'use server';

interface SignInInput {
  email: string;
  password: string;
}

// 1. supabase.auth.signInWithPassword({ email, password })
// 2. 성공 시 users.last_sign_in_at 업데이트
// 3. redirect to /dashboard
// 에러: 'Invalid login credentials' → '이메일 또는 비밀번호가 올바르지 않습니다'
```

#### 비밀번호 재설정
```typescript
// actions/reset-password.ts
'use server';

// 1. supabase.auth.resetPasswordForEmail(email, { redirectTo })
// 2. /auth/reset-password?code=xxx 페이지에서 새 비밀번호 입력
// 3. supabase.auth.updateUser({ password: newPassword })
```

### 3.3 소셜 로그인 (OAuth)

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
// 1. code → session 교환
// 2. users 테이블에 프로필 upsert
// 3. redirect to /dashboard
```

#### Provider별 Supabase 대시보드 설정 가이드

| Provider | Client ID 환경변수 | Redirect URL |
|----------|-------------------|--------------|
| Google | Supabase 대시보드에서 설정 | `{SUPABASE_URL}/auth/v1/callback` |
| Kakao | Supabase 대시보드에서 설정 | `{SUPABASE_URL}/auth/v1/callback` |
| Naver | Supabase 대시보드에서 설정 | `{SUPABASE_URL}/auth/v1/callback` |
| GitHub | Supabase 대시보드에서 설정 | `{SUPABASE_URL}/auth/v1/callback` |

### 3.4 Auth 미들웨어

```typescript
// middleware.ts
// Next.js middleware에서 사용
// 1. 세션 갱신 (토큰 리프레시)
// 2. 보호된 라우트 체크
// 3. 미인증 시 /auth/login으로 리다이렉트
// 4. 관리자 라우트: role 체크

export const protectedRoutes = ['/dashboard', '/settings', '/billing'];
export const adminRoutes = ['/admin'];
export const authRoutes = ['/auth/login', '/auth/signup']; // 로그인 상태면 리다이렉트
```

### 3.5 Supabase DB Trigger (유저 자동 생성)

```sql
-- Supabase에서 auth.users 생성 시 public.users에 자동 삽입
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

### 3.6 컴포넌트

#### AuthForm
```typescript
interface AuthFormProps {
  mode: 'login' | 'signup';
  showSocial?: boolean;       // 기본: true
  redirectTo?: string;        // 로그인 후 이동 경로
}

// - 이메일/비밀번호 입력 폼
// - mode에 따라 로그인/회원가입 전환 링크
// - 비밀번호 재설정 링크 (로그인 모드)
// - 하단에 SocialButtons
// - react-hook-form + zod 유효성 검증
```

#### SocialButtons
```typescript
interface SocialButtonsProps {
  providers?: OAuthProvider[];  // 기본: ['google', 'kakao', 'naver', 'github']
  size?: 'sm' | 'default' | 'lg';
}

// - 각 provider별 아이콘 + 브랜드 컬러
// - Google: #4285F4, Kakao: #FEE500, Naver: #03C75A, GitHub: #333
// - 클릭 시 signInWithOAuth 호출
// - 로딩 상태 표시
```

#### UserButton
```typescript
interface UserButtonProps {
  showName?: boolean;         // 기본: false
}

// - 아바타 이미지 (없으면 이니셜)
// - 드롭다운: 프로필, 설정, 빌링, 로그아웃
// - 관리자인 경우: '관리자 대시보드' 메뉴 추가
```

#### AuthGuard
```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;  // 미인증 시 표시 (기본: redirect)
  requiredRole?: 'admin' | 'user';
}
```

### 3.7 Hooks

```typescript
// hooks/use-user.ts
// 현재 로그인한 유저 정보 (users 테이블 기준)
export function useUser(): {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// hooks/use-session.ts
// Supabase 세션 상태
export function useSession(): {
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

## 4. 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # 서버 전용
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. 에러 처리

| 에러 코드 | 상황 | 사용자 메시지 |
|-----------|------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 잘못된 이메일/비밀번호 | 이메일 또는 비밀번호가 올바르지 않습니다 |
| `AUTH_EMAIL_EXISTS` | 이미 가입된 이메일 | 이미 가입된 이메일입니다 |
| `AUTH_WEAK_PASSWORD` | 비밀번호 6자 미만 | 비밀번호는 6자 이상이어야 합니다 |
| `AUTH_EMAIL_NOT_CONFIRMED` | 이메일 미인증 | 이메일 인증을 완료해주세요 |
| `AUTH_USER_BANNED` | 밴된 유저 | 계정이 정지되었습니다 |
| `AUTH_SESSION_EXPIRED` | 세션 만료 | 다시 로그인해주세요 |

## 6. 의존성

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

## 8. 테스트 전략

| 대상 | 유형 | 주요 케이스 |
|------|------|------------|
| `signIn` | 단위 (Vitest) | 성공, 잘못된 credentials, 밴된 유저, 이메일 미인증 |
| `signUp` | 단위 | 성공, 중복 이메일, 약한 비밀번호, users 테이블 동기화 |
| `signOut` | 단위 | 세션 삭제, 쿠키 정리 |
| `signInWithOAuth` | 단위 | 리다이렉트 URL 생성, provider별 queryParams |
| `resetPassword` | 단위 | 이메일 발송, 새 비밀번호 설정 |
| `authMiddleware` | 단위 | 보호 라우트 리다이렉트, admin 라우트 role 체크, 세션 갱신 |
| `AuthForm` | 컴포넌트 | 로그인/회원가입 모드 전환, 유효성 검증, 에러 표시, 제출 |
| `SocialButtons` | 컴포넌트 | 버튼 렌더링, 클릭 시 OAuth 호출, 로딩 상태 |
| `UserButton` | 컴포넌트 | 아바타 표시, 드롭다운 메뉴, admin 메뉴 조건부 표시 |
| `AuthGuard` | 컴포넌트 | 인증 시 children 렌더링, 미인증 시 fallback/리다이렉트 |
| `useUser` / `useSession` | 단위 | 로딩 상태, 유저 데이터 반환, 에러 처리 |
| 로그인 플로우 | E2E (Playwright) | 이메일 로그인, 잘못된 비밀번호, 미인증 리다이렉트 |

## 9. 보안 고려사항

- **Supabase Auth 위임**: 비밀번호 해싱, 토큰 관리 등 직접 구현 금지
- **세션 갱신**: 미들웨어에서 매 요청마다 토큰 리프레시
- **banned 유저**: 로그인 차단 + 기존 세션 무효화 (`supabaseAdmin.auth.admin.signOut`)
- **Rate Limiting**: 로그인/회원가입 엔드포인트에 10회/분 제한 (IP 기준)
- **OAuth callback**: state 파라미터 검증 (CSRF 방지, Supabase가 자동 처리)
- **환경 변수**: `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용, 클라이언트 절대 노출 금지
- **에러 메시지**: 유저 존재 여부를 유추할 수 없도록 일반적 메시지 사용

## 10. 구현 우선순위

1. Supabase 클라이언트 (browser + server)
2. 이메일/비밀번호 로그인/회원가입
3. DB trigger (유저 자동 생성)
4. OAuth (Google → GitHub → Kakao → Naver)
5. 미들웨어
6. 컴포넌트 (AuthForm → SocialButtons → UserButton)
7. Hooks
