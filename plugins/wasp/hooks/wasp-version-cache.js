#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const styles = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
};

const LLMS_TXT_URL = 'https://wasp.sh/llms.txt';
const LLMS_VERSIONED_URL_TEMPLATE = 'https://wasp.sh/llms-{version}.txt';
const VERSIONS_URL = 'https://raw.githubusercontent.com/wasp-lang/wasp/refs/heads/release/web/versions.json';
const CACHE_FILE = path.join(os.tmpdir(), 'wasp-claude-version-cache.json');

function getWaspVersion() {
  try {
    const output = execSync('wasp version', { encoding: 'utf8', timeout: 10000 });
    const match = output.match(/(\d+\.\d+\.\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function fetchVersions() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(VERSIONS_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function findBestMatchingVersion(installedVersion, availableVersions) {
  if (!installedVersion || !availableVersions || availableVersions.length === 0) {
    return null;
  }

  if (availableVersions.includes(installedVersion)) {
    return installedVersion;
  }

  const [installedMajor, installedMinor] = installedVersion.split('.').map(Number);

  let bestMatch = null;
  for (const availableVersion of availableVersions) {
    const [vMajor, vMinor] = availableVersion.split('.').map(Number);

    if (vMajor === installedMajor && vMinor === installedMinor) {
      bestMatch = availableVersion;
      break;
    }

    if (vMajor < installedMajor || (vMajor === installedMajor && vMinor <= installedMinor)) {
      if (!bestMatch) {
        bestMatch = availableVersion;
      }
      break;
    }
  }

  return bestMatch || availableVersions[availableVersions.length - 1];
}

function getMatchedUrl(installedVersion, availableVersions) {
  if (!availableVersions || availableVersions.length === 0) {
    return null;
  }

  const latestVersion = availableVersions[0];
  const matchedVersion = findBestMatchingVersion(installedVersion, availableVersions);

  if (!matchedVersion) {
    return null;
  }

  if (matchedVersion === latestVersion) {
    return LLMS_TXT_URL;
  }

  return LLMS_VERSIONED_URL_TEMPLATE.replace('{version}', matchedVersion);
}

async function main() {
  const installedVersion = getWaspVersion();
  const availableVersions = await fetchVersions();

  // Default to latest llms.txt if no version info available
  const matchedUrl = getMatchedUrl(installedVersion, availableVersions) || LLMS_TXT_URL;

  const cache = {
    timestamp: Date.now(),
    installedVersion,
    availableVersions,
    matchedUrl,
  };

  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (err) {
    // Cache write failed, continue anyway
  }

  if (!installedVersion) {
    const result = {
      reason: 'Wasp CLI not installed',
      systemMessage: `\n\n${styles.yellow}⚠️  Wasp not detected.${styles.reset}\n\nTo install: ${styles.cyan}curl -sSL https://get.wasp.sh/installer.sh | sh${styles.reset}`,
      suppressOutput: true,
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: `Wasp CLI is not installed. Use the raw text docs URL: ${LLMS_TXT_URL} (latest).

To install Wasp CLI:
  - macOS/Linux: curl -sSL https://get.wasp.sh/installer.sh | sh
  - Windows: See https://wasp.sh/docs (requires WSL)`,
      },
    };
    console.log(JSON.stringify(result));
  } else {
    const result = {
      reason: 'Wasp version detected',
      suppressOutput: true,
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: `Wasp v${installedVersion} detected. Use the raw text docs URL: ${matchedUrl}.`,
      },
    };
    console.log(JSON.stringify(result));
  }

  process.exit(0);
}

// Only run when executed directly, not when imported
if (require.main === module) {
  main();
}

module.exports = { LLMS_TXT_URL, CACHE_FILE };
