# ADMIN — 관리자 모듈 상세 스펙

## 1. 목적과 범위

`role: 'admin'` 유저 전용 관리자 대시보드를 제공한다. 유저 관리, 통계, 앱 설정을 포함한다.

## 2. 패키지 구조

```
packages/admin/
├── src/
│   ├── index.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── admin-layout.tsx      # 관리자 전용 레이아웃
│   │   │   └── admin-sidebar.tsx     # 관리자 사이드바
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx       # 통계 카드 (유저, 매출 등)
│   │   │   ├── revenue-chart.tsx     # 매출 차트
│   │   │   ├── user-growth-chart.tsx # 유저 증가 차트
│   │   │   └── recent-activity.tsx   # 최근 활동 목록
│   │   ├── users/
│   │   │   ├── user-table.tsx        # 유저 목록 테이블
│   │   │   ├── user-filters.tsx      # 검색/필터
│   │   │   ├── user-detail-dialog.tsx # 유저 상세 다이얼로그
│   │   │   └── user-actions.tsx      # 역할 변경, 밴 등
│   │   ├── payments/
│   │   │   ├── payment-table.tsx     # 결제 내역 테이블
│   │   │   └── refund-dialog.tsx     # 환불 다이얼로그
│   │   └── settings/
│   │       ├── settings-form.tsx     # 설정 폼
│   │       └── settings-list.tsx     # 설정 목록
│   ├── hooks/
│   │   ├── use-admin-stats.ts
│   │   ├── use-admin-users.ts
│   │   └── use-admin-settings.ts
│   └── lib/
│       └── admin-actions.ts          # 서버 액션
├── package.json
└── tsconfig.json
```

## 3. 상세 요구사항

### 3.1 AdminLayout

```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
}

// - 좌측 사이드바 + 우측 콘텐츠 영역
// - 상단: 브레드크럼 + 유저 메뉴
// - 사이드바 메뉴:
//   - 대시보드 (/admin)
//   - 유저 관리 (/admin/users)
//   - 결제 관리 (/admin/payments)
//   - 설정 (/admin/settings)
```

### 3.2 대시보드 (/admin)

#### StatsCards — 4개 카드
| 카드 | 데이터 | 계산 |
|------|--------|------|
| 전체 유저 수 | `count(users)` | 전일 대비 증감 |
| 활성 유저 | `count(users WHERE last_sign_in_at > now() - 30d)` | 30일 기준 |
| 이번 달 매출 | `sum(payments.amount WHERE status='paid' AND 이번달)` | 전월 대비 |
| 구독자 수 | `count(subscriptions WHERE status='active')` | 전일 대비 |

#### RevenueChart
- 월별 매출 막대 차트 (최근 12개월)
- recharts 또는 chart.js 사용
- 금액 포맷: ₩1,234,567

#### UserGrowthChart
- 일별 신규 가입자 라인 차트 (최근 30일)

#### RecentActivity
- 최근 감사 로그 10건
- 형식: `[시간] [유저] [액션]`

### 3.3 유저 관리 (/admin/users)

#### UserTable
```typescript
// 컬럼: 아바타, 이름, 이메일, 역할, 상태, 가입일, 마지막 로그인, 액션
// 페이지네이션: 서버 사이드, 20건/페이지
// 정렬: 가입일, 이름, 이메일 (클릭 토글)
```

#### UserFilters
```typescript
interface UserFilters {
  search?: string;          // 이름/이메일 검색
  role?: 'all' | 'admin' | 'user';
  status?: 'all' | 'active' | 'banned';
  dateRange?: { from: Date; to: Date };
}
```

#### UserActions (서버 액션)
```typescript
// 역할 변경
async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<void>
// - admin만 호출 가능
// - 자기 자신의 역할은 변경 불가
// - audit_logs에 기록

// 유저 밴/활성화
async function updateUserStatus(userId: string, status: 'active' | 'banned'): Promise<void>
// - banned 시 세션 무효화 (supabaseAdmin.auth.admin.signOut(userId))
// - audit_logs에 기록

// 유저 삭제 (소프트 삭제)
async function deleteUser(userId: string): Promise<void>
// - status를 'deleted'로 변경
// - auth.users에서도 비활성화
```

### 3.4 결제 관리 (/admin/payments)

#### PaymentTable
```typescript
// 컬럼: 주문번호, 유저, 금액, 상태, 결제방법, 날짜, 액션
// 필터: 상태별, 기간별
// 액션: 상세 보기, 환불
```

#### RefundDialog
```typescript
interface RefundInput {
  paymentId: string;
  amount?: number;          // 부분 환불 (미입력 시 전액)
  reason: string;           // 필수
}
// 토스페이먼츠 API 호출 → payments 상태 업데이트 → audit_logs 기록
```

### 3.5 설정 관리 (/admin/settings)

#### SettingsList + SettingsForm
```typescript
// CRUD: app_settings 테이블
// 기본 설정 항목:
// - site_name (string): 사이트 이름
// - site_description (string): 사이트 설명
// - maintenance_mode (boolean): 점검 모드
// - maintenance_message (string): 점검 메시지
// - allowed_signup (boolean): 회원가입 허용 여부
// - default_user_role (string): 기본 역할

// 설정 값은 JSON이므로 타입에 따라 다른 입력 UI:
// - string → Input
// - boolean → Switch
// - number → NumberInput
// - json → Textarea (JSON)
```

## 4. API 엔드포인트 (서버 액션)

모든 액션은 admin role 검증을 수행한다.

```typescript
// 권한 체크 헬퍼
async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('AUTH_FORBIDDEN');
  }
  return user;
}
```

| 액션 | 설명 |
|------|------|
| `getAdminStats()` | 대시보드 통계 |
| `getRevenueChart(months)` | 월별 매출 데이터 |
| `getUserGrowthChart(days)` | 일별 가입자 데이터 |
| `getRecentActivity(limit)` | 최근 감사 로그 |
| `getUsers(filters, page, pageSize)` | 유저 목록 |
| `updateUserRole(userId, role)` | 역할 변경 |
| `updateUserStatus(userId, status)` | 밴/활성화 |
| `deleteUser(userId)` | 유저 삭제 |
| `getPayments(filters, page, pageSize)` | 결제 목록 |
| `refundPayment(paymentId, amount?, reason)` | 환불 |
| `getSettings()` | 설정 목록 |
| `updateSetting(key, value)` | 설정 수정 |
| `createSetting(key, value, description, isPublic)` | 설정 생성 |
| `deleteSetting(key)` | 설정 삭제 |

## 5. 에러 처리

| 에러 코드 | 상황 | 메시지 |
|-----------|------|--------|
| `AUTH_FORBIDDEN` | admin이 아닌 유저 접근 | 접근 권한이 없습니다 |
| `ADMIN_SELF_ROLE_CHANGE` | 자기 역할 변경 시도 | 자신의 역할은 변경할 수 없습니다 |
| `ADMIN_USER_NOT_FOUND` | 존재하지 않는 유저 | 유저를 찾을 수 없습니다 |
| `ADMIN_REFUND_FAILED` | 환불 API 실패 | 환불 처리에 실패했습니다 |

## 6. 의존성

```json
{
  "dependencies": {
    "recharts": "^2.13"
  },
  "peerDependencies": {
    "next": "^15",
    "react": "^19",
    "@ohmynextjs/core": "workspace:*",
    "@ohmynextjs/db": "workspace:*",
    "@ohmynextjs/auth": "workspace:*"
  }
}
```

## 7. Export

```typescript
export { AdminLayout, AdminSidebar } from './components/layout';
export { StatsCards, RevenueChart, UserGrowthChart, RecentActivity } from './components/dashboard';
export { UserTable, UserFilters, UserDetailDialog, UserActions } from './components/users';
export { PaymentTable, RefundDialog } from './components/payments';
export { SettingsList, SettingsForm } from './components/settings';
export * from './hooks';
```

## 8. 구현 우선순위

1. AdminLayout + 사이드바
2. 유저 관리 (CRUD)
3. 대시보드 통계 카드
4. 결제 관리
5. 설정 관리
6. 차트
