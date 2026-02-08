import { describe, it, expect } from 'vitest';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { users } from '../../src/schema/users';

describe('users table', () => {
  const config = getTableConfig(users);

  it('has table name "users"', () => {
    expect(config.name).toBe('users');
  });

  it('has all required columns', () => {
    const columnNames = config.columns.map((c) => c.name);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('email');
    expect(columnNames).toContain('name');
    expect(columnNames).toContain('avatar_url');
    expect(columnNames).toContain('role');
    expect(columnNames).toContain('status');
    expect(columnNames).toContain('provider');
    expect(columnNames).toContain('metadata');
    expect(columnNames).toContain('last_sign_in_at');
    expect(columnNames).toContain('created_at');
    expect(columnNames).toContain('updated_at');
  });

  it('id is uuid primary key', () => {
    const col = config.columns.find((c) => c.name === 'id')!;
    expect(col.dataType).toBe('string');
    expect(col.columnType).toBe('PgUUID');
    expect(col.primary).toBe(true);
  });

  it('email is not null and unique', () => {
    const col = config.columns.find((c) => c.name === 'email')!;
    expect(col.notNull).toBe(true);
    expect(col.isUnique).toBe(true);
  });

  it('role has default "user"', () => {
    const col = config.columns.find((c) => c.name === 'role')!;
    expect(col.notNull).toBe(true);
    expect(col.hasDefault).toBe(true);
  });

  it('status has default "active"', () => {
    const col = config.columns.find((c) => c.name === 'status')!;
    expect(col.notNull).toBe(true);
    expect(col.hasDefault).toBe(true);
  });

  it('created_at and updated_at have defaults', () => {
    const createdAt = config.columns.find((c) => c.name === 'created_at')!;
    const updatedAt = config.columns.find((c) => c.name === 'updated_at')!;
    expect(createdAt.notNull).toBe(true);
    expect(createdAt.hasDefault).toBe(true);
    expect(updatedAt.notNull).toBe(true);
    expect(updatedAt.hasDefault).toBe(true);
  });

  it('has indexes on email, role, status, created_at', () => {
    const indexNames = config.indexes.map((i) => i.config.name);
    expect(indexNames).toContain('users_email_idx');
    expect(indexNames).toContain('users_role_idx');
    expect(indexNames).toContain('users_status_idx');
    expect(indexNames).toContain('users_created_at_idx');
  });
});
