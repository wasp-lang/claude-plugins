#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
const CACHE_ALL_DOCS_SCRIPT_PATH = path.join(PLUGIN_ROOT, 'hooks', 'cache-all-wasp-docs.js');

try {
  if (fs.existsSync(CACHE_ALL_DOCS_SCRIPT_PATH)) {
    const child = spawn('node', [CACHE_ALL_DOCS_SCRIPT_PATH], {
      detached: true,
      stdio: 'ignore',
      cwd: path.join(PLUGIN_ROOT, 'hooks')
    });
    child.unref();
  }

  console.log(JSON.stringify({ continue: true, suppressOutput: false }));
  process.exit(0);
} catch (error) {
  console.log(JSON.stringify({ continue: true, suppressOutput: false }));
  process.exit(0);
}
