import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  adminUserCreated: z.boolean().catch(true),
  serverStarted: z.boolean().catch(true),
  smtp: sdk.inputSpecConstants.smtpInputSpec.validator.catch({
    selection: 'disabled' as const,
    value: {},
  }),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
