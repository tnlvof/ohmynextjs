import { describe, it, expect } from 'vitest';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { plans } from '../../src/schema/plans';

describe('plans table', () => {
  const config = getTableConfig(plans);

  it('has table name "plans"', () => {
    expect(config.name).toBe('plans');
  });

  it('has all required columns', () => {
    const columnNames = config.columns.map((c) => c.name);
    const expected = [
      'id', 'name', 'slug', 'description', 'price', 'currency',
      'interval', 'interval_count', 'features', 'is_active',
      'sort_order', 'metadata', 'created_at', 'updated_at',
    ];
    for (const name of expected) {
      expect(columnNames).toContain(name);
    }
  });

  it('id is uuid with defaultRandom', () => {
    const col = config.columns.find((c) => c.name === 'id')!;
    expect(col.columnType).toBe('PgUUID');
    expect(col.primary).toBe(true);
    expect(col.hasDefault).toBe(true);
  });

  it('slug is unique and not null', () => {
    const col = config.columns.find((c) => c.name === 'slug')!;
    expect(col.notNull).toBe(true);
    expect(col.isUnique).toBe(true);
  });

  it('price is not null', () => {
    const col = config.columns.find((c) => c.name === 'price')!;
    expect(col.notNull).toBe(true);
  });

  it('currency defaults to KRW', () => {
    const col = config.columns.find((c) => c.name === 'currency')!;
    expect(col.hasDefault).toBe(true);
    expect(col.notNull).toBe(true);
  });

  it('is_active defaults to true', () => {
    const col = config.columns.find((c) => c.name === 'is_active')!;
    expect(col.hasDefault).toBe(true);
    expect(col.notNull).toBe(true);
  });

  it('has indexes', () => {
    const indexNames = config.indexes.map((i) => i.config.name);
    expect(indexNames).toContain('plans_slug_idx');
    expect(indexNames).toContain('plans_active_idx');
  });
});
