import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock requireAdmin
const mockRequireAdmin = vi.fn();
vi.mock('./auth', () => ({
  requireAdmin: () => mockRequireAdmin(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a: unknown, b: unknown) => ({ eq: [a, b] })),
  and: vi.fn((...args: unknown[]) => ({ and: args })),
  desc: vi.fn((col: unknown) => ({ desc: col })),
  max: vi.fn((col: unknown) => ({ max: col })),
}));

vi.mock('@/lib/db/schema', () => ({
  legalDocuments: {
    id: 'id',
    type: 'type',
    version: 'version',
    title: 'title',
    content: 'content',
    isActive: 'is_active',
    effectiveDate: 'effective_date',
    createdBy: 'created_by',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  auditLogs: {},
}));

let selectResult: unknown[] = [];
const mockSelectChain: any = {};
mockSelectChain.from = vi.fn().mockReturnValue(mockSelectChain);
mockSelectChain.where = vi.fn().mockReturnValue(mockSelectChain);
mockSelectChain.orderBy = vi.fn().mockReturnValue(mockSelectChain);
mockSelectChain.limit = vi.fn().mockImplementation(() => Promise.resolve(selectResult));
// When no limit is called, resolve via then
mockSelectChain.then = undefined; // will be overridden per test if needed

const mockInsertValues = vi.fn().mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 'new-id' }]) });
const mockInsert = vi.fn().mockReturnValue({ values: mockInsertValues });
const mockUpdateSet = vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) });
const mockUpdate = vi.fn().mockReturnValue({ set: mockUpdateSet });

vi.mock('@/lib/db/client', () => ({
  db: {
    select: vi.fn().mockReturnValue(mockSelectChain),
    insert: (...args: unknown[]) => mockInsert(...args),
    update: (...args: unknown[]) => mockUpdate(...args),
  },
}));

describe('legal-actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAdmin.mockResolvedValue({ userId: 'admin-1', email: 'admin@test.com' });
    selectResult = [];
    mockInsertValues.mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 'new-id' }]) });
    mockSelectChain.from.mockReturnValue(mockSelectChain);
    mockSelectChain.where.mockReturnValue(mockSelectChain);
    mockSelectChain.orderBy.mockReturnValue(mockSelectChain);
    mockSelectChain.limit.mockImplementation(() => Promise.resolve(selectResult));
  });

  describe('getActiveLegalDoc', () => {
    it('returns null when no active doc exists', async () => {
      selectResult = [];
      const { getActiveLegalDoc } = await import('./legal-actions');
      const result = await getActiveLegalDoc('terms');
      expect(result).toBeNull();
    });

    it('returns the active doc when one exists', async () => {
      const doc = { id: 'doc-1', type: 'terms', version: 1, title: '이용약관 v1', content: '# 약관', isActive: true };
      selectResult = [doc];
      const { getActiveLegalDoc } = await import('./legal-actions');
      const result = await getActiveLegalDoc('terms');
      expect(result).toEqual(doc);
    });
  });

  describe('getLegalDocs', () => {
    it('returns empty array when no docs', async () => {
      // For getLegalDocs, the chain ends with orderBy (no limit), so we need it to be thenable
      const docs: unknown[] = [];
      mockSelectChain.orderBy.mockResolvedValue(docs);
      const { getLegalDocs } = await import('./legal-actions');
      const result = await getLegalDocs('terms');
      expect(result).toEqual([]);
    });

    it('returns docs list', async () => {
      const docs = [
        { id: 'doc-2', type: 'terms', version: 2, title: '이용약관 v2' },
        { id: 'doc-1', type: 'terms', version: 1, title: '이용약관 v1' },
      ];
      mockSelectChain.orderBy.mockResolvedValue(docs);
      const { getLegalDocs } = await import('./legal-actions');
      const result = await getLegalDocs('terms');
      expect(result).toEqual(docs);
    });
  });

  describe('getNextVersion', () => {
    it('returns 1 when no docs exist', async () => {
      selectResult = [{ maxVersion: null }];
      const { getNextVersion } = await import('./legal-actions');
      const result = await getNextVersion('terms');
      expect(result).toBe(1);
    });

    it('returns next version number', async () => {
      selectResult = [{ maxVersion: 3 }];
      const { getNextVersion } = await import('./legal-actions');
      const result = await getNextVersion('terms');
      expect(result).toBe(4);
    });
  });

  describe('createLegalDoc', () => {
    it('creates a new legal doc and audit log', async () => {
      selectResult = [{ maxVersion: null }];
      const { createLegalDoc } = await import('./legal-actions');
      const result = await createLegalDoc({
        type: 'terms',
        title: '이용약관 v1',
        content: '# 약관 내용',
        effectiveDate: new Date('2025-01-01'),
      });
      expect(result).toEqual({ success: true });
      expect(mockInsert).toHaveBeenCalled();
    });
  });

  describe('activateLegalDoc', () => {
    it('returns error when doc not found', async () => {
      selectResult = [];
      const { activateLegalDoc } = await import('./legal-actions');
      const result = await activateLegalDoc('nonexistent');
      expect(result).toEqual({ success: false, error: '문서를 찾을 수 없습니다.' });
    });

    it('activates doc and deactivates others', async () => {
      selectResult = [{ id: 'doc-1', type: 'terms', version: 1, isActive: false }];
      const { activateLegalDoc } = await import('./legal-actions');
      const result = await activateLegalDoc('doc-1');
      expect(result).toEqual({ success: true });
      // Should have called update twice (deactivate others + activate this one)
      expect(mockUpdate).toHaveBeenCalledTimes(2);
    });
  });
});
