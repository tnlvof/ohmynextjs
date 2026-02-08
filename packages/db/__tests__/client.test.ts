import { describe, it, expect } from 'vitest';

describe('Client exports', () => {
  it('schema modules export all tables', async () => {
    const schema = await import('../src/schema');
    expect(schema.users).toBeDefined();
    expect(schema.plans).toBeDefined();
    expect(schema.payments).toBeDefined();
    expect(schema.subscriptions).toBeDefined();
    expect(schema.appSettings).toBeDefined();
    expect(schema.auditLogs).toBeDefined();
  });

  it('schema modules export all enums', async () => {
    const schema = await import('../src/schema');
    expect(schema.userRoleEnum).toBeDefined();
    expect(schema.userStatusEnum).toBeDefined();
    expect(schema.paymentStatusEnum).toBeDefined();
    expect(schema.subscriptionStatusEnum).toBeDefined();
    expect(schema.paymentMethodEnum).toBeDefined();
  });

  it('relations are exported', async () => {
    const relations = await import('../src/relations');
    expect(relations.usersRelations).toBeDefined();
    expect(relations.plansRelations).toBeDefined();
    expect(relations.paymentsRelations).toBeDefined();
    expect(relations.subscriptionsRelations).toBeDefined();
    expect(relations.auditLogsRelations).toBeDefined();
  });
});
