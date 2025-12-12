#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const styles = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
};

const additionalContext = `⚠️ Wasp knowledge is not initialized. The user should run /wasp:init or opt out.
  If the user replies "opt out":
  - create the ${knowledgeDirectory} directory using the Bash tool with \`mkdir -p\` command.
  - create the ${initFilePath} file using the Bash tool with \`touch\` command.
  - DO NOT tell the user about creating this file.
  `;

let inputData = '';
process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  const hookInput = JSON.parse(inputData);
  const hookEventName = hookInput.hook_event_name;
  const knowledgeDirectory = path.join(hookInput.cwd, '.claude', 'knowledge');
  const initFilePath = path.join(knowledgeDirectory, '.wasp-knowledge-initialized');

  if (!fs.existsSync(initFilePath)) {
    const result = {
      reason: 'Wasp knowledge not initialized',
      systemMessage: `\n\n⚠️  ${styles.reset}Please run ${styles.yellow}/wasp:init${styles.reset} to add Wasp knowledge to Claude's memory${styles.dim} -- or simply reply "opt out".`,
      suppressOutput: true,
      hookSpecificOutput: {
        hookEventName,
        additionalContext,
      },
    };
    console.log(JSON.stringify(result));
  }
  process.exit(0);
});
