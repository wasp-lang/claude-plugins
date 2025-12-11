#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, '..');
const CACHE_DIR = path.join(PLUGIN_ROOT, 'knowledge', 'cached-docs');
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const LLMS_INDEX_URL = 'https://wasp.sh/llms.txt';
const CACHE_ALL_DOCS_SCRIPT_PATH = path.join(PLUGIN_ROOT, 'hooks', 'cache-all-wasp-docs.js');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function isCacheFileValid(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Date.now() - stats.mtimeMs < CACHE_TTL_MS;
  } catch {
    return false;
  }
}

// .../docs/auth/overview.md -> auth
function extractFolderFromRawGithubUrl(url) {
  const match = url.match(/\/docs\/([^/]+)\//);
  return match ? match[1] : null;
}

// .../docs/auth/social-auth/github.md -> social-auth_github.md
function extractFilenameFromRawGithubUrl(url) {
  const match = url.match(/\/docs\/[^/]+\/(.+)$/);
  return match ? match[1].replace(/\//g, '_') : null;
}

function parseDocsFromLlmsTxt(content) {
  const docs = [];

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Example: - [Title](url)
    const linkMatch = trimmed.match(/^-\s*\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [, , url] = linkMatch;
      if (url.includes('raw.githubusercontent.com') && url.includes('/docs/')) {
        const folder = extractFolderFromRawGithubUrl(url);
        const filename = extractFilenameFromRawGithubUrl(url);
        if (folder && filename) {
          docs.push({ folder, filename, url });
        }
      }
    }
  }

  return docs;
}

// Used in the block-wasp-html-docs hook to convert the URL to a cache path
// so we can check if the doc is already cached.
function convertWaspDocUrlToCachePath(url) {
  // Example: wasp.sh/docs/auth/overview -> { folder: 'auth', filename: 'overview.md' }
  const htmlMatch = url.match(/(?:wasp-lang\.dev|wasp\.sh)\/docs\/([^/?#]+)(?:\/([^/?#]+))?/);
  if (htmlMatch) {
    const folder = htmlMatch[1];
    const docPath = htmlMatch[2] || folder;
    return {
      folder,
      filename: docPath.replace(/\//g, '_') + '.md',
      cachePath: path.join(CACHE_DIR, folder, docPath.replace(/\//g, '_') + '.md')
    };
  }

  // Example: .../docs/auth/overview.md
  const rawMatch = url.match(/\/docs\/([^/]+)\/(.+)$/);
  if (rawMatch) {
    const folder = rawMatch[1];
    const filename = rawMatch[2].replace(/\//g, '_');
    return {
      folder,
      filename,
      cachePath: path.join(CACHE_DIR, folder, filename)
    };
  }

  return null;
}

// Cache all docs - only fetches docs that don't exist or are expired
async function fetchAndCacheAllDocs() {
  const content = await fetchUrl(LLMS_INDEX_URL);
  const docs = parseDocsFromLlmsTxt(content);

  const results = { fetched: 0, skipped: 0, errors: [] };

  for (const doc of docs) {
    const folderPath = path.join(CACHE_DIR, doc.folder);
    const cachePath = path.join(folderPath, doc.filename);

    if (isCacheFileValid(cachePath)) {
      results.skipped++;
      continue;
    }

    try {
      fs.mkdirSync(folderPath, { recursive: true });
      const docContent = await fetchUrl(doc.url);
      fs.writeFileSync(cachePath, docContent);
      results.fetched++;
    } catch (err) {
      results.errors.push(`${doc.folder}/${doc.filename}: ${err.message}`);
    }
  }

  return results;
}

module.exports = {
  CACHE_DIR,
  CACHE_TTL_MS,
  CACHE_ALL_DOCS_SCRIPT_PATH,
  isCacheFileValid,
  convertWaspDocUrlToCachePath,
  fetchAndCacheAllDocs,
};
