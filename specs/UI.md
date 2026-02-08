# UI — 페이지/컴포넌트 목록, 라우트 구조

## 1. 목적과 범위

`apps/web`의 전체 라우트 구조, 페이지 목록, 컴포넌트 트리를 정의한다.

## 2. 라우트 구조

```
apps/web/app/
├── layout.tsx                    # 루트 레이아웃 (OhMyProvider)
├── page.tsx                      # 랜딩 페이지 /
├── not-found.tsx                 # 404 페이지
├── error.tsx                     # 전역 에러 페이지
│
├── (public)/                     # 공개 페이지 그룹
│   ├── layout.tsx                # Header + Footer 레이아웃
│   ├── pricing/
│   │   └── page.tsx              # 요금제 페이지 /pricing
│   └── terms/
│       └── page.tsx              # 이용약관 /terms
│
├── (auth)/                       # 인증 페이지 그룹
│   ├── layout.tsx                # 센터 정렬 레이아웃 (로그인 시 리다이렉트)
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # 로그인 /auth/login
│   │   ├── signup/
│   │   │   └── page.tsx          # 회원가입 /auth/signup
│   │   ├── verify-email/
│   │   │   └── page.tsx          # 이메일 인증 안내 /auth/verify-email
│   │   └── reset-password/
│   │       └── page.tsx          # 비밀번호 재설정 /auth/reset-password
│
├── (dashboard)/                  # 인증 필수 페이지 그룹
│   ├── layout.tsx                # Header + Sidebar 레이아웃 (미인증 시 리다이렉트)
│   ├── dashboard/
│   │   └── page.tsx              # 대시보드 /dashboard
│   ├── settings/
│   │   └── page.tsx              # 개인 설정 /settings
│   └── billing/
│       └── page.tsx              # 빌링/구독 관리 /billing
│
├── (admin)/                      # 관리자 전용 그룹
│   ├── layout.tsx                # AdminLayout (admin role 필수)
│   ├── admin/
│   │   ├── page.tsx              # 관리자 대시보드 /admin
│   │   ├── users/
│   │   │   └── page.tsx          # 유저 관리 /admin/users
│   │   ├── payments/
│   │   │   └── page.tsx          # 결제 관리 /admin/payments
│   │   └── settings/
│   │       └── page.tsx          # 앱 설정 관리 /admin/settings
│
├── payment/                      # 결제 플로우 페이지
│   ├── success/
│   │   └── page.tsx              # 결제 성공 /payment/success
│   ├── fail/
│   │   └── page.tsx              # 결제 실패 /payment/fail
│   └── complete/
│       └── page.tsx              # 결제 완료 /payment/complete
│
└── api/                          # API Route Handlers
    ├── auth/
    │   ├── callback/route.ts
    │   └── confirm/route.ts
    ├── payment/
    │   ├── confirm/route.ts
    │   └── webhook/route.ts
    ├── cron/
    │   └── billing/route.ts
    └── admin/
        └── export/
            ├── users/route.ts
            └── payments/route.ts
```

## 3. 페이지별 상세

### 3.1 랜딩 페이지 `/`
- 히어로 섹션 (타이틀, 서브타이틀, CTA 버튼)
- 기능 소개 섹션 (카드 그리드)
- 요금제 미리보기
- CTA 섹션
- **Server Component** (정적)

### 3.2 로그인 `/auth/login`
- `AuthForm` (mode: 'login')
- 소셜 로그인 버튼
- 회원가입 링크, 비밀번호 찾기 링크
- **Client Component** (폼 상태 관리)

### 3.3 회원가입 `/auth/signup`
- `AuthForm` (mode: 'signup')
- 이름, 이메일, 비밀번호 입력
- 소셜 로그인 버튼
- 로그인 링크

### 3.4 대시보드 `/dashboard`
- 환영 메시지
- 간단한 통계/활동 요약
- 빠른 액션 카드

### 3.5 개인 설정 `/settings`
- 프로필 수정 (이름, 아바타)
- 이메일 표시 (읽기 전용)
- 비밀번호 변경
- 계정 삭제

### 3.6 빌링 `/billing`
- `SubscriptionStatus` (현재 구독)
- `PricingTable` (플랜 변경)
- `PaymentHistory` (결제 내역)

### 3.7 관리자 대시보드 `/admin`
- `StatsCards` (4개)
- `RevenueChart`
- `UserGrowthChart`
- `RecentActivity`

### 3.8 유저 관리 `/admin/users`
- `UserFilters`
- `UserTable`
- `UserDetailDialog` (행 클릭 시)

### 3.9 결제 관리 `/admin/payments`
- 필터 (상태, 기간)
- `PaymentTable`
- `RefundDialog`

### 3.10 앱 설정 `/admin/settings`
- `SettingsList`
- `SettingsForm` (추가/수정 다이얼로그)

### 3.11 결제 성공 `/payment/success`
- 결제 승인 API 호출 (자동)
- 로딩 → 결과 표시
- 완료 시 `/payment/complete`로 리다이렉트

### 3.12 결제 완료 `/payment/complete`
- 결제 완료 확인 메시지
- 주문 요약
- 대시보드 이동 버튼

### 3.13 결제 실패 `/payment/fail`
- 에러 코드/메시지 표시
- 다시 시도 버튼

## 4. 레이아웃 구조

### 4.1 루트 레이아웃
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <OhMyProvider config={...}>
          {children}
        </OhMyProvider>
      </body>
    </html>
  );
}
```

### 4.2 Public 레이아웃
```
┌──────────────────────────┐
│         Header           │
├──────────────────────────┤
│                          │
│         Content          │
│                          │
├──────────────────────────┤
│         Footer           │
└──────────────────────────┘
```

### 4.3 Dashboard 레이아웃
```
┌──────────────────────────┐
│         Header           │
├────────┬─────────────────┤
│        │                 │
│ Side   │    Content      │
│ bar    │                 │
│        │                 │
└────────┴─────────────────┘
```

### 4.4 Auth 레이아웃
```
┌──────────────────────────┐
│                          │
│     ┌──────────────┐     │
│     │   Auth Form  │     │
│     └──────────────┘     │
│                          │
└──────────────────────────┘
```

### 4.5 Admin 레이아웃
```
┌──────────────────────────┐
│   Admin Header           │
├────────┬─────────────────┤
│ Admin  │  Breadcrumb     │
│ Side   │─────────────────│
│ bar    │  Content        │
│        │                 │
└────────┴─────────────────┘
```

## 5. 반응형 브레이크포인트

| 이름 | 너비 | 설명 |
|------|------|------|
| `sm` | 640px | 모바일 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 데스크탑 |
| `xl` | 1280px | 와이드 |

- **모바일**: 사이드바 숨김 → 햄버거 메뉴 (Sheet)
- **태블릿**: 사이드바 접힌 상태 (아이콘만)
- **데스크탑**: 사이드바 펼침

## 6. 공유 컴포넌트 (apps/web/components)

```
components/
├── landing/
│   ├── hero.tsx
│   ├── features.tsx
│   └── cta.tsx
├── dashboard/
│   └── welcome-card.tsx
└── common/
    ├── loading.tsx           # 로딩 스피너/스켈레톤
    ├── empty-state.tsx       # 데이터 없음 상태
    └── confirm-dialog.tsx    # 확인 다이얼로그
```

## 7. 구현 우선순위

1. 루트 레이아웃 + OhMyProvider 연결
2. Auth 페이지 (login, signup)
3. Public 레이아웃 + 랜딩
4. Dashboard 레이아웃 + 대시보드
5. Admin 레이아웃 + 관리자 페이지
6. 결제 페이지
7. 설정, 빌링 페이지
