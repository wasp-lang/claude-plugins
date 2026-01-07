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

// const WASP_URL = 'https://wasp.sh/';
const WASP_URL = 'https://versioned-docs-map-llms-txt.wasp-docs-on-main.pages.dev/'; // test url for versioned docs map
const LLMS_TXT_URL = `${WASP_URL}llms.txt`;
const VERSIONS_URL = 'https://raw.githubusercontent.com/wasp-lang/wasp/refs/heads/release/web/versions.json';
const CACHE_TTL_HOURS = 24;
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

function getCacheMetadataPath() {
  return path.join(process.cwd(), '.claude', 'wasp', 'docs', 'cache-meta.json');
}

function majorMinorMatch(v1, v2) {
  if (!v1 || !v2) return false;
  const [m1, n1] = v1.split('.').map(Number);
  const [m2, n2] = v2.split('.').map(Number);
  return m1 === m2 && n1 === n2;
}

function buildVersionedUrl(version) {
  const [major, minor] = version.split('.');
  return `${WASP_URL}llms-${major}.${minor}.0.txt`;
}

function isCacheValid(localPath, metaPath, installedVersion) {
  if (!fs.existsSync(localPath) || !fs.existsSync(metaPath)) {
    return false;
  }

  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const ageHours = (Date.now() - new Date(meta.fetchedAt).getTime()) / (1000 * 60 * 60);

    return meta.waspVersion === installedVersion && ageHours < CACHE_TTL_HOURS;
  } catch {
    return false;
  }
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

  const localPath = getLocalLlmsTxtDocsPath();
  const metaPath = getCacheMetadataPath();
  const installedVersion = getWaspCliVersion();

  if (isCacheValid(localPath, metaPath, installedVersion)) {
    return { success: true, localPath, version: installedVersion, cached: true };
  }

  const versions = await fetchWaspVersionsFromGitHub();
  const latestVersion = versions?.[0];

  // Determine URL: if installed version matches latest, use main llms.txt
  // Otherwise, use versioned URL (e.g., llms-0.19.0.txt)
  let url = LLMS_TXT_URL;
  if (installedVersion && latestVersion && !majorMinorMatch(installedVersion, latestVersion)) {
    url = buildVersionedUrl(installedVersion);
  }

  let content = await downloadLlmsTxt(url);
  let sourceUrl = url;

  if (!content && url !== LLMS_TXT_URL) {
    content = await downloadLlmsTxt(LLMS_TXT_URL);
    sourceUrl = LLMS_TXT_URL;
  }

  if (!content) {
    // All fetches failed, use stale cache if available
    if (fs.existsSync(localPath)) {
      return { success: true, localPath, version: installedVersion, stale: true };
    }
    return { success: false, error: 'Failed to download llms.txt' };
  }

  const docsDir = path.dirname(localPath);
  try {
    fs.mkdirSync(docsDir, { recursive: true });
    fs.writeFileSync(localPath, content);
    fs.writeFileSync(metaPath, JSON.stringify({
      waspVersion: installedVersion,
      sourceUrl,
      fetchedAt: new Date().toISOString(),
    }));
  } catch (err) {
    return {
      success: false,
      error: `Failed to write cache: ${err.message}`,
    };
  }

  return { success: true, localPath, version: installedVersion, cached: false };
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

  const cacheResult = await fetchAndCacheLlmsTxt();

  const result = {
    reason: cacheResult.version ? `Wasp version ${cacheResult.version} detected` : 'Wasp CLI not installed',
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: buildAdditionalContext(cacheResult),
    },
    ...(!cacheResult.version && {
      systemMessage: `\n\n${styles.yellow}Warning: Wasp not detected.${styles.reset}\n\nTo install: ${styles.cyan}curl -sSL https://get.wasp.sh/installer.sh | sh${styles.reset}`,
    }),
  };

  console.log(JSON.stringify(result));
  process.exit(0);
}

function buildAdditionalContext(cacheResult) {
  let docsStatus;
  if (cacheResult.success) {
    if (cacheResult.cached) {
      docsStatus = `Using cached documentation map: ${cacheResult.localPath}`;
    } else if (cacheResult.stale) {
      docsStatus = `Using stale cache (download failed): ${cacheResult.localPath}`;
    } else {
      docsStatus = `Documentation map downloaded to: ${cacheResult.localPath}`;
    }
    docsStatus += '\nThis file contains links to raw GitHub markdown files - fetch them as needed.';
  } else {
    docsStatus = `Failed to get llms.txt: ${cacheResult.error}`;
  }

  if (!cacheResult.version) {
    return `Wasp CLI is not installed. ${docsStatus}\n\n${INSTALL_INSTRUCTIONS}`;
  }
  return `Wasp v${cacheResult.version} detected. ${docsStatus}`;
}

if (require.main === module) {
  runSessionStart().catch(console.error);
}

module.exports = {
  fetchAndCacheLlmsTxt,
  getLocalLlmsTxtDocsPath,
  isWaspProjectRoot,
};
