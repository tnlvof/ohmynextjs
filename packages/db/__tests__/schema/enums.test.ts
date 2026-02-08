import { describe, it, expect } from 'vitest';
import {
  userRoleEnum,
  userStatusEnum,
  paymentStatusEnum,
  subscriptionStatusEnum,
  paymentMethodEnum,
} from '../../src/schema/enums';

describe('Enums', () => {
  it('userRoleEnum has correct values', () => {
    expect(userRoleEnum.enumValues).toEqual(['user', 'admin']);
  });

  it('userStatusEnum has correct values', () => {
    expect(userStatusEnum.enumValues).toEqual(['active', 'banned', 'deleted']);
  });

  it('paymentStatusEnum has correct values', () => {
    expect(paymentStatusEnum.enumValues).toEqual([
      'pending', 'paid', 'failed', 'cancelled', 'refunded', 'partial_refunded',
    ]);
  });

  it('subscriptionStatusEnum has correct values', () => {
    expect(subscriptionStatusEnum.enumValues).toEqual([
      'active', 'cancelled', 'past_due', 'expired', 'trialing',
    ]);
  });

  it('paymentMethodEnum has correct values', () => {
    expect(paymentMethodEnum.enumValues).toEqual([
      'card', 'virtual_account', 'transfer', 'mobile',
    ]);
  });
});
