import { describe, it, expect } from 'vitest';
import { defaultConfig } from './config';

describe('config', () => {
  it('has default app name', () => {
    expect(defaultConfig.app.name).toBe('OhMyNextJS');
  });

  it('has system as default theme', () => {
    expect(defaultConfig.theme?.defaultTheme).toBe('system');
  });

  it('has header and footer enabled by default', () => {
    expect(defaultConfig.layout?.header).toBe(true);
    expect(defaultConfig.layout?.footer).toBe(true);
    expect(defaultConfig.layout?.sidebar).toBe(false);
  });
});
