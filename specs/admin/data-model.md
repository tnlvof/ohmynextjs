# 관리자 페이지 데이터 모델

## 기존 스키마 활용 (변경 없음)

관리자 페이지는 기존 DB 스키마를 그대로 사용하며, 추가 테이블/컬럼이 필요하지 않다.

### users 테이블
| 컬럼 | 타입 | 관리자 페이지 사용 |
|------|------|-------------------|
| id | uuid (PK) | 식별자 |
| email | text (unique) | 목록 표시, 검색 |
| name | text | 목록 표시, 검색 |
| role | user_role ('user' \| 'admin') | **변경 가능** |
| status | user_status ('active' \| 'banned' \| 'deleted') | **변경 가능** |
| avatarUrl | text | 목록 표시 (선택) |
| provider | text | 가입 경로 표시 |
| createdAt | timestamptz | 정렬, 통계 |
| lastSignInAt | timestamptz | 최근 활동 표시 |

### payments 테이블
| 컬럼 | 타입 | 관리자 페이지 사용 |
|------|------|-------------------|
| id | uuid (PK) | 식별자 |
| userId | uuid (FK→users) | 유저 정보 JOIN |
| orderId | text (unique) | 목록 표시 |
| amount | integer | 목록 표시, 매출 집계 |
| currency | text | 금액 표시 |
| status | payment_status | 필터, 목록 표시 |
| method | payment_method | 목록 표시 |
| paidAt | timestamptz | 정렬, 통계 |
| createdAt | timestamptz | 정렬 |

### appSettings 테이블
| 컬럼 | 타입 | 관리자 페이지 사용 |
|------|------|-------------------|
| id | uuid (PK) | 식별자 |
| key | text (unique) | **CRUD** |
| value | jsonb | **CRUD** |
| description | text | **CRUD** |
| isPublic | boolean | **CRUD** |
| createdAt | timestamptz | 정렬 |
| updatedAt | timestamptz | 표시 |

### auditLogs 테이블
| 컬럼 | 타입 | 관리자 페이지 사용 |
|------|------|-------------------|
| id | uuid (PK) | - |
| userId | uuid (FK→users) | 관리자 식별 |
| action | text | 액션 종류 |
| target | text | 대상 테이블명 |
| targetId | text | 대상 레코드 ID |
| details | jsonb | 변경 내역 |
| createdAt | timestamptz | 기록 시각 |

---

## 쿼리 패턴

### 대시보드 통계
```sql
-- 총 유저 수
SELECT count(*) FROM users WHERE status != 'deleted';

-- 오늘 가입 수
SELECT count(*) FROM users 
WHERE created_at >= CURRENT_DATE AND status != 'deleted';

-- 총 매출
SELECT COALESCE(sum(amount), 0) FROM payments WHERE status = 'paid';

-- 이번 달 매출
SELECT COALESCE(sum(amount), 0) FROM payments 
WHERE status = 'paid' 
AND paid_at >= date_trunc('month', CURRENT_DATE);
```

### 유저 검색
```sql
SELECT * FROM users 
WHERE (name ILIKE '%query%' OR email ILIKE '%query%')
AND status != 'deleted'
ORDER BY created_at DESC
LIMIT 20 OFFSET (page - 1) * 20;
```

### 결제 내역 (유저 JOIN)
```sql
SELECT p.*, u.email as user_email, u.name as user_name
FROM payments p
LEFT JOIN users u ON p.user_id = u.id
WHERE ($1::payment_status IS NULL OR p.status = $1)
ORDER BY p.created_at DESC
LIMIT 20 OFFSET (page - 1) * 20;
```

---

## TypeScript 타입

```typescript
// 대시보드
interface AdminStats {
  totalUsers: number;
  todaySignups: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

// 유저 목록 응답
interface UsersResponse {
  users: Array<{
    id: string;
    email: string;
    name: string | null;
    role: 'user' | 'admin';
    status: 'active' | 'banned' | 'deleted';
    provider: string | null;
    createdAt: Date;
    lastSignInAt: Date | null;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

// 결제 목록 응답
interface PaymentsResponse {
  payments: Array<{
    id: string;
    orderId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded' | 'partial_refunded';
    method: 'card' | 'virtual_account' | 'transfer' | 'mobile' | null;
    paidAt: Date | null;
    createdAt: Date;
    user: {
      email: string;
      name: string | null;
    } | null;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

// 설정
interface AppSetting {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Server Action 결과
type ActionResult = 
  | { success: true }
  | { success: false; error: string };
```
