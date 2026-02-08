import { describe, it, expect } from 'vitest';
import { defaultPresets } from '../src/presets';

describe('defaultPresets', () => {
  it('3개 프리셋이 존재한다', () => {
    expect(defaultPresets).toHaveLength(3);
  });

  it('각 프리셋에 name, description, prompt가 있다', () => {
    for (const preset of defaultPresets) {
      expect(preset.name).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.prompt).toBeTruthy();
    }
  });
});
