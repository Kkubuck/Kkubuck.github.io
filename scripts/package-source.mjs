/**
 * Writes a distributable zip of the source tree next to the project folder.
 *
 *   npm run package
 *
 * Output: ../<folder-name>-source.zip
 *
 * The archive is built from an allow-list, not a deny-list: only files git
 * tracks go in (with their current working-tree contents), so build output,
 * dependencies, caches and anything untracked, such as a stray key or a local
 * .env, stay out wherever they sit. On top of that, secret-shaped file names
 * are refused at any depth even when tracked; `.env.example` is the one dotenv
 * file allowed, because it documents the available variables.
 *
 * Untracked files are listed as a warning so a new post that was never
 * `git add`-ed is noticed rather than silently missing.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { rm, stat } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const output = join(dirname(root), `${basename(root)}-source.zip`);

/** File names that never belong in a source archive, matched against each file's base name. */
const SECRET_NAMES = [
  /^\.env(?:\..+)?$/, // .env, .env.local, .env.production, ...
  /^\.npmrc$/,
  /^\.netrc$/,
  /^id_(?:rsa|dsa|ecdsa|ed25519)(?:\.pub)?$/,
  /\.(?:pem|key|p12|pfx|jks|keystore|kdbx|gpg)$/i,
  /^settings\.local\.json$/,
  /^(?:credentials|secrets?)(?:\..+)?$/i
];
const ALLOWED = new Set(['.env.example']);

/**
 * Runs a command in the project root and returns its stdout.
 * @param {string} command
 * @param {string[]} args
 * @param {string} [input] written to stdin
 * @returns {Promise<string>}
 */
function run(command, args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: ['pipe', 'pipe', 'inherit'] });
    let stdout = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => (stdout += chunk));
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve(stdout) : reject(new Error(`${command} exited with code ${code}`))));
    child.stdin.end(input ?? '');
  });
}

/** @param {string} text NUL-separated output of `git ls-files -z` */
const lines = (text) => text.split('\0').filter(Boolean);

/** @param {string} path */
const isSecret = (path) => {
  const name = basename(path);
  return !ALLOWED.has(name) && SECRET_NAMES.some((pattern) => pattern.test(name));
};

try {
  if (!existsSync(join(root, '.git'))) throw new Error('Not a git repository: the archive is built from the files git tracks.');

  const tracked = lines(await run('git', ['ls-files', '-z', '--cached']));
  const deleted = new Set(lines(await run('git', ['ls-files', '-z', '--deleted'])));
  const untracked = lines(await run('git', ['ls-files', '-z', '--others', '--exclude-standard']));

  const refused = tracked.filter(isSecret);
  const files = tracked.filter((path) => !deleted.has(path) && !isSecret(path));

  await rm(output, { force: true });
  // -@ reads the file list from stdin, so nothing outside it can be added.
  await run('zip', ['-q', '-X', '-@', output], `${files.join('\n')}\n`);

  const { size } = await stat(output);
  console.log(`Wrote ${output} (${files.length} files, ${(size / 1024 / 1024).toFixed(2)} MB).`);
  if (refused.length) console.warn(`Left out secret-shaped tracked files: ${refused.join(', ')}`);
  if (untracked.length) console.warn(`Not tracked by git, so not included: ${untracked.join(', ')}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  console.error('If git or zip is unavailable, use `git archive --format=zip -o ../source.zip HEAD` instead.');
  process.exit(1);
}
