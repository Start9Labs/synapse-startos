import { resetAdmin } from '../actions/resetAdmin'
import { setServerName } from '../actions/setServerName'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const setup = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await sdk.action.createOwnTask(effects, setServerName, 'critical', {
    reason: i18n('Choose the permanent address/URL of your Synapse Matrix server'),
  })
  await sdk.action.createOwnTask(effects, resetAdmin, 'optional', {
    reason: i18n('Create a root admin user for your Synapse Matrix homeserver'),
  })
})
