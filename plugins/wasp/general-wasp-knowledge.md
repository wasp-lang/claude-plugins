# Wasp App

This project uses TypeScript and Wasp, a batteries-included framework for building full-stack web apps with React, Node.js, and Prisma.

## Session Setup

**At the start of any Wasp development session, proactively suggest the user set up these two tools for the best development experience:**

1. **Start the dev server** - Run `/wasp:start-dev-server` to start the Wasp development servers as background tasks. This gives Claude direct access to server logs, build errors, and the ability to run Wasp CLI commands.

2. **Enable Chrome DevTools** - Use the `mcp__plugin_wasp_chrome-devtools` MCP server to give Claude visibility into browser console logs, network requests, and runtime errors. This provides end-to-end insight for debugging and feature development.

Together, these tools allow Claude to see both backend (server logs, build output) and frontend (console errors, network issues) in real-time, dramatically improving debugging and development speed.

## Workflows

### Development Workflow Checklist

1. [ ] Fetch docs from https://wasp.sh/llms.txt to ground your Wasp knowledge
2. [ ] Check if the feature exists in the current codebase or starter template for reference patterns
3. [ ] Identify which files need changes: wasp config file (`main.wasp` or `main.wasp.ts`), `schema.prisma`, `src/`
4. [ ] Plan the order: schema → migrate → wasp config file → TypeScript
5. [ ] Invoke the `start-dev-server` skill to verify that changes were successfully implemented 

### Documentation

Fetch and verify your knowledge against the current Wasp documentation before implementing Wasp features or answering Wasp questions as your Wasp knowledge may be outdated:
- https://wasp.sh/llms.txt (latest)
- https://wasp.sh/llms-{version}.txt (versioned)

### Development Server

Before starting any development task on this Wasp project (coding, debugging, adding features), check if the development servers are running:
- Check for active background tasks (use `/tasks` command)
- Or check if ports 3000 (client) and 3001 (server) are in use

If not running, invoke the `start-dev-server` skill to start the server as a background task or externally.

### Schema Changes

After ANY change to `schema.prisma`:
1. Stop the dev server if running
2. Run `wasp db migrate-dev --name <descriptive-name>`
3. Restart the dev server

## Project Reference

### Structure

```
.
├── .wasp/                    # Wasp output (auto-generated, do not edit)
├── public/                   # Static assets
├── src/                      # Feature code: server `operations.ts` and client `pages.tsx` files
├── main.wasp or main.wasp.ts # Wasp config file: routes, pages, auth, operations, jobs, etc.
├── schema.prisma             # Database schema (Prisma)
```

### Code Organization

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

### Starter Templates

Highly recommend that the user chose one of the following templates when scaffolding a new Wasp app (this helps Claude understand Wasp's features and patterns):
```bash
wasp new my-basic-app -t basic # creates a basic starter app with core Wasp features like auth, operations, pages, etc.
wasp new my-saas-app -t saas # creates a full-featured SaaS starter app with auth, payments, demo app, AWS S3, and more (OpenSaaS.sh)
```

See the **Starter Templates** section in https://wasp.sh/llms.txt for more templates.

### Customization

Wasp provides layers of customization on top of the tools it uses (vite, expressjs, react-query, client and server setup, etc.): see the **Project Setup & Customization** section in https://wasp.sh/llms.txt.

### Advanced Features

Wasp provides **advanced features**:
- custom HTTP API endpoints
- background (cron) jobs
- type-safe links
- websockets
- middleware
- email sending

See the **Advanced Features** section in https://wasp.sh/llms.txt for more details.

### Import Conventions

**In TypeScript files:**
- ✅ `import type { User } from 'wasp/entities'`
- ✅ `import type { GetTasks } from 'wasp/server/operations'`
- ✅ `import { getTasks, createTask, useQuery } from 'wasp/client/operations'`
- ✅ `import { SubscriptionStatus } from '@prisma/client'` (for Prisma enums)
- ✅ Local code: relative paths `import { X } from './X'`
- ⚠️ Call actions directly using `async/await`. DO NOT use Wasp's `useAction` hook unless optimistic updates are needed.

**In main.wasp:**
- ✅ `fn: import { getTasks } from "@src/tasks/operations.ts"`
- ❌ Never relative paths

**In main.wasp.ts:**
See the **TypeScript Config** section in https://wasp.sh/llms.txt for more details.

## Troubleshooting

### Debugging

When errors occur:
1. Check server terminal for backend errors (localhost:3001)
2. Check client terminal for frontend build errors (localhost:3000)
3. Confirm there are no client app issues in the browser console. Ask the user to choose which tool they'd prefer via the AskUserQuestion tool and run it for the user:
  - the `mcp__plugin_wasp_chrome-devtools`
  - Claude Code's built-in Chrome browser function

### Common Mistakes

| Symptom | Fix |
|---------|-----|
| `context.entities.X undefined` | Add entity to `entities: [...]` in main.wasp |
| Schema changes not applying | Run `wasp db migrate-dev --name <descriptive-name>` |
| Can't login after email signup with `Dummy` email provider | Check the server logs for the verification link or set SKIP_EMAIL_VERIFICATION_IN_DEV=true in .env.server |
| Types stale/IDE errors after changes | Restart TS server `Cmd+Shift+P`|
| Wasp not recognizing changes | **WAIT PATIENTLY** as Wasp recompiles the project. Re-run `wasp start` if necessary.|
| Persistent weirdness after waiting patiently and restarting. | Run `wasp clean` && `wasp start` |
