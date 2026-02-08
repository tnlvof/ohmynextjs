import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignUp = vi.fn();
const mockCreateClient = vi.fn(async () => ({
  auth: { signUp: mockSignUp },
}));

vi.mock('../../src/supabase/server', () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`); }),
}));

import { signUp } from '../../src/actions/sign-up';

describe('signUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to verify-email on success', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    await expect(signUp({ email: 'new@test.com', password: 'password123' }))
      .rejects.toThrow('REDIRECT:/auth/verify-email');
  });

  it('should return error for duplicate email', async () => {
    mockSignUp.mockResolvedValue({
      error: { message: 'User already registered' },
    });
    const result = await signUp({ email: 'existing@test.com', password: 'password123' });
    expect(result.error?.code).toBe('AUTH_EMAIL_EXISTS');
    expect(result.error?.message).toBe('이미 가입된 이메일입니다');
  });

  it('should return error for weak password', async () => {
    mockSignUp.mockResolvedValue({
      error: { message: 'Password should be at least 6 characters' },
    });
    const result = await signUp({ email: 'new@test.com', password: '123' });
    expect(result.error?.code).toBe('AUTH_WEAK_PASSWORD');
    expect(result.error?.message).toBe('비밀번호는 6자 이상이어야 합니다');
  });

  it('should pass name in user metadata', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    try {
      await signUp({ email: 'new@test.com', password: 'password123', name: 'Test User' });
    } catch {}
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'new@test.com',
      password: 'password123',
      options: { data: { full_name: 'Test User' } },
    });
  });
});
