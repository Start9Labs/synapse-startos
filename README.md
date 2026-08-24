<p align="center">
  <img src="icon.svg" alt="Synapse Logo" width="21%">
</p>

# Synapse on StartOS

> Everything not listed in this document should behave the same as upstream
> Synapse. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Synapse](https://github.com/element-hq/synapse) is the reference Matrix homeserver. This package bundles its database and an admin dashboard, wires a TURN relay in when you install one, and can adopt an existing homeserver — identity, accounts and history — rather than only starting an empty one.

- **Upstream repo:** <https://github.com/element-hq/synapse>
- **Wrapper repo:** <https://github.com/Start9Labs/synapse-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Three upstream images, unmodified, plus one asset fetched at build time.

| Property      | Value                                                               |
| ------------- | ------------------------------------------------------------------- |
| Images        | `ghcr.io/element-hq/synapse`, `nginx` (alpine), `postgres` (alpine) |
| Architectures | x86_64, aarch64                                                     |

**The admin dashboard is not an image.** The Makefile downloads a pinned synapse-admin release and verifies it against a committed SHA-256 before packing it as an asset; nginx then serves those static files. A checksum mismatch fails the build rather than shipping an unverified dashboard.

| Subcontainer         | Purpose                                                       |
| -------------------- | ------------------------------------------------------------- |
| `synapse-sub`        | The homeserver — the one to `attach` to                       |
| `postgres-sub`       | The bundled database, bound to loopback                       |
| `nginx`              | Serves both interfaces and proxies the Matrix API             |
| `gen-config`         | Temporary; the install-time `synapse generate`                |
| `pg-restore`         | Temporary; restores a staged import                           |
| `coturn-secret-read` | Temporary; reads Coturn's shared secret through its own mount |

Three oneshots bracket the daemons: `chown` hands `/data` to Synapse's uid, `restore-import` replays a staged database dump, and `apply-admin-password` applies a queued password once the homeserver answers.

**nginx is what the outside world reaches, not Synapse.** Both nginx server blocks are generated into the container's root filesystem at every start — so they track the current upload limit and cannot drift — and they serve the two `.well-known/matrix` documents Matrix federation and client discovery depend on. Synapse's own port is never published.

## Volume and Data Layout

Two volumes.

| Volume | Mount Point                      | Purpose                                                                                                                      |
| ------ | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `main` | `/data` (synapse)                | `homeserver.yaml`, the signing key, `media_store/`, appservice registrations, `store.json`, and the import staging directory |
| `db`   | `/var/lib/postgresql` (postgres) | The PostgreSQL data directory                                                                                                |

**The signing key on the `main` volume is the server's identity.** Losing it means other homeservers no longer recognise this one as the same server, and there is no way to regenerate it — federation history, room membership, and every user's identity are all tied to it.

`import/` on that volume is a staging area rather than live data — see [Import Existing Homeserver](#actions).

## File Models

Five models. Only two are ordinary configuration; the rest exist for specific jobs.

| File                     | Format | Modelled                | Written by                                    |
| ------------------------ | ------ | ----------------------- | --------------------------------------------- |
| `homeserver.yaml`        | YAML   | Yes — `FileHelper.yaml` | Install, every init, `main`, and most actions |
| `homeserver.log.config`  | YAML   | Yes                     | Every init, and the Config action             |
| `store.json`             | JSON   | Yes — `FileHelper.json` | Install, and several actions                  |
| `appservices/<id>.yaml`  | YAML   | Yes, one per appservice | The appservice actions                        |
| `import/homeserver.yaml` | YAML   | Read-only               | You, when staging an import                   |

Within `homeserver.yaml`:

**Enforced** — rewritten whenever the package writes: the whole database block (the bundled PostgreSQL on loopback), the listeners, the media store and pid paths, telemetry off, the key-server warning suppressed, and `log_config`.

**The connection pool is sized, not inherited.** `cp_min`/`cp_max` are pinned to 5/10, matching the upstream playbook. Left unset they fall through to Twisted's own class defaults of 3/5, which is nothing Synapse chose — and since every query runs in that pool, it is the only threadpool a monolith has.

**`log_config` is enforced rather than defaulted, and the distinction matters.** `synapse generate` writes its own `<server_name>.log.config` and points at that, which is a perfectly valid string — so a `.catch()` default would never fire, the package's log config would never be read, and the Config action's log level would be writing a file Synapse ignores.

**Generated once** — the signing key path, form secret, macaroon secret, and registration shared secret, all written by `synapse generate` at install or carried over by an import.

**Derived** — `turn_uris` and `turn_shared_secret`, rendered by `main` from the Coturn dependency. Absent when Coturn has no public domain yet, which Synapse reads as "advertise no relay" rather than as an error.

**Sized to the machine** — `caches.cache_autotuning`, defaulted to a quarter of system RAM and clamped between 1 and 2 GiB. Synapse evicts on whole-process allocated memory rather than cache size, so the threshold has to clear real usage; the clamp keeps it from being unreachable on a large machine, where an uncapped fraction would mean the guard never fires at all.

**Overridden defaults** — three keys where this package ships a value Synapse does not. Each is a starting point rather than an assertion: the Settings action that exposes it writes whatever you choose, and the form footnotes Synapse's own value beside it.

| Key                                   | Synapse default | Packaged value  | Why                                                                             |
| ------------------------------------- | --------------- | --------------- | ------------------------------------------------------------------------------- |
| `max_image_pixels`                    | `32M`           | `64M`           | Phone cameras shoot 48-50 MP; above the limit an image gets no thumbnail at all |
| `thumbnail_sizes`                     | up to 800x600   | up to 1920x1440 | A 3x-DPI phone display upscales the 800x600 and shows it soft                   |
| `caches.sync_response_cache_duration` | `2m`            | `5m`            | Mobile clients drop and re-issue the same `/sync` constantly                    |

`remote_media_download_per_second` and `remote_media_download_burst_count` are deliberately **not** overridden. They belong to Rate Limits, whose Normal preset means "write nothing, upstream applies" — so the raised value lives in that action's Relaxed preset instead of in the package default.

**A new thumbnail size only affects images uploaded after it is set.** Sizes are generated at upload; the exception is On Demand, which generates any size on request and is the only way an image already on disk gains one.

**Yours** — everything the seven Settings actions expose, plus anything you add by hand that the schema does not declare.

## Dependencies

One, optional, and only while you have switched TURN on.

| Dependency | Kind      | Health checks |
| ---------- | --------- | ------------- |
| `coturn`   | `running` | **none**      |

**No health check is declared, deliberately.** Coturn's own `TURN Server` check fails until you attach a public domain to it, and naming it here would leave Synapse showing a permanently unmet dependency even though Synapse serves fine without relay. Coturn's own check already says what is missing.

The shared secret is read through a throwaway container that mounts only Coturn's `shared` subpath read-only — so a missing or broken Coturn can never take Synapse's own daemons down, and the rest of Coturn's volume stays out of view.

## Network Access and Interfaces

Two interfaces, on separate hosts so they can carry separate domains.

| Interface       | Id           | Type | Port | Description                     |
| --------------- | ------------ | ---- | ---- | ------------------------------- |
| Homeserver      | `homeserver` | api  | 80   | Your Matrix homeserver instance |
| Admin Dashboard | `admin`      | ui   | 8080 | The synapse-admin web dashboard |

Neither is masked.

**The homeserver interface is the one that matters for identity and federation.** The permanent server name can be a public domain or a private HTTPS hostname exported by the Tailscale `url-v0` plugin on port 443. A public domain can federate; a private Tailnet hostname is for clients and agents on the same tailnet and should keep federation disabled. The `.well-known/matrix/server` and `.well-known/matrix/client` documents are served from it automatically.

**Port 8448 is deliberately not bound.** Federation rides 443 through the always-on `.well-known/matrix/server` delegation nginx serves, so the dedicated federation port would only ever catch peers holding a cached "no delegation" result — a one-hour window that arises only when importing a homeserver whose old host published none. Adding it back would mean a third interface and a router forward for every user, to cover a case the import procedure already closes.

## Installation and First-Run Flow

Install generates a Synapse configuration under a **placeholder server name** and raises a `critical` task to replace it. That placeholder is also the marker for "this homeserver has never been claimed", which is what the import action checks.

Two mutually exclusive paths from there, and **both are only available before the first start**:

1. **Set Server Address/URL** — claim a fresh homeserver under either its public domain or its private HTTPS Tailnet hostname.
2. **Import Existing Homeserver** — adopt a homeserver you run elsewhere, keeping its users, logins and history.

**The server name is permanent.** Matrix identity is `@user:server-name`, so changing it later orphans every account and every federated room; that is why both actions are `only-stopped` and why import disables itself with an explanation once a real name is set.

## Actions

Fourteen actions in four groups.

### Setup — Set Server Address/URL, Import Existing Homeserver

Both run only while the service is stopped, and both are effectively one-time.

- **Set Server Address/URL** is hidden — the install task is what surfaces it. It lists OS-managed domains plus private HTTPS Tailscale plugin addresses on port 443, revalidates that the selected address still exists, then writes the server name and public base URL. HTTP, Funnel, raw TCP and non-default-port plugin routes are rejected for Matrix identity.
- **Import Existing Homeserver** adopts a staged homeserver: its configuration, signing key, database and media. **It cannot be undone**, and it replaces the empty homeserver created at install.
  - **Staging happens on the volume, by you**, before running it — the action reads what it finds under `import/`.
  - **The media store is rsynced to its final home rather than staged twice**, because it is far too large to copy through a staging directory.
  - **The database is not restored by the action.** `pg_restore` needs the PostgreSQL daemon, which an action cannot run — so the action queues the work and the `restore-import` oneshot does it on the next start, inside a single transaction so a failure rolls back cleanly and the next start retries.
  - The action **hides itself** once the homeserver has a real server name, the same as Set Server Address/URL. It is only ever reachable before the first start: the critical `set-server-name` task keeps the service from starting until a real name is set, so there is never a populated homeserver to import over.

### Accounts — Set Admin Password, Get Access Token

- **Set Admin Password** works whether or not the service is running: the password is queued in `store.json` and applied by a oneshot once the homeserver answers. It carries a `warning`, so StartOS asks for confirmation first — the action generates a fresh password and restarts the homeserver, and the old password stops working.
- **Get Access Token** returns a token for an account, and needs the service running.

### Settings — Config, Federation, Media, Registration, Rate Limits, Discoverability, Email/SMTP

Seven forms over `homeserver.yaml`, all available whether or not the service is running, all applied by the restart they trigger.

- **Config** holds what is left once the rest were split out: call relay, presence, link previews, notification content, admin contact and log level.
- **Federation** governs which other homeservers yours will talk to — the on/off switch, the domain whitelist, and large-room protection. Turning federation off rewrites the listener resources rather than a flag, which is why this action and Config both write `listeners`.
- **Media** governs files: upload limit, the largest image that still gets a thumbnail, which thumbnail sizes are prepared, and how long other servers' media is kept. Three of its defaults depart from Synapse's — see [File Models](#file-models).
- **Registration** governs whether new accounts can be created, which rooms they land in, and whether guests may look around.
- **Rate Limits** tunes Synapse's throttles. Its Custom preset also carries `remote_media_download_per_second` and its burst — bytes rather than counts, and applied per requester, so they throttle one person's media fetching without touching anyone else's.
- **Discoverability** controls how visible the server and its rooms are to the wider network.
- **Email/SMTP** takes StartOS's system SMTP, your own server, or disabled. Email notifications and transport security are enforced on where the rest of that block is yours.

### App Services — Register Appservice, List Appservices, Delete Appservice

Appservices are how bridges and bots attach to a homeserver. Each is a registration file on the `main` volume with a pair of tokens.

- **Deleting one revokes that bridge's access**; the bridge stops working until it is registered again.
- **These are also driven by other packages.** A dependent calls this package's exported helper, which mounts Synapse's volume read-only, compares the tokens, and raises a `critical` Register Appservice task here when they do not match. So a Register Appservice task you did not create yourself is a bridge asking to be connected.

## Tasks

Two tasks, and only one of them originates here.

| Task                   | Severity   | Raised when                                               | Cleared when    |
| ---------------------- | ---------- | --------------------------------------------------------- | --------------- |
| Set Server Address/URL | `critical` | At install                                                | The action runs |
| Register Appservice    | `critical` | A dependent package's tokens don't match its registration | The action runs |

The first is `critical` because a homeserver on the placeholder name federates with nobody. The second is raised by another package rather than by this one, and re-raises whenever that package's tokens stop matching.

## Health Checks

Four checks, and the chain is strict — each daemon waits on the one before it.

| Check             | Displayed         | Method                           |
| ----------------- | ----------------- | -------------------------------- |
| `postgres`        | "Database"        | `pg_isready`                     |
| `synapse`         | "Homeserver"      | The homeserver's internal port   |
| `nginx`           | Hidden            | The proxy is listening           |
| `admin-interface` | "Admin Dashboard" | An HTTP request to the dashboard |

A service stuck starting is waiting further down the chain than the check you are reading — nginx waits on Synapse and on the queued-password oneshot, and Synapse waits on the database and on any pending import.

A homeserver that is green but not federating is almost always the server name and the attached domain disagreeing, or the `.well-known` documents not being reachable at the domain other servers look them up on. Neither shows up as a failed check here.

## Backups and Restore

Mixed, with one deliberate exclusion.

- **`db` is dumped, not copied** — a logical `pg_dump`, authenticating with the password out of `homeserver.yaml`.
- **`main` is copied wholesale except `import/`** — so the signing key, `homeserver.yaml`, the media store, appservice registrations and `store.json` all come back.
- **`import/` is excluded on purpose.** A staged migration is input to the import action, not homeserver data, and its dump is the size of the whole database — leaving it in would grow every backup until you cleared the directory out by hand.

**This backup contains the signing key**, which is the server's identity — treat it accordingly. Restore is complete: users, rooms, history and media all return, and clients keep working because the identity is unchanged.

## Limitations and Differences

1. **The server name is permanent.** Both setup actions are stopped-only, and import refuses once a real name is set. A private Tailnet setup therefore depends on retaining the chosen MagicDNS identity when the box is restored or replaced.
2. **Importing cannot be undone** and replaces the homeserver created at install.
3. **A staged import's database is restored on the next start**, not by the action itself.
4. **`import/` is never backed up.**
5. **Synapse's own port is not published** — nginx serves both interfaces and proxies to it.
6. **The admin dashboard is a pinned, checksummed static build**, not an upstream image, and it updates only when this package does.
7. **TURN is advertised only when Coturn has a public domain.** Until then no relay is offered, and nothing reports that as an error.
8. **The Coturn dependency declares no health check**, so a Coturn that is up but not yet publicly reachable will not block Synapse.
9. **The nginx configuration is regenerated every start** and is not editable.
10. **Tailnet mode is private, not federated.** It requires the Community Tailscale package, an HTTPS Serve route on port 443, and client devices signed in to the same tailnet.

---

## Quick Reference for AI Consumers

```yaml
package_id: synapse
image: ghcr.io/element-hq/synapse # plus nginx and postgres
architectures:
  - x86_64
  - aarch64
subcontainers:
  - synapse-sub # the homeserver; the one to attach to
  - postgres-sub # bundled database, loopback only
  - nginx # serves both interfaces, proxies the Matrix API
  - gen-config # temporary; install-time synapse generate
  - pg-restore # temporary; restores a staged import
  - coturn-secret-read # temporary; reads Coturn's shared secret
volumes:
  main: /data (synapse)
  db: /var/lib/postgresql (postgres)
file_models:
  - /data/homeserver.yaml
  - /data/homeserver.log.config
  - /data/store.json
  - /data/appservices/<id>.yaml
startos_managed_env_vars:
  - SYNAPSE_SERVER_NAME # gen-config only
  - SYNAPSE_REPORT_STATS # gen-config only
  - SYNAPSE_CONFIG_DIR # gen-config only
  - PGPASSWORD # pg-restore only
dependencies:
  - coturn # optional, running, no health checks; only while TURN is on
interfaces:
  homeserver: { type: api, port: 80 }
  admin: { type: ui, port: 8080 }
actions:
  - set-server-name # Setup; only-stopped, hidden (surfaced by the install task)
  - import-homeserver # Setup; only-stopped, self-hiding once claimed
  - set-admin-password # Accounts
  - get-access-token # Accounts; only-running
  - config # Settings
  - federation # Settings
  - media # Settings
  - registration # Settings
  - rate-limits # Settings
  - discoverability # Settings
  - manage-smtp # Settings; displayed "Email/SMTP"
  - register-appservice # App Services; also driven by dependent packages
  - list-appservices # App Services
  - delete-appservice # App Services
tasks:
  - { action: set-server-name, severity: critical }
  - { action: register-appservice, severity: critical } # raised by dependents
health_checks:
  - postgres # displayed "Database"
  - synapse # displayed "Homeserver"
  - nginx # hidden
  - admin-interface # displayed "Admin Dashboard"
```
