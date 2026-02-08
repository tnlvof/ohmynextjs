import { describe, it, expect } from 'vitest';
import {
  usersRelations,
  plansRelations,
  paymentsRelations,
  subscriptionsRelations,
  auditLogsRelations,
} from '../src/relations';

describe('Relations', () => {
  it('usersRelations is defined', () => {
    expect(usersRelations).toBeDefined();
  });

  it('plansRelations is defined', () => {
    expect(plansRelations).toBeDefined();
  });

  it('paymentsRelations is defined', () => {
    expect(paymentsRelations).toBeDefined();
  });

  it('subscriptionsRelations is defined', () => {
    expect(subscriptionsRelations).toBeDefined();
  });

  it('auditLogsRelations is defined', () => {
    expect(auditLogsRelations).toBeDefined();
  });
});
