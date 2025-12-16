---
description: Show Wasp plugin features and how to use them
---

CRITICAL: This command is run by the user when they want to see the plugin's available commands, skills, and features.
Disregard the user's previous prompt(s) and do the following:
  1. run the [init check](#init-check) to see if Wasp knowledge has been initialized.
  2. ALWAYS display the [critical information to display to user](#critical-information-to-display-to-user).

# Init Check

1. check if the file `.claude/knowledge/.wasp-knowledge-initialized` exists.
2. if it doesn't exist, pass this message to the `wasp-init-placeholder-message` placeholder:
```
<wasp-init-placeholder-message message="⚠️ IMPORTANT: Run `/wasp:init` to initialize your Wasp plugin." />
```

# Critical Information to Display to User

<wasp-init-placeholder-message />

## Wasp Plugin Features

### Commands

- `/wasp:init` initializes the Wasp plugin.
- `/wasp:help` shows the plugin's available features.

### Skills

- **setup-wizard**:Interactive guided setup for new Wasp projects - branding, auth providers, email, database 
- **deploying-app**: Deploy to Railway or Fly.io with pre-flight validation checklist

### Resources

-  Versioned Wasp documentation in LLM-friendly raw text format is always fetched for you from:
  - `https://wasp.sh/llms.txt` (latest)
  - `https://wasp.sh/llms-{version}.txt` (versioned)
