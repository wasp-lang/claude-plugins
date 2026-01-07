---
globs: ["src/**/*.ts", "src/**/*.tsx"]
---
# TypeScript Conventions for Wasp

## Imports

- `import type { User } from 'wasp/entities'`
- `import type { GetTasks } from 'wasp/server/operations'`
- `import { getTasks, createTask, useQuery } from 'wasp/client/operations'`
- `import { SubscriptionStatus } from '@prisma/client'` (for Prisma enums)
- Local code: relative paths `import { X } from './X'`

## Operations

Call actions directly using `async/await`. DO NOT use Wasp's `useAction` hook unless optimistic updates are needed.
