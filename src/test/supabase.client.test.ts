import { afterEach, describe, expect, it, vi } from 'vitest';

describe('supabase client', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('does not throw at import when the Supabase env is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mod = await import('@/lib/supabase');
    expect(mod.isSupabaseConfigured).toBe(false);
    expect(mod.supabase).toBeDefined();
  });

  it('reports configured when both vars are set', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key');
    const mod = await import('@/lib/supabase');
    expect(mod.isSupabaseConfigured).toBe(true);
  });
});
