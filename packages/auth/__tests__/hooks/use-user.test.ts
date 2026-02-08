import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const mockGetUser = vi.fn();
vi.mock('../../src/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
  }),
}));

import { useUser } from '../../src/hooks/use-user';

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user data when authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: '1',
          email: 'test@test.com',
          user_metadata: { full_name: 'Test', avatar_url: null, role: 'user' },
          app_metadata: { provider: 'email' },
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          last_sign_in_at: '2024-01-01',
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user?.email).toBe('test@test.com');
    expect(result.current.user?.name).toBe('Test');
  });

  it('should return null when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it('should return error on failure', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Session expired'),
    });
    const { result } = renderHook(() => useUser());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });

  it('should start in loading state', () => {
    mockGetUser.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useUser());
    expect(result.current.isLoading).toBe(true);
  });
});
