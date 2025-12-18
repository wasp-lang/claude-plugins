# Wasp Claude Code Plugin

A Claude Code plugin for Wasp framework development, providing optimized raw text Wasp documentation for LLMs, best practices, and tested workflows.

## Features

- **Optimized Documentation Access**: Claude grounds its knowledge via up-to-date raw text, versioned Wasp documentation
- **Adds Wasp Knowledge**: Import Wasp best practices and conventions to your project's CLAUDE.md
- **Configures Wasp**: Easily add Wasp framework features like authentication, database, email, styling (tailwind, shadcn), and other integrations
- **Deployment Guidance**: Claude Code will guide you through deploying your Wasp app to Railway or Fly.io via the Wasp CLI

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
- `/wasp:help` - Show the plugin's features, commands, and skills

## Skills

This plugin provides skills that Claude will automatically invoke when appropriate:

### 1. Configure Wasp (`configure-wasp`)
Configure Wasp framework features like authentication, database, email providers, CSS and UI styling libraries, and other Wasp integrations.

### 2. Start Dev Server (`start-dev-server`)
Start the Wasp development environment with proper database setup and migrations. Detects your database type (PostgreSQL vs SQLite), handles database migrations, and starts the dev server as a background task.

### 3. Deployment Guide (`deploying-app`)
Let Claude Code guide you through using Wasp's CLI for easy deployment of your Wasp app to Railway or Fly.io.

## Background Hooks

The plugin includes background hooks that:
- Automatically redirect to LLM-friendly Wasp docs (`llms.txt`) instead of HTML pages
- Detect your project's Wasp version for versioned documentation
- Check plugin initialization status on session start

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
      "Skill(wasp:wasp-plugin-help)",
      "Skill(wasp:start-dev-server)",
    ]
  }
}
```

## License

MIT
