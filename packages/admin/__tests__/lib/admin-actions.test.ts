import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks must be hoisted - no references to outer variables in factory
vi.mock('@ohmynextjs/auth', () => ({
  useUser: vi.fn(),
  supabaseAdmin: {
    auth: { admin: { signOut: vi.fn().mockResolvedValue(undefined) } },
  },
}));

vi.mock('@ohmynextjs/db', () => ({
  db: {
    select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }) }),
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }),
    update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }) }),
    delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
    query: vi.fn(),
  },
  users: { id: 'id', role: 'role', status: 'status' },
  payments: { id: 'id', status: 'status', amount: 'amount' },
  subscriptions: { id: 'id', status: 'status' },
  appSettings: { id: 'id', key: 'key', value: 'value' },
  auditLogs: { id: 'id' },
}));

vi.mock('../../src/lib/get-current-user', () => ({
  getCurrentUser: vi.fn(),
}));

import {
  requireAdmin,
  getAdminStats,
  updateUserRole,
  updateUserStatus,
  refundPayment,
  getSettings,
  updateSetting,
  createSetting,
  deleteSetting,
} from '../../src/lib/admin-actions';

// Get the mock reference after import
import { getCurrentUser } from '../../src/lib/get-current-user';
import { db } from '@ohmynextjs/db';

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockDb = vi.mocked(db) as any;

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow admin user', async () => {
    const adminUser = { id: '1', email: 'admin@test.com', role: 'admin' } as any;
    mockGetCurrentUser.mockResolvedValue(adminUser);
    const result = await requireAdmin();
    expect(result).toEqual(adminUser);
  });

  it('should reject non-admin user', async () => {
    mockGetCurrentUser.mockResolvedValue({ id: '2', email: 'user@test.com', role: 'user' } as any);
    await expect(requireAdmin()).rejects.toThrow('AUTH_FORBIDDEN');
  });

  it('should reject unauthenticated user', async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    await expect(requireAdmin()).rejects.toThrow('AUTH_FORBIDDEN');
  });
});

describe('getAdminStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue({ id: '1', role: 'admin' } as any);
  });

  it('should return stats with counts', async () => {
    const stats = await getAdminStats();
    expect(stats).toHaveProperty('totalUsers');
    expect(stats).toHaveProperty('activeUsers');
    expect(stats).toHaveProperty('monthlyRevenue');
    expect(stats).toHaveProperty('activeSubscriptions');
  });
});

describe('updateUserRole', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue({ id: 'admin-1', role: 'admin' } as any);
  });

  it('should update user role', async () => {
    await expect(updateUserRole('user-1', 'admin')).resolves.not.toThrow();
  });

  it('should reject self role change', async () => {
    await expect(updateUserRole('admin-1', 'user')).rejects.toThrow('ADMIN_SELF_ROLE_CHANGE');
  });

  it('should record audit log', async () => {
    await updateUserRole('user-1', 'admin');
    expect(mockDb.insert).toHaveBeenCalled();
  });
});

describe('updateUserStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue({ id: 'admin-1', role: 'admin' } as any);
  });

  it('should ban user and invalidate session', async () => {
    await updateUserStatus('user-1', 'banned');
    expect(mockDb.update).toHaveBeenCalled();
  });
});

describe('refundPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue({ id: 'admin-1', role: 'admin' } as any);
  });

  it('should process full refund', async () => {
    await expect(refundPayment('pay-1', undefined, 'test reason')).resolves.not.toThrow();
  });

  it('should process partial refund', async () => {
    await expect(refundPayment('pay-1', 5000, 'partial reason')).resolves.not.toThrow();
  });
});

describe('Settings CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCurrentUser.mockResolvedValue({ id: 'admin-1', role: 'admin' } as any);
  });

  it('getSettings should return settings list', async () => {
    const result = await getSettings();
    expect(Array.isArray(result)).toBe(true);
  });

  it('updateSetting should update a setting', async () => {
    await expect(updateSetting('site_name', 'New Name')).resolves.not.toThrow();
  });

  it('createSetting should create a setting', async () => {
    await expect(createSetting('new_key', 'value', 'desc', false)).resolves.not.toThrow();
  });

  it('deleteSetting should delete a setting', async () => {
    await expect(deleteSetting('old_key')).resolves.not.toThrow();
  });
});
