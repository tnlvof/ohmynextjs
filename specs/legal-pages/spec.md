# Feature: 약관/개인정보처리방침 관리 시스템

## 개요
이용약관과 개인정보처리방침을 DB에 저장하고, 관리자 페이지에서 편집/버전관리할 수 있는 시스템.
초기 시드로 한국 표준 약관을 제공하며, `/terms`와 `/privacy` 페이지에서 최신 활성 버전을 표시.

## 목표
- 이용약관/개인정보처리방침을 DB에 저장하여 관리자가 동적으로 수정 가능
- 버전 관리: 수정 시 새 버전 생성, 이전 버전 열람 가능
- 활성 버전 지정: 어떤 버전을 공개할지 선택
- 기본 약관 시드: 한국 전자상거래 표준 약관 기반 초기 데이터 제공

## 비목표
- 약관 동의 이력 관리 (유저별 동의 기록)
- diff 뷰 (버전 간 비교)
- 마크다운 에디터 (textarea로 충분)

---

## 유저 스토리

### US-1: 약관 페이지 표시
**As a** 방문자  
**I want to** 이용약관과 개인정보처리방침을 볼 수 있다  
**So that** 서비스 이용 조건을 확인할 수 있다

**수락 기준:**
- [ ] `/terms` — DB에서 type='terms', isActive=true인 최신 버전 내용 표시
- [ ] `/privacy` — DB에서 type='privacy', isActive=true인 최신 버전 내용 표시
- [ ] 마크다운 형식으로 저장된 내용을 HTML로 렌더링
- [ ] 버전 번호와 시행일(effectiveDate) 표시
- [ ] DB에 데이터 없으면 하드코딩된 기본 약관 표시 (폴백)

### US-2: 약관 목록 조회 (관리자)
**As a** 관리자  
**I want to** 이용약관/개인정보처리방침의 모든 버전을 조회하고 싶다  
**So that** 변경 이력을 파악할 수 있다

**수락 기준:**
- [ ] `/admin/legal` 페이지에서 조회
- [ ] 탭으로 타입 전환: 이용약관 / 개인정보처리방침
- [ ] 테이블: 버전, 제목, 시행일, 활성여부, 작성일
- [ ] 활성 버전은 뱃지로 구분
- [ ] 최신순 정렬

### US-3: 약관 작성/수정 (관리자)
**As a** 관리자  
**I want to** 새 약관 버전을 작성하거나 기존 버전을 기반으로 수정하고 싶다  
**So that** 법적 요구사항 변경에 대응할 수 있다

**수락 기준:**
- [ ] 새 버전 작성: 제목, 내용(마크다운), 시행일 입력
- [ ] 기존 버전 복제: 선택한 버전의 내용을 복사하여 새 버전 초안 생성
- [ ] 버전 번호 자동 증가 (v1, v2, v3...)
- [ ] 저장 시 auditLogs에 기록

### US-4: 약관 활성화 (관리자)
**As a** 관리자  
**I want to** 특정 버전을 활성 약관으로 지정하고 싶다  
**So that** 방문자에게 최신 약관을 보여줄 수 있다

**수락 기준:**
- [ ] 활성화 버튼 클릭 시 확인 다이얼로그
- [ ] 활성화 시 같은 타입의 기존 활성 버전은 비활성화 (단일 활성)
- [ ] 변경 후 auditLogs에 기록
- [ ] `/terms`, `/privacy` 페이지에 즉시 반영

---

## 데이터 모델

### legalDocuments 테이블 (신규)
```sql
CREATE TABLE legal_documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL,          -- 'terms' | 'privacy'
  version     integer NOT NULL,        -- 1, 2, 3...
  title       text NOT NULL,           -- '이용약관 v3'
  content     text NOT NULL,           -- 마크다운 본문
  is_active   boolean NOT NULL DEFAULT false,
  effective_date timestamptz,          -- 시행일
  created_by  uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(type, version)                -- 같은 타입에서 버전 중복 방지
);

CREATE INDEX legal_documents_type_idx ON legal_documents(type);
CREATE INDEX legal_documents_active_idx ON legal_documents(type, is_active);
```

### TypeScript 타입
```typescript
type LegalDocType = 'terms' | 'privacy';

interface LegalDocument {
  id: string;
  type: LegalDocType;
  version: number;
  title: string;
  content: string;       // 마크다운
  isActive: boolean;
  effectiveDate: Date | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 기본 시드 데이터

### 이용약관 (v1) — 한국 전자상거래 표준 기반
```
제1조 (목적)
제2조 (정의)
제3조 (약관의 명시와 개정)
제4조 (서비스의 제공)
제5조 (회원가입)
제6조 (회원탈퇴 및 자격상실)
제7조 (개인정보보호)
제8조 (회사의 의무)
제9조 (회원의 의무)
제10조 (저작권의 귀속)
제11조 (분쟁해결)
제12조 (재판권 및 준거법)
```

### 개인정보처리방침 (v1) — 개인정보보호법 기반
```
1. 개인정보의 처리 목적
2. 처리하는 개인정보 항목
3. 개인정보의 처리 및 보유기간
4. 개인정보의 제3자 제공
5. 개인정보처리의 위탁
6. 개인정보의 파기
7. 정보주체의 권리·의무
8. 개인정보의 안전성 확보조치
9. 개인정보 보호책임자
10. 개인정보 처리방침 변경
```

---

## 라우트 구조

```
src/app/
  terms/page.tsx          # 기존 수정 — DB에서 활성 약관 조회
  privacy/page.tsx        # 기존 수정 — DB에서 활성 방침 조회
  admin/legal/
    page.tsx              # 약관 관리 목록
    new/page.tsx          # 새 버전 작성
    [id]/edit/page.tsx    # 버전 편집 (복제 기반)
```

## 서버 로직

```
src/lib/admin/legal-actions.ts
  - getActiveLegalDoc(type): Promise<LegalDocument | null>
  - getLegalDocs(type): Promise<LegalDocument[]>
  - getNextVersion(type): Promise<number>
  - createLegalDoc(data): Promise<ActionResult>
  - activateLegalDoc(id): Promise<ActionResult>   // 같은 타입 기존 활성 해제
```

## 컴포넌트
```
src/components/admin/
  legal-doc-table.tsx     # 약관 버전 목록 테이블
  legal-doc-form.tsx      # 약관 작성/편집 폼
  legal-type-tabs.tsx     # 이용약관/개인정보 탭 전환
  markdown-renderer.tsx   # 마크다운 → HTML 렌더링
```

---

## 테스트 계획
- `src/lib/admin/legal-actions.test.ts` — CRUD + 활성화 로직
- `src/components/admin/legal-doc-table.test.tsx` — 테이블 렌더링
- `/terms`, `/privacy` 폴백 동작 확인
