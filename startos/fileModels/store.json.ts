import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, boolean } = matches

const shape = object({
  adminUserCreated: boolean.onMismatch(true),
  serverStarted: boolean.onMismatch(true),
  smtp: sdk.inputSpecConstants.smtpInputSpec.validator.onMismatch({
    selection: 'disabled',
    value: {},
  }),
})

export const store = FileHelper.json(
  { volumeId: 'main', subpath: '/store.json' },
  shape,
)
