# Synapse

## Documentation

- [Synapse operator documentation](https://element-hq.github.io/synapse/latest) — upstream admin guide covering configuration, federation, modules, and tuning.
- [Element documentation](https://docs.element.io/latest/) — guides for the Element client you'll most likely use to connect.

## What you get on StartOS

- A **Matrix homeserver** (Synapse) exposed as the **Homeserver** interface — the endpoint your Matrix client connects to.
- An **Admin Dashboard** interface running Ketesa (a Synapse-admin variant) for managing users, rooms, and federation.
- A bundled PostgreSQL sidecar; you do not configure a database.

## Getting set up

Synapse posts two critical tasks after install. You can't start the service until both are done.

1. Add a public clearnet domain to the Homeserver interface. This is the domain your users will see in their Matrix IDs (e.g. `@you:matrix.example.com`).
2. Run the **Choose the permanent address/URL of your Synapse Matrix server** task and pick the domain. **This choice is permanent** — it cannot be changed once Synapse starts for the first time, so choose carefully.
3. Run the **Create a root admin user for your Synapse Matrix homeserver** task. A username (`admin`) and a random password are generated and shown once — copy and save the password before dismissing. If you lose it, run the **Set Admin Password** action later to set a new one.
4. Start Synapse. On first start, the admin user is created with that password.

> Already running Matrix somewhere else? Stop after step 1 and follow **Importing an existing homeserver** below, which takes the place of steps 2 through 4.

## Importing an existing homeserver

You can move a Matrix homeserver you run elsewhere onto StartOS without anyone losing their account, their logged-in sessions, or their history. Import **before you start Synapse for the first time** — once this homeserver has an address of its own, there is nothing to import into.

You will need shell access to your StartOS server and to the machine the old homeserver runs on.

**1. A few days ahead, make the old server publish its address delegation.** Other homeservers find yours by fetching `https://<your-domain>/.well-known/matrix/server`. If your current server doesn't answer that, every server that talks to it has instead learned to connect on port 8448 — and remembers. Publishing the delegation now, while DNS still points at the old machine, teaches them the address your StartOS server will serve on, so nothing breaks when you move.

Check first:

```
curl -s https://<your-domain>/.well-known/matrix/server
```

If that returns `{"m.server": "<your-domain>:443"}`, you're done — skip to step 2. If it 404s, set `serve_server_wellknown: true` in the old server's `homeserver.yaml` and restart it. If your reverse proxy handles that path itself rather than passing it to Synapse, add it there instead, returning exactly that JSON with `Content-Type: application/json`.

Leave it running for at least a day before you migrate. Other servers cache the answer for about 24 hours, so this is what buys you a cutover with no federation gap.

**2. Shrink the media store.** Most of the disk on an established homeserver is cached copies of other servers' files, which are re-downloaded on demand. On the old server, check what you actually have:

```
du -sh media_store/local_content media_store/remote_content
```

If the remote half is large, purge it through the old server's admin API before you copy anything — it is often the difference between a few gigabytes and tens of them:

```
curl -X POST -H "Authorization: Bearer <admin-token>" \
  'https://<old-server>/_synapse/admin/v1/media/delete?before_ts=<unix-ms>'
```

**3. Stop the old homeserver and dump its database.** The dump has to be in PostgreSQL's custom format:

```
pg_dump -Fc -U <db-user> <db-name> > synapse.dump
```

**4. Add the old server's domain to the Homeserver interface.** It has to match byte for byte — every imported user ID ends in it. Point its DNS at your StartOS server and issue a certificate for it as you would for any other domain.

**5. Copy the old server's files onto the volume.** On your StartOS server, everything goes under:

```
/media/startos/data/package-data/volumes/synapse/data/main/
```

Place four things there:

| Path                     | What                                                                                    |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `import/homeserver.yaml` | The old server's `homeserver.yaml`                                                      |
| `import/synapse.dump`    | The dump from step 3                                                                    |
| `import/signing.key`     | The old server's `<server-name>.signing.key`                                            |
| `media_store/`           | The contents of the old server's `media_store` — copied straight in, not into `import/` |

**6. Run the Import Existing Homeserver action.** It checks the staged files, adopts the old server's address and secrets, and tells you what is missing if anything is.

**7. Start Synapse.** The database is restored on this first start. On a large homeserver that takes a while and the service will sit in **Starting** throughout — watch the logs. If the restore fails it rolls back cleanly, so you can fix the cause and start again.

**8. Sign in and check, then clear out `import/`.** Everyone's existing accounts and passwords work; nobody is logged out. Once you're satisfied, delete the `import/` directory — the database dump is dead weight from then on.

Two things worth knowing:

- The upstream database is very likely on an older PostgreSQL than the one shipped here. That direction is fine; a dump from a newer PostgreSQL than this package ships is not.
- If you skipped step 1, federation still recovers on its own — other servers re-check your address roughly an hour after the move — but events sent to you in the meantime arrive late.

## Using Synapse

### Connecting a client

Open a Matrix client and use the address you set during setup as your homeserver URL. Recommended clients: [Element](https://element.io), [SchildiChat](https://schildi.chat), [FluffyChat](https://fluffychat.im).

> **Do not use Element X.** Despite the name it is a separate, immature application from Element and is not recommended for use against your homeserver.

### Admin Dashboard

The **Admin Dashboard** interface opens Ketesa. Log in with the admin credentials from setup. Create user accounts under the **Users** tab; the **Rooms** and **Federation** tabs cover the other day-to-day admin work. Avoid promoting regular users to server administrators.

### Actions

- **Set Admin Password** — generate a new admin password. Use it to rotate the password or recover if you've lost it. Synapse restarts automatically to apply the new password; if it is stopped, the password is applied the next time you start it.
- **Config** — registration, federation, voice and video calls, presence, max upload size, and how long to keep other servers' media.
- **Import Existing Homeserver** — adopt a homeserver you run elsewhere. See above; only available before the first start.
- **Configure SMTP** — email notifications, using either your StartOS system SMTP settings or custom credentials.
- **Get Access Token** — return a Matrix access token for a given username and password; useful for programmatic access. The service must be running.
- **Register / List / Delete Appservice** — manage Matrix bridges (appservices). Create the user accounts a bridge needs from the **Users** tab of the Admin Dashboard.

### Federation

Federation is off by default. Turn it on through the **Config** action, optionally restricting it to a whitelist of allowed server domains. With federation on, your client's **Explore Public Rooms** can join rooms hosted on other Matrix servers (e.g. `#room:matrix.example.com`).

Other homeservers reach yours over the **Homeserver** interface on port 443. Your server publishes an address delegation telling them to use it, so there is no second port to open and nothing extra to forward.

### Voice and video calls

Matrix clients make calls directly between the two participants, which fails when both ends sit behind NAT or a strict firewall. Turning on **Voice and Video Calls** in the **Config** action makes Synapse offer clients a relay to fall back on.

The relay is the separate **Coturn** service — install and start it, and give it a public domain of its own, as its own instructions describe. Until you do, calls still work wherever a direct connection is possible.

### Keeping disk use down

An active homeserver caches every file its users see from other servers, and that cache is included in your StartOS backups. **Remote Media Retention** in the **Config** action puts an age limit on it. Anything purged is fetched again if someone opens it, so the only cost is a little bandwidth. Leaving it empty keeps everything forever, which is Synapse's own default.

### Encryption and key backup

Matrix end-to-end encryption keys live on your devices. If you sign out everywhere without a backup you lose the ability to decrypt past messages. In your client's security settings:

- **Set up cross-signing** so device-to-device verification carries across all your sessions.
- **Set up Secure Backup** — your client encrypts your room keys and stores them on your Synapse server, unlocked with a Security Key or Security Phrase that you must save somewhere safe.

Your encrypted message history lives on the server; StartOS backups of the Synapse package include it along with media, keys, and configuration.
