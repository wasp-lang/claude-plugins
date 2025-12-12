---
description: Add Wasp knowledge to your project's CLAUDE.md
---

1. verify the plugin root directory exists by running `ls -la ${CLAUDE_PLUGIN_ROOT}` using the Bash tool. This should show the plugin directory contents, NOT the project directory. If empty or shows project files, the path expansion failed.
2. copy the file `${CLAUDE_PLUGIN_ROOT}/general-wasp-knowledge.md` to the user's project `.claude/knowledge` directory using the Bash tool with `cp` command.
3. append it to the user's CLAUDE.md file as an import:
```markdown
# Wasp Knowledge

Wasp knowledge can be found at @.claude/knowledge/general-wasp-knowledge.md
```

4. create the hooks directory if needed: `mkdir -p ${CLAUDE_PLUGIN_ROOT}/hooks` using the Bash tool.
5. create an empty file using the Bash tool with `touch` command at the ABSOLUTE path `${CLAUDE_PLUGIN_ROOT}/hooks/.wasp-knowledge-initialized`. CRITICAL: This file must be created in the plugin's installation directory (something like ~/.claude/plugins/cache/...), NOT in the user's project directory.
6. inform the user that Claude now has access to info on Wasp's features, commands, workflows, and best practices.
