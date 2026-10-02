# Nexus SDLC · Nexus 规范研发

A declarative DeepSeek Harness agent preset for spec-driven development: Claude Code planning/review/distillation and Codex implementation/testing, coordinated through a Chinese persona and four static delegation tools. No custom Host code or browser UI is shipped.

包名 `dsh-plugin-nexus-sdlc`、Preset ID `nexus-sdlc` 均不包含 DSH 版本号。兼容版本只在 [package.json](package.json) 的 `peerDependencies` 中声明。

## Compatibility / 兼容性

- Currently checked against DSH core **0.2.0-rc.2**. Desktop shell versions are not DSH core versions. Other core releases are intentionally not claimed compatible.
- Intended for a base-backed Web/Desktop Profile with the official filesystem, subprocess, job, command, agent and preset services. Shell tooling currently targets macOS/Linux; Windows is unverified.
- The two official provider packages must already be installed in the target Profile, with working native Claude Code/Codex configuration and authentication.
- DSH peers are marked optional for npm resolution **only** to avoid auto-installing a second harness/runtime. They remain required capabilities for this composition; DSH still checks their declared versions.
- Taskboard guidance applies when `dsh-taskboard` is available; this package neither installs the board nor enables its auto-sync or changes its settings. Without a board, report its absence and do not fabricate task operations.

## Install / 安装

Replace `desktop` with your own Profile. In Desktop, use its plugin manager if the CLI is not on PATH. Install missing prerequisites first:

```sh
dsh plugin --profile desktop add @deepseek-ai/dsh-subagent-codex@0.2.0-rc.2
dsh plugin --profile desktop add @deepseek-ai/dsh-subagent-claude-code@0.2.0-rc.2
dsh plugin --profile desktop add dsh-plugin-nexus-sdlc
```

Refresh/restart as your client requires, then select **Nexus 规范研发** (`nexus-sdlc`) for a new conversation. Installation does not change your default preset.

已有本地旧版 `nexus-sdlc-0-1-7-rc-2` 可以继续保留；本公开包使用新的稳定 ID 和独立 Provider 名，不覆盖旧版或 PTC。旧会话不会自动迁移；新会话请选新版，确认后再按需卸载旧版。不要同时重复安装本包的本地副本和 npm 副本。

## Workflow and tools / 工作流与工具

1. Clarify a Spec and testable acceptance criteria.
2. `subagent_claude_plan`: Claude Code planning.
3. `subagent_codex_dev`: implementation, tests and targeted fixes.
4. `subagent_claude_review`: evidence-based review, then re-review if needed.
5. `subagent_claude_distill`: durable knowledge only after review and user acceptance.

The main session also has shell/filesystem/search/job tools, `/goal`, goal tools and the official isolated planning controller. `/feedback` belongs to the Host rather than being duplicated by this bundle.

**This is prompt-guided coordination, not an automatic FSM.** It does not provide a live execution dashboard, guarantee that reviewers cannot write, or guarantee a successful external model call. It does not make review statements substitutes for actual test evidence. Delegation occurs only when the user authorizes it. If a required provider is unavailable, report the failure instead of claiming a role ran.

## Provider configuration and safety

Dedicated provider rows are `nexus-sdlc-provider-codex` and `nexus-sdlc-provider-claude-code`, registered as `nexus-sdlc-codex` and `nexus-sdlc-claude-code`. Codex uses `permissionMode: never`; Claude uses `permissionMode: plan`. These preserve the local preset safety baseline and do not bypass approvals or sandboxing. Native restrictions can still block implementation or distillation.

No personal paths, gateways, model aliases, credentials or CLI state are shipped. `ELECTRON_RUN_AS_NODE=1` is the only explicit environment value, for Electron-based launchers; it is not a credential. Model/authentication choices remain in your native configuration or explicit Profile overrides. Credential-like environment variables may be scrubbed by official providers; if your backend requires an explicit `env` overlay, configure it privately. Never commit secrets or put them in the public package.

需要自定义时，只覆盖上述独立 Provider 行的 `config.model`/`config.env` 等受支持字段；不要改共享的 `codex`/`claude-code` Provider，也不要无意修改其他会话的权限。安装 Profile 插件会影响同 Profile 的会话，建议先在隔离 Profile 验证。

## Verification / 验证

```sh
npm ci
npm test
# Optional: inspect actual installed DSH schemas and compatibility gate
DSH_APP_DIR="/path/to/dsh/installation" DSH_PROFILE_DIR="/path/to/profile" npm run test:host
npm pack --dry-run
```

Unit tests cover stable identity, absence of personal data, role binding, permission defaults, peer version boundaries and file scope. The host checker uses actual installed schemas and official compatibility matching; it makes no model calls and does not alter the Profile. Full external-provider execution and GUI behavior are not implied by schema checks. See [verification notes](https://github.com/Fnckerpoi/dsh-plugin-nexus-sdlc/blob/main/docs/verification.md).

## License / 许可

MIT. See [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md). Independently authored configuration, not an official DeepSeek product.
