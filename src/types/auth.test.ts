import { describe, it, expect } from 'vitest';
import { AUTH_ERRORS } from './auth';

describe('AUTH_ERRORS', () => {
  it('has Korean error messages', () => {
    expect(AUTH_ERRORS.AUTH_INVALID_CREDENTIALS).toContain('이메일');
    expect(AUTH_ERRORS.AUTH_EMAIL_EXISTS).toContain('이미');
    expect(AUTH_ERRORS.AUTH_WEAK_PASSWORD).toContain('6자');
  });
});
