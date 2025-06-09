import { resetAdmin } from '../actions/resetAdmin'
import { setServerName } from '../actions/setServerName'
import { sdk } from '../sdk'

export const setup = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await sdk.action.createOwnTask(effects, setServerName, 'critical', {
    reason: 'Choose the permanent address/URL of your Synapse Matrix server',
  })
  await sdk.action.createOwnTask(effects, resetAdmin, 'optional', {
    reason: 'Create a root admin user for your Synapse Matrix homeserver',
  })
})
