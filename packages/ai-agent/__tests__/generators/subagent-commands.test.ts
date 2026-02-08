import { describe, it, expect } from 'vitest';
import { getSubagentPreset } from '../../src/generators/subagent-commands';

describe('getSubagentPreset', () => {
  it('feature-builder 프리셋을 반환한다', () => {
    const preset = getSubagentPreset('feature-builder');
    expect(preset.name).toBe('feature-builder');
    expect(preset.description).toBeTruthy();
    expect(preset.prompt).toBeTruthy();
  });

  it('bug-fixer 프리셋을 반환한다', () => {
    const preset = getSubagentPreset('bug-fixer');
    expect(preset.name).toBe('bug-fixer');
  });

  it('code-reviewer 프리셋을 반환한다', () => {
    const preset = getSubagentPreset('code-reviewer');
    expect(preset.name).toBe('code-reviewer');
  });

  it('없는 프리셋은 에러를 던진다', () => {
    expect(() => getSubagentPreset('nonexistent')).toThrow('Unknown preset: nonexistent');
  });
});
