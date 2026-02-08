import { describe, it, expect } from 'vitest';
import { generateAgentsMd } from '../../src/generators/agents-md';
import { defineConfig } from '../../src/config';

describe('generateAgentsMd', () => {
  it('기본 config로 AGENTS.md를 생성한다', () => {
    const config = defineConfig();
    const result = generateAgentsMd(config);
    expect(result).toContain('# AGENTS.md');
    expect(result).toContain('OhMyNextJS');
  });

  it('커스텀 projectName, description을 반영한다', () => {
    const config = defineConfig({
      projectName: 'MyApp',
      description: '나만의 앱',
    });
    const result = generateAgentsMd(config);
    expect(result).toContain('MyApp');
    expect(result).toContain('나만의 앱');
  });

  it('techStack 목록을 반영한다', () => {
    const config = defineConfig({
      techStack: ['react', 'node', 'prisma'],
    });
    const result = generateAgentsMd(config);
    expect(result).toContain('- react');
    expect(result).toContain('- node');
    expect(result).toContain('- prisma');
  });

  it('codeStyle 설정을 반영한다', () => {
    const config = defineConfig({
      codeStyle: {
        semicolons: false,
        quotes: 'double',
        indentSize: 4,
      },
    });
    const result = generateAgentsMd(config);
    expect(result).toContain('미사용');
    expect(result).toContain('큰따옴표');
    expect(result).toContain('4칸');
  });

  it('customInstructions를 추가한다', () => {
    const config = defineConfig({
      customInstructions: '항상 테스트를 먼저 작성하세요.',
    });
    const result = generateAgentsMd(config);
    expect(result).toContain('추가 지침');
    expect(result).toContain('항상 테스트를 먼저 작성하세요.');
  });

  it('한국어 언어 설정', () => {
    const config = defineConfig({ language: 'ko' });
    const result = generateAgentsMd(config);
    expect(result).toContain('프로젝트 개요');
    expect(result).toContain('기술 스택');
  });

  it('영어 언어 설정', () => {
    const config = defineConfig({ language: 'en' });
    const result = generateAgentsMd(config);
    expect(result).toContain('Project Overview');
    expect(result).toContain('Tech Stack');
  });
});
