# Wasp App

This project uses TypeScript and Wasp, a batteries-included framework for building full-stack web apps with React, Node.js, and Prisma.

## Accessing Wasp Knowledge

Use the raw text docs URL: https://wasp.sh/llms.txt (latest) or https://wasp.sh/llms-{version}.txt (versioned)

## Start the Dev Servers

IMPORTANT! Start all servers as *background tasks* in this Claude Code session to access dev server logs. See the **CLI Reference** docs section for commands.

The chrome-devtools mcp server can be used to access the client app console in the browser.

## Starter Templates

Wasp can scaffold various boilerplate starter apps:
```bash
wasp new
```

See the **Starter Templates** docs section for more details.

## Project Structure

```
.
├── .wasp/                    # Wasp output **DO NOT EDIT!**
├── public/                   # Static assets
├── src/                      # Feature code: server `operations.ts` and client `pages.tsx` files
├── main.wasp or main.wasp.ts # App definition: routes, pages, auth, operations, jobs, etc.
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

## Project Setup & Customization

- Wasp provides layers of customization on top of the tools it uses (vite, expressjs, react-query, client and server setup, etc.): see the **Project Setup & Customization** docs section.

## Advanced Features

Wasp provides **advanced features**:
- custom HTTP API endpoints
- background (cron) jobs
- type-safe links
- websockets
- middleware
- email sending

See the **Advanced Features** docs section for more details.

## Import Conventions

**In TypeScript files:**
- ✅ `import type { User } from 'wasp/entities'`
- ✅ `import type { GetTasks } from 'wasp/server/operations'`
- ✅ `import { getTasks, createTask, useQuery } from 'wasp/client/operations'`
- ✅ `import { SubscriptionStatus } from '@prisma/client'` (for Prisma enums)
- ✅ Local code: relative paths `import { X } from './X'`
- ❌ Never `@wasp/...` or `@src/...`
- ⚠️ Call actions directly using `async/await`. DO NOT use Wasp's `useAction` hook unless optimistic updates are needed.

**In main.wasp:**
- ✅ `fn: import { getTasks } from "@src/tasks/operations.ts"`
- ❌ Never relative paths

**In main.wasp.ts:**
See the **TypeScript Config** docs section for more details.

## Common Mistakes

| Symptom | Fix |
|---------|-----|
| `context.entities.X undefined` | Add entity to `entities: [...]` in main.wasp |
| Schema changes not applying | Run `wasp db migrate-dev` |
| Types stale after changes | Restart TS server |
| Wasp not recognizing changes | **WAIT PATIENTLY** as Wasp recompiles the project. Re-run `wasp start` if necessary.|
| Persistent weirdness after waiting patiently and restarting. | Run `wasp clean` && `wasp start` |
