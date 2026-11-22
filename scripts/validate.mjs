#!/usr/bin/env node
// Static validator for the KCoder plugin marketplace in this repository.
// It mirrors the rules KCoder applies when it loads a marketplace snapshot and
// adds repository policy (no symlinks, no secrets, pinned remote sources).
// Zero dependencies; requires Node.js 20 or newer.
import { lstatSync, readdirSync, readFileSync } from 'node:fs';
import { isAbsolute, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const MARKETPLACE_PATH = '.agents/plugins/marketplace.json';
export const PLUGIN_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
export const MCP_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json';

// Same pattern as the Agent Plugins 1.0.0 schema embedded in KCoder.
const NAME_RE = /^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
const PLUGIN_FIELDS = new Set(['$schema', 'name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords', 'extensions']);
const AUTHOR_FIELDS = new Set(['name', 'email', 'url']);
const MCP_SERVER_FIELDS = new Set(['type', 'command', 'args', 'env', 'url', 'headers', 'cwd']);
const INSTALL_POLICIES = new Set(['AVAILABLE', 'NOT_AVAILABLE', 'INSTALLED_BY_DEFAULT']);
const AUTH_POLICIES = new Set(['ON_INSTALL', 'ON_USE']);
const HOOK_EVENTS = new Set([
  'SessionStart', 'SessionEnd', 'Setup', 'UserPromptSubmit', 'Stop', 'StopFailure', 'PreToolUse', 'PostToolUse',
  'PostToolUseFailure', 'PermissionRequest', 'SubagentStart', 'SubagentStop', 'PreCompact', 'PostCompact', 'Notification',
]);
const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const MAX_PLUGIN_ENTRIES = 2000;
const MAX_PLUGIN_BYTES = 20 * 1024 * 1024;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_MANIFEST_BYTES = 1024 * 1024;
const SECRET_PATTERNS = [
  [/\bghp_[A-Za-z0-9]{30,}/, 'GitHub token'],
  [/\bgithub_pat_[A-Za-z0-9_]{30,}/, 'GitHub token'],
  [/\bsk-[A-Za-z0-9_-]{20,}/, 'API key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
];
// Template env files (.env.example/.env.template/.env.sample) are allowed; their content is still scanned.
const FORBIDDEN_FILES = [/^\.env(?:\.(?!example$|template$|sample$).*)?$/, /\.pem$/, /^id_(?:rsa|ed25519|ecdsa)$/];
// Adapted upstream packages may be larger; KCoder enforces its own install limits.
const VENDOR_LIMITS = { entries: 10000, bytes: 100 * 1024 * 1024, file: 20 * 1024 * 1024 };

class Report {
  constructor() { this.errors = []; this.warnings = []; }
  error(where, message) { this.errors.push(`${where}: ${message}`); }
  warn(where, message) { this.warnings.push(`${where}: ${message}`); }
}

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isString = value => typeof value === 'string';

function readJson(path, where, report) {
  let info;
  try { info = lstatSync(path); } catch { report.error(where, 'file is missing'); return undefined; }
  if (info.isSymbolicLink() || !info.isFile()) { report.error(where, 'must be a regular file'); return undefined; }
  if (info.size > MAX_MANIFEST_BYTES) { report.error(where, `exceeds ${MAX_MANIFEST_BYTES} bytes`); return undefined; }
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch (error) { report.error(where, `invalid JSON (${error.message})`); return undefined; }
}

/** Resolve a `./`-relative resource and prove it stays under `base`. */
function containedPath(base, value) {
  if (!isString(value) || !value.startsWith('./') || isAbsolute(value) || value.includes('\\')) return null;
  const target = resolve(base, normalize(value));
  const rel = relative(base, target);
  if (rel === '' ) return target;
  if (rel.startsWith('..') || isAbsolute(rel) || rel.split(sep).includes('..')) return null;
  return target;
}

function existsAs(path, kind) {
  try {
    const info = lstatSync(path);
    if (info.isSymbolicLink()) return false;
    return kind === 'dir' ? info.isDirectory() : info.isFile();
  } catch { return false; }
}

function walkPlugin(root, where, report, limits = { entries: MAX_PLUGIN_ENTRIES, bytes: MAX_PLUGIN_BYTES, file: MAX_FILE_BYTES }) {
  let entries = 0;
  let bytes = 0;
  const textFiles = [];
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      const rel = relative(root, path);
      entries += 1;
      if (entries > limits.entries) { report.error(where, `more than ${limits.entries} files and directories`); return textFiles; }
      const info = lstatSync(path);
      if (info.isSymbolicLink()) { report.error(`${where}/${rel}`, 'symlinks are not allowed'); continue; }
      if (info.isDirectory()) { stack.push(path); continue; }
      if (!info.isFile()) { report.error(`${where}/${rel}`, 'only regular files are allowed'); continue; }
      if (FORBIDDEN_FILES.some(pattern => pattern.test(name))) report.error(`${where}/${rel}`, 'credential-like files must not be published');
      if (info.size > limits.file) report.error(`${where}/${rel}`, `file exceeds ${limits.file} bytes`);
      bytes += info.size;
      if (info.size <= limits.file) textFiles.push(path);
    }
  }
  if (bytes > limits.bytes) report.error(where, `plugin exceeds ${limits.bytes} bytes`);
  return textFiles;
}

function scanSecrets(files, root, where, report, allow = new Set()) {
  for (const path of files) {
    if (allow.has(`${where}/${relative(root, path).split(sep).join('/')}`)) continue;
    const buffer = readFileSync(path);
    if (buffer.includes(0)) continue; // Binary file.
    const text = buffer.toString('utf8');
    for (const [pattern, label] of SECRET_PATTERNS) {
      if (pattern.test(text)) report.error(`${where}/${relative(root, path)}`, `looks like it contains a ${label}`);
    }
  }
}

// Manifest locations KCoder also loads; adapted third-party plugins keep theirs.
const VENDOR_MANIFESTS = ['.kcoder-plugin/plugin.json', '.codex-plugin/plugin.json', '.claude-plugin/plugin.json', '.cursor-plugin/plugin.json', '.grok-plugin/plugin.json', '.codebuddy-plugin/plugin.json', 'kcoder-plugin.json'];

// Plugins authored here use Agent Plugins 1.0.0; adapted copies carry UPSTREAM.md.
function isAgentPlugin(root) {
  return !existsAs(join(root, 'UPSTREAM.md'), 'file');
}

/** Adapted packages are format-checked by a real KCoder install; here we only require a readable manifest. */
function validateVendorManifest(root, where, report, entry) {
  const found = [...VENDOR_MANIFESTS, 'plugin.json'].filter(path => existsAs(join(root, path), 'file'));
  // Like upstream, a non-strict entry may define the plugin by its skill list.
  if (!found.length && entry?.strict === false && Array.isArray(entry.skills) && entry.skills.length) {
    for (const skill of entry.skills) {
      const dir = containedPath(root, skill);
      if (!dir || !existsAs(join(dir, 'SKILL.md'), 'file')) report.error(where, `listed skill ${skill} is missing SKILL.md`);
    }
    return;
  }
  if (!found.length) { report.error(where, 'no plugin manifest found'); return; }
  for (const path of found) {
    const manifest = readJson(join(root, path), `${where}/${path}`, report);
    if (manifest !== undefined && !isObject(manifest)) report.error(`${where}/${path}`, 'must be a JSON object');
  }
}

function validateUpstream(root, where, report) {
  const path = join(root, 'UPSTREAM.md');
  if (!existsAs(path, 'file')) { report.error(where, 'adapted third-party plugins need UPSTREAM.md'); return; }
  const text = readFileSync(path, 'utf8');
  if (!/https:\/\//.test(text) || !/\b[0-9a-f]{40}\b/.test(text)) report.error(`${where}/UPSTREAM.md`, 'must name the upstream URL and the full commit it is based on');
}

function validatePluginManifest(root, where, report) {
  const manifest = readJson(join(root, 'plugin.json'), `${where}/plugin.json`, report);
  if (manifest === undefined) return undefined;
  const at = `${where}/plugin.json`;
  if (!isObject(manifest)) { report.error(at, 'must be a JSON object'); return undefined; }
  if (manifest.$schema !== PLUGIN_SCHEMA) report.error(at, `$schema must be ${PLUGIN_SCHEMA}`);
  for (const key of Object.keys(manifest)) if (!PLUGIN_FIELDS.has(key)) report.error(at, `unknown field \`${key}\``);
  if (!isString(manifest.name) || manifest.name.length > 64 || !NAME_RE.test(manifest.name)) {
    report.error(at, '`name` must be 1-64 lowercase letters, digits, `.` or `-`, without `--` or `..`');
  }
  for (const key of ['version', 'description', 'homepage', 'repository', 'license']) {
    if (manifest[key] !== undefined && !isString(manifest[key])) report.error(at, `\`${key}\` must be a string`);
  }
  if (manifest.author !== undefined) {
    if (!isObject(manifest.author)) report.error(at, '`author` must be an object');
    else for (const [key, value] of Object.entries(manifest.author)) {
      if (!AUTHOR_FIELDS.has(key)) report.error(at, `unknown \`author.${key}\``);
      else if (!isString(value)) report.error(at, `\`author.${key}\` must be a string`);
    }
  }
  if (manifest.keywords !== undefined && !(Array.isArray(manifest.keywords) && manifest.keywords.every(isString))) {
    report.error(at, '`keywords` must be an array of strings');
  }
  if (manifest.extensions !== undefined && !(isObject(manifest.extensions) && Object.values(manifest.extensions).every(isObject))) {
    report.error(at, '`extensions` must map namespaces to objects');
  }
  if (!isString(manifest.version) || !SEMVER_RE.test(manifest.version)) report.warn(at, '`version` should be a semantic version');
  if (!isString(manifest.description) || !manifest.description.trim()) report.warn(at, '`description` is recommended for the marketplace card');
  return manifest;
}

function validateSkills(root, where, report) {
  const skills = join(root, 'skills');
  if (!existsAs(skills, 'dir')) return;
  for (const name of readdirSync(skills).sort()) {
    const dir = join(skills, name);
    if (!existsAs(dir, 'dir')) continue;
    const at = `${where}/skills/${name}/SKILL.md`;
    const file = join(dir, 'SKILL.md');
    if (!existsAs(file, 'file')) { report.error(at, 'missing; every skill directory needs SKILL.md'); continue; }
    const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(readFileSync(file, 'utf8'));
    if (!match) { report.error(at, 'must start with YAML front matter delimited by `---`'); continue; }
    const fields = Object.fromEntries(match[1].split(/\r?\n/)
      .map(line => /^([A-Za-z_-]+):\s*(.*)$/.exec(line)).filter(Boolean).map(([, key, value]) => [key, value.trim()]));
    if (!fields.name) report.error(at, 'front matter needs `name`');
    else if (fields.name !== name) report.warn(at, `front matter name \`${fields.name}\` differs from directory \`${name}\``);
    if (!fields.description) report.error(at, 'front matter needs `description`');
  }
}

function validatePlaceholders(value, root, at, report, field) {
  const placeholders = [...value.matchAll(/\$\{([A-Z_]+)\}/g)].map(match => match[1]);
  for (const name of placeholders) {
    if (name !== 'PLUGIN_ROOT' && name !== 'PLUGIN_DATA') report.warn(at, `\`${field}\` keeps \${${name}} literally; only PLUGIN_ROOT and PLUGIN_DATA expand`);
  }
  const bundled = /^\$\{PLUGIN_ROOT\}\/(.+)$/.exec(value);
  if (bundled) {
    const target = containedPath(root, `./${bundled[1]}`);
    if (!target) report.error(at, `\`${field}\` escapes the plugin root`);
    else if (!existsAs(target, 'file') && !existsAs(target, 'dir')) report.error(at, `\`${field}\` refers to missing ${bundled[1]}`);
  }
}

function validateMcp(root, where, report) {
  const path = join(root, 'mcp.json');
  if (!existsAs(path, 'file')) return;
  const at = `${where}/mcp.json`;
  const document = readJson(path, at, report);
  if (!isObject(document)) { if (document !== undefined) report.error(at, 'must be a JSON object'); return; }
  if (document.$schema !== MCP_SCHEMA) report.error(at, `$schema must be ${MCP_SCHEMA}`);
  if (!isObject(document.mcpServers)) { report.error(at, '`mcpServers` must be an object'); return; }
  for (const [name, server] of Object.entries(document.mcpServers)) {
    const sat = `${at} server \`${name}\``;
    if (!isObject(server)) { report.error(sat, 'must be an object'); continue; }
    for (const key of Object.keys(server)) if (!MCP_SERVER_FIELDS.has(key)) report.error(sat, `unknown field \`${key}\``);
    if (server.type === 'stdio') {
      if (!isString(server.command) || !server.command.trim()) report.error(sat, 'stdio servers need `command`');
      else if (server.command.includes('${')) report.error(sat, '`command` is not expanded; put ${PLUGIN_ROOT} paths in `args`');
      if (server.args !== undefined && !(Array.isArray(server.args) && server.args.every(isString))) report.error(sat, '`args` must be strings');
      else for (const arg of server.args ?? []) validatePlaceholders(arg, root, sat, report, 'args');
      if (server.cwd !== undefined) {
        if (!isString(server.cwd)) report.error(sat, '`cwd` must be a string');
        else if (!/^\$\{PLUGIN_(?:ROOT|DATA)\}(?:\/|$)/.test(server.cwd)) report.error(sat, '`cwd` must stay under ${PLUGIN_ROOT} or ${PLUGIN_DATA}');
      }
      if (server.url !== undefined || server.headers !== undefined) report.error(sat, 'stdio servers do not take `url` or `headers`');
    } else if (server.type === 'streamable-http' || server.type === 'sse') {
      let url;
      try { url = new URL(server.url); } catch { report.error(sat, 'remote servers need a valid `url`'); }
      if (url && url.protocol !== 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) report.error(sat, 'remote `url` must use https');
      if (url && (url.username || url.password)) report.error(sat, '`url` must not embed credentials');
      if (server.command !== undefined || server.args !== undefined || server.cwd !== undefined) report.error(sat, 'remote servers do not take `command`, `args` or `cwd`');
    } else {
      report.error(sat, '`type` must be `stdio`, `streamable-http` or `sse`');
    }
    for (const key of ['env', 'headers']) {
      if (server[key] !== undefined && !(isObject(server[key]) && Object.values(server[key]).every(isString))) report.error(sat, `\`${key}\` values must be strings`);
    }
  }
}

function validateHooksFile(root, path, at, report) {
  const document = readJson(path, at, report);
  if (document === undefined) return;
  const hooks = isObject(document) ? document.hooks : undefined;
  if (!isObject(hooks)) { report.error(at, 'must contain a `hooks` object keyed by event'); return; }
  for (const [event, groups] of Object.entries(hooks)) {
    if (!HOOK_EVENTS.has(event)) report.warn(at, `event \`${event}\` is not a commonly emitted KCoder event; verify it fires`);
    if (!Array.isArray(groups)) { report.error(at, `\`${event}\` must be an array`); continue; }
    for (const group of groups) {
      if (!isObject(group) || !Array.isArray(group.hooks) || group.hooks.length === 0) { report.error(at, `\`${event}\` entries need a non-empty \`hooks\` array`); continue; }
      if (group.matcher !== undefined && !isString(group.matcher)) report.error(at, `\`${event}\` matcher must be a string`);
      for (const hook of group.hooks) {
        if (!isObject(hook)) { report.error(at, `\`${event}\` hook must be an object`); continue; }
        if (hook.type === 'command') {
          if (!isString(hook.command) || !hook.command.trim()) report.error(at, `\`${event}\` command hook needs \`command\``);
        } else if (hook.type === 'http') {
          if (!isString(hook.url) || !hook.url.startsWith('https://')) report.error(at, `\`${event}\` http hook needs an https \`url\``);
        } else {
          report.error(at, `\`${event}\` hook \`type\` must be \`command\` or \`http\``);
        }
        if (hook.timeout !== undefined && !(Number.isInteger(hook.timeout) && hook.timeout > 0)) report.error(at, `\`${event}\` timeout must be a positive integer`);
      }
    }
  }
}

function validateOverlay(root, where, report) {
  const path = join(root, '.codex-plugin/plugin.json');
  if (!existsAs(path, 'file')) {
    if (existsAs(join(root, 'hooks/hooks.json'), 'file')) report.warn(where, 'hooks/hooks.json is ignored without a `.codex-plugin/plugin.json` overlay that references it');
    return;
  }
  const at = `${where}/.codex-plugin/plugin.json`;
  const overlay = readJson(path, at, report);
  if (!isObject(overlay)) { if (overlay !== undefined) report.error(at, 'must be a JSON object'); return; }
  if (overlay.hooks !== undefined) {
    const target = containedPath(root, overlay.hooks);
    if (!target) report.error(at, '`hooks` must be a `./` path inside the plugin');
    else if (!existsAs(target, 'file')) report.error(at, `\`hooks\` refers to missing ${overlay.hooks}`);
    else validateHooksFile(root, target, `${where}/${relative(root, target)}`, report);
  }
  if (overlay.interface !== undefined && !isObject(overlay.interface)) report.error(at, '`interface` must be an object');
}

function validateRemoteSource(source, at, report) {
  let url;
  try { url = new URL(source.url); } catch { report.error(at, 'remote source needs a valid `url`'); return; }
  if (url.protocol !== 'https:') report.error(at, 'remote source `url` must use https');
  if (url.username || url.password || url.search) report.error(at, 'remote source `url` must not carry credentials or a query');
  if (!/^[0-9a-f]{40}$/.test(source.sha ?? '')) report.error(at, 'remote sources must pin a full 40-character `sha` for review');
  if (source.source === 'git-subdir' && !isString(source.path)) report.error(at, '`git-subdir` sources need `path`');
}

/** Every remote entry needs a verification record whose pinned source matches. */
function validateCatalog(root, marketplace, report) {
  const at = 'catalog/plugins.json';
  const adapted = entry => {
    const source = isString(entry?.source) ? { source: 'local', path: entry.source } : entry?.source;
    const dir = isObject(source) && source.source === 'local' ? containedPath(root, source.path) : null;
    return Boolean(dir && existsAs(join(dir, 'UPSTREAM.md'), 'file'));
  };
  const remote = marketplace.plugins.filter(entry => (isObject(entry?.source) && entry.source.source !== 'local') || adapted(entry));
  const path = join(root, at);
  if (!existsAs(path, 'file')) {
    if (remote.length) report.error(at, 'missing; remote and adapted entries need verification records');
    return;
  }
  const catalog = readJson(path, at, report);
  if (!Array.isArray(catalog)) { if (catalog !== undefined) report.error(at, 'must be an array'); return; }
  const records = new Map(catalog.map(record => [record?.name, record]));
  if (records.size !== catalog.length) report.error(at, 'contains duplicate names');
  for (const entry of remote) {
    const record = records.get(entry.name);
    if (!record) { report.error(at, `no verification record for \`${entry.name}\``); continue; }
    if (JSON.stringify(record.source) !== JSON.stringify(entry.source)) report.error(at, `\`${entry.name}\` was verified against a different source; re-run the verification`);
    if (record.verification?.level !== 'fully_supported' || record.verification?.healthy !== true) report.error(at, `\`${entry.name}\` is not recorded as healthy and fully supported`);
  }
  const listed = new Set(remote.map(entry => entry.name));
  for (const name of records.keys()) if (!listed.has(name)) report.error(at, `\`${name}\` is not listed in the marketplace`);
}

/** Files a maintainer reviewed as containing only example or test credentials. */
function loadSecretAllowlist(root, report, at = 'catalog/secret-scan-allowlist.json') {
  if (!existsAs(join(root, at), 'file')) return new Set();
  const list = readJson(join(root, at), at, report);
  if (!Array.isArray(list) || !list.every(item => isString(item?.path) && isString(item?.reason) && item.reason.trim())) {
    report.error(at, 'must be an array of { path, reason } with a review reason');
    return new Set();
  }
  for (const item of list) if (!existsAs(join(root, item.path), 'file')) report.error(at, `${item.path} does not exist`);
  return new Set(list.map(item => item.path));
}

export function validateMarketplace(repoRoot) {
  const report = new Report();
  const root = resolve(repoRoot);
  const marketplace = readJson(join(root, MARKETPLACE_PATH), MARKETPLACE_PATH, report);
  if (marketplace === undefined) return report;
  if (!isObject(marketplace)) { report.error(MARKETPLACE_PATH, 'must be a JSON object'); return report; }
  if (!isString(marketplace.name) || !NAME_RE.test(marketplace.name)) report.error(MARKETPLACE_PATH, '`name` must be a lowercase identifier');
  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    report.error(MARKETPLACE_PATH, '`plugins` must be a non-empty array');
    return report;
  }
  const secretAllowlist = loadSecretAllowlist(root, report);
  const seen = new Set();
  const listedDirs = new Set();
  marketplace.plugins.forEach((entry, index) => {
    const at = `${MARKETPLACE_PATH} plugins[${index}]`;
    if (!isObject(entry)) { report.error(at, 'must be an object'); return; }
    if (!isString(entry.name) || !NAME_RE.test(entry.name)) report.error(at, '`name` must be a lowercase identifier');
    else if (seen.has(entry.name)) report.error(at, `duplicate plugin name \`${entry.name}\``);
    else seen.add(entry.name);
    if (entry.policy !== undefined) {
      if (!isObject(entry.policy)) report.error(at, '`policy` must be an object');
      else {
        if (entry.policy.installation !== undefined && !INSTALL_POLICIES.has(entry.policy.installation)) report.error(at, `unknown policy.installation \`${entry.policy.installation}\``);
        if (entry.policy.authentication !== undefined && !AUTH_POLICIES.has(entry.policy.authentication)) report.error(at, `unknown policy.authentication \`${entry.policy.authentication}\``);
      }
    }
    const source = isString(entry.source) ? { source: 'local', path: entry.source } : entry.source;
    if (!isObject(source)) { report.error(at, '`source` must be a `./` path or a source object'); return; }
    if (source.source === 'url' || source.source === 'git-subdir') { validateRemoteSource(source, at, report); return; }
    if (source.source !== 'local') { report.error(at, '`source.source` must be `local`, `url` or `git-subdir`'); return; }
    const dir = containedPath(root, source.path);
    if (!dir || !relative(root, dir).startsWith(`plugins${sep}`)) { report.error(at, 'local `path` must be `./plugins/<name>` inside this repository'); return; }
    if (!existsAs(dir, 'dir')) { report.error(at, `plugin directory ${source.path} is missing`); return; }
    listedDirs.add(dir);
    const where = relative(root, dir).split(sep).join('/');
    const vendored = !isAgentPlugin(dir);
    const files = walkPlugin(dir, where, report, vendored ? VENDOR_LIMITS : undefined);
    scanSecrets(files, dir, where, report, secretAllowlist);
    if (!vendored) {
      const manifest = validatePluginManifest(dir, where, report);
      if (manifest && isString(entry.name) && manifest.name !== entry.name) report.error(at, `name \`${entry.name}\` differs from plugin.json name \`${manifest.name}\``);
      validateSkills(dir, where, report);
      validateMcp(dir, where, report);
      validateOverlay(dir, where, report);
    } else {
      validateVendorManifest(dir, where, report, entry);
      validateUpstream(dir, where, report);
    }
  });
  validateCatalog(root, marketplace, report);
  const pluginsDir = join(root, 'plugins');
  if (existsAs(pluginsDir, 'dir')) {
    for (const name of readdirSync(pluginsDir)) {
      if (!listedDirs.has(join(pluginsDir, name))) report.warn(`plugins/${name}`, 'directory is not listed in the marketplace');
    }
  }
  return report;
}

/** Check the adapted packages published on the `packages` branch. */
export function validatePackages(repoRoot) {
  const report = new Report();
  const root = resolve(repoRoot);
  const allow = loadSecretAllowlist(root, report, 'secret-scan-allowlist.json');
  const pluginsDir = join(root, 'plugins');
  if (!existsAs(pluginsDir, 'dir')) { report.error('plugins', 'missing'); return report; }
  for (const name of readdirSync(pluginsDir).sort()) {
    const dir = join(pluginsDir, name);
    const where = `plugins/${name}`;
    if (!existsAs(dir, 'dir')) { report.error(where, 'must be a directory'); continue; }
    if (!NAME_RE.test(name)) report.error(where, 'directory name must be a lowercase identifier');
    const files = walkPlugin(dir, where, report, VENDOR_LIMITS);
    scanSecrets(files, dir, where, report, allow);
    validateUpstream(dir, where, report);
    // Skill-list packages have no manifest; their marketplace entry names the skills.
    const skills = existsAs(join(dir, 'skills'), 'dir') ? readdirSync(join(dir, 'skills')).map(skill => `./skills/${skill}`) : [];
    validateVendorManifest(dir, where, report, { strict: false, skills });
  }
  return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const packages = process.argv.includes('--packages');
  const args = process.argv.slice(2).filter(arg => arg !== '--packages');
  const root = args[0] ?? resolve(fileURLToPath(new URL('..', import.meta.url)));
  const report = packages ? validatePackages(root) : validateMarketplace(root);
  for (const warning of report.warnings) console.warn(`warning  ${warning}`);
  for (const error of report.errors) console.error(`error    ${error}`);
  console.log(`${report.errors.length} error(s), ${report.warnings.length} warning(s)`);
  process.exit(report.errors.length ? 1 : 0);
}
