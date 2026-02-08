import { describe, it, expect } from 'vitest';
import { defineConfig } from '../src/config';

describe('defineConfig', () => {
  it('기본값을 반환한다', () => {
    const config = defineConfig();
    expect(config.projectName).toBe('OhMyNextJS');
    expect(config.language).toBe('ko');
    expect(config.codeStyle.semicolons).toBe(true);
    expect(config.codeStyle.quotes).toBe('single');
    expect(config.codeStyle.indentSize).toBe(2);
  });

  it('커스텀 값과 기본값을 병합한다', () => {
    const config = defineConfig({
      projectName: 'Custom',
      codeStyle: { semicolons: false, quotes: 'double', indentSize: 4 },
    });
    expect(config.projectName).toBe('Custom');
    expect(config.language).toBe('ko'); // 기본값 유지
    expect(config.codeStyle.semicolons).toBe(false);
  });
});
