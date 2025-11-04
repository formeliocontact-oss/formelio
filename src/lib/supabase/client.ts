// src/lib/supabase/client.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';
import type { Database } from '@/types/supabase';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (!client) {
    client = createBrowserClient<Database>(
      env.supabase.url,
      env.supabase.anonKey
    );
  }
  return client;
}
