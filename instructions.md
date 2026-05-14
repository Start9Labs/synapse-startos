# Synapse

## Documentation

- [Synapse operator documentation](https://element-hq.github.io/synapse/latest) — upstream admin guide covering configuration, federation, modules, and tuning.
- [Element support documentation](https://docs.element.io/latest/element-support/) — guides for the Element client you'll most likely use to connect.

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

## Using Synapse

### Connecting a client

Open a Matrix client and use the address you set during setup as your homeserver URL. Recommended clients: [Element](https://element.io), [SchildiChat](https://schildi.chat), [FluffyChat](https://fluffychat.im).

> **Do not use Element X.** Despite the name it is a separate, immature application from Element and is not recommended for use against your homeserver.

### Admin Dashboard

The **Admin Dashboard** interface opens Ketesa. Log in with the admin credentials from setup. Create user accounts under the **Users** tab; the **Rooms** and **Federation** tabs cover the other day-to-day admin work. Avoid promoting regular users to server administrators.

### Actions

- **Set Admin Password** — generate a new admin password. Use it to rotate the password or recover if you've lost it.
- **Config** — registration on/off, federation on/off (with optional whitelist of allowed server domains), max upload size, and SMTP (system SMTP or custom credentials).
- **Get Access Token** — return a Matrix access token for a given username and password; useful for programmatic access. The service must be running.
- **Register / List / Delete Appservice** and **Create Bot User** — manage Matrix bridges (appservices) and the bot users they own.

### Federation

Federation is off by default. Turn it on through the **Config** action, optionally restricting it to a whitelist of allowed server domains. With federation on, your client's **Explore Public Rooms** can join rooms hosted on other Matrix servers (e.g. `#room:matrix.example.com`).

### Encryption and key backup

Matrix end-to-end encryption keys live on your devices. If you sign out everywhere without a backup you lose the ability to decrypt past messages. In your client's security settings:

- **Set up cross-signing** so device-to-device verification carries across all your sessions.
- **Set up Secure Backup** — your client encrypts your room keys and stores them on your Synapse server, unlocked with a Security Key or Security Phrase that you must save somewhere safe.

Your encrypted message history lives on the server; StartOS backups of the Synapse package include it along with media, keys, and configuration.
