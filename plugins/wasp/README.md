# Wasp Claude Code Plugin

A Claude Code plugin for Wasp framework development, providing LLM-friendly documentation access, best practices, and tested workflows.

## Features

- **Knowledge Integration**: Add Wasp best practices and conventions to your project's CLAUDE.md
- **LLM-Friendly Documentation**: Automatically directs to raw Wasp documentation from https://wasp.sh/llms.txt for optimal LLM grounding
- **Configure Wasp**: Add Wasp framework features like authentication, database, email, CSS frameworks, and other integrations
- **Deployment Guide**: Step-by-step deployment to Railway or Fly.io with pre-flight validation

## Installation

In a Claude Code session, run the following command:

```bash
/plugin marketplace add wasp-lang/claude-plugins
```

```bash
/plugin install wasp@wasp-plugins
```

## Skills

This plugin provides skills that Claude will automatically invoke when appropriate:

### 1. Configure Wasp (`configure-wasp`)
Configure Wasp framework features like authentication, database, email providers, CSS frameworks, and other Wasp integrations. Each invocation focuses on one feature at a time.

### 2. Deployment Guide (`deploying-app`)
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
