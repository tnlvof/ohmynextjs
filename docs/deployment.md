# 배포 가이드

## Vercel 원클릭 배포

### 1. Deploy 버튼 클릭

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tnlvof/ohmynextjs&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,DATABASE_URL,NEXT_PUBLIC_TOSS_CLIENT_KEY,TOSS_SECRET_KEY,NEXT_PUBLIC_APP_URL&project-name=my-ohmynextjs&repository-name=my-ohmynextjs)

### 2. 환경변수 입력

배포 시 아래 환경변수를 입력합니다:

| 환경변수 | 필수 | 설명 |
|---------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase 공개 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase 서비스 역할 키 |
| `DATABASE_URL` | ✅ | PostgreSQL 연결 문자열 |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | ✅ | 토스 클라이언트 키 |
| `TOSS_SECRET_KEY` | ✅ | 토스 시크릿 키 |
| `NEXT_PUBLIC_APP_URL` | ✅ | 배포된 앱 URL (예: `https://my-app.vercel.app`) |
| `CRON_SECRET` | ❌ | Cron job 인증용 |
| `NEXT_PUBLIC_GA_ID` | ❌ | Google Analytics ID |

> ⚠️ **운영 환경에서는 토스 키를 `live_` 접두사 키로 교체하세요.**

### 3. 커스텀 도메인

1. Vercel 대시보드 → **Settings** → **Domains**
2. **Add Domain** → 도메인 입력 (예: `myapp.com`)
3. DNS 설정:
   - **A 레코드**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. SSL 자동 발급 대기 (1-5분)
5. `NEXT_PUBLIC_APP_URL`을 커스텀 도메인으로 업데이트
6. Supabase → **Authentication** → **URL Configuration** → Site URL을 커스텀 도메인으로 변경
7. 소셜 로그인 Redirect URI도 커스텀 도메인으로 업데이트

## 수동 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

## 배포 후 체크리스트

- [ ] 환경변수가 모두 올바르게 설정되었는지 확인
- [ ] `NEXT_PUBLIC_APP_URL`이 실제 배포 URL과 일치하는지 확인
- [ ] Supabase Auth → Site URL이 배포 URL과 일치하는지 확인
- [ ] 소셜 로그인 Redirect URI가 Supabase 콜백 URL과 일치하는지 확인
- [ ] DB 마이그레이션 실행 완료 (`bun run db:migrate`)
- [ ] 시드 데이터 삽입 완료 (`bun run db:seed`)
- [ ] handle_new_user 트리거 설정 완료
- [ ] RLS 정책 설정 완료
- [ ] 토스 웹훅 URL이 배포 URL로 설정되었는지 확인
- [ ] 토스 키가 운영용(`live_`)으로 교체되었는지 확인
- [ ] 회원가입 → 로그인 → 결제 플로우 테스트
- [ ] 관리자 계정 접근 확인
