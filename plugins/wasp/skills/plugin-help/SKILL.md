---
name: plugin-help
description: Shows the Wasp plugin's available features, commands, and skills.
---

1. run the [check-wasp-init hook](../../hooks/check-wasp-init.js) using the Bash tool with `node` command to see if Wasp knowledge has been initialized.
2. let the user know if the Wasp plugin has been initialized or not.
3. if the Wasp plugin has not been initialized, let the user know they should take care of this first by running `/wasp:init`:
```markdown
⚠️
The Wasp plugin hasn't been initialized for the current project.
Run `/wasp:init` to get the plugin's full functionality.
```
4. display the [Wasp Plugin for Claude Code](#wasp-plugin-for-claude-code) section to the user exactly as it is below.

--- --- 🐝 🐝 🐝 --- ---

# 🐝 Wasp Plugin for Claude Code

This plugin turns Claude Code into a Wasp framework expert, giving you an AI assistant that deeply understands Wasp's features, patterns, and best practices.

## 💬 Example Wasp Prompts to Ask Claude

- *"Add `Google authentication` to my app"*  
- *"Help me add `ShadCN UI` to my app"*  
- *"Start a new SaaS app using `Wasp's SaaS starter template`"*  
- *"Set up email sending with `SendGrid`"*  
- *"Solve the errors in the browser using the `Chrome DevTools MCP server`"*  
- *"Which `Wasp features` should I use for this task?"*  
- *"Why isn't my `recurring job` working?"*  
- *"Deploy my app to `Railway`"* 


## 🔧 Commands

Commands are used to interact with the plugin. Commands are run by the user when they want to invoke a specific prompt/action:

1. `/wasp:init`:
  - Initialize the plugin for your project. 
  - Copies Wasp knowledge to your project
  - Links it in your `CLAUDE.md` file
  - Run this once per project

2. `/wasp:start-dev-server`:
  - Start the Wasp development environment as a background task so Claude can have full insight into the Wasp app while developing/debugging.
  - Uses the skill of the same name with a few explicit properties set.

3. `/wasp:expert-advice [advice request]`:
  - Get advice on app improvements and functionality from a Wasp expert
  - Optionally provide arguments for more specific requests (e.g., `/wasp:expert-advice how can I improve account management?`)
  - Explores your codebase, Wasp docs, and plugin features to suggest improvements with pros and cons

3. `/wasp:help`:
  - Displays this help guide


## 🤖 Skills

Skills are context-aware workflows Claude can invoke to help you accomplish specific Wasp tasks. Claude will automatically invoke the relevant skill based on the user's request.

1. **configure-wasp**
  - Interactive guided setup for adding or configuring Wasp framework features.
  - *Usage:* Just ask Claude something like "help me set up authentication" or "configure my database"

2. **start-dev-server**
  - Start the Wasp development environment, database, and migrations.
  - *Usage:* Ask Claude "start the dev server", "run migrations", or "help me start development"

3. **deploying-app**
  - Guided deployment workflow via Wasp's CLI for deploying database, server, and client apps to Railway or Fly.io.
  - *Usage:* Ask Claude "help me deploy my app" or "deploy to Railway"


## 📖 Documentation Access

The plugin ensures Claude always references the correct Wasp documentation for your project:

- Latest docs: `https://wasp.sh/llms.txt` - Full Wasp documentation in LLM-friendly format
- Versioned docs: `https://wasp.sh/llms-{version}.txt` - Documentation for a specific Wasp version (e.g., `llms-0.15.txt`)

Claude automatically detects your project's Wasp version and fetches the appropriate documentation when needed.


## 🤝 Contribute 

Want to help make this plugin better?
Submit issues, feedback, or PRs to the [Wasp Claude Code Plugins](https://github.com/wasp-lang/claude-plugins) repository.


## 🫂 Community 

Join the [Wasp Discord](https://discord.gg/rzdnErX) to get extra help or talk about anything web development related.
