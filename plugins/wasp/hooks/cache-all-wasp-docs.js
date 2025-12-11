#!/usr/bin/env node
const { fetchAndCacheAllDocs } = require('./wasp-docs-cache-utils');

async function main() {
  try {
    const results = await fetchAndCacheAllDocs();

    // Output results for debugging when run manually.
    if (results.fetched > 0 || results.errors.length > 0) {
      console.log(`Cached ${results.fetched} docs, skipped ${results.skipped} (already cached)`);
      if (results.errors.length > 0) {
        console.error(`Errors: ${results.errors.join(', ')}`);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(`Failed to cache docs: ${err.message}`);
    process.exit(1);
  }
}

main();
