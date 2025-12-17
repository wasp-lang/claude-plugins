# Wasp App

This project uses TypeScript and Wasp, a batteries-included framework for building full-stack web apps with React, Node.js, and Prisma.

## Accessing Wasp Knowledge

Use the raw text docs URL: https://wasp.sh/llms.txt (latest) or https://wasp.sh/llms-{version}.txt (versioned)

## Start the Dev Servers

IMPORTANT! Start all servers as *background tasks* in this Claude Code session to access dev server logs:
```bash
wasp start db # starts a managed Postgres database -- must have docker installed. (not needed for SQLite)
wasp db migrate-dev --name <migration-name> # always run database migrations using --name <migration-name> to avoid lagging migrations.
wasp start # starts the wasp dev server (server and client apps run in parallel)
```
See the **CLI Reference** docs section for more commands.

The chrome-devtools MCP server can be used to check logs and errors in the client app browser console, e.g.:
```
plugin:wasp:chrome-devtools - navigate_page (MCP)(type: "url", url: "http://localhost:3000")
plugin:wasp:chrome-devtools - list_console_messages (MCP)
```

## Starter Templates

Wasp can scaffold various boilerplate starter apps:
```bash
wasp new my-basic-app -t basic # creates a basic starter app with core Wasp features
wasp new my-saas-app -t saas # creates a SaaS starter app with auth, payments, AWS S3, and more (OpenSaaS.sh)
```

See the **Starter Templates** docs section for all available starter templates and their features.

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
| Errors in client app browser console | Use the chrome-devtools MCP server `plugin:wasp:chrome-devtools` |
| Persistent weirdness after waiting patiently and restarting. | Run `wasp clean` && `wasp start` |
