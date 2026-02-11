# 관리자 페이지 스펙

## 개요
관리자(role='admin') 전용 페이지. 유저 관리, 결제 내역, 앱 설정, 감사 로그 확인.

## 접근 제어
- `users.role === 'admin'`인 유저만 접근 가능
- 미인증 또는 비관리자 → `/dashboard`로 리다이렉트
- 서버 컴포넌트에서 세션 체크 (`src/lib/auth/server.ts`)

## 라우트 구조

```
src/app/admin/
  layout.tsx          # 관리자 레이아웃 (사이드바 + 접근 제어)
  page.tsx            # /admin — 대시보드
  users/
    page.tsx          # /admin/users — 유저 목록
  payments/
    page.tsx          # /admin/payments — 결제 내역
  settings/
    page.tsx          # /admin/settings — 앱 설정
```

## 페이지별 상세

### /admin (대시보드)
- 통계 카드 4개:
  - 총 유저 수
  - 오늘 가입 수
  - 총 매출 (결제 status='paid' 합계)
  - 이번 달 매출
- 최근 가입 유저 5명 리스트
- 최근 결제 5건 리스트

### /admin/users (유저 관리)
- 테이블: 이름, 이메일, 역할, 상태, 가입일
- 검색: 이메일/이름 검색 (query param `?q=`)
- 액션: 역할 변경 (user↔admin), 상태 변경 (active↔banned)
- Server Action으로 처리 (`src/lib/admin/actions.ts`)
- 페이지네이션: 20명씩

### /admin/payments (결제 내역)
- 테이블: 주문ID, 유저, 금액, 상태, 결제수단, 결제일
- 필터: 상태별 (전체/pending/paid/failed/cancelled/refunded)
- 정렬: 최신순
- 페이지네이션: 20건씩

### /admin/settings (앱 설정)
- `appSettings` 테이블 CRUD
- key-value 편집 UI
- 설정 추가/수정/삭제
- `isPublic` 토글

## 컴포넌트

```
src/components/admin/
  sidebar.tsx         # 관리자 사이드바 네비게이션
  stat-card.tsx       # 통계 카드 컴포넌트
  data-table.tsx      # 범용 데이터 테이블 (정렬, 페이지네이션)
  search-input.tsx    # 검색 입력 컴포넌트
```

## Server Actions

```
src/lib/admin/actions.ts
  - getAdminStats()           → 대시보드 통계
  - getUsers(query, page)     → 유저 목록
  - updateUserRole(id, role)  → 역할 변경
  - updateUserStatus(id, status) → 상태 변경
  - getPayments(status, page) → 결제 목록
  - getSettings()             → 설정 목록
  - upsertSetting(key, value, desc, isPublic) → 설정 추가/수정
  - deleteSetting(id)         → 설정 삭제
```

## DB 의존성
기존 스키마 그대로 사용 (변경 없음):
- `users` — role, status 필드 활용
- `payments` — status, amount 집계
- `appSettings` — key-value CRUD
- `auditLogs` — 관리자 액션 기록

## 감사 로그
관리자 액션(역할 변경, 상태 변경, 설정 변경)은 `auditLogs` 테이블에 자동 기록:
```ts
{ action: 'user.role.update', target: 'users', targetId: userId, details: { from, to } }
```

## UI 가이드
- 사이드바: 왼쪽 고정, 모바일에서 접기
- 반응형: 테이블 → 모바일에서 카드 뷰
- 다크모드 지원
- shadcn/ui 스타일 일관성 유지

## 테스트 계획
- `src/lib/admin/actions.test.ts` — Server Actions 단위 테스트 (mock DB)
- `src/components/admin/*.test.tsx` — 컴포넌트 렌더링 테스트
- `src/app/admin/**/*.test.tsx` — 페이지 접근 제어 테스트
