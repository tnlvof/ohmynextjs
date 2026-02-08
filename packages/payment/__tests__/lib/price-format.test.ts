import { describe, it, expect } from 'vitest';
import { formatPrice } from '../../src/lib/price-format';

describe('formatPrice', () => {
  it('should format Korean won', () => {
    expect(formatPrice(10000)).toBe('₩10,000');
  });

  it('should format zero', () => {
    expect(formatPrice(0)).toBe('₩0');
  });

  it('should format large amounts', () => {
    expect(formatPrice(1000000)).toBe('₩1,000,000');
  });

  it('should format small amounts', () => {
    expect(formatPrice(100)).toBe('₩100');
  });

  it('should default to KRW', () => {
    expect(formatPrice(9900)).toBe('₩9,900');
  });
});
