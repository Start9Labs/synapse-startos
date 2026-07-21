# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `synapse`.** Two interfaces: `homeserver` (Matrix API) on host `main`, and `admin` (the bundled synapse-admin/Ketesa dashboard) on host `admin`. `startos/interfaces.ts` exports the host/interface id constants (`homeserverHostId`/`homeserverInterfaceId`, `adminHostId`/`adminInterfaceId`); look interfaces up by their **host id** with `sdk.host.getOwn` and find the interface inside the returned host's bindings.
- **The synapse-admin (Ketesa) web UI is a Makefile ingredient**, not a container image — `make` downloads and unpacks the pinned release into `assets/synapse-admin` (checksum-verified) and nginx serves it. Bump `SYNAPSE_ADMIN_VERSION`/`SYNAPSE_ADMIN_CHECKSUM` in the `Makefile` together.
- **Dependent bridge services register appservices via `ensureAppserviceRegistration`** (exported from `startos/public.ts`), which mounts Synapse's volume read-only and creates a `register-appservice` task on Synapse. Treat that export and the appservice action inputs as a small API for dependents.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach synapse -n synapse-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `synapse-sub`, alongside `postgres-sub` and `nginx`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
