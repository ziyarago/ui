# Publishing @ziyarago/ui

Releases are automatic: every push to `main` runs `.github/workflows/release.yml` (semantic-release). The version is derived from the commit messages, see `CONTRIBUTING.md`. It publishes two packages with the same version:

- `@ziyarago/ui` (this repository root)
- `@ziyarago/ui-mcp` (`packages/mcp`)

## One-time setup
1. Create the npm organization `@ziyarago` (npmjs.com, free for public packages) and turn on 2FA for every publisher.
2. Create an npm **automation** token with publish rights to `@ziyarago` and save it as the repository secret `NPM_TOKEN`.
3. The repository must be public for npm provenance (`--provenance`). Alternatively remove `--provenance` from `.releaserc.json`.
4. After the first publish you can switch to npm trusted publishing (OIDC) in each package's settings on npmjs.com and delete `NPM_TOKEN`.
5. Replace the placeholders in `package.json` if the repository name differs: `repository`, `bugs`, `author`.

Until `NPM_TOKEN` exists the release job only warns and skips the release.

## What a release does
Version bump in both `package.json` files, `CHANGELOG.md`, git tag `vX.Y.Z`, `npm run build` and `npm run check`, `npm publish` of both packages, GitHub release, deploy of the docs site (`deploy-docs.yml`).

## Local checks before a PR
```bash
npm run build      # dist/style.css, types, manifest.json, llms.txt
npm run check      # exports, adapters, types and API metadata agree
npm pack --dry-run # review the file list and size
```

## Versioning rules
- Slot names of page templates and the props listed in `src/meta` are public API; renaming them is a breaking change.
- CSS classes `zg-*` and variables `--zg-*` are public API; anything else is private.
- Pre-1.0: breaking changes ride on minor versions unless you deliberately release 1.0.0.
