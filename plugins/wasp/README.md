# Wasp Claude Code Plugin

A Claude Code plugin that provides an optimal experience developing full-stack web apps with Wasp (React, Node.js, Prisma) through curated access to docs, workflows and best practices.

## Features

- **Wasp documentation**: Automatically downloads the correct version of the Wasp documentation map (`llms.txt`) to `.claude/wasp/docs/llms.txt` on session start. This file contains links to raw GitHub markdown files that Claude fetches as needed.
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

### Configure and Initialize the plugin

After installing, in an active session, run:
```bash
/wasp:init
```
- This will add Wasp knowledge to your project's CLAUDE.md file.

```
Run the 'start-dev-server' skill.
```
- This will start the Wasp development environment as a background task so Claude can have full insight into the Wasp app while developing/debugging.

Finally, to access more information about the plugin and its features, run:
```bash
/wasp:help
```
- This will show the plugin's features, commands, and skills.

## Commands

Check out the individual [commands](./commands) and [skills](./skills) to learn more about what they are and what they do.

## Background Hooks

The plugin includes background hooks that:
- Automatically download the version-matched Wasp documentation map (`llms.txt`) to `.claude/wasp/docs/` on session start
- Redirect web fetches to the local `llms.txt` map instead of HTML pages (Claude then fetches the raw GitHub markdown URLs from the map)
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
      "WebFetch(domain:wasp.sh)",
      "WebFetch(domain:raw.githubusercontent.com)"
      "Skill(wasp:plugin-help)",
      "Skill(wasp:start-dev-server)",
    ]
  }
}
```

## License

MIT
