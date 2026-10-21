# Contributing and releases

Every push to `main` is released automatically (npm, GitHub release, docs on ziyara.vip). The version comes from the commit messages ([Conventional Commits](https://www.conventionalcommits.org)):

| Commit | Release |
|---|---|
| `feat: add UiTimeline sizes` | minor (0.1.0 → 0.2.0) |
| `fix: select closes on outside click` | patch |
| `docs:`, `chore:`, `refactor:`, `style:`, `perf:`, `build:` | patch |
| `feat!: rename prop tone to color` or a `BREAKING CHANGE:` footer | major |
| any type with scope `no-release`, e.g. `chore(no-release): fix typo` | no release |

While the library is 0.x, describe breaking changes with a plain `feat:` or `fix:` (they bump the minor or patch). Use `feat!:` or a `BREAKING CHANGE:` footer only when you intentionally release 1.0.0 or a new major: semantic-release will jump straight to the next major.

Work in a branch, open a pull request, merge with a squash commit whose title follows the table. CI (`ci.yml`) builds the library, validates the API metadata, dry-runs `npm pack` and builds the docs.

## Adding or changing a component
1. Edit `src/core/*` and `src/styles/*`.
2. Describe every prop, value, slot and event in `src/meta/<group>.js`. `npm run check` fails when a prop used by the render code is undocumented.
3. Add examples in `site/docs-data/examples/<group>.ts`.
4. `npm run build` regenerates `dist/manifest.json`, `llms.txt`, `llms-full.txt` and the types.

## One-time repository setup
Secrets (Settings → Secrets and variables → Actions): `NPM_TOKEN` (npm automation token with publish rights to `@ziyarago`), `ZIYARA_DEPLOY_KEY` (private key of the deploy user), `ZIYARA_KNOWN_HOSTS` (output of `ssh-keyscan -p <port> <host>`). Variables: `ZIYARA_DEPLOY_HOST`, `ZIYARA_DEPLOY_PORT`, and after the analytics are created `NUXT_PUBLIC_GA_ID`, `NUXT_PUBLIC_YM_ID`, `NUXT_PUBLIC_GOOGLE_VERIFICATION`, `NUXT_PUBLIC_YANDEX_VERIFICATION`. Server setup: see docs/DEPLOYMENT.md. Protect `main` (require the CI check). `GITHUB_TOKEN` is provided by Actions.
