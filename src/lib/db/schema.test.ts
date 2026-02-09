import { describe, it, expect } from 'vitest';
import { users, plans, payments, subscriptions, appSettings, auditLogs } from './schema';

describe('schema', () => {
  it('exports users table', () => {
    expect(users).toBeDefined();
  });

  it('exports plans table', () => {
    expect(plans).toBeDefined();
  });

  it('exports payments table', () => {
    expect(payments).toBeDefined();
  });

  it('exports subscriptions table', () => {
    expect(subscriptions).toBeDefined();
  });

  it('exports appSettings table', () => {
    expect(appSettings).toBeDefined();
  });

  it('exports auditLogs table', () => {
    expect(auditLogs).toBeDefined();
  });
});
