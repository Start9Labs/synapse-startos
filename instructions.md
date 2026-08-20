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

Open a Matrix client and use the address you set during setup as your homeserver URL. Recommended clients: [Element](https://element.io), [Element X](https://element.io/app-for-productivity), [SchildiChat](https://schildi.chat), [FluffyChat](https://fluffychat.im).

### Admin Dashboard

The **Admin Dashboard** interface opens Ketesa. Log in with the admin credentials from setup. Create user accounts under the **Users** tab; the **Rooms** and **Federation** tabs cover the other day-to-day admin work. Avoid promoting regular users to server administrators.

### Actions

- **Set Admin Password** — generate a new admin password. Use it to rotate the password or recover if you've lost it. It asks you to confirm first, because it replaces the current password and restarts Synapse to apply the new one; if the service is stopped, the password is applied the next time you start it.
- **Config** — voice and video calls, presence, link previews, notification content, and log level.
- **Federation** — whether your server talks to other homeservers, which ones, and how large a room it will join.
- **Media** — upload limit, how large an image can be and still get a thumbnail, which thumbnail sizes are prepared, and how long other servers' files are kept.
- **Registration** — who may create an account, which rooms they join automatically, and whether guests may look around.
- **Import Existing Homeserver** — adopt a homeserver you run elsewhere. See above; only available before the first start.
- **Rate Limits** — how fast people may send messages, join rooms, invite others and sign in. Pick Normal or Relaxed; pick Custom if you want to set any of them yourself.
- **Discoverability** — what someone without an account can find out about your server. Pick Private, Normal or Public; pick Custom to decide each setting.
- **Email/SMTP** — email notifications, using either your StartOS system SMTP settings or custom credentials.
- **Get Access Token** — return a Matrix access token for a given username and password; useful for programmatic access. The service must be running.
- **Register / List / Delete Appservice** — manage Matrix bridges (appservices). Create the user accounts a bridge needs from the **Users** tab of the Admin Dashboard.

### Federation

Federation is off by default. Turn it on through the **Federation** action, optionally restricting it to a whitelist of allowed server domains. With federation on, your client's **Explore Public Rooms** can join rooms hosted on other Matrix servers (e.g. `#room:matrix.example.com`).

Other homeservers reach yours over the **Homeserver** interface on port 443. Your server publishes an address delegation telling them to use it, so there is no second port to open and nothing extra to forward.

### Letting other people sign up

The **Registration** action has three settings for who may sign up.

**Disabled** is the default and is right for most servers — you create accounts yourself from the **Users** tab of the Admin Dashboard.

**Invite Only** lets people register themselves, but only with a token you give them. Create tokens under **Registration Tokens** in the Admin Dashboard, where you can cap how many times each one may be used and give it an expiry date. Your invitee signs up through their normal Matrix client and pastes the token as the last step. Revoking a token stops any further signups with it.

**Open** lets anyone on the internet who can reach your server create an account. Expect spam and abuse accounts; on a home server there is rarely a good reason to choose it.

The same action sets which rooms a new account joins automatically — give the full alias, like `#welcome:matrix.example.com` — and whether guests may look around without an account, which is off and should almost always stay off.

### Staying out of trouble with very large rooms

Joining a huge public room makes your server download and keep its whole history, which on home hardware can take hours and fill the disk. **Large Room Protection** in the **Federation** action refuses joins above a size you choose.

The limit is a "complexity" number — roughly the room's size in units of 500 events, so 1 is a small room and 20 is a fairly large one. It starts at Synapse's own default of 1, which will turn away plenty of ordinary rooms, so raise it until the rooms you actually want work. It only applies the first time someone here joins a given room, and you as the admin are exempt: you can always join a room yourself and everyone else can then follow you in.

### Voice and video calls

Matrix clients make calls directly between the two participants, which fails when both ends sit behind NAT or a strict firewall. Turning on **Voice and Video Calls** in the **Config** action makes Synapse offer clients a relay to fall back on.

The relay is the separate **Coturn** service — install and start it, and give it a public domain of its own, as its own instructions describe. Until you do, calls still work wherever a direct connection is possible.

### Link previews and notification privacy

Two settings in the **Config** action decide how much your server does on your behalf.

**Link Previews** is off to begin with. Turn it on and a title, summary and thumbnail appear under links posted in chat. Your server fetches the page to build that, which means the site sees one request from your server rather than one from each person who saw the link. Your server will not follow links into private address ranges or to itself, so the fetcher cannot be pointed at anything else running on your network.

**Message Text in Notifications** is on. It puts the message itself in the push notification instead of just who sent it and where. Turn it off if you would rather nothing showed on a locked screen. Encrypted messages never include their text either way — only that something arrived.

### Who can find your server

By default a stranger can learn a certain amount about your homeserver without having an account on it — which public rooms it hosts, and, once they can see a room, who is in it.

The **Discoverability** action collapses that into one choice. **Private** stops your room list being published or searched, keeps the people-search to your own server, and hides display names and avatars from anyone who is not signed in and does not already share a room. **Public** does the opposite, and is what you want if you are running rooms you would like strangers to find and join. **Normal** leaves Synapse's own settings, which sit between the two.

**Custom** exposes all ten settings individually. The one most people go looking for is **Search All Local Users** — without it, searching for someone only finds people you already share a room with, which is rarely what you want on a small server where everyone knows each other.

### When people hit rate limits

Synapse deliberately slows anyone down who sends, joins, invites or signs in too fast. The stock settings assume a server open to strangers, and they are easy to trip: inviting a dozen people at once, or running a bot, will hit them.

The **Rate Limits** action has two ready-made choices. **Normal** is Synapse's own. **Relaxed** raises sending and joining to the values Start9 runs on its own server, which is usually the right pick for a server among people you know.

If none of those fit, **Custom** exposes every limit individually, starting from Synapse's values. Each has a _per second_ rate and a _burst_ — the burst is how many are allowed in quick succession before the slower sustained rate takes over.

### Pictures that will not load

Nearly always this is the client, not the server, and clearing that device's cache fixes it — in Element, **Settings → Help & About → Clear cache and reload**. A client that failed to fetch an image once will keep showing the failure from its own cache long after the cause is gone, so try this before changing anything on the server.

If it is every image on every device, or every image from one particular person, the **Media** action is where to look:

- **Largest Image to Thumbnail** is the usual culprit for "some photos never appear". Above this size Synapse prepares no thumbnail at all, and the client is left fetching the full original or showing nothing. Current phone cameras take 48-50 megapixel photos in their ordinary mode, which is past what Synapse allows on its own; this package raises the limit, and you can raise it further.
- **Thumbnails** decides which sizes are prepared. If images look soft rather than missing, this is why — a high-resolution phone screen given only a small thumbnail stretches it. **On Demand** always produces an exact fit, at the cost of processing each request and storing every size that gets asked for.

Both only apply to images uploaded after you change them, except **On Demand**, which also works on images already on your server.

### Keeping disk use down

An active homeserver caches every file its users see from other servers, and that cache is included in your StartOS backups. **Remote Media Retention** in the **Media** action puts an age limit on it. Anything purged is fetched again if someone opens it, so the only cost is a little bandwidth. Leaving it empty keeps everything forever, which is Synapse's own default.

### Encryption and key backup

Matrix end-to-end encryption keys live on your devices. If you sign out everywhere without a backup you lose the ability to decrypt past messages. In your client's security settings:

- **Set up cross-signing** so device-to-device verification carries across all your sessions.
- **Set up Secure Backup** — your client encrypts your room keys and stores them on your Synapse server, unlocked with a Security Key or Security Phrase that you must save somewhere safe.

Your encrypted message history lives on the server; StartOS backups of the Synapse package include it along with media, keys, and configuration.
