import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockResetPasswordForEmail = vi.fn();
const mockUpdateUser = vi.fn();
const mockCreateClient = vi.fn(async () => ({
  auth: {
    resetPasswordForEmail: mockResetPasswordForEmail,
    updateUser: mockUpdateUser,
  },
}));

vi.mock('../../src/supabase/server', () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

import { resetPassword, updatePassword } from '../../src/actions/reset-password';

describe('resetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send reset email successfully', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });
    const result = await resetPassword('test@test.com');
    expect(result.error).toBeUndefined();
    expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@test.com', {
      redirectTo: 'http://localhost:3000/auth/reset-password',
    });
  });

  it('should return error on failure', async () => {
    mockResetPasswordForEmail.mockResolvedValue({
      error: { message: 'Rate limit exceeded' },
    });
    const result = await resetPassword('test@test.com');
    expect(result.error?.message).toBe('Rate limit exceeded');
  });
});

describe('updatePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update password successfully', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });
    const result = await updatePassword('newpassword123');
    expect(result.error).toBeUndefined();
    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newpassword123' });
  });
});
