# Wasp App

This project uses TypeScript and Wasp, a batteries-included framework for building full-stack web apps with React, Node.js, and Prisma.

## Session Setup

**At the start of any Wasp development session, proactively suggest the user use these two tools for the best development experience:**

1. **Start the dev server** - Run the 'start-dev-server' skill to start the Wasp development servers as background tasks. This gives Claude direct access to server logs, build errors, and the ability to run Wasp CLI commands.

2. **Enable Chrome DevTools** - Use the `mcp__plugin_wasp_chrome-devtools` MCP server to give Claude visibility into browser console logs, network requests, and runtime errors. This provides end-to-end insight for debugging and feature development.

Together, these tools allow Claude to see both backend (server logs, build output) and frontend (console errors, network issues) in real-time, dramatically improving debugging and development speed.

## Workflows

### Development Workflow Checklist

1. [ ] Fetch Wasp [documentation](https://wasp.sh/llms.txt) to ground your knowledge
2. [ ] Check if the feature exists in the current codebase or starter template for reference patterns
3. [ ] Identify which files need changes: wasp config file (`main.wasp` or `main.wasp.ts`), `schema.prisma`, `src/`
4. [ ] Plan the order, preferring to work in vertical slices and starting from the bottom up, if necessary.
5. [ ] Invoke the `start-dev-server` skill to verify that changes were successfully implemented 

### Documentation

Always fetch and verify your knowledge against the current Wasp documentation before implementing Wasp features or answering Wasp questions as your Wasp knowledge may be outdated:
- https://wasp.sh/llms.txt

### Development Server

Before starting any development task on this Wasp project (coding, debugging, adding features), check if the development servers are running:
- Check for active background tasks (use `/tasks` command)
- Or check if ports 3000 (client) and 3001 (server) are in use

If not running, invoke the `start-dev-server` skill to start the server as a background task or externally.

### Schema Changes

Changes to `schema.prisma` are not applied until `wasp db migrate-dev --name <descriptive-name>` runs. Continue coding freely and tell the user to run migrations when ready to test.

**Track pending migrations:** The dev server warns about this, but users may miss it in background tasks. Remind them before testing/viewing the app, and offer to run migrations:
- [ ] stop server
- [ ] migrate
- [ ] restart

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

### Recommended Code Organization

Unless user specifies otherwise, use a vertical, per-feature code organization (not per-type):

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

Highly recommend that the user chose one of the following templates when scaffolding a new Wasp app:
```bash
wasp new my-basic-app -t basic # creates a basic starter app with core Wasp features like auth, operations, pages, etc.
wasp new my-saas-app -t saas # creates a full-featured SaaS starter app with auth, payments, demo app, AWS S3, and more (OpenSaaS.sh)
```

See the **Starter Templates** section in the Wasp documentation for more templates.

### Customization

**Do NOT configure Vite, Express, React Query, etc. the usual way.** Wasp has its own mechanisms for customizing these tools. See the **Project Setup & Customization** section in the Wasp docs.

### Advanced Features

Wasp provides **advanced features**:
- custom HTTP API endpoints
- background (cron) jobs
- type-safe links
- websockets
- middleware
- email sending

See the **Advanced Features** section in the Wasp docs for more details.

### Wasp Conventions

#### Imports
**In TypeScript files:**
- ✅ `import type { User } from 'wasp/entities'`
- ✅ `import type { GetTasks } from 'wasp/server/operations'`
- ✅ `import { getTasks, createTask, useQuery } from 'wasp/client/operations'`
- ✅ `import { SubscriptionStatus } from '@prisma/client'` (for Prisma enums)
- ✅ Local code: relative paths `import { X } from './X'`

**In main.wasp:**
- ✅ `fn: import { getTasks } from "@src/tasks/operations"`
- ❌ Never relative paths

**In main.wasp.ts:**
See the **TypeScript Config** section in the Wasp docs for more details.

#### Operations
- ⚠️ Call actions directly using `async/await`. DO NOT use Wasp's `useAction` hook unless optimistic updates are needed.

## Troubleshooting

### Debugging

1. check the `wasp start` output for logs and errors from the:
  a. API server/backend
  b. client dev server (client building). 
2. Also check the browser for client runtime logs and errors that are not printed by the `wasp start` command. The user can choose which tool they'd prefer via the AskUserQuestion tool and run it for the user:
  - the `mcp__plugin_wasp_chrome-devtools` MCP server that comes installed with the plugin
  - Claude Code's built-in Chrome browser function
  - they can check manually
  - other

### Common Mistakes

| Symptom | Fix |
|---------|-----|
| `context.entities.X undefined` | Add entity to `entities: [...]` in main.wasp |
| Schema changes not applying | Run `wasp db migrate-dev --name <descriptive-name>` |
| Can't login after email signup with `Dummy` email provider | Check the server logs for the verification link or set SKIP_EMAIL_VERIFICATION_IN_DEV=true in .env.server |
| Types stale/IDE errors after changes | Restart TS server `Cmd+Shift+P`|
| Wasp not recognizing changes | **WAIT PATIENTLY** as Wasp recompiles the project. Re-run `wasp start` if necessary.|
| Persistent weirdness after waiting patiently and restarting. | Run `wasp clean` && `wasp start` |
