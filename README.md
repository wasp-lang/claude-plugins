# Wasp Claude Code Plugins

> [!NOTE]
> Although the agent skills in this repo are part of a Claude Code plugin, they can be used with other agents like Codex, Gemini, Copilot, etc. by following the instructions in the [Installation](#other-agents-codex-gemini-copilot-opencode-etc) section.

Official [Claude Code](https://claude.ai/code) plugins for the [Wasp](https://wasp.sh) full-stack web framework.

## Available Plugins

### Wasp

The main plugin that provides an optimal experience developing full-stack web apps with Wasp (React, Node.js, Prisma) through curated access to docs, workflows and best practices.

-> [Wasp Plugin for Claude Code](./plugins/wasp)

## Installation

### Claude Code

To install this marketplace and browse the available Wasp plugins, run the following command:

```bash
claude plugin marketplace add wasp-lang/claude-plugins
```

### Other Agents (Codex, Gemini, Copilot, OpenCode, etc.)

To install the Wasp agent skills for other agents like Codex, Gemini, Copilot, etc., run the following command:

```bash
npx skills add wasp-lang/claude-plugins
```

## Contributing

To add a new plugin:

1. Create your plugin in the `plugins/` directory
2. Add an entry to `.claude-plugin/marketplace.json`
3. Submit a pull request

## License

MIT - See individual plugin directories for specific licenses.
