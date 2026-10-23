# Updating the upstream version

Synapse is the wrapped application, tracked as a Docker image. Ketesa (the admin dashboard, formerly synapse-admin) is versioned independently and downloaded as a release tarball at build time; refresh it alongside a Synapse release or wrapper revision, not as the trigger for a release.

## Determining the upstream version

Check the application and bundled dashboard:

- **Synapse** — [element-hq/synapse](https://github.com/element-hq/synapse). Currently pinned via `dockerTag` in `startos/manifest/index.ts` (e.g. `ghcr.io/element-hq/synapse:v<version>`).

  ```
  gh api repos/element-hq/synapse/tags --paginate --jq '.[].name'
  ```

- **Ketesa** — [etkecc/ketesa](https://github.com/etkecc/ketesa). Currently pinned via `SYNAPSE_ADMIN_VERSION` in the `Makefile`.

  ```
  gh api repos/etkecc/ketesa/tags --paginate --jq '.[].name'
  ```

Select the newest stable tag from each list, excluding release candidates and other prereleases. Compare each against its current pin; bump Synapse when its artifact is published, and refresh Ketesa if needed alongside that release or an approved wrapper change. Synapse can publish a stable tag and image before creating a GitHub release; in that case, read `CHANGES.md` and `docs/upgrade.md` at that tag instead of relying on `gh release view`.

## Applying the bump

### Synapse

Synapse runs from `ghcr.io/element-hq/synapse:v<version>`.

- Update `dockerTag` in `startos/manifest/index.ts` to the new `v<version>`.

### Ketesa

Ketesa is _not_ run as a container — its release tarball is downloaded by the `Makefile` via `SYNAPSE_ADMIN_VERSION` and the unpacked static assets are served by the package's own nginx sidecar on `adminPort`.

- Update `SYNAPSE_ADMIN_VERSION` in the `Makefile` to the new Ketesa release tag from `etkecc/ketesa`.
- Update `SYNAPSE_ADMIN_CHECKSUM` to the SHA-256 of the new `ketesa.tar.gz`.

The container-port change Ketesa made at v53 (80 → 8080) does not apply here, because the static assets are served by our nginx, not the upstream container.
