import { describe, it, expect } from 'vitest';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { payments } from '../../src/schema/payments';

describe('payments table', () => {
  const config = getTableConfig(payments);

  it('has table name "payments"', () => {
    expect(config.name).toBe('payments');
  });

  it('has all required columns', () => {
    const columnNames = config.columns.map((c) => c.name);
    const expected = [
      'id', 'user_id', 'plan_id', 'order_id', 'payment_key',
      'amount', 'currency', 'status', 'method', 'receipt_url',
      'fail_reason', 'cancel_reason', 'cancel_amount',
      'paid_at', 'cancelled_at', 'metadata', 'created_at', 'updated_at',
    ];
    for (const name of expected) {
      expect(columnNames).toContain(name);
    }
  });

  it('user_id is not null', () => {
    const col = config.columns.find((c) => c.name === 'user_id')!;
    expect(col.notNull).toBe(true);
  });

  it('order_id is unique and not null', () => {
    const col = config.columns.find((c) => c.name === 'order_id')!;
    expect(col.notNull).toBe(true);
    expect(col.isUnique).toBe(true);
  });

  it('payment_key is unique', () => {
    const col = config.columns.find((c) => c.name === 'payment_key')!;
    expect(col.isUnique).toBe(true);
  });

  it('has foreign keys', () => {
    expect(config.foreignKeys.length).toBeGreaterThanOrEqual(1);
  });

  it('has indexes', () => {
    const indexNames = config.indexes.map((i) => i.config.name);
    expect(indexNames).toContain('payments_user_id_idx');
    expect(indexNames).toContain('payments_order_id_idx');
    expect(indexNames).toContain('payments_status_idx');
    expect(indexNames).toContain('payments_created_at_idx');
  });
});
