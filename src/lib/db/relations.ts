import { relations } from 'drizzle-orm';
import { users, plans, payments, subscriptions, auditLogs } from './schema';

export const usersRelations = relations(users, ({ many }) => ({
  payments: many(payments),
  subscriptions: many(subscriptions),
  auditLogs: many(auditLogs),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  payments: many(payments),
  subscriptions: many(subscriptions),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  plan: one(plans, { fields: [payments.planId], references: [plans.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));
