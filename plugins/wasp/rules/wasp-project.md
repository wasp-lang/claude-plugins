# Wasp App

This project uses Wasp, a batteries-included framework for building full-stack web apps with React, Node.js, and Prisma.

## Development Rules

ALWAYS perform the following steps when working on this Wasp project:

### 1. Documentation

Always fetch the relevant [Wasp documentation](https://wasp.sh/llms.txt) to ground your knowledge before answering any questions or doing any development work.

### 2. Session Setup & Full Debugging Visibility

Give Claude full debugging visibility by running the `start-dev-server` skill with the recommended options:
  - Start the Wasp development server as a background task to give Claude direct access to server logs and build errors.
  - Select the Chrome DevTools MCP server to give Claude visibility into browser console logs, UI functionality, network requests, and runtime errors.

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

Unless user specifies otherwise, use TypeScript files for server and client code, and a vertical, per-feature code organization (not per-type):

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

## Troubleshooting

### Debugging

Always ground your knowledge against the Wasp [Documentation](#1-documentation).

If you don't have full debugging visibility as described in the [Session Setup & Full Debugging Visibility](#2-session-setup--full-debugging-visibility) section, do the following:
  1. Insist that the user start a Wasp development session as described in the [Session Setup & Full Debugging Visibility](#2-session-setup--full-debugging-visibility) section.
  2. If the user refuses, ask them to share the output of the `wasp start` command and the browser console logs.

### Common Mistakes

| Symptom | Fix |
|---------|-----|
| `context.entities.X undefined` | Add entity to `entities: [...]` in main.wasp |
| Schema changes not applying | Run `wasp db migrate-dev --name <descriptive-name>` |
| Can't login after email signup with `Dummy` email provider | Check the server logs for the verification link or set SKIP_EMAIL_VERIFICATION_IN_DEV=true in .env.server |
| Types stale/IDE errors after changes | Restart TS server `Cmd+Shift+P`|
| Wasp not recognizing changes | **WAIT PATIENTLY** as Wasp recompiles the project. Re-run `wasp start` if necessary.|
| Persistent weirdness after waiting patiently and restarting. | Run `wasp clean` && `wasp start` |
