import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSignOut = vi.fn();
const mockCreateClient = vi.fn(async () => ({
  auth: { signOut: mockSignOut },
}));

vi.mock('../../src/supabase/server', () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`); }),
}));

import { signOut } from '../../src/actions/sign-out';

describe('signOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call supabase signOut and redirect to login', async () => {
    mockSignOut.mockResolvedValue({ error: null });
    await expect(signOut()).rejects.toThrow('REDIRECT:/auth/login');
    expect(mockSignOut).toHaveBeenCalled();
  });
});
