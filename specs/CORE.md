# CORE — core 패키지 상세 스펙

## 1. 목적과 범위

모든 패키지와 앱이 공유하는 **공통 인프라**를 제공한다:
- 통합 Provider (`OhMyProvider`)
- 기본 레이아웃 (Header, Footer, Sidebar)
- 다크모드
- shadcn/ui 설정
- 공통 유틸리티

## 2. 패키지 구조

```
packages/core/
├── src/
│   ├── index.ts                # Public API
│   ├── provider.tsx            # OhMyProvider
│   ├── config.ts               # 전역 설정 타입/기본값
│   ├── components/
│   │   ├── layout/
│   │   │   ├── root-layout.tsx     # HTML 기본 레이아웃
│   │   │   ├── header.tsx          # 상단 네비게이션
│   │   │   ├── footer.tsx          # 하단 푸터
│   │   │   ├── sidebar.tsx         # 사이드바 (대시보드용)
│   │   │   └── mobile-nav.tsx      # 모바일 네비게이션
│   │   ├── theme/
│   │   │   ├── theme-provider.tsx  # next-themes 래퍼
│   │   │   └── theme-toggle.tsx    # 다크/라이트 토글 버튼
│   │   └── ui/                     # shadcn/ui 컴포넌트 (재export)
│   ├── hooks/
│   │   ├── use-media-query.ts
│   │   └── use-mounted.ts
│   └── lib/
│       ├── cn.ts                   # clsx + twMerge 유틸
│       └── constants.ts            # 앱 전역 상수
├── package.json
└── tsconfig.json
```

## 3. 상세 요구사항

### 3.1 OhMyProvider

```typescript
// provider.tsx
interface OhMyProviderProps {
  children: React.ReactNode;
  config?: OhMyConfig;
}

interface OhMyConfig {
  app: {
    name: string;           // 기본: 'OhMyNextJS'
    description?: string;
    url?: string;
  };
  theme?: {
    defaultTheme?: 'light' | 'dark' | 'system';  // 기본: 'system'
    storageKey?: string;     // 기본: 'ohmynextjs-theme'
  };
  layout?: {
    header?: boolean;        // 기본: true
    footer?: boolean;        // 기본: true
    sidebar?: boolean;       // 기본: false
  };
}
```

**통합하는 Provider 목록** (순서대로 중첩):
1. `ThemeProvider` (next-themes)
2. `QueryClientProvider` (TanStack Query) — 선택적
3. `Toaster` (sonner)
4. `children`

### 3.2 Header

- 로고 (좌측, 클릭 시 `/` 이동)
- 네비게이션 링크 (설정 가능)
- 로그인/로그아웃 버튼 (auth 상태에 따라)
- 유저 아바타 드롭다운 (로그인 시)
- 다크모드 토글
- 모바일: 햄버거 메뉴 → Sheet로 네비게이션 표시

```typescript
interface HeaderProps {
  logo?: React.ReactNode;
  navItems?: NavItem[];
  showAuth?: boolean;       // 기본: true
  showThemeToggle?: boolean; // 기본: true
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}
```

### 3.3 Sidebar

- 대시보드/관리자 페이지용
- 접기/펼치기 지원
- 아이콘 + 라벨
- 활성 상태 하이라이트 (현재 경로 기준)
- 모바일: Sheet으로 표시

```typescript
interface SidebarProps {
  items: SidebarItem[];
  collapsible?: boolean;    // 기본: true
  defaultCollapsed?: boolean;
}

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  children?: SidebarItem[];  // 중첩 메뉴
}
```

### 3.4 Footer

- 저작권 텍스트
- 링크 섹션 (커스텀 가능)
- 소셜 아이콘

```typescript
interface FooterProps {
  copyright?: string;
  links?: FooterLink[];
  socials?: SocialLink[];
}
```

### 3.5 다크모드

- `next-themes` 사용
- `system`, `light`, `dark` 3가지 모드
- localStorage 저장
- SSR 호환 (hydration mismatch 방지)
- `ThemeToggle` 컴포넌트: 아이콘 버튼 (Sun/Moon)

### 3.6 shadcn/ui 설정

- `components.json` 포함
- 기본 컴포넌트 사전 설치:
  - Button, Input, Label, Card
  - Dialog, Sheet, Dropdown Menu
  - Table, Badge, Avatar
  - Toast (sonner), Tabs
  - Form (react-hook-form + zod)
- 컬러 테마: Tailwind CSS 변수 기반 (`--primary`, `--secondary` 등)

### 3.7 cn 유틸

```typescript
// lib/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 4. 의존성

```json
{
  "dependencies": {
    "next-themes": "^0.4",
    "sonner": "^1.7",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "lucide-react": "^0.460"
  },
  "peerDependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19"
  }
}
```

## 5. Export (Public API)

```typescript
// index.ts
export { OhMyProvider } from './provider';
export type { OhMyConfig } from './provider';
export { Header, Footer, Sidebar, MobileNav } from './components/layout';
export { ThemeProvider, ThemeToggle } from './components/theme';
export { cn } from './lib/cn';
export * from './hooks';
```

## 6. 에러 처리

- Provider 미사용 시 명확한 에러 메시지 (Context 없음 에러)
- 테마 hydration 에러 방지: `suppressHydrationWarning` + `mounted` 체크

## 7. 구현 우선순위

1. `cn` 유틸 + shadcn/ui 설정
2. `ThemeProvider` + `ThemeToggle`
3. `OhMyProvider`
4. `Header` → `Footer` → `Sidebar`
5. 반응형 + 모바일 네비게이션
