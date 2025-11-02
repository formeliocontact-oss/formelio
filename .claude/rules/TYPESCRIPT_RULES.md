# TypeScript Rules - Strict Typing & Type Safety

**Version**: 2.0
**Focus**: Strict typing, NO `any` without documentation

---

## 🚨 ABSOLUTE PROHIBITIONS

### ❌ NO `any` Type (Default Rule)

**The `any` type is FORBIDDEN by default.**

**Why?**
- Defeats the purpose of TypeScript
- Hides bugs at compile time
- Makes refactoring dangerous
- Breaks IntelliSense/autocomplete

```typescript
// ❌ FORBIDDEN
const data: any = fetchData();
const result: any = processData();
function doSomething(param: any) { ... }

// ❌ FORBIDDEN - Escape hatches
const value = someValue as any;
// @ts-ignore
const unsafe = dangerousOperation();
```

---

## ✅ The ONLY Exception: Documented `any`

**`any` is ALLOWED only if ALL conditions are met:**

1. ✅ There is a **legitimate technical reason** (see below)
2. ✅ The reason is **documented in code** (see format below)
3. ✅ Alternative solutions were **tried and failed**
4. ✅ There is a **plan to remove it** (if temporary)

### Documentation Format (MANDATORY)

```typescript
// ✅ ACCEPTABLE - Properly documented `any`
const data: any = legacyExternalAPI.getData();
/*
 * JUSTIFICATION FOR `any` TYPE:
 * - External API (legacy-system v1.2) has no TypeScript definitions
 * - Vendor does not provide @types package
 * - API returns 100+ different response shapes (polymorphic)
 *
 * ALTERNATIVES TRIED:
 * - Manual typing: Too complex, 100+ fields change weekly
 * - Code generation: API has no OpenAPI spec
 * - unknown + type guards: Performance issues (called 1000x/sec)
 *
 * MIGRATION PLAN:
 * - Task: P2-24 - Migrate to vendor API v2 (has TypeScript support)
 * - Timeline: Q2 2025 when vendor releases v2
 * - Temporary measure until then
 *
 * APPROVED BY: [Tech Lead Name] on [Date]
 * REVIEW DATE: Jan 2025
 */
```

**Minimum required fields**:
- `JUSTIFICATION`: Why `any` is needed
- `ALTERNATIVES TRIED`: What else you attempted
- `MIGRATION PLAN` or `PERMANENT REASON`: Path forward
- `APPROVED BY`: Who approved this exception

---

## ✅ CORRECT ALTERNATIVES to `any`

### 1. Use `unknown` + Type Guards

```typescript
// ❌ WRONG
const data: any = await fetch('/api').then(r => r.json());
console.log(data.user.name);  // No type safety

// ✅ CORRECT
const data: unknown = await fetch('/api').then(r => r.json());

// Type guard
function isUserData(data: unknown): data is { user: { name: string } } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'user' in data &&
    typeof (data as any).user === 'object' &&
    'name' in (data as any).user
  );
}

if (isUserData(data)) {
  console.log(data.user.name);  // ✅ Type-safe
}
```

### 2. Use Zod for Runtime Validation

```typescript
// ❌ WRONG
const userData: any = externalAPI.getUser();

// ✅ CORRECT
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
});

type User = z.infer<typeof UserSchema>;

const rawData: unknown = externalAPI.getUser();
const userData: User = UserSchema.parse(rawData);
// ✅ Type-safe + runtime validation
```

### 3. Use Generics for Flexible Types

```typescript
// ❌ WRONG
function wrapInArray(value: any): any[] {
  return [value];
}

// ✅ CORRECT
function wrapInArray<T>(value: T): T[] {
  return [value];
}

const nums = wrapInArray(42);      // Type: number[]
const strs = wrapInArray("hello"); // Type: string[]
```

### 4. Use Union Types

```typescript
// ❌ WRONG
function process(value: any) { ... }

// ✅ CORRECT
function process(value: string | number | boolean) { ... }
```

### 5. Use `Record<string, unknown>` for Objects

```typescript
// ❌ WRONG
const config: any = loadConfig();

// ✅ CORRECT
const config: Record<string, unknown> = loadConfig();

// Then narrow types as needed
if (typeof config.apiKey === 'string') {
  const apiKey: string = config.apiKey;
}
```

---

## 📋 tsconfig.json (Required Configuration)

```json
{
  "compilerOptions": {
    // Strict mode (ALL flags enabled)
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "strictBindCallApply": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Additional strictness
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,

    // Modern TypeScript
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": false,
    "checkJs": false,

    // Next.js specific
    "jsx": "preserve",
    "incremental": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,

    // Paths
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## 🎯 Type Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Interface** | PascalCase | `interface UserProfile { ... }` |
| **Type Alias** | PascalCase | `type Status = 'active' \| 'inactive'` |
| **Enum** | PascalCase (singular) | `enum UserRole { Admin, User }` |
| **Generic** | Single capital letter or PascalCase | `<T>` or `<TData>` |
| **Const Assertion** | SCREAMING_SNAKE_CASE + `as const` | `const COLORS = {...} as const` |

---

## 🔧 Common Patterns

### Explicit Function Types

```typescript
// ❌ WRONG - Implicit return type
function getUser(id: string) {
  return db.users.find(id);
}

// ✅ CORRECT - Explicit return type
function getUser(id: string): Promise<User | null> {
  return db.users.find(id);
}

// ✅ CORRECT - Explicit param and return types
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
```

### Const Assertions for Constants

```typescript
// ❌ WRONG - Inferred as string
const STATUS = 'pending';
type Status = typeof STATUS;  // Type: string (too broad)

// ✅ CORRECT - as const for literal type
const STATUS = 'pending' as const;
type Status = typeof STATUS;  // Type: "pending" (exact)

// ✅ CORRECT - Object with as const
const CASE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

type CaseStatus = typeof CASE_STATUS[keyof typeof CASE_STATUS];
// Type: "pending" | "in_progress" | "completed"
```

### Non-Null Assertions (Use Sparingly)

```typescript
// ⚠️ CAUTION - Only use if you're 100% certain
const user = users.find(u => u.id === id)!;
//                                        ^ Non-null assertion

// ✅ BETTER - Explicit check
const user = users.find(u => u.id === id);
if (!user) {
  throw new Error('User not found');
}
// user is guaranteed non-null here
```

---

## ✅ Pre-Commit TypeScript Checklist

Before committing:

- [ ] NO `any` types (or properly documented if exception)
- [ ] NO `@ts-ignore` comments
- [ ] NO `as any` casts
- [ ] All function params have explicit types
- [ ] All function returns have explicit types
- [ ] `npm run type-check` passes with ZERO errors
- [ ] NO implicit `any` warnings

---

## 🔗 Related Rules

- **Architecture**: [ARCHITECTURE_RULES.md](./ARCHITECTURE_RULES.md)
- **Supabase**: [SUPABASE_RULES.md](./SUPABASE_RULES.md)
- **Next.js**: [NEXTJS_RULES.md](./NEXTJS_RULES.md)
- **Main Rules**: [../CLAUDE.md](../CLAUDE.md)
