import { sdk } from './sdk'

export const homeserverPort = 8008
export const nginxPort = 80
export const adminPort = 8080
export const postgresUser = 'synapse' as const
export const postgresDb = 'synapse' as const

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
