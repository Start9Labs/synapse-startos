# TODO

Deferred from the Synapse feature review (`synapse-startos-migration-feature-gaps.md`),
whose phases 1 and 2 shipped together as `1.158.0:1`. Roughly in priority order.

## Resource protection

- [ ] **`user_ips_max_age` and `forgotten_room_retention_period`** — privacy and database
      hygiene. Low urgency: `user_ips_max_age` already defaults to a reasonable `28d`
      upstream, and only its privacy angle argues for a knob.

## Polish

- [ ] **`rc_federation`** — the one rate limit the Rate Limits action does not cover
      (`window_size`, `sleep_limit`, `sleep_delay`, `reject_limit`, `concurrent`). Shaped
      unlike the others, and inbound-federation tuning is a different problem from user
      rate limiting; give it its own variant or leave it to the hand-edit path.
- [ ] **`server_notices`** — an unleavable room the admin can announce into. The config
      block is small (`system_mxid_localpart` is the only required key), but notices are
      sent through the admin API, so it is only worth shipping alongside a way to send
      one. Check whether the bundled Ketesa exposes it before building the config half.
      `auto_join_mxid_localpart` is also still unexposed: without it the first user to
      register owns any auto-created room.
- [ ] **Appservice registration schema** — aliases and rooms namespaces, multiple regexes,
      `protocols`. For future bridges.

## Known rough edges

- [ ] **`chown -R 991:991 /data` runs on every start.** It only actually needs to run
      after install, after a restore, and after an import — StartOS mounts volumes
      root-owned, but Synapse's own writes are already correct once fixed. On a media
      store of tens of gigabytes it is a full recursive walk every boot: seconds on an
      SSD, considerably worse cold or on spinning disk. (An earlier note here said
      "minutes-long" unqualified; that was not measured.) The fix is a `pendingChown`
      flag in `store.json` set by init and by the import action, mirroring
      `pendingImport` — but it is startup-critical, so get the service on a real box
      before changing it.
- [ ] **"Set Admin Password" targets the first-registered user.** On an imported homeserver
      that is the oldest account, which is not necessarily the operator's admin. Consider
      taking a username, or reading the first user with `admin = true`.

## Deferred by decision

- **MatrixRTC / Element Call bundle** — `msc4140`, `msc4222`, `msc4143`, `msc4354`. Pure
  config flags with no migration constraint; ship as one "Element Call compatibility"
  toggle whenever we want it.
- **`enable_authenticated_media` toggle** — withdrawn. Upstream defaults it on and so do we;
  building a first-class toggle to keep an outdated client working is the wrong trade. The
  `homeserver.yaml` hand-edit path covers a genuine transition window.
- **Server-wide message retention** (`retention.*` + `purge_jobs`) — grouped with the
  hygiene settings in the review, but it does not belong with them. It deletes room history
  on a schedule for everyone on the server, upstream still labels it experimental, and the
  purge jobs are expensive. A home server's users generally want their history kept. If it
  is ever built it needs its own action with a warning, not a field in Config.
- **Encryption-disabling stack, custom Python `modules:`, workers/Redis, SSO/OIDC,
  CAPTCHA registration, S3 media storage, delegation (`server_name` ≠ served host)** — all
  deliberately out of scope; see the review document for the reasoning on each.
