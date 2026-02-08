# AI-AGENT — AI 에이전트 모듈 상세 스펙

## 1. 목적과 범위

바이브코딩을 위한 AI 에이전트 룰셋과 프리셋을 제공한다. `.cursorrules`, `AGENTS.md` 생성, 서브에이전트 커맨드 프리셋을 포함한다.

## 2. 패키지 구조

```
packages/ai-agent/
├── src/
│   ├── index.ts
│   ├── presets.ts              # 프리셋 정의
│   ├── rules.ts                # 룰셋 정의
│   ├── generators/
│   │   ├── cursorrules.ts      # .cursorrules 생성기
│   │   ├── agents-md.ts        # AGENTS.md 생성기
│   │   └── subagent-commands.ts # 서브에이전트 커맨드 생성기
│   └── templates/
│       ├── cursorrules.hbs     # .cursorrules 템플릿
│       ├── agents-md.hbs       # AGENTS.md 템플릿
│       ├── feature-builder.hbs # 서브에이전트: 기능 구현
│       ├── bug-fixer.hbs       # 서브에이전트: 버그 수정
│       └── code-reviewer.hbs   # 서브에이전트: 코드 리뷰
├── package.json
└── tsconfig.json
```

## 3. 상세 요구사항

### 3.1 .cursorrules 생성기

프로젝트 설정에 맞는 `.cursorrules` 파일을 자동 생성한다.

```typescript
interface CursorRulesConfig {
  projectName: string;
  techStack: string[];           // ['next15', 'supabase', 'drizzle', 'tailwind', 'shadcn']
  language: 'ko' | 'en';        // 응답 언어
  codeStyle: {
    semicolons: boolean;         // 기본: true
    quotes: 'single' | 'double'; // 기본: 'single'
    indentSize: number;          // 기본: 2
  };
  customRules?: string[];        // 추가 규칙
}

function generateCursorRules(config: CursorRulesConfig): string
```

#### 기본 룰셋 내용

```
# Project: {projectName}

## Tech Stack
- Next.js 15 (App Router, Server Components, Server Actions)
- TypeScript (strict mode)
- Supabase (Auth + PostgreSQL)
- Drizzle ORM
- Tailwind CSS + shadcn/ui
- 토스페이먼츠

## Code Style
- 함수형 컴포넌트만 사용 (no class components)
- Server Components 기본, 'use client' 최소화
- Server Actions for mutations
- named export 선호
- 파일명: kebab-case
- 컴포넌트: PascalCase
- zod로 모든 입력 검증
- 에러는 try-catch로 처리, 사용자 친화적 메시지

## Project Structure
- packages/core: 공통 Provider, 레이아웃, UI
- packages/db: Drizzle 스키마
- packages/auth: Supabase 인증
- packages/admin: 관리자 대시보드
- packages/payment: 토스페이먼츠 결제
- apps/web: 메인 앱

## Rules
- 새 파일 생성 시 해당 패키지의 index.ts에 export 추가
- DB 변경 시 반드시 마이그레이션 생성
- API 응답은 { data } 또는 { error: { code, message } } 형식
- 한국어 사용자 대상, UI 텍스트는 한국어
```

### 3.2 AGENTS.md 생성기

```typescript
interface AgentsMdConfig {
  projectName: string;
  description: string;
  techStack: string[];
  packages: string[];
  customInstructions?: string;
}

function generateAgentsMd(config: AgentsMdConfig): string
```

#### 기본 AGENTS.md 내용

프로젝트 구조, 컨벤션, 주요 패턴을 포함하는 포괄적인 개발 가이드:
- 프로젝트 개요
- 디렉토리 구조 설명
- 코드 컨벤션
- 자주 사용하는 패턴 (Server Actions, DB 쿼리, 인증 체크)
- 테스트 가이드
- 커밋 컨벤션

### 3.3 서브에이전트 커맨드 프리셋

#### feature-builder
```
목적: 새 기능을 구현하는 에이전트
입력: 기능 설명, 관련 패키지
동작:
1. specs/ 디렉토리에서 관련 스펙 확인
2. 필요한 DB 스키마 변경
3. 서버 액션 구현
4. 컴포넌트 구현
5. 라우트 추가
6. 패키지 index.ts export 업데이트
```

#### bug-fixer
```
목적: 버그를 분석하고 수정하는 에이전트
입력: 에러 메시지, 재현 경로
동작:
1. 에러 로그 분석
2. 관련 코드 탐색
3. 원인 파악
4. 수정 코드 작성
5. 사이드 이펙트 체크
```

#### code-reviewer
```
목적: 코드 리뷰를 수행하는 에이전트
입력: 변경된 파일 목록 또는 PR
동작:
1. 변경 사항 분석
2. 코드 컨벤션 체크
3. 보안 이슈 체크
4. 성능 이슈 체크
5. 개선 제안
```

### 3.4 CLI 스크립트

```json
// package.json scripts
{
  "generate:cursorrules": "tsx src/generators/cursorrules.ts",
  "generate:agents-md": "tsx src/generators/agents-md.ts",
  "generate:all": "tsx src/generators/cursorrules.ts && tsx src/generators/agents-md.ts"
}
```

설정은 프로젝트 루트의 `ohmynextjs.config.ts`에서 읽거나 기본값 사용:

```typescript
// ohmynextjs.config.ts (선택적)
import { defineConfig } from '@ohmynextjs/ai-agent';

export default defineConfig({
  projectName: 'MyProject',
  language: 'ko',
  // ... 커스텀 설정
});
```

## 4. 의존성

```json
{
  "dependencies": {},
  "devDependencies": {
    "tsx": "^4"
  }
}
```

런타임 의존성 없음. 빌드 타임/CLI 도구만.

## 5. Export

```typescript
export { generateCursorRules } from './generators/cursorrules';
export { generateAgentsMd } from './generators/agents-md';
export { getSubagentPreset } from './generators/subagent-commands';
export { defaultRules } from './rules';
export { defaultPresets } from './presets';
export type { CursorRulesConfig, AgentsMdConfig } from './types';
```

## 6. 에러 처리

- 설정 파일 미존재 시: 기본값으로 생성 + 경고 메시지
- 출력 경로에 기존 파일 존재 시: 백업 후 덮어쓰기 (`.bak` 파일)

## 7. 구현 우선순위

1. 기본 룰셋/프리셋 정의
2. `.cursorrules` 생성기
3. `AGENTS.md` 생성기
4. 서브에이전트 프리셋
5. CLI 스크립트
