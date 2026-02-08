import type { SubagentPreset } from './types';

export const defaultPresets: SubagentPreset[] = [
  {
    name: 'feature-builder',
    description: '새 기능을 구현하는 에이전트',
    prompt: `목적: 새 기능을 구현하는 에이전트

동작:
1. AGENTS.md와 specs/ 디렉토리에서 관련 스펙 확인
2. 필요한 DB 스키마 변경
3. 서버 액션 구현
4. 컴포넌트 구현
5. 라우트 추가
6. 패키지 index.ts export 업데이트`,
  },
  {
    name: 'bug-fixer',
    description: '버그를 분석하고 수정하는 에이전트',
    prompt: `목적: 버그를 분석하고 수정하는 에이전트

동작:
1. AGENTS.md에서 프로젝트 구조/패턴 파악
2. 에러 로그 분석
3. 관련 코드 탐색
4. 원인 파악
5. 수정 코드 작성
6. 사이드 이펙트 체크`,
  },
  {
    name: 'code-reviewer',
    description: '코드 리뷰를 수행하는 에이전트',
    prompt: `목적: 코드 리뷰를 수행하는 에이전트

동작:
1. AGENTS.md에서 코드 컨벤션 확인
2. 변경 사항 분석
3. 컨벤션 준수 여부 체크
4. 보안 이슈 체크
5. 성능 이슈 체크
6. 개선 제안`,
  },
];
