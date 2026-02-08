# VIBE-CODING-PRINCIPLES — 바이브코딩 개발 원칙

## 개요

이 문서는 AI 바이브코딩으로 상용 서비스를 만들 때 반드시 따라야 할 10가지 원칙을 정의한다.
**핵심: "AI는 도구이고, 아키텍처 판단은 사람이 한다."**

---

## 1. YAGNI (You Aren't Gonna Need It)

**바이브코딩에서 가장 중요한 원칙.**

- AI에게 "확장 가능하게 만들어줘"라고 하면 불필요한 추상화가 쏟아진다
- **지금 필요한 것만** 요청하고, 나중에 필요하면 그때 추가
- AI는 리팩토링을 빠르게 해주니까 미리 대비할 필요 없음

### 적용 규칙
- [ ] 요청 전에 "이게 지금 필요한가?" 자문
- [ ] "혹시 나중에 쓸까봐" 만드는 코드 금지
- [ ] 추상화는 3번 이상 반복될 때만

---

## 2. Unix 철학

**"한 가지 일을 잘하는 작은 프로그램을 만들어라"**

- 파일, 함수, 모듈을 작게 유지해야 AI가 컨텍스트를 정확히 파악
- 큰 기능을 한번에 요청하지 말고 작은 단위로 나눠서 요청
- 파이프라인처럼 조합하는 구조가 AI와 궁합이 좋음

### 적용 규칙
- [ ] 함수는 한 가지 일만 (20줄 이하 권장)
- [ ] 파일은 200줄 이하 권장
- [ ] 모듈은 독립적으로 동작 가능해야 함
- [ ] ohmynextjs 패키지 구조 자체가 이 원칙의 구현

---

## 3. 계약에 의한 설계 (Design by Contract)

**사전 조건 / 사후 조건 / 불변 조건을 명확히.**

- "이 함수는 양수만 받고, 반드시 배열을 반환해야 해" → AI가 엣지 케이스까지 처리
- TypeScript 타입 + Zod 스키마 = **코드로 표현된 계약**

### 적용 규칙
- [ ] 모든 API 입력은 Zod 스키마로 검증
- [ ] 함수 시그니처에 반환 타입 명시 (추론에 의존하지 않기)
- [ ] Server Action은 반드시 `{ data } | { error }` 형식 반환
- [ ] DB 스키마의 NOT NULL, DEFAULT, CHECK 제약조건 적극 활용

```typescript
// ✅ 좋은 예: 계약이 명확
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'admin']).default('user'),
});

export async function createUser(input: z.infer<typeof CreateUserSchema>): Promise<ApiResponse<User>> {
  const parsed = CreateUserSchema.safeParse(input);
  if (!parsed.success) return { error: { code: 'VALIDATION', message: parsed.error.message } };
  // ...
}

// ❌ 나쁜 예: 계약이 모호
export async function createUser(data: any) {
  // 뭘 받는지, 뭘 반환하는지 불명확
}
```

---

## 4. 관심사의 분리 (Separation of Concerns)

**AI 컨텍스트 윈도우 한계 때문에 실질적으로 중요.**

- UI / 비즈니스 로직 / 데이터 접근을 분리해두면 한 영역만 수정 가능
- 파일 하나에 모든 로직이 섞여 있으면 AI도 혼란

### 적용 규칙 (ohmynextjs 기준)
- [ ] **UI 레이어**: `components/` — 순수 렌더링만
- [ ] **비즈니스 로직**: Server Actions — 데이터 처리
- [ ] **데이터 접근**: `@ohmynextjs/db` — DB 쿼리만
- [ ] **인증**: `@ohmynextjs/auth` — 인증 로직만
- [ ] **결제**: `@ohmynextjs/payment` — 결제 로직만
- [ ] 컴포넌트에서 직접 DB 쿼리 금지

```
[사용자] → [페이지/컴포넌트] → [Server Action] → [DB/외부 API]
              UI 레이어          비즈니스 레이어     데이터 레이어
```

---

## 5. 점진적 개선 (Iterative Refinement)

**바이브코딩의 핵심 워크플로우.**

```
1차: 동작하는 코드
2차: 엣지 케이스 처리
3차: 최적화 & 리팩토링
```

- 한번에 완벽한 결과를 기대하지 않기
- 각 단계에서 **검증 후** 다음 단계로

### 적용 규칙
- [ ] MVP 먼저, 폴리싱은 나중에
- [ ] AI에게 한번에 100줄 요청 ❌ → 20줄씩 5번 ✅
- [ ] 각 단계마다 빌드/린트/테스트 실행
- [ ] 코드 리뷰 후 다음 단계 진행

---

## 6. 방어적 프로그래밍 (Defensive Programming)

**AI가 생성한 코드를 신뢰하되 검증하는 자세.**

- 입력 검증, 에러 핸들링을 **명시적으로** 요청해야 함
- 안 말하면 AI는 해피 패스만 구현하는 경향이 있음

### 적용 규칙
- [ ] "실패할 수 있는 경우도 처리해줘"를 항상 요청
- [ ] try-catch로 모든 외부 호출 감싸기
- [ ] null/undefined 체크 명시
- [ ] 환경변수 누락 시 명확한 에러 메시지

```typescript
// ✅ 방어적
export async function getUser(id: string): Promise<ApiResponse<User>> {
  if (!id) return { error: { code: 'INVALID_INPUT', message: 'User ID is required' } };
  
  try {
    const user = await db.select().from(users).where(eq(users.id, id));
    if (!user.length) return { error: { code: 'NOT_FOUND', message: 'User not found' } };
    return { data: user[0] };
  } catch (e) {
    console.error('getUser failed:', e);
    return { error: { code: 'INTERNAL', message: 'Failed to fetch user' } };
  }
}

// ❌ 해피 패스만
export async function getUser(id: string) {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user[0]; // id 없으면? DB 에러나면? user 없으면?
}
```

---

## 7. 테스트 주도 개발 (TDD) — 바이브코딩 변형

**전통 TDD와 다르게 적용:**

| | 전통 TDD | 바이브 TDD |
|---|---|---|
| 순서 | 테스트 → 코드 → 리팩토링 | 요구사항 → AI 코드 생성 → 테스트 검증 |
| 목적 | 설계 도구 | **안전망** |

### 적용 규칙
- [ ] "이 함수에 대한 테스트도 같이 만들어줘"가 습관
- [ ] 테스트가 있으면 리팩토링을 과감하게 할 수 있음
- [ ] AI 생성 코드의 품질 검증 도구로 활용
- [ ] 상세 테스트 전략은 `specs/TESTING.md` 참조

---

## 8. 컨벤션 오버 컨피규레이션 (Convention over Configuration)

**프로젝트에 일관된 패턴을 정해두면 AI가 자동으로 따른다.**

- AGENTS.md 같은 프로젝트 규칙 파일이 곧 "컨벤션"
- 한번 패턴을 잡아두면 이후 생성 품질이 **급격히** 올라감

### ohmynextjs 컨벤션
- [ ] 파일명: kebab-case
- [ ] 컴포넌트: PascalCase
- [ ] API 응답: `{ data } | { error: { code, message } }`
- [ ] Server Components 기본, `'use client'` 최소화
- [ ] named export 선호
- [ ] 패키지 public API는 `src/index.ts`에서만 export

---

## 9. 최소 놀람의 원칙 (Principle of Least Surprise)

**프레임워크의 관용적(idiomatic) 패턴을 따른다.**

- AI에게 "일반적인 방법으로 해줘"라고 하면 대체로 좋은 결과
- 특이한 패턴을 요청하면 AI도 혼란스러워하고 버그 확률 증가

### 적용 규칙
- [ ] Next.js App Router의 공식 패턴 준수
- [ ] Supabase 공식 가이드 방식으로 인증 구현
- [ ] Drizzle 공식 문서의 쿼리 패턴 사용
- [ ] shadcn/ui 컴포넌트를 커스텀하기보다 조합해서 사용
- [ ] "영리한" 코드보다 "명확한" 코드

---

## 10. 피드백 루프 (Feedback Loop)

**바이브코딩에서 가장 실전적인 프레임워크.**

```
요청 → 생성 → 실행/확인 → 피드백 → 수정
  ↑                                    │
  └────────────────────────────────────┘
```

- 루프를 **짧고 빈번하게** 돌리는 것이 핵심
- 100줄 한번에 vs 20줄 5번 → **후자가 품질이 높음**
- 빌드/린트/테스트를 자주 돌려서 빠르게 잡기

### 적용 규칙
- [ ] 변경 후 즉시 `npm run build` 확인
- [ ] 기능 하나 완성 후 즉시 `npm run test` 실행
- [ ] 린트 에러 0 유지
- [ ] 커밋 단위를 작게 (기능 하나 = 커밋 하나)

---

## 실전 요약

| 상황 | 적용 원칙 |
|---|---|
| AI에게 뭘 요청할지 고민 | **YAGNI** — 지금 필요한 것만 |
| 큰 기능을 만들 때 | **Unix 철학** — 작게 나눠서 |
| 요청을 어떻게 할지 | **Design by Contract** — 조건을 명확히 |
| 코드 구조를 잡을 때 | **관심사의 분리** |
| 결과물이 맘에 안 들 때 | **점진적 개선** — 한번에 완벽은 없음 |
| AI 결과를 받은 후 | **방어적 프로그래밍 + 테스트** |
| 프로젝트 패턴 잡을 때 | **Convention over Configuration** |
| 구현 방식 선택할 때 | **최소 놀람의 원칙** — idiomatic하게 |
| 개발 속도 올릴 때 | **피드백 루프** — 짧고 빈번하게 |

---

## 구현 우선순위

이 원칙들은 스펙이 아니라 **개발 과정 전체에 적용되는 철학**이다.

1. 모든 스펙 파일 구현 시 이 원칙을 따른다
2. `@ohmynextjs/ai-agent`가 생성하는 AGENTS.md에 이 원칙을 포함한다
3. README에 "바이브코딩 원칙" 섹션으로 소개한다
4. 이 원칙 자체가 ohmynextjs의 **차별점**이다
