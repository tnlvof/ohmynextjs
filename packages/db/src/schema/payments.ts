import { pgTable, uuid, text, integer, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';
import { plans } from './plans';
import { paymentStatusEnum, paymentMethodEnum } from './enums';

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id').references(() => plans.id),
  orderId: text('order_id').notNull().unique(),
  paymentKey: text('payment_key').unique(),
  amount: integer('amount').notNull(),
  currency: text('currency').default('KRW').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  method: paymentMethodEnum('method'),
  receiptUrl: text('receipt_url'),
  failReason: text('fail_reason'),
  cancelReason: text('cancel_reason'),
  cancelAmount: integer('cancel_amount'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index('payments_user_id_idx').on(table.userId),
  orderIdx: uniqueIndex('payments_order_id_idx').on(table.orderId),
  statusIdx: index('payments_status_idx').on(table.status),
  createdAtIdx: index('payments_created_at_idx').on(table.createdAt),
}));
