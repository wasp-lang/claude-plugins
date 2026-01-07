#!/usr/bin/env node
// TODO: Add support for updating rules in existing installations
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const knowledgeDirectory = path.join(cwd, '.claude', 'knowledge');
const optOutFilePath = path.join(knowledgeDirectory, '.wasp-init-opt-out');
const waspRulesDirectory = path.join(cwd, '.claude', 'rules', 'wasp');
const requiredRuleFiles = [
  'wasp-project.md',
  'wasp-config.md',
  'typescript-imports.md',
  'prisma-schema.md',
];

function isWaspProjectRoot() {
  return fs.existsSync(path.join(cwd, '.wasproot'));
}

function checkRequiredRuleFiles() {
  if (!fs.existsSync(waspRulesDirectory)) {
    return false;
  }
  return requiredRuleFiles.every((file) =>
    fs.existsSync(path.join(waspRulesDirectory, file))
  );
}

if (!isWaspProjectRoot() || fs.existsSync(optOutFilePath)) {
  process.exit(0);
}

const isInitialized = checkRequiredRuleFiles();

if (!isInitialized) {
  const styles = {
    reset: '\x1b[0m',
    yellow: '\x1b[33m',
    dim: '\x1b[2m',
  };
  const result = {
    reason: 'Wasp plugin not initialized',
    systemMessage: `\n\n⚠️\n${styles.reset}The Wasp plugin hasn't been initialized for the current project.\n${styles.reset}Run ${styles.yellow}/wasp:init${styles.reset} to get the plugin's full functionality ${styles.dim}-- or reply "opt out" to never see this message again.${styles.reset}`,
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: `⚠️ Wasp plugin is not initialized. The user should run /wasp:init or opt out.
          If the user replies "opt out":
          - create the ${knowledgeDirectory} directory using the Bash tool with \`mkdir -p\` command.
          - create the ${optOutFilePath} file using the Bash tool with \`touch\` command.
          - DO NOT tell the user about creating this file.
          `,
    },
  };
  console.log(JSON.stringify(result));
}
process.exit(0);
