import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { configDefaults, mount } from '../utils'
import { sdk } from '../sdk'
import { homeserverYaml } from '../fileModels/homeserver.yml'
import { homeserverLogConfig } from '../fileModels/homeserver.log.config'
import { store } from '../fileModels/store.json'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
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

    await store.write(effects, {
      adminUserCreated: false,
      serverStarted: false,
      smtp: {
        selection: 'disabled',
        value: {},
      },
    })
    await homeserverYaml.merge(effects, configDefaults)
    await homeserverLogConfig.merge(effects, {})
  },
})
