---
name: setup-wizard
description: interactive guided setup for configuring a new Wasp app project.
---

# setup-wizard

This wizard walks through essential Wasp app configurations and customizations. Run each step in order, asking the user for decisions at each stage.

## Before Starting

1. verify user is in the app directory (check for wasp config file: `main.wasp` or `main.wasp.ts`)
2. ask: "Would you like me to guide you through setting up your app?"

## Setup Phases

Guide the user through these phases, each with its own set of steps, in order. 

### Phase 0: Fetching Wasp Knowledge

Fetch and organize the following information from the Wasp (cached) docs into separate lists:
- Authentication methods
- Email providers
- Databases

The user will choose which integrations they'd like to set up from these lists in the appropriate phases, at which point you will fetch the docs for each integration to guide them.

If no cached docs exist, run [cache-all-wasp-docs.js](../../hooks/cache-all-wasp-docs.js).

#### Using AskUserQuestion tool with Lists in the Setup Wizard

When asking the user to choose from fetched lists follow these guidelines:

1. **Always display the full list** to the user before asking them to choose, so they know all available options.
2. **Use the most popular/common options** as the selectable choices in `AskUserQuestion` (limited to 2-4 options).
3. **Remind users** they can select "Other" to specify any option from the full list that isn't shown in the quick-select options.
4. **Example format:**
   ```
   Available auth methods: Username & Password, Email, Google, GitHub, Discord, Keycloak, Slack

   [AskUserQuestion with 3-4 most common options]

   Note: Select "Other" to choose from additional options like Discord, Keycloak, or Slack.
   ```

### Phase 1: App Branding

1. ask the user:
- What is your app name?
- What is a one-line description?

2. update the wasp config file `app` block according to the docs.

DO NOT change URLs in the `app.head` meta tags. Leave these as they are until the user has a production domain and is ready to deploy.

### Phase 2: Authentication

1. read the wasp config file auth methods section to see which providers are already configured, if any.

2. **display the full list** of available auth methods fetched in Phase 0 to the user.

3. using the `AskUserQuestion` tool, ask the user which (additional) auth methods they'd like to add:
   - if no auth methods are selected, move to the next phase.

4. for each auth method selected:
  - add the provider to the wasp config file's auth methods section according to the docs for each auth method
  - if applicable, inform user they'll need to set env vars in a later phase

5. read the wasp config file and see if the app has defined authentication pages (e.g. login, signup, forgot password, etc.)?
  - if so, check if those pages are using Wasp's managed AUTH UI components (e.g. `import { LoginForm } from "wasp/client/auth";`) that adapt to their selected auth methods?
    - if so, move to the next phase.
    - if not, continue with the next step.

6. if the app does not have authentication pages, ask the user if they'd like to set up:
  - authentication pages (e.g. login, signup, forgot password, etc.) with Wasp's managed AUTH UI components that adapt to their selected auth methods?
    - if yes, follow the selected auth methods' guides in the Wasp docs
    - if no:
      - inform the user they can follow the "Create your own UI" guides in the Wasp docs later with their auth method of choice
      - continue to the next phase

### Phase 3: Email Provider

1. **display the full list** of available email providers fetched in Phase 0 to the user.

2. using the `AskUserQuestion` tool, ask the user which email sending provider they'd like to use.

3. for each provider selected:
  - add the provider to the wasp config file's emailSender section according to the docs for each email provider
  - inform the user they'll need to set env vars in a later phase

### Phase 4: Setting Up a Database

1. **display the full list** of available databases fetched in Phase 0 to the user.

2. using the `AskUserQuestion` tool, ask the user which database they'd like to use.

3. if the selected database can be managed locally by Wasp (e.g., PostgreSQL), using the `AskUserQuestion` tool, ask the user: "Would you like me to guide you through the local database setup process?"
  - if yes, guide the user through the managed database setup process according to the individual database docs
  - if no, inform the user that they'll need to set the proper env vars after setting up the database themselves

4. after the database is setup, ask the user if they're ready to move to the next phase.

### Phase 5: Completing Integrations & Environment Variables

For each integration selected in phases 2-4: 
  1. findt the correct doc files/guides for each integration
  2. generate checklist of required env vars 
  3. give user instructions for retrieving and adding env vars to `.env.server` 
  4. follow steps/run commands in the guide to complete the integration for the user where applicable
  5. prompt the user to confirm they're ready to move to the next integration

### Phase 6: Adding Wasp Knowledge

1. ask the user if they'd like to add knowledge about Wasp to their CLAUDE.md file.
  - if yes, follow the [adding-wasp-knowledge-claude](../adding-wasp-knowledge-claude/SKILL.md) skill.
  - if no, inform the user that they can add knowledge about Wasp to their CLAUDE.md file later.

### Phase 7: Verify Setup

1. start the wasp app processes in new terminals as background tasks in the current Claude Code session
2. verify configuration compiles and check for any errors.

### Phase 8: Completion

1. provide a summary of the setup process and what other skills and commands are available to help with further setup.
2. ask the user if they're ready to move to the next phase.
