import { FileHelper, smtpShape, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  smtp: smtpShape,
  pendingAdminPassword: z.string().nullable().catch(null).default(null),
  turn: z.boolean().catch(false).default(false),
  // Set by the import action, consumed by the restore-import oneshot on the
  // next start — pg_restore needs the Postgres daemon the action can't run.
  pendingImport: z.boolean().catch(false).default(false),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
