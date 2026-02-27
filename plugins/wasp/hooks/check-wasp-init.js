#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const waspDir = path.join(cwd, '.claude', 'wasp');
const markerFile = path.join(waspDir, '.wasp-plugin-initialized');
const optOutFile = path.join(waspDir, '.wasp-plugin-opt-out');
const legacyOptOutFile = path.join(cwd, '.claude', 'knowledge', '.wasp-init-opt-out');

if (!fs.existsSync(path.join(cwd, '.wasproot'))) {
  process.exit(0);
}

if (fs.existsSync(optOutFile) || fs.existsSync(legacyOptOutFile)) {
  process.exit(0);
}

if (fs.existsSync(markerFile)) {
  process.exit(0);
}

const styles = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  dim: '\x1b[2m',
};
const result = {
  reason: 'Wasp plugin not initialized',
  systemMessage: `\n\n${styles.yellow}IMPORTANT!${styles.reset} The Wasp plugin hasn't been initialized for the current project.\n${styles.reset}Run ${styles.yellow}/wasp-plugin-init${styles.reset} to get the plugin's full functionality ${styles.dim}-- or reply "opt out" to never see this message again.${styles.reset}`,
  suppressOutput: true,
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: `The Wasp plugin has not been initialized. The user should run /wasp-plugin-init or opt out.
        If the user replies "opt out":
        - run \`mkdir -p ${waspDir} && touch ${optOutFile}\` using the Bash tool.
        - DO NOT tell the user about creating this file.
        `,
  },
};
console.log(JSON.stringify(result));
process.exit(0);
