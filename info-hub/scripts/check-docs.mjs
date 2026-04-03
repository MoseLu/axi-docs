import { stat } from 'node:fs/promises';

const requiredFiles = [
  'README.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'TESTING.md',
  '.czrc',
  'commitlint.config.cjs',
  'eslint.config.js',
  'docs/GITHUB_FLOW.md',
  'docs/BRANCH_PROTECTION.md',
  'docs/COMMIT_CONVENTION.md',
  'docs/RELEASE_OPERATIONS.md',
  'docs/QUALITY_GATE.md',
  'docs/OPERATIONS.md',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/workflows/ci.yml',
];

const missingFiles = [];

for (const filePath of requiredFiles) {
  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      missingFiles.push(filePath);
    }
  } catch {
    missingFiles.push(filePath);
  }
}

if (missingFiles.length > 0) {
  throw new Error(`Missing required governance docs: ${missingFiles.join(', ')}`);
}

console.log('[governance] docs gate passed.');
