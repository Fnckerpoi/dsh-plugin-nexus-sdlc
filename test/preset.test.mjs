import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import semver from 'semver';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const text = readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8');
const rows = yaml.load(text)[0].insert;
const preset = rows.find(row => row.name === '@deepseek-ai/dsh-agent-preset');
const roles = preset.config.plugins.filter(row => row.name === '@deepseek-ai/dsh-tool-subagent');
function walk(list) { return list.flatMap(row => [row, ...(Array.isArray(row.config) ? walk(row.config) : []), ...(row.config?.plugins ? walk(row.config.plugins) : [])]); }

test('stable package and preset identities', () => {
  assert.equal(manifest.name, 'dsh-plugin-nexus-sdlc');
  assert.equal(preset.id, 'preset-nexus-sdlc'); assert.equal(preset.config.id, 'nexus-sdlc');
  assert.equal(manifest.private, undefined); assert.equal(manifest.license, 'MIT');
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml');
});
test('portable configuration contains no personal runtime, endpoint, model or credential', () => {
  assert.doesNotMatch(text, new RegExp('[/]Users[/]|[/]home[/]|127[.]0[.]0[.]1|localhost|10100|ClaudeThink|CODEX_HOME|ANTHROPIC_|api[_-]?key|auth[_-]?token', 'i'));
  for (const row of rows.filter(row => row.name.includes('dsh-subagent-'))) {
    assert.deepEqual(row.config.env, { ELECTRON_RUN_AS_NODE: '1' });
    assert.equal(row.config.model, undefined);
  }
});
test('preserved provider safety baseline', () => {
  assert.equal(rows.find(row => row.config?.providerName === 'nexus-sdlc-codex').config.permissionMode, 'never');
  assert.equal(rows.find(row => row.config?.providerName === 'nexus-sdlc-claude-code').config.permissionMode, 'plan');
});
test('four distinct roles target dedicated providers only', () => {
  assert.equal(roles.length, 4);
  assert.deepEqual(roles.map(row => row.config.toolName), ['subagent_claude_plan', 'subagent_codex_dev', 'subagent_claude_review', 'subagent_claude_distill']);
  const names = rows.filter(row => row.name.includes('dsh-subagent-')).map(row => row.config.providerName);
  for (const role of roles) { assert.ok(names.includes(role.config.provider)); assert.equal(role.config.backgroundMode, 'one-shot'); assert.equal(role.config.maxDepth, 'provider-managed'); }
});
test('every official plugin reference declares a host peer and rejects untested releases', () => {
  for (const row of walk(rows).filter(row => row.name.startsWith('@deepseek-ai/dsh-'))) assert.equal(manifest.peerDependencies[row.name], '0.2.0-rc.2');
  for (const [name, range] of Object.entries(manifest.peerDependencies)) {
    assert.ok(semver.satisfies('0.2.0-rc.2', range, { includePrerelease: true }));
    for (const version of ['0.1.7-rc.2', '0.2.0-rc.1', '0.2.0', '0.3.0']) assert.equal(semver.satisfies(version, range, { includePrerelease: true }), false);
    assert.equal(manifest.peerDependenciesMeta[name].optional, true);
  }
});
test('planning composition and goal tools exist without mutating Host/default preset', () => {
  const group = preset.config.plugins.find(row => row.id === 'planning');
  assert.equal(group.name, 'cordis:group'); assert.equal(group.isolate.planMode, true);
  assert.ok(group.config[0].config.section.trim());
  assert.ok(preset.config.plugins.some(row => row.name === '@deepseek-ai/dsh-command-goal'));
  assert.ok(preset.config.plugins.some(row => row.name === '@deepseek-ai/dsh-tool-goal'));
  assert.equal(rows.length, 3); assert.equal(rows.some(row => row.id === 'agent-preset-registry'), false);
});
test('no duplicate ids at each composition scope', () => {
  const check = list => { assert.equal(new Set(list.map(row => row.id)).size, list.length); for (const row of list) { if (Array.isArray(row.config)) check(row.config); if (row.config?.plugins) check(row.config.plugins); } }; check(rows);
});
test('published payload has a strict allowlist and no lifecycle scripts', () => {
  assert.deepEqual(manifest.files, ['cordis.patch.yml', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']);
  for (const hook of ['preinstall', 'install', 'postinstall', 'prepare', 'prepublishOnly']) assert.equal(manifest.scripts[hook], undefined);
  assert.equal(Object.keys(manifest.dependencies ?? {}).length, 0);
});
