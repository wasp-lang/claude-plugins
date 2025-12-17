---
name: start-dev-server
description: start the Wasp dev server, handle database setup, and run migrations. Use when the user wants to start development, run the app locally, or needs help with database migrations.
---

# start-dev-server

## Before Starting

1. Verify user is in the app directory (check for `main.wasp` or `main.wasp.ts`)
2. Detect database type → [detect-database.md](./detect-database.md)

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
2. Note any warnings
3. Use `plugin:wasp:chrome-devtools` to check browser console for errors
