import { describe, it, expect } from 'vitest';
import { generateOrderId } from '../../src/lib/order-id';

describe('generateOrderId', () => {
  it('should match OMN_{timestamp}_{random} format', () => {
    const orderId = generateOrderId();
    expect(orderId).toMatch(/^OMN_\d+_[A-Z0-9]+$/);
  });

  it('should start with OMN_', () => {
    expect(generateOrderId().startsWith('OMN_')).toBe(true);
  });

  it('should generate unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateOrderId()));
    expect(ids.size).toBe(100);
  });

  it('should contain a timestamp part', () => {
    const before = Date.now();
    const orderId = generateOrderId();
    const after = Date.now();
    const parts = orderId.split('_');
    const timestamp = parseInt(parts[1], 10);
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });
});
