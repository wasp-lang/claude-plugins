# Changelog

All notable changes to the Wasp Claude Code plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-01-27

### Added
- Added Chrome DevTools MCP server to plugin manifest

## [1.1.0] - 2026-01-21

### Changed
- Simplified recommended permissions to use wildcards (`Bash(wasp:*)`, `Skill(wasp:*)`)
- Consolidated database migration guidance into main skill files
- Improved documentation access section in plugin-help skill
- Updated styling skill with clearer instructions

### Removed
- Removed standalone "Verify Setup" feature (functionality covered by start-dev-server skill)
- Removed `running-db-migrations.md` (consolidated into start-dev-server SKILL.md)
- Removed `verify-setup.md` (no longer needed as separate feature)

### Added
- Added `.claude-plugin/plugin.json` manifest file

## [1.0.0] - 2025-12-11

### Added
- Initial release
- Wasp documentation integration with version detection
- Skills: add-feature, plugin-help, start-dev-server
- Commands: init, expert-advice
- Session start hook for initialization check
- Chrome DevTools MCP integration
