import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/navigation
const mockRedirect = vi.fn();
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error(`REDIRECT:${url}`);
  },
}));

// Mock auth/server
const mockGetUser = vi.fn();
vi.mock('@/lib/auth/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
  }),
}));

// Mock db
const mockSelect = vi.fn();
vi.mock('@/lib/db/client', () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
  },
}));

vi.mock('@/lib/db/schema', () => ({
  users: { id: 'id', role: 'role' },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a: unknown, b: unknown) => ({ field: a, value: b })),
}));

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ role: 'admin' }]),
        }),
      }),
    });
  });

  it('redirects to /auth/login when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const { requireAdmin } = await import('./auth');
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/auth/login');
  });

  it('redirects to /dashboard when user is not admin', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'u1', email: 'test@test.com' } },
    });
    mockSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{ role: 'user' }]),
        }),
      }),
    });
    const { requireAdmin } = await import('./auth');
    await expect(requireAdmin()).rejects.toThrow('REDIRECT:/dashboard');
  });

  it('returns userId and email for admin user', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'u1', email: 'admin@test.com' } },
    });
    const { requireAdmin } = await import('./auth');
    const result = await requireAdmin();
    expect(result).toEqual({ userId: 'u1', email: 'admin@test.com' });
  });
});
