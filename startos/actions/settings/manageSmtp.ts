import { smtpPrefill } from '@start9labs/start-sdk'
import { storeJson } from '../../fileModels/store.json'
import { i18n } from '../../i18n'
import { sdk } from '../../sdk'

export const inputSpec = sdk.InputSpec.of({
  smtp: sdk.inputSpecConstants.smtpInputSpec,
})

export const manageSmtp = sdk.Action.withInput(
  // id
  'manage-smtp',

  // metadata
  async () => ({
    name: i18n('Configure SMTP'),
    description: i18n(
      'Add SMTP credentials so your homeserver can send email notifications.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Settings'),
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => ({
    smtp: smtpPrefill(await storeJson.read((s) => s.smtp).const(effects)),
  }),

  // the execution function
  async ({ effects, input }) => storeJson.merge(effects, { smtp: input.smtp }),
)
