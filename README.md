# Wasp Claude Code Plugins

Official [Claude Code](https://claude.ai/code) plugins for the [Wasp](https://wasp.sh) full-stack web framework.

## Available Plugins

### Wasp

A Claude Code plugin for Wasp framework development, providing optimized raw text Wasp documentation for LLMs, best practices, and tested workflows.

### Open SaaS

Coming soon...

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

To add a new plugin:

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
