# React Best Practices — Vercel Engineering

> 이 문서는 [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices)의 AGENTS.md 원본을 기반으로 합니다.
> 모든 React/Next.js 코드는 이 원칙을 따라야 합니다.

---

## OhMyNextJS 적용 가이드

### 우선순위별 적용 전략

| 우선순위 | 카테고리 | 적용 대상 |
|----------|----------|-----------|
| **CRITICAL** | Eliminating Waterfalls | 모든 Server Component, API Route, Server Action |
| **CRITICAL** | Bundle Size Optimization | 모든 Client Component, 라이브러리 import |
| **HIGH** | Server-Side Performance | RSC 경계, 캐싱, Server Action 인증 |
| **MEDIUM-HIGH** | Client-Side Data Fetching | SWR 활용, 이벤트 리스너 관리 |
| **MEDIUM** | Re-render Optimization | 상태 관리, 메모이제이션 |
| **MEDIUM** | Rendering Performance | Hydration, SVG, 조건부 렌더링 |
| **LOW-MEDIUM** | JavaScript Performance | 루프 최적화, 자료구조 선택 |
| **LOW** | Advanced Patterns | 초기화 패턴, Ref 관리 |

### 프로젝트 필수 설정

```js
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-*']
  }
}
```

### 핵심 룰 요약

1. **Waterfall 제거**: `Promise.all()` 사용, 독립 작업 병렬화, Suspense 경계 전략적 배치
2. **번들 최적화**: barrel import 회피, `next/dynamic`으로 heavy 컴포넌트 lazy-load, 비핵심 라이브러리 지연 로드
3. **서버 성능**: Server Action에 반드시 인증 체크, RSC 경계에서 최소 데이터만 전달, `React.cache()` 활용
4. **클라이언트 데이터**: SWR로 자동 중복 제거, passive 이벤트 리스너, localStorage 버전 관리
5. **리렌더 최적화**: 파생 상태 계산, functional setState, lazy 초기화, useTransition 활용
6. **렌더링 성능**: CSS content-visibility, hydration mismatch 방지, 명시적 조건부 렌더링
7. **JS 성능**: Set/Map으로 O(1) 룩업, early return, RegExp 호이스팅, 배열 순회 합치기
8. **고급 패턴**: 앱 초기화 1회만, 이벤트 핸들러 Ref 저장

---

## 원본 AGENTS.md

**Version 1.0.0**
Vercel Engineering
January 2026

> **Note:**
> This document is mainly for agents and LLMs to follow when maintaining,
> generating, or refactoring React and Next.js codebases.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
   - 1.1 Defer Await Until Needed
   - 1.2 Dependency-Based Parallelization
   - 1.3 Prevent Waterfall Chains in API Routes
   - 1.4 Promise.all() for Independent Operations
   - 1.5 Strategic Suspense Boundaries
2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
   - 2.1 Avoid Barrel File Imports
   - 2.2 Conditional Module Loading
   - 2.3 Defer Non-Critical Third-Party Libraries
   - 2.4 Dynamic Imports for Heavy Components
   - 2.5 Preload Based on User Intent
3. [Server-Side Performance](#3-server-side-performance) — **HIGH**
   - 3.1 Authenticate Server Actions Like API Routes
   - 3.2 Avoid Duplicate Serialization in RSC Props
   - 3.3 Cross-Request LRU Caching
   - 3.4 Minimize Serialization at RSC Boundaries
   - 3.5 Parallel Data Fetching with Component Composition
   - 3.6 Per-Request Deduplication with React.cache()
   - 3.7 Use after() for Non-Blocking Operations
4. [Client-Side Data Fetching](#4-client-side-data-fetching) — **MEDIUM-HIGH**
   - 4.1 Deduplicate Global Event Listeners
   - 4.2 Use Passive Event Listeners for Scrolling Performance
   - 4.3 Use SWR for Automatic Deduplication
   - 4.4 Version and Minimize localStorage Data
5. [Re-render Optimization](#5-re-render-optimization) — **MEDIUM**
   - 5.1 Calculate Derived State During Rendering
   - 5.2 Defer State Reads to Usage Point
   - 5.3 Do not wrap simple expressions in useMemo
   - 5.4 Extract Default Non-primitive Parameter Values to Constants
   - 5.5 Extract to Memoized Components
   - 5.6 Narrow Effect Dependencies
   - 5.7 Put Interaction Logic in Event Handlers
   - 5.8 Subscribe to Derived State
   - 5.9 Use Functional setState Updates
   - 5.10 Use Lazy State Initialization
   - 5.11 Use Transitions for Non-Urgent Updates
   - 5.12 Use useRef for Transient Values
6. [Rendering Performance](#6-rendering-performance) — **MEDIUM**
   - 6.1 Animate SVG Wrapper Instead of SVG Element
   - 6.2 CSS content-visibility for Long Lists
   - 6.3 Hoist Static JSX Elements
   - 6.4 Optimize SVG Precision
   - 6.5 Prevent Hydration Mismatch Without Flickering
   - 6.6 Suppress Expected Hydration Mismatches
   - 6.7 Use Activity Component for Show/Hide
   - 6.8 Use Explicit Conditional Rendering
   - 6.9 Use useTransition Over Manual Loading States
7. [JavaScript Performance](#7-javascript-performance) — **LOW-MEDIUM**
   - 7.1 Avoid Layout Thrashing
   - 7.2 Build Index Maps for Repeated Lookups
   - 7.3-7.12 (Cache, Combine, Early Return, Set/Map, toSorted 등)
8. [Advanced Patterns](#8-advanced-patterns) — **LOW**
   - 8.1 Initialize App Once, Not Per Mount
   - 8.2 Store Event Handlers in Refs
   - 8.3 useEffectEvent for Stable Callback Refs

---

> 전체 원문은 https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md 에서 확인하세요.
> 각 룰의 Incorrect/Correct 코드 예시와 상세 설명이 포함되어 있습니다.
