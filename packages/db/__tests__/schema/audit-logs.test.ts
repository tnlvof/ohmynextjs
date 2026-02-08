import { describe, it, expect } from 'vitest';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { auditLogs } from '../../src/schema/audit-logs';

describe('audit_logs table', () => {
  const config = getTableConfig(auditLogs);

  it('has table name "audit_logs"', () => {
    expect(config.name).toBe('audit_logs');
  });

  it('has all required columns', () => {
    const columnNames = config.columns.map((c) => c.name);
    const expected = [
      'id', 'user_id', 'action', 'target', 'target_id',
      'details', 'ip_address', 'user_agent', 'created_at',
    ];
    for (const name of expected) {
      expect(columnNames).toContain(name);
    }
  });

  it('action is not null', () => {
    const col = config.columns.find((c) => c.name === 'action')!;
    expect(col.notNull).toBe(true);
  });

  it('user_id is nullable (set null on delete)', () => {
    const col = config.columns.find((c) => c.name === 'user_id')!;
    expect(col.notNull).toBe(false);
  });

  it('does NOT have updated_at (append-only)', () => {
    const columnNames = config.columns.map((c) => c.name);
    expect(columnNames).not.toContain('updated_at');
  });

  it('has foreign key to users', () => {
    expect(config.foreignKeys.length).toBeGreaterThanOrEqual(1);
  });

  it('has indexes', () => {
    const indexNames = config.indexes.map((i) => i.config.name);
    expect(indexNames).toContain('audit_logs_user_id_idx');
    expect(indexNames).toContain('audit_logs_action_idx');
    expect(indexNames).toContain('audit_logs_created_at_idx');
  });
});
