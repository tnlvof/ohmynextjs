import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock requireAdmin
const mockRequireAdmin = vi.fn();
vi.mock('./auth', () => ({
  requireAdmin: () => mockRequireAdmin(),
}));

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock drizzle-orm
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a: unknown, b: unknown) => ({ eq: [a, b] })),
}));

vi.mock('@/lib/db/schema', () => ({
  users: { id: 'id', role: 'role', status: 'status', updatedAt: 'updatedAt' },
  appSettings: { id: 'id', key: 'key', value: 'value', description: 'description', isPublic: 'isPublic', updatedAt: 'updatedAt' },
  auditLogs: {},
}));

// Mock db
const mockInsertValues = vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 'new-id' }]) });
const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });
const mockUpdateSet = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) });
const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet });
const mockDeleteWhere = vi.fn().mockResolvedValue([]);
const mockDelete = vi.fn().mockReturnValue({ where: mockDeleteWhere });

let selectResult: unknown[] = [];
const mockSelectChain: any = {};
mockSelectChain.from = vi.fn().mockReturnValue(mockSelectChain);
mockSelectChain.where = vi.fn().mockReturnValue(mockSelectChain);
mockSelectChain.limit = vi.fn().mockImplementation(() => Promise.resolve(selectResult));

vi.mock('@/lib/db/client', () => ({
  db: {
    select: vi.fn().mockReturnValue(mockSelectChain),
    insert: (...args: unknown[]) => mockInsert(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}));

describe('admin actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAdmin.mockResolvedValue({ userId: 'admin-1', email: 'admin@test.com' });
    selectResult = [{ role: 'user', status: 'active' }];
    mockInsertValues.mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 'new-id' }]) });
  });

  describe('updateUserRole', () => {
    it('prevents changing own role', async () => {
      const { updateUserRole } = await import('./actions');
      const result = await updateUserRole('admin-1', 'user');
      expect(result).toEqual({ success: false, error: '자기 자신의 역할은 변경할 수 없습니다.' });
    });

    it('updates role and creates audit log', async () => {
      const { updateUserRole } = await import('./actions');
      const result = await updateUserRole('user-1', 'admin');
      expect(result).toEqual({ success: true });
      expect(mockInsert).toHaveBeenCalled();
    });

    it('returns error when user not found', async () => {
      selectResult = [];
      const { updateUserRole } = await import('./actions');
      const result = await updateUserRole('nonexistent', 'admin');
      expect(result).toEqual({ success: false, error: '유저를 찾을 수 없습니다.' });
    });
  });

  describe('updateUserStatus', () => {
    it('prevents changing own status', async () => {
      const { updateUserStatus } = await import('./actions');
      const result = await updateUserStatus('admin-1', 'banned');
      expect(result).toEqual({ success: false, error: '자기 자신의 상태는 변경할 수 없습니다.' });
    });

    it('updates status successfully', async () => {
      const { updateUserStatus } = await import('./actions');
      const result = await updateUserStatus('user-1', 'banned');
      expect(result).toEqual({ success: true });
    });
  });

  describe('createSetting', () => {
    it('creates setting and audit log', async () => {
      const { createSetting } = await import('./actions');
      const result = await createSetting({ key: 'test', value: 'val' });
      expect(result).toEqual({ success: true });
    });
  });

  describe('updateSetting', () => {
    it('returns error for nonexistent setting', async () => {
      selectResult = [];
      const { updateSetting } = await import('./actions');
      const result = await updateSetting('nonexistent', { value: 'new' });
      expect(result).toEqual({ success: false, error: '설정을 찾을 수 없습니다.' });
    });

    it('updates setting successfully', async () => {
      selectResult = [{ id: 's1', key: 'test', value: 'old' }];
      const { updateSetting } = await import('./actions');
      const result = await updateSetting('s1', { value: 'new' });
      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteSetting', () => {
    it('deletes setting and logs', async () => {
      selectResult = [{ key: 'test' }];
      const { deleteSetting } = await import('./actions');
      const result = await deleteSetting('s1');
      expect(result).toEqual({ success: true });
    });
  });
});
