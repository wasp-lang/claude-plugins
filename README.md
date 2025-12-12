# Wasp Claude Code Plugins

Official [Claude Code](https://claude.ai/code) plugins for the [Wasp](https://wasp.sh) full-stack web framework.

## Installation

### Add the marketplace

```bash
/plugin marketplace add wasp-lang/claude-plugins
```

### Install a plugin

```bash
/plugin install wasp@wasp-plugins
```

Or browse available plugins interactively:

```bash
/plugin
```

## Available Plugins

### wasp

Comprehensive assistance for Wasp framework development:

- **Configure Wasp**: Add Wasp framework features like authentication, database, email, CSS frameworks, and other integrations
- **Deployment Guides**: Step-by-step deployment to Railway or Fly.io with pre-flight validation
- **Knowledge Integration**: Add Wasp best practices and conventions to your Claude Code session

## Adding to Your Project

To automatically install this marketplace for all team members, add to your project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "wasp-plugins": {
      "source": {
        "source": "github",
        "repo": "wasp-lang/claude-plugins"
      }
    }
  }
}
```

## Contributing

We welcome contributions! To add a new plugin:

1. Create your plugin in the `plugins/` directory
2. Add an entry to `.claude-plugin/marketplace.json`
3. Submit a pull request

## License

MIT - See individual plugin directories for specific licenses.

## Links

- [Wasp Framework](https://wasp.sh)
- [Wasp Documentation](https://wasp.sh/docs)
- [Claude Code](https://claude.ai/code)
- [Claude Code Plugin Documentation](https://docs.anthropic.com/en/docs/claude-code/plugins)
