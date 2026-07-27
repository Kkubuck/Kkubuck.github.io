/**
 * Writes a distributable zip of the source tree next to the project folder.
 *
 * Build output, dependencies, caches, and every dotenv file are excluded, so
 * the archive is what belongs in a repository and nothing else. `.env.example`
 * is added back deliberately because it documents the available variables.
 *
 *   pnpm run package
 *
 * Output: ../<folder-name>-source.zip
 */
import { spawn } from 'node:child_process';
import { basename, dirname, join } from 'node:path';
import { rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const output = join(dirname(root), `${basename(root)}-source.zip`);

// Anything secret-shaped is excluded wholesale rather than by allow-list.
const EXCLUDES = [
  'node_modules/*',
  'dist/*',
  '.astro/*',
  '.git/*',
  '.env*',
  '*.log',
  '*.pem',
  '*.key',
  '.DS_Store',
  '*/.DS_Store',
  'coverage/*',
  'test-results/*',
  'playwright-report/*',
  'test-artifacts/*'
];

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('zip', args, { cwd: root, stdio: ['ignore', 'inherit', 'inherit'] });
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`zip exited with code ${code}`))
    );
  });
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

try {
  await rm(output, { force: true });
  await run(['-r', '-q', '-X', output, '.', '-x', ...EXCLUDES]);

  if (await exists(join(root, '.env.example'))) {
    await run(['-q', '-X', output, '.env.example']);
  }

  const { size } = await stat(output);
  console.log(`Wrote ${output} (${(size / 1024 / 1024).toFixed(2)} MB).`);
} catch (error) {
  console.error(error.message);
  console.error('If zip is unavailable, archive the folder manually and delete node_modules, dist, .astro, and .env* first.');
  process.exit(1);
}
