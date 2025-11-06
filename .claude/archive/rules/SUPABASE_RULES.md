# Supabase Rules - Auth, Database & RLS

**Version**: 2.0
**Focus**: Correct package usage, session management, RLS security

---

## 🚨 CRITICAL RULES - Break These = Break Production

### ❌ NEVER Use @supabase/auth-helpers-nextjs

**This package is DEPRECATED and WILL break your app.**

```typescript
// ❌ FORBIDDEN - DEPRECATED PACKAGE
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
```

**Consequences of using deprecated package:**
- 🔴 Sessions break randomly
- 🔴 Auth state not maintained
- 🔴 Cookies not set correctly
- 🔴 Users logged out unexpectedly
- 🔴 No support/fixes from Supabase

---

### ✅ ALWAYS Use @supabase/ssr

**This is the ONLY supported package for Next.js.**

```bash
# Install correct package
npm install @supabase/ssr
```

```typescript
// ✅ CORRECT - Modern SSR package
import { createBrowserClient } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';
```

---

## 🍪 Cookie Handling - CRITICAL

### ❌ NEVER Implement Cookies Manually

**DO NOT use get/set/remove** - This BREAKS the app.

```typescript
// ❌ FORBIDDEN - Manual cookie implementation
const supabase = createServerClient(url, key, {
  cookies: {
    get(name) {
      return cookieStore.get(name);  // ❌ BREAKS APP
    },
    set(name, value) {
      cookieStore.set(name, value);  // ❌ BREAKS APP
    },
    remove(name) {
      cookieStore.remove(name);      // ❌ BREAKS APP
    }
  }
});
```

**Why it breaks:**
- get/set/remove don't handle all cookies properly
- Doesn't update request/response correctly
- Sessions become inconsistent

---

### ✅ ALWAYS Use getAll/setAll Pattern

```typescript
// ✅ CORRECT - getAll/setAll pattern
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return cookies().getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies().set(name, value, options)
          );
        } catch {
          // Server Component - can't set cookies
        }
      },
    },
  }
);
```

---

## 📁 Standard Supabase Client Files

**Use these THREE files. No alternatives.**

### 1. Browser Client (`lib/supabase/client.ts`)

**For Client Components only.**

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**Usage:**
```typescript
'use client'

import { createClient } from '@/lib/supabase/client';

export function MyComponent() {
  const supabase = createClient();
  // Use supabase...
}
```

---

### 2. Server Client (`lib/supabase/server.ts`)

**For Server Components and Server Actions.**

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component - ignore
          }
        },
      },
    }
  );
}
```

**Usage:**
```typescript
// app/dashboard/page.tsx (Server Component)
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data } = await supabase.from('cases').select('*');
  return <div>...</div>;
}
```

---

### 3. Middleware Client (`lib/supabase/middleware.ts`)

**For middleware.ts to refresh sessions.**

```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // CRITICAL: Don't run code between createServerClient and getUser
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabaseResponse;
}
```

**Usage:**
```typescript
// middleware.ts
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## 🔒 Row Level Security (RLS)

### ✅ ALWAYS Enable RLS

**EVERY table must have RLS enabled.**

```sql
-- ✅ Enable RLS on all tables
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
```

**Without RLS:**
- 🔴 Users can access other users' data
- 🔴 Major security vulnerability
- 🔴 RGPD compliance violation

---

### RLS Policy Patterns

**Read Policy (SELECT):**
```sql
CREATE POLICY "Users can view their own cases"
ON cases FOR SELECT
USING (auth.uid() = user_id);
```

**Write Policy (INSERT/UPDATE):**
```sql
CREATE POLICY "Users can update their own cases"
ON cases FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cases"
ON cases FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Delete Policy:**
```sql
CREATE POLICY "Users can delete their own cases"
ON cases FOR DELETE
USING (auth.uid() = user_id);
```

**Performance Optimization:**
```sql
-- ✅ OPTIMIZED - Wrap auth.uid() to use index
CREATE POLICY "Optimized read policy"
ON cases FOR SELECT
USING (user_id = (SELECT auth.uid()));
```

---

## 🔧 Common Patterns

### Error Handling

```typescript
// ✅ ALWAYS check for errors
const { data, error } = await supabase
  .from('cases')
  .select('*')
  .eq('user_id', userId);

if (error) {
  console.error('Supabase error:', error);
  throw new Error(`Failed to fetch cases: ${error.message}`);
}

// Now data is guaranteed non-null
return data;
```

### Using Generated Types

```typescript
// types/supabase.ts (generated with Supabase CLI)
export type Database = { /* generated types */ };

// Usage
import type { Database } from '@/types/supabase';

const supabase = createClient<Database>();

// Now you get full type safety
const { data } = await supabase
  .from('cases')  // ✅ Autocomplete works
  .select('*');   // ✅ data is typed correctly
```

**Generate types:**
```bash
npx supabase gen types typescript --project-id "$PROJECT_ID" > types/supabase.ts
```

---

### Realtime Subscriptions (Client Only)

```typescript
'use client'

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function RealtimeComponent() {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('cases_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cases',
        },
        (payload) => {
          console.log('New case:', payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return <div>...</div>;
}
```

---

### Storage (File Uploads)

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('documents')
  .upload(`${userId}/${filename}`, file, {
    cacheControl: '3600',
    upsert: false,
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('documents')
  .getPublicUrl(`${userId}/${filename}`);

// Download file
const { data: blob, error } = await supabase.storage
  .from('documents')
  .download(`${userId}/${filename}`);
```

**Storage RLS:**
```sql
-- Allow users to upload their own files
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 📋 Pre-Commit Supabase Checklist

Before committing:

- [ ] NO imports from `@supabase/auth-helpers-nextjs`
- [ ] ALL Supabase clients use `@supabase/ssr`
- [ ] Cookie handling uses `getAll()`/`setAll()` pattern
- [ ] RLS enabled on all new tables
- [ ] RLS policies created for all operations
- [ ] Error handling present for all queries
- [ ] Types generated if schema changed

---

## 🔗 Related Rules

- **Architecture**: [ARCHITECTURE_RULES.md](./ARCHITECTURE_RULES.md)
- **TypeScript**: [TYPESCRIPT_RULES.md](./TYPESCRIPT_RULES.md)
- **Next.js**: [NEXTJS_RULES.md](./NEXTJS_RULES.md)
- **Main Rules**: [../CLAUDE.md](../CLAUDE.md)

---

## 📚 External Resources

- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
