# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `synapse`.** Two interfaces: `homeserver` (Matrix API) on host `main`, and `admin` (the bundled synapse-admin/Ketesa dashboard) on host `admin`. `startos/interfaces.ts` exports the host/interface id constants; look interfaces up by their **host id** with `sdk.host.getOwn` and find the interface inside the returned host's bindings.
- **Three vantage points on the `main` volume, and they are all different.** `sdk.volumes.main.subpath(x)` resolves to `/media/startos/volumes/main/x` for the JS runtime; a subcontainer sees the same file at `/data/x` (`mountpoint` in `utils.ts`); an operator over SSH sees it at `/media/startos/data/package-data/volumes/synapse/data/main/x`. `utils.ts` keeps the import paths **volume-relative** for exactly this reason — prefix them yourself. Writing a JS-side path into `homeserver.yaml` (or a `/data` path into a `copyFile`) fails silently or at Synapse startup.
- **Port 8448 is deliberately unbound, and that is a decision, not an omission.** Federation rides 443 via the always-on `.well-known/matrix/server` delegation nginx serves. 8448 would only ever catch peers holding a cached "no well-known" result — a 1-hour window (`WELL_KNOWN_INVALID_CACHE_PERIOD`) that only arises when importing a homeserver whose old host published no delegation, which `instructions.md` step 1 closes by having the operator publish one days before the cutover. Adding the binding back means a second interface and a router forward for every user, to cover a case the procedure already handles.
- **The import flow is deliberately split across an action and a oneshot.** `import-homeserver` is `only-stopped`, so it has no Postgres to restore into; standing one up inside the action would mean duplicating the daemon's cluster initialization. It validates and stages, sets `store.json.pendingImport`, and the `restore-import` oneshot — ordered before the `synapse` daemon — runs `pg_restore`. Don't "simplify" the restore back into the action.
- **`fileModels/importedHomeserver.yml.ts` has no `.catch()` anywhere, on purpose.** It is the one file model here that must fail rather than heal: defaulting a missing `macaroon_secret_key` would mint a fresh one and silently log out every user on the homeserver being imported.
- **The `coturn` dependency is returned from `setupDependencies` only while `store.json.turn` is set.** Declaring it unconditionally would show an unmet-dependency warning to every user who never asked for call relay. `jitsi-startos` is the reference implementation of coturn's consumer contract.
- **The synapse-admin (Ketesa) web UI is a Makefile ingredient**, not a container image — `make` downloads and unpacks the pinned release into `assets/synapse-admin` (checksum-verified) and nginx serves it. Bump `SYNAPSE_ADMIN_VERSION`/`SYNAPSE_ADMIN_CHECKSUM` in the `Makefile` together.
- **Dependent bridge services register appservices via `ensureAppserviceRegistration`** (exported from `startos/public.ts`), which mounts Synapse's volume read-only and creates a `register-appservice` task on Synapse. Treat that export and the appservice action inputs as a small API for dependents.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach synapse -n synapse-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `synapse-sub`, alongside `postgres-sub` and `nginx`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
