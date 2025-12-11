---
description: Add Wasp knowledge to your project's CLAUDE.md
---

1. copy the file `${CLAUDE_PLUGIN_ROOT}/general-wasp-knowledge.md` to the user's project `.claude/knowledge` directory using the Bash tool with `cp` command.
2. append it to the user's CLAUDE.md file as an import:
```markdown
# Wasp Knowledge

Wasp knowledge can be found at @.claude/knowledge/general-wasp-knowledge.md
```
3. create an empty file `.wasp-knowledge-initialized` in the `.claude/hooks/` directory (use the Bash tool with `touch` command).
4. inform the user that Claude now has access to info on Wasp's features, commands, workflows, and best practices.