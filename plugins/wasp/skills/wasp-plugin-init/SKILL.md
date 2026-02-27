---
name: wasp-plugin-init
description: Adds Wasp knowledge, LLM-friendly documentation fetching instructions, and best practices to your project's CLAUDE.md or AGENTS.md file
---

0. inform the user that this process will give their agent (Claude, Codex, Copilot, etc.) access to knowledge on Wasp's features, commands, workflows, and best practices by importing the [`general-wasp-knowledge.md`](./general-wasp-knowledge.md) file into the user's AGENTS.md or CLAUDE.md file. Use the AskUserQuestion tool to: a) ask the user if they want to continue, b) ask if they are using Claude Code (CLAUDE.md) or other agents like Codex, Gemini, Copilot, etc. (AGENTS.md).
1. if the user is using Claude Code, follow the [Claude Code memory](#claude-code-memory) instructions. If the user is using other agents, follow the [Other agents memory](#other-agents-memory) instructions.

## Claude Code memory
- copy [`general-wasp-knowledge.md`](./general-wasp-knowledge.md) to the user's project root `.claude/wasp` directory:
```bash
mkdir -p .claude/wasp && cp ./general-wasp-knowledge.md .claude/wasp/general-wasp-knowledge.md
```
- append the Wasp knowledge to the user's CLAUDE.md file as an import:
```markdown
# Wasp Knowledge

Wasp knowledge can be found at @.claude/wasp/general-wasp-knowledge.md
```
- create the marker file so the plugin knows init has been run:
```bash
touch .claude/wasp/.wasp-plugin-initialized
```

## Other agents memory
append the entire contents of [`general-wasp-knowledge.md`](./general-wasp-knowledge.md) by copy and pasting it into the user's AGENTS.md file.

3. inform the user that process is complete and they can run `/wasp-plugin-help` to see the plugin's available skills and features.
4. recommend the user do the following for the best Wasp development experience with Claude, Codex, Copilot, etc.:
   - **Start the dev server**: Tell it to run the 'start-dev-server' skill to start the Wasp app and give it access to server logs, build errors, and Wasp CLI commands
   - **Enable Chrome DevTools**: Prompt it to *`use the Chrome DevTools MCP server`* to give it visibility into browser console logs, network requests, and runtime errors

   Explain that together these provide end-to-end insight (backend + frontend) for faster debugging and development.
