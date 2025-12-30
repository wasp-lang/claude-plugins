#!/usr/bin/env node

// We want to block and reroute WebFetch requests to the HTML version of the Wasp documentation,
// because we already have versioned llms.txt files which map to the docs markdown files on GitHub.
// This way, LLMs don't need to parse the HTML, they can just fetch the raw markdown files directly.
let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', async () => {
  try {
    const data = JSON.parse(input);
    const toolName = data.tool_name || '';
    const toolInput = data.tool_input || {};
    if (toolName === 'WebFetch' && (toolInput.url.includes('wasp-lang.dev/docs') || toolInput.url.includes('wasp.sh/docs'))) {
      console.error(
        `BLOCKED: ${toolInput.url}\n\nPlease use https://wasp.sh/llms.txt instead to find the LLM-friendly documentation. The llms.txt contains a map of all Wasp documentation with raw.githubusercontent.com URLs that you can fetch directly.`
      );
      process.exit(2);
    }

    process.exit(0);
  } catch (err) {
    process.exit(0);
  }
});
