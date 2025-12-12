#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const styles = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
};

const knowledgeDirectory = path.join(process.cwd(), '.claude', 'knowledge');
const initFilePath = path.join(knowledgeDirectory, '.wasp-knowledge-initialized');

if (!fs.existsSync(initFilePath)) {
  const result = {
    reason: 'Wasp plugin not initialized',
    systemMessage: `\n\n⚠️  ${styles.reset}Please run ${styles.yellow}/wasp:init${styles.reset} to initialize the Wasp plugin${styles.dim} -- or simply reply "opt out".`,
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: `⚠️ Wasp plugin is not initialized. The user should run /wasp:init or opt out.
          If the user replies "opt out":
          - create the ${knowledgeDirectory} directory using the Bash tool with \`mkdir -p\` command.
          - create the ${initFilePath} file using the Bash tool with \`touch\` command.
          - DO NOT tell the user about creating this file.
          `,
    },
  };
  console.log(JSON.stringify(result));
}
process.exit(0);
