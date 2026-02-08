import type { AgentsMdConfig } from '../types';
import { defaultRules } from '../rules';
import { defineConfig } from '../config';

export function generateAgentsMd(config: AgentsMdConfig): string {
  const isKo = config.language === 'ko';

  const header = isKo
    ? `# AGENTS.md — ${config.projectName}

> 이 파일은 AI 코딩 에이전트를 위한 프로젝트 가이드입니다.
> Cursor, Copilot, Windsurf, Claude Code 등 어떤 도구에서든 활용할 수 있습니다.`
    : `# AGENTS.md — ${config.projectName}

> This file is a project guide for AI coding agents.
> It can be used with any tool including Cursor, Copilot, Windsurf, Claude Code, etc.`;

  const overviewTitle = isKo ? '## 프로젝트 개요' : '## Project Overview';
  const stackTitle = isKo ? '## 기술 스택' : '## Tech Stack';

  const techStackList = config.techStack.map((t) => `- ${t}`).join('\n');

  const codeStyleSection = isKo
    ? `## 코드 스타일
- 세미콜론: ${config.codeStyle.semicolons ? '사용' : '미사용'}
- 따옴표: ${config.codeStyle.quotes === 'single' ? '작은따옴표' : '큰따옴표'}
- 들여쓰기: ${config.codeStyle.indentSize}칸`
    : `## Code Style
- Semicolons: ${config.codeStyle.semicolons ? 'yes' : 'no'}
- Quotes: ${config.codeStyle.quotes}
- Indent: ${config.codeStyle.indentSize} spaces`;

  const sections = [
    header,
    '',
    overviewTitle,
    config.description,
    '',
    stackTitle,
    techStackList,
    '',
    codeStyleSection,
    '',
    defaultRules,
  ];

  if (config.customInstructions) {
    const customTitle = isKo ? '## 추가 지침' : '## Additional Instructions';
    sections.push('', customTitle, config.customInstructions);
  }

  return sections.join('\n');
}

// CLI entry point
if (typeof process !== 'undefined' && process.argv[1]?.includes('agents-md')) {
  const config = defineConfig();
  const output = generateAgentsMd(config);
  console.log(output);
}
