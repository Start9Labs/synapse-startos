import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

export function hasInvalidProfilePrivacy(config: {
  require_auth_for_profile_requests?: boolean
  limit_profile_requests_to_users_who_share_rooms?: boolean
}) {
  return (
    config.limit_profile_requests_to_users_who_share_rooms === true &&
    config.require_auth_for_profile_requests !== true
  )
}

export const homeserverPort = 8008
export const nginxPort = 80
export const adminPort = 8080
export const postgresUser = 'synapse' as const
export const postgresDb = 'synapse' as const

export const psql = (
  effects: T.Effects,
  password: string,
  name: string,
  args: string[],
) =>
  sdk.SubContainer.withTemp(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of(),
    name,
    (pg) =>
      pg.execFail(
        [
          'psql',
          '-h',
          '127.0.0.1',
          '-U',
          postgresUser,
          '-d',
          postgresDb,
          ...args,
        ],
        { env: { PGPASSWORD: password } },
      ),
  )

export const accountStanding = async (
  effects: T.Effects,
  password: string,
  user: string,
) =>
  (
    await psql(effects, password, 'find-admin', [
      '-tAc',
      `SELECT CASE WHEN deactivated = 1 THEN 'deactivated' WHEN admin = 1 THEN 'admin' ELSE 'user' END FROM users WHERE name = '${sqlLiteral(user)}'`,
    ])
  ).stdout
    .toString()
    .trim()

export function sqlLiteral(s: string): string {
  return s.replace(/'/g, "''")
}

export const mountpoint = '/data'

// The identity `/start.py generate` mints on install, before the user picks a
// real one. Also the marker for "this homeserver has never been claimed".
export const placeholderServerName = 'placeholder.com'

// Where the operator stages an existing homeserver for the Import Existing
// Homeserver action. Volume-relative — prefix with `mountpoint` for the paths a
// subcontainer sees. `media_store/` is rsynced straight to its final home
// rather than staged here, because it is far too large to copy twice.
export const importSubpath = 'import'
export const importConfigSubpath = `${importSubpath}/homeserver.yaml`
export const importDumpSubpath = `${importSubpath}/synapse.dump`
export const importKeySubpath = `${importSubpath}/signing.key`

export const mount = sdk.Mounts.of().mountVolume({
  volumeId: 'main',
  subpath: null,
  mountpoint,
  readonly: false,
})

// The external Coturn package Synapse advertises to clients for TURN relay.
export const coturnId = 'coturn'
export const coturnVersionRange = '>=4.14.0:0'
export const coturnHostId = 'turn'
export const coturnInterfaceId = 'turn'
// Coturn publishes its shared secret at `shared/turn-secret` on its `main`
// volume. Mounting only that subpath read-only keeps the rest of the volume —
// turnserver.conf, the coturn database — out of view.
export const coturnMountpoint = '/mnt/coturn'
export const coturnSecretPath = `${coturnMountpoint}/turn-secret`
