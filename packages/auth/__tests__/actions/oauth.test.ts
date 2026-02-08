import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignInWithOAuth = vi.fn();
const mockCreateClient = vi.fn(async () => ({
  auth: { signInWithOAuth: mockSignInWithOAuth },
}));

vi.mock('../../src/supabase/server', () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`); }),
}));

import { signInWithOAuth } from '../../src/actions/oauth';

describe('signInWithOAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to OAuth URL on success', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://accounts.google.com/auth' },
      error: null,
    });
    await expect(signInWithOAuth('google'))
      .rejects.toThrow('REDIRECT:https://accounts.google.com/auth');
  });

  it('should pass redirectTo with callback URL', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://oauth.example.com' },
      error: null,
    });
    try { await signInWithOAuth('github'); } catch {}
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000/api/auth/callback',
        queryParams: undefined,
      },
    });
  });

  it('should add prompt param for kakao', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { url: 'https://kauth.kakao.com' },
      error: null,
    });
    try { await signInWithOAuth('kakao'); } catch {}
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'kakao',
      options: {
        redirectTo: 'http://localhost:3000/api/auth/callback',
        queryParams: { prompt: 'login' },
      },
    });
  });

  it('should throw on error', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: null,
      error: new Error('OAuth error'),
    });
    await expect(signInWithOAuth('google')).rejects.toThrow('OAuth error');
  });
});
