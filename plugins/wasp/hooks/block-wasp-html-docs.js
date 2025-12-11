#!/usr/bin/env node
const path = require('path');
const { execSync } = require('child_process');
const { isCacheFileValid, convertWaspDocUrlToCachePath } = require('./wasp-docs-cache-utils');

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', async () => {
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';
    const toolInput = data.tool_input || {};

    // We only block WebFetch for Wasp docs and not WebSearch, because
    // 1. WebSearch could return blogposts or 3rd-party tutorials, which we don't want to block.
    // 2. If WebSearch returns our own Wasp doc URLs, WebFetch will be called and it will be re-routed to cached docs.
    if (toolName === 'WebFetch') {
      const url = toolInput.url || '';

      const isWaspDocUrl = 
        url.includes('wasp-lang.dev/docs/') || 
        url.includes('wasp.sh/docs/') || 
        (url.includes('raw.githubusercontent.com') && url.includes('/wasp/') && url.includes('/docs/'));

      if (isWaspDocUrl) {
        const { cachePath } = convertWaspDocUrlToCachePath(url);

        if (cachePath) {
          if (isCacheFileValid(cachePath)) {
            console.error(`DOC_CACHED: ${cachePath}\n\nThis doc is already cached. Use the Read tool to access it.`);
            process.exit(2);
          }

          cacheAllDocsSync();
          console.error(`DOC_CACHED: ${cachePath}\n\nThis doc has been cached. Use the Read tool to access it.`);
          process.exit(2);
        }

        console.error(`BLOCKED: ${url}\n\nUse https://wasp.sh/llms.txt to find raw GitHub documentation URLs.`);
        process.exit(2);
      }
    }

    process.exit(0);
  } catch (err) {
    process.exit(0);
  }
});

function cacheAllDocsSync() {
  const cacheScript = path.join(__dirname, 'cache-all-wasp-docs.js');
  try {
    execSync(`node "${cacheScript}"`, { stdio: 'ignore' });
  } catch {
    // Ignore errors - best effort caching.
  }
}
