# Updating the upstream version

Synapse and Ketesa are versioned independently and bump separately. This package tracks both: Synapse as a Docker image, and Ketesa (the admin dashboard, formerly synapse-admin) as a release tarball downloaded at build time.

## Determining the upstream version

Two independent upstreams to check:

- **Synapse** — [element-hq/synapse](https://github.com/element-hq/synapse). Currently pinned via `dockerTag` in `startos/manifest/index.ts` (e.g. `ghcr.io/element-hq/synapse:v<version>`).

  ```
  gh release view -R element-hq/synapse --json tagName -q .tagName
  ```

- **Ketesa** — [etkecc/ketesa](https://github.com/etkecc/ketesa). Currently pinned via `SYNAPSE_ADMIN_VERSION` in the `Makefile`.

  ```
  gh release view -R etkecc/ketesa --json tagName -q .tagName
  ```

Compare each result against its current pin; if either has moved ahead, bump that upstream.

## Applying the bump

### Synapse

Synapse runs from `ghcr.io/element-hq/synapse:v<version>`.

- Update `dockerTag` in `startos/manifest/index.ts` to the new `v<version>`.

### Ketesa

Ketesa is _not_ run as a container — its release tarball is downloaded by the `Makefile` via `SYNAPSE_ADMIN_VERSION` and the unpacked static assets are served by the package's own nginx sidecar on `adminPort`.

- Update `SYNAPSE_ADMIN_VERSION` in the `Makefile` to the new Ketesa release tag from `etkecc/ketesa`.
- Update `SYNAPSE_ADMIN_CHECKSUM` to the SHA-256 of the new `ketesa.tar.gz`.

The container-port change Ketesa made at v53 (80 → 8080) does not apply here, because the static assets are served by our nginx, not the upstream container.
