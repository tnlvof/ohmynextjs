# 관리자 페이지 태스크 목록

## Phase 1: 기반 (순차)

- [ ] **T-1** 관리자 인증 헬퍼 (`src/lib/admin/auth.ts`)
  - `requireAdmin()` 구현
  - Supabase 세션 + DB role 체크
  - 테스트: 미인증/비관리자/관리자 케이스

- [ ] **T-2** 관리자 레이아웃 (`src/app/admin/layout.tsx`)
  - `requireAdmin()` 호출하여 접근 제어
  - 사이드바 포함 레이아웃
  - 모바일 반응형 (햄버거 메뉴)

- [ ] **T-3** 사이드바 컴포넌트 (`src/components/admin/admin-sidebar.tsx`)
  - 네비게이션 링크: 대시보드, 유저관리, 결제내역, 앱설정
  - 현재 경로 하이라이트
  - 모바일: 접기/펼치기

## Phase 2: 대시보드 [P - 병렬 가능]

- [ ] **T-4** 통계 카드 컴포넌트 (`src/components/admin/stat-card.tsx`)
  - 제목, 값, 아이콘, 변화율(선택) props
  - 테스트: 렌더링 확인

- [ ] **T-5** 대시보드 쿼리 (`src/lib/admin/queries.ts` — 통계 부분)
  - `getAdminStats()`, `getRecentUsers()`, `getRecentPayments()`
  - 테스트: mock DB로 반환값 검증

- [ ] **T-6** 대시보드 페이지 (`src/app/admin/page.tsx`)
  - 통계 카드 4개 + 최근 가입/결제 테이블
  - Server Component

## Phase 3: 유저 관리 [P - 병렬 가능]

- [ ] **T-7** 공통 컴포넌트
  - `pagination.tsx` — 페이지네이션 UI
  - `search-input.tsx` — 디바운스 검색
  - `confirm-dialog.tsx` — 확인 다이얼로그
  - 각각 테스트

- [ ] **T-8** 유저 쿼리 (`src/lib/admin/queries.ts` — 유저 부분)
  - `getUsers({ query, page, perPage })`
  - ILIKE 검색, 페이지네이션, 총 개수
  - 테스트

- [ ] **T-9** 유저 Server Actions (`src/lib/admin/actions.ts` — 유저 부분)
  - `updateUserRole()`, `updateUserStatus()`
  - 관리자 인증 체크 + 감사 로그 기록
  - 자기 자신 변경 방지
  - 테스트

- [ ] **T-10** 유저 테이블 컴포넌트 (`src/components/admin/user-table.tsx`)
  - 역할/상태 변경 드롭다운
  - 확인 다이얼로그 연동
  - 테스트

- [ ] **T-11** 유저 관리 페이지 (`src/app/admin/users/page.tsx`)
  - 검색 + 테이블 + 페이지네이션 조합

## Phase 4: 결제 내역 [P - 병렬 가능]

- [ ] **T-12** 결제 쿼리 (`src/lib/admin/queries.ts` — 결제 부분)
  - `getPayments({ status, page, perPage })`
  - 유저 JOIN, 상태 필터
  - 테스트

- [ ] **T-13** 결제 상태 뱃지 (`src/components/admin/payment-status-badge.tsx`)
  - 상태별 색상 (paid=green, failed=red, pending=yellow 등)
  - 테스트

- [ ] **T-14** 결제 테이블 + 페이지 (`src/components/admin/payment-table.tsx`, `src/app/admin/payments/page.tsx`)
  - 상태 필터 탭 + 테이블 + 페이지네이션

## Phase 5: 앱 설정

- [ ] **T-15** 설정 쿼리 + Actions (`src/lib/admin/queries.ts`, `actions.ts` — 설정 부분)
  - `getSettings()`, `createSetting()`, `updateSetting()`, `deleteSetting()`
  - 감사 로그 기록
  - 테스트

- [ ] **T-16** 설정 폼 + 목록 (`src/components/admin/settings-form.tsx`, `settings-list.tsx`)
  - JSON value 편집 (textarea)
  - 추가/수정 모달, 삭제 확인
  - 테스트

- [ ] **T-17** 설정 페이지 (`src/app/admin/settings/page.tsx`)
  - 목록 + 추가 버튼

## Phase 6: 통합

- [ ] **T-18** 전체 빌드 + 테스트 통과 확인
- [ ] **T-19** 헤더에 관리자 링크 추가 (admin 역할일 때만 표시)
- [ ] **T-20** 커밋 + 푸시

---

## 의존성 그래프
```
T-1 → T-2 → T-3
T-1 → T-5 → T-6
      T-4 → T-6 [P]
T-1 → T-8 → T-11
T-1 → T-9 → T-11
      T-7 → T-11 [P]
      T-10 → T-11 [P]
T-1 → T-12 → T-14
      T-13 → T-14 [P]
T-1 → T-15 → T-17
      T-16 → T-17 [P]
T-6, T-11, T-14, T-17 → T-18 → T-19 → T-20
```
