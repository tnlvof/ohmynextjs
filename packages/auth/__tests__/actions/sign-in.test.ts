import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignInWithPassword = vi.fn();
const mockCreateClient = vi.fn(async () => ({
  auth: { signInWithPassword: mockSignInWithPassword },
}));

vi.mock('../../src/supabase/server', () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`); }),
}));

import { signIn } from '../../src/actions/sign-in';

describe('signIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to /dashboard on success', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });
    await expect(signIn({ email: 'test@test.com', password: 'password123' }))
      .rejects.toThrow('REDIRECT:/dashboard');
  });

  it('should return error for invalid credentials', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });
    const result = await signIn({ email: 'test@test.com', password: 'wrong' });
    expect(result.error?.code).toBe('AUTH_INVALID_CREDENTIALS');
    expect(result.error?.message).toBe('이메일 또는 비밀번호가 올바르지 않습니다');
  });

  it('should return error for unconfirmed email', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Email not confirmed' },
    });
    const result = await signIn({ email: 'test@test.com', password: 'password123' });
    expect(result.error?.code).toBe('AUTH_EMAIL_NOT_CONFIRMED');
  });

  it('should return error for banned user', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'User is banned' },
    });
    const result = await signIn({ email: 'test@test.com', password: 'password123' });
    expect(result.error?.code).toBe('AUTH_USER_BANNED');
  });
});
