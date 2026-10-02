# Release status · 1.0.0

## Published

- GitHub: https://github.com/Fnckerpoi/dsh-plugin-nexus-sdlc
- Initial source commit: `8e92ed93d1fef4edbf68bd4020ca65613db58b39`
- npm: https://www.npmjs.com/package/dsh-plugin-nexus-sdlc
- Version: `1.0.0`, public, published by `fnckerpoi` to the official registry.
- Official metadata: https://registry.npmjs.org/dsh-plugin-nexus-sdlc/1.0.0
- Verified tarball SHA-1: `44f2feb0a2cf8b4d236c7f764f9d77d98b10f062`
- Payload: five files, 7,335 bytes compressed / 17,966 bytes unpacked.
- Payload contains only package.json, cordis.patch.yml, README.md, LICENSE and THIRD_PARTY_NOTICES.md.

## Validation

- Unit tests: 8 passed, 0 failed.
- Trusted installed DSH contract check: core `0.2.0-rc.2`, 13 packages and 15 configured rows validated. Both dedicated providers register without starting child/model runs.
- `npm pack --dry-run` and actual tarball listing checked.
- Official registry metadata SHA-1 equals the verified local tarball.
- Independent install from the official npm registry with lifecycle scripts disabled: exit 0, exactly one package installed. Installed patch equals verified source.
- Catalog structural validation: 4,413 entries, zero problems at the checked base. Submission changes exactly one new YAML entry.
- Full model/provider execution, complete DSH Host activation and GUI interaction are not claimed tested.

## Market submission — not yet accepted

Current installed dshmarket uses the awesome-dsh-plugin catalog. Submitted PR: https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/6371

At submission inspection the PR was open, non-draft, mergeable; PR check was in progress. The source repository was created at `2026-10-02T05:38:54Z`, so its one-day age threshold is reached at `2026-10-03T05:38:54Z` (UTC+8: October 3, 13:38:54). The catalog normally rechecks age-blocked entries every six hours. Acceptance still requires the catalog checks and maintainer review; no approval or acceptance date is promised. Do not close/reopen or push empty commits merely for the age rule.

Catalog branch: `Fnckerpoi:submit-nexus-sdlc-entry`; source change: `data/plugins/Fnckerpoi__dsh-plugin-nexus-sdlc.yml`. The branch is based on an existing common ancestor so no unrelated workflow update or extra OAuth workflow permission is needed.

The old local preset, runtime, Profile and sessions are unchanged. The public preset has stable ID `nexus-sdlc` and dedicated provider names `nexus-sdlc-*`. Install official Claude Code/Codex provider prerequisites and configure their native authentication privately. Exact DSH compatibility is declared through peerDependencies, not encoded in names.
