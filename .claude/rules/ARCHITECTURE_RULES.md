# Architecture Rules - Anti-Duplication & Code Organization

**Version**: 2.0
**Focus**: Prevent Parallel Architectures & Code Duplication

---

## 🚨 The Golden Rule

**NEVER CREATE PARALLEL ARCHITECTURES**

Before writing ANY new code, you MUST:
1. ✅ **SEARCH** for existing similar functionality
2. ✅ **REUSE** or **EXTEND** existing code
3. ✅ **REFACTOR** if needed to make code reusable
4. ❌ **NEVER** create a second implementation

---

## 🔍 MANDATORY SEARCH WORKFLOW

### Before Creating ANY File/Function/Component

**Step 1: Search the codebase**

```bash
# Search for similar functionality
rg "functionName" --type ts --type tsx
rg "ComponentName" components/
rg "use[A-Z].*keyword" hooks/
rg ".*Service" lib/services/
```

**Step 2: Check standard locations** (see table below)

**Step 3: Decision**
- ✅ **Found similar code?** → REUSE or EXTEND it
- ✅ **Found nothing?** → Create in STANDARD location only
- ❌ **NEVER** create in a different location "just because"

---

## 📍 CANONICAL LOCATIONS (One True Way)

**Use ONLY these locations. NO alternatives allowed.**

| What You're Creating | Where It Goes | Example | Search Command |
|---------------------|---------------|---------|----------------|
| **React Component** (feature) | `components/features/[domain]/[name].tsx` | `components/features/cases/case-card.tsx` | `rg "ComponentName" components/features/` |
| **React Component** (shared UI) | `components/ui/[name].tsx` | `components/ui/button.tsx` | `rg "ComponentName" components/ui/` |
| **Form Component** | `components/forms/[name]-form.tsx` | `components/forms/case-form.tsx` | `rg "Form" components/forms/` |
| **Layout Component** | `components/layouts/[name]-layout.tsx` | `components/layouts/dashboard-layout.tsx` | `rg "Layout" components/layouts/` |
| **Custom Hook** | `hooks/use-[domain]-[action].ts` | `hooks/use-case-update.ts` | `rg "use[A-Z]" hooks/` |
| **Business Logic Service** | `lib/services/[domain]-service.ts` | `lib/services/case-service.ts` | `rg "Service" lib/services/` |
| **API Client Function** | `lib/api/[domain].ts` | `lib/api/cases.ts` | `rg "export.*function" lib/api/` |
| **Utility Function** | `lib/utils/[domain]-utils.ts` | `lib/utils/date-utils.ts` | `rg "export.*function" lib/utils/` |
| **Type Definition** | `types/[domain].ts` | `types/case.ts` | `rg "interface\|type" types/` |
| **Zod Schema** | `lib/validations/[domain].ts` | `lib/validations/case.ts` | `rg "z\.object" lib/validations/` |
| **Constant** | `lib/constants.ts` or `lib/[domain]-constants.ts` | `lib/case-constants.ts` | `rg "const.*=.*as const" lib/` |
| **Supabase Client** | `lib/supabase/[client\|server\|middleware].ts` | `lib/supabase/client.ts` | Fixed files |
| **Test File** | Next to source: `[name].test.ts(x)` | `case-card.test.tsx` | `rg "describe\|test\|it" --type test` |

---

## 🌳 Decision Trees

### "I need to fetch/update data..."

```
START
  │
  ├─ Is it a SERVER COMPONENT?
  │   YES → Fetch directly in component (no function needed)
  │   NO  ↓
  │
  ├─ Is it CLIENT-SIDE with complex logic?
  │   YES → Create/use custom hook in `hooks/use-[domain]-[action].ts`
  │   NO  ↓
  │
  └─ Simple API call?
      → Create/use function in `lib/api/[domain].ts`
```

### "I need to create a component..."

```
START
  │
  ├─ Is it a Shadcn UI component?
  │   YES → `components/ui/[name].tsx`
  │   NO  ↓
  │
  ├─ Is it a form?
  │   YES → `components/forms/[name]-form.tsx`
  │   NO  ↓
  │
  ├─ Is it a layout?
  │   YES → `components/layouts/[name]-layout.tsx`
  │   NO  ↓
  │
  └─ Is it feature-specific?
      YES → `components/features/[domain]/[name].tsx`
```

### "I need to add business logic..."

```
START
  │
  ├─ Is it React-specific (uses hooks)?
  │   YES → Custom hook in `hooks/use-[domain]-[action].ts`
  │   NO  ↓
  │
  ├─ Is it pure utility (no state, no side effects)?
  │   YES → Function in `lib/utils/[domain]-utils.ts`
  │   NO  ↓
  │
  └─ Complex business logic?
      → Service class/functions in `lib/services/[domain]-service.ts`
```

---

## ❌ ANTI-PATTERNS (What NOT to Do)

### 🔴 Pattern 1: Parallel Implementations

```typescript
// ❌ WRONG: Two places doing the same thing
// File: lib/api/users.ts
export async function createUser(data: UserData) { ... }

// File: lib/services/user-service.ts
export async function createUser(data: UserData) { ... }

// 🚨 PROBLEM: Which one is the source of truth?
```

**Fix**:
```typescript
// ✅ CORRECT: One implementation, one location
// File: lib/services/user-service.ts
export async function createUser(data: UserData) { ... }

// File: lib/api/users.ts (if needed at all)
// Re-export or don't create this file
export { createUser } from '@/lib/services/user-service';
```

### 🔴 Pattern 2: Copy-Paste Components

```typescript
// ❌ WRONG: Copied component with minor changes
// File: components/user-card.tsx
export function UserCard({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => { /* logic */ };
  return <Card>...</Card>
}

// File: components/profile-card.tsx
export function ProfileCard({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => { /* logic */ };
  return <Card>...</Card>  // 95% identical
}
```

**Fix**:
```typescript
// ✅ CORRECT: Extract shared logic to hook
// File: hooks/use-user-update.ts
export function useUserUpdate(userId: string) {
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => { /* logic */ };
  return { loading, handleUpdate };
}

// File: components/user-card.tsx
export function UserCard({ user }: { user: User }) {
  const { loading, handleUpdate } = useUserUpdate(user.id);
  return <Card>...</Card>
}

// File: components/profile-card.tsx
export function ProfileCard({ user }: { user: User }) {
  const { loading, handleUpdate } = useUserUpdate(user.id);
  return <Card>...</Card>  // Reuses hook
}
```

### 🔴 Pattern 3: Random File Locations

```typescript
// ❌ WRONG: Files scattered everywhere
utils/date.ts              // ← Why "utils" folder?
helpers/date-helper.ts     // ← Different folder name
lib/utils/dates.ts         // ← Inconsistent naming
lib/date-utils.ts          // ← Another location

// 🚨 PROBLEM: Which one should I use? Are they different?
```

**Fix**:
```typescript
// ✅ CORRECT: One canonical location
lib/utils/date-utils.ts    // ← THE location for date utilities

// All date functions go here
export function formatDate(date: Date): string { ... }
export function parseDate(str: string): Date { ... }
```

---

## 🔧 Refactoring Guide

### When You Find Duplicate Code

**Step 1: Identify the duplication**
```bash
rg "function handleSubmit" --type tsx
# If you see 3+ similar implementations → refactor needed
```

**Step 2: Extract to appropriate location**

For **state + logic** → Custom hook
```typescript
// hooks/use-form-submit.ts
export function useFormSubmit() {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    // Common logic
    setLoading(false);
  };
  return { loading, handleSubmit };
}
```

For **pure logic** → Utility function
```typescript
// lib/utils/form-utils.ts
export function validateFormData(data: FormData): boolean {
  // Pure validation logic
}
```

**Step 3: Replace all occurrences**
- Update all files using the duplicate code
- Remove old implementations
- Add single import

**Step 4: Document the refactoring**
```typescript
// REFACTORED: Consolidated 3 duplicate implementations
// into useFormSubmit hook (P2-15, Oct 2025)
```

---

## 📏 File Organization Rules

### Max File Sizes (Hard Limits)

- **Components**: 150 lines (ideal), 300 lines (max)
- **Hooks**: 100 lines (ideal), 200 lines (max)
- **Utils**: 200 lines (ideal), 400 lines (max)
- **Services**: 200 lines (ideal), 500 lines (max)

**If file approaches max** → Split it:
1. Extract sub-components
2. Extract utility functions
3. Extract types to `types/`
4. Extract constants to `constants.ts`

### One Responsibility Per File

```typescript
// ❌ WRONG: God file doing everything
// lib/user-everything.ts
export function createUser() { ... }
export function deleteUser() { ... }
export function UserCard() { ... }
export const USER_ROLES = { ... }
export type User = { ... }

// ✅ CORRECT: Separated by responsibility
// lib/services/user-service.ts → Business logic
export function createUser() { ... }
export function deleteUser() { ... }

// components/features/users/user-card.tsx → UI
export function UserCard() { ... }

// lib/constants.ts → Constants
export const USER_ROLES = { ... }

// types/user.ts → Types
export type User = { ... }
```

---

## ✅ Pre-Creation Checklist

Before creating ANY new file, verify:

- [ ] **Searched for similar code** (using rg/grep)
- [ ] **Checked standard location table** above
- [ ] **No duplicate implementation exists**
- [ ] **Using canonical location** (not creating alternative)
- [ ] **File will be < 300 lines** (or have plan to split)
- [ ] **One clear responsibility** (not mixing concerns)
- [ ] **Documented why it's new** (if creating new pattern)

---

## 🔗 Related Rules

- **TypeScript**: [TYPESCRIPT_RULES.md](./TYPESCRIPT_RULES.md)
- **Supabase**: [SUPABASE_RULES.md](./SUPABASE_RULES.md)
- **Next.js**: [NEXTJS_RULES.md](./NEXTJS_RULES.md)
- **Main Rules**: [../CLAUDE.md](../CLAUDE.md)

---

**Remember**: "One way to do things" is better than "many ways to do the same thing"
