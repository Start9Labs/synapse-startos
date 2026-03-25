import { homeserverLogConfig } from '../fileModels/homeserver.log.config'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { mount } from '../utils'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  await homeserverLogConfig.merge(effects, {})

  if (kind === 'install') {
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
      adminUserCreated: false,
      serverStarted: false,
    })
  } else {
    await storeJson.merge(effects, {})
  }

  // Must run after synapse generate on install (creates signing_key_path, server_name)
  await homeserverYaml.merge(effects, {})
})
