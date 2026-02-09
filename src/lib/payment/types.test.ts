import { describe, it, expect } from 'vitest';
import { PaymentError } from './types';

describe('PaymentError', () => {
  it('creates error with code and message', () => {
    const err = new PaymentError('PAY_001', '결제 실패');
    expect(err.code).toBe('PAY_001');
    expect(err.message).toBe('결제 실패');
    expect(err.name).toBe('PaymentError');
    expect(err).toBeInstanceOf(Error);
  });
});
