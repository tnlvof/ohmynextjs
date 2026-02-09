import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetClaims = vi.fn();
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: { getClaims: mockGetClaims },
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

import { updateSession } from '../../src/supabase/proxy';

function createMockRequest(pathname: string) {
  return {
    cookies: {
      getAll: () => [],
      set: vi.fn(),
    },
    nextUrl: {
      pathname,
      clone: () => ({ pathname, toString: () => `http://localhost:3000${pathname}` }),
      startsWith: (prefix: string) => pathname.startsWith(prefix),
    },
  } as any;
}

describe('updateSession (proxy)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNext.mockReturnValue({ type: 'next', cookies: { set: vi.fn() } });
  });

  it('should redirect to login for protected routes when unauthenticated', async () => {
    mockGetClaims.mockResolvedValue({ data: { claims: null } });
    await updateSession(createMockRequest('/dashboard'));
    expect(mockRedirect).toHaveBeenCalled();
  });

  it('should allow protected routes when authenticated', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: { sub: '1' } },
    });
    await updateSession(createMockRequest('/dashboard'));
    expect(mockNext).toHaveBeenCalled();
  });

  it('should redirect authenticated user from auth routes to dashboard', async () => {
    mockGetClaims.mockResolvedValue({
      data: { claims: { sub: '1' } },
    });
    await updateSession(createMockRequest('/auth/login'));
    expect(mockRedirect).toHaveBeenCalled();
  });

  it('should allow unauthenticated user to access auth routes', async () => {
    mockGetClaims.mockResolvedValue({ data: { claims: null } });
    await updateSession(createMockRequest('/auth/login'));
    expect(mockNext).toHaveBeenCalled();
  });

  it('should allow unauthenticated user to access public routes', async () => {
    mockGetClaims.mockResolvedValue({ data: { claims: null } });
    await updateSession(createMockRequest('/'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should allow unauthenticated user to access pricing', async () => {
    mockGetClaims.mockResolvedValue({ data: { claims: null } });
    await updateSession(createMockRequest('/pricing'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should redirect unauthenticated user from admin routes', async () => {
    mockGetClaims.mockResolvedValue({ data: { claims: null } });
    await updateSession(createMockRequest('/admin'));
    expect(mockRedirect).toHaveBeenCalled();
  });
});
