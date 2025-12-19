#!/usr/bin/env node

const fs = require('fs');
const { LLMS_TXT_URL, CACHE_FILE } = require('./wasp-version-cache.js');

const CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 4;

function loadCache() {
  try {
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (Date.now() - data.timestamp < CACHE_MAX_AGE_MS) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function extractVersionFromUrl(url) {
  // Match llms-X.Y.Z.txt pattern
  const versionMatch = url.match(/llms-(\d+\.\d+\.\d+)\.txt/);
  if (versionMatch) {
    return versionMatch[1];
  }
  if (/llms\.txt$/.test(url)) {
    return 'latest';
  }
  return null;
}

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {

    const data = JSON.parse(input);
    const toolInput = data.tool_input || {};

    const url = toolInput.url || '';

    // Check if URL matches wasp.sh/llms*.txt pattern
    const llmsUrlPattern = /wasp\.sh\/llms[^/]*\.txt/;
    if (!llmsUrlPattern.test(url)) {
      return process.exit(0);
    }

    const cache = loadCache();
    if (!cache) {
      console.error('Version cache not available. Run a new session to enable version matching.');
      return process.exit(0);
    }

    const { installedVersion, matchedUrl } = cache;

    const effectiveMatchedUrl = matchedUrl || LLMS_TXT_URL;

    // If CLI not installed, allow default llms.txt but warn on versioned URLs
    if (!installedVersion) {
      if (url === LLMS_TXT_URL) {
        return process.exit(0);
      }

      const installMsg = `
Wasp CLI not detected.

You requested: ${url}
Recommended: ${LLMS_TXT_URL} (latest)

Reply "latest" to use recommended, or "original" to continue.
`.trim();
      console.error(installMsg);
      return process.exit(2);
    }

    // If no version mismatch, allow the request through
    if (effectiveMatchedUrl === url) {
      return process.exit(0);
    }

    // Version mismatch detected - block and inform the user
    const requestedVersion = extractVersionFromUrl(url);

    const versionMsg = `
VERSION MISMATCH DETECTED

You requested Wasp docs for: ${requestedVersion}
Your installed Wasp version: v${installedVersion}
Recommended docs URL: ${effectiveMatchedUrl}

Please choose how to proceed:
1. Use the recommended URL (${effectiveMatchedUrl}) - matches your installed version
2. Continue with the original URL (${url}) - may have incompatible information

Tell Claude which option you prefer.
`.trim();

    console.error(versionMsg);
    process.exit(2); // Block the request so user can choose
});
