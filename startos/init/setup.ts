import { resetAdmin } from '../actions/resetAdmin'
import { setServerName } from '../actions/setServerName'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { sdk } from '../sdk'

export const setup = sdk.setupOnInit(async (effects, kind) => {
  const homeserver = await homeserverYaml
    .read((h) => ({
      server_name: h.server_name,
      public_baseurl: h.public_baseurl,
    }))
    .const(effects)

  if (!homeserver?.server_name || !homeserver.public_baseurl) {
    await sdk.action.createOwnTask(effects, setServerName, 'critical', {
      reason: 'Choose the permanent address/URL of your Synapse Matrix server',
    })
  }

  if (kind === 'install') {
    await sdk.action.createOwnTask(effects, resetAdmin, 'critical', {
      reason: 'Create a root admin user for your Synapse Matrix homeserver',
    })
  }
})
