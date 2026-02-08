# Supabase 설정 가이드

## 1. 프로젝트 생성

1. [supabase.com](https://supabase.com)에 접속하여 계정 생성/로그인
2. **New Project** 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전(Northeast Asia - Tokyo 권장) 설정
4. **Create new project** 클릭 후 프로비저닝 대기 (1-2분)

## 2. API 키 복사

프로젝트 대시보드 → **Settings** → **API**:

| 항목 | 환경변수 | 설명 |
|------|---------|------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` 형식 |
| anon (public) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 클라이언트에서 사용하는 공개 키 |
| service_role | `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 비밀 키 (절대 노출 금지!) |

## 3. DB 연결 문자열

**Settings** → **Database** → **Connection string** → **URI** 탭:

```
postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

이 값을 `.env.local`의 `DATABASE_URL`에 설정합니다.

> ⚠️ Transaction mode(포트 6543)와 Session mode(포트 5432)가 있습니다. Drizzle ORM은 **Session mode(5432)**를 권장합니다.

## 4. Auth Provider 활성화

**Authentication** → **Providers**에서 각 프로바이더를 활성화합니다.

### Google

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth client ID** → Web application
3. **Authorized redirect URIs**에 추가:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
4. Client ID와 Client Secret 복사
5. Supabase 대시보드 → **Providers** → **Google** → Enable 후 키 입력

### Kakao

1. [Kakao Developers](https://developers.kakao.com/) → 애플리케이션 추가
2. **카카오 로그인** 활성화
3. **Redirect URI** 설정:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
4. **동의항목** → 이메일, 프로필 정보 필수 설정
5. **앱 키** → REST API 키 = Client ID
6. **카카오 로그인** → **보안** → Client Secret 생성
7. Supabase 대시보드 → **Providers** → **Kakao** → Enable 후 키 입력

### Naver

1. [Naver Developers](https://developers.naver.com/) → 애플리케이션 등록
2. 사용 API: **네이버 로그인** 선택
3. **서비스 URL**: `https://your-domain.com`
4. **Callback URL**:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
5. Client ID, Client Secret 복사
6. Supabase 대시보드 → **Providers** → **Naver** → Enable 후 키 입력

> ⚠️ Naver는 Supabase 기본 제공 프로바이더가 아닐 수 있습니다. Custom OIDC Provider로 설정하거나, Supabase 버전을 확인하세요.

### GitHub

1. [GitHub Settings](https://github.com/settings/developers) → **New OAuth App**
2. **Authorization callback URL**:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
3. Client ID, Client Secret 복사
4. Supabase 대시보드 → **Providers** → **GitHub** → Enable 후 키 입력

## 5. DB Trigger 설정 (handle_new_user)

Supabase 대시보드 → **SQL Editor** → **New query**에서 아래 SQL 실행:

```sql
-- auth.users 생성 시 public.users에 자동 삽입
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

> 💡 이 트리거는 소셜 로그인/이메일 가입 시 `public.users` 테이블에 자동으로 사용자 정보를 동기화합니다.

## 6. RLS 정책 설정

Supabase 대시보드 → **Table Editor** → 각 테이블 → **RLS** 활성화 후 정책 추가:

### users 테이블

```sql
-- 본인 데이터만 조회
CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- 본인 데이터만 수정
CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);
```

### payments 테이블

```sql
-- 본인 결제만 조회
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);
```

### subscriptions 테이블

```sql
-- 본인 구독만 조회
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

> 💡 관리자(admin) 접근이 필요한 경우 `service_role` 키를 사용하거나, role 기반 정책을 추가하세요.
