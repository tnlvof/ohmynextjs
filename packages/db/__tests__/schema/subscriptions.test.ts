import { describe, it, expect } from 'vitest';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { subscriptions } from '../../src/schema/subscriptions';

describe('subscriptions table', () => {
  const config = getTableConfig(subscriptions);

  it('has table name "subscriptions"', () => {
    expect(config.name).toBe('subscriptions');
  });

  it('has all required columns', () => {
    const columnNames = config.columns.map((c) => c.name);
    const expected = [
      'id', 'user_id', 'plan_id', 'billing_key', 'status',
      'current_period_start', 'current_period_end',
      'cancel_at_period_end', 'cancelled_at',
      'trial_start', 'trial_end', 'metadata',
      'created_at', 'updated_at',
    ];
    for (const name of expected) {
      expect(columnNames).toContain(name);
    }
  });

  it('user_id and plan_id are not null', () => {
    const userId = config.columns.find((c) => c.name === 'user_id')!;
    const planId = config.columns.find((c) => c.name === 'plan_id')!;
    expect(userId.notNull).toBe(true);
    expect(planId.notNull).toBe(true);
  });

  it('current_period_start and end are not null', () => {
    const start = config.columns.find((c) => c.name === 'current_period_start')!;
    const end = config.columns.find((c) => c.name === 'current_period_end')!;
    expect(start.notNull).toBe(true);
    expect(end.notNull).toBe(true);
  });

  it('cancel_at_period_end defaults to false', () => {
    const col = config.columns.find((c) => c.name === 'cancel_at_period_end')!;
    expect(col.hasDefault).toBe(true);
    expect(col.notNull).toBe(true);
  });

  it('has foreign keys', () => {
    expect(config.foreignKeys.length).toBeGreaterThanOrEqual(2);
  });

  it('has indexes', () => {
    const indexNames = config.indexes.map((i) => i.config.name);
    expect(indexNames).toContain('subscriptions_user_id_idx');
    expect(indexNames).toContain('subscriptions_status_idx');
    expect(indexNames).toContain('subscriptions_period_end_idx');
  });
});
