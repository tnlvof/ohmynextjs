export const agentPresets = {
  'feature-builder': {
    name: 'Feature Builder',
    description: '새 기능을 빠르게 추가하는 에이전트',
    prompt: 'You are a feature builder for an ohmynextjs project. Create new features following the modular package structure.',
  },
  'bug-fixer': {
    name: 'Bug Fixer',
    description: '버그를 찾아서 수정하는 에이전트',
    prompt: 'You are a bug fixer. Analyze the error, find the root cause, and fix it with minimal changes.',
  },
  'code-reviewer': {
    name: 'Code Reviewer',
    description: '코드 리뷰 에이전트',
    prompt: 'Review the code for best practices, security issues, and performance. Be concise.',
  },
};
