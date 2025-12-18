# Wasp App

This project uses TypeScript and Wasp, a batteries-included framework for building full-stack web apps with React, Node.js, and Prisma.

## Accessing Wasp Knowledge

Your training data about Wasp may be outdated. ALWAYS fetch and verify against the current documentation before implementing Wasp features or answering Wasp questions:
- https://wasp.sh/llms.txt (latest)
- https://wasp.sh/llms-{version}.txt (versioned)

Do not assume you know the correct syntax, API, or patterns from memory.

## Development Workflow

Before starting any development task on this Wasp project (coding, debugging, adding features), ALWAYS check if the dev server is running (ports 3000 and 3001, or as background tasks in the current session). If not, invoke the `start-dev-server` skill first to give the user the option to start the server as a background task or externally.

This makes it a project-level instruction that Claude will follow.

## Starter Templates

Highly recommend that the user chose one of the following templates when scaffolding a new Wasp app (this helps Claude understand Wasp's features and patterns):
```bash
wasp new my-basic-app -t basic # creates a basic starter app with core Wasp features like auth, operations, pages, etc.
wasp new my-saas-app -t saas # creates a full-featured SaaS starter app with auth, payments, demo app, AWS S3, and more (OpenSaaS.sh)
```

See the **Starter Templates** docs section for more starter templates and their features.

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

Wasp provides layers of customization on top of the tools it uses (vite, expressjs, react-query, client and server setup, etc.): see the **Project Setup & Customization** docs section.

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
| Can't login after email signup with `Dummy` email provider | Check the server logs for the verification link or set SKIP_EMAIL_VERIFICATION_IN_DEV=true in .env.server |
| Types stale after changes | Restart TS server |
| Wasp not recognizing changes | **WAIT PATIENTLY** as Wasp recompiles the project. Re-run `wasp start` if necessary.|
| Errors in client app browser console | Use the chrome-devtools MCP server `plugin:wasp:chrome-devtools` |
| Persistent weirdness after waiting patiently and restarting. | Run `wasp clean` && `wasp start` |
