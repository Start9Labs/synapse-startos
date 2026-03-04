import { sdk } from '../sdk'
import { configDefaults, mount } from '../utils'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { homeserverLogConfig } from '../fileModels/homeserver.log.config'
import { storeJson } from '../fileModels/store.json'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

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

  await storeJson.write(effects, {
    adminUserCreated: false,
    serverStarted: false,
    smtp: {
      selection: 'disabled',
      value: {},
    },
  })
  await homeserverYaml.merge(effects, configDefaults)
  await homeserverLogConfig.merge(effects, {})
})
