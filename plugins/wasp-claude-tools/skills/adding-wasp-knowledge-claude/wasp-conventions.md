# Wasp Development Conventions & Gotchas

A comprehensive reference of Wasp framework conventions, common mistakes, and best practices.

## 1. Import Conventions

### In TypeScript/JavaScript Files

**Correct Patterns:**
```typescript
// Entity types (available on client & server)
import type { User, Task } from 'wasp/entities'

// Operation types (for typing implementations)
import type { GetTasks, CreateTask } from 'wasp/server/operations'

// Client-side queries (used within the useQuery hook for automatic cache invalidation)
import { getTasks, getTasksFiltered, useQuery } from 'wasp/client/operations'

// Client-side actions called directly with await
import { createTask } from 'wasp/client/operations'

// Server-side operations (for calling from other server code or other operations)
import { getTasks } from 'wasp/server/operations'

// Prisma client (server only)
import { prisma } from 'wasp/server'

// Prisma enums
import { SubscriptionStatus } from '@prisma/client'

// Auth hooks & UI
import { useAuth, logout } from 'wasp/client/auth'
import { LoginForm, SignupForm } from 'wasp/client/auth'

// API client (for custom API routes)
import { api } from 'wasp/client/api'

// HttpError for user-facing errors
import { HttpError } from 'wasp/server'

// Local code: use relative paths
import { myHelper } from './helpers'
import { MyComponent } from '../components/MyComponent'
```

**Incorrect Patterns:**
```typescript
// NEVER use these in TypeScript files:
import { X } from '@wasp/...'      // ❌ Old syntax, deprecated
import { X } from '@src/...'       // ❌ Only valid in main.wasp
import { X } from 'wasp/core/...'  // ❌ Internal paths
```

### In main.wasp

**Correct Patterns:**
```wasp
// External imports use @src prefix
query getTasks {
  fn: import { getTasks } from "@src/tasks/operations",
  entities: [Task]
}

page MainPage {
  component: import { MainPage } from "@src/pages/MainPage"
}
```

**Incorrect Patterns:**
```wasp
// NEVER use relative paths in main.wasp:
fn: import { getTasks } from "./tasks/operations"  // ❌
fn: import { getTasks } from "../operations"       // ❌
```

### In main.wasp.ts (TypeScript Config)

```typescript
// Uses standard TypeScript imports
import { App } from 'wasp-config'

// Define app configuration programmatically
export default new App({
  // ...
})
```

## 2. Operation Conventions (Queries & Actions)

### Queries vs Actions

| Queries | Actions |
|---------|---------|
| Read-only, side-effect free | Create, update, delete data |
| Use `useQuery` hook for reactivity | Call directly with `await` |
| Cached automatically | Invalidate related query caches |

ONLY use the `useAction` hook when you need optimistic updates!

```wasp
page DashboardPage {
  authRequired: true,  // Redirects to onAuthFailedRedirectTo if not logged in
  component: import { Dashboard } from "@src/pages/Dashboard"
}
```


```typescript
// In operations (server)
export const getTasks: GetTasks<void, Task[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authenticated')
  }
  // context.user available
}

// On client
import { useAuth } from 'wasp/client/auth'

function MyComponent() {
  const { data: user, isLoading } = useAuth()
  if (!user) return <LoginPrompt />
}

// Logout
import { logout } from 'wasp/client/auth'
await logout()
```



```prisma
// Model names: PascalCase
// Field names: camelCase
model Task {
  id          Int      @id @default(autoincrement())
  description String
  isDone      Boolean  @default(false)
  createdAt   DateTime @default(now())
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
}

model User {
  id    Int    @id @default(autoincrement())
  tasks Task[]
}
```



## 3. File & Naming Conventions

### Project Structure

```
.
├── .wasp/                    # Wasp output (do not edit!)
├── public/                   # Static assets
├── src/                      # Feature code
├── main.wasp or main.wasp.ts # App definition
├── schema.prisma             # Database schema
```

### Organization Principle

Organize by **feature** (vertical), not by type (client/server):

```
src/
├── tasks/
│   ├── TasksPage.tsx      # Page component
│   ├── TaskList.tsx       # Component
│   └── operations.ts      # Queries & actions
├── auth/
│   ├── LoginPage.tsx
│   └── google.ts
```
