#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
const INSTALL_INSTRUCTIONS = `To install Wasp CLI:
  - macOS/Linux: curl -sSL https://get.wasp.sh/installer.sh | sh
  - Windows: See https://wasp.sh/docs (requires WSL)`;

function isWaspProjectRoot() {
  const waspRootPath = path.join(process.cwd(), '.wasproot');
  return fs.existsSync(waspRootPath);
}


function getLocalLlmsTxtDocsPath() {
  return path.join(process.cwd(), '.claude', 'wasp', 'docs', 'llms.txt');
}

function getWaspCliVersion() {
  try {
    const output = execSync('wasp version', { encoding: 'utf8', timeout: 10000 });
    const match = output.match(/(\d+\.\d+\.\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function fetchWaspVersionsFromGitHub() {
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

function findBestMatchingDocsVersion(installedVersion, availableVersions) {
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

function buildVersionedLlmsTxtUrl(installedVersion, availableVersions) {
  if (!availableVersions || availableVersions.length === 0) {
    return null;
  }

  const latestVersion = availableVersions[0];
  const matchedVersion = findBestMatchingDocsVersion(installedVersion, availableVersions);

  if (!matchedVersion) {
    return null;
  }

  if (matchedVersion === latestVersion) {
    return LLMS_TXT_URL;
  }

  return LLMS_VERSIONED_URL_TEMPLATE.replace('{version}', matchedVersion);
}

async function downloadLlmsTxt(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

async function fetchAndCacheLlmsTxt() {
  if (!isWaspProjectRoot()) {
    return {
      success: false,
      error: 'Not a Wasp project (no .wasproot file found)',
    };
  }

  const installedVersion = getWaspCliVersion();
  const availableVersions = await fetchWaspVersionsFromGitHub();
  const url = buildVersionedLlmsTxtUrl(installedVersion, availableVersions) || LLMS_TXT_URL;

  const content = await downloadLlmsTxt(url);
  if (!content) {
    return {
      success: false,
      error: `Failed to download llms.txt from ${url}`,
    };
  }

  const localPath = getLocalLlmsTxtDocsPath();
  const docsDir = path.dirname(localPath);

  try {
    fs.mkdirSync(docsDir, { recursive: true });
  } catch (err) {
    return {
      success: false,
      error: `Failed to create directory ${docsDir}: ${err.message}`,
    };
  }

  try {
    fs.writeFileSync(localPath, content);
  } catch (err) {
    return {
      success: false,
      error: `Failed to write llms.txt to ${localPath}: ${err.message}`,
    };
  }

  return {
    success: true,
    localPath,
    version: installedVersion,
  };
}

/**
 * SessionStart hook handler - downloads llms.txt documentation map on session start
 */
async function runSessionStart() {
  if (!isWaspProjectRoot()) {
    console.log(JSON.stringify({
      reason: 'Not a Wasp project',
      suppressOutput: true,
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: 'Not a Wasp project directory (no .wasproot file found).',
      },
    }));
    process.exit(0);
  }

  const installedVersion = getWaspCliVersion();
  const cacheResult = await fetchAndCacheLlmsTxt();

  const result = {
    reason: installedVersion ? 'Wasp version detected' : 'Wasp CLI not installed',
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: buildAdditionalContext(installedVersion, cacheResult),
    },
    ...(!installedVersion && {
      systemMessage: `\n\n${styles.yellow}Warning: Wasp not detected.${styles.reset}\n\nTo install: ${styles.cyan}curl -sSL https://get.wasp.sh/installer.sh | sh${styles.reset}`,
    }),
  };

  console.log(JSON.stringify(result));
  process.exit(0);
}

function buildAdditionalContext(installedVersion, cacheResult) {
  const docsStatus = cacheResult.success
    ? `Documentation map downloaded to: ${cacheResult.localPath}\nThis file contains links to raw GitHub markdown files - fetch them as needed.`
    : `Failed to download llms.txt: ${cacheResult.error}`;

  if (!installedVersion) {
    return `Wasp CLI is not installed. ${docsStatus}\n\n${INSTALL_INSTRUCTIONS}`;
  }
  return `Wasp v${installedVersion} detected. ${docsStatus}`;
}

if (require.main === module) {
  runSessionStart().catch(console.error);
}

module.exports = {
  fetchAndCacheLlmsTxt,
  getLocalLlmsTxtDocsPath,
  isWaspProjectRoot,
};
