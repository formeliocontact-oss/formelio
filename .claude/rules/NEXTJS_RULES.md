# Next.js Rules - App Router & Server/Client Components

**Version**: 2.0
**Focus**: Next.js 14+ App Router, Server vs Client Components

---

## 🎯 Golden Rule: Server Components by Default

**Server Components are the DEFAULT. Only use Client Components when necessary.**

```tsx
// ✅ DEFAULT - Server Component (no 'use client')
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data } = await supabase.from('cases').select('*');

  return <div>{/* Render data */}</div>;
}
```

**Why Server Components?**
- ✅ Faster (no JavaScript sent to client)
- ✅ Better SEO
- ✅ Direct database access
- ✅ Secure (secrets stay on server)

---

## 🔄 When to Use 'use client'

**Add `'use client'` ONLY when you need:**

### 1. React Hooks

```tsx
'use client'

import { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);  // ← Needs 'use client'
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Event Handlers

```tsx
'use client'

export function Button() {
  const handleClick = () => {  // ← Needs 'use client'
    console.log('Clicked');
  };
  return <button onClick={handleClick}>Click</button>;
}
```

### 3. Browser APIs

```tsx
'use client'

export function Component() {
  useEffect(() => {
    // ← Needs 'use client'
    window.addEventListener('resize', handleResize);
  }, []);
}
```

### 4. Context Providers/Consumers

```tsx
'use client'

import { useAuth } from '@/contexts/auth-context';

export function UserMenu() {
  const { user } = useAuth();  // ← Needs 'use client'
  return <div>{user?.name}</div>;
}
```

---

## 📁 App Router Structure

```
app/
├── (auth)/                    # ✅ Route group (doesn't affect URL)
│   ├── layout.tsx            # Layout for auth pages
│   ├── login/
│   │   └── page.tsx          # /login
│   └── register/
│       └── page.tsx          # /register
│
├── (marketing)/               # ✅ Route group (public pages)
│   ├── layout.tsx
│   ├── page.tsx              # / (homepage)
│   └── about/
│       └── page.tsx          # /about
│
├── dashboard/                 # ✅ Protected routes
│   ├── layout.tsx
│   ├── page.tsx              # /dashboard
│   └── cases/
│       ├── page.tsx          # /dashboard/cases
│       └── [id]/
│           └── page.tsx      # /dashboard/cases/:id (dynamic)
│
├── api/                       # ✅ API routes
│   └── cases/
│       └── route.ts          # /api/cases
│
├── layout.tsx                 # ✅ Root layout
└── not-found.tsx             # ✅ 404 page
```

**File naming conventions:**
- `page.tsx` - Page component (required for route)
- `layout.tsx` - Layout wrapper
- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 UI
- `route.ts` - API route handler

---

## 🗂️ Data Fetching

### Server Component (Preferred)

```tsx
// ✅ PREFERRED - Fetch in Server Component
// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: cases } = await supabase.from('cases').select('*');

  return <CaseList cases={cases} />;
}
```

**Benefits:**
- No loading state needed
- No useEffect needed
- Faster initial page load
- Better SEO

---

### Client Component (When Needed)

```tsx
// ✅ Client Component - For interactive data
'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function CaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCases() {
      const { data } = await supabase.from('cases').select('*');
      setCases(data || []);
      setLoading(false);
    }
    fetchCases();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render cases */}</div>;
}
```

---

### Parallel Data Fetching

```tsx
// ✅ Fetch multiple resources in parallel
export default async function Page() {
  // These run in parallel
  const [cases, users, documents] = await Promise.all([
    supabase.from('cases').select('*'),
    supabase.from('users').select('*'),
    supabase.from('documents').select('*'),
  ]);

  return <Dashboard cases={cases} users={users} docs={documents} />;
}
```

---

## 🔧 API Routes (Route Handlers)

### Basic Route Handler

```typescript
// app/api/cases/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('cases')
    .select('*');

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate with Zod
  const validated = caseSchema.parse(body);

  const { data, error } = await supabase
    .from('cases')
    .insert(validated)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}
```

### Dynamic Routes

```typescript
// app/api/cases/[id]/route.ts
interface Params {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { id } = params;

  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: 'Case not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
```

---

## 🎨 Layouts & Templates

### Root Layout

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {/* Global providers, fonts, etc. */}
        {children}
      </body>
    </html>
  );
}
```

### Nested Layout

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

---

## 🔀 Loading & Error States

### Loading UI

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <LoadingSpinner />;
}
```

### Error UI

```tsx
// app/dashboard/error.tsx
'use client'  // Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

---

## 🔍 SEO & Metadata

### Static Metadata

```tsx
// app/dashboard/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Formelio',
  description: 'Manage your legal cases',
};

export default function DashboardPage() {
  return <div>Dashboard</div>;
}
```

### Dynamic Metadata

```tsx
// app/cases/[id]/page.tsx
import type { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: case } = await supabase
    .from('cases')
    .select('title')
    .eq('id', params.id)
    .single();

  return {
    title: `${case?.title} - Formelio`,
  };
}

export default function CasePage({ params }: Props) {
  return <div>Case {params.id}</div>;
}
```

---

## 🚀 Performance Optimizations

### Image Optimization

```tsx
import Image from 'next/image';

// ✅ ALWAYS use next/image
<Image
  src="/logo.png"
  alt="Formelio logo"
  width={200}
  height={100}
  priority  // For above-the-fold images
/>
```

### Dynamic Imports

```tsx
import dynamic from 'next/dynamic';

// ✅ Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false,  // Skip SSR if not needed
});
```

### Route Caching

```tsx
// ✅ Revalidate data every hour
export const revalidate = 3600;

export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 },
  });
  return <div>{/* Render */}</div>;
}
```

---

## 📋 Pre-Commit Next.js Checklist

Before committing:

- [ ] Server Components used by default
- [ ] `'use client'` only added when necessary
- [ ] No client-only code in Server Components
- [ ] Proper file naming (`page.tsx`, `layout.tsx`, etc.)
- [ ] Metadata defined for SEO
- [ ] Images use `next/image`
- [ ] Loading/error states handled
- [ ] API routes validate input (Zod)

---

## 🔗 Related Rules

- **Architecture**: [ARCHITECTURE_RULES.md](./ARCHITECTURE_RULES.md)
- **TypeScript**: [TYPESCRIPT_RULES.md](./TYPESCRIPT_RULES.md)
- **Supabase**: [SUPABASE_RULES.md](./SUPABASE_RULES.md)
- **HTML Semantic**: [HTML_SEMANTIC_RULES.md](./HTML_SEMANTIC_RULES.md)
- **Main Rules**: [../CLAUDE.md](../CLAUDE.md)

---

## 📚 Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
