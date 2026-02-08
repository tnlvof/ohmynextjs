export const defaultRules = `## 코드 컨벤션
- 함수형 컴포넌트만 사용 (no class components)
- Server Components 기본, 'use client' 최소화
- Server Actions for mutations
- named export 선호
- 파일명: kebab-case
- 컴포넌트: PascalCase
- zod로 모든 입력 검증
- 에러는 try-catch로 처리, 사용자 친화적 메시지

## 규칙
- 새 파일 생성 시 해당 패키지의 index.ts에 export 추가
- DB 변경 시 반드시 마이그레이션 생성
- API 응답은 \`{ data }\` 또는 \`{ error: { code, message } }\` 형식
- 한국어 사용자 대상, UI 텍스트는 한국어
- 스펙 문서(specs/)를 먼저 확인하고 구현

## 커밋 컨벤션
- feat: 새 기능
- fix: 버그 수정
- refactor: 리팩토링
- docs: 문서
- chore: 설정/빌드`;
