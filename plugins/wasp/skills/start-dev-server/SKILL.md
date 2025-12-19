---
name: start-dev-server
description: start the Wasp dev server, handle database setup, and run migrations. Use when the user wants to start development, run the app locally, or needs help with database migrations.
---

# start-dev-server

## Before Starting

1. Verify user is in the app directory (check for `main.wasp` or `main.wasp.ts`)
2. Detect database type → [detect-database.md](./detect-database.md)
3. Ask the user if they want Claude to start the dev server(s ) as a background task in the current session, or on their own in a separate terminal:
  - Starting as a background task (Claude)
    - Pros: Claude has more autonomy, can respond directly to dev server logs (warnings, errors) and can run Wasp CLI commands for you.
    - Cons: Certain actions can be slower, and the user has less direct control. Server logs are only visibile to the user from within the `background tasks` tab.
  - Starting externally (User)
    - Pros: The user has more direct control over app development and the Wasp CLI commands. Can be advantageous for more advanced users.
    - Cons: Debugging and feature discovery can be slower, as Claude doesn't have direct access to dev server logs (warnings, errors) or Wasp CLI commands.

## Workflow

### Step 1: Database Setup (PostgreSQL only)

**PostgreSQL:** Start the managed database container as a background task:
```bash
wasp start db
```
**Run this as a background task in the current claude code session.**
Wait 5-15 seconds for the database to be ready.

**SQLite:** Skip this step. Do NOT run `wasp start db`.

### Step 2: Stop Existing Dev Server

Before running migrations, stop any running Wasp dev server to avoid database locks and stale types.

**If started as background task in current session:** Use `KillShell` tool with the task ID.

**If started externally:** Instruct the user to stop the dev server in the external terminal.

### Step 3: Run Pending Migrations

Check for pending migrations by reading the `migrations/` directory and the `schema.prisma` file and comparing.

Prisma requires an interactive terminal. There are two solutions:

#### Solution 1: Use `script` to provide a pseudo-TTY:

```bash
script -q /dev/null bash -c 'wasp db migrate-dev --name <migration-name>'
```

#### Solution 2: Have the user run in a separate terminal:
```bash
wasp db migrate-dev --name migration-name
```

ALWAYS use `--name migration-name`. If the user doesn't specify one, suggest a name based on schema changes.

### Step 4: Start Dev Server

Run as a background task:
```bash
wasp start
```

### Step 5: Verify

1. Confirm client (`localhost:3000`) and server (`localhost:3001`) are running
2. Confirm there are no client app issues in the browser console. Ask the user to choose which tool they'd prefer via the AskUserQuestion tool and run it for the user:
  - the `mcp__plugin_wasp_chrome-devtools`
  - Claude Code's built-in Chrome browser function
