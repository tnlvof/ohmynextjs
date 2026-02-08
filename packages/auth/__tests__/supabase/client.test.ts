import { describe, it, expect, vi } from 'vitest';

const mockCreateBrowserClient = vi.fn(() => ({ auth: {} }));
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: (...args: any[]) => mockCreateBrowserClient(...args),
}));

import { createClient } from '../../src/supabase/client';

describe('supabase/client', () => {
  it('should export createClient function', () => {
    expect(typeof createClient).toBe('function');
  });

  it('should call createBrowserClient with env vars', () => {
    createClient();
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    );
  });

  it('should return a supabase client', () => {
    const client = createClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });
});
