import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetUser = vi.fn();
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

// Mock NextResponse and NextRequest
const mockRedirect = vi.fn((url: URL) => ({ type: 'redirect', url: url.toString() }));
const mockNext = vi.fn(() => ({ type: 'next', cookies: { set: vi.fn() } }));

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: URL) => mockRedirect(url),
    next: () => mockNext(),
  },
}));

import { authMiddleware } from '../src/middleware';

function createMockRequest(pathname: string) {
  return {
    cookies: {
      getAll: () => [],
      set: vi.fn(),
    },
    nextUrl: {
      pathname,
      clone: () => ({ pathname, toString: () => `http://localhost:3000${pathname}` }),
    },
  } as any;
}

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNext.mockReturnValue({ type: 'next', cookies: { set: vi.fn() } });
  });

  it('should redirect to login for protected routes when unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const result = await authMiddleware(createMockRequest('/dashboard'));
    expect(mockRedirect).toHaveBeenCalled();
  });

  it('should allow protected routes when authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: '1', user_metadata: {} } },
    });
    await authMiddleware(createMockRequest('/dashboard'));
    // Should call next, not redirect
    expect(mockNext).toHaveBeenCalled();
  });

  it('should redirect non-admin from admin routes', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: '1', user_metadata: { role: 'user' } } },
    });
    await authMiddleware(createMockRequest('/admin'));
    expect(mockRedirect).toHaveBeenCalled();
  });

  it('should allow admin to access admin routes', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: '1', user_metadata: { role: 'admin' } } },
    });
    await authMiddleware(createMockRequest('/admin'));
    expect(mockNext).toHaveBeenCalled();
  });

  it('should redirect authenticated user from auth routes to dashboard', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: '1', user_metadata: {} } },
    });
    await authMiddleware(createMockRequest('/auth/login'));
    expect(mockRedirect).toHaveBeenCalled();
  });

  it('should allow unauthenticated user to access auth routes', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    await authMiddleware(createMockRequest('/auth/login'));
    expect(mockNext).toHaveBeenCalled();
  });
});
