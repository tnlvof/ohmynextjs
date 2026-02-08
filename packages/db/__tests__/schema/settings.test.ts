import { describe, it, expect } from 'vitest';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { appSettings } from '../../src/schema/settings';

describe('app_settings table', () => {
  const config = getTableConfig(appSettings);

  it('has table name "app_settings"', () => {
    expect(config.name).toBe('app_settings');
  });

  it('has all required columns', () => {
    const columnNames = config.columns.map((c) => c.name);
    const expected = ['id', 'key', 'value', 'description', 'is_public', 'created_at', 'updated_at'];
    for (const name of expected) {
      expect(columnNames).toContain(name);
    }
  });

  it('key is unique and not null', () => {
    const col = config.columns.find((c) => c.name === 'key')!;
    expect(col.notNull).toBe(true);
    expect(col.isUnique).toBe(true);
  });

  it('value is not null', () => {
    const col = config.columns.find((c) => c.name === 'value')!;
    expect(col.notNull).toBe(true);
  });

  it('is_public defaults to false', () => {
    const col = config.columns.find((c) => c.name === 'is_public')!;
    expect(col.hasDefault).toBe(true);
    expect(col.notNull).toBe(true);
  });

  it('has key index', () => {
    const indexNames = config.indexes.map((i) => i.config.name);
    expect(indexNames).toContain('app_settings_key_idx');
  });
});
