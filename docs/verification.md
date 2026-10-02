# Release verification

## Scope

Public release is a separate, portable configuration bundle. The original local preset, its runtime directory, Profile, lockfile and sessions are not modified or included. The public preset ID is `nexus-sdlc`; dedicated provider names use `nexus-sdlc-*`.

## Checks performed

- `npm install --ignore-scripts --no-audit --no-fund`: installed only test dependencies; no runtime/credentials copied.
- `npm test`: 8 passing tests for identity, no personal paths/endpoints/models/credentials, provider safety baseline, four role mappings, exact peer version boundaries, planning/goal composition, unique row IDs and payload allowlist.
- `npm run test:host` against the trusted installed Desktop and Profile: DSH core `0.2.0-rc.2`, 13 official packages and 15 configured rows validated; both dedicated providers registered in a test harness without calling `start()`. The first fixture omitted schema defaults and failed on missing `disposeGraceMs`; it was corrected to apply the official `Config()` defaults, matching Loader behavior.
- npm dry-run and tarball content are checked before publication. The intended payload is only package.json, cordis.patch.yml, README.md, LICENSE and THIRD_PARTY_NOTICES.md.
- MIT attribution from the official DeepSeek tool/plan configuration patterns is preserved in THIRD_PARTY_NOTICES.md.

## Limits

Schema validation and dormant registration are not a full isolated Host activation or an end-to-end model workflow test. No Claude/Codex calls, login changes, live Profile installs or GUI tests are made by the test suite. Native model/authentication and supported platform payloads remain prerequisites. Windows is unverified. The exact peer requirement intentionally rejects other DSH releases until they are checked.

## Market destination

The currently installed `dshmarket` (1.66.8) uses the `awesome-dsh-plugin` catalog. Its submission rules require a repository at least one day old, one YAML entry under data/plugins, a real dsh.bundle patch and factual descriptions. A newly created repository cannot truthfully be described as already accepted.

Rules: https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md
