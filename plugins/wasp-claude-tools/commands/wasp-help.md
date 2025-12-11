---
description: Show available Wasp plugin features and how to use them
---

Present the user with the following information below:

# Wasp Claude Tools Plugin

## Skills

Skills are automatically invoked by Claude when relevant to your task.

| Skill | Trigger | Description |
|-------|---------|-------------|
| **setup-wizard** | "set up my Wasp app", "configure authentication" | Interactive guided setup for new Wasp projects - branding, auth providers, email, database |
| **deploying-app** | "deploy my app", "deploy to Railway" | Deploy to Railway or Fly.io with pre-flight validation checklist |
| **adding-wasp-knowledge-claude** | "add Wasp knowledge to CLAUDE.md" | Add Wasp conventions and best practices to your project's CLAUDE.md |

## Hooks

Hooks run automatically in the background.

| Hook | Event | What it does |
|------|-------|--------------|
| **Doc Caching** | Session Start | Fetches and caches all Wasp documentation locally for fast access |
| **Doc Redirect** | WebFetch (Wasp URLs) | Redirects Wasp doc requests to local cache instead of fetching from web |

## Tips

- **Offline docs**: Wasp documentation is cached locally after first session, enabling offline access
- **Fresh cache**: Docs are refreshed every 24 hours automatically
- **Trigger skills**: Just describe what you want to do naturally - Claude will invoke the appropriate skill
