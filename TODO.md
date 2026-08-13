# TODO

Deferred from the Synapse feature review (`synapse-startos-migration-feature-gaps.md`),
which shipped its Phase 1 as `1.158.0:1`. Roughly in priority order.

## Safe registration and resource protection

- [ ] **`registration_requires_token`.** Replace the Registration boolean with a three-state
      enum — Disabled / Invite only (`enable_registration: true` + `registration_requires_token: true`)
      / Open. Today "enabled" means fully open, unverified signup, because
      `enable_registration_without_verification` sits at `true` with no middle ground.
      `m.login.registration_token` is a stable Matrix UIA stage and the bundled Ketesa
      dashboard already ships the token-management UI, so this needs no custom code
      beyond the enum.
- [ ] **`msc3266`** (room summary API). The upstream playbook enables it by default and
      calls it mandatory for Element X. Not MatrixRTC — don't defer it with that bundle.
- [ ] **Log-level select.** `homeserver.log.config` is hardcoded to `INFO` and rewritten on
      every init, so unlike `homeserver.yaml` a hand-edit does not survive. The playbook
      defaults to `WARNING`.
- [ ] **`limit_remote_rooms`** (`enabled`, `complexity`, `complexity_error`,
      `admins_can_join`). Stops one user joining a room like Matrix HQ and flattening a
      home server. Complexity is `current_state_events / 500`.
- [ ] **Cache autotuning derived from box RAM** — `caches.global_factor`,
      `cache_autotuning.{max,target}_cache_memory_usage`, `min_cache_ttl`,
      `event_cache_size`. The playbook computes these from total RAM (`memtotal/8` capped
      at 2 GB max, `memtotal/16` capped at 1 GB target); StartOS knows the box's RAM, so
      derive rather than expose a knob.
- [ ] **Message / redaction / user-IP retention** — `retention.*` + `purge_jobs`,
      `redaction_retention_period`, `forgotten_room_retention_period`, `user_ips_max_age`.

## Polish

- [ ] **URL previews** — `url_preview_enabled` **plus** `url_preview_ip_range_blacklist`.
      Never ship the first without the second: on a StartOS box an open preview spider is
      an SSRF gun pointed at every other service on the LAN. Use the playbook's list, which
      is broader than the stock example.
- [ ] **`experimental_features.msc4028_push_encrypted_events`** — mobile push for encrypted
      messages.
- [ ] **`msc2409` + `msc3202`** — required for encrypted appservices (hookshot-style bridges).
- [ ] **`push.include_content`** — whether message bodies ride along in push notifications.
- [ ] **Rate-limit presets.** `rc_message`, `rc_joins`, `rc_invites`, `rc_login`,
      `rc_registration`, `rc_federation`. Bots and bulk operations hit the stock limits
      immediately. Prefer a Normal / Relaxed preset over nine number fields.
- [ ] **Room- and user-directory privacy** — `allow_public_rooms_over_federation`,
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
- **Encryption-disabling stack, custom Python `modules:`, workers/Redis, SSO/OIDC,
  CAPTCHA registration, S3 media storage, delegation (`server_name` ≠ served host)** — all
  deliberately out of scope; see the review document for the reasoning on each.
