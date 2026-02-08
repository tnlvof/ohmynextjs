import { describe, it, expect } from 'vitest';
import { defaultRules } from '../src/rules';

describe('defaultRules', () => {
  it('존재한다', () => {
    expect(defaultRules).toBeTruthy();
    expect(typeof defaultRules).toBe('string');
  });

  it('필수 섹션을 포함한다', () => {
    expect(defaultRules).toContain('코드 컨벤션');
    expect(defaultRules).toContain('규칙');
    expect(defaultRules).toContain('커밋 컨벤션');
  });
});
