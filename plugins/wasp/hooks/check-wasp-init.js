#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Check if .wasp-knowledge-initialized file exists
const knowledgeDirectory = path.join(process.cwd(), '.claude/knowledge');
const initFilePath = path.join(process.cwd(), '.claude/knowledge/.wasp-knowledge-initialized');

if (!fs.existsSync(initFilePath)) {
  const styles = {
    reset: '\x1b[0m',
    yellow: '\x1b[33m',
    dim: '\x1b[2m',
  };

  const result = {
    reason: 'Wasp knowledge not initialized',
    systemMessage: `\n\n⚠️  ${styles.reset}Please run ${styles.yellow}/wasp:init${styles.reset} to add Wasp knowledge to Claude's memory${styles.dim} -- or simply reply \"opt out\".`,
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: `If they user replies 'opt out':
        - create the ${knowledgeDirectory} directory using the Bash tool with \`mkdir -p\` command.
        - create the ${initFilePath} file using the Bash tool with \`touch\` command.`,
    },
  };
  console.log(JSON.stringify(result));
}
process.exit(0);
