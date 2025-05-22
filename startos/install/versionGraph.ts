import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { configDefaults, mount } from '../utils'
import { sdk } from '../sdk'
import { homeserverYaml } from '../fileModels/homeserver.yml'

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
          },
        }),
    )

    await homeserverYaml.merge(effects, configDefaults)
  },
})
