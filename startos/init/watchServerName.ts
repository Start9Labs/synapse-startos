import { serverName, setServerName } from '../actions/setup/setServerName'
import { i18n } from '../i18n'
import { homeserverHostnames } from '../interfaces'
import { sdk } from '../sdk'

export const watchServerName = sdk.setupOnInit(async (effects) => {
  const name = await serverName.const(effects)
  const hostnames = (await homeserverHostnames(effects).const()) ?? []

  if (name && hostnames.includes(name)) {
    await sdk.action.clearTask(effects, `synapse:${setServerName.id}`)
    return
  }

  await sdk.action.createOwnTask(effects, setServerName, 'critical', {
    reason: name
      ? i18n(
          'Add ${name} back to the Homeserver interface. Synapse cannot start without its server name.',
          { name },
        )
      : i18n('Choose the permanent address/URL of your Synapse Matrix server'),
  })
})
