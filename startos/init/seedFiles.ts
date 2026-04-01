import { utils } from '@start9labs/start-sdk'
import { setServerName } from '../actions/setup/setServerName'
import { homeserverLogConfig } from '../fileModels/homeserver.log.config'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { mount } from '../utils'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  await homeserverLogConfig.merge(effects, {})

  if (kind === 'install') {
    const postgresPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 22,
    })

    // Generate initial synapse config with placeholder server name
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'synapse' },
      mount,
      'gen-config',
      (subc) =>
        subc.execFail(['/start.py', 'generate'], {
          env: {
            SYNAPSE_SERVER_NAME: 'placeholder.com',
            SYNAPSE_REPORT_STATS: 'no',
            SYNAPSE_CONFIG_DIR: '/data',
          },
        }),
    )

    await storeJson.merge(effects, {
      serverStarted: false,
    })

    // Must run after synapse generate, which creates signing_key_path, server_name
    await homeserverYaml.merge(effects, {
      database: { args: { password: postgresPassword } },
    })

    await sdk.action.createOwnTask(effects, setServerName, 'critical', {
      reason: i18n(
        'Choose the permanent address/URL of your Synapse Matrix server',
      ),
    })
  } else {
    await storeJson.merge(effects, {})
    await homeserverYaml.merge(effects, {})
  }
})
