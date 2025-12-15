#!/usr/bin/env node

const { execSync } = require('child_process');

const VERSIONS_URL = 'https://raw.githubusercontent.com/wasp-lang/wasp/refs/heads/release/web/versions.json';

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
    const response = await fetch(VERSIONS_URL);
    if (!response.ok) return null;
    return await response.json(); // Returns array of versions ["0.19.0", "0.18.0", "0.17.0"]
  } catch {
    return null;
  }
}

function findBestMatchingVersion(installedVersion, allAvailableVersions) {
  if (!installedVersion || !allAvailableVersions || allAvailableVersions.length === 0) {
    return null;
  }

  if (allAvailableVersions.includes(installedVersion)) {
    return installedVersion;
  }

  // Parse installed version: "0.19.0" → major=0, minor=19 disregard the patch version
  const [installedMajor, installedMinor] = installedVersion.split('.').map(Number);

  // Find best match (same major.minor or closest lower version)
  let bestMatch = null;
  for (const availableVersion of allAvailableVersions) {
    const [vMajor, vMinor] = availableVersion.split('.').map(Number);

    // Prefer same major.minor (e.g., "0.19.5" matches "0.19.0")
    if (vMajor === installedMajor && vMinor === installedMinor) {
      bestMatch = availableVersion;
      break;
    }

    // Otherwise find closest lower or equal version
    // For Wasp versions (0.x.x), this checks if vMinor <= installedMinor
    if (vMajor < installedMajor || (vMajor === installedMajor && vMinor <= installedMinor)) {
      if (!bestMatch) {
        bestMatch = availableVersion;
      }
      break;
    }
  }

  return bestMatch || allAvailableVersions[allAvailableVersions.length - 1]; // fallback to oldest
}

function getMatchedUrl(installedVersion, availableVersions) {
  if (!availableVersions || availableVersions.length === 0) {
    return null;
  }

  const latestVersion = availableVersions[0]; // First version in array is the latest
  const matchedVersion = findBestMatchingVersion(installedVersion, availableVersions);

  if (!matchedVersion) {
    return null;
  }

  if (matchedVersion === latestVersion) {
    return 'https://wasp.sh/llms.txt';
  }

  // Otherwise use version-specific URL (e.g., llms-0.18.0.txt)
  return `https://wasp.sh/llms-${matchedVersion}.txt`;
}

function extractVersionFromUrl(url) {
  // Match llms-X.Y.Z.txt pattern
  const versionMatch = url.match(/llms-(\d+\.\d+\.\d+)\.txt/);
  if (versionMatch) {
    return versionMatch[1];
  }
  // If it's just llms.txt, it's the latest version
  if (/llms\.txt$/.test(url)) {
    return 'latest';
  }
  return null;
}

let input = '';
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', async () => {
  try {
    const data = JSON.parse(input);
    const toolInput = data.tool_input || {};

    const url = toolInput.url || '';

    // Check if URL matches wasp.sh/llms*.txt pattern
    const llmsUrlPattern = /wasp\.sh\/llms[^/]*\.txt/;
    if (!llmsUrlPattern.test(url)) {
      return process.exit(0);
    }

    const installedVersion = getWaspVersion();
    if (!installedVersion) {
      console.error('Check that Wasp is installed and try again.');
      return process.exit(0);
    }

    const availableVersions = await fetchVersions();
    if (!availableVersions) {
      console.error('versions.json is not available.');
      return process.exit(0);
    }

    const matchedUrl = getMatchedUrl(installedVersion, availableVersions);

    // If URLs match, allow the request through
    if (!matchedUrl || matchedUrl === url) {
      return process.exit(0);
    }

    // Version mismatch detected - block and inform the user
    const requestedVersion = extractVersionFromUrl(url);
    const requestedVersionDisplay = requestedVersion === 'latest' ? 'latest' : `v${requestedVersion}`;

    const message = `
VERSION MISMATCH DETECTED

You requested Wasp docs for: ${requestedVersionDisplay}
Your installed Wasp version: v${installedVersion}
Recommended docs URL: ${matchedUrl}

Please choose how to proceed:
1. Use the recommended URL (${matchedUrl}) - matches your installed version
2. Continue with the original URL (${url}) - may have incompatible information

Tell Claude which option you prefer.
`.trim();

    console.error(message);
    process.exit(2); // Block the request so user can choose
  } catch (err) {
    // On error, allow original request
    process.exit(0);
  }
});
