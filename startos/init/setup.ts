import { resetAdmin } from '../actions/resetAdmin'
import { setServerName } from '../actions/setServerName'
import { sdk } from '../sdk'

export const setup = sdk.setupOnInstall(async (effects) => {
  await Promise.all([
    sdk.action.createOwnTask(effects, setServerName, 'critical', {
      reason: 'Choose the permanent address/URL of your Synapse Matrix server',
    }),
    sdk.action.createOwnTask(effects, resetAdmin, 'critical', {
      reason: 'Create a root admin user for your Synapse Matrix homeserver',
    }),
  ])
})
