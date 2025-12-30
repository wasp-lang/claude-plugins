#!/usr/bin/env node

/**
 * Pre-WebFetch Hook: Wasp Documentation Redirect
 *
 * Intercepts WebFetch requests to Wasp documentation URLs and redirects them
 * to the local llms.txt documentation map when available. The llms.txt file
 * contains links to raw GitHub markdown files that Claude can fetch as needed.
 *
 * Intercepts:
 * - wasp.sh/llms*.txt (e.g., llms.txt, llms-0.15.txt)
 * - wasp.sh/docs/*
 * - wasp-lang.dev/docs/*
 *
 * Only intercepts WebFetch (not WebSearch) since WebSearch may return
 * blog posts or third-party tutorials.
 */

const fs = require('fs');
const { fetchAndCacheLlmsTxt, getLocalLlmsTxtDocsPath, isWaspProjectRoot } = require('./fetch-llms-txt.js');

const HOOK_ALLOW = 0;
const HOOK_BLOCK = 2;

function matchesWaspDocsPattern(url) {
  const llmsPattern = /wasp\.sh\/llms[^/]*\.txt/;
  const docsPattern = /(wasp\.sh|wasp-lang\.dev)\/docs\//;
  return llmsPattern.test(url) || docsPattern.test(url);
}

function buildRedirectMessage(url, localDocsPath) {
  return `INTERCEPTED: Use local documentation map instead

Requested URL: ${url}
Documentation map: ${localDocsPath}

Read the llms.txt file to find raw GitHub markdown URLs for the topic you need:
  Read file: ${localDocsPath}

Then fetch the relevant raw GitHub markdown files listed in the map.`;
}

function redirectToLocalDocs(url, localDocsPath) {
  console.error(buildRedirectMessage(url, localDocsPath));
  process.exit(HOOK_BLOCK);
}

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', async () => {
  try {
    const { tool_name: toolName = '', tool_input: toolInput = {} } = JSON.parse(input);

    if (toolName !== 'WebFetch') {
      return process.exit(HOOK_ALLOW);
    }

    const url = toolInput.url || '';

    if (!matchesWaspDocsPattern(url) || !isWaspProjectRoot()) {
      return process.exit(HOOK_ALLOW);
    }

    const localDocsPath = getLocalLlmsTxtDocsPath();

    if (fs.existsSync(localDocsPath)) {
      return redirectToLocalDocs(url, localDocsPath);
    }

    // Attempt to fetch and cache llms.txt if not present locally
    try {
      const fetched = await fetchAndCacheLlmsTxt();
      if (fetched && fs.existsSync(localDocsPath)) {
        return redirectToLocalDocs(url, localDocsPath);
      }
    } catch {
      // Fetch failed - fall through to allow original network request
    }

    process.exit(HOOK_ALLOW);
  } catch {
    // Fail-open on malformed input
    process.exit(HOOK_ALLOW);
  }
});
