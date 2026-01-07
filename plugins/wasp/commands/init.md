---
description: Add Wasp knowledge to your project via Claude Code rules
---

0. inform the user that this process will give Claude access to info on Wasp's features, commands, workflows, and best practices by copying rules to `.claude/rules/wasp/` which will be auto-loaded by Claude Code. Use the AskUserQuestion tool to ask the user if they want to continue.
1. copy the rules from the plugin to the user's project using the Bash tool:
```bash
mkdir -p .claude/rules/wasp
cp -r "${CLAUDE_PLUGIN_ROOT}/rules/"* .claude/rules/wasp/
```
2. inform the user that the process is complete and they can run `/wasp:help` to see the plugin's available commands and skills.
3. recommend the user do the following for the best Wasp development experience with Claude:
   - **Start the dev server**: Tell claude to run the 'start-dev-server' skill to start the Wasp app and give Claude access to server logs, build errors, and Wasp CLI commands
   - **Enable Chrome DevTools**: Prompt Claude to *`use the Chrome DevTools MCP server`* to give Claude visibility into browser console logs, network requests, and runtime errors

   Explain that together these provide end-to-end insight (backend + frontend) for faster debugging and development.
