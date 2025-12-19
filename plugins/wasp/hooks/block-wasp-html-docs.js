#!/usr/bin/env node

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', async () => {
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';
    const toolInput = data.tool_input || {};

    // We only block WebFetch for Wasp docs and not WebSearch, because
    // WebSearch could return blogposts or 3rd-party tutorials, which we don't want to block.
    if (toolName === 'WebFetch') {
      const url = toolInput.url || '';

      const isWaspDocUrl =
        url.includes('wasp-lang.dev/docs') ||
        url.includes('wasp.sh/docs');

      if (isWaspDocUrl) {
        console.error(`BLOCKED: ${url}\n\nPlease use https://wasp.sh/llms.txt to find the LLM-friendly documentation. This file contains a map of all Wasp documentation with raw.githubusercontent.com URLs that you can fetch directly.`);
        process.exit(2);
      }
    }

    process.exit(0);
  } catch (err) {
    process.exit(0);
  }
});
