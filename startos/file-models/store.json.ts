import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, boolean, oneOf, literal, string, natural } = matches

const shape = object({
  adminUserCreated: boolean.onMismatch(true),
  serverStarted: boolean.onMismatch(true),
  // Have the sdk export a ts-matches type for smtp
  smtp: sdk.inputSpecConstants.smtpInputSpec.validator.onMismatch({
    selection: 'disabled',
    value: {},
  }),
})

export const store = FileHelper.json(
  { volumeId: 'main', subpath: '/store.json' },
  shape,
)
