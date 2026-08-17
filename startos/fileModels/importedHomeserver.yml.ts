import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { importConfigSubpath } from '../utils'

// The identity an existing homeserver carries with it, read out of the
// operator's old homeserver.yaml. Deliberately narrower than the package's own
// shape: everything StartOS manages — database, listeners, log_config,
// media_store_path, pid_file — stays at package defaults and is never taken
// from the imported file.
//
// No `.catch()` anywhere, unlike a normal file model: a missing macaroon key
// would silently log out every user on the imported server, so a file that
// doesn't carry a full identity must fail the read rather than heal into one.
const shape = z.object({
  server_name: z.string(),
  macaroon_secret_key: z.string(),
  form_secret: z.string(),
  old_signing_keys: z
    .record(z.string(), z.object({ key: z.string(), expired_ts: z.number() }))
    .optional(),
})

export const importedHomeserverYaml = FileHelper.yaml(
  { base: sdk.volumes.main, subpath: importConfigSubpath },
  shape,
)
