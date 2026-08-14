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
- [ ] **Room- and user-directory privacy** — its own action, following the Rate Limits
      pattern: a Private / Normal / Public / Custom union rather than seven loose booleans.
      Keys: `allow_public_rooms_over_federation`,
      `allow_public_rooms_without_auth`, `enable_room_list_search`,
      `user_directory.{search_all_users,prefer_local_users,exclude_remote_users}`,
      `require_auth_for_profile_requests`, `limit_profile_requests_to_users_who_share_rooms`,
      `include_profile_data_on_invite`.
- [ ] **`admin_contact`**, **`server_notices`**, **`auto_join_rooms`** (+ `auto_join_mxid_localpart`,
      `autocreate_auto_join_rooms`), **`allow_guest_access`**.
- [ ] **Appservice registration schema** — aliases and rooms namespaces, multiple regexes,
      `protocols`. For future bridges.

## Known rough edges

- [ ] **`chown -R 991:991 /data` runs on every start.** Harmless on a fresh install,
      minutes-long on a homeserver with tens of gigabytes of media. Worth narrowing to the
      paths that actually need it, or making it conditional.
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
