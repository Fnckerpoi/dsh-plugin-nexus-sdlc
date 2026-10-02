// Read-only host-contract check; no installs, provider starts, Profile writes or model calls.
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';

const app = process.env.DSH_APP_DIR;
const profile = process.env.DSH_PROFILE_DIR;
assert.ok(app && profile, 'Set DSH_APP_DIR and DSH_PROFILE_DIR to the trusted installation and Profile.');
const boot = await import(pathToFileURL(join(app, 'node_modules/@deepseek-ai/dsh-app-boot/lib/index.js')));
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const manifest = await json(new URL('../package.json', import.meta.url));
const rows = yaml.load(await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8'))[0].insert;
assert.equal(boot.evaluatePluginCompatibility(manifest), undefined, 'DSH rejects declared peers');
const validated = [];
const checkedPackages = new Set();
const modules = new Map();
async function load(name) {
  if (modules.has(name)) return modules.get(name);
  let dir;
  for (const root of [profile, app]) {
    const candidate = join(root, 'node_modules', name);
    try { await access(join(candidate, 'package.json')); dir = candidate; break; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  assert.ok(dir, 'Missing required host capability: ' + name);
  const installed = await json(join(dir, 'package.json'));
  assert.equal(installed.version, manifest.peerDependencies[name], name);
  assert.equal(boot.evaluatePluginCompatibility(installed), undefined, name);
  const module = await import(pathToFileURL(join(dir, installed.main)));
  const schema = module.Config ?? module.default?.Config ?? module.resolveConfig;
  const info = { schema, module }; modules.set(name, info); checkedPackages.add(name); return info;
}
async function validate(list) {
  for (const row of list) {
    if (row.name === 'cordis:group') { await validate(row.config); continue; }
    assert.ok(Object.hasOwn(manifest.peerDependencies, row.name), 'Undeclared peer ' + row.name);
    const { schema } = await load(row.name);
    if (schema) schema(row.config ?? {}); else assert.equal(Object.keys(row.config ?? {}).length, 0);
    validated.push(row.id);
    if (row.config?.plugins) await validate(row.config.plugins);
  }
}
await validate(rows);
for (const name of Object.keys(manifest.peerDependencies)) await load(name);
// Official provider apply only registers its dormant instance; start() is never called.
const providers = [];
for (const row of rows.filter(row => row.name.includes('dsh-subagent-'))) {
  const { module } = await load(row.name);
  module.apply({ subagents: { registerProvider(provider) { providers.push(provider.name); return () => {}; } }, subprocess: {}, logger: { warn() {}, info() {}, debug() {}, error() {} } }, module.Config(row.config));
}
assert.deepEqual(providers.sort(), ['nexus-sdlc-claude-code', 'nexus-sdlc-codex']);
console.log(JSON.stringify({ runtimeVersion: boot.getDshRuntimeVersion(), presetId: 'nexus-sdlc', checkedPackages: checkedPackages.size, validatedRows: validated, dormantProviders: providers, limitations: ['No full Host activation, GUI interaction, model calls or authentication checks.'] }, null, 2));
