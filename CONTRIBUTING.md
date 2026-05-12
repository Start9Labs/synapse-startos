# Contributing

This repo packages [Synapse](https://github.com/element-hq/synapse) for StartOS, with [Ketesa](https://github.com/etkecc/ketesa) (a Synapse-admin fork) as the bundled admin dashboard.

## Documentation — keep it in sync

- **`README.md`** — what this package is and how it's built (image, volumes, interfaces). For developers and AI assistants.
- **`instructions.md`** — the user-facing instructions packed into the `.s9pk` and shown on the **Instructions** tab in StartOS, for the person running the service.
- **`CONTRIBUTING.md`** — this file.
- **`CLAUDE.md`** — operating rules for AI developers working in this repo.

**Any code change that warrants it must update `README.md` and `instructions.md` in the same change** — a new or renamed action, an added or removed volume / port / interface / dependency, a changed default, a new limitation, any altered user-visible behavior. Don't defer: a package that ships with a stale README or stale instructions is not done, even if the code is perfect. Content rules live in the packaging guide: [Writing READMEs](https://docs.start9.com/packaging/writing-readmes.html) and [Writing Service Instructions](https://docs.start9.com/packaging/writing-instructions.html).

## Building

See the [StartOS Packaging Guide](https://docs.start9.com/packaging/) for environment setup, then:

```bash
npm ci    # install dependencies
make      # build the universal .s9pk
```

## Updating the upstream version

Synapse and Ketesa are versioned independently and bump separately.

**Synapse** runs from `ghcr.io/element-hq/synapse:v<version>`. To bump it:

1. Update `dockerTag` in `startos/manifest/index.ts` to the new `v<version>`.
2. Update `version` and `releaseNotes` in the file under `startos/versions/`, renaming it to the new version string. A *new* version file is only needed when the bump carries an `up`/`down` migration, or when you want the old release notes preserved in git history — see [Versions](https://docs.start9.com/packaging/versions.html).
3. Rebuild (`make`), sideload the `.s9pk`, and confirm it starts.
4. Review `README.md` and `instructions.md` for anything the bump changed.

**Ketesa** (the admin dashboard, formerly called synapse-admin) is *not* run as a container — its release tarball is downloaded by the `Makefile` via `SYNAPSE_ADMIN_VERSION` and the unpacked static assets are served by the package's own nginx sidecar on `adminPort`. To bump it:

1. Update `SYNAPSE_ADMIN_VERSION` in the `Makefile` to the new Ketesa release tag from `etkecc/ketesa`.
2. Rebuild and verify the **Admin Dashboard** interface still loads.

The container-port change Ketesa made at v53 (80 → 8080) does not apply here, because the static assets are served by our nginx, not the upstream container.

## How to contribute

1. Fork the repository and create a branch from `master`.
2. Make your changes — including the doc updates above.
3. Open a pull request to `master`.
