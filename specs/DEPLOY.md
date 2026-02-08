# DEPLOY — 배포 스펙

## 1. 목적과 범위

Vercel 원클릭 배포를 지원하고, 모든 환경 변수 설정 가이드를 제공한다.

## 2. Vercel 설정

### 2.1 vercel.json

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "apps/web/.next",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["icn1"]
}
```

### 2.2 루트 package.json 스크립트

```json
{
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "start": "pnpm --filter web start",
    "lint": "pnpm --filter web lint",
    "db:generate": "pnpm --filter @ohmynextjs/db db:generate",
    "db:migrate": "pnpm --filter @ohmynextjs/db db:migrate",
    "db:push": "pnpm --filter @ohmynextjs/db db:push",
    "db:seed": "pnpm --filter @ohmynextjs/db db:seed"
  }
}
```

### 2.3 Deploy 버튼

README.md에 Vercel 원클릭 배포 버튼 추가:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tnlvof/ohmynextjs&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,DATABASE_URL,NEXT_PUBLIC_TOSS_CLIENT_KEY,TOSS_SECRET_KEY,NEXT_PUBLIC_APP_URL&project-name=my-ohmynextjs&repository-name=my-ohmynextjs)
```

## 3. 환경 변수 전체 목록

### 3.1 필수 환경 변수

| 변수 | 설명 | 예시 | 서버/클라이언트 |
|------|------|------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxx.supabase.co` | 클라이언트 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJ...` | 클라이언트 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJ...` | 서버 |
| `DATABASE_URL` | PostgreSQL 연결 문자열 | `postgresql://...` | 서버 |
| `NEXT_PUBLIC_APP_URL` | 앱 URL | `https://myapp.vercel.app` | 클라이언트 |

### 3.2 결제 환경 변수

| 변수 | 설명 | 예시 |
|------|------|------|
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | 토스 클라이언트 키 | `test_ck_xxx` |
| `TOSS_SECRET_KEY` | 토스 시크릿 키 | `test_sk_xxx` |

### 3.3 선택 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `CRON_SECRET` | Vercel Cron 인증 토큰 | - |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |

## 4. Supabase 설정 체크리스트

### 4.1 프로젝트 생성
1. [supabase.com](https://supabase.com)에서 프로젝트 생성
2. Project Settings → API에서 URL, anon key, service role key 복사
3. Database → Connection string 복사 (DATABASE_URL)

### 4.2 인증 Provider 활성화
1. Authentication → Providers
2. 활성화할 프로바이더 설정:
   - **Email**: 기본 활성화
   - **Google**: Google Cloud Console에서 OAuth 앱 생성 → Client ID/Secret 입력
   - **GitHub**: GitHub Settings → Developer settings → OAuth Apps → Client ID/Secret 입력
   - **Kakao**: Kakao Developers → 앱 생성 → REST API 키/Client Secret 입력
   - **Naver**: Naver Developers → 앱 등록 → Client ID/Secret 입력
3. Redirect URL: `{SUPABASE_URL}/auth/v1/callback`

### 4.3 DB 마이그레이션
```bash
# 로컬에서
pnpm db:push    # 개발: 스키마 직접 푸시
pnpm db:migrate # 운영: 마이그레이션 실행
pnpm db:seed    # 시드 데이터
```

### 4.4 DB Trigger 설정
SQL Editor에서 `handle_new_user` 트리거 실행 (AUTH.md 참조)

## 5. 토스페이먼츠 설정

1. [developers.tosspayments.com](https://developers.tosspayments.com)에서 가맹점 등록
2. 개발 → API 키에서 테스트 키 복사
3. 운영 전환 시 라이브 키로 교체
4. 웹훅 URL 등록 (선택): `{APP_URL}/api/payment/webhook`

## 6. Vercel Cron (정기결제용)

```json
// vercel.json에 추가
{
  "crons": [
    {
      "path": "/api/cron/billing",
      "schedule": "0 0 * * *"
    }
  ]
}
```

```typescript
// apps/web/app/api/cron/billing/route.ts
export async function GET(request: Request) {
  // CRON_SECRET 검증
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  // 정기결제 처리 로직
}
```

## 7. 배포 후 체크리스트

- [ ] 환경 변수 모두 설정됨
- [ ] Supabase Auth Provider 활성화됨
- [ ] DB 마이그레이션 완료
- [ ] DB Trigger 설정됨
- [ ] 시드 데이터 투입됨
- [ ] 토스페이먼츠 키 설정됨
- [ ] 도메인 설정 (선택)
- [ ] NEXT_PUBLIC_APP_URL이 실제 배포 URL과 일치
- [ ] Supabase Redirect URL에 배포 URL 추가
- [ ] 소셜 로그인 각 Provider에 배포 URL redirect 등록

## 8. .env.example

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# TossPayments
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_xxx
TOSS_SECRET_KEY=test_sk_xxx

# Cron (optional)
CRON_SECRET=your-cron-secret
```

## 9. 구현 우선순위

1. `.env.example` 생성
2. `vercel.json` 설정
3. 루트 스크립트 설정
4. README Deploy 버튼
5. 환경 변수 가이드 문서
