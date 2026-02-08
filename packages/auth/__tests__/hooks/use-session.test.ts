import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn(() => ({
  data: { subscription: { unsubscribe: vi.fn() } },
}));

vi.mock('../../src/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
    },
  }),
}));

import { useSession } from '../../src/hooks/use-session';

describe('useSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return session when authenticated', async () => {
    const mockSession = { access_token: 'token', user: { id: '1' } };
    mockGetSession.mockResolvedValue({ data: { session: mockSession } });
    const { result } = renderHook(() => useSession());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toEqual(mockSession);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should return null session when not authenticated', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    const { result } = renderHook(() => useSession());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should start in loading state', () => {
    mockGetSession.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useSession());
    expect(result.current.isLoading).toBe(true);
  });

  it('should subscribe to auth state changes', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    renderHook(() => useSession());
    expect(mockOnAuthStateChange).toHaveBeenCalled();
  });
});
