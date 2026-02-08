import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'banned', 'deleted']);
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', 'paid', 'failed', 'cancelled', 'refunded', 'partial_refunded',
]);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', 'cancelled', 'past_due', 'expired', 'trialing',
]);
export const paymentMethodEnum = pgEnum('payment_method', [
  'card', 'virtual_account', 'transfer', 'mobile',
]);
