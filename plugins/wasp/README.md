# Wasp Claude Code Plugin

A Claude Code plugin for Wasp framework development, providing optimized raw text Wasp documentation for LLMs, best practices, and tested workflows.

## Features

- **AI-Friendly Documentation**: Raw text, versioned Wasp documentation access optimized for LLMs 
- **Import Wasp Knowledge**: Import Wasp best practices and conventions to your project's CLAUDE.md
- **Configure Wasp**: Easily add Wasp framework features like authentication, database, email, CSS frameworks, and other integrations
- **Deployment Guide**: Claude Code will guide you through deploying your Wasp app to Railway or Fly.io

## Installation

### Add the Wasp marketplace

```bash
claude plugin marketplace add wasp-lang/claude-plugins
```

### Install the Wasp plugin

```bash
claude plugin install wasp@wasp-plugins --scope project
```

> [!NOTE]
> We suggest installing the plugin at the `project` scope (`settings.json` are commited to git).
> Or by using the `local` scope (`settings.local.json` are not commited to git).

Or install the plugin interactively in a running Claude Code session:

```bash
/plugin
```

### Configure and Initialize the plugin

After installing, in an active session, run:
```bash
/plugin
```
- select `wasp-plugins` under the `marketplaces` tab
- select the `auto-update` option to enable automatic updates of the plugin

Then run the initialize command to import curated Wasp resources into your project's CLAUDE.md file.

```bash
/wasp:init
```

## Commands

- `/wasp:init` - Initialize the plugin
- `/wasp:help` - Show available plugin features

## Skills

This plugin provides skills that Claude will automatically invoke when appropriate:

### 1. Configure Wasp (`configure-wasp`)
Configure Wasp framework features like authentication, database, email providers, CSS frameworks, and other Wasp integrations. Each invocation focuses on one feature at a time.

### 2. Start Dev Server (`start-dev-server`)
Start the Wasp development environment with proper database setup and migrations. Detects your database type (PostgreSQL vs SQLite), handles non-interactive terminal issues with Prisma migrations, and starts the dev server as a background task.

### 3. Deployment Guide (`deploying-app`)
Let Claude Code guide you through using Wasp's CLI for easy deployment of your Wasp app to Railway or Fly.io.

## Hooks

The plugin includes two hooks:

- **SessionStart**: Checks if Wasp knowledge has been initialized in the project
- **PreToolUse (WebFetch)**: Blocks requests to HTML Wasp documentation URLs and directs Claude to use LLM-friendly documentation from https://wasp.sh/llms.txt

## Recommended Permissions

For the best experience, add these permissions to your project or user settings:

```json
{
  "permissions": {
    "allow": [
      "Bash(wasp start)",
      "Bash(wasp db:*)",
      "Bash(wasp deploy:*)",
      "WebFetch(domain:wasp.sh)",
      "WebFetch(domain:raw.githubusercontent.com)"
    ]
  }
}
```

## License

MIT
