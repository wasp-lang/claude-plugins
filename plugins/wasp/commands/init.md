---
description: Add Wasp knowledge to your project's CLAUDE.md
---

1. copy the file `${CLAUDE_PLUGIN_ROOT}/general-wasp-knowledge.md` from within the plugin's installation directory to the user's project `.claude/knowledge` directory using the Bash tool with `cp` command.
2. append it to the user's CLAUDE.md file as an import:
```markdown
# Wasp Knowledge

Wasp knowledge can be found at @.claude/knowledge/general-wasp-knowledge.md
```
4. create an empty file using the Bash tool with `touch` command at the user's project directory: `.claude/knowledge/.wasp-knowledge-initialized`.
5. inform the user that Claude now has access to info on Wasp's features, commands, workflows, and best practices, and they can ammend the `general-wasp-knowledge.md` file if they want.
6. also inform the user they can run `/wasp:help` to see the plugin's available commands and skills.
