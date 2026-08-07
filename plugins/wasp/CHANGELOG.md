# Changelog

All notable changes to the Wasp Claude Code plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] - 2026-06-23

### Added

- Added agent guidance for operation type generation, Entity-based cache invalidation, non-interactive migrations, seed idempotency, and verified test users.

### Changed

- Clarified that `useAction` is for optimistic updates.
- `start-dev-server` now checks custom `WASP_WEB_CLIENT_URL` / `PORT` values from `.env.server`.

## [1.3.0] - 2026-03-24

### Added

- Multi-agent support: skills now work with Codex, Gemini, Copilot, OpenCode, and other agents via AGENTS.md
- Installation path for non-Claude agents via `npx skills add wasp-lang/claude-plugins`
- `wasp-plugin-init` skill now asks whether the user is on Claude Code (CLAUDE.md) or another agent (AGENTS.md) and follows the appropriate flow
- Chrome DevTools MCP install instructions for non-bundled setups

### Changed

- Agent-agnostic language throughout all skills ("Claude" → "the agent")
- Moved `general-wasp-knowledge.md` into the `wasp-plugin-init` skill directory
- Versioned init marker files (`.wasp-plugin-initialized-v{VERSION}`) for automatic re-init on plugin upgrades
- Simplified init detection: replaced CLAUDE.md content scanning with marker file approach
- Moved opt-out marker from `.claude/knowledge/.wasp-init-opt-out` to `.claude/wasp/.wasp-plugin-opt-out` (legacy path still supported)
- Chrome DevTools MCP is no longer bundled in the plugin manifest — users install it separately

## [1.2.0] - 2026-02-04

### Changed

- Converted commands to skills: `wasp:init` → `/wasp-plugin-init`, `wasp:help` → `/wasp-plugin-help`
- Renamed `expert-advice` command to skill
- Renamed `plugin-help` skill to `wasp-plugin-help`

### Removed

- Removed `commands/` directory (functionality moved to skills)

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
