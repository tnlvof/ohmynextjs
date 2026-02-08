import { describe, it, expect, vi } from 'vitest';

const mockServerClient = { auth: { getUser: vi.fn() } };
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => mockServerClient),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}));

import { createClient } from '../../src/supabase/server';

describe('supabase/server', () => {
  it('should export createClient as async function', () => {
    expect(typeof createClient).toBe('function');
  });

  it('should return a supabase server client', async () => {
    const client = await createClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });
});
