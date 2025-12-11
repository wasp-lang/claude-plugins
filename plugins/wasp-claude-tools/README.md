# wasp-claude-tools

A Claude Code plugin for Wasp framework development, providing documentation caching, deployment guides, and interactive setup wizards.

## Features

- **Knowledge Integration**: Add Wasp best practices and conventions to your project's CLAUDE.md
- **Documentation Caching**: Automatically caches Wasp documentation locally for fast access and LLM grounding.
- **Setup Wizard**: Interactive guided setup for configuring new Wasp app projects
- **Deployment Guide**: Step-by-step deployment to Railway or Fly.io with pre-flight validation

## Installation

Or install from a remote repository:

```bash
claude plugin add https://github.com/wasp-lang/wasp-claude-tools
```

## Skills

This plugin provides three skills that Claude will automatically invoke when appropriate:

### 1. Setup Wizard (`setup-wizard`)
Interactive guided setup for configuring a new Wasp app project using Wasp features like full-stack authentication, email providers, databases, and more.

### 2. Deployment Guide (`deploying-app`)
Let Claude Code guide you through using Wasp's CLI for easy deployment of your Wasp app to Railway or Fly.io.

### 3. Knowledge Integration (`adding-wasp-knowledge-claude`)
Add Wasp knowledge and conventions to your project's CLAUDE.md file.

## Hooks

The plugin includes two hooks:

- **SessionStart**: Automatically caches all Wasp documentation when Claude Code starts
- **PreToolUse (WebFetch)**: Intercepts requests to Wasp documentation URLs and redirects to cached local copies

## Recommended Permissions

For the best experience, add these permissions to your project or user settings:

```json
{
  "permissions": {
    "allow": [
      "Bash(wasp start)",
      "Bash(wasp db:*)",
      "Bash(wasp deploy:*)",
      "WebFetch(domain:wasp.sh)"
    ]
  }
}
```

## Documentation Cache

The plugin maintains a local cache of Wasp documentation in `knowledge/cached-docs/`. The cache:
- Refreshes automatically every 24 hours
- Includes all official Wasp documentation
- Enables efficient retrieval of Wasp documentation for LLM grounding and context

## License

MIT
