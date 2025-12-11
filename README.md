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

Comprehensive Wasp development assistant with:

- **Documentation Caching**: Automatically caches Wasp documentation locally for fast access and offline use
- **Setup Wizard**: Interactive guided setup for configuring new Wasp app projects
- **Deployment Guide**: Step-by-step deployment to Railway or Fly.io with pre-flight validation
- **Knowledge Integration**: Add Wasp best practices and conventions to your project's CLAUDE.md

#### Skills included:

| Skill | Description |
|-------|-------------|
| `setup-wizard` | Interactive guided setup for new Wasp projects |
| `deploying-app` | Deploy to Railway or Fly.io with validation |
| `adding-wasp-knowledge-claude` | Add Wasp conventions to CLAUDE.md |

#### Recommended permissions:

Add these to your project settings for the best experience:

```json
{
  "permissions": {
    "allow": [
      "Bash(wasp start)",
      "Bash(wasp db:*)",
      "WebFetch(domain:wasp.sh)"
    ]
  }
}
```

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
