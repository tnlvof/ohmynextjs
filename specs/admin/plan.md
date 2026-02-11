# 관리자 페이지 구현 계획

## 기술 선택

| 항목 | 선택 | 근거 |
|------|------|------|
| 렌더링 | Server Components (기본) + Client Components (인터랙션) | 보안 + SEO, 인터랙션 필요한 부분만 'use client' |
| 데이터 조회 | Drizzle ORM 직접 쿼리 | 이미 프로젝트에 구성됨, type-safe |
| 변경 처리 | Next.js Server Actions | 폼 제출 + 서버 사이드 검증 |
| 상태 관리 | URL search params + React state | 서버 렌더링 친화적, 공유 가능한 URL |
| 아이콘 | lucide-react | 이미 설치됨 |
| 토스트 | 자체 구현 (간단한 alert 컴포넌트) | 외부 의존성 최소화 |

## 아키텍처

### 레이어 구조
```
[Pages - Server Components]
    ↓ 데이터 조회
[Server Actions - src/lib/admin/actions.ts]
    ↓ DB 쿼리
[Drizzle ORM - src/lib/db/client.ts]
    ↓
[Supabase PostgreSQL]
```

### 인증 레이어
```
[Admin Layout - Server Component]
    ↓ getServerUser()
    ↓ getUserRole(userId)
    ├─ 미인증/비관리자 → redirect()
    └─ 관리자 → children 렌더링
```

---

## 파일 구조

### 라우트
```
src/app/admin/
  layout.tsx              # 관리자 레이아웃 (인증+인가 체크, 사이드바)
  page.tsx                # /admin — 대시보드
  users/
    page.tsx              # /admin/users — 유저 관리
  payments/
    page.tsx              # /admin/payments — 결제 내역
  settings/
    page.tsx              # /admin/settings — 앱 설정
```

### 컴포넌트
```
src/components/admin/
  admin-sidebar.tsx       # 사이드바 네비게이션 (client)
  stat-card.tsx           # 통계 카드 (server)
  user-table.tsx          # 유저 테이블 (client - 인터랙션)
  user-role-select.tsx    # 역할 변경 드롭다운 (client)
  user-status-select.tsx  # 상태 변경 드롭다운 (client)
  payment-table.tsx       # 결제 테이블 (client - 필터)
  payment-status-badge.tsx # 결제 상태 뱃지 (server)
  settings-form.tsx       # 설정 편집 폼 (client)
  settings-list.tsx       # 설정 목록 (client - CRUD)
  pagination.tsx          # 페이지네이션 (client)
  search-input.tsx        # 검색 입력 (client)
  confirm-dialog.tsx      # 확인 다이얼로그 (client)
  toast.tsx               # 토스트 알림 (client)
```

### 서버 로직
```
src/lib/admin/
  actions.ts              # Server Actions (모든 데이터 조회/변경)
  queries.ts              # DB 쿼리 함수 (actions에서 호출)
  auth.ts                 # 관리자 인증 헬퍼
```

---

## Server Actions 상세

### queries.ts — DB 쿼리

```typescript
// 대시보드
getAdminStats(): Promise<{
  totalUsers: number;
  todaySignups: number;
  totalRevenue: number;
  monthlyRevenue: number;
}>

getRecentUsers(limit: number): Promise<User[]>
getRecentPayments(limit: number): Promise<PaymentWithUser[]>

// 유저
getUsers(params: {
  query?: string;
  page?: number;
  perPage?: number;
}): Promise<{ users: User[]; total: number; totalPages: number }>

// 결제
getPayments(params: {
  status?: PaymentStatus;
  page?: number;
  perPage?: number;
}): Promise<{ payments: PaymentWithUser[]; total: number; totalPages: number }>

// 설정
getSettings(): Promise<AppSetting[]>
```

### actions.ts — Server Actions

```typescript
// 유저 변경
updateUserRole(userId: string, role: 'user' | 'admin'): Promise<ActionResult>
updateUserStatus(userId: string, status: 'active' | 'banned'): Promise<ActionResult>

// 설정 CRUD
createSetting(data: CreateSettingInput): Promise<ActionResult>
updateSetting(id: string, data: UpdateSettingInput): Promise<ActionResult>
deleteSetting(id: string): Promise<ActionResult>

// 공통 타입
type ActionResult = { success: true } | { success: false; error: string }
```

### auth.ts — 인증 헬퍼

```typescript
// 현재 유저가 관리자인지 확인, 아니면 redirect
requireAdmin(): Promise<{ userId: string; email: string }>
```

---

## 감사 로그 기록

모든 변경 액션에서 자동 기록:

```typescript
// 유저 역할 변경 시
{
  userId: adminUserId,      // 변경을 수행한 관리자
  action: 'user.role.update',
  target: 'users',
  targetId: targetUserId,
  details: { from: 'user', to: 'admin' }
}

// 유저 상태 변경 시
{
  userId: adminUserId,
  action: 'user.status.update',
  target: 'users',
  targetId: targetUserId,
  details: { from: 'active', to: 'banned' }
}

// 설정 추가/수정/삭제 시
{
  userId: adminUserId,
  action: 'setting.create' | 'setting.update' | 'setting.delete',
  target: 'app_settings',
  targetId: settingId,
  details: { key, value, ... }
}
```

---

## UI 와이어프레임

### 대시보드 (/admin)
```
┌──────────────────────────────────────────────┐
│ [Sidebar]  │  대시보드                        │
│            │                                  │
│  대시보드   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  유저관리   │  │총유저 │ │오늘  │ │총매출│ │이달  │ │
│  결제내역   │  │ 1,234│ │가입12│ │₩5.2M│ │₩820K│ │
│  앱설정    │  └──────┘ └──────┘ └──────┘ └──────┘ │
│            │                                  │
│            │  최근 가입                        │
│            │  ┌─────────────────────────────┐ │
│            │  │ 이름 │ 이메일 │ 가입일       │ │
│            │  │ ...  │ ...    │ ...         │ │
│            │  └─────────────────────────────┘ │
│            │                                  │
│            │  최근 결제                        │
│            │  ┌─────────────────────────────┐ │
│            │  │ 주문ID│유저│금액│상태│결제일  │ │
│            │  │ ...   │... │... │... │...    │ │
│            │  └─────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### 유저 관리 (/admin/users)
```
┌──────────────────────────────────────────────┐
│ [Sidebar]  │  유저 관리                       │
│            │                                  │
│            │  [🔍 검색...]                    │
│            │                                  │
│            │  ┌──────────────────────────────┐│
│            │  │이름│이메일│역할▼│상태▼│가입일 ││
│            │  │홍길동│hong@..│[user▼]│[active▼]│...││
│            │  │...  │...    │...    │...     │...││
│            │  └──────────────────────────────┘│
│            │                                  │
│            │  ◀ 1 2 3 ... 10 ▶  총 200명     │
└──────────────────────────────────────────────┘
```

### 모바일 레이아웃
```
┌────────────────────┐
│ ☰ OhMyNextJS Admin │
├────────────────────┤
│ 대시보드            │
│                    │
│ ┌────┐ ┌────┐     │
│ │총유저│ │오늘 │     │
│ │1,234│ │가입12│    │
│ └────┘ └────┘     │
│ ┌────┐ ┌────┐     │
│ │총매출│ │이달 │     │
│ │₩5.2M│ │₩820K│    │
│ └────┘ └────┘     │
│                    │
│ ┌────────────────┐ │
│ │ 홍길동           │ │
│ │ hong@email.com  │ │
│ │ user · active   │ │
│ │ 2026-02-10     │ │
│ └────────────────┘ │
└────────────────────┘
```
