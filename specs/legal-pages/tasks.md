# 약관 관리 시스템 태스크

## Phase 1: DB 스키마

- [ ] **T-1** `legalDocuments` 테이블 추가 (`src/lib/db/schema.ts`)
  - type, version, title, content, isActive, effectiveDate, createdBy
  - UNIQUE(type, version) 제약
  - 인덱스: type, (type + isActive)
  - 테스트: 스키마 정의 검증

## Phase 2: 시드 데이터

- [ ] **T-2** 기본 약관 시드 파일 (`src/lib/db/seed-legal.ts`)
  - 이용약관 v1: 한국 전자상거래 표준 12조 전문
  - 개인정보처리방침 v1: 개인정보보호법 기반 10항 전문
  - 실제 법적으로 유효한 수준의 내용 (플레이스홀더 아님)
  - isActive=true, effectiveDate=now

## Phase 3: Server Actions [P]

- [ ] **T-3** 약관 쿼리/액션 (`src/lib/admin/legal-actions.ts`)
  - getActiveLegalDoc(type) — 공개 페이지용
  - getLegalDocs(type) — 관리자 목록
  - getNextVersion(type) — 다음 버전 번호
  - createLegalDoc(data) — 새 버전 생성 + 감사로그
  - activateLegalDoc(id) — 활성화 (기존 비활성) + 감사로그
  - 테스트: mock DB로 전체 케이스

## Phase 4: 마크다운 렌더러

- [ ] **T-4** 마크다운 렌더링 (`src/components/admin/markdown-renderer.tsx`)
  - 간단한 마크다운 → HTML (제목, 단락, 리스트, 볼드 등)
  - 외부 라이브러리 최소화 (react-markdown 또는 자체 구현)
  - 테스트

## Phase 5: 공개 페이지 수정

- [ ] **T-5** `/terms` 페이지 수정
  - DB에서 활성 약관 조회 → 렌더링
  - 폴백: DB 없으면 하드코딩 기본 약관
  - 버전 번호 + 시행일 표시
  - 테스트

- [ ] **T-6** `/privacy` 페이지 수정
  - T-5와 동일 패턴
  - 테스트

## Phase 6: 관리자 페이지

- [ ] **T-7** 약관 관리 목록 (`src/app/admin/legal/page.tsx`)
  - 탭: 이용약관 / 개인정보처리방침
  - 테이블: 버전, 제목, 시행일, 활성여부, 작성일
  - 활성화 버튼 + 확인 다이얼로그
  - 새 버전 작성 버튼

- [ ] **T-8** 약관 작성 폼 (`src/app/admin/legal/new/page.tsx`)
  - 타입 선택, 제목, 내용(textarea), 시행일
  - 기존 버전 복제 옵션 (query param `?from=<id>`)
  - 미리보기 (마크다운 렌더링)
  - 저장 → 목록으로 리다이렉트

- [ ] **T-9** 사이드바에 '약관 관리' 링크 추가

## Phase 7: 통합

- [ ] **T-10** 전체 빌드 + 테스트 통과 확인
- [ ] **T-11** 커밋 + 푸시

---

## 의존성 그래프
```
T-1 → T-2
T-1 → T-3 → T-5, T-6
           → T-7, T-8
T-4 → T-5, T-6, T-8
T-7, T-8 → T-9
T-5, T-6, T-9 → T-10 → T-11
```
