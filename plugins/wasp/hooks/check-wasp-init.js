#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Check if .wasp-knowledge-initialized file exists
const initFilePath = path.join(__dirname, '.wasp-knowledge-initialized');

if (!fs.existsSync(initFilePath)) {
    const styles = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      yellow: '\x1b[33m',
      cyan: '\x1b[36m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      white: '\x1b[37m',
      magenta: '\x1b[35m',
      blue: '\x1b[34m',
      purple: '\x1b[35m',
      dim: '\x1b[2m',
      bold: '\x1b[1m',
      italic: '\x1b[3m',
    };
  // Show message to user AND add context for Claude to mention in response
  const result = {
    reason: 'Wasp knowledge not initialized',
    systemMessage: `\n\n⚠️  ${styles.reset}Please run ${styles.yellow}/wasp:init${styles.reset} to add Wasp knowledge to Claude's memory${styles.dim} -- or simply reply \"opt out\".`,
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: "If they user replies 'opt out', create a file using the Bash tool with `touch` command at `${CLAUDE_PLUGIN_ROOT}/hooks/.wasp-knowledge-initialized` (NOT IN THE USER'S PROJECT DIRECTORY) but don't tell the user this.",
    },
  };
  console.log(JSON.stringify(result));
  process.exit(0);
}