import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { MCP_SCHEMA, PLUGIN_SCHEMA, validateMarketplace } from './validate.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

function fixture(t, { entry = {}, manifest = {}, files = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'kcoder-market-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const put = (path, body) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), typeof body === 'string' ? body : JSON.stringify(body));
  };
  put('.agents/plugins/marketplace.json', {
    name: 'fixture-market',
    plugins: [{ name: 'demo', source: './plugins/demo', ...entry }],
  });
  put('plugins/demo/plugin.json', { $schema: PLUGIN_SCHEMA, name: 'demo', version: '1.0.0', description: 'Demo', ...manifest });
  for (const [path, body] of Object.entries(files)) put(path, body);
  return root;
}

const errorsOf = root => validateMarketplace(root).errors.join('\n');

test('the published marketplace is valid', () => {
  const report = validateMarketplace(repoRoot);
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.warnings, []);
});

test('a minimal plugin passes', t => {
  assert.equal(errorsOf(fixture(t)), '');
});

test('plugin.json must use the Agent Plugins schema, a valid name and no unknown fields', t => {
  assert.match(errorsOf(fixture(t, { manifest: { $schema: 'https://example.test/x.json' } })), /\$schema must be/);
  assert.match(errorsOf(fixture(t, { entry: { name: 'Demo' }, manifest: { name: 'Demo' } })), /lowercase/);
  assert.match(errorsOf(fixture(t, { manifest: { skills: './skills' } })), /unknown field `skills`/);
});

test('marketplace and manifest names must agree', t => {
  assert.match(errorsOf(fixture(t, { manifest: { name: 'other' } })), /differs from plugin.json name/);
});

test('local sources cannot leave the plugins directory', t => {
  for (const source of ['../outside', './plugins/../..', '/etc', './scripts']) {
    assert.match(errorsOf(fixture(t, { entry: { source } })), /must be `\.\/plugins\/<name>`/, source);
  }
});

test('remote sources must be https and pinned to a full commit', t => {
  const remote = { source: 'url', url: 'https://github.com/example/plugin.git' };
  assert.match(errorsOf(fixture(t, { entry: { source: remote } })), /pin a full 40-character `sha`/);
  assert.match(errorsOf(fixture(t, { entry: { source: { ...remote, url: 'http://example.test/x.git', sha: 'a'.repeat(40) } } })), /must use https/);
  const pinned = { ...remote, sha: 'a'.repeat(40) };
  const record = { name: 'demo', source: pinned, verification: { level: 'fully_supported', healthy: true } };
  assert.equal(errorsOf(fixture(t, { entry: { source: pinned }, files: { 'catalog/plugins.json': [record] } })), '');
});

test('symlinks and secrets are rejected', t => {
  const root = fixture(t, { files: { 'plugins/demo/notes.txt': `token ghp_${'a'.repeat(36)}` } });
  symlinkSync('/etc/hostname', join(root, 'plugins/demo/link'));
  const errors = errorsOf(root);
  assert.match(errors, /symlinks are not allowed/);
  assert.match(errors, /GitHub token/);
  assert.match(errorsOf(fixture(t, { files: { 'plugins/demo/.env': 'A=1' } })), /credential-like files/);
});

test('skills need front matter with name and description', t => {
  assert.match(errorsOf(fixture(t, { files: { 'plugins/demo/skills/x/SKILL.md': '# no front matter' } })), /YAML front matter/);
  assert.match(errorsOf(fixture(t, { files: { 'plugins/demo/skills/x/SKILL.md': '---\nname: x\n---\n' } })), /needs `description`/);
  assert.match(errorsOf(fixture(t, { files: { 'plugins/demo/skills/x/README.md': 'x' } })), /needs SKILL.md/);
});

test('mcp.json follows the schema KCoder expands safely', t => {
  const mcp = servers => ({ 'plugins/demo/mcp.json': { $schema: MCP_SCHEMA, mcpServers: servers } });
  assert.match(errorsOf(fixture(t, { files: { 'plugins/demo/mcp.json': { mcpServers: {} } } })), /\$schema must be/);
  assert.match(errorsOf(fixture(t, { files: mcp({ s: { type: 'stdio', command: '${PLUGIN_ROOT}/bin' } }) })), /`command` is not expanded/);
  assert.match(errorsOf(fixture(t, { files: mcp({ s: { type: 'stdio', command: 'node', args: ['${PLUGIN_ROOT}/missing.mjs'] } }) })), /missing missing\.mjs/);
  assert.match(errorsOf(fixture(t, { files: mcp({ s: { type: 'stdio', command: 'node', cwd: '/tmp' } }) })), /`cwd` must stay/);
  assert.match(errorsOf(fixture(t, { files: mcp({ s: { type: 'streamable-http', url: 'http://example.test/mcp' } }) })), /must use https/);
  assert.match(errorsOf(fixture(t, { files: mcp({ s: { type: 'websocket' } }) })), /`type` must be/);
});

test('hooks are validated through the overlay that references them', t => {
  const hooks = body => ({
    'plugins/demo/.codex-plugin/plugin.json': { hooks: './hooks/hooks.json' },
    'plugins/demo/hooks/hooks.json': body,
  });
  assert.match(errorsOf(fixture(t, { files: hooks({ hooks: { SessionStart: [{ hooks: [{ type: 'command' }] }] } }) })), /needs `command`/);
  assert.match(errorsOf(fixture(t, { files: { 'plugins/demo/.codex-plugin/plugin.json': { hooks: '../hooks.json' } } })), /inside the plugin/);
  const orphan = validateMarketplace(fixture(t, { files: { 'plugins/demo/hooks/hooks.json': { hooks: {} } } }));
  assert.match(orphan.warnings.join('\n'), /ignored without/);
});

test('remote entries need a matching verification record', t => {
  const source = { source: 'url', url: 'https://github.com/example/plugin.git', sha: 'a'.repeat(40) };
  const record = { name: 'demo', source, verification: { level: 'fully_supported', healthy: true } };
  assert.match(errorsOf(fixture(t, { entry: { source } })), /remote and adapted entries need verification records/);
  assert.equal(errorsOf(fixture(t, { entry: { source }, files: { 'catalog/plugins.json': [record] } })), '');
  const moved = { ...record, source: { ...source, sha: 'b'.repeat(40) } };
  assert.match(errorsOf(fixture(t, { entry: { source }, files: { 'catalog/plugins.json': [moved] } })), /different source/);
  const partial = { ...record, verification: { level: 'partially_supported', healthy: true } };
  assert.match(errorsOf(fixture(t, { entry: { source }, files: { 'catalog/plugins.json': [partial] } })), /not recorded as healthy/);
  const extra = { ...record, name: 'ghost' };
  assert.match(errorsOf(fixture(t, { entry: { source }, files: { 'catalog/plugins.json': [record, extra] } })), /`ghost` is not listed/);
});

test('adapted plugins keep their manifest but need provenance and a record', t => {
  const files = {
    'plugins/demo/.claude-plugin/plugin.json': { name: 'demo-upstream' },
    'plugins/demo/UPSTREAM.md': `# Upstream\n\n- Project: https://github.com/example/demo\n- Commit \`${'c'.repeat(40)}\`\n`,
  };
  const root = fixture(t, { files });
  rmSync(join(root, 'plugins/demo/plugin.json'));
  assert.match(errorsOf(root), /remote and adapted entries need verification records/);
  const record = { name: 'demo', source: './plugins/demo', verification: { level: 'fully_supported', healthy: true } };
  mkdirSync(join(root, 'catalog'), { recursive: true });
  writeFileSync(join(root, 'catalog/plugins.json'), JSON.stringify([record]));
  assert.equal(errorsOf(root), '');
  writeFileSync(join(root, 'plugins/demo/UPSTREAM.md'), 'adapted from somewhere');
  assert.match(errorsOf(root), /upstream URL and the full commit/);
  rmSync(join(root, 'plugins/demo/.claude-plugin'), { recursive: true });
  assert.match(errorsOf(root), /no plugin manifest found/);
});
