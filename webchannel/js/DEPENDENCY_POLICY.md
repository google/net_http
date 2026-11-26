# Dependency policy and audit

## Policy

The library, demo and legacy compiler are three separate npm projects. Each
has its own `.npmrc` because npm does not inherit the parent's project config:

```ini
min-release-age=14
strict-allow-scripts=true
save-exact=true
```

Use npm 11.17 or newer; `devEngines.packageManager` checks this for project
commands. The package's Node runtime/browser requirements are independent of
these contributor requirements. No dependency currently has permission to run
an install script. The demo explicitly denies `fsevents@2.3.3`'s optional
install script, including on platforms where it might otherwise run. This
also avoids npm 11.17 treating that inactive macOS optional dependency as an
unreviewed script on Linux. macOS watcher behavior was not tested here.

`strict-allow-scripts` stops an install if a dependency introduces an unreviewed
install hook. Review the exact package/version and script before adding any
`allowScripts` permission. No blanket permission or age exclusion is configured.
Explicit project commands such as `npm run build`, and the project's `prepack`
hook, continue to run; this is not a sandbox for build tools.

## Installing and updating

From any of these three project directories:

```sh
npm run deps:install
```

This checks the lockfile before running `npm ci`. From `webchannel/js/`, the
check covers all three lockfiles; from `demo/` or `legacy/` it covers that
project. `npm run deps:check` runs the check without installing.

The npm release-age filter applies when resolving new versions. It does **not**
retroactively reject young versions already in a lockfile: on npm 11.17.0,
both `npm ci --dry-run` and `npm install --package-lock-only` accepted an
existing lockfile containing a two-day-old release with `min-release-age=14`.
Use the checked install command rather than relying on bare `npm ci` for this
property.

`scripts/check-dependency-age.mjs` needs only Node built-ins. It checks every
locked package, including transitive and optional packages for other platforms,
against registry publication times, canonical npm registry URLs and SHA-512
integrity metadata. Registry errors, absent dates and mismatches fail the check.
No package code is imported or executed by this check. It requires registry
access even if npm's download cache is populated.

The dependency CI runs this check **before** installing, then installs each
lockfile and runs `npm audit` and `npm audit signatures`. The Pages build checks
the demo lockfile before installing it. These workflows have been configured;
no GitHub Actions run was triggered as part of this change.

Keep direct dependencies exact and commit the lockfile changes. After an
update, run `npm run deps:check`, both audits and the affected tests/builds.
To refresh already locked transitive versions, resolve the candidate tree with
the age policy and review its diff; keeping an existing lockfile may keep its
previous selections. Do not assume `npm audit fix` necessarily selects a fix
that is old enough for the policy.

The default is **14 days**. Changing to 7 days requires editing the three
`.npmrc` files; the lockfile checker reads that setting. A release-age delay
also delays legitimate fixes. For an urgent security update, review the
specific release and make an explicit, reviewable policy change rather than
silently bypassing the check. This policy does not govern Node/npm bootstrap
downloads, Actions, or unrelated one-off tools.

This is a conservative policy with a concrete upstream recommendation:
[Renovate's maintainers recommend 14 days before automerging third-party dependencies](https://docs.renovatebot.com/upgrade-best-practices/#wait-two-weeks-before-automerging-third-party-dependencies).
It is not a universal industry default: Renovate's separate
[npm security preset uses 3 days](https://docs.renovatebot.com/presets-security/#securityminimumreleaseagenpm).
Those recommendations support a release delay and illustrate that the chosen
duration depends on the update/review policy; they do not measure adoption
rates or establish that most projects use two weeks. This repository also
checks transitive lockfile entries before installation, beyond an update bot's
wait before merging.

## Audit snapshot: 2026-11-26 (JST)

Audit performed with Node 26.4.0 and npm 11.17.0, against the public npm
registry. Registry publication metadata was fetched for 102 distinct package
names across the initial three lockfiles. The checked trees use only npm
registry tarballs and contain SHA-512 integrity for every locked dependency.

| Project | Locked dependency entries, all platforms | Known vulnerabilities | Installed registry signatures verified | Provenance attestations verified when present |
| --- | ---: | ---: | ---: | ---: |
| Library | 53 | 0 | 27 | 21 |
| Demo | 47 | 0 | 15 | 9 |
| Legacy Closure build | 30 | 0 | 28 | 0 |

`npm audit` returned zero at every severity before and after the age-policy
update. `npm audit signatures` reported no missing/invalid registry signatures
or invalid attestations among the installed packages. Some packages do not
publish provenance; a zero count in the legacy tree is not a claim of verified
source provenance. Signature verification covers the installed platform's
packages, while the age/integrity metadata check covers all lockfile entries.

The registry's latest tags were also resolved into a separate temporary
lockfile and audited, with lifecycle scripts disabled and without installing
or executing package code. That combined latest-tag tree had 115 dependency
entries and zero known vulnerabilities. This was an advisory/database audit,
not a source-code review or behavioral test of those latest versions.

| Direct dependency | Retained version | Latest tag seen | Decision |
| --- | --- | --- | --- |
| tsdown | 0.23.7 | 0.23.7 | Published 2026-11-06 UTC; meets 14-day policy |
| Vite | 8.3.8 | 8.4.0 | 8.4.0 was published on 2026-11-26 UTC; defer it |
| TypeScript | 5.9.3 | 7.0.2 | Latest was audited as metadata; a major compiler/API migration is outside this change |
| Closure Compiler | 20240317.0.0 | 20261123.0.0 | Preserve the pinned historical build; latest was published 2026-11-24 UTC |
| Closure Library | 20230802.0.0 | 20230802.0.0 | Preserve the reference compiler input |

The original trees contained versions younger than 14 days, including
`tinyexec@1.4.0` (published 2026-11-24 UTC). Direct versions were retained, and
the library/demo lockfiles were re-resolved using only eligible releases.
The legacy lockfile did not need version changes.

Representative transitive changes:

| Package / project | Previous | Policy-compliant selection |
| --- | --- | --- |
| rolldown / library | 1.3.3 | 1.3.2 |
| tinyexec / library | 1.4.0 | 1.3.1 |
| yuku / library | 0.28.1 | 0.28.0 |
| @rolldown/pluginutils / both | 1.1.1 | 1.1.0 |
| postcss / demo | 8.5.33 | 8.5.32 |
| source-map-js / demo | 1.2.4 | 1.2.2 |

The legacy tree includes deprecated `clone-buffer@1.0.0`. Its deprecation
notice is distinct from a reported vulnerability; it remains isolated in the
pinned, non-published Closure build dependencies. No runtime dependencies are
added to the distributed TypeScript client.

Validation after the policy update:

- All 130 locked entries passed the age/registry/integrity check. The previous
  lockfiles were rejected by the same check as a negative control.
- Clean installs succeeded for all three projects with strict script policy.
  A local, harmless postinstall fixture was rejected with
  `ESTRICTALLOWSCRIPTS` before its marker-file write could execute.
- `npm test`: 73 passed, including three dependency-policy regressions.
- `npm run typecheck`, `npm run build:demo`: passed.
- `npm run test:legacy`: 32 passed; rebuilt Closure output and the archived
  original retained their previous hashes.

These checks reduce exposure to newly published releases, unexpected install
hooks and known advisories. Registry signatures and provenance do not prove
that a maintainer's release is benign, and a 14-day-old release is not
automatically safe.

References: [npm release-age and script configuration](https://docs.npmjs.com/cli/v11/using-npm/config/),
[npm audit](https://docs.npmjs.com/cli/v11/commands/npm-audit/),
[package provenance verification](https://docs.npmjs.com/viewing-package-provenance/).
