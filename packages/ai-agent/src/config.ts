import type { AgentsMdConfig } from './types';

const defaultConfig: AgentsMdConfig = {
  projectName: 'OhMyNextJS',
  description: 'Next.js 기반 풀스택 프로젝트',
  techStack: ['next15', 'supabase', 'drizzle', 'tailwind', 'shadcn'],
  packages: [],
  language: 'ko',
  codeStyle: {
    semicolons: true,
    quotes: 'single',
    indentSize: 2,
  },
};

export function defineConfig(config: Partial<AgentsMdConfig> = {}): AgentsMdConfig {
  return {
    ...defaultConfig,
    ...config,
    codeStyle: {
      ...defaultConfig.codeStyle,
      ...config.codeStyle,
    },
  };
}
